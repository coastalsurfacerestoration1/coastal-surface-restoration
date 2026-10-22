import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';
import ServiceAreaChips from '@/app/components/ServiceAreaChips';

export const metadata = pageMetadata({
  title: 'Commercial Exterior Laser Cleaning in Charleston, SC',
  description:
    'Laser cleaning for commercial exteriors in Charleston, SC. Rust and paint off storefront railings and gates, heat tint and tea staining off stainless handrails, and solid brass pulls cleaned, with no chemical strippers or water. Free estimates for businesses and property managers.',
  path: '/services/commercial-exterior-cleaning-charleston',
});

export default function CommercialExteriorPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Commercial Exteriors', path: '/services/commercial-exterior-cleaning-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Commercial Exterior Laser Cleaning',
          description: 'Laser cleaning for commercial exteriors in Charleston, SC. Rust and paint off storefront railings and gates, heat tint and tea staining off stainless handrails, and solid brass pulls cleaned, with no chemical strippers or water. Free estimates for businesses and property managers.',
          path: '/services/commercial-exterior-cleaning-charleston',
          serviceType: 'Commercial exterior cleaning',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Commercial Exteriors
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Commercial Exterior Laser Cleaning in Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Your storefront is the first thing customers see. Rusted railings, corroded fixtures, and a weathered facade quietly cost you foot traffic. A laser takes rust and old paint off steel railings and gates, and stain off stainless handrails, with no chemical strippers or water. We rope off a small work area and keep the rest of the entrance open.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#397774] text-white px-8 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Context */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Curb Appeal, Without the Disruption
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Charleston&apos;s business districts run on appearances. King Street retail, downtown restaurants, hotels, and offices are judged the moment a customer walks up. In the Lowcountry&apos;s salt air, exterior metal rusts and fixtures corrode fast, and a tired-looking entrance sends the wrong message before anyone reaches the door.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            The problem with maintaining a commercial exterior is usually the disruption. Pressure washing means water everywhere and closed-off walkways. Chemical cleaning means fumes, runoff, and warning signs during business hours. Neither is a good look while you are trying to serve customers.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning is dry, self-contained, and precise. There is no water or chemical runoff. We rope off the work area with eyewear rules, extract the dust and fume, and vacuum before we leave. It is a clean, low-disruption way to keep a commercial property looking its best.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Commercial Surfaces We Restore
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Storefront Metal & Railings',
                desc: 'Steel entry railings and stainless handrails on retail and restaurant storefronts. Aluminum window frames we do not quote yet.',
              },
              {
                title: 'Gates, Doors & Roll-Up Shutters',
                desc: 'Rust and old paint come off iron gates and steel doors. Galvanized and aluminum shutters we check on site first. For graffiti on them, we test a patch first and show you the result before quoting.',
              },
              {
                title: 'Signage & Fixtures',
                desc: 'Steel brackets, solid brass and bronze plaques, pulls and house numbers, tested on a hidden spot first. Brass-plated and aluminum pieces we decline.',
              },
              {
                title: 'Patio & Outdoor Furniture',
                desc: 'Steel and iron patio furniture, rails and grill grates for restaurant patios.',
              },
              {
                title: 'Stainless & Brass Entrances',
                desc: 'Heat tint and tea staining off stainless handrails, and failed lacquer and tarnish off solid brass door pulls, tested first.',
              },
              {
                title: 'Property Management Portfolios',
                desc: 'Stainless and brass entrances cleaned on a set schedule, quoted per location.',
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

      {/* Why laser for commercial */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Businesses Choose Laser Cleaning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Low Disruption',
                desc: 'Dry, with no water on the sidewalk. We rope off a small area, run fume extraction and work around your hours.',
              },
              {
                title: 'No Chemical Runoff',
                desc: 'Nothing to wash into storm drains or the harbor. Dust and paint chips are vacuumed and bagged before we leave.',
              },
              {
                title: 'Scheduled Maintenance',
                desc: 'Set a recurring cadence so stainless and brass get cleaned before stains set in.',
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

      {/* Process */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Our Commercial Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Walkthrough & Quote',
                desc: 'We assess the exterior in person, identify the surfaces and their condition, and provide a clear quote. For portfolios, we can scope multiple locations at once.',
              },
              {
                step: '02',
                title: 'Scheduling Around Your Hours',
                desc: 'We plan the work around your business hours and foot traffic, including early morning or off-peak windows where needed.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes rust, old paint and dark graffiti from metal, and tested spots on hard brick, with the work area roped off.',
              },
              {
                step: '04',
                title: 'Inspection & Records',
                desc: 'We inspect the finished work and provide before and after photos, useful for property management records and ownership reporting.',
              },
              {
                step: '05',
                title: 'Ongoing Maintenance',
                desc: 'For businesses and managers who want it, we set up a recurring schedule so the exterior stays sharp without you having to track it.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="text-[#397774] font-bold text-2xl w-10 shrink-0">{item.step}</div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Service Area</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            We serve retail, restaurant, hospitality, and office properties, plus property management companies, throughout Charleston and the Lowcountry.
          </p>
          <ServiceAreaChips
            areas={[
              'King Street',
              'Downtown Charleston',
              'Upper Peninsula',
              'Mount Pleasant',
              'West Ashley',
              'James Island',
              'North Charleston',
              'Daniel Island',
              'Summerville',
              'Isle of Palms',
              "Sullivan's Island",
              'Folly Beach',
            ]}
          />
        </div>
      </section>

      <Faq
        path='/services/commercial-exterior-cleaning-charleston'
        items={[
          {
            q: 'Can you work outside of business hours?',
            a:
              'Yes. We schedule early morning, evening or on a closed day, in daylight or with full work lighting. Bare steel gets primed the same day, so plan for paint dry time if we strip a railing.',
          },
          {
            q: 'Do you need water or drainage access?',
            a:
              'No. The process is dry, which is the practical advantage on a sidewalk or a shared plaza. There is no runoff to contain, no wash water to route into a storm drain, and no wet walking surface left behind for customers.',
          },
          {
            q: 'Can you handle multiple properties under one contract?',
            a:
              'Yes. For property managers and multi-site operators we can quote a portfolio and set a recurring schedule, so stainless and brass are cleaned on a set cadence instead of after stains show from the street.',
          },
          {
            q: 'What commercial surfaces does this work on?',
            a:
              'Steel railings and gates, stainless handrails, solid brass pulls and plaques, steel patio furniture and grill grates. Aluminum, plated finishes and whole facades we do not take.',
          },
          {
            q: 'Do you provide documentation for property records?',
            a:
              'Yes. We can supply before and after documentation for maintenance records, insurance, or ownership reporting.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Related Services"
        intro="Commercial jobs rarely stop at one surface. These services often fit the same visit."
        items={[
          {
            title: 'Rust and Paint Removal',
            desc: 'Iron and steel stripped to clean metal for railings and gates, ready for primer the same day.',
            href: '/services/rust-removal-charleston',
          },
          {
            title: 'Graffiti Removal',
            desc: 'The laser lifts dark tags from steel and hard modern brick. Some colors leave a shadow, which the test patch shows. We test a patch first and show you the result before quoting.',
            href: '/services/graffiti-removal-charleston',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Keep your storefront sharp
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Managing one location or many? Ask about a recurring maintenance schedule. Send us photos or your property details and we will follow up within one business day.
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