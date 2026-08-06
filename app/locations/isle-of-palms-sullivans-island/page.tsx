import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';

export const metadata = pageMetadata({
  title: "Laser Cleaning on Isle of Palms & Sullivan's Island, SC",
  description:
    "Mobile laser cleaning for Isle of Palms and Sullivan's Island properties. Salt corrosion removed from railings, outdoor showers, shutters, and hardware. Rental turnover scheduling available. Free estimates.",
  path: '/locations/isle-of-palms-sullivans-island',
});

export default function IsleOfPalmsSullivansPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
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
          description: "Mobile laser cleaning for Isle of Palms and Sullivan's Island properties. Salt corrosion removed from railings, outdoor showers, shutters, and hardware. Rental turnover scheduling available. Free estimates.",
          path: '/locations/isle-of-palms-sullivans-island',
          serviceType: 'Laser cleaning',
          areaServed: ['Isle of Palms', "Sullivan's Island"],
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Cleaning on Isle of Palms and Sullivan&apos;s Island
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Barrier island property takes the worst corrosion exposure in the Lowcountry. Salt spray carries inland off the Atlantic every single day, and it attacks exterior metal on a timeline that surprises owners who moved here from anywhere else. We remove that corrosion on site, with no chemicals, no abrasives, and no water.
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
            Front-Line Salt Exposure Changes the Maintenance Math
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            On the islands there is nothing between your house and the ocean to slow the salt down. Airborne chloride settles on every exterior surface, holds moisture against the metal, and starts corrosion under paint and coatings long before anything is visible from the ground. Stainless steel is not immune here either. It pits and tea-stains, particularly the lower grades used on a lot of railing and hardware.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            The practical result is that island properties run on a much shorter maintenance cycle than mainland ones. Hardware that would last fifteen years in Summerville starts showing rust bleed in three or four on Palm Boulevard. Owners tend to respond by replacing pieces, which is the expensive path, or by painting over corrosion, which fails within a season because the rust is still active underneath.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning takes the corrosion back to sound base metal without removing the metal itself, so a coating actually has clean substrate to bond to. On Sullivan&apos;s Island in particular, where a lot of the older cottages and the Station street homes still carry original hardware and ironwork, it also means those pieces can be cleaned rather than swapped out for reproductions.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean on the Islands
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Exterior Stairs & Railings',
                desc: 'Beach access stairs, deck railings, porch rails, and stair stringers. The single most common island job, and the one where surface rust turns into a structural conversation fastest.',
              },
              {
                title: 'Outdoor Shower Hardware',
                desc: 'Fixtures, valves, brackets, and enclosure hardware that sit wet and salted year round. Cleaned in place without stripping the surrounding cedar or shell finish.',
              },
              {
                title: 'Hurricane Shutters & Tracks',
                desc: 'Shutter panels, hinges, tracks, and anchor hardware. Corroded track and seized hardware is the reason shutters fail to close when a storm is actually coming.',
              },
              {
                title: 'Dock, Boat Lift & Marina Hardware',
                desc: 'Lift frames, cables hardware, cleats, ladders, and fittings on the creek side and at the Isle of Palms Marina. We work at the dock rather than hauling parts off site.',
              },
              {
                title: 'Light Fixtures, Numbers & Trim Metal',
                desc: 'Coach lights, house numbers, mailboxes, gutters, downspout brackets, and hurricane strapping. Small pieces that streak rust down siding and stucco.',
              },
              {
                title: 'Golf Carts, Bike Racks & Gates',
                desc: 'Cart frames and hardware, bike racks, pool gates, and fence hardware. Island staples that live outdoors permanently and corrode accordingly.',
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

      {/* Rental Property Angle */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
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
                desc: 'Most exterior work fits in a midweek changeover day. Nothing wet is left behind and there is no cure time, so the property is guest-ready the same day.',
              },
              {
                title: 'Off-Season Resets',
                desc: 'The deeper full-property passes are best booked in the winter shoulder season when the calendar is open and the whole exterior can be brought back at once.',
              },
              {
                title: 'Recurring Maintenance',
                desc: 'For managers with multiple doors on the islands, a scheduled annual or semiannual pass keeps corrosion off the review page and off the capital budget.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Island Areas We Serve</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Both islands end to end, ocean side and creek side, plus the connector and Marina areas.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Wild Dunes',
              'Isle of Palms Front Beach',
              'Palm Boulevard',
              'Ocean Boulevard',
              'Isle of Palms Marina',
              'Hamlin Beach',
              'Breach Inlet',
              "Sullivan's Island",
              'Middle Street',
              'Station 9 to Station 32',
              'Fort Moultrie Area',
              'IOP Connector',
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
            Services Most Requested on the Islands
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Vacation Rental Restoration',
                desc: 'Exterior resets scheduled around turnover, plus recurring contracts for property managers.',
                href: '/services/vacation-rental-cleaning-charleston',
              },
              {
                title: 'Rust & Paint Removal',
                desc: 'Salt corrosion taken back to clean base metal so a new coating actually holds.',
                href: '/services/rust-removal-charleston',
              },
              {
                title: 'Marine Cleaning',
                desc: 'Dock, lift, and marina hardware cleaned on site on the creek side of both islands.',
                href: '/services/marine-cleaning-charleston',
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
        path='/locations/isle-of-palms-sullivans-island'
        items={[
          {
            q: 'Why does hardware corrode so much faster on the islands?',
            a:
              'There is nothing between the property and the Atlantic to slow the salt down. Airborne chloride settles on exterior surfaces and holds moisture against the metal, so corrosion starts under coatings before anything is visible. Hardware that lasts fifteen years inland can show rust bleed in three or four here.',
          },
          {
            q: 'Does stainless steel really rust out here?',
            a:
              'Yes. The lower stainless grades used on a lot of railing and marine hardware pit and tea-stain in front-line salt exposure. It is not a sign of a defective part, it is the grade meeting an environment it was not specified for.',
          },
          {
            q: 'Can you schedule around rental turnovers?',
            a:
              'Yes. There is no cure time and no wet surface afterward, so an area is usable immediately. For rentals we work within turnover windows, and the off-season is usually the most efficient time for larger jobs.',
          },
          {
            q: 'Do you work at the marina and on private docks?',
            a:
              'Yes. Lift frames, cleats, ladders, and fittings are cleaned at the dock. The process is dry, so nothing enters the water.',
          },
          {
            q: 'What is the most common island job?',
            a:
              'Exterior stairs and railings. Beach access stairs and deck rails take the heaviest exposure on the property, and surface rust there turns into a structural conversation faster than anywhere else.',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Serving Isle of Palms and Sullivan&apos;s Island
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates on every job. Send a photo of the railing, fixture, or hardware and we will tell you what laser cleaning can do for it, usually within 24 hours.
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
