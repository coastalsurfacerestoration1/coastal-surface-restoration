import Link from 'next/link';
import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/seo';

// Transactional confirmation page. Not something we want appearing in search
// results or diluting the canonical of /quote, so it opts out of both.
export const metadata: Metadata = {
  title: 'Thank You',
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#0e273e] flex items-center justify-center py-16 lg:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#397774]/10 border border-[#397774]/40">
          <svg className="h-9 w-9 text-[#397774]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
          Request Received
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Thanks. We will be in touch.
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Your quote request is in. We review every project personally and follow up within 24 hours, usually sooner.
        </p>

        <div className="bg-[#1a3958] border border-[#397774]/20 rounded-lg p-6 sm:p-8 mb-10 text-left">
          <h2 className="text-white font-bold text-lg mb-6 text-center">What Happens Next</h2>
          <ol className="space-y-5">
            {[
              {
                step: '01',
                title: 'We review your project',
                desc: 'We read the description, look at any photos you sent, and confirm the surface is a fit for laser cleaning.',
              },
              {
                step: '02',
                title: 'You get a follow-up',
                desc: 'Within 24 hours, by email or phone depending on what you provided. If we need more photos or a site visit, we will say so.',
              },
              {
                step: '03',
                title: 'We schedule the work',
                desc: 'Once the scope and price are agreed, we book a time that fits your property and, for commercial jobs, your hours.',
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-4 items-start">
                <div className="text-[#397774] font-bold text-xl w-8 shrink-0">{item.step}</div>
                <div>
                  <div className="text-white font-semibold text-base mb-1">{item.title}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Something urgent, or want to add to your request?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href={`tel:${BUSINESS.phone.replace(/\D/g, '')}`}
            className="bg-[#397774] text-white px-8 py-4 rounded font-bold text-base hover:bg-[#2a5c5a] transition-colors"
          >
            Call {BUSINESS.phone}
          </a>
          <a
            href={`mailto:${BUSINESS.email}`}
            className="border border-[#397774]/50 text-[#397774] px-8 py-4 rounded font-bold text-base hover:border-[#397774] hover:bg-[#397774]/10 transition-colors"
          >
            Email Us
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {[
            { href: '/', label: 'Home' },
            { href: '/services', label: 'Services' },
            { href: '/how-laser-cleaning-works', label: 'How It Works' },
            { href: '/gallery', label: 'Gallery' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-400 hover:text-[#397774] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
