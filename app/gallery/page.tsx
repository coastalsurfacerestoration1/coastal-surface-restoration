import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata = pageMetadata({
  title: 'Before & After Gallery',
  description:
    'Before and after photos from Charleston surface restoration jobs, starting with a wrought iron balcony railing on Daniel Island. Free estimates.',
  path: '/gallery',
});

/**
 * Finished jobs, newest first. Photos live under /public/images/gallery as a
 * WebP with a JPEG fallback of the same name, with all camera metadata
 * stripped. File names and alt text describe the surface only, never the
 * customer or the address. A testimonial is only quoted word for word, with
 * the customer's OK, and attributed by first name and last initial.
 */
type JobPhoto = { src: string; alt: string; label: string };
type Job = {
  caption: string;
  date: string;
  photos: JobPhoto[];
  testimonial?: { paragraphs: string[]; attribution: string; source: string };
};

const jobs: Job[] = [
  {
    caption: 'Balcony railing, Daniel Island. Stripped, primed the same day, two coats of black.',
    date: 'November 2026',
    photos: [
      {
        src: '/images/gallery/railing-balcony-before',
        alt: 'Curved wrought iron balcony railing with faded, peeling blue-green paint and rust',
        label: 'Before',
      },
      {
        src: '/images/gallery/railing-before-closeup',
        alt: 'Close-up of the top rail laid on a drop cloth, with old paint flaking off the metal',
        label: 'Before',
      },
      {
        src: '/images/gallery/railing-primed',
        alt: 'The railing laid out on drop cloths after stripping, coated in white primer',
        label: 'Primed',
      },
      {
        src: '/images/gallery/railing-balcony-after',
        alt: 'The balcony railing refinished in black above the brick balcony floor',
        label: 'After',
      },
      {
        src: '/images/gallery/railing-balcony-after-wide',
        alt: 'The same curved balcony railing refinished in black, looking out over the marsh',
        label: 'After',
      },
    ],
    testimonial: {
      paragraphs: [
        'Tyler Scherzer of Coastal Restoration is the best contractor I have ever worked with. Every aspect of the estimate, preparation, restoration, and cleanup was very professional, and the process was seamless. The results were unbelievable.',
        'I had an ugly peeling, rusted wrought-iron balcony railing that badly needed restoration. Tyler used a laser rust remover/paint stripper that removed all the rust and old paint, leaving the surface bare metal. He primed and applied two coats of rust-preventing enamel, and it looks brand new and way beyond my expectations. What a transformation, and all at a very reasonable price!',
        'I would highly recommend Coastal Restoration to everyone.',
      ],
      attribution: 'William A., Daniel Island',
      source: 'Google review',
    },
  },
  {
    caption: 'Lobby stair post, office building in North Charleston. Polished by hand, no laser.',
    date: 'November 2026',
    photos: [
      {
        src: '/images/gallery/brass-stair-post-before',
        alt: 'Brass stair handrail post with a dull, tarnished finish and corrosion at its base on a marble step',
        label: 'Before',
      },
      {
        src: '/images/gallery/brass-stair-post-after',
        alt: 'The same brass handrail post polished to a bright shine, with blue tape protecting the marble at its base',
        label: 'After',
      },
    ],
  },
];

/**
 * The categories of work that will be documented here, and what to look for
 * in each comparison.
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
            Our first finished job is below, a balcony railing on Daniel Island.
            Every photo here is from a real Charleston job, shot before and
            after on the same piece and in the same light.
          </p>
        </div>
      </section>

      {/* Status */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="bg-[#1a3958] border border-[#397774]/30 rounded-lg px-3 py-6 sm:p-10">
            <h2 className="text-white font-bold text-2xl mb-6">
              Recent Work
            </h2>
            {jobs.map((job) => (
              <article key={job.caption} className="mb-10 border-b border-[#397774]/20 pb-10">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {job.photos.map((photo) => (
                    <figure key={photo.src} className="relative aspect-[3/4] overflow-hidden rounded-md bg-[#0e273e]">
                      <picture>
                        <source srcSet={`${photo.src}.webp`} type="image/webp" />
                        <img
                          src={`${photo.src}.jpg`}
                          alt={photo.alt}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </picture>
                      <figcaption className="absolute left-2 top-2 rounded bg-[#0e273e]/85 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                        {photo.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <p className="mt-4 text-white leading-relaxed">{job.caption}</p>
                <p className="mt-1 text-sm text-gray-500">{job.date}</p>
                {job.testimonial && (
                  <figure className="mt-6 border-l-2 border-[#397774] pl-5">
                    <blockquote className="space-y-3 text-gray-300 leading-relaxed">
                      {job.testimonial.paragraphs.map((p) => (
                        <p key={p.slice(0, 24)}>{p}</p>
                      ))}
                    </blockquote>
                    <figcaption className="mt-4 text-sm text-gray-400">
                      <span className="font-semibold text-white">{job.testimonial.attribution}</span>
                      {', '}
                      {job.testimonial.source}
                    </figcaption>
                  </figure>
                )}
              </article>
            ))}
            <p className="text-gray-400 leading-relaxed mb-4">
              New jobs post here as they wrap up, with the neighborhood and
              what was done to the surface.
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
                Get a Free Estimate
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
            What to Look For
          </h2>
          <p className="text-gray-400 leading-relaxed mb-10 max-w-2xl">
            A before and after is only useful if you know what to look at. These
            are the kinds of restoration we document, and what each comparison
            should tell you.
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
            Have something worth restoring?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Send a photo of what needs work and we will tell you how we would
            restore it, usually within one business day.
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
