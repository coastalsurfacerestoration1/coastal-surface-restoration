import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Historic Ironwork Restoration in Charleston, SC | Coastal Surface Restoration',
  description:
    'Laser cleaning for historic ironwork, wrought iron gates, and antique metalwork in Charleston, SC. Chemical-free, non-abrasive restoration safe for Philip Simmons gates and irreplaceable historic pieces. Free estimates.',
};

export default function HistoricIronworkPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Historic District & Beyond
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Restoration for Charleston's Historic Ironwork
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Charleston has one of the most significant collections of historic ironwork in the Southeast -- wrought iron gates, railings, and decorative metalwork that date back hundreds of years. Restoring these pieces requires a method that removes rust and oxidation without touching the original material underneath. Laser cleaning is the only method that does this.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#00d4d4] text-[#0a1628] px-8 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Charleston Ironwork Context */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Preserving Charleston's Irreplaceable Ironwork Legacy
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Charleston's historic district contains some of the most celebrated ironwork in North America. From the Sword Gates on Legare Street to the intricate pieces created by master blacksmith Philip Simmons, these works represent centuries of craftsmanship that cannot be replaced.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            The challenge with restoring historic ironwork is that traditional cleaning methods -- sandblasting, chemical stripping, wire brushing -- all risk damaging or destroying the original surface. For pieces that are 100, 150, or 200 years old, that risk is simply too high.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning changes this equation. Our pulsed fiber laser targets only the rust, paint, or oxidation layer, leaving the original iron completely intact. The result is a clean, restored surface that preserves the character and patina of historic pieces while stopping further deterioration.
          </p>
        </div>
      </section>

      {/* What We Restore */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Historic Ironwork We Restore in Charleston
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Wrought Iron Gates',
                desc: 'Entrance gates, garden gates, and passage gates throughout the historic district, South of Broad, and the Charleston Peninsula. Safe for antique pieces of any age.',
              },
              {
                title: 'Iron Railings & Fences',
                desc: 'Perimeter fencing, stair railings, balcony railings, and decorative ironwork on historic homes and commercial properties.',
              },
              {
                title: 'Church & Institutional Ironwork',
                desc: 'Gates, railings, and decorative metalwork at historic churches, institutional buildings, and landmarks throughout the Charleston area.',
              },
              {
                title: 'Decorative Hardware',
                desc: 'Door hardware, hinges, knockers, light fixtures, and any decorative iron or steel element on historic structures.',
              },
              {
                title: 'Garden Features',
                desc: "Iron benches, planters, arbors, trellises, and garden ornaments common in Charleston's historic residential gardens.",
              },
              {
                title: 'Antique & Heirloom Pieces',
                desc: 'Antique furniture hardware, tools, frames, and family heirloom metalwork where preserving the original surface is the top priority.',
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

      {/* Why Not Sandblasting */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Historic Ironwork Requires a Different Approach
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                method: 'Sandblasting',
                problem: 'Removes metal along with rust. Erodes fine details, decorative elements, and surface patina that took centuries to develop. Irreversible damage.',
                safe: false,
              },
              {
                method: 'Chemical Stripping',
                problem: "Harsh acids damage original iron surface, create toxic runoff near Charleston's waterways and historic gardens, and can react unpredictably with antique alloys.",
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'Targets only the contaminant layer. Original iron surface is untouched. No chemicals, no abrasion, no risk to surrounding materials or structures.',
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
                    {item.safe ? 'Recommended' : 'Risk to Historic Pieces'}
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
            Our Historic Ironwork Restoration Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'On-Site Assessment',
                desc: 'We inspect the ironwork in person, assess the type and extent of rust or oxidation, and confirm laser cleaning is appropriate for the specific piece and its condition.',
              },
              {
                step: '02',
                title: 'Surface Preparation',
                desc: 'We set up safety perimeters and protect surrounding surfaces including brickwork, stonework, and plantings before beginning work.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes rust, oxidation, and old paint layer by layer. Parameters are adjusted based on the specific material and condition of each piece.',
              },
              {
                step: '04',
                title: 'Surface Inspection',
                desc: 'We inspect the cleaned surface and confirm the result before completing the job. Before and after photos are taken for your records.',
              },
              {
                step: '05',
                title: 'Painter Referral (if needed)',
                desc: "Bare iron in Charleston's salt air environment will begin to re-rust without a protective coating. We work with local painting contractors and can refer you to a trusted partner for same-day primer application.",
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
            We serve historic properties throughout Charleston and the Lowcountry. All work is performed on-site -- no need to remove gates, railings, or fixtures from their original location.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'South of Broad',
              'Historic District',
              'Downtown Charleston',
              'Harleston Village',
              'Ansonborough',
              'French Quarter',
              'Radcliffeborough',
              'Mount Pleasant',
              'Isle of Palms',
              "Sullivan's Island",
              'James Island',
              'West Ashley',
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
            Restore your historic ironwork the right way
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates for all jobs. Send us a photo of the piece and we will assess it and follow up within 24 hours. Minimum job size $400.
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