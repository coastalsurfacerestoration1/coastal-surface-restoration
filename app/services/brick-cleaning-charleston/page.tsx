import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';
import ServiceAreaChips from '@/app/components/ServiceAreaChips';

// Unpublished: the route stays live, but search engines are told to skip it.
export const metadata = {
  ...pageMetadata({
    title: 'Laser Cleaning for Modern Brick in Charleston, SC',
    description:
      'Soot, overspray and dark graffiti lifted from hard-fired modern brick, small areas only, after a signed test patch. Historic soft brick is referred to a conservator.',
    path: '/services/brick-cleaning-charleston',
  }),
  robots: { index: false, follow: false },
};

export default function BrickCleaningPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Brick & Masonry Cleaning', path: '/services/brick-cleaning-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Cleaning for Modern Brick',
          description: 'Soot, overspray and dark graffiti lifted from hard-fired modern brick, small areas only, after a signed test patch. Historic soft brick is referred to a conservator.',
          path: '/services/brick-cleaning-charleston',
          serviceType: 'Masonry cleaning',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Brick & Masonry Cleaning
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Cleaning for Modern Brick in Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Charleston&apos;s handmade historic brick is soft and easy to ruin, and we do not laser it. We work on hard-fired brick from about 1950 on: fireplace soot, paint overspray and dark tags, small areas, with a test patch you approve first.
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
            Why We Refer Historic Brick Out
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Brick on the peninsula&apos;s older homes was fired in the 1700s and 1800s with a hard skin over a soft core. Once that skin is gone the brick soaks up water and spalls. Laser heat can gray or glaze it too, so we send that work to a masonry conservator.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Efflorescence, the white crystalline haze on brick and stucco, is salt carried to the surface by water moving through the wall. It is a moisture problem first. Acid scrubbing etches the masonry and the salt comes back, and it would come back after a laser cleaning too, because neither one stops the water. We do not take efflorescence jobs. We can dry brush a spot and point out where the water is likely getting in, so you can call a mason.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning removes surface contamination without water, chemicals, or abrasion. On hard-fired brick the laser can lift soot and some paint, but too much energy grays or glazes the face. We test a 6 by 6 inch patch first and stop at the first color shift.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Masonry Surfaces We Clean
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Fireplace Surrounds',
                desc: 'Soot and smoke film on brick or stone fireplace surrounds and chimney breasts, tested on a small patch first.',
              },
              {
                title: 'Paint on Brick',
                desc: 'Small areas of latex overspray or spills on hard-fired brick, with the laser plus other methods. Test patch first. We do not take brick that was already chemically stripped, or paint on pre-1978 homes.',
              },
              {
                title: 'Brick Stoops & Steps',
                desc: 'Rust stains and paint drips on hard-fired brick steps, tested on a patch first. Marble and limestone thresholds go to a stone conservator.',
              },
              {
                title: 'Stone & Stucco',
                desc: 'Not offered yet. We have not tested stucco or natural stone enough to quote it, and old painted stucco may contain lead.',
              },
              {
                title: 'Chimneys',
                desc: 'Soot and smoke staining on hard-fired chimney brick, tested on a patch first. Historic soft brick chimneys are referred out.',
              },
              {
                title: 'Garden & Retaining Walls',
                desc: 'Dark graffiti or paint drips on a section of a hard brick or block wall. Whole-wall cleaning goes to a pressure washing crew.',
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

      {/* Comparison */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Laser vs. Pressure Washing vs. Acid Cleaning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                method: 'Pressure Washing',
                problem: 'Strips the hard fired skin off historic brick, erodes lime mortar joints, and drives water deep into the wall, leading to spalling and long-term damage.',
                safe: false,
              },
              {
                method: 'Acid Cleaning',
                problem: 'Etches and burns masonry and discolors brick, and it leaves hazardous runoff behind.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'No water, no acid and no blast media. On hard-fired brick it can stop at the face if the settings are right, which is why a test patch comes first. Not for soft historic brick.',
                safe: true,
              },
            ].map((item) => (
              <div
                key={item.method}
                className={`rounded-lg p-6 border ${
                  item.safe
                    ? 'bg-[#397774]/5 border-[#397774]/30'
                    : 'bg-[#1a3958] border-[#397774]/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-lg font-bold ${item.safe ? 'text-[#397774]' : 'text-gray-300'}`}>
                    {item.method}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    item.safe ? 'bg-[#397774]/20 text-[#397774]' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {item.safe ? 'Hard brick only' : 'Can damage brick'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Our Masonry Cleaning Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'On-Site Assessment',
                desc: 'We inspect the masonry in person, identify the type of brick or stone and the staining, and confirm laser cleaning is appropriate for the surface and its age.',
              },
              {
                step: '02',
                title: 'Test Patch',
                desc: 'On hard-fired brick we clean a 6 by 6 inch test patch under a signed authorization, and you approve the result before any quote.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes soot and paint in light passes at the setting the test patch proved, and we stop at the first color change.',
              },
              {
                step: '04',
                title: 'Surface Inspection',
                desc: 'We inspect the cleaned surface and confirm the result before completing the job. Before and after photos are taken for your records.',
              },
              {
                step: '05',
                title: 'Moisture Guidance',
                desc: 'We do not take efflorescence (white salt bloom) jobs. If we see it, we point out where the water is likely getting in so you can call a mason.',
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
            We work on modern hard-fired brick at homes and businesses around Charleston, Mount Pleasant, West Ashley, James Island and North Charleston.
          </p>
          <ServiceAreaChips
            areas={[
              'West Ashley',
              'North Charleston',
              'Mount Pleasant',
              'James Island',
              'Daniel Island',
              'Summerville',
            ]}
          />
        </div>
      </section>

      <Faq
        path='/services/brick-cleaning-charleston'
        items={[
          {
            q: "Is laser cleaning safe for Charleston's historic brick?",
            a:
              'Not for soft handmade brick, so we do not take it. Pre-1900 peninsula brick and lime mortar go to a masonry conservator. We work on hard-fired brick from about 1950 on, and only after a test patch.',
          },
          {
            q: 'Do you remove efflorescence?',
            a:
              'No. Efflorescence is salt that water carries out of the masonry, so it is a moisture problem first. A laser can lift the deposit, but the salt returns as long as the water keeps moving, and charging you for that would not be honest. We can dry brush a spot and tell you where the water is likely coming from.',
          },
          {
            q: 'Will it damage lime mortar joints?',
            a:
              'Lime mortar is softer than the brick around it and is the first thing to fail under pressure washing. We keep the beam off lime mortar joints and mask them. Any coating that crosses a joint is finished by hand.',
          },
          {
            q: 'Can you clean painted brick?',
            a:
              'Sometimes, on small areas of hard-fired brick, using the laser plus other methods. Brick that was already chemically stripped, and paint on pre-1978 homes, we decline. Whole walls go to a masonry restoration company.',
          },
          {
            q: 'Do you clean stucco and stone as well?',
            a:
              'Not yet. We have not tested stucco or cast stone enough to quote them. Unsealed concrete with paint overspray is something we do take.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Related Services"
        intro="Other work that often sits on the same building as the brick."
        items={[
          {
            title: 'Graffiti Removal',
            desc: 'Dark tags on hard, non-historic brick and block, tested on a patch first. Silver and metallic paint on masonry we decline.',
            href: '/services/graffiti-removal-charleston',
          },
          {
            title: 'Commercial Exterior Cleaning',
            desc: 'Storefront railings, stainless handrails and metal fixtures, scheduled around your hours.',
            href: '/services/commercial-exterior-cleaning-charleston',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            See a test patch on your brick first
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates for all jobs. Send us a photo of the masonry and we will assess it and follow up within one business day.
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