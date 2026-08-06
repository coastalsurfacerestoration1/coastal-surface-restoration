import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Service Areas in Charleston & the Lowcountry',
  description:
    'Coastal Surface Restoration serves downtown Charleston, Mount Pleasant, Isle of Palms, Sullivan\'s Island, James Island, and Folly Beach with mobile laser cleaning. All work performed on site.',
  path: '/locations',
});

const areas = [
  {
    name: 'Downtown Charleston',
    href: '/locations/downtown-charleston',
    tagline: 'The historic peninsula',
    desc: 'Historic ironwork, soft handmade brick, and original stucco on properties where the material cannot be replaced. A dry method with no runoff into courtyards or storm drains.',
    spots: ['South of Broad', 'French Quarter', 'Harleston Village', 'King Street'],
  },
  {
    name: 'Mount Pleasant',
    href: '/locations/mount-pleasant',
    tagline: 'East Cooper',
    desc: 'Old Village historic homes and newer construction alike, all carrying the same salt corrosion load. Boat trailers, dock hardware, gates, railings, and exterior fixtures.',
    spots: ['Old Village', 'Shem Creek', "I'On", 'Park West'],
  },
  {
    name: "Isle of Palms & Sullivan's Island",
    href: '/locations/isle-of-palms-sullivans-island',
    tagline: 'The barrier islands',
    desc: 'The heaviest salt exposure in the Lowcountry. Exterior railings, outdoor showers, hurricane shutters, and hardware, with scheduling that works around rental turnover.',
    spots: ['Wild Dunes', 'Palm Boulevard', 'Middle Street', 'IOP Marina'],
  },
  {
    name: 'James Island & Folly Beach',
    href: '/locations/james-island-folly-beach',
    tagline: 'The tidal creeks',
    desc: 'Marsh-front and creek-front corrosion on working hardware. Boat lifts, davits, dock ladders, and trailers cleaned in place with nothing entering the water.',
    spots: ['Riverland Terrace', 'Lighthouse Point', 'Center Street', 'Clark Sound'],
  },
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Where We Work
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Service Areas
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We are a mobile service. The laser system is a backpack unit and a portable generator, so the work happens at your property, at your dock, or in your driveway. Nothing gets hauled to a shop.
          </p>
        </div>
      </section>

      {/* Area Cards */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {areas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="block bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-8 hover:border-[#00d4d4]/50 transition-colors group"
              >
                <p className="text-[#00d4d4] text-xs font-semibold uppercase tracking-[0.15em] mb-2">
                  {area.tagline}
                </p>
                <h2 className="text-white font-bold text-2xl mb-3 group-hover:text-[#00d4d4] transition-colors">
                  {area.name}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{area.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {area.spots.map((spot) => (
                    <span
                      key={spot}
                      className="bg-[#0a1628] border border-[#0e7c7b]/20 text-gray-400 px-3 py-1 rounded text-xs"
                    >
                      {spot}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[#00d4d4] font-semibold text-sm group-hover:gap-2 transition-all">
                  View area details <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Wider Coverage */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Not on the List?</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            The four areas above are where most of our work happens, but we cover the greater Charleston area and the Lowcountry. If you are nearby, ask. For larger jobs we travel further.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Daniel Island',
              'North Charleston',
              'West Ashley',
              'Summerville',
              'Johns Island',
              'Kiawah Island',
              'Seabrook Island',
              'Awendaw',
              'Hanahan',
              'Goose Creek',
              'Ravenel',
              'Wadmalaw Island',
            ].map((area) => (
              <span key={area} className="bg-[#0a1628] border border-[#0e7c7b]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#0a1628] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Serving Charleston and the Lowcountry
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates on every job. Send a photo of what needs work along with your location and we will tell you what laser cleaning can do for it, usually within 24 hours.
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
