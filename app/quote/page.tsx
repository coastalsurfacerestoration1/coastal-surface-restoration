'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';

type QuoteFormValues = {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  /** Only used when `city` is OTHER_CITY. Never sent as its own field. */
  cityOther: string;
  state: string;
  zip: string;
  serviceType: string;
  description: string;
  /** Opt in for texts. Unchecked by default, and never required. */
  smsConsent: boolean;
  /**
   * Honeypot. Deliberately meaningless name: the old one, companyWebsite,
   * matched the heuristics password managers and autofill extensions use, so
   * they filled it and got real customers flagged as bots.
   */
  extraField: string;
};

const GENERIC_ERROR =
  'Something went wrong. Please try again or call us at 854-222-7790.';

const MAX_PHOTOS = 4;
/** Anything larger than this is rejected before we try to decode it. */
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
/** Long edge, in pixels, of the image we actually upload. */
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;

type Photo = { file: File; previewUrl: string };

/**
 * Shrinks a photo in the browser before it is uploaded.
 *
 * Phone cameras produce files in the multi-megabyte range and serverless
 * request bodies are capped well below four of those. 1600px on the long edge
 * is far more detail than is needed to judge a substrate and its condition,
 * and it puts a typical photo in the low hundreds of kilobytes.
 *
 * Anything the browser cannot decode, HEIC being the usual case, is returned
 * untouched and left for the server to accept or reject.
 */
async function downscale(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], 'photo.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

const OTHER_CITY = 'Other / not listed';

/**
 * Cities offered in the address dropdown.
 *
 * Deliberately not SERVICE_AREAS from lib/schema.ts: that list is the areas we
 * advertise, including neighborhoods like the Historic District that are not
 * mailing cities. This one has to match what a customer would write on an
 * envelope, so it lists municipalities and keeps an escape hatch for the rest.
 */
const ADDRESS_CITIES = [
  'Charleston',
  'Mount Pleasant',
  'North Charleston',
  'West Ashley',
  'James Island',
  'Johns Island',
  'Daniel Island',
  'Folly Beach',
  'Isle of Palms',
  "Sullivan's Island",
  'Summerville',
  OTHER_CITY,
];

/** Charleston tri-county ZIPs all begin 294. */
const LOCAL_ZIP_PREFIX = '294';

const services = [
  'Rust & Paint Removal',
  'Historic Property Restoration',
  'Marine Hardware Cleaning',
  'Brick & Masonry Cleaning',
  'Graffiti Removal',
  'Antique Hardware Restoration',
  'Vacation Rental Maintenance',
  'Other / Not Sure',
];

export default function QuotePage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState(GENERIC_ERROR);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoNotice, setPhotoNotice] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Object URLs live until they are revoked. Removing a photo revokes its own,
  // and this covers whatever is still on screen when the page unmounts.
  const photosRef = useRef<Photo[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(
    () => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl)),
    [],
  );

  const addPhotos = async (selected: FileList | null) => {
    if (!selected || selected.length === 0) return;

    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      // Reset here too, otherwise the rejected filename keeps sitting next to
      // the button as though it had been accepted.
      if (fileInputRef.current) fileInputRef.current.value = '';
      setPhotoNotice(`You can attach up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const incoming = Array.from(selected);
    const notices: string[] = [];
    if (incoming.length > room) {
      notices.push(`Only the first ${room} were added. ${MAX_PHOTOS} photos maximum.`);
    }

    const accepted = incoming.slice(0, room).filter((file) => {
      if (!file.type.startsWith('image/')) {
        notices.push(`${file.name} is not an image.`);
        return false;
      }
      if (file.size > MAX_SOURCE_BYTES) {
        notices.push(`${file.name} is too large to upload.`);
        return false;
      }
      return true;
    });

    // Clear the input either way, so the same file can be chosen again after
    // it has been removed from the list.
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (accepted.length === 0) {
      setPhotoNotice(notices.join(' '));
      return;
    }

    setOptimizing(true);
    const prepared = await Promise.all(
      accepted.map(async (file) => {
        const shrunk = await downscale(file);
        return { file: shrunk, previewUrl: URL.createObjectURL(shrunk) };
      }),
    );
    setOptimizing(false);

    setPhotos((current) => [...current, ...prepared].slice(0, MAX_PHOTOS));
    setPhotoNotice(notices.length > 0 ? notices.join(' ') : null);
  };

  const removePhoto = (index: number) => {
    setPhotos((current) => {
      const next = [...current];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
    setPhotoNotice(null);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuoteFormValues>({ defaultValues: { state: 'SC' } });

  const selectedCity = useWatch({ control, name: 'city' });
  const zip = useWatch({ control, name: 'zip' }) ?? '';
  // Soft signal only. An out of area job may still be worth taking, so this
  // never blocks the submission.
  const outOfArea = /^\d{5}$/.test(zip) && !zip.startsWith(LOCAL_ZIP_PREFIX);

  const onSubmit = async (data: QuoteFormValues) => {
    setStatus('loading');
    try {
      // Multipart, so the photos travel with the fields. The Content-Type
      // header is left off on purpose: the browser has to set it itself in
      // order to include the multipart boundary.
      const { city, cityOther, state, smsConsent, ...rest } = data;
      const payload = new FormData();
      for (const [key, value] of Object.entries(rest)) {
        payload.append(key, value ?? '');
      }
      payload.append('city', city === OTHER_CITY ? cityOther.trim() : city);
      payload.append('state', state.trim().toUpperCase());
      // Only sent when actually checked. The server treats presence as consent,
      // so an unchecked box must not arrive as "false".
      if (smsConsent) payload.append('smsConsent', 'yes');
      for (const photo of photos) {
        payload.append('photos', photo.file);
      }

      const res = await fetch('/api/quote', { method: 'POST', body: payload });
      if (!res.ok) {
        // The rate limiter is the one failure where retrying is the wrong
        // advice, so it gets its own message. A 400 is something the customer
        // can act on, usually a photo, so prefer the server's wording there.
        if (res.status === 429) {
          setErrorMessage(
            'That is a few requests in a short window. Give us a call at 854-222-7790 and we will pick it up from there.',
          );
        } else {
          const detail =
            res.status === 400
              ? await res
                  .json()
                  .then((parsed) => (typeof parsed?.error === 'string' ? parsed.error : null))
                  .catch(() => null)
              : null;
          setErrorMessage(detail ?? GENERIC_ERROR);
        }
        setStatus('error');
        return;
      }
      // Replace, not push: the back button should return the user to whatever
      // page led them to the form, not to a stale filled-in form they might
      // resubmit.
      router.replace('/thank-you');
    } catch {
      setErrorMessage(GENERIC_ERROR);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e273e] py-12 lg:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Free Estimates
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Request a Quote
          </h1>
          <p className="text-gray-400 text-lg">
            Tell us about your project and we will get back to you within 24 hours.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#1a3958] border border-[#397774]/30 rounded-lg p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-[#397774]">*</span>
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#397774] transition-colors"
              placeholder="John Smith"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-[#397774]">*</span>
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                type="email"
                className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#397774] transition-colors"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone <span className="text-[#397774]">*</span>
              </label>
              <input
                {...register('phone', {
                required: 'Phone is required',
                validate: (value) =>
                  /^[2-9]\d{2}[2-9]\d{6}$/.test(value.replace(/\D/g, '')) ||
                  'Enter a valid 10 digit phone number',
              })}
                type="tel"
                className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#397774] transition-colors"
                placeholder="843-555-0100"
                onInput={(e) => {
                  const input = e.currentTarget;
                  const val = input.value.replace(/\D/g, '').slice(0, 10);
                  input.value = val
                    .replace(/^(\d{3})(\d)/, '$1-$2')
                    .replace(/(\d{3})-(\d{3})(\d)/, '$1-$2-$3');
                }}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-2">
              Property Address <span className="text-[#397774]">*</span>
            </label>
            <input
              {...register('street', {
                required: 'Street address is required',
                validate: (value) =>
                  (/\d/.test(value) && /[A-Za-z]/.test(value)) ||
                  'Include a street number and street name',
              })}
              id="street"
              autoComplete="address-line1"
              className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#397774] transition-colors"
              placeholder="123 King Street"
            />
            {errors.street && (
              <p className="text-red-400 text-sm mt-1">{errors.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                City <span className="text-[#397774]">*</span>
              </label>
              <select
                {...register('city', { required: 'Please select a city' })}
                id="city"
                className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white focus:outline-none focus:border-[#397774] transition-colors"
              >
                <option value="">Select a city...</option>
                {ADDRESS_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                State <span className="text-[#397774]">*</span>
              </label>
              <input
                {...register('state', {
                  required: 'Required',
                  pattern: { value: /^[A-Za-z]{2}$/, message: 'Use 2 letters' },
                })}
                id="state"
                autoComplete="address-level1"
                maxLength={2}
                className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#397774] transition-colors uppercase"
              />
              {errors.state && (
                <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-300 mb-2">
                ZIP <span className="text-[#397774]">*</span>
              </label>
              <input
                {...register('zip', {
                  required: 'Required',
                  pattern: { value: /^\d{5}$/, message: '5 digits' },
                })}
                id="zip"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#397774] transition-colors"
                placeholder="29401"
              />
              {errors.zip && (
                <p className="text-red-400 text-sm mt-1">{errors.zip.message}</p>
              )}
            </div>
          </div>

          {selectedCity === OTHER_CITY && (
            <div>
              <label htmlFor="cityOther" className="block text-sm font-medium text-gray-300 mb-2">
                City name <span className="text-[#397774]">*</span>
              </label>
              <input
                {...register('cityOther', {
                  validate: (value, values) =>
                    values.city !== OTHER_CITY ||
                    value.trim().length > 1 ||
                    'Please enter the city',
                })}
                id="cityOther"
                autoComplete="address-level2"
                className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#397774] transition-colors"
                placeholder="Awendaw"
              />
              {errors.cityOther && (
                <p className="text-red-400 text-sm mt-1">{errors.cityOther.message}</p>
              )}
            </div>
          )}

          {outOfArea && (
            <p className="text-amber-400 text-sm" role="status">
              That ZIP looks outside our usual Charleston service area. Send it anyway and we
              will let you know if we can get to you.
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Service Type <span className="text-[#397774]">*</span>
            </label>
            <select
              {...register('serviceType', { required: 'Please select a service' })}
              className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white focus:outline-none focus:border-[#397774] transition-colors"
            >
              <option value="">Select a service...</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.serviceType && (
              <p className="text-red-400 text-sm mt-1">{errors.serviceType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Description <span className="text-[#397774]">*</span>
            </label>
            <textarea
              {...register('description', { required: 'Please describe your project' })}
              rows={5}
              className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#397774] transition-colors resize-none"
              placeholder="Describe what you need cleaned or restored. Include material type, approximate size, and any details that will help us give you an accurate quote."
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="photos" className="block text-sm font-medium text-gray-300 mb-2">
              Photos{' '}
              <span className="text-gray-500 font-normal">
                (optional, up to {MAX_PHOTOS})
              </span>
            </label>
            <p className="text-gray-500 text-xs mb-3">
              A clear photo of the surface tells us more than any description can. It is the
              fastest way to an accurate quote.
            </p>
            <input
              ref={fileInputRef}
              id="photos"
              type="file"
              accept="image/*"
              multiple
              disabled={photos.length >= MAX_PHOTOS}
              onChange={(e) => addPhotos(e.currentTarget.files)}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#397774] file:text-white file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-[#2a5c5a] disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {optimizing && (
              <p className="text-gray-400 text-sm mt-2" role="status">
                Preparing photos...
              </p>
            )}
            {photoNotice && (
              <p className="text-amber-400 text-sm mt-2" role="alert">
                {photoNotice}
              </p>
            )}

            {photos.length > 0 && (
              <ul className="grid grid-cols-4 gap-3 mt-4">
                {photos.map((photo, index) => (
                  <li key={photo.previewUrl} className="relative">
                    {/* Object URL for a file that never reaches the server as a
                        static asset, so next/image has nothing to optimize. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.previewUrl}
                      alt={`Attached photo ${index + 1}`}
                      className="aspect-square w-full object-cover rounded border border-[#397774]/40"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      aria-label={`Remove photo ${index + 1}`}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#0e273e] border border-[#397774]/60 text-gray-300 text-xs leading-none hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-[#397774]/20 pt-5">
            <label htmlFor="smsConsent" className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('smsConsent')}
                id="smsConsent"
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#397774] cursor-pointer"
              />
              <span className="text-gray-400 text-sm leading-relaxed">
                Text me about this quote. Message and data rates may apply. Reply STOP to opt
                out at any time. Leaving this unchecked will not affect your quote.
              </span>
            </label>
          </div>

          {/* Honeypot. Off-screen and out of the tab order, so the ordinary way
              it gets filled is a script filling every input it finds.
              The data-* attributes are the documented opt-outs for 1Password,
              LastPass, Dashlane and Bitwarden. autoComplete="off" alone is not
              enough: extensions routinely ignore it, and one of them filling
              this field is what made real quotes look like bot traffic. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="extraField">Leave this field empty</label>
            <input
              {...register('extraField')}
              id="extraField"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              data-1p-ignore=""
              data-lpignore="true"
              data-form-type="other"
              data-bwignore="true"
            />
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-sm" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || optimizing}
            className="w-full bg-[#397774] text-white py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Request Free Quote'}
          </button>

          <p className="text-gray-500 text-xs text-center">
            We respond within 24 hours. Serving Charleston and the Lowcountry.
          </p>
        </form>
      </div>
    </div>
  );
}