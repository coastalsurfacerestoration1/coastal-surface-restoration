import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laser Cleaning on James Island & Folly Beach, SC | Coastal Surface Restoration',
  description:
    'Mobile laser cleaning for James Island and Folly Beach. Dock and boat lift hardware, marsh-front railings, trailers, and exterior metal cleaned on site with no chemicals or runoff. Free estimates.',
};

export default function JamesIslandFollyBeachPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Cleaning on James Island and Folly Beach
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            This is the tidal creek side of Charleston. Docks, boat lifts, trailers, and marsh-front hardware sitting in brackish water and salt air, on properties that get used hard and year round. We remove rust and corrosion right where the equipment sits, with no chemicals, no blasting media, and nothing running off into the creek.
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
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Creek-Front and Marsh-Front Corrosion
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            James Island and Folly sit in and around tidal marsh. Properties along Clark Sound, the Stono, the Folly River, and the creeks running through Riverland Terrace and Lighthouse Point get a constant cycle of salt-laden humidity, tidal wetting, and drying. That cycle is harder on metal than straight ocean exposure in some ways, because hardware spends more time damp and less time drying out completely.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            It also means most of the metal here is functional rather than decorative. Boat lifts, davits, dock ladders, trailer frames, gate hardware, and outboard brackets. When those corrode it is not just an appearance problem, it is a piece of equipment you are trusting with a boat.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Cleaning that hardware in place matters here more than anywhere else we work. Blasting a boat lift means either tenting it over the water or dismantling it, and chemical stripping over a tidal creek is a non-starter. Laser cleaning is dry and contained at the surface, so it can be done on a working dock without anything reaching the water below.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-16 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean on James Island and Folly
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Boat Lifts & Davits',
                desc: 'Lift frames, cradles, motor housings, and mounting hardware cleaned in place on the dock. Corrosion comes off without blasting media dropping into the creek or into the lift mechanism.',
              },
              {
                title: 'Dock Hardware & Ladders',
                desc: 'Cleats, ladders, hinges, gangway hardware, brackets, and railings on private docks throughout Clark Sound, the Stono, and the Folly River.',
              },
              {
                title: 'Trailers & Towing Hardware',
                desc: 'Boat trailer frames, axles, springs, hitches, and jacks. Anything that gets backed down the ramp at Riverland Drive and comes back out wet with salt.',
              },
              {
                title: 'Marsh-Front Railings & Exterior Metal',
                desc: 'Deck rails, stair rails, screened porch frames, gutters, and structural strapping on homes that back up to marsh and take the humidity year round.',
              },
              {
                title: 'Older Cottage Hardware',
                desc: 'Original hinges, latches, shutter hardware, and light fixtures on the older Riverland Terrace and Folly cottages, where the pieces are worth keeping rather than replacing.',
              },
              {
                title: 'Graffiti & Commercial Surfaces',
                desc: 'Tag removal and surface cleaning on commercial frontage around Center Street and the Folly business district, including brick, block, and painted metal.',
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

      {/* Working On The Water */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Working on a Dock or Creek-Front Property
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Photo Estimate',
                desc: 'Send photos of the lift, dock, or hardware. For dock work it helps to include a wide shot as well as close-ups so we can see access, walkway length, and how far out the working area sits.',
              },
              {
                step: '02',
                title: 'Tide-Aware Scheduling',
                desc: 'Some dock and lift work is much easier at a particular stage of tide. We plan the visit around that rather than showing up and working around whatever the water is doing.',
              },
              {
                step: '03',
                title: 'Portable Setup',
                desc: 'The system is a backpack laser unit and a portable generator, so we can carry it out a long dock walkway. No compressor, no blast pot, no hoses run from the driveway.',
              },
              {
                step: '04',
                title: 'Nothing in the Water',
                desc: 'Dry process, no chemicals, no abrasive media, no rinse water. There is no runoff to contain and nothing that can end up in the marsh or the creek.',
              },
              {
                step: '05',
                title: 'Coating Referral',
                desc: 'Bare metal in this environment needs protection quickly. We can refer you to a local contractor for coating, or coordinate the timing so it goes on right after we finish.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="text-[#00d4d4] font-bold text-2xl w-10 shrink-0">{item.step}</div>
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
      <section className="py-16 bg-[#0d1f3c]">
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
              <span key={area} className="bg-[#0a1628] border border-[#0e7c7b]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Services Most Requested Here
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Marine Cleaning',
                desc: 'Lifts, davits, dock hardware, and trailers cleaned on site with nothing entering the water.',
                href: '/services/marine-cleaning-charleston',
              },
              {
                title: 'Rust & Paint Removal',
                desc: 'Corrosion removed from structural and functional metal down to sound base material.',
                href: '/services/rust-removal-charleston',
              },
              {
                title: 'Vacation Rental Restoration',
                desc: 'Exterior resets for the rental cottages and beach houses on Folly and the creek side.',
                href: '/services/vacation-rental-cleaning-charleston',
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

      {/* CTA */}
      <section className="py-16 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Serving James Island and Folly Beach
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates on every job. Send a photo of the lift, dock hardware, or trailer and we will tell you what laser cleaning can do for it, usually within 24 hours. Minimum job size $400.
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
