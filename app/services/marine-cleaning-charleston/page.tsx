import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laser Marine Cleaning in Charleston, SC | Coastal Surface Restoration',
  description:
    'Laser cleaning for boats, trailers, and marine hardware in Charleston, SC. Remove rust, corrosion, and oxidation from fittings, hulls, and dock equipment without chemicals or abrasives. Free estimates.',
};

export default function MarineCleaningPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Marine Cleaning
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Marine Cleaning in Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Salt water and Lowcountry humidity are relentless on marine metal. Rust, corrosion, and oxidation take hold on fittings, trailers, and hardware fast. Laser cleaning strips it all back to clean metal without chemicals, abrasives, or the runoff you cannot use near the water.
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
            Built for a Saltwater Environment
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Charleston Harbor, the Ashley and Cooper rivers, Shem Creek, and the marinas of Mount Pleasant and the islands put metal under constant attack. Chlorides accelerate rust, galvanic corrosion eats at dissimilar metals, and oxidation dulls every exposed surface. Keeping marine hardware in service means removing that corrosion without making things worse.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Sandblasting warps thin stainless and aluminum and leaves grit in every crevice. Chemical strippers create runoff that has no place near the water. Wire wheels only reach flat surfaces and miss the pitted areas where corrosion hides.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning removes only the rust, corrosion, and oxidation layer and stops at the clean metal underneath. There is no grit, no chemical bath, and no water, so there is nothing to contain and nothing to wash into the harbor. It is a clean process in a place where clean matters.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Marine Surfaces We Clean
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Boat Trailers',
                desc: 'Frames, axles, brackets, and fasteners on aluminum and steel trailers corroded from repeated saltwater launches.',
              },
              {
                title: 'Deck Hardware & Fittings',
                desc: 'Cleats, rails, stanchions, winches, hinges, and stainless fittings that have rusted, stained, or lost their finish.',
              },
              {
                title: 'Dock & Slip Hardware',
                desc: 'Brackets, cleats, ladders, and fasteners on private docks and marina slips throughout the Charleston area.',
              },
              {
                title: 'Anchors, Chain & Ground Tackle',
                desc: 'Anchors, chain, shackles, and rigging hardware cleaned of rust and marine buildup without weakening the metal.',
              },
              {
                title: 'Engine & Mechanical Parts',
                desc: 'Brackets, mounts, and metal components where corrosion needs to come off without warping thin material.',
              },
              {
                title: 'Aluminum & Stainless Surfaces',
                desc: 'Oxidized aluminum and tea-stained stainless returned to a clean surface, ready for polish, coating, or reuse.',
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
            Laser vs. Sandblasting vs. Chemical Cleaning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                method: 'Sandblasting',
                problem: 'Warps thin stainless and aluminum, embeds grit in crevices and threads, and strips protective finishes along with the corrosion.',
                safe: false,
              },
              {
                method: 'Chemical Cleaning',
                problem: 'Creates hazardous runoff that cannot be used near the harbor or waterways, and harsh acids can pit and discolor marine alloys.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'Targets only the rust, corrosion, and oxidation. Base metal is untouched. No grit, no chemicals, no water, and nothing washed into the water.',
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
                    {item.safe ? 'Recommended' : 'Risk to Marine Metal'}
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
            Our Marine Cleaning Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'On-Site Assessment',
                desc: 'We inspect the hardware in person, identify the metal and the extent of corrosion, and confirm laser cleaning is the right approach. Work can be done dockside or at your location.',
              },
              {
                step: '02',
                title: 'Surface Preparation',
                desc: 'We set up safety perimeters and protect surrounding surfaces, gel coat, and fittings before beginning work.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes rust, corrosion, and oxidation layer by layer. Parameters are tuned to stainless, aluminum, or steel so the base metal is left intact.',
              },
              {
                step: '04',
                title: 'Surface Inspection',
                desc: 'We inspect the cleaned surface and confirm the result before completing the job. Before and after photos are taken for your records.',
              },
              {
                step: '05',
                title: 'Protection Guidance',
                desc: "Bare metal will corrode again in a saltwater environment. We can advise on protective coatings and a maintenance schedule to keep hardware in service longer.",
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
            We serve boat owners, marinas, and dock owners throughout Charleston Harbor and the Lowcountry, with dockside service wherever access allows.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Charleston Harbor',
              'Shem Creek',
              'Mount Pleasant',
              'Isle of Palms',
              "Sullivan's Island",
              'Daniel Island',
              'James Island',
              'Folly Beach',
              'Wando',
              'West Ashley',
              'Downtown Charleston',
              'Wild Dunes',
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
            Keep your marine hardware in service
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates for all jobs. Send us a photo of the hardware and we will assess it and follow up within 24 hours. Minimum job size $400.
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