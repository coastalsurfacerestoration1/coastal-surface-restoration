import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laser Antique & Hardware Restoration in Charleston, SC | Coastal Surface Restoration',
  description:
    'Laser cleaning for antiques, hardware, tools, and heirloom metalwork in Charleston, SC. Remove rust, tarnish, and old finishes without damaging the original surface or patina. Free estimates.',
};

export default function AntiqueRestorationPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Antique & Hardware Restoration
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Restoration for Antiques and Heirloom Metalwork
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            With antiques, the surface is the value. Aggressive cleaning that removes rust also removes the detail, the maker's marks, and the patina that make a piece worth keeping. Laser cleaning lifts corrosion and old finishes with the precision to preserve exactly what should stay.
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
            Precision Where It Matters Most
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Antique hardware, tools, and decorative metalwork carry their history on the surface. Casting marks, tooling, engraving, and the fine detail of period craftsmanship are the difference between a restored piece and a ruined one. Sandblasting, wire wheels, and chemical dips do not know the difference, and they take it all.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Laser cleaning is controllable down to a level no mechanical or chemical method can match. The pulsed fiber laser removes rust, tarnish, and old coatings layer by layer, and the operator can dial the effect to lift contamination while leaving original detail and desirable patina intact.
          </p>
          <p className="text-gray-400 leading-relaxed">
            For a family heirloom, an antique fixture, or a collection piece, that control is the whole point. It is the difference between conserving a piece and simply cleaning it.
          </p>
        </div>
      </section>

      {/* What We Restore */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Pieces We Restore
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Antique Hardware',
                desc: 'Door hardware, hinges, knockers, locks, and drawer pulls where preserving the original finish and marks is the priority.',
              },
              {
                title: 'Vintage Tools',
                desc: 'Hand tools, cast iron, planes, and shop equipment cleaned of rust without erasing maker\'s marks or grinding away detail.',
              },
              {
                title: 'Decorative Metalwork',
                desc: 'Frames, sconces, andirons, fireplace tools, and decorative iron and brass pieces restored with the detail intact.',
              },
              {
                title: 'Light Fixtures & Lamps',
                desc: 'Antique lanterns, lamp bases, and metal fixtures cleaned of tarnish and old coatings without damaging the original surface.',
              },
              {
                title: 'Cast Iron',
                desc: 'Cookware, garden pieces, and cast iron objects cleaned of rust and buildup while preserving the casting surface.',
              },
              {
                title: 'Family Heirlooms',
                desc: 'One-of-a-kind pieces where the goal is careful conservation, handled with a test area and your approval before full work.',
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
            Laser vs. Abrasive vs. Chemical Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                method: 'Abrasive Methods',
                problem: 'Sandblasting and wire wheels erase maker\'s marks, tooling, and fine detail, and destroy the patina that gives an antique its value.',
                safe: false,
              },
              {
                method: 'Chemical Dips',
                problem: 'Harsh dips strip everything uniformly, discolor metal, seep into seams and joints, and leave residue that keeps reacting over time.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'Controllable down to the layer. Removes rust, tarnish, and coatings while preserving original detail and desirable patina. No abrasion, no chemicals.',
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
                    {item.safe ? 'Recommended' : 'Risk to the Piece'}
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
            Our Restoration Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Assessment & Goals',
                desc: 'We look at the piece with you and agree on the goal, whether that is removing all corrosion or preserving a specific patina and finish.',
              },
              {
                step: '02',
                title: 'Test Area',
                desc: 'We clean a small, discreet area first so you can see and approve the result before we work on the whole piece.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes rust, tarnish, and coatings with precise control, leaving original detail intact.',
              },
              {
                step: '04',
                title: 'Inspection & Handoff',
                desc: 'We inspect the finished piece with you and confirm the result. Before and after photos are taken for your records.',
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
            We restore antiques and hardware for collectors, dealers, and homeowners throughout Charleston and the Lowcountry. Drop-off and pickup can be arranged for smaller pieces.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Downtown Charleston',
              'Historic District',
              'South of Broad',
              'Mount Pleasant',
              'West Ashley',
              'James Island',
              'Daniel Island',
              'Isle of Palms',
              "Sullivan's Island",
              'North Charleston',
              'Summerville',
              'Folly Beach',
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
            Restore the piece, keep the history
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