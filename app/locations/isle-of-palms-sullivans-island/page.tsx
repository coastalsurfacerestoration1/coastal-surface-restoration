import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';

export const metadata = pageMetadata({
  title: "Laser Cleaning on Isle of Palms & Sullivan's Island, SC",
  description:
    "Mobile laser cleaning for Isle of Palms and Sullivan's Island properties. Rust removed from steel stair rails, stainless railings, gate hardware and light fixtures, scheduled around rental turnover. Free estimates.",
  path: '/locations/isle-of-palms-sullivans-island',
});

export default function IsleOfPalmsSullivansPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/locations' },
          { name: "Isle of Palms & Sullivan's Island", path: '/locations/isle-of-palms-sullivans-island' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: "Laser Cleaning on Isle of Palms and Sullivan's Island",
          description: "Mobile laser cleaning for Isle of Palms and Sullivan's Island properties. Rust removed from steel stair rails, stainless railings, gate hardware and light fixtures, scheduled around rental turnover. Free estimates.",
          path: '/locations/isle-of-palms-sullivans-island',
          serviceType: 'Laser cleaning',
          areaServed: ['Isle of Palms', "Sullivan's Island"],
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Cleaning on Isle of Palms and Sullivan&apos;s Island
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Barrier island property takes the worst corrosion exposure in the Lowcountry. Salt spray carries inland off the Atlantic every day, and it attacks exterior metal on a timeline that surprises owners who moved here from anywhere else. We remove that corrosion on site, with no chemicals, no abrasives, and no water.
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
            Front-Line Salt Exposure Changes the Maintenance Math
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            On the islands there is nothing between your house and the ocean to slow the salt down. Airborne chloride settles on every exterior surface, holds moisture against the metal, and starts corrosion under paint and coatings long before anything is visible from the ground. Stainless steel is not immune here either. It pits and tea-stains, particularly the lower grades used on a lot of railing and hardware.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            The practical result is that island properties run on a much shorter maintenance cycle than mainland ones. Hardware that holds up for years in Summerville can show rust bleed within a few seasons on Palm Boulevard. Owners tend to respond by replacing pieces, which is the expensive path, or by painting over corrosion, which fails within a season because the rust is still active underneath.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning takes the rust back to sound metal, so primer has a clean surface to bond to. On Sullivan&apos;s Island in particular, older cottages on the Station streets still carry original hardware. Bare rust can be cleaned; pre-1978 paint is lead-tested first.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean on the Islands
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Exterior Stairs & Railings',
                desc: 'Beach access stairs, deck railings, porch rails, and stair stringers in steel and stainless. These take the heaviest salt on the property, and surface rust there turns structural fastest.',
              },
              {
                title: 'Outdoor Shower Hardware',
                desc: 'Stainless and solid brass shower heads, valves and brackets that sit wet and salted year round, tested first. Chrome and plated fixtures are not taken, and nearby cedar is masked.',
              },
              {
                title: 'Hurricane Shutters & Tracks',
                desc: 'Steel hinges, anchor bolts and hardware on hurricane shutters. Aluminum panels and tracks are tested before any quote, since results on aluminum are not yet proven. Corroded track and seized hardware is the reason shutters fail to close when a storm is actually coming.',
              },
              {
                title: 'Marine Stainless & Bronze on Land',
                desc: 'Stainless rails, cleats and bronze fittings off the boat or with the boat on the hard. Tea staining and verdigris come off; no work over the water.',
              },
              {
                title: 'Light Fixtures, Numbers & Trim Metal',
                desc: 'Coach lights, steel house numbers, mailboxes and downspout brackets. Small pieces that streak rust down siding and stucco.',
              },
              {
                title: 'Golf Carts, Bike Racks & Gates',
                desc: 'Steel bike racks, pool gate hardware and fence hardware, plus steel golf cart parts brought to the bench. Aluminum cart frames are not promised.',
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

      {/* Rental Property Angle */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            For Rental Owners and Property Managers
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            A large share of the housing stock on Isle of Palms and Sullivan&apos;s Island is rented, and rusted railings, streaked stucco, and corroded hardware show up in guest photos and reviews long before they show up on a maintenance list. We schedule around occupancy rather than around our own convenience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Turnover Windows',
                desc: 'Smaller jobs, like a set of stair rails or gate hardware, can fit a changeover day. Bare steel gets primer the same day, so plan for paint dry time.',
              },
              {
                title: 'Off-Season Resets',
                desc: 'Off-season is the best time to book several railings or a batch of hardware at once, while the calendar is open.',
              },
              {
                title: 'Yearly Checks',
                desc: 'For managers with several doors on the islands, a yearly check of rails and hardware catches rust while it is still a small job.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#1a3958] border border-[#397774]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Island Areas We Serve</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Both islands end to end, ocean side and creek side, plus the connector area.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Wild Dunes',
              'Isle of Palms Front Beach',
              'Palm Boulevard',
              'Ocean Boulevard',
              'Hamlin Beach',
              'Breach Inlet',
              "Sullivan's Island",
              'Middle Street',
              'Station 9 to Station 32',
              'Fort Moultrie Area',
              'IOP Connector',
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
            Services for Island Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Vacation Rental Restoration',
                desc: 'Railing and hardware work scheduled around turnover, with yearly checks for property managers.',
                href: '/services/vacation-rental-cleaning-charleston',
              },
              {
                title: 'Rust & Paint Removal',
                desc: 'Salt corrosion taken back to clean base metal so a new coating actually holds.',
                href: '/services/rust-removal-charleston',
              },
              {
                title: 'Marine Cleaning',
                desc: 'Stainless and bronze boat hardware cleaned on land or on the hard.',
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
        path='/locations/isle-of-palms-sullivans-island'
        items={[
          {
            q: 'Why does hardware corrode so much faster on the islands?',
            a:
              'There is nothing between the property and the Atlantic to slow the salt down. Airborne chloride settles on exterior surfaces and holds moisture against the metal, so corrosion starts under coatings before anything is visible. Hardware that holds up for years inland can show rust bleed within a few seasons here.',
          },
          {
            q: 'Does stainless steel really rust out here?',
            a:
              'Yes. The lower stainless grades used on a lot of railing and marine hardware pit and tea-stain in front-line salt exposure. It is not a sign of a defective part, it is the grade meeting an environment it was not specified for. Even 316 tea-stains here. The laser takes the stain off, and a passivation treatment afterward helps slow its return.',
          },
          {
            q: 'Can you schedule around rental turnovers?',
            a:
              'Yes. Bare steel gets primer the same day, so allow dry time before guests use a rail. For rentals we work within turnover windows, and the off-season is usually the most efficient time for larger jobs.',
          },
          {
            q: 'Do you work at the marina or on docks?',
            a:
              'No. We do not work on docks, lifts or boats over the water. Hardware that comes off, or a boat on the hard, can be cleaned on land.',
          },
          {
            q: 'What island jobs suit laser cleaning best?',
            a:
              'Steel and stainless stair rails, deck rails and gate hardware. These take the heaviest salt, and rust there turns structural fastest.',
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
            Serving Isle of Palms and Sullivan&apos;s Island
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates on every job. Send a photo of the railing, fixture, or hardware and we will tell you what laser cleaning can do for it, usually within one business day.
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
