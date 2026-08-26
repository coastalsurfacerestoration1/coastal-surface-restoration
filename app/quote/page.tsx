'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type FormData = {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        // The rate limiter is the one failure where retrying is the wrong
        // advice, so it gets its own message.
        setErrorMessage(
          res.status === 429
            ? 'That is a few requests in a short window. Give us a call at 854-222-7790 and we will pick it up from there.'
            : GENERIC_ERROR,
        );
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
            disabled={status === 'loading'}
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