import Link from 'next/link';
import LaserReveal from './components/LaserReveal';
import SurfaceCrossSection from './components/SurfaceCrossSection';
import { CleatIcon, IronScrollIcon, RailingIcon } from './components/icons';

const specialties = [
  {
    Icon: IronScrollIcon,
    title: 'Historic Restoration',
    desc: "Iron gates, brick stoops, wrought iron railings, church gates, and wood shutters. Preserve Charleston's historic character without damaging original materials.",
    href: '/services/historic-ironwork-restoration-charleston',
  },
  {
    Icon: CleatIcon,
    title: 'Marine Cleaning',
    desc: 'Boat fittings, trailers, marine hardware, hulls, and dock equipment. Rust and marine growth removed without harsh chemicals near the waterways.',
    href: '/services/marine-cleaning-charleston',
  },
  {
    Icon: RailingIcon,
    title: 'Vacation Rental Restoration',
    desc: "Keep your Isle of Palms, Sullivan's Island, or Folly Beach property in top condition. Recurring maintenance available for property managers.",
    href: '/services/vacation-rental-cleaning-charleston',
  },
];

const credentials = [
  { label: 'ANSI Z136.1', detail: 'Certified Laser Safety Officer' },
  { label: '$1M / $2M', detail: 'General liability coverage' },
  { label: 'Fully mobile', detail: 'We work at your property' },
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
              <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
                Laser precision.
                <br />
                <span className="text-[#397774]">Zero damage.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-300">
                We remove rust, paint, and corrosion from historic ironwork,
                marine hardware, and exterior metal without touching the
                material underneath. No chemicals, no abrasives, no water.
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
                  className="rounded border border-[#397774]/50 px-8 py-4 text-center text-lg font-bold text-[#397774] transition-colors hover:border-[#397774] hover:bg-[#397774]/10"
                >
                  See Our Services
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Free estimates. No obligation. Reply within 24 hours.
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

      {/* Specialties */}
      <section className="bg-[#0e273e] py-8 lg:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#397774]">
            What we do
          </p>
          <h2 className="font-display mb-14 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Three specialties. One laser.
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {specialties.map(({ Icon, title, desc, href }) => (
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
                  Learn more <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
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
            Every method removes the rust. Only one stops there.
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
            Send a photo. Get a number.
          </h2>
          <p className="mx-auto mt-5 mb-10 max-w-xl leading-relaxed text-gray-400">
            Tell us what needs work and we will tell you what laser cleaning can
            do for it, usually within 24 hours. Free estimates on every job.
            Serving Charleston, Mount Pleasant, Isle of Palms,
            Sullivan&apos;s Island, James Island, and Folly Beach.
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
