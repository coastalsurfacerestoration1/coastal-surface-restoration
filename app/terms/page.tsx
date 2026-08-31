import Link from 'next/link';
import { pageMetadata, BUSINESS } from '@/lib/seo';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'The terms that apply when you request a quote or hire Coastal Surface Restoration: pricing, payment, scheduling, cancellations, text messages, and property access.',
  path: '/terms',
});

// Last meaningful change to these terms. Update this when the content changes,
// not on cosmetic edits.
const LAST_UPDATED = 'August 31, 2026';

// The quote form is the only place SMS consent is collected, and the carrier
// registration points at this page for the opt-in details. Keep the Text
// messages section below and the checkbox label in app/quote/page.tsx saying
// the same thing.
const CONTACT_EMAIL = 'tyler@coastalsurfacerestoration.com';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms' },
        ]}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-8 lg:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-content">
          <p className="text-gray-300 leading-relaxed mb-8">
            These are the terms you agree to when you request a quote from Coastal Surface Restoration LLC or hire us to do work. We have written them in plain English on purpose. If something here does not match what you were told, or you have a question about it, call or email us before the job starts and we will sort it out.
          </p>

          <Section title="Who we are">
            <p>
              Coastal Surface Restoration LLC is a mobile laser cleaning company based in Charleston, South Carolina, serving Charleston and the surrounding Lowcountry. On this page, &quot;we,&quot; &quot;us,&quot; and &quot;our&quot; mean Coastal Surface Restoration LLC, and &quot;you&quot; means the person or business requesting a quote or hiring us.
            </p>
          </Section>

          <Section title="Quotes and pricing">
            <p>
              Any price we give you before seeing the work in person is an estimate, not a fixed price. We base it on what you describe and any photos you send, and it is meant to give you a realistic range to plan around.
            </p>
            <p>
              <span className="text-white">Final pricing is confirmed on site</span> before we begin. When we arrive, we look at the actual surface, its size, and its condition, and we give you a firm number. Nothing starts until you approve that number. If the job turns out to be smaller or simpler than expected, the price comes down.
            </p>
            <p>
              If we find something during the work that meaningfully changes the scope, such as substrate damage hidden under a coating or an area far more built up than it looked, we stop and talk to you first. We will not run up the cost of a job without your approval.
            </p>
            <p>
              <span className="text-white">We have a $400 minimum charge per visit.</span> Getting the truck, the laser, and the operator to your property costs about the same whether the job takes one hour or three, so smaller jobs are still billed at the minimum. We will always tell you up front if your job falls under it. It is often worth bundling a few smaller items into one visit to make the trip count.
            </p>
            <p>
              Estimates are good for 30 days. After that, ask us to confirm the number is still current.
            </p>
          </Section>

          <Section title="Payment">
            <p>
              <span className="text-white">Payment is due upon completion of the work,</span> once you have looked it over and are satisfied. We accept the payment methods listed on your estimate. For larger commercial jobs or recurring accounts, we may agree to different terms in writing ahead of time.
            </p>
            <p>
              For large jobs or jobs that require special materials, we may ask for a deposit before scheduling. If we do, we will say so in the estimate, and the deposit comes off the final total.
            </p>
            <p>
              Invoices left unpaid past 30 days may accrue a late fee of 1.5% per month on the outstanding balance, and we may pause other scheduled work until the account is current.
            </p>
          </Section>

          <Section title="Scheduling and cancellations">
            <p>
              We work by appointment and confirm your window ahead of time. Because we are mobile, one job running long can move the rest of the day around. If we are going to be late, we will tell you.
            </p>
            <p>
              <span className="text-white">If you need to cancel or reschedule, give us at least 24 hours notice.</span> With that notice there is no fee at all, and we will find you a new slot.
            </p>
            <p>
              Cancellations inside 24 hours, and appointments where we arrive and cannot access the property or start the work, may be charged a trip fee to cover the reserved time and the drive. We would rather reschedule than charge you, so call as early as you can.
            </p>
            <p>
              We may need to reschedule for weather, since rain and high wind affect both safety and results. If we move your appointment, you are never charged for it, and you get first pick of the next available slot.
            </p>
          </Section>

          <Section title="Getting the property ready">
            <p>
              To do the work safely and stay on schedule, we need a few things from you before we arrive:
            </p>
            <ul>
              <li>Clear access to the surfaces being cleaned, and a place to park the vehicle reasonably close to the work</li>
              <li>Access to a standard power outlet, if we have discussed needing one for your job</li>
              <li>Vehicles, patio furniture, planters, grills, and other movable items cleared from the work area</li>
              <li>Pets kept indoors and away from the work zone for the duration</li>
              <li>Someone reachable by phone during the appointment, even if you do not need to be on site</li>
            </ul>
            <p>
              <span className="text-white">You confirm that you own the property or have permission to authorize this work.</span> If you rent, manage, or share the property, getting approval from the owner, landlord, HOA, or board is your responsibility. In Charleston&apos;s historic districts, some exterior work needs approval from the Board of Architectural Review. We are glad to talk through what the work involves, but we cannot obtain those approvals for you.
            </p>
            <p>
              Laser cleaning requires a controlled work zone. Our operators are trained to ANSI Z136.1 through the Laser Institute of America, and we set up the area accordingly. Please keep people and pets outside the marked zone while we are running, and do not look directly at the work area. If we cannot establish a safe zone, we will stop and reschedule.
            </p>
            <p>
              Tell us in advance about anything we should know: fragile or historically significant material, previous repairs, lead paint, fresh coatings, security cameras, or alarm systems.
            </p>
          </Section>

          <Section title="Text messages">
            <p>
              We use text messages to answer quote requests and coordinate appointments, because it is usually the fastest way to reach people. Texting is entirely optional.
            </p>
            <p>
              <span className="text-white">How you opt in.</span> The quote form on this website has a checkbox that reads &quot;Text me about this quote.&quot; It is unchecked by default. You are opted in only if you check it yourself, or if you text us first and ask us to follow up that way. We never add a number to texting for any other reason.
            </p>
            <p>
              <span className="text-white">What you will get.</span> Messages about your quote, scheduling and confirming your appointment, letting you know we are on the way, and following up after the work is done.
            </p>
            <p>
              <span className="text-white">How often.</span> Message frequency varies. We text as your job requires rather than on a set schedule, so most people get a handful of messages around a single job.
            </p>
            <p>
              <span className="text-white">Cost.</span> Message and data rates may apply, depending on your mobile plan. We do not charge you anything to text with us.
            </p>
            <p>
              <span className="text-white">Stopping.</span> Reply <span className="text-white">STOP</span> to any message to opt out. You will get one confirmation that you have been unsubscribed, and then nothing further. You can opt back in later by texting <span className="text-white">START</span>, or by checking the box again on a new quote request.
            </p>
            <p>
              <span className="text-white">Help.</span> Reply <span className="text-white">HELP</span> to any message for help, or reach us at{' '}
              <a href={`tel:${BUSINESS.phone.replace(/\D/g, '')}`} className="text-[#397774] hover:underline">
                {BUSINESS.phone}
              </a>{' '}
              or{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#397774] hover:underline">
                {CONTACT_EMAIL}
              </a>.
            </p>
            <p>
              <span className="text-white">Consent is not required to get service.</span> Leaving the box unchecked has no effect on your quote, your price, or your place in the schedule. We will reach you by phone or email instead.
            </p>
            <p>
              Carriers are not liable for delayed or undelivered messages. We do not sell your phone number, and we do not share it for anyone else&apos;s marketing. See our{' '}
              <Link href="/privacy" className="text-[#397774] hover:underline">
                Privacy Policy
              </Link>{' '}
              for the full picture on how we handle your information.
            </p>
          </Section>

          <Section title="Photos of completed work">
            <p>
              We photograph our work, before and after, and occasionally record video. We may use that material on our website, on social media, and in marketing. It is how a young company shows what laser cleaning actually does.
            </p>
            <p>
              <span className="text-white">You can opt out, and it costs you nothing.</span> Tell us before or after the job and we will not publish anything from your property. Email or text is fine. If something is already posted and you want it taken down, ask and we will remove it.
            </p>
            <p>
              When we do publish, we show the surface and the work. We do not include your name, your address, or anything else that identifies the property without asking you first. Photos we take remain our property, and we do not sell them or license them to anyone else.
            </p>
          </Section>

          <Section title="Our work and what we can promise">
            <p>
              We stand behind our work. If something is not right, tell us within 7 days and we will come back and make it right at no charge.
            </p>
            <p>
              What we can promise is that we will do the work carefully, with trained operators and settings appropriate for your surface. What we cannot promise is a specific cosmetic result on every material. Laser cleaning removes rust, coatings, and contamination from the surface. It does not repair what is underneath. Cleaning sometimes reveals pitting, prior repairs, mismatched patches, or thin spots that the dirt or paint was hiding. That is the condition of the material rather than damage from the work, and we will point it out when we see it.
            </p>
            <p>
              We are insured. If we damage your property through our own negligence, we will make it right through our insurance. Please report any damage to us within 7 days of the appointment so we can document it while the circumstances are still clear.
            </p>
            <p>
              Beyond that, our responsibility is limited to the amount you paid us for the job in question. We are not responsible for indirect or consequential losses such as lost rental income, lost business, or delays to other work. We are also not responsible for pre-existing conditions, for damage caused by a defect you did not tell us about, or for the condition of materials that were already failing before we arrived. Nothing here limits liability that the law does not allow us to limit.
            </p>
            <p>
              We may decline or stop a job if the surface is not a good candidate for laser cleaning, if the site cannot be made safe, or if conditions turn out to be materially different from what was described. If we stop before doing any work, you owe nothing.
            </p>
          </Section>

          <Section title="Using this website">
            <p>
              The text, photos, and design on this site belong to us. You are welcome to link to the site or share it. Please do not copy the content wholesale for another business. The information here is offered in good faith to help you understand the service, and it is not a substitute for an on-site assessment of your specific property.
            </p>
          </Section>

          <Section title="Resolving problems">
            <p>
              If you are unhappy with something, contact us first. Almost everything gets solved with a phone call and a return visit, and we would much rather fix a problem than argue about it.
            </p>
            <p>
              These terms are governed by the laws of the State of South Carolina. Any dispute that cannot be resolved between us will be handled in the state or federal courts of Charleston County, South Carolina.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              We may update this page as the business changes. The terms that apply to your job are the ones posted when you approved the work. Meaningful changes will update the &quot;last updated&quot; date at the top. Small edits for clarity will not.
            </p>
          </Section>

          <Section title="Contact us">
            <p>Questions about any of this:</p>
            <ul>
              <li>
                Email:{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#397774] hover:underline">
                  {CONTACT_EMAIL}
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
              For how we handle the information you send us, see the{' '}
              <Link href="/privacy" className="text-[#397774] hover:underline">
                Privacy Policy
              </Link>
              . Ready to get started? Request a{' '}
              <Link href="/quote" className="text-[#397774] hover:underline">
                free quote
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Uniform section wrapper for the terms body. Deliberately mirrors the one in
 * the privacy policy so the two legal pages stay visually identical as either
 * is edited.
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
