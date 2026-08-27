'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type QuoteFormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  serviceType: string;
  description: string;
  /** Honeypot. Hidden from people, so anything in it came from a script. */
  companyWebsite: string;
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
    formState: { errors },
  } = useForm<QuoteFormValues>();

  const onSubmit = async (data: QuoteFormValues) => {
    setStatus('loading');
    try {
      // Multipart, so the photos travel with the fields. The Content-Type
      // header is left off on purpose: the browser has to set it itself in
      // order to include the multipart boundary.
      const payload = new FormData();
      for (const [key, value] of Object.entries(data)) {
        payload.append(key, value ?? '');
      }
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
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
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
                {...register('phone', { required: 'Phone is required' })}
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Property Address <span className="text-[#397774]">*</span>
            </label>
            <input
              {...register('address', { required: 'Address is required' })}
              className="w-full bg-[#0e273e] border border-[#397774]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#397774] transition-colors"
              placeholder="123 King Street, Charleston, SC 29401"
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

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

          {/* Honeypot. Off-screen and out of the tab order, so the only way
              it gets filled is a script filling every input it finds. The
              API drops those submissions silently. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="companyWebsite">Company website</label>
            <input
              {...register('companyWebsite')}
              id="companyWebsite"
              type="text"
              tabIndex={-1}
              autoComplete="off"
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