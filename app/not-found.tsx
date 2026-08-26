import Link from 'next/link';
import type { Metadata } from 'next';

// Without this the 404 inherits the root layout's canonical and points every
// missing URL at the homepage.
export const metadata: Metadata = {
  title: 'Page Not Found',
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0e273e] flex items-center justify-center py-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
          404
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          This page moved or never existed
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-10">
          The link may be out of date. You can start from our services, check the
          areas we cover, or just call and ask.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/services"
            className="bg-[#397774] text-white px-8 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            See Our Services
          </Link>
          <a
            href="tel:8542227790"
            className="border border-[#397774]/50 text-[#397774] px-8 py-4 rounded font-bold text-lg hover:border-[#397774] hover:bg-[#397774]/10 transition-colors"
          >
            Call 854-222-7790
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-12 text-sm">
          {[
            { href: '/', label: 'Home' },
            { href: '/locations', label: 'Service Areas' },
            { href: '/gallery', label: 'Gallery' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
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
