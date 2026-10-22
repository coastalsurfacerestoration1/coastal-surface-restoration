import Link from 'next/link';

/**
 * Site-wide booking notice, rendered by the root layout on every page. It
 * started as the pre-launch notice, hence the name.
 *
 * Deliberately not dismissible and deliberately a server component: there is
 * no state, no storage and nothing shipped to the client.
 */
export default function PreLaunchBanner() {
  return (
    <div
      role="region"
      aria-label="Booking announcement"
      className="border-b border-[#397774]/30 bg-[#397774]"
    >
      {/* Same max-width and gutters as the header, so the message centers on
          the nav above it rather than on the full window. */}
      <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="text-center text-sm leading-snug text-white text-balance">
          Now booking jobs across the Charleston area.{' '}
          <Link
            href="/quote"
            className="font-semibold text-[#0e273e] underline decoration-[#0e273e]/40 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
          >
            Request a free estimate.
          </Link>
        </p>
      </div>
    </div>
  );
}
