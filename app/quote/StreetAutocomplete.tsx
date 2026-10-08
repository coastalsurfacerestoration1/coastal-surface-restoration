'use client';

import { useEffect, useRef, useState, type ComponentPropsWithRef } from 'react';
import { parseAddressComponents, type ParsedAddress } from '@/lib/address';
import { loadPlaces, type PlacePrediction, type PlacesLibrary, type SessionToken } from '@/lib/google-places';

/** Downtown Charleston. Results lean toward the tri-county without excluding the rest. */
const CHARLESTON = { lat: 32.7765, lng: -79.9311 };
/** Metres. 50 km is the most a location bias accepts, and covers Summerville to Edisto. */
const BIAS_RADIUS = 50000;
const MIN_CHARS = 3;
const DEBOUNCE_MS = 200;

type Props = ComponentPropsWithRef<'input'> & {
  /** Called with the parsed fields once a suggestion is picked. */
  onPick: (address: ParsedAddress) => void;
  /** Called with the suggestion's own text when Google has no street number for it. */
  onPickUnparsed: (text: string) => void;
  /** The customer chose to type the address themselves. No lookups while set. */
  manual?: boolean;
};

/**
 * The street input with Google address suggestions under it.
 *
 * It stays an ordinary input the whole time. The form's own register props
 * pass straight through, so validation, browser autofill and submission work
 * exactly as before, and with no key configured or the script blocked nothing
 * changes at all. Suggestions are a list we render ourselves rather than
 * Google's widget, so it matches the form and fills our separate City, State
 * and ZIP fields instead of one combined address box.
 *
 * Billing is per session: every keystroke shares one token, and fetching the
 * picked place's details closes it, so a whole lookup is billed once.
 */
export default function StreetAutocomplete({ onPick, onPickUnparsed, manual = false, onChange, onBlur, onKeyDown, ...inputProps }: Props) {
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const places = useRef<PlacesLibrary | null>(null);
  const token = useRef<SessionToken | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Answers can arrive out of order. Only the newest query's may land.
  const latest = useRef(0);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const listId = `${inputProps.id ?? 'street'}-suggestions`;
  const showList = !manual && open && suggestions.length > 0;

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const lookup = (input: string) => {
    const query = ++latest.current;
    if (input.trim().length < MIN_CHARS) {
      setSuggestions([]);
      return;
    }
    loadPlaces()
      .then(async (lib) => {
        if (!lib) return;
        places.current = lib;
        token.current ??= new lib.AutocompleteSessionToken();
        const { suggestions: found } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: token.current,
          includedRegionCodes: ['us'],
          includedPrimaryTypes: ['street_address', 'premise', 'subpremise'],
          locationBias: { center: CHARLESTON, radius: BIAS_RADIUS },
        });
        if (query !== latest.current) return;
        setSuggestions(found.flatMap((s) => (s.placePrediction ? [s.placePrediction] : [])).slice(0, 5));
        setActive(-1);
        setOpen(true);
      })
      // A rejected key or a network error just means no suggestions. The
      // customer can still type the address in full.
      .catch(() => {
        if (query === latest.current) setSuggestions([]);
      });
  };

  const pick = async (prediction: PlacePrediction) => {
    close();
    setSuggestions([]);
    latest.current++;
    try {
      const place = prediction.toPlace();
      await place.fetchFields({ fields: ['addressComponents'] });
      const parsed = parseAddressComponents(place.addressComponents ?? []);
      if (parsed) onPick(parsed);
      else onPickUnparsed(prediction.mainText?.text ?? prediction.text.text);
    } catch {
      onPickUnparsed(prediction.mainText?.text ?? prediction.text.text);
    } finally {
      // The details fetch ended this session. The next lookup starts a new one.
      token.current = null;
    }
  };

  return (
    <div className="relative">
      <input
        {...inputProps}
        role="combobox"
        aria-autocomplete={manual ? 'none' : 'list'}
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        onChange={(e) => {
          onChange?.(e);
          const value = e.currentTarget.value;
          if (timer.current) clearTimeout(timer.current);
          if (manual) return;
          timer.current = setTimeout(() => lookup(value), DEBOUNCE_MS);
        }}
        onBlur={(e) => {
          onBlur?.(e);
          close();
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!showList) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => (i + 1) % suggestions.length);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
          } else if (e.key === 'Enter' && active >= 0) {
            // Picks the highlighted address instead of submitting the form.
            e.preventDefault();
            void pick(suggestions[active]);
          } else if (e.key === 'Escape') {
            close();
          }
        }}
      />
      {showList && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded border border-[#397774]/60 bg-[#0e273e] shadow-lg">
          <ul id={listId} role="listbox">
            {suggestions.map((s, i) => (
              <li
                key={s.placeId}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                // mousedown, not click, so the pick lands before the input's
                // blur closes the list.
                onMouseDown={(e) => {
                  e.preventDefault();
                  void pick(s);
                }}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer px-4 py-3 text-sm ${i === active ? 'bg-[#397774]/30' : ''}`}
              >
                <span className="text-white">{s.mainText?.text ?? s.text.text}</span>
                {s.secondaryText && (
                  <span className="ml-2 text-gray-400">{s.secondaryText.text}</span>
                )}
              </li>
            ))}
          </ul>
          {/* Google requires attribution wherever its suggestions show
              without a map. */}
          <p className="border-t border-[#397774]/30 px-4 py-1.5 text-right text-xs text-gray-500">
            Suggestions from Google Maps
          </p>
        </div>
      )}
    </div>
  );
}
