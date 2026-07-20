import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Coastal Surface Restoration',
  description:
    "Learn about Coastal Surface Restoration, Charleston's mobile laser cleaning specialist. Meet Tyler Scherzer, ANSI-certified Laser Safety Officer and founder.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            About Us
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Built for Charleston.<br />
            <span className="text-[#00d4d4]">Built to Last.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Coastal Surface Restoration is a mobile laser cleaning company serving Charleston and the Lowcountry. We specialize in removing rust, paint, efflorescence, and marine buildup without chemicals, abrasives, or damage to original materials.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why Laser Cleaning?</h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Charleston's historic architecture, coastal climate, and salt air create a perfect storm for rust, oxidation, and surface degradation. Traditional cleaning methods like sandblasting, chemical stripping, and pressure washing often cause more damage than they fix on the delicate ironwork, brick, and wood that define this city's character.
                </p>
                <p>
                  Laser cleaning changes that equation entirely. A pulsed fiber laser removes contaminants at the molecular level, leaving the substrate completely intact. No media to clean up. No chemicals near Charleston's waterways. No collateral damage to surrounding materials.
                </p>
                <p>
                  We built Coastal Surface Restoration around this technology specifically because Charleston deserves better than the alternatives.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { number: '300W', label: 'JPT MOPA Pulsed Fiber Laser', desc: 'Industrial-grade laser source used by restoration professionals worldwide.' },
                { number: '0', label: 'Chemicals Used', desc: 'Every job is completed without chemical solvents, acids, or abrasive media.' },
                { number: '100%', label: 'Mobile Service', desc: 'We come to your property. No transport required for antiques or fixtures.' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6">
                  <div className="text-[#00d4d4] text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
                  <div className="text-gray-400 text-sm">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Certified. Insured. Ready.</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Laser cleaning is precision work. We hold the certifications and insurance that serious restoration jobs require.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🎓', title: 'ANSI Z136.1 Certified', desc: 'Designated Laser Safety Officer (LSO) certified through the Laser Institute of America.' },
              { icon: '🛡️', title: 'Fully Insured', desc: 'Commercial General Liability coverage through Burlington Insurance Company. $1M per occurrence / $2M aggregate.' },
              { icon: '🏛️', title: 'Historic District Experience', desc: "Familiar with the unique requirements of working in Charleston's historic district and on protected structures." },
            ].map((item) => (
              <div key={item.title} className="bg-[#0a1628] border border-[#0e7c7b]/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Service Area</h2>
            <p className="text-gray-400">Based in Charleston, SC. We serve the entire Lowcountry region.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['Downtown Charleston', 'Mount Pleasant', 'Isle of Palms', "Sullivan's Island", 'James Island', 'Folly Beach', 'West Ashley', 'North Charleston', 'Summerville', 'Goose Creek'].map((area) => (
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8">Free estimates for all jobs. We respond within 24 hours.</p>
          <Link href="/quote" className="bg-[#00d4d4] text-[#0a1628] px-10 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors">
            Request a Free Quote
          </Link>
        </div>
      </section>

    </div>
  );
}