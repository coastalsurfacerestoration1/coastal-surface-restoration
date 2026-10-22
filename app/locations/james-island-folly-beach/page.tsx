import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';

export const metadata = pageMetadata({
  title: 'Laser Cleaning on James Island & Folly Beach, SC',
  description:
    'Mobile surface restoration for James Island and Folly Beach. Boat trailers, marsh-front railings, gate hardware and removed marine parts cleaned on land with no sandblasting or chemical strippers. Free estimates.',
  path: '/locations/james-island-folly-beach',
});

export default function JamesIslandFollyBeachPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/locations' },
          { name: 'James Island & Folly Beach', path: '/locations/james-island-folly-beach' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Cleaning on James Island and Folly Beach',
          description: 'Mobile surface restoration for James Island and Folly Beach. Boat trailers, marsh-front railings, gate hardware and removed marine parts cleaned on land with no sandblasting or chemical strippers. Free estimates.',
          path: '/locations/james-island-folly-beach',
          serviceType: 'Laser cleaning',
          areaServed: ['James Island', 'Folly Beach'],
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Cleaning on James Island and Folly Beach
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            This is the tidal creek side of Charleston. Trailers, railings and marsh-front hardware sit in brackish air and get used hard year round. We remove the rust on land, with no sandblasting and no chemical strippers.
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
            Creek-Front and Marsh-Front Corrosion
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            James Island and Folly sit in and around tidal marsh. Properties along Clark Sound, the Stono, the Folly River, and the creeks running through Riverland Terrace and Lighthouse Point get a constant cycle of salt-laden humidity, tidal wetting, and drying. That cycle is harder on metal than straight ocean exposure in some ways, because hardware spends more time damp and less time drying out completely.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            It also means most of the metal here is functional rather than decorative. Trailer frames, axles, gate hardware, railings, and outboard brackets. When those corrode, the problem goes past looks. That is equipment you are trusting with a boat.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Dock and lift work over the water is not something we take on. Trailers, railings and any hardware that can come off the dock are a good fit, cleaned on land.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean on James Island and Folly
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Stainless & Bronze Boat Hardware',
                desc: 'Rails, cleats, stanchions and bronze fittings off the boat or with it on the hard. Tea staining and verdigris come off clean.',
              },
              {
                title: 'Removed Marine Parts',
                desc: 'Windlass housings, brackets, anchors and trailer parts brought ashore, stripped of paint and rust and primed the same day.',
              },
              {
                title: 'Trailers & Towing Hardware',
                desc: 'Painted steel trailer frames, axles, springs, hitches and jacks; galvanized trailers are tested first. Anything that gets backed down the ramp at Riverland Drive and comes back out wet with salt.',
              },
              {
                title: 'Marsh-Front Railings & Exterior Metal',
                desc: 'Steel deck rails and stair rails, gate hardware and light fixtures on homes that back up to marsh and take the humidity year round.',
              },
              {
                title: 'Older Cottage Hardware',
                desc: 'Original hinges, latches and shutter hardware on older Riverland Terrace and Folly cottages, best removed for the bench. Pre-1978 paint is lead-tested first.',
              },
              {
                title: 'Graffiti & Commercial Surfaces',
                desc: 'Dark tag removal on hard brick and block around Center Street and the Folly business district. Every graffiti job starts with a test patch.',
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

      {/* Working on a creek-front property */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Working on a Creek-Front Property
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Photo Estimate',
                desc: 'Send photos of the trailer, railing, or hardware. A wide shot plus close-ups helps us see access and where the work sits.',
              },
              {
                step: '02',
                title: 'Weather-Aware Scheduling',
                desc: 'The laser does not run in rain, so we plan the visit around the forecast.',
              },
              {
                step: '03',
                title: 'Portable Setup',
                desc: 'The system is a backpack laser unit with a portable generator and small air compressor. No blast pot and no water hoses.',
              },
              {
                step: '04',
                title: 'No Runoff',
                desc: 'Dry process, no chemical strippers, no sandblasting, no rinse water. Dust and fume are extracted and vacuumed up on land, away from the marsh.',
              },
              {
                step: '05',
                title: 'Coating Referral',
                desc: 'Bare metal in this environment needs protection quickly. We can refer you to a local contractor for coating, or coordinate the timing so it goes on right after we finish.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="text-[#397774] font-bold text-2xl w-10 shrink-0">{item.step}</div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Areas We Serve</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            All of James Island and Folly Beach, plus the surrounding creek and marsh communities.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Riverland Terrace',
              'Harbor View',
              'Stiles Point',
              'Lighthouse Point',
              'Clark Sound',
              'Fort Johnson',
              'Secessionville',
              'Sol Legare',
              'Folly Beach',
              'Center Street',
              'East Ashley Avenue',
              'West Ashley Avenue',
              'Folly River',
              'Battery Island',
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
            Services for James Island and Folly
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Marine Cleaning',
                desc: 'Trailers and removed boat hardware cleaned on land.',
                href: '/services/marine-cleaning-charleston',
              },
              {
                title: 'Rust & Paint Removal',
                desc: 'Corrosion removed from structural and functional metal down to sound base material.',
                href: '/services/rust-removal-charleston',
              },
              {
                title: 'Vacation Rental Restoration',
                desc: 'Railing and hardware work for rental cottages on Folly and the creek side.',
                href: '/services/vacation-rental-cleaning-charleston',
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
        path='/locations/james-island-folly-beach'
        items={[
          {
            q: 'Do you work on boat lifts or docks?',
            a:
              'No. Nothing over the water. Lift parts or hardware that can be removed and brought ashore can be cleaned on land.',
          },
          {
            q: 'Does anything get into the water?',
            a:
              'No liquids. The process is dry, with no sandblasting or chemical strippers, and all work is done on land. Dust and fume are extracted and vacuumed up.',
          },
          {
            q: 'Do you work in the rain?',
            a:
              'No. The laser runs dry, so we schedule around the forecast and reschedule if weather turns.',
          },
          {
            q: 'Why does hardware corrode so fast on the marsh side?',
            a:
              'Tidal marsh means a constant cycle of salt-laden humidity, wetting, and partial drying. Hardware spends more time damp than it would in straight ocean exposure, and that cycle drives corrosion into working parts like axles, hinges, and cable fittings.',
          },
          {
            q: 'What do you work on around James Island and Folly?',
            a:
              'Trailers and towing hardware, stainless and bronze boat hardware on land, marsh-front railings, older cottage hardware, and dark graffiti around Center Street.',
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
            title: 'Mount Pleasant',
            desc: 'Salt-driven corrosion on Old Village hardware, boat trailers, and Carolina Park exterior metal.',
            href: '/locations/mount-pleasant',
          },
          {
            title: "Isle of Palms & Sullivan's Island",
            desc: 'Barrier island properties where salt spray hits the hardest, cleaned on site with no runoff.',
            href: '/locations/isle-of-palms-sullivans-island',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Serving James Island and Folly Beach
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates on every job. Send a photo of the trailer, railing, or hardware and we will tell you what laser cleaning can do for it, usually within one business day.
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
