import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';
import ServiceAreaChips from '@/app/components/ServiceAreaChips';

export const metadata = pageMetadata({
  title: 'Laser Cleaning for Vacation Rentals in Charleston, SC',
  description:
    'Laser cleaning and surface restoration for vacation rentals and property managers in Charleston, Isle of Palms, Sullivan\'s Island, and Folly Beach. Rust, railings, and curb appeal on a maintenance schedule. Free estimates.',
  path: '/services/vacation-rental-cleaning-charleston',
});

export default function VacationRentalPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Vacation Rental Restoration', path: '/services/vacation-rental-cleaning-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Vacation Rental Surface Restoration',
          description: "Laser cleaning and surface restoration for vacation rentals and property managers in Charleston, Isle of Palms, Sullivan\'s Island, and Folly Beach. Rust, railings, and curb appeal on a maintenance schedule. Free estimates.",
          path: '/services/vacation-rental-cleaning-charleston',
          serviceType: 'Vacation rental maintenance',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Vacation Rental Restoration
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Cleaning for Charleston Vacation Rentals
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            On the islands, salt air rusts railings, corrodes hardware, and dulls fixtures faster than anywhere inland. For a rental, that damage shows up in the photos and the reviews. We clean rental railings and hardware on Isle of Palms, Sullivan&apos;s Island and Folly Beach, scheduled around your turnovers.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#397774] text-white px-8 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Built for Owners and Property Managers
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            A vacation rental lives and dies by its curb appeal and its photos. Rusted railings, corroded light fixtures, stained entryways, and a weathered exterior cost you bookings and show up in guest reviews. On a coastal property, that decline is constant, and touching it up between every guest is not realistic.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            This page is for individual owners and for property managers with several units. A laser cleans metal with no chemicals or water, so the work fits around your calendar.
          </p>
          <p className="text-gray-400 leading-relaxed">
            For managers with a portfolio, we can set up a recurring maintenance schedule so railings, fixtures, and entryways are handled on a regular cadence instead of only when they have already gotten bad.
          </p>
        </div>
      </section>

      {/* What We Handle */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Handle at Rental Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Railings & Balconies',
                desc: 'Rust and failed paint stripped from steel railings and stair rails, primed the same day so they are ready to paint. Homes built before 1978 need a lead test first.',
              },
              {
                title: 'Exterior Light Fixtures & Hardware',
                desc: 'Solid brass, bronze and stainless fixtures, house numbers and door hardware cleaned, tested on a hidden spot first. Plated and aluminum pieces we decline.',
              },
              {
                title: 'Entryways & Steps',
                desc: 'Rust stains and paint drips on hard brick or unsealed concrete entry steps, tested on a patch first.',
              },
              {
                title: 'Outdoor Furniture & Fixtures',
                desc: 'Steel and iron patio furniture, grill grates and gates cleaned with no chemicals near the pool.',
              },
              {
                title: 'Stainless Rails & Fixtures',
                desc: 'Tea staining off stainless cable rails, posts and light fixtures, the brown bloom island salt air leaves.',
              },
              {
                title: 'Brick & Masonry',
                desc: 'Paint overspray on hard brick and unsealed concrete, small areas, test first. Stucco we do not quote yet.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#0e273e] border border-[#397774]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why laser for rentals */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Laser Cleaning Fits a Rental Operation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'No Water or Blast Media',
                desc: 'No sand to sweep out of the pool and no chemical runoff. We extract the dust and fume and vacuum before we leave.',
              },
              {
                title: 'Works Around Turnovers',
                desc: 'Scheduled between bookings. The work area is roped off and no one, crew included, is inside it while the laser runs.',
              },
              {
                title: 'Recurring Maintenance',
                desc: 'Set a regular cadence for coastal properties so surfaces are maintained before they decline, not after.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#1a3958] border border-[#397774]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Service Area</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            We serve vacation rental owners and property managers across the Charleston coast, with a focus on the barrier islands where salt air takes the heaviest toll.
          </p>
          <ServiceAreaChips
            areas={[
              'Isle of Palms',
              "Sullivan's Island",
              'Folly Beach',
              'Wild Dunes',
              'West Ashley',
              'Summerville',
              'Mount Pleasant',
              'Downtown Charleston',
              'James Island',
              'Daniel Island',
              'North Charleston',
            ]}
            variant="onLight"
          />
        </div>
      </section>

      <Faq
        path='/services/vacation-rental-cleaning-charleston'
        items={[
          {
            q: 'Can you work around guest turnovers?',
            a:
              'Yes, that is how most rental work is scheduled. The process is dry, so polished brass or stainless is usable as soon as we finish. Stripped steel needs primer the same day, so plan for paint dry time. That makes a turnover window workable.',
          },
          {
            q: 'Do you offer recurring maintenance for rental properties?',
            a:
              'Yes. Island salt air stains stainless and brass on a predictable cycle, so scheduled visits keep them clean between repaints. We can quote a recurring schedule for a single property or a managed portfolio.',
          },
          {
            q: 'Will guests notice any smell or residue?',
            a:
              'Not if we finish a day ahead. Burning paint has a smell while we work, so we run fume extraction, vacuum the dust with a HEPA vacuum and bag any paint chips before we leave.',
          },
          {
            q: 'What does this actually fix in listing photos?',
            a:
              'Corroded steel railings and stair hardware, tea-stained stainless rails, and dull solid brass or bronze fixtures. Those are the details that read as neglect in photos even when the interior is spotless.',
          },
          {
            q: 'What about older painted railings and trim?',
            a:
              'Painted surfaces on homes built before 1978 need a lead test before we start. We do not laser paint on pre-1978 homes or child-occupied buildings unless a lead test comes back negative; we refer it to an EPA RRP certified firm.',
          },
          {
            q: 'Do you work with property management companies?',
            a:
              'Yes. We can cover multiple properties on one schedule and coordinate access with your turnover crew so the owner does not need to be there. We need a signed work authorization before the first visit.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Related Services"
        intro="Island rental properties usually need more than one thing done at a time. These services often fit the same visit."
        items={[
          {
            title: 'Marine Cleaning',
            desc: 'Stainless and bronze boat hardware cleaned on land or on the bench.',
            href: '/services/marine-cleaning-charleston',
          },
          {
            title: 'Rust and Paint Removal',
            desc: 'Salt rust removed from steel and iron railings, gates and hardware, ready for primer.',
            href: '/services/rust-removal-charleston',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Keep your rental guest-ready
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Managing multiple properties? Ask about a recurring maintenance schedule. Send us a photo or your property details and we will follow up within one business day.
          </p>
          <Link
            href="/quote"
            className="bg-[#397774] text-white px-10 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Request a Free Quote
          </Link>
        </div>
      </section>

    </div>
  );
}