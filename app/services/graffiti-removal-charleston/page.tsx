import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';
import ServiceAreaChips from '@/app/components/ServiceAreaChips';

export const metadata = pageMetadata({
  title: 'Laser Graffiti Removal in Charleston, SC',
  description:
    'Laser graffiti removal in Charleston, SC. Dark spray paint lifted from painted steel, hard modern brick, block and unsealed concrete, with no chemical strippers. A test patch comes first, before any quote. Free estimates.',
  path: '/services/graffiti-removal-charleston',
});

export default function GraffitiRemovalPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Graffiti Removal', path: '/services/graffiti-removal-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Graffiti Removal',
          description: 'Laser graffiti removal in Charleston, SC. Dark spray paint lifted from painted steel, hard modern brick, block and unsealed concrete, with no chemical strippers. A test patch comes first, before any quote. Free estimates.',
          path: '/services/graffiti-removal-charleston',
          serviceType: 'Graffiti removal',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Graffiti Removal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Graffiti Removal in Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Dark tags on steel doors, hard modern brick and block are the graffiti jobs a laser handles best. Black, blue and green paint usually lift cleanly. Silver and metallic paint on masonry do not, and soft historic brick we refer out. Results vary by paint, so we test a patch first and show you the result before quoting the full job.
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
            Why Ghosting Happens
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            The hardest part of graffiti removal is not lifting the paint. It is doing it without leaving a mark. Pressure washing drives paint deeper into porous brick and etches a permanent outline into the surface. Chemical strippers bleed pigment into the material and leave a discolored shadow that is often more visible than the original tag.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Soft handmade brick, lime mortar and old stucco are easy to damage with any method, the laser included. On those surfaces we refer you to a masonry conservator.
          </p>
          <p className="text-gray-400 leading-relaxed">
            At the right setting the laser lifts dark spray paint and leaves hard brick and steel as they were. Silver and metallic paint on masonry we decline. Red and yellow often leave a stain, so those get a test patch before any quote. Every graffiti job starts with a test patch, and you see the result before we quote the full job.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Surfaces We Remove Graffiti From
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Hard Brick & Block',
                desc: 'Dark tags on post-1950 brick, concrete block and hard stone walls, tested on a patch first.',
              },
              {
                title: 'Stucco',
                desc: 'Not offered yet. We have not tested stucco enough to quote it.',
              },
              {
                title: 'Metal Gates, Doors & Signs',
                desc: 'Painted steel doors, iron and steel gates, and steel shutters. Aluminum and galvanized surfaces we check on site before saying yes.',
              },
              {
                title: 'Concrete & Stone',
                desc: 'Retaining walls, foundations and unsealed concrete on private property, tested on a patch first.',
              },
              {
                title: 'Storefronts & Commercial',
                desc: 'Storefronts and mixed-use buildings, worked before opening or after close with the area roped off.',
              },
              {
                title: 'Painted Wood Trim',
                desc: 'Tags on exterior wood trim are sanded off by hand and spot-primed, since the laser is too slow on painted wood. Older painted wood needs a negative lead test first.',
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
            Laser vs. Pressure Washing vs. Chemical Removal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                method: 'Pressure Washing',
                problem: 'Drives paint deeper into porous brick, etches a permanent outline, and erodes soft historic masonry and mortar joints. Leaves a visible shadow.',
                safe: false,
              },
              {
                method: 'Chemical Removal',
                problem: "Bleeds pigment into the surface and leaves a discolored ghost. Creates hazardous runoff near Charleston's waterways and historic gardens.",
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'No chemical strippers and no water. The removed paint becomes dust and fume that we extract and clean up.',
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
                    {item.safe ? 'Recommended' : 'Risk of Ghosting & Damage'}
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
            Our Graffiti Removal Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'On-Site Assessment',
                desc: 'We inspect the tagged surface in person, identify the material and the paint, and run a small test patch. You see that result before we quote the full job.',
              },
              {
                step: '02',
                title: 'Surface Preparation',
                desc: 'We set up safety perimeters and protect surrounding surfaces, windows, and plantings before beginning work.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes the spray paint layer by layer. We run the setting the test patch proved and stop at the first color change.',
              },
              {
                step: '04',
                title: 'Surface Inspection',
                desc: 'We check the cleaned area in raking light for any remaining shadow before finishing, and send you before and after photos for your records.',
              },
              {
                step: '05',
                title: 'Prevention Guidance',
                desc: 'For repeat-target surfaces, we can advise on anti-graffiti coatings and a maintenance plan so the next tag is easier to remove.',
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
            We remove graffiti for homeowners, businesses and property managers around Charleston. Soft historic brick downtown we refer to a conservator.
          </p>
          <ServiceAreaChips
            areas={[
              'Downtown Charleston',
              'King Street',
              'Upper Peninsula',
              'Mount Pleasant',
              'West Ashley',
              'James Island',
              'North Charleston',
              'Daniel Island',
              'Folly Beach',
              "Sullivan's Island",
              'Isle of Palms',
              'Summerville',
            ]}
          />
        </div>
      </section>

      <Faq
        path='/services/graffiti-removal-charleston'
        items={[
          {
            q: 'How quickly can you remove graffiti?',
            a:
              'Usually two short visits: a test patch with your signed approval, then the removal. We book graffiti as soon as the schedule allows, because paint left in the sun bonds harder.',
          },
          {
            q: 'Will there be a shadow or ghost left behind?',
            a:
              'It can. Porous brick holds pigment, and a cleaned patch can look lighter than the wall around it. The test patch shows you how much shadow to expect before you pay for anything.',
          },
          {
            q: 'Does it work on every color of spray paint?',
            a:
              'No, and it is better to know that before you pay for anything. Dark spray paints come off well. Silver and metallic paint on brick or stone we decline. Reds and yellows often leave a stain, so we test a patch first and show you the result before quoting.',
          },
          {
            q: 'Is it safe on historic brick and stucco?',
            a:
              'No. Soft historic brick and lime mortar can gray or glaze under a laser, and we have not tested stucco enough. We refer those to a masonry conservator.',
          },
          {
            q: 'Can you remove graffiti without stripping the paint underneath?',
            a:
              'Sometimes. Where a tag sits on top of a sound coating there is often enough difference between the two for the process to lift one and leave the other. Where the paints are too similar, the honest answer is that the area will need repainting, and we will tell you that up front.',
          },
          {
            q: 'Do you work with property managers on repeat vandalism?',
            a:
              'Yes. For frontage that gets hit repeatedly we can set a standing price per visit so you are not waiting on a new quote each time.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Related Services"
        intro="Graffiti almost never lands on a clean wall. These services often fit the same visit."
        items={[
          {
            title: 'Rust and Paint Removal',
            desc: 'Rust and failed paint off steel doors, gates and railings, primed the same day.',
            href: '/services/rust-removal-charleston',
          },
          {
            title: 'Commercial Exterior Cleaning',
            desc: 'Storefronts and property maintained on schedules that work around your hours.',
            href: '/services/commercial-exterior-cleaning-charleston',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            See a test patch before you commit
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates. Send us a photo of the tagged surface and we will follow up within one business day, then test a patch on site before quoting the full job.
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