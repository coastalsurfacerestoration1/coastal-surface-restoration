import { pageMetadata } from '@/lib/seo';

// page.tsx is a client component (react-hook-form), which cannot export
// metadata — so it lives here instead.
export const metadata = pageMetadata({
  title: 'Request a Free Quote',
  description:
    'Request a free estimate for mobile laser cleaning in Charleston, SC. Send photos of the piece and we will follow up with pricing within 24 hours. Minimum job size $400.',
  path: '/quote',
});

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
