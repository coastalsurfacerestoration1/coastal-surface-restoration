import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';

export const metadata = pageMetadata({
  title: 'Laser Rust Removal on Daniel Island, SC',
  description:
    'Mobile rust removal on Daniel Island, SC. Balcony and porch railings, gates, light fixtures and dock hardware on land cleaned on site with no sandblasting. Free estimates.',
  path: '/locations/daniel-island',
});

export default function DanielIslandPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/locations' },
          { name: 'Daniel Island', path: '/locations/daniel-island' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Rust Removal on Daniel Island',
          description: 'Mobile rust removal on Daniel Island, SC. Balcony and porch railings, gates, light fixtures and dock hardware on land cleaned on site with no sandblasting. Free estimates.',
          path: '/locations/daniel-island',
          serviceType: 'Laser cleaning',
          areaServed: ['Daniel Island'],
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Rust Removal on Daniel Island
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Daniel Island sits between the Cooper and the Wando, with marsh on most of its edges. The homes are newer than most of Charleston, but the railings and fixtures on them see river air every day, and rust shows up sooner than owners expect. We take it off on site, without sandblasting.
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
            New Construction, Old Problem
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Most of the island was built in the last twenty-five years, so the metal is modern painted steel, powder coat and stainless. That is the stuff people assume will hold up. On a balcony facing the marsh it starts to bubble at the welds and the base plates within a few years, and the rust bleeds onto the trim below.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Painting over it buys a season. Taking the rust down to clean metal and priming it the same day is what actually stops it. That is what we did on our first finished job, a balcony railing on Daniel Island, and the before and after photos are in the{' '}
            <Link href="/gallery" className="text-[#397774] font-semibold hover:underline">
              gallery
            </Link>
            .
          </p>
          <p className="text-gray-400 leading-relaxed">
            Because the homes are close together and the yards are small, a dry method matters here. Nothing gets blasted onto the neighbor&apos;s car or into the pond.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean on Daniel Island
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Balcony & Porch Railings',
                desc: 'Painted steel and iron railings stripped of rust and failing paint at the welds and base plates, then primed the same day. Aluminum is tested before any quote.',
              },
              {
                title: 'Gates & Fencing',
                desc: 'Steel and iron gates, latches and hinges on courtyards and side yards, cleaned in place without taking them off the posts.',
              },
              {
                title: 'Light Fixtures & Door Hardware',
                desc: 'Iron sconces, mailboxes and solid brass door hardware. Brass is polished by hand first, with the laser only as a backup on solid brass. Plated pieces get hand cleaning only.',
              },
              {
                title: 'Dock & Boat Hardware on Land',
                desc: 'Stainless cleats, rails and bronze fittings taken off and cleaned in the driveway, plus boat trailers. Nothing is done over the water.',
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
                problem: 'Media travels on the wind, and on a lot this size it ends up on the next balcony, the cars and the landscaping. It also takes base metal off with the rust.',
                safe: false,
              },
              {
                method: 'Chemical Stripping',
                problem: 'Runoff into ponds and marsh is the last thing an island HOA wants to hear about. Slow on rust, and it has to be neutralized and rinsed.',
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
            Bare steel on the island will flash rust again if it is left uncoated, so exterior pieces get primer the same day, from us or from a painting contractor we refer.
          </p>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Daniel Island Areas We Serve</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            The whole island, from the town center out to the river side.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Daniel Island Park',
              'Smythe Park',
              'Barfield Park',
              "Codner's Ferry Park",
              'Seven Farms Drive',
              'Island Park Drive',
              'Etiwan Park',
              'Center Park',
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
            Services for Daniel Island Homes
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
                title: 'Commercial Exteriors',
                desc: 'Railings, fixtures and storefront metal on offices and shops, scheduled outside business hours.',
                href: '/services/commercial-exterior-cleaning-charleston',
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
        path='/locations/daniel-island'
        items={[
          {
            q: 'Do you come to Daniel Island?',
            a:
              'Yes. Railings, gates and fixtures are cleaned in place, and removed boat hardware is cleaned in your driveway. Nothing is done over the water.',
          },
          {
            q: 'My house is only a few years old. Why are the railings rusting already?',
            a:
              'River and marsh air gets into any chip or thin spot in the paint, usually at the welds and where the posts meet the deck. Once rust starts under the coating it spreads until the steel is taken back to clean metal and primed.',
          },
          {
            q: 'Do I need HOA approval?',
            a:
              'For a color change, usually yes. Cleaning and priming a railing back to its existing color usually is not, but check with your association before the job.',
          },
          {
            q: 'Will rust come back on my railings?',
            a:
              'Bare metal in this air will flash rust if it is left uncoated. Exterior pieces get primer the same day, from us or from a painting contractor we refer.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Other Service Areas"
        intro="The exposure changes with the neighborhood. See how the work reads for other parts of Charleston."
        items={[
          {
            title: 'Mount Pleasant',
            desc: 'Old Village ironwork and newer East Cooper homes carrying the same salt load.',
            href: '/locations/mount-pleasant',
          },
          {
            title: 'North Charleston',
            desc: 'Commercial exteriors, Park Circle homes and equipment along the Cooper River side.',
            href: '/locations/north-charleston',
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
            Serving Daniel Island
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
