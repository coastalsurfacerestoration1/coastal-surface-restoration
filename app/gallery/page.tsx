import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata = pageMetadata({
  title: 'Before & After Gallery',
  description:
    'Before and after photos from Charleston surface restoration jobs will post here as jobs finish, from railings and marine hardware to classic car parts. Free estimates.',
  path: '/gallery',
});

/**
 * The categories of work that will be documented here.
 *
 * Deliberately framed as what the gallery will show rather than as finished
 * jobs: the business has not taken its first job yet, and cards captioned with
 * a place and a service read as a completed portfolio even under a placeholder.
 */
const workTypes = [
  {
    title: 'Iron and Steel Gates & Railings',
    href: '/services/historic-ironwork-restoration-charleston',
    shows:
      'Rust and failed paint lifted off pickets and scrolls, with the profile and edges still crisp underneath. Look at the edge of a scroll, where blasting would round it over.',
  },
  {
    title: 'Marine Stainless & Bronze Hardware',
    href: '/services/marine-cleaning-charleston',
    shows:
      'Cleats, rails and portlights cleaned on land or on the bench. Look at the tea staining on stainless and the green crust on bronze, and the bright metal underneath.',
  },
  {
    title: 'Classic Car & Vintage Parts',
    href: '/services/antique-restoration-charleston',
    shows:
      'Brackets, hubs, manifolds and old hand tools taken back to bare metal on the bench. Look at the casting marks and stamped numbers after cleaning.',
  },
  {
    title: 'Rust & Failed Coatings',
    href: '/services/rust-removal-charleston',
    shows:
      'Heavy scale removed down to sound metal, ready for coating. Worth comparing the depth of pitting before and after.',
  },
  {
    title: 'Stainless Heat Tint & Tea Staining',
    href: '/services/rust-removal-charleston',
    shows:
      'Weld discoloration and brown salt bloom off stainless rails and frames. Look at the weld line, where the straw and blue bands should be gone and the grain unchanged.',
  },
  {
    title: 'Rental Railings & Exterior Metal',
    href: '/services/vacation-rental-cleaning-charleston',
    shows:
      'Rust stripped from steel railings and stair hardware on island rentals, primed the same day. These are the details that read as neglect in a listing photo.',
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Gallery', path: '/gallery' },
        ]}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Results
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Before &amp; After
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We are new, and we would rather show you nothing than show you
            somebody else&apos;s work. Every photo posted here will be from a real
            Charleston job, shot before and after, on the same piece and in the
            same light.
          </p>
        </div>
      </section>

      {/* Status */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a3958] border border-[#397774]/30 rounded-lg p-10">
            <h2 className="text-white font-bold text-2xl mb-4">
              Project Photos
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Project photos post here as jobs wrap up, with the neighborhood,
              the material, and what was actually done to it.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              If you have a piece you want documented, early jobs are the ones we
              photograph most thoroughly. Free estimates apply the same as always.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/quote"
                className="bg-[#397774] text-white px-8 py-3 rounded font-bold text-center hover:bg-[#2a5c5a] transition-colors"
              >
                Be One of Our First Jobs
              </Link>
              <a
                href="https://www.instagram.com/coastalsurfacerestoration"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#397774]/40 text-[#397774] px-8 py-3 rounded font-bold text-center hover:border-[#397774] hover:bg-[#397774]/10 transition-colors"
              >
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What will be documented */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            What You Will See Here
          </h2>
          <p className="text-gray-400 leading-relaxed mb-10 max-w-2xl">
            A before and after is only useful if you know what to look at. These
            are the six kinds of work we expect to document most, and what the
            comparison should tell you in each case.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workTypes.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="block bg-[#0e273e] border border-[#397774]/20 rounded-lg p-6 hover:border-[#397774]/50 transition-colors group"
              >
                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-[#397774] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {item.shows}
                </p>
                <span className="inline-flex items-center gap-1 text-[#397774] font-semibold text-sm group-hover:gap-2 transition-all">
                  Learn more <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#0e273e] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Have something worth photographing?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Send a photo of what needs work and we will tell you what laser
            cleaning can do for it, usually within one business day.
          </p>
          <Link
            href="/quote"
            className="bg-[#397774] text-white px-10 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Request a Free Quote
          </Link>
        </div>
      </section>

    </div>
  );
}
