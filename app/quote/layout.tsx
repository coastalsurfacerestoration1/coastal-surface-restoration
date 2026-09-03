import { pageMetadata } from '@/lib/seo';
import Breadcrumbs from '@/app/components/Breadcrumbs';

// page.tsx is a client component (react-hook-form), which cannot export
// metadata — so it lives here instead.
export const metadata = pageMetadata({
  title: 'Request a Free Quote',
  description:
    'Request a free estimate for mobile laser cleaning in Charleston, SC. Send photos of the piece and we will follow up with pricing within 24 hours.',
  path: '/quote',
});

// The breadcrumb sits in the layout rather than in page.tsx so it stays a
// server component: dropping it into the client bundle would pull the trail
// and its JSON-LD in with the form for no reason. It also keeps the form
// component itself untouched.
export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Get a Quote', path: '/quote' },
        ]}
      />
      {children}
    </>
  );
}
