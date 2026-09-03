import Link from 'next/link';
import { pageMetadata, BUSINESS } from '@/lib/seo';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How Coastal Surface Restoration collects, uses, and protects the information you share with us through this website and the quote request form.',
  path: '/privacy',
});

// Last meaningful change to this policy. Update this when the content changes,
// not on cosmetic edits.
const LAST_UPDATED = 'September 3, 2026';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ]}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-8 lg:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-content">
          <p className="text-gray-300 leading-relaxed mb-8">
            This policy explains what information Coastal Surface Restoration LLC collects when you use this website, why we collect it, and what we do with it. We try to keep it short and honest. If anything here is unclear, contact us using the details at the bottom of the page.
          </p>

          <Section title="Who this policy covers">
            <p>
              This policy applies to this website, <span className="text-white">coastalsurfacerestoration.com</span>, and to the quote request form on it. It does not cover work performed on your property, which is governed by the estimate and any service agreement we send separately.
            </p>
          </Section>

          <Section title="What we collect">
            <p>The only information we ask you for is what you send through the quote form:</p>
            <ul>
              <li>Your name</li>
              <li>Your email address</li>
              <li>Your phone number</li>
              <li>The property address for the job</li>
              <li>The type of service you are asking about</li>
              <li>Your description of the project</li>
              <li>Any photos or files you choose to include</li>
            </ul>
            <p>
              We also collect a small amount of information automatically when you visit the site: the pages you view, the site or search that sent you here, the device and browser you used, and a general location based on your IP address. We use this to understand how the site is being found and used, not to identify individual visitors.
            </p>
            <p>
              To keep the quote form from being abused by automated bots, our server briefly stores your IP address to enforce a submission rate limit. This is discarded shortly after.
            </p>
          </Section>

          <Section title="How we use it">
            <p>The information you send through the quote form is used to:</p>
            <ul>
              <li>Respond to your request with a quote or follow-up questions</li>
              <li>Schedule and perform the work if you decide to move forward</li>
              <li>Follow up afterward about warranty, related services, or maintenance</li>
            </ul>
            <p>The analytics information is used to understand which pages people find helpful and where we can improve the site. It is not tied back to your name or contact information.</p>
          </Section>

          <Section title="Who we share it with">
            <p>
              We do not sell your information, and we do not share it with advertisers or data brokers. We do share it with a small number of service providers who help us run the site and reply to you:
            </p>
            <ul>
              <li>
                <span className="text-white">Resend</span> delivers the quote form submissions to us as email. Their privacy policy is at{' '}
                <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#397774] hover:underline">resend.com/legal/privacy-policy</a>.
              </li>
              <li>
                <span className="text-white">Vercel</span> hosts this website and provides basic, cookieless traffic analytics. Their policy is at{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#397774] hover:underline">vercel.com/legal/privacy-policy</a>.
              </li>
              <li>
                <span className="text-white">Google Analytics</span> gives us aggregate reporting on how the site is used. Google&apos;s policy is at{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#397774] hover:underline">policies.google.com/privacy</a>.
              </li>
            </ul>
            <p>
              We may also share information if we are legally required to, for example in response to a court order, or if it is necessary to protect the rights or safety of the business or another person.
            </p>
          </Section>

          {/* Required for Twilio A2P 10DLC registration: the carrier review
              looks for an explicit mobile-information non-sharing statement on
              the privacy policy, and rejects the campaign without one (error
              30908). Keep the sentence below and the matching one in the Text
              messages section of app/terms/page.tsx intact and worded the same.
              The opt-in details here also have to match the checkbox label in
              app/quote/page.tsx. */}
          <Section title="Text messages">
            <p>
              If you check the box on our quote form that reads &quot;Text me about this quote,&quot; we will use the phone number you gave us to text you about your quote, to schedule and confirm your appointment, and to follow up after the work is done. The box is unchecked by default, and consent is not required to get service. If you leave it unchecked, we will reach you by phone or email instead.
            </p>
            <p>
              <span className="text-white">We do not share your mobile information or messaging consent with third parties or affiliates for marketing or promotional purposes.</span>
            </p>
            <p>
              We do share your number with the messaging provider that delivers the texts for us, but only so the message reaches your phone. It is never shared for anyone else&apos;s marketing, and we do not sell it.
            </p>
            <p>
              Message frequency varies, and message and data rates may apply depending on your mobile plan. Reply STOP to any message to opt out, or HELP for help. Full details are in our{' '}
              <Link href="/terms" className="text-[#397774] hover:underline">
                Terms of Service
              </Link>
              .
            </p>
          </Section>

          <Section title="Cookies and tracking">
            <p>
              Google Analytics uses cookies to help us count unique visits. Vercel Analytics is cookieless. We do not use advertising or retargeting cookies. You can block analytics cookies in your browser settings or install a browser extension that does the same. Doing so will not affect your ability to use the site or request a quote.
            </p>
          </Section>

          <Section title="How long we keep it">
            <p>
              Quote requests are kept in our email as long as they are useful for following up or supporting your job. Analytics data is retained according to the default settings of the analytics providers listed above. You can ask us to delete your information at any time using the contact details below, and we will do so unless we are required to keep it for legal or accounting reasons.
            </p>
          </Section>

          <Section title="Your choices">
            <p>You can:</p>
            <ul>
              <li>Ask what information we have about you</li>
              <li>Ask us to correct anything that is wrong</li>
              <li>Ask us to delete your information</li>
              <li>Ask us to stop contacting you</li>
            </ul>
            <p>Email us or call the number at the bottom of the page and we will take care of it.</p>
          </Section>

          <Section title="Children">
            <p>
              This site is for people looking to hire a surface restoration service and is not directed at children under 13. We do not knowingly collect information from children. If you believe a child has sent us information, contact us and we will delete it.
            </p>
          </Section>

          <Section title="Security">
            <p>
              We take reasonable steps to protect the information you send us. The site is served over HTTPS, submissions are transmitted encrypted, and access to our email account is protected by two-factor authentication. No system is perfect, and we cannot promise absolute security, but we treat your details with the care we would want for our own.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we change how we handle your information in a meaningful way, we will update this page and change the &quot;last updated&quot; date at the top. Small edits for clarity will not trigger a new date.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              For anything on this page, or to make a request about your information:
            </p>
            <ul>
              <li>
                Email:{' '}
                <a href={`mailto:${BUSINESS.email}`} className="text-[#397774] hover:underline">
                  {BUSINESS.email}
                </a>
              </li>
              <li>
                Phone:{' '}
                <a href={`tel:${BUSINESS.phone.replace(/\D/g, '')}`} className="text-[#397774] hover:underline">
                  {BUSINESS.phone}
                </a>
              </li>
              <li>Business: {BUSINESS.name}, {BUSINESS.region}</li>
            </ul>
          </Section>

          <div className="mt-12 pt-8 border-t border-[#397774]/20 text-sm text-gray-500">
            <p>
              If you have not sent us a quote request and just want to read up on what we do, the{' '}
              <Link href="/how-laser-cleaning-works" className="text-[#397774] hover:underline">
                How Laser Cleaning Works
              </Link>{' '}
              page is a good place to start.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Uniform section wrapper for the policy body. Headings and paragraph spacing
 * are set once here so the sections above stay legible source rather than
 * repeating the same Tailwind on every element.
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-4 text-gray-300 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-gray-300 [&_a]:transition-colors">
        {children}
      </div>
    </div>
  );
}
