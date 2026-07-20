import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laser Rust Removal in Charleston, SC | Coastal Surface Restoration',
  description:
    'Professional laser rust removal in Charleston, SC. No chemicals, no abrasives, no damage to original surfaces. Serving the historic district, marinas, and the Lowcountry. Free estimates.',
};

export default function RustRemovalPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Charleston, SC & Lowcountry
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Rust Removal in Charleston, SC
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Charleston's salt air and coastal humidity make rust one of the most common and damaging problems facing local property owners, boat owners, and historic homeowners. Our mobile laser cleaning service removes rust from iron, steel, and metal surfaces without chemicals, abrasives, or damage to the original material.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#00d4d4] text-[#0a1628] px-8 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Why Laser for Rust */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Laser Rust Removal is Different
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Traditional rust removal methods -- sandblasting, wire brushing, chemical stripping -- all have a significant downside: they damage the surface underneath. Sandblasting removes metal along with the rust. Chemicals leave residue and create runoff problems near Charleston's waterways. Wire brushing scratches and scores the substrate.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Laser rust removal works differently. A pulsed fiber laser targets the rust layer specifically, vaporizing it without touching the metal beneath. The result is a clean, prepared surface with zero substrate damage and no cleanup media to dispose of.
          </p>
          <p className="text-gray-400 leading-relaxed">
            For Charleston property owners dealing with historic ironwork, boat owners with corroded marine hardware, or anyone with metal surfaces they care about, laser is the only method that removes rust without creating new damage.
          </p>
        </div>
      </section>

      {/* What We Remove */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Remove Rust From in Charleston
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Historic Iron Gates & Railings',
                desc: 'Wrought iron gates, railings, fences, and decorative ironwork throughout the historic district and South of Broad. Safe for antique and irreplaceable pieces.',
              },
              {
                title: 'Boat Trailers & Marine Hardware',
                desc: 'Boat trailers, cleats, hinges, anchors, and marine fittings corroded by salt water exposure. Serving boat owners near Shem Creek, Charleston Harbor, and the Lowcountry.',
              },
              {
                title: 'Structural Steel & Equipment',
                desc: 'Corroded structural steel, machinery, tools, and industrial equipment. Laser cleaning prepares surfaces for welding, painting, or coating without abrasive prep work.',
              },
              {
                title: 'Outdoor Furniture & Fixtures',
                desc: "Cast iron furniture, outdoor light fixtures, decorative hardware, and any metal surface exposed to Charleston's humid coastal climate.",
              },
              {
                title: 'Antique Hardware & Frames',
                desc: 'Antique door hardware, picture frames, tools, and decorative metal pieces where substrate integrity is critical and chemicals are not an option.',
              },
              {
                title: 'Commercial & Industrial Surfaces',
                desc: 'Storage tanks, pipes, heavy equipment, and commercial metal surfaces. Mobile service means we come to your location -- no transport required.',
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

      {/* Comparison Table */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Laser vs. Traditional Rust Removal Methods
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0e7c7b]/30">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Method</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Substrate Damage</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Chemicals</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Cleanup Required</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Safe for Historic Surfaces</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#0e7c7b]/10 bg-[#00d4d4]/5">
                  <td className="py-3 px-4 text-[#00d4d4] font-bold">Laser Cleaning</td>
                  <td className="py-3 px-4 text-white">None</td>
                  <td className="py-3 px-4 text-white">None</td>
                  <td className="py-3 px-4 text-white">Minimal</td>
                  <td className="py-3 px-4 text-white">Yes</td>
                </tr>
                <tr className="border-b border-[#0e7c7b]/10">
                  <td className="py-3 px-4 text-gray-300">Sandblasting</td>
                  <td className="py-3 px-4 text-red-400">High</td>
                  <td className="py-3 px-4 text-gray-300">No</td>
                  <td className="py-3 px-4 text-red-400">Extensive</td>
                  <td className="py-3 px-4 text-red-400">No</td>
                </tr>
                <tr className="border-b border-[#0e7c7b]/10">
                  <td className="py-3 px-4 text-gray-300">Chemical Stripping</td>
                  <td className="py-3 px-4 text-yellow-400">Moderate</td>
                  <td className="py-3 px-4 text-red-400">Yes</td>
                  <td className="py-3 px-4 text-red-400">Extensive</td>
                  <td className="py-3 px-4 text-red-400">No</td>
                </tr>
                <tr className="border-b border-[#0e7c7b]/10">
                  <td className="py-3 px-4 text-gray-300">Wire Brushing</td>
                  <td className="py-3 px-4 text-yellow-400">Moderate</td>
                  <td className="py-3 px-4 text-gray-300">No</td>
                  <td className="py-3 px-4 text-gray-300">Low</td>
                  <td className="py-3 px-4 text-red-400">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Laser Rust Removal Service Area
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            We provide mobile laser rust removal throughout Charleston and the Lowcountry. We come to your property -- no need to transport heavy equipment, antiques, or vehicles.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Downtown Charleston',
              'South of Broad',
              'Historic District',
              'Mount Pleasant',
              'Isle of Palms',
              "Sullivan's Island",
              'James Island',
              'Folly Beach',
              'West Ashley',
              'North Charleston',
              'Daniel Island',
              'Summerville',
            ].map((area) => (
              <span key={area} className="bg-[#0a1628] border border-[#0e7c7b]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0a1628] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to remove rust the right way?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates for all jobs. Minimum $400. Send us a photo and description and we will follow up within 24 hours.
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