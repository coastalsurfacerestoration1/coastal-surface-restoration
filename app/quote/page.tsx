'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  serviceType: string;
  description: string;
};

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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
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
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Free Estimates
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Request a Quote
          </h1>
          <p className="text-gray-400 text-lg">
            Tell us about your project and we will get back to you within 24 hours. Minimum job size is $400.
          </p>
        </div>

        {status === 'success' && (
          <div className="bg-[#0d2040] border border-[#00d4d4]/40 rounded-lg p-8 text-center mb-8">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-white font-bold text-xl mb-2">Request Received</h2>
            <p className="text-gray-400">
              Thanks for reaching out. We will review your project and follow up within 24 hours.
            </p>
          </div>
        )}

        {status !== 'success' && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#0d1f3c] border border-[#0e7c7b]/30 rounded-lg p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name <span className="text-[#00d4d4]">*</span>
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-[#0a1628] border border-[#0e7c7b]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4d4] transition-colors"
                placeholder="John Smith"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-[#00d4d4]">*</span>
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                  })}
                  type="email"
                  className="w-full bg-[#0a1628] border border-[#0e7c7b]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4d4] transition-colors"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone <span className="text-[#00d4d4]">*</span>
                </label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  type="tel"
                  className="w-full bg-[#0a1628] border border-[#0e7c7b]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4d4] transition-colors"
                  placeholder="843-555-0100"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Property Address <span className="text-[#00d4d4]">*</span>
              </label>
              <input
                {...register('address', { required: 'Address is required' })}
                className="w-full bg-[#0a1628] border border-[#0e7c7b]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4d4] transition-colors"
                placeholder="123 King Street, Charleston, SC 29401"
              />
              {errors.address && (
                <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Service Type <span className="text-[#00d4d4]">*</span>
              </label>
              <select
                {...register('serviceType', { required: 'Please select a service' })}
                className="w-full bg-[#0a1628] border border-[#0e7c7b]/40 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00d4d4] transition-colors"
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
                Project Description <span className="text-[#00d4d4]">*</span>
              </label>
              <textarea
                {...register('description', { required: 'Please describe your project' })}
                rows={5}
                className="w-full bg-[#0a1628] border border-[#0e7c7b]/40 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4d4] transition-colors resize-none"
                placeholder="Describe what you need cleaned or restored. Include material type, approximate size, and any details that will help us give you an accurate quote."
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm">
                Something went wrong. Please try again or call us at 854-222-7790.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#00d4d4] text-[#0a1628] py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Request Free Quote'}
            </button>

            <p className="text-gray-500 text-xs text-center">
              We respond within 24 hours. Minimum job size $400. Serving Charleston and the Lowcountry.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}