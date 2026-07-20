import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laser Cleaning for Vacation Rentals in Charleston, SC | Coastal Surface Restoration',
  description:
    'Laser cleaning and surface restoration for vacation rentals and property managers in Charleston, Isle of Palms, Sullivan\'s Island, and Folly Beach. Rust, railings, and curb appeal on a maintenance schedule. Free estimates.',
};

export default function VacationRentalPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Vacation Rental Restoration
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Cleaning for Charleston Vacation Rentals
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            On the islands, salt air rusts railings, corrodes hardware, and dulls fixtures faster than anywhere inland. For a rental, that damage shows up in the photos and the reviews. We keep Isle of Palms, Sullivan's Island, and Folly Beach properties looking their best, on a schedule that fits your turnovers.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#00d4d4] text-[#0a1628] px-8 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Built for Owners and Property Managers
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            A vacation rental lives and dies by its curb appeal and its photos. Rusted railings, corroded light fixtures, stained entryways, and a weathered exterior cost you bookings and show up in guest reviews. On a coastal property, that decline is constant, and touching it up between every guest is not realistic.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            We work with individual owners and with property management companies handling multiple units. Laser cleaning restores metal and masonry surfaces without chemicals, water, or mess, which means we can work around your calendar and leave a property guest-ready without a wet, chemical-heavy cleanup.
          </p>
          <p className="text-gray-400 leading-relaxed">
            For managers with a portfolio, we can set up a recurring maintenance schedule so railings, fixtures, and entryways are handled on a regular cadence instead of only when they have already gotten bad.
          </p>
        </div>
      </section>

      {/* What We Handle */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Handle at Rental Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Railings & Balconies',
                desc: 'Rusted iron and steel railings, balcony rails, and stair rails restored so they look sharp in listing photos and stay safe for guests.',
              },
              {
                title: 'Exterior Light Fixtures & Hardware',
                desc: 'Corroded fixtures, house numbers, door hardware, and fasteners cleaned back to a clean finish.',
              },
              {
                title: 'Entryways & Steps',
                desc: 'Brick stoops, steps, and entry surfaces cleaned of grime, salt staining, and biological growth for a strong first impression.',
              },
              {
                title: 'Outdoor Furniture & Fixtures',
                desc: 'Metal patio furniture frames, grills, gates, and outdoor fixtures restored without harsh chemicals near pools and decks.',
              },
              {
                title: 'Docks & Waterfront Features',
                desc: 'Dock hardware, railings, and metalwork on waterfront rentals cleaned of rust and marine buildup.',
              },
              {
                title: 'Brick & Masonry',
                desc: 'Efflorescence, staining, and grime on brick and stucco removed without pressure washing damage.',
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

      {/* Why laser for rentals */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Laser Cleaning Fits a Rental Operation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'No Mess to Clean Up',
                desc: 'No water, no sand, no chemical runoff. The property is left clean and guest-ready, not soaked and roped off.',
              },
              {
                title: 'Works Around Turnovers',
                desc: 'A dry, self-contained process that can be scheduled between bookings without disrupting your cleaning crew.',
              },
              {
                title: 'Recurring Maintenance',
                desc: 'Set a regular cadence for coastal properties so surfaces are maintained before they decline, not after.',
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

      {/* Service Area */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Service Area</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            We serve vacation rental owners and property managers across the Charleston coast, with a focus on the barrier islands where salt air takes the heaviest toll.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Isle of Palms',
              "Sullivan's Island",
              'Folly Beach',
              'Wild Dunes',
              'Kiawah Island',
              'Seabrook Island',
              'Mount Pleasant',
              'Downtown Charleston',
              'James Island',
              'Daniel Island',
              'Edisto Beach',
              'Dewees Island',
            ].map((area) => (
              <span key={area} className="bg-[#0a1628] border border-[#0e7c7b]/20 text-gray-300 px-4 py-2 rounded text-sm">
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
            Keep your rental guest-ready
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Managing multiple properties? Ask about a recurring maintenance schedule. Send us a photo or your property details and we will follow up within 24 hours. Minimum job size $400.
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