import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';

export const metadata = pageMetadata({
  title: 'Laser Rust Removal in West Ashley, SC',
  description:
    'Mobile rust removal in West Ashley, SC. Porch railings, gates, light fixtures and boat trailers cleaned on site with no sandblasting. Free estimates.',
  path: '/locations/west-ashley',
});

export default function WestAshleyPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/locations' },
          { name: 'West Ashley', path: '/locations/west-ashley' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Rust Removal in West Ashley',
          description: 'Mobile rust removal in West Ashley, SC. Porch railings, gates, light fixtures and boat trailers cleaned on site with no sandblasting. Free estimates.',
          path: '/locations/west-ashley',
          serviceType: 'Laser cleaning',
          areaServed: ['West Ashley'],
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Rust Removal in West Ashley
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            West Ashley runs from the river and the marsh out past Savannah Highway, and a lot of its houses have been standing since the 1950s and 60s. The railings, gates and fixtures on them have had decades of humid salt air to work on. We take the rust off on site, without sandblasting.
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
            Mid-Century Metal Worth Keeping
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            The older neighborhoods here, like Avondale, Byrnes Downs and Windermere, still have a lot of original wrought iron porch railings and steel gates. Most of it is solid, just rusted at the joints and the feet. Taking that rust back to clean metal and priming it the same day keeps the original piece instead of replacing it with something thinner.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The same age means a lot of that metal has old paint on it, and homes built before 1978 may have lead in it. Bare rust is a good fit right away. Painted metal on those homes needs a negative lead test before we laser it, and if the test is positive we refer the job to a firm set up for lead work.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean in West Ashley
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Porch Railings & Columns',
                desc: 'Original wrought iron and steel railings rusted at the joints and feet, cleaned in place and primed the same day.',
              },
              {
                title: 'Gates & Fencing',
                desc: 'Driveway and garden gates, latches and hinges in mild steel and iron. Aluminum is tested before any quote.',
              },
              {
                title: 'Boat Trailers',
                desc: 'Painted steel frames, axles and springs cleaned in your driveway with the trailer assembled. Galvanized trailers are tested first, since the zinc comes off too.',
              },
              {
                title: 'Light Fixtures & Door Hardware',
                desc: 'Iron sconces, mailboxes and solid brass door hardware. Brass is polished by hand first, with the laser only as a backup on solid brass. Plated pieces get hand cleaning only.',
              },
              {
                title: 'Wood Trim',
                desc: 'Painted door and window casings stripped by hand with heat and sanding, ready for stain or paint. Paint on pre-1978 homes needs a negative lead test first.',
              },
              {
                title: 'Vintage Tools & Cast Iron',
                desc: 'Cast iron, hand tools and old hardware stripped of rust on the bench, ready for oil or primer.',
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
            Why Laser Instead of Blasting or Chemical Strippers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                method: 'Sandblasting',
                problem: 'Means pulling the railing off the porch and hauling it to a shop, or media blown across the yard and the neighbor\'s house. It also takes base metal off with the rust.',
                safe: false,
              },
              {
                method: 'Chemical Stripping',
                problem: 'Runoff into flower beds, storm drains and the marsh. Slow on rust, and every piece has to be neutralized and rinsed.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'On site, dry, and no water. Dust and fume are extracted and vacuumed up. Dialed in on a test spot to keep as much of the metal as possible, ready for primer the same day.',
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
            Bare steel will flash rust again if it is left uncoated, so exterior pieces get primer the same day, from us or from a painting contractor we refer.
          </p>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">West Ashley Areas We Serve</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            From the neighborhoods along the river out past Savannah Highway and Bees Ferry.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Avondale',
              'Byrnes Downs',
              'Windermere',
              'Moreland',
              'Ashley Forest',
              'Sylvan Shores',
              'Ashley Harbor',
              'Shadowmoss',
              'Carolina Bay',
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
            Services for West Ashley Homes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Rust & Paint Removal',
                desc: 'Rust taken off steel and iron down to clean metal, primed the same day.',
                href: '/services/rust-removal-charleston',
              },
              {
                title: 'Historic Ironwork Restoration',
                desc: 'Original gates, railings and hardware on older homes that are not individually listed.',
                href: '/services/historic-ironwork-restoration-charleston',
              },
              {
                title: 'Marine Cleaning',
                desc: 'Trailers, stainless rails and bronze fittings cleaned in your driveway or on the hard.',
                href: '/services/marine-cleaning-charleston',
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
        path='/locations/west-ashley'
        items={[
          {
            q: 'Do you come to West Ashley?',
            a:
              'Yes. Railings, gates and fixtures are cleaned in place, and trailers and loose parts are done in your driveway. Small pieces can go to our bench.',
          },
          {
            q: 'My house is from the 1950s. Can you strip the paint off the railings?',
            a:
              'Not until a lead test comes back negative. We do not laser paint on pre-1978 homes or child-occupied buildings unless it does; we refer it to an EPA RRP certified firm. Bare rust is a good fit right away.',
          },
          {
            q: 'Is it worth saving an old iron railing instead of replacing it?',
            a:
              'Usually. Older wrought iron and steel is often heavier than what replaces it, and the rust tends to be at the joints and feet. A test spot shows how much sound metal is left before you decide.',
          },
          {
            q: 'Will rust come back on my railings?',
            a:
              'Bare metal will flash rust if it is left uncoated. Exterior pieces get primer the same day, from us or from a painting contractor we refer.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Other Service Areas"
        intro="The exposure changes with the neighborhood. See how the work reads for other parts of Charleston."
        items={[
          {
            title: 'James Island & Folly Beach',
            desc: 'Marsh-front railings, trailers and rental homes on the tidal creek side of Charleston.',
            href: '/locations/james-island-folly-beach',
          },
          {
            title: 'Downtown Charleston',
            desc: 'Iron gates, railings and cast hardware on the peninsula, with no runoff into courtyards or storm drains.',
            href: '/locations/downtown-charleston',
          },
          {
            title: 'Summerville',
            desc: 'Historic district ironwork and newer neighborhoods up the Ashley, away from the salt but not the humidity.',
            href: '/locations/summerville',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Serving West Ashley
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
