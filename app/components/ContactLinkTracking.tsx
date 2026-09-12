'use client';

import { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

/**
 * Reports taps on phone and email links to GA4.
 *
 * For a mobile service business the phone tap is the highest intent signal on
 * the site, and it is invisible by default: the dialer opens, no page is
 * requested, and nothing reaches analytics. A visitor who calls instead of
 * filling in the form otherwise looks identical to one who bounced.
 *
 * This is one delegated listener rather than an onClick on each link. There
 * are a dozen or so tel: and mailto: links spread across the footer, the
 * contact page, the legal pages, the 404, and the thank-you page, and almost
 * all of them live in server components. Instrumenting them individually would
 * mean converting those pages to client components and shipping them to the
 * browser to track a click. A single listener on the document covers every one
 * of them, including any added later, for nothing.
 *
 * Capture phase on purpose, so a handler further down that stops propagation
 * cannot silently take a link out of the numbers.
 */
export default function ContactLinkTracking() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest('a[href^="tel:"], a[href^="mailto:"]');
      if (!(link instanceof HTMLAnchorElement)) return;

      // getAttribute rather than .href, which the DOM resolves and normalizes.
      const href = link.getAttribute('href') ?? '';
      const isPhone = href.startsWith('tel:');

      // Two event names rather than one with a method parameter. GA4 marks key
      // events by name, and a parameter would have to be registered as a
      // custom dimension in the GA4 UI before it could be reported on at all.
      // Separate names mean the phone tap can be marked as a key event on its
      // own, without touching anything in the property's configuration.
      sendGAEvent('event', isPhone ? 'phone_call_click' : 'email_click', {
        // Where the tap happened matters more than what was tapped: it says
        // which page was doing the persuading.
        page_path: window.location.pathname,
        link_url: href,
      });
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}
