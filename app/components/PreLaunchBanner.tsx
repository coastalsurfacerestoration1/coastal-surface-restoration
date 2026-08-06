'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Key is versioned on purpose. When the banner text changes — launch, a new
 * offer — bump the suffix so people who dismissed the old message see the new
 * one instead of having it silently suppressed forever.
 */
export const BANNER_DISMISS_KEY = 'csr-banner-oct-2026';

/**
 * Runs before first paint, ahead of hydration. The banner is rendered by the
 * server on every page so it is in the static HTML for crawlers and for people
 * who have never dismissed it; this hides it immediately for people who have,
 * which avoids both a flash of the banner and the layout shift that a
 * useEffect-only check would cause.
 *
 * Paired with the `html[data-banner-dismissed]` rule in globals.css.
 */
export const bannerDismissScript = `try{if(localStorage.getItem(${JSON.stringify(
  BANNER_DISMISS_KEY,
)})){document.documentElement.dataset.bannerDismissed='1'}}catch(e){}`;

/**
 * State here only covers dismissing the banner during this visit. Whether it
 * was dismissed on a *previous* visit is handled entirely by the inline script
 * and the CSS rule it triggers, which is why there is no effect reading
 * localStorage on mount: doing that would render the banner and then remove
 * it, and the server and client renders would disagree in between.
 */
export default function PreLaunchBanner() {
  const [dismissed, setDismissed] = useState(false);

  const dismiss = () => {
    try {
      localStorage.setItem(BANNER_DISMISS_KEY, '1');
    } catch {
      // Private browsing or storage disabled. Dismissal will not persist to the
      // next page, but hiding it here still respects the click.
    }
    document.documentElement.dataset.bannerDismissed = '1';
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      data-prelaunch-banner
      role="region"
      aria-label="Pre-launch announcement"
      className="border-b border-[#00d4d4]/30 bg-[#0e7c7b]"
    >
      {/* Same max-width and gutters as the header, so the dismiss control lines
          up with the nav above it rather than floating at the window edge. */}
      <div className="relative mx-auto max-w-6xl px-4 py-2.5 pr-12 sm:px-6 sm:pr-14 lg:px-8 lg:pr-14">
        <p className="text-sm leading-snug text-white">
          We are not yet operational but expect to launch in October 2026.{' '}
          <Link
            href="/quote"
            className="font-semibold text-[#0a1628] underline decoration-[#0a1628]/40 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
          >
            Accepting provisional clients now.
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute top-1/2 right-0 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white sm:right-1 lg:right-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
