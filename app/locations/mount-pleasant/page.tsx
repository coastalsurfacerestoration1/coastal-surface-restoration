import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';

export const metadata = pageMetadata({
  title: 'Laser Cleaning & Rust Removal in Mount Pleasant, SC',
  description:
    'Mobile laser rust removal and surface restoration in Mount Pleasant, SC. Boat trailers, dock hardware, gates, railings, and outdoor metal cleaned on site with no chemicals or abrasives. Free estimates.',
  path: '/locations/mount-pleasant',
});

export default function MountPleasantPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/locations' },
          { name: 'Mount Pleasant', path: '/locations/mount-pleasant' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Cleaning and Rust Removal in Mount Pleasant',
          description: 'Mobile laser rust removal and surface restoration in Mount Pleasant, SC. Boat trailers, dock hardware, gates, railings, and outdoor metal cleaned on site with no chemicals or abrasives. Free estimates.',
          path: '/locations/mount-pleasant',
          serviceType: 'Laser cleaning',
          areaServed: ['Mount Pleasant'],
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Rust Removal in Mount Pleasant
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Mount Pleasant sits between the harbor, the Wando, and the Intracoastal, and salt air moves through all of it. It does not matter whether your house went up in 1840 in the Old Village or in 2019 in Carolina Park. Exterior metal here corrodes, and it starts sooner than most people expect. We remove that corrosion on site, without chemicals, sand, or water.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#00d4d4] text-[#0a1628] px-8 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Local Context */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Two Kinds of Property, One Corrosion Problem
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            East Cooper is really two markets. The Old Village and the streets around Shem Creek hold genuinely historic homes with original ironwork, antique hardware, and old brick that need the same careful treatment as anything on the peninsula. Then there is everything built since the 1990s from Belle Hall out to Park West and Carolina Park, where the materials are modern but the exposure is identical.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Newer construction gets written off as low maintenance, and then five years in the owner notices rust bleeding down a stucco column from a light fixture, corrosion creeping across an aluminum railing, and pitting on the gate hardware. Replacing those pieces is expensive. Repainting over rust just buys a season. Removing the corrosion down to clean metal is what actually resets the clock.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Mount Pleasant is also a boating town. Shem Creek, the Isle of Palms Connector, and the marinas along the Wando mean a large share of the work here is trailers, dock hardware, and marine fittings that live in salt water year round.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean in Mount Pleasant
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Boat Trailers & Marine Hardware',
                desc: 'Trailer frames, axles, and springs that live in brackish water, plus cleats, rails, davits, and fittings. Rust comes off without abrasive blasting media getting into bearings and moving parts.',
              },
              {
                title: 'Dock & Bulkhead Hardware',
                desc: 'Ladders, cleats, brackets, lift hardware, and railings on private docks along Shem Creek, the Wando, and the tidal creeks throughout the area. We work at the dock.',
              },
              {
                title: 'Gates, Fencing & Railings',
                desc: 'Driveway gates, courtyard gates, pool enclosure fencing, and stair and porch railings. Aluminum, steel, and wrought iron, on both historic and newer homes.',
              },
              {
                title: 'Exterior Light Fixtures & Hardware',
                desc: 'Gas lanterns, sconces, house numbers, mailboxes, shutter hardware, and door hardware. Small items where rust staining shows up on the wall long before the piece itself fails.',
              },
              {
                title: 'Old Village Historic Ironwork',
                desc: 'Original gates, railings, and antique hardware on the older homes along Pitt, Church, Venning, and the surrounding streets, where preserving the original surface is the whole point.',
              },
              {
                title: 'Brick, Masonry & Hardscape',
                desc: 'Efflorescence on brick, staining on stonework, and rust bleed on masonry columns and steps. Cleaned without pressure washing forcing water into the joints.',
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

      {/* Why Laser Here */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Laser Instead of Blasting or Chemicals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                method: 'Sandblasting',
                problem: 'Requires hauling the piece to a shop or tenting your yard. Media gets everywhere, into bearings, threads, pool equipment, and the driveway next door. Removes base metal along with the rust.',
                safe: false,
              },
              {
                method: 'Chemical Stripping',
                problem: 'Runoff near tidal creeks, marsh, and pool decks is a real problem in East Cooper. Harsh on landscaping and unpredictable on mixed metals like the aluminum and steel found on modern homes.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'We come to you. Dry process, nothing to contain, nothing to sweep up, no water. Removes only the corrosion layer and leaves the base metal intact and ready for coating.',
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
                    {item.safe ? 'Recommended' : 'Off-Site or Messy'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.problem}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mt-8">
            One note specific to this climate. Bare metal in Mount Pleasant salt air will begin to flash rust again if it is left uncoated, so for structural and exterior pieces we time the work so a protective coating can go on promptly, and we can refer you to a local painting contractor to handle it.
          </p>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Mount Pleasant Areas We Serve</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            From the Old Village out past Highway 41, plus Daniel Island and the Wando side.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Old Village',
              'Shem Creek',
              "I'On",
              'Snee Farm',
              'Belle Hall',
              'Hobcaw Creek',
              'Dunes West',
              'Park West',
              'Rivertowne',
              'Carolina Park',
              'Brickyard Plantation',
              'Charleston National',
              'Oyster Point',
              'Daniel Island',
              'Wando',
              'Awendaw',
            ].map((area) => (
              <span key={area} className="bg-[#0a1628] border border-[#0e7c7b]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Services Most Requested in Mount Pleasant
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Rust & Paint Removal',
                desc: 'Corrosion taken off steel, iron, and aluminum down to clean metal, ready for coating.',
                href: '/services/rust-removal-charleston',
              },
              {
                title: 'Marine Cleaning',
                desc: 'Trailers, dock hardware, and marine fittings cleaned dockside or in your driveway.',
                href: '/services/marine-cleaning-charleston',
              },
              {
                title: 'Historic Ironwork Restoration',
                desc: 'Original gates, railings, and hardware on Old Village and other historic East Cooper homes.',
                href: '/services/historic-ironwork-restoration-charleston',
              },
            ].map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="block bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6 hover:border-[#00d4d4]/50 transition-colors group"
              >
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#00d4d4] transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="inline-flex items-center gap-1 text-[#00d4d4] font-semibold text-sm group-hover:gap-2 transition-all">
                  Learn more <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Faq
        path='/locations/mount-pleasant'
        items={[
          {
            q: 'Do you come to Mount Pleasant, or do I bring the piece to you?',
            a:
              'We come to you. The system is fully mobile, so trailers, gates, railings, and dock hardware are cleaned in your driveway or at your dock anywhere in East Cooper.',
          },
          {
            q: 'Can you clean a boat trailer at my house?',
            a:
              'Yes, and it is one of the more common requests here. The trailer stays assembled and no blasting media gets into the bearings, brakes, or threads, so it can go straight back into use.',
          },
          {
            q: 'Do you work on historic homes in the Old Village?',
            a:
              'Yes. The Old Village and the streets around Shem Creek have original ironwork and antique hardware that need the same careful approach as anything on the peninsula, and the method suits it well.',
          },
          {
            q: 'Will rust come back on my railings?',
            a:
              'Bare metal in this salt air will flash rust if it is left uncoated. For exterior pieces we plan the work so a coating can follow promptly, and we can refer you to a local painting contractor.',
          },
          {
            q: 'What parts of Mount Pleasant do you cover?',
            a:
              "From the Old Village and Shem Creek out through I'On, Snee Farm, Belle Hall, Park West, Dunes West, and Carolina Park, plus Daniel Island and the Wando side.",
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Serving Mount Pleasant and East Cooper
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates on every job. Send a photo of what needs work and we will tell you what laser cleaning can do for it, usually within 24 hours.
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
