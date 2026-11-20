import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';

export const metadata = pageMetadata({
  title: 'Laser Rust Removal in Summerville, SC',
  description:
    'Mobile rust removal in Summerville, SC. Iron railings, gates, outdoor furniture and trailers cleaned on site with no sandblasting. Free estimates.',
  path: '/locations/summerville',
});

export default function SummervillePage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/locations' },
          { name: 'Summerville', path: '/locations/summerville' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Rust Removal in Summerville',
          description: 'Mobile rust removal in Summerville, SC. Iron railings, gates, outdoor furniture and trailers cleaned on site with no sandblasting. Free estimates.',
          path: '/locations/summerville',
          serviceType: 'Laser cleaning',
          areaServed: ['Summerville'],
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Rust Removal in Summerville
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Summerville is far enough inland that the salt eases off, but the humidity does not. Iron and steel left outside under the pines still rusts, just on a slower clock than the islands. We take it off on site, without sandblasting.
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
            Old Town and New Neighborhoods
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            The historic district around the town square has older homes with iron fences, porch railings and gates that have been painted over many times. Bare rust on that metal is a good fit after a test spot. Paint on pre-1978 homes needs a negative lead test before we laser it.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The newer neighborhoods out toward Nexton and Cane Bay are mostly powder coat and painted steel. There the work tends to be patio furniture, mailboxes, gate hardware and trailers, where the coating has failed and rust has started underneath.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean in Summerville
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Iron Fences & Porch Railings',
                desc: 'Older iron and steel in the historic district, cleaned in place after a test spot. Paint on pre-1978 homes needs a negative lead test first.',
              },
              {
                title: 'Gates & Hardware',
                desc: 'Driveway and garden gates, latches, hinges and mailboxes in mild steel and iron. Aluminum is tested before any quote.',
              },
              {
                title: 'Outdoor Furniture',
                desc: 'Wrought iron and steel patio sets with failed paint or powder coat, stripped back to clean metal and ready for a new finish.',
              },
              {
                title: 'Trailers & Equipment',
                desc: 'Utility and boat trailer frames, axles and springs cleaned in your driveway with the trailer assembled. Galvanized trailers are tested first.',
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
                problem: 'Means taking the fence or railing down and hauling it to a shop, or media spread across the lawn. It also takes base metal off with the rust.',
                safe: false,
              },
              {
                method: 'Chemical Stripping',
                problem: 'Runoff into the azaleas and the storm drains. Slow on rust, and every piece has to be neutralized and rinsed.',
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
            Even inland, bare steel will flash rust in this humidity if it is left uncoated, so exterior pieces get primer the same day, from us or from a painting contractor we refer.
          </p>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Summerville Areas We Serve</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            From the historic district out to the newer neighborhoods on both sides of I-26.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Historic District',
              'Azalea Park',
              'Knightsville',
              'Nexton',
              'Cane Bay',
              'Ladson',
              'Legend Oaks',
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
            Services for Summerville Homes
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
                title: 'Antique Restoration',
                desc: 'Cast iron, tools and heirloom hardware cleaned on the bench.',
                href: '/services/antique-restoration-charleston',
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
        path='/locations/summerville'
        items={[
          {
            q: 'Do you come out to Summerville?',
            a:
              'Yes. The equipment is portable, so railings, fences and gates are cleaned in place and trailers are done in your driveway.',
          },
          {
            q: 'Does metal rust as fast in Summerville as on the coast?',
            a:
              'Slower, because there is less salt in the air. The humidity still gets under failed paint and powder coat, and once rust starts underneath it keeps spreading until the metal is cleaned and recoated.',
          },
          {
            q: 'Can you clean an old iron fence in the historic district?',
            a:
              'Yes, for homes that are not individually listed. Bare rust is a good fit. We do not laser paint on pre-1978 homes or child-occupied buildings unless a lead test comes back negative; we refer it to an EPA RRP certified firm.',
          },
          {
            q: 'Can you redo a wrought iron patio set?',
            a:
              'Yes. The old paint and rust come off down to clean metal, and the set is ready for primer and a new finish the same day.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Other Service Areas"
        intro="The exposure changes with the neighborhood. See how the work reads for other parts of Charleston."
        items={[
          {
            title: 'North Charleston',
            desc: 'Commercial exteriors, Park Circle homes and equipment along the Cooper River side.',
            href: '/locations/north-charleston',
          },
          {
            title: 'West Ashley',
            desc: 'Mid-century homes across the Ashley, with original railings, gates and hardware.',
            href: '/locations/west-ashley',
          },
          {
            title: 'Downtown Charleston',
            desc: 'Iron gates, railings and cast hardware on the peninsula, with no runoff into courtyards or storm drains.',
            href: '/locations/downtown-charleston',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Serving Summerville
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
