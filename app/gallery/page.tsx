import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Before & After Gallery',
  description:
    'Before and after results from mobile laser cleaning in Charleston, SC. Historic ironwork, marine hardware, brick, and masonry restored without chemicals or abrasives. First project photos posting this fall.',
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
    title: 'Historic Iron Gates & Railings',
    href: '/services/historic-ironwork-restoration-charleston',
    shows:
      'Corrosion and failed paint lifted off forged detail, with the tool marks and profile still intact underneath. The comparison that matters here is the edge of a scroll or a picket, where blasting would have rounded it over.',
  },
  {
    title: 'Boat Trailers & Marine Hardware',
    href: '/services/marine-cleaning-charleston',
    shows:
      'Frames, axles, and fittings taken back to clean metal while still assembled. Look at the threads, bearings, and tight corners, which are the places blasting media ends up and never fully leaves.',
  },
  {
    title: 'Brick, Stucco & Masonry',
    href: '/services/brick-cleaning-charleston',
    shows:
      'Soiling and efflorescence gone with the fired brick skin still on the brick. Pressure washed masonry looks clean too, at the cost of the surface that was protecting it.',
  },
  {
    title: 'Rust & Failed Coatings',
    href: '/services/rust-removal-charleston',
    shows:
      'Heavy scale removed down to sound metal, ready for coating. Worth watching the depth of pitting before and after, since the base metal should be no thinner than when we started.',
  },
  {
    title: 'Graffiti on Historic Surfaces',
    href: '/services/graffiti-removal-charleston',
    shows:
      'Tags off porous brick and stucco without a shadow left where the paint was. Ghosting is the usual failure here, so these comparisons are shot in raking light where it would show.',
  },
  {
    title: 'Rental Railings & Exterior Metal',
    href: '/services/vacation-rental-cleaning-charleston',
    shows:
      'Rust streaking cleaned off railings, stair hardware, and light fixtures on island properties. These are the details that read as neglect in a listing photo.',
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
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
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0d1f3c] border border-[#0e7c7b]/30 rounded-lg p-10">
            <h2 className="text-white font-bold text-2xl mb-4">
              First Photos Post This Fall
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Equipment setup is in its final stages and we expect to take our
              first Charleston jobs in October 2026. Photos will go up here as
              those jobs are completed, with the neighborhood, the material, and
              what was actually done to it.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              If you have a piece you want documented, early jobs are the ones we
              photograph most thoroughly. Free estimates apply the same as always.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/quote"
                className="bg-[#00d4d4] text-[#0a1628] px-8 py-3 rounded font-bold text-center hover:bg-[#00b8b8] transition-colors"
              >
                Be One of Our First Jobs
              </Link>
              <a
                href="https://www.instagram.com/coastalsurfacerestoration"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#00d4d4]/40 text-[#00d4d4] px-8 py-3 rounded font-bold text-center hover:border-[#00d4d4] hover:bg-[#00d4d4]/10 transition-colors"
              >
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What will be documented */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
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
                className="block bg-[#0a1628] border border-[#0e7c7b]/20 rounded-lg p-6 hover:border-[#00d4d4]/50 transition-colors group"
              >
                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-[#00d4d4] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {item.shows}
                </p>
                <span className="inline-flex items-center gap-1 text-[#00d4d4] font-semibold text-sm group-hover:gap-2 transition-all">
                  Learn more <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#0a1628] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Have something worth photographing?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Send a photo of what needs work and we will tell you what laser
            cleaning can do for it, usually within 24 hours.
          </p>
          <Link
            href="/quote"
            className="bg-[#00d4d4] text-[#0a1628] px-10 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors"
          >
            Request a Free Quote
          </Link>
        </div>
      </section>

    </div>
  );
}
