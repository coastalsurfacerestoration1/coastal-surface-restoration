import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';

export const metadata = pageMetadata({
  title: 'Laser Cleaning & Rust Removal in North Charleston, SC',
  description:
    'Mobile laser cleaning in North Charleston, SC. Rust and paint off steel, graffiti off hard brick and block, and brass in office lobbies, done on site with no sandblasting. Free estimates.',
  path: '/locations/north-charleston',
});

export default function NorthCharlestonPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/locations' },
          { name: 'North Charleston', path: '/locations/north-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Cleaning and Rust Removal in North Charleston',
          description: 'Mobile laser cleaning in North Charleston, SC. Rust and paint off steel, graffiti off hard brick and block, and brass in office lobbies, done on site with no sandblasting. Free estimates.',
          path: '/locations/north-charleston',
          serviceType: 'Laser cleaning',
          areaServed: ['North Charleston'],
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Cleaning in North Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            North Charleston is where a lot of the Lowcountry&apos;s steel lives. Office buildings, shops and warehouses sit next to older neighborhoods like Park Circle, and the Cooper River runs along the whole east side. We clean rust, paint and graffiti on site, without sandblasting.
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
            Commercial Work and Older Homes
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Much of the work here is commercial. Stair rails, bollards, entry fixtures and lobby brass on office buildings, plus tagged block walls and dumpster enclosures behind shops. Those jobs are scheduled outside business hours so the entrance stays open. One of ours, a solid brass stair post in a North Charleston office lobby, is in the{' '}
            <Link href="/gallery" className="text-[#397774] font-semibold hover:underline">
              gallery
            </Link>
            . That one was polished by hand, with no laser at all.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The neighborhoods around Park Circle and Olde North Charleston go back a long way, and a lot of those houses were built before 1978. Bare rust on their railings and gates is a good fit. Painted metal on those homes needs a negative lead test before we laser it.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean in North Charleston
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Commercial Railings & Fixtures',
                desc: 'Stair rails, handrails, bollards and entry fixtures on offices and shops, done before opening or after close.',
              },
              {
                title: 'Lobby Brass',
                desc: 'Door pulls, handrails and stair posts. Brass is polished by hand first, with the laser only as a backup on solid brass. Plated and lacquered pieces get hand cleaning only.',
              },
              {
                title: 'Graffiti on Brick & Block',
                desc: 'Spray paint tags on hard brick, block, unsealed concrete and painted steel. A test patch comes first, before any quote.',
              },
              {
                title: 'Equipment, Trailers & Parts',
                desc: 'Trailer frames, brackets and parts stripped of rust and old paint in the yard or on our bench, ready for primer.',
              },
              {
                title: 'Gates & Railings on Older Homes',
                desc: 'Iron and steel around Park Circle and the older neighborhoods. Bare rust comes off after a test spot. Paint on pre-1978 homes needs a negative lead test first.',
              },
              {
                title: 'Grease & Carbon',
                desc: 'Baked-on buildup on grill grates and engine brackets brought to the bench. Test spot first.',
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
                problem: 'Means closing off an entrance or hauling the piece away. Media gets into doors, HVAC intakes and parked cars, and it takes base metal off with the rust.',
                safe: false,
              },
              {
                method: 'Chemical Stripping',
                problem: 'Fumes near an occupied building and runoff into storm drains. Slow on rust, and every surface has to be neutralized and rinsed.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'On site, dry, and no water. Dust and fume are extracted and vacuumed up. Dialed in on a test spot to keep as much of the surface as possible, ready for primer the same day.',
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
          <h2 className="text-3xl font-bold text-white mb-6">North Charleston Areas We Serve</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            From Park Circle and the Cooper River side up through Ashley Phosphate and out to Wescott.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Park Circle',
              'Olde North Charleston',
              'Riverfront Park',
              'Rivers Avenue',
              'Ashley Phosphate',
              'Northwoods',
              'Coosaw Creek',
              'Wescott',
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
            Services for North Charleston Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Commercial Exteriors',
                desc: 'Railings, fixtures and storefront metal on offices and shops, scheduled outside business hours.',
                href: '/services/commercial-exterior-cleaning-charleston',
              },
              {
                title: 'Graffiti Removal',
                desc: 'Tags off hard brick, block and unsealed concrete, with a test patch first.',
                href: '/services/graffiti-removal-charleston',
              },
              {
                title: 'Rust & Paint Removal',
                desc: 'Rust taken off steel and iron down to clean metal, primed the same day.',
                href: '/services/rust-removal-charleston',
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
        path='/locations/north-charleston'
        items={[
          {
            q: 'Can you work on our building without closing the entrance?',
            a:
              'Yes. Commercial jobs are scheduled before opening or after close, and the area is taped off while the laser runs. Dust and fume are extracted as we go.',
          },
          {
            q: 'Do you clean brass in office lobbies?',
            a:
              'Yes. Brass is polished by hand first, and the laser is only a backup for heavy oxide on solid brass. Plated and lacquered pieces get hand cleaning only.',
          },
          {
            q: 'Can you take graffiti off a block wall?',
            a:
              'Usually, on hard brick, block, unsealed concrete and painted steel. We test a small patch first so you see the result before any quote.',
          },
          {
            q: 'Do you work on older homes in Park Circle?',
            a:
              'Yes, for homes that are not individually listed. Bare rust on iron is a good fit. We do not laser paint on pre-1978 homes or child-occupied buildings unless a lead test comes back negative; we refer it to an EPA RRP certified firm.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Other Service Areas"
        intro="The exposure changes with the neighborhood. See how the work reads for other parts of Charleston."
        items={[
          {
            title: 'Summerville',
            desc: 'Historic district ironwork and newer neighborhoods up the Ashley, away from the salt but not the humidity.',
            href: '/locations/summerville',
          },
          {
            title: 'Daniel Island',
            desc: 'Newer homes between the Cooper and the Wando, where railings rust sooner than owners expect.',
            href: '/locations/daniel-island',
          },
          {
            title: 'West Ashley',
            desc: 'Mid-century homes across the Ashley, with original railings, gates and hardware.',
            href: '/locations/west-ashley',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Serving North Charleston
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
