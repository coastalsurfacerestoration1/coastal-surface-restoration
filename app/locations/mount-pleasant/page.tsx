import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';

export const metadata = pageMetadata({
  title: 'Laser Cleaning & Rust Removal in Mount Pleasant, SC',
  description:
    'Mobile surface restoration and rust removal in Mount Pleasant, SC. Boat trailers, marine stainless and bronze on land, gates, railings, and outdoor steel cleaned on site with no chemicals or blast media. Free estimates.',
  path: '/locations/mount-pleasant',
});

export default function MountPleasantPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
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
          description: 'Mobile surface restoration and rust removal in Mount Pleasant, SC. Boat trailers, marine stainless and bronze on land, gates, railings, and outdoor steel cleaned on site with no chemicals or blast media. Free estimates.',
          path: '/locations/mount-pleasant',
          serviceType: 'Laser cleaning',
          areaServed: ['Mount Pleasant'],
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Rust Removal in Mount Pleasant
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Mount Pleasant sits between the harbor, the Wando, and the Intracoastal, and salt air moves through all of it. It does not matter whether your house is in the Old Village or went up in 2019 in Carolina Park. Exterior metal here corrodes, and it starts sooner than most people expect. We remove that corrosion on site, without chemicals, sand, or water.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#397774] text-white px-8 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Local Context */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Two Kinds of Property, One Corrosion Problem
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            East Cooper is really two markets. The Old Village and the streets around Shem Creek hold historic homes with original ironwork and antique hardware. Bare rust is a good fit; paint on pre-1978 homes needs a negative lead test first. Then there is everything built since the 1990s from Belle Hall out to Park West and Carolina Park, where the materials are modern but the exposure is identical.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Newer construction gets written off as low maintenance, and then five years in the owner notices rust bleeding down a stucco column from a light fixture and pitting on the gate hardware. Replacing those pieces is expensive. Repainting over rust just buys a season. Removing the rust down to clean metal and priming it the same day is what resets the clock.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Mount Pleasant is also a boating town. Shem Creek, the Isle of Palms Connector, and the marinas along the Wando mean plenty of trailers, stainless rails and bronze fittings that come out of salt water and need the rust taken off on land.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean in Mount Pleasant
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Boat Trailers & Marine Hardware',
                desc: 'Painted steel trailer frames, axles and springs, plus stainless rails, cleats and bronze fittings off the boat. Galvanized trailers are tested first, since the zinc comes off too.',
              },
              {
                title: 'Stainless Weld Tint & Tea Staining',
                desc: 'Heat tint beside TIG welds on stainless rails and frames, and brown tea staining on 316 and 304 hardware, cleaned on the bench or on land.',
              },
              {
                title: 'Gates, Fencing & Railings',
                desc: 'Driveway gates, courtyard gates, and stair and porch railings in mild steel and iron. Aluminum is tested before any quote, and pre-1978 paint is lead-tested first.',
              },
              {
                title: 'Exterior Light Fixtures & Hardware',
                desc: 'Iron sconces, steel mailboxes, shutter dogs and solid brass door hardware. Copper lanterns and brass are tested first, and plated pieces are not taken.',
              },
              {
                title: 'Old Village Historic Ironwork',
                desc: 'Gates, railings and hardware on older homes along Pitt, Church and Venning. Bare rust comes off after a test spot. Paint on pre-1978 homes needs a negative lead test first.',
              },
              {
                title: 'Vintage Tools & Classic Car Parts',
                desc: 'Cast iron, forged brackets, hinges and hand tools stripped of rust and old paint on the bench, ready for primer.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#0e273e] border border-[#397774]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Laser Here */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
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
                problem: 'On site, dry, and no water. Dust and fume are extracted and vacuumed up. Set to stop at the metal after a test spot, ready for primer the same day.',
                safe: true,
              },
            ].map((item) => (
              <div
                key={item.method}
                className={`rounded-lg p-6 border ${
                  item.safe
                    ? 'bg-[#397774]/5 border-[#397774]/30'
                    : 'bg-[#1a3958] border-[#397774]/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-lg font-bold ${item.safe ? 'text-[#397774]' : 'text-gray-300'}`}>
                    {item.method}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    item.safe ? 'bg-[#397774]/20 text-[#397774]' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {item.safe ? 'Recommended' : 'Off-Site or Messy'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.problem}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mt-8">
            One note specific to this climate. Bare metal in Mount Pleasant salt air will begin to flash rust again if it is left uncoated, so exterior pieces get primer the same day, from us or from a painting contractor we refer.
          </p>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Mount Pleasant Areas We Serve</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            From the Old Village out past Highway 41, plus Daniel Island and the Wando side.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Old Village',
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
            ].map((area) => (
              <span key={area} className="bg-[#0e273e] border border-[#397774]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Services for Mount Pleasant Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Rust & Paint Removal',
                desc: 'Rust taken off steel and iron down to clean metal, primed the same day.',
                href: '/services/rust-removal-charleston',
              },
              {
                title: 'Marine Cleaning',
                desc: 'Trailers, stainless rails and bronze fittings cleaned in your driveway or on the hard.',
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
                className="block bg-[#1a3958] border border-[#397774]/20 rounded-lg p-6 hover:border-[#397774]/50 transition-colors group"
              >
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#397774] transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="inline-flex items-center gap-1 text-[#397774] font-semibold text-sm group-hover:gap-2 transition-all">
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
              'We come to you. Trailers, gates, railings and removed boat hardware are cleaned in your driveway anywhere in East Cooper. Nothing is done over the water.',
          },
          {
            q: 'Can you clean a boat trailer at my house?',
            a:
              'Yes. The trailer stays assembled and no blasting media gets into the bearings, brakes or threads. Bare steel needs primer the same day before it goes back in the water.',
          },
          {
            q: 'Do you work on historic homes in the Old Village?',
            a:
              'Yes, for homes that are not individually listed. Bare rust on iron is a good fit. We do not laser paint on pre-1978 homes or child-occupied buildings unless a lead test comes back negative; we refer it to an EPA RRP certified firm.',
          },
          {
            q: 'Will rust come back on my railings?',
            a:
              'Bare metal in this salt air will flash rust if it is left uncoated. Exterior pieces get primer the same day, from us or from a painting contractor we refer.',
          },
          {
            q: 'What parts of Mount Pleasant do you cover?',
            a:
              "From the Old Village out through I'On, Snee Farm, Belle Hall, Park West, Dunes West, and Carolina Park, plus Daniel Island and the Wando side.",
          },
        ]}
      />

      <RelatedItemsSection
        heading="Other Service Areas"
        intro="The exposure changes with the neighborhood. See how the work reads for other parts of Charleston."
        items={[
          {
            title: 'Downtown Charleston',
            desc: 'Iron gates, railings and cast hardware on the peninsula, with no runoff into courtyards or storm drains.',
            href: '/locations/downtown-charleston',
          },
          {
            title: "Isle of Palms & Sullivan's Island",
            desc: 'Barrier island properties where salt spray hits the hardest, cleaned on site with no runoff.',
            href: '/locations/isle-of-palms-sullivans-island',
          },
          {
            title: 'James Island & Folly Beach',
            desc: 'Marsh-front railings, trailers and rental homes on the tidal creek side of Charleston.',
            href: '/locations/james-island-folly-beach',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Serving Mount Pleasant and East Cooper
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates on every job. Send a photo of what needs work and we will tell you what laser cleaning can do for it, usually within one business day.
          </p>
          <Link
            href="/quote"
            className="bg-[#397774] text-white px-10 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Request a Free Quote
          </Link>
        </div>
      </section>

    </div>
  );
}
