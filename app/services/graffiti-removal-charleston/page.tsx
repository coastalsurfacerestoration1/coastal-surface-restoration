import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laser Graffiti Removal in Charleston, SC | Coastal Surface Restoration',
  description:
    'Laser graffiti removal in Charleston, SC. Remove spray paint from historic brick, masonry, metal, and concrete without ghosting, chemicals, or pressure washing damage. Safe for historic surfaces. Free estimates.',
};

export default function GraffitiRemovalPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Graffiti Removal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Graffiti Removal in Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Removing graffiti from historic brick and masonry is where most methods fail. Pressure washing and chemical strippers pull paint off the surface but leave a shadow behind, and on soft historic brick they cause permanent damage. Laser cleaning removes the paint completely, with no ghosting and no harm to the surface underneath.
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
            The Ghosting Problem, Solved
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            The hardest part of graffiti removal is not lifting the paint. It is doing it without leaving a mark. Pressure washing drives paint deeper into porous brick and etches a permanent outline into the surface. Chemical strippers bleed pigment into the material and leave a discolored shadow that is often more visible than the original tag.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Charleston's historic district is full of soft, hand-made brick, lime mortar, and stucco that these methods can destroy. The city's own graffiti abatement guidance warns against aggressive removal on historic masonry for exactly this reason. Once the surface is gouged or shadowed, the damage is permanent.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning removes only the paint layer. Our pulsed fiber laser vaporizes the spray paint and stops at the original surface, so there is no ghosting, no etching, and no chemical residue. It is the safest method available for graffiti on historic and heritage surfaces, and it works on modern surfaces just as well.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Surfaces We Remove Graffiti From
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Historic Brick & Masonry',
                desc: 'Soft historic brick, lime mortar, and heritage masonry throughout the Charleston peninsula, where pressure washing and chemicals cause permanent damage.',
              },
              {
                title: 'Stucco & Render',
                desc: 'Painted and unpainted stucco, render, and plaster surfaces where the goal is removing the tag without stripping the finish underneath.',
              },
              {
                title: 'Metal Gates, Doors & Signs',
                desc: 'Iron gates, steel doors, roll-up storefront shutters, utility boxes, and signage tagged with spray paint.',
              },
              {
                title: 'Concrete & Stone',
                desc: 'Retaining walls, foundations, sidewalks, stone facades, and monuments where a clean, shadow-free result matters.',
              },
              {
                title: 'Storefronts & Commercial',
                desc: 'Commercial buildings, storefronts, and mixed-use properties that need graffiti gone fast without closing the business or leaving a mark.',
              },
              {
                title: 'Wood & Painted Surfaces',
                desc: 'Painted wood, trim, and coated surfaces cleaned carefully to remove the graffiti while protecting the original coating where possible.',
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

      {/* Comparison */}
      <section className="py-16 bg-[#0a1628]">
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
                problem: 'Removes only the paint layer and stops at the original surface. No ghosting, no etching, no chemicals, no water, and no waste left behind.',
                safe: true,
              },
            ].map((item) => (
              <div
                key={item.method}
                className={`rounded-lg p-6 border ${
                  item.safe
                    ? 'bg-[#00d4d4]/5 border-[#00d4d4]/30'
                    : 'bg-[#0d1f3c] border-[#0e7c7b]/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-lg font-bold ${item.safe ? 'text-[#00d4d4]' : 'text-gray-300'}`}>
                    {item.method}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    item.safe ? 'bg-[#00d4d4]/20 text-[#00d4d4]' : 'bg-red-900/30 text-red-400'
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
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Our Graffiti Removal Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'On-Site Assessment',
                desc: 'We inspect the tagged surface in person, identify the material and paint type, and confirm laser cleaning is the right approach for the specific surface.',
              },
              {
                step: '02',
                title: 'Surface Preparation',
                desc: 'We set up safety perimeters and protect surrounding surfaces, windows, and plantings before beginning work.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes the spray paint layer by layer. Parameters are tuned to the surface so the original material is left untouched.',
              },
              {
                step: '04',
                title: 'Surface Inspection',
                desc: 'We inspect the cleaned area for any remaining shadow and confirm a clean, ghost-free result before completing the job. Before and after photos are taken for your records.',
              },
              {
                step: '05',
                title: 'Prevention Guidance',
                desc: 'For repeat-target surfaces, we can advise on anti-graffiti coatings and a maintenance plan so the next tag comes off even faster.',
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
            We remove graffiti for residential, commercial, and municipal clients throughout Charleston and the Lowcountry, with particular care for historic brick and masonry downtown.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Downtown Charleston',
              'Historic District',
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
            ].map((area) => (
              <span key={area} className="bg-[#0d1f3c] border border-[#0e7c7b]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get the graffiti gone without the shadow
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates for all jobs. Send us a photo of the tagged surface and we will assess it and follow up within 24 hours. Minimum job size $400.
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