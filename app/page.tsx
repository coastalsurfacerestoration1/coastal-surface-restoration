import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d2040] to-[#0a1628]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00d4d4]/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-6">
            Charleston, SC & Lowcountry
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Laser Precision.<br />
            <span className="text-[#00d4d4]">Zero Damage.</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Charleston's mobile laser cleaning specialist for historic properties, marine equipment, and vacation rental restoration. No chemicals. No abrasives. No mess.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="bg-[#00d4d4] text-[#0a1628] px-8 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors">
              Get a Free Quote
            </Link>
            <Link href="/services" className="border border-[#00d4d4]/50 text-[#00d4d4] px-8 py-4 rounded font-bold text-lg hover:border-[#00d4d4] hover:bg-[#00d4d4]/10 transition-colors">
              See Our Services
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-400">
            <span className="flex items-center gap-2"><span className="text-[#00d4d4]">✓</span> Licensed & Insured</span>
            <span className="flex items-center gap-2"><span className="text-[#00d4d4]">✓</span> Mobile Service</span>
            <span className="flex items-center gap-2"><span className="text-[#00d4d4]">✓</span> No Chemicals</span>
            <span className="flex items-center gap-2"><span className="text-[#00d4d4]">✓</span> Free Estimates</span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0d1f3c]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-3">What We Do</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Three Specialties. One Laser.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0a1628] border border-[#0e7c7b]/30 rounded-lg p-8 hover:border-[#00d4d4]/50 transition-colors group">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-white font-bold text-xl mb-3 group-hover:text-[#00d4d4] transition-colors">Historic Restoration</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Iron gates, brick stoops, wrought iron railings, church gates, wood shutters. Preserve Charleston's historic character without damaging original materials.</p>
              <Link href="/services/historic-ironwork-restoration-charleston" className="text-[#00d4d4] text-sm font-semibold hover:underline">Learn more →</Link>
            </div>
            <div className="bg-[#0a1628] border border-[#0e7c7b]/30 rounded-lg p-8 hover:border-[#00d4d4]/50 transition-colors group">
              <div className="text-4xl mb-4">⚓</div>
              <h3 className="text-white font-bold text-xl mb-3 group-hover:text-[#00d4d4] transition-colors">Marine Cleaning</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Boat fittings, trailers, marine hardware, hulls, and dock equipment. Remove rust and marine growth without harsh chemicals near Charleston's waterways.</p>
              <Link href="/services/marine-cleaning-charleston" className="text-[#00d4d4] text-sm font-semibold hover:underline">Learn more →</Link>
            </div>
            <div className="bg-[#0a1628] border border-[#0e7c7b]/30 rounded-lg p-8 hover:border-[#00d4d4]/50 transition-colors group">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-white font-bold text-xl mb-3 group-hover:text-[#00d4d4] transition-colors">Vacation Rental Restoration</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Keep your Isle of Palms, Sullivan's Island, or Folly Beach property in top condition. Recurring maintenance contracts available for property managers.</p>
              <Link href="/services/vacation-rental-cleaning-charleston" className="text-[#00d4d4] text-sm font-semibold hover:underline">Learn more →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-3">The Technology</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Why Laser Cleaning?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'No Chemicals', desc: 'Safe for historic surfaces, waterways, and surrounding vegetation.' },
              { title: 'No Abrasives', desc: 'Removes rust and coatings without scratching or damaging the substrate.' },
              { title: 'No Mess', desc: 'Minimal residue. No blasting media to clean up after the job.' },
              { title: 'Fully Mobile', desc: 'We come to you. No need to transport heavy equipment or antiques.' },
            ].map((item) => (
              <div key={item.title} className="bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6">
                <h3 className="text-[#00d4d4] font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d1f3c] border-y border-[#0e7c7b]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to restore your property?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Free estimates for all jobs. Minimum $400. Serving Charleston, Mt. Pleasant, Isle of Palms, Sullivan's Island, James Island, and Folly Beach.</p>
          <Link href="/quote" className="bg-[#00d4d4] text-[#0a1628] px-10 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors">
            Request a Free Quote
          </Link>
        </div>
      </section>
    </div>
  );
}