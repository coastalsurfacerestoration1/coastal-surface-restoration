'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Pages where the sticky CTA would be redundant or actively unhelpful. The
 * quote form is the destination, and the thank-you page comes right after
 * submitting it.
 */
const HIDE_ON = new Set<string>(['/quote', '/thank-you']);

/**
 * Fixed-bottom "Get a Quote" button on mobile only. Above the pre-launch
 * launch date, this is the fastest path from any page into the form for a
 * phone user, which is where most of the traffic will land.
 *
 * The spacer div is a sibling of the fixed bar, rendered in normal flow.
 * Placed after the footer in the root layout, it extends body height so the
 * fixed bar always overlays empty space rather than the footer's last line.
 */
export default function MobileStickyCta() {
  const pathname = usePathname();
  if (HIDE_ON.has(pathname)) return null;

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-[#0e7c7b]/30 bg-[#0a1628]/95 backdrop-blur-sm p-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
      >
        <Link
          href="/quote"
          className="block w-full rounded bg-[#00d4d4] py-3.5 text-center text-base font-bold text-[#0a1628] transition-colors hover:bg-[#00b8b8]"
        >
          Get a Free Quote
        </Link>
      </div>
      {/* Spacer so scrolling to the bottom does not put the footer under the
          fixed bar. Hidden at md+ where the bar itself is hidden. */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
