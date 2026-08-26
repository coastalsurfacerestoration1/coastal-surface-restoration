import Link from 'next/link';

/**
 * Pre-launch notice, rendered by the root layout on every page.
 *
 * Deliberately not dismissible and deliberately a server component: there is
 * no state, no storage and nothing shipped to the client. Anyone landing on
 * any page should see that we are not taking work yet before they read
 * anything else.
 */
export default function PreLaunchBanner() {
  return (
    <div
      role="region"
      aria-label="Pre-launch announcement"
      className="border-b border-[#397774]/30 bg-[#397774]"
    >
      {/* Same max-width and gutters as the header, so the message centers on
          the nav above it rather than on the full window. */}
      <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="text-center text-sm leading-snug text-white text-balance">
          We are not yet operational but expect to launch in October 2026.{' '}
          <Link
            href="/quote"
            className="font-semibold text-[#0e273e] underline decoration-[#0e273e]/40 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
          >
            Accepting provisional clients now.
          </Link>
        </p>
      </div>
    </div>
  );
}
