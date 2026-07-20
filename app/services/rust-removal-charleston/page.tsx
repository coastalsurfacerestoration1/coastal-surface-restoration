import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Coastal Surface Restoration',
  description:
    'Mobile laser cleaning services in Charleston, SC. Rust removal, historic restoration, marine cleaning, brick cleaning, graffiti removal, and more.',
};

const services = [
  {
    icon: '🏛️',
    title: 'Historic Restoration',
    desc: "Iron gates, brick stoops, wrought iron railings, church gates, wood shutters. Preserve Charleston's historic character without damaging original materials.",
    href: '/services/historic-ironwork-restoration-charleston',
    live: true,
  },
  {
    icon: '⚓',
    title: 'Marine Cleaning',
    desc: "Boat fittings, trailers, marine hardware, hulls, and dock equipment. Remove rust and marine growth without harsh chemicals near Charleston's waterways.",
    href: '/services/marine-cleaning-charleston',
    live: false,
  },
  {
    icon: '🏠',
    title: 'Vacation Rental Restoration',
    desc: "Keep your Isle of Palms, Sullivan's Island, or Folly Beach property in top condition. Recurring maintenance contracts available for property managers.",
    href: '/services/vacation-rental-cleaning-charleston',
    live: false,
  },
  {
    icon: '🔩',
    title: 'Rust & Paint Removal',
    desc: 'Remove rust, old paint, and coatings from iron, steel, and metal surfaces without abrasives or chemicals.',
    href: '/services/rust-removal-charleston',
    live: true,
  },
  {
    icon: '🧱',
    title: 'Brick & Masonry Cleaning',
    desc: 'Efflorescence, staining, and grime removal from brick, stone, and concrete without pressure washing damage.',
    href: '/services/brick-cleaning-charleston',
    live: false,
  },
  {
    icon: '🎨',
    title: 'Graffiti Removal',
    desc: 'Clean graffiti from brick, metal, and concrete surfaces without leaving ghost marks or surface damage.',
    href: '/services/graffiti-removal-charleston',
    live: false,
  },
  {
    icon: '🏺',
    title: 'Antique & Hardware Restoration',
    desc: 'Restore antique hardware, frames, tools, and decorative metal pieces to their original condition.',
    href: '/services/antique-restoration-charleston',
    live: false,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            What We Do
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Mobile laser cleaning for historic, marine, and property restoration across Charleston and the Lowcountry. No chemicals. No abrasives. No mess.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-8 hover:border-[#00d4d4]/50 transition-colors group"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-[#00d4d4] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {service.desc}
                </p>
                {service.live && (
                  <Link
                    href={service.href}
                    className="text-[#00d4d4] text-sm font-semibold hover:underline"
                  >
                    Learn more →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not sure what you need?</h2>
          <p className="text-gray-400 mb-8">
            Send us a photo and description and we will tell you exactly what we can do. Free estimates, no obligation.
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