import Image from 'next/image';
import Link from 'next/link';
import LaserReveal from './components/LaserReveal';
import SurfaceCrossSection from './components/SurfaceCrossSection';
import {
  BoltIcon,
  BrickIcon,
  CleatIcon,
  IronScrollIcon,
  SprayIcon,
  UrnIcon,
} from './components/icons';

/**
 * Services described by what comes off and what it comes off of, rather than
 * by the tool. Rust and paint lead together on purpose. Anything not yet
 * proven on a material carries "test spot first", and the lead and listed
 * landmark gates stay in the copy wherever paint on a building comes up.
 */
const whatComesOff = [
  {
    Icon: IronScrollIcon,
    title: 'Rust',
    desc: 'Off iron gates, steel railings, cast iron, trailers and car parts, set to stop at sound metal so the profile and edges survive.',
    href: '/services/rust-removal-charleston',
  },
  {
    Icon: BoltIcon,
    title: 'Paint and coatings',
    desc: 'Old and failing paint off iron and steel, with wood taken case by case after a test spot. Paint on pre-1978 homes needs a negative lead test first, and listed landmarks are not taken.',
    href: '/services/rust-removal-charleston#paint-removal',
  },
  {
    Icon: SprayIcon,
    title: 'Graffiti',
    desc: 'Spray paint tags on hard brick, block, unsealed concrete and painted steel. A test patch comes first, before any quote.',
    href: '/services/graffiti-removal-charleston',
  },
  {
    Icon: UrnIcon,
    title: 'Grease and carbon',
    desc: 'Baked-on buildup on grill grates and engine brackets brought to the bench. Test spot first.',
    href: '/quote',
  },
  {
    Icon: CleatIcon,
    title: 'Oxidation',
    desc: 'Tea staining and weld tint on stainless, and the green crust on bronze boat hardware, cleaned on land or with the boat on the hard.',
    href: '/services/marine-cleaning-charleston',
  },
  {
    Icon: BrickIcon,
    title: 'Stains',
    desc: 'Overspray and soot on hard brick, block, stone and unsealed concrete, small areas only. Test spot first.',
    href: '/quote',
  },
];

/**
 * Before and after pairs from the first jobs. Each slot renders a labeled
 * placeholder until its photos exist; fill in src and alt for both halves
 * (files under /public) and the frame switches to the real image. Captions
 * describe the surface and the work only, never the customer or the address.
 */
type PhotoSlot = { src: string | null; alt: string };
type BeforeAfterPair = { before: PhotoSlot; after: PhotoSlot; caption: string };

const EMPTY_SLOT: PhotoSlot = { src: null, alt: '' };

const beforeAfterPairs: BeforeAfterPair[] = [
  { before: EMPTY_SLOT, after: EMPTY_SLOT, caption: '' },
  { before: EMPTY_SLOT, after: EMPTY_SLOT, caption: '' },
  { before: EMPTY_SLOT, after: EMPTY_SLOT, caption: '' },
];

function PhotoFrame({ slot, label }: { slot: PhotoSlot; label: string }) {
  return (
    <figure className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#0e273e]">
      {slot.src ? (
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes="(min-width: 1024px) 18rem, (min-width: 768px) 45vw, 90vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-[#397774]/40 text-sm text-gray-500">
          {label} photo
        </div>
      )}
      <figcaption className="absolute left-2 top-2 rounded bg-[#0e273e]/85 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
        {label}
      </figcaption>
    </figure>
  );
}

const credentials = [
  // Trained, never certified. Naming the standard is what carries the
  // weight, and "LIA trained" read as though the LIA issued a credential
  // rather than delivered training against ANSI Z136.1. This matches the
  // phrasing used everywhere else on the site.
  { label: 'ANSI Z136.1', detail: 'Laser Safety Officer, trained to ANSI Z136.1' },
  { label: '$1M / $2M', detail: 'General liability coverage' },
  { label: 'Mobile', detail: 'On site, or on our bench for small parts' },
  { label: 'Free estimates', detail: 'Quoted from photos, no obligation' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e273e]">

      {/* Hero */}
      <section className="grain relative overflow-hidden border-b border-[#397774]/20 bg-gradient-to-br from-[#0e273e] via-[#1a3958] to-[#0e273e] py-12 lg:py-16">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#397774]">
                Charleston, SC &amp; the Lowcountry
              </p>
              {/* "restoration specialists." is kept on one line. The size
                  scales with the viewport on phones so that line fits down
                  to a 320px screen instead of breaking after "restoration". */}
              <h1 className="font-display text-[clamp(2.125rem,10.5vw,3rem)] font-bold leading-[0.95] tracking-tight text-white sm:text-6xl">
                <span className="block">Charleston&apos;s surface</span>
                <span className="block whitespace-nowrap">restoration specialists.</span>
                <span className="block text-[#397774]">We remove the rust, not the iron.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-300">
                We take off rust and old paint, along with graffiti, grease,
                oxidation and stains. We work on metal, wood, brick, stone,
                concrete and boat parts on land, using a laser set to stop at
                the original surface. Anything new to us gets a test spot
                first, and we never use chemicals or blast media.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/quote"
                  className="rounded bg-[#397774] px-8 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-[#2a5c5a]"
                >
                  Get a Free Quote
                </Link>
                <Link
                  href="/services"
                  className="rounded border border-[#8fd3cd]/60 px-8 py-4 text-center text-lg font-bold text-[#8fd3cd] transition-colors hover:border-[#8fd3cd] hover:bg-[#397774]/20"
                >
                  See Our Services
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Not sure if we can help? Send it anyway. Free estimates, with a
                reply within one business day.
              </p>
            </div>

            <LaserReveal />
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-[#1a3958] py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 overflow-hidden rounded-lg border-2 border-white lg:grid-cols-4">
            {credentials.map((c, i) => {
              const mobileRight = i % 2 === 0;
              const mobileBottom = i < 2;
              const desktopLeft = i > 0;
              return (
                <div
                  key={c.label}
                  className={[
                    'border-white px-4 py-5 lg:px-6 lg:py-6',
                    mobileRight && 'border-r-2',
                    mobileBottom && 'border-b-2',
                    'lg:border-r-0 lg:border-b-0',
                    desktopLeft && 'lg:border-l-2',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <dt className="font-display text-xl font-bold tracking-wide text-white">
                    {c.label}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-400">{c.detail}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {/* What comes off */}
      <section className="bg-[#0e273e] py-8 lg:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#397774]">
            What we do
          </p>
          <h2 className="font-display mb-14 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            What comes off, and what it comes off of.
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {whatComesOff.map(({ Icon, title, desc, href }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-lg border border-[#397774]/30 bg-[#1a3958] p-8 transition-colors hover:border-[#397774]/50"
              >
                <Icon className="mb-5 h-14 w-14 text-[#397774]" />
                <h3 className="font-display mb-3 text-2xl font-bold tracking-wide text-white transition-colors group-hover:text-[#397774]">
                  {title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-400">{desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#397774] transition-all group-hover:gap-2">
                  {href === '/quote' ? 'Send a photo' : 'Learn more'}{' '}
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Before and after */}
      <section className="border-t border-[#397774]/20 bg-[#1a3958] py-8 lg:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#397774]">
            Before and after
          </p>
          <h2 className="font-display mb-10 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The same surface, before and after.
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {beforeAfterPairs.map((pair, i) => (
              <div key={i} className="rounded-lg border border-[#397774]/30 bg-[#0e273e] p-3">
                <div className="grid grid-cols-2 gap-3">
                  <PhotoFrame slot={pair.before} label="Before" />
                  <PhotoFrame slot={pair.after} label="After" />
                </div>
                {pair.caption && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{pair.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where each method stops */}
      <section className="border-y border-[#397774]/20 bg-[#1a3958] py-8 lg:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#397774]">
            The difference
          </p>
          <h2 className="font-display mb-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Every method removes the rust. The laser is set to stop at the metal.
          </h2>
          <p className="mb-12 max-w-2xl leading-relaxed text-gray-400">
            Rust sits on top of the metal you are trying to keep. The question
            is not whether a method can take the corrosion off, it is what else
            comes off with it.
          </p>
          <SurfaceCrossSection />
        </div>
      </section>

      {/* Next step */}
      <section className="bg-[#0e273e] py-8 lg:py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Send a photo. Get an answer.
          </h2>
          <p className="mx-auto mt-5 mb-10 max-w-xl leading-relaxed text-gray-400">
            Not sure if we can help? Send it anyway. If it is work we do, you
            get a free estimate, usually within one business day. If it is not
            a fit, Tyler still looks at it and, where possible, points you to
            the right person. Serving Charleston, Mount Pleasant, North
            Charleston, Daniel Island, West Ashley, James Island, and the
            islands.
          </p>
          <Link
            href="/quote"
            className="inline-block rounded bg-[#397774] px-10 py-4 text-lg font-bold text-white transition-colors hover:bg-[#2a5c5a]"
          >
            Request a Free Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
