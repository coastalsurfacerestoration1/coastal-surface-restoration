import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';

export const metadata = pageMetadata({
  title: 'Commercial Exterior Laser Cleaning in Charleston, SC',
  description:
    'Laser cleaning for commercial exteriors in Charleston, SC. Restore storefronts, railings, gates, signage, and metal fixtures without chemicals, water, or downtime. Free estimates for businesses and property managers.',
  path: '/services/commercial-exterior-cleaning-charleston',
});

export default function CommercialExteriorPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
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
          description: 'Laser cleaning for commercial exteriors in Charleston, SC. Restore storefronts, railings, gates, signage, and metal fixtures without chemicals, water, or downtime. Free estimates for businesses and property managers.',
          path: '/services/commercial-exterior-cleaning-charleston',
          serviceType: 'Commercial exterior cleaning',
        })}
      />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Commercial Exteriors
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Commercial Exterior Laser Cleaning in Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Your storefront is the first thing customers see. Rusted railings, corroded fixtures, and a weathered facade quietly cost you foot traffic. Laser cleaning restores commercial metal and masonry without chemicals, water, or the downtime of a full shutdown.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#00d4d4] text-[#0a1628] px-8 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Context */}
      <section className="py-16 bg-[#0a1628]">
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
            Laser cleaning is dry, self-contained, and precise. There is no water, no chemical runoff, and no mess to rope off, so we can work around your hours and leave the entrance customer-ready. It is a clean, low-disruption way to keep a commercial property looking its best.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Commercial Surfaces We Restore
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Storefront Metal & Railings',
                desc: 'Entry railings, handrails, window frames, and metal trim on retail and restaurant storefronts throughout Charleston.',
              },
              {
                title: 'Gates, Doors & Roll-Up Shutters',
                desc: 'Iron gates, steel doors, and roll-up security shutters cleaned of rust, grime, and graffiti.',
              },
              {
                title: 'Signage & Fixtures',
                desc: 'Metal signage, brackets, light fixtures, house numbers, and exterior hardware restored to a clean finish.',
              },
              {
                title: 'Patio & Outdoor Furniture',
                desc: 'Metal patio furniture frames, railings, and fixtures for restaurants and hospitality outdoor spaces.',
              },
              {
                title: 'Facades & Masonry',
                desc: 'Brick, stucco, and stone facades cleaned of grime, efflorescence, and staining without pressure washing damage.',
              },
              {
                title: 'Property Management Portfolios',
                desc: 'Recurring exterior maintenance across multiple units or locations, handled on a schedule that fits your operations.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#0a1628] border border-[#0e7c7b]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why laser for commercial */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Businesses Choose Laser Cleaning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Low Disruption',
                desc: 'Dry and self-contained. No water, no roped-off walkways, no fumes. We work around your hours and your customers.',
              },
              {
                title: 'No Chemical Runoff',
                desc: 'Nothing to wash into storm drains or Charleston\'s waterways. A clean process that keeps you compliant and mess-free.',
              },
              {
                title: 'Scheduled Maintenance',
                desc: 'Set a recurring cadence so your exterior is maintained before it declines, protecting your curb appeal year round.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-[#0d1f3c]">
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
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes rust, grime, and graffiti from metal and masonry with safety perimeters in place.',
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
                <div className="text-[#00d4d4] font-bold text-2xl w-10 shrink-0">{item.step}</div>
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
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Service Area</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            We serve retail, restaurant, hospitality, and office properties, plus property management companies, throughout Charleston and the Lowcountry.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'King Street',
              'Downtown Charleston',
              'Historic District',
              'Upper Peninsula',
              'Mount Pleasant',
              'West Ashley',
              'James Island',
              'North Charleston',
              'Daniel Island',
              'Summerville',
              'Isle of Palms',
              "Sullivan's Island",
            ].map((area) => (
              <span key={area} className="bg-[#0d1f3c] border border-[#0e7c7b]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Faq
        path='/services/commercial-exterior-cleaning-charleston'
        items={[
          {
            q: 'Can you work outside of business hours?',
            a:
              'Yes. Storefront and restaurant work is usually scheduled early morning, at night, or on a closed day. There is no wet surface, cure time, or chemical odor afterward, so the space is ready to open as soon as we finish.',
          },
          {
            q: 'Do you need water or drainage access?',
            a:
              'No. The process is dry, which is the practical advantage on a sidewalk or a shared plaza. There is no runoff to contain, no wash water to route into a storm drain, and no wet walking surface left behind for customers.',
          },
          {
            q: 'Can you handle multiple properties under one contract?',
            a:
              'Yes. For property managers and multi-site operators we can quote a portfolio and set a recurring schedule, so exterior metal and signage stay ahead of corrosion rather than being addressed once it is visible from the street.',
          },
          {
            q: 'What commercial surfaces does this work on?',
            a:
              'Storefront metal and railings, roll-up shutters and gates, signage and fixtures, patio furniture, awning frames, and masonry facades. Anything on the exterior where corrosion or soiling affects how the property presents.',
          },
          {
            q: 'Do you provide documentation for property records?',
            a:
              'Yes. We can supply before and after documentation for maintenance records, insurance, or ownership reporting.',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-16 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Keep your storefront sharp
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Managing one location or many? Ask about a recurring maintenance schedule. Send us photos or your property details and we will follow up within 24 hours. Minimum job size $400.
          </p>
          <Link
            href="/quote"
            className="bg-[#00d4d4] text-[#0a1628] px-10 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors"
          >
            Request a Free Quote
          </Link>
        </div>
      </section>

    </div>
  );
}