/**
 * Browser-only loader for the Places library of the Maps JavaScript API.
 *
 * Loaded on demand, the first time someone types in the street field, so the
 * rest of the site never pays for the script and a visitor who never reaches
 * the address costs nothing. Every failure resolves to null rather than
 * throwing: autocomplete is a convenience, and the street field has to keep
 * working as a plain input when the key is missing, the script is blocked or
 * Google is down.
 *
 * The types below are only the slice of the API the quote form uses, kept here
 * instead of pulling in @types/google.maps for four calls.
 */

import type { AddressComponent } from './address';

/** Public by design: the key is restricted to our domains in Google Cloud. */
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type FormattableText = { text: string };

export type PlacePrediction = {
  placeId: string;
  text: FormattableText;
  mainText: FormattableText | null;
  secondaryText: FormattableText | null;
  toPlace(): {
    fetchFields(options: { fields: string[] }): Promise<unknown>;
    addressComponents?: AddressComponent[] | null;
  };
};

export type SessionToken = object;

export type PlacesLibrary = {
  AutocompleteSessionToken: new () => SessionToken;
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: {
      input: string;
      sessionToken: SessionToken;
      includedRegionCodes: string[];
      includedPrimaryTypes: string[];
      locationBias: { center: { lat: number; lng: number }; radius: number };
    }): Promise<{ suggestions: { placePrediction: PlacePrediction | null }[] }>;
  };
};

type MapsGlobal = { maps: { importLibrary(name: 'places'): Promise<PlacesLibrary> } };

const CALLBACK = '__csrPlacesReady';

let pending: Promise<PlacesLibrary | null> | null = null;

export function placesEnabled(): boolean {
  return Boolean(API_KEY);
}

export function loadPlaces(): Promise<PlacesLibrary | null> {
  if (!API_KEY || typeof window === 'undefined') return Promise.resolve(null);
  if (pending) return pending;

  pending = new Promise<PlacesLibrary | null>((resolve) => {
    const w = window as unknown as Record<string, unknown> & { google?: MapsGlobal };
    const done = () => {
      w.google!.maps.importLibrary('places').then(resolve, () => resolve(null));
    };
    if (w.google?.maps?.importLibrary) {
      done();
      return;
    }
    w[CALLBACK] = done;
    const script = document.createElement('script');
    const params = new URLSearchParams({
      key: API_KEY,
      v: 'weekly',
      loading: 'async',
      libraries: 'places',
      callback: CALLBACK,
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.onerror = () => {
      // Let a later keystroke try again, in case it was a flaky connection.
      pending = null;
      resolve(null);
    };
    document.head.appendChild(script);
  });
  return pending;
}
