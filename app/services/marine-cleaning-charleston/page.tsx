import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';
import ServiceAreaChips from '@/app/components/ServiceAreaChips';

export const metadata = pageMetadata({
  title: 'Laser Marine Cleaning in Charleston, SC',
  description:
    'Laser cleaning for marine metal hardware in Charleston, SC. Stainless and bronze boat hardware cleaned on land or on the hard: tea staining, weld tint, verdigris and rust, with no sandblasting or chemical strippers. Free estimates.',
  path: '/services/marine-cleaning-charleston',
});

export default function MarineCleaningPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Marine Cleaning', path: '/services/marine-cleaning-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Marine Cleaning',
          description: 'Laser cleaning for marine metal hardware in Charleston, SC. Stainless and bronze boat hardware cleaned on land or on the hard: tea staining, weld tint, verdigris and rust, with no sandblasting or chemical strippers. Free estimates.',
          path: '/services/marine-cleaning-charleston',
          serviceType: 'Marine cleaning',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Marine Cleaning
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Marine Cleaning in Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Salt water and Lowcountry humidity are hard on marine metal. Tea staining on stainless rails, verdigris on bronze cleats and rust on steel brackets build up fast. Laser cleaning takes that back to clean metal without sandblasting or chemical strippers. The work happens on land, with parts off the boat or the boat on the hard. Hulls, gelcoat, and antifouling paint on fiberglass are outside what we do.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#397774] text-white px-8 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Context */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Built for a Saltwater Environment
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Salt air off the harbor and the Ashley and Cooper rivers is hard on boat metal. Chlorides accelerate rust, galvanic corrosion eats at dissimilar metals, and oxidation dulls every exposed surface. Keeping marine hardware in service means removing that corrosion without making things worse.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Sandblasting warps thin stainless and aluminum and leaves grit in every crevice. Chemical strippers create runoff that has no place near the water. Wire wheels only reach flat surfaces and miss the pitted areas where corrosion hides.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning is dialed in on a test spot to remove the rust, corrosion and oxidation layer and keep as much of the metal underneath as possible. There is no grit, no chemical bath and no water, so nothing washes into the harbor. The removed corrosion turns to dust and fume, which we capture with extraction and HEPA-vacuum.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Marine Surfaces We Clean
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Boat Trailers',
                desc: 'Steel trailer brackets, axles and fasteners rusted from saltwater launches. Galvanized parts get a test spot first; aluminum trailers we cannot promise yet.',
              },
              {
                title: 'Deck Hardware & Fittings',
                desc: 'Stainless rails, stanchions and cleats with tea staining, and bronze chocks and portlights with verdigris, cleaned off the boat or on the hard.',
              },
              {
                title: 'Removed Steel & Cast Parts',
                desc: 'Windlass housings, brackets and anchor parts brought to us off the boat, stripped of paint and rust and ready for primer.',
              },
              {
                title: 'Anchors, Chain & Ground Tackle',
                desc: 'Steel anchors, shackles and hardware with rust and old paint, cleaned off the boat. Galvanized chain loses zinc when stripped, so it is test first.',
              },
              {
                title: 'Props, Shafts & Through-Hull Fittings',
                desc: 'Bronze props, shafts and struts removed or with the boat on the hard, test spot first. Heavy antifouling paint gets scraped first, and the beam never fires with gelcoat in its path.',
              },
              {
                title: 'Engine & Mechanical Parts',
                desc: 'Steel and cast brackets and mounts off the engine. Aluminum outboard parts we cannot promise yet.',
              },
              {
                title: 'Stainless Tea Staining & Weld Tint',
                desc: 'Tea staining and weld heat tint on 304 and 316 stainless come off to a clean surface, and we recommend passivation after. Aluminum results we cannot promise yet.',
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

      {/* Comparison */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Laser vs. Sandblasting vs. Chemical Cleaning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                method: 'Sandblasting',
                problem: 'Warps thin stainless and aluminum, embeds grit in crevices and threads, and strips protective finishes along with the corrosion.',
                safe: false,
              },
              {
                method: 'Chemical Cleaning',
                problem: 'Creates hazardous runoff that cannot be used near the harbor or waterways, and harsh acids can pit and discolor marine alloys.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'Dialed in on a test spot to lift rust, tea staining and oxide and keep as much of the metal as possible. No grit, no chemical strippers, no water, and nothing washed into the harbor.',
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
                    {item.safe ? 'Recommended' : 'Risk to Marine Metal'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Our Marine Cleaning Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'On-Site Assessment',
                desc: 'We inspect the hardware in person, identify the metal and the extent of corrosion, and confirm laser cleaning is the right approach. Work is done on land: at your home, at a boatyard with the boat on the hard, or with the hardware brought to us.',
              },
              {
                step: '02',
                title: 'Surface Preparation',
                desc: 'A controlled laser area goes up with eyewear. Parts come off the boat where they can, and if gelcoat or teak sits in the beam path, the laser does not fire.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes rust, corrosion, and oxidation layer by layer. Settings are matched to stainless, bronze or steel and checked on a test spot first.',
              },
              {
                step: '04',
                title: 'Surface Inspection',
                desc: 'The cleaned surface is checked with you and photographed before and after.',
              },
              {
                step: '05',
                title: 'Protection Guidance',
                desc: 'Bare metal corrodes again in salt water. For 316 stainless we recommend re-passivation after cleaning, and for other metals we can advise on protective coatings and a maintenance schedule.',
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

      {/* Service Area */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Service Area</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            We serve boat owners, boatyards and marine shops across the Charleston area, working on land: at your home, on the hard, or with hardware brought to us.
          </p>
          <ServiceAreaChips
            areas={[
              'North Charleston',
              'Summerville',
              'Mount Pleasant',
              'Isle of Palms',
              "Sullivan's Island",
              'Daniel Island',
              'James Island',
              'Folly Beach',
              'Old Village',
              'West Ashley',
              'Downtown Charleston',
              'Wild Dunes',
            ]}
          />
        </div>
      </section>

      <Faq
        path='/services/marine-cleaning-charleston'
        items={[
          {
            q: 'Can you clean a boat trailer without removing the wheels or bearings?',
            a:
              'Usually, yes. There is no blast media to pack into bearings, brakes or threads, so the trailer can stay assembled. Bare steel needs primer the same day, and galvanized parts get a test spot first.',
          },
          {
            q: 'Do you work dockside?',
            a:
              'No. We do not work on docks, piers or boats in the water. Hardware can come off the boat to us, or we can work with the boat on a trailer or on the hard at a yard that allows it.',
          },
          {
            q: 'Is it safe on aluminum and stainless?',
            a:
              'On stainless it usually works well, after a test spot; tea staining and weld tint are some of the best work this laser does. Aluminum is still unproven for us, so we will not promise a result on it. On 316 stainless we also recommend re-passivation afterward, which restores the passive layer that resists salt corrosion.',
          },
          {
            q: 'What about corrosion in hard to reach fittings?',
            a:
              'Detail work is where the method has an advantage. The beam reaches around fasteners and along weld seams with no media to pack in. Gelcoat, teak, glass and sealant nearby still need the part removed or shielded.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Related Services"
        intro="Marine hardware pairs with two other services on waterfront properties: rental property metalwork and general rust removal."
        items={[
          {
            title: 'Vacation Rental Restoration',
            desc: 'Salt corrosion removed from waterfront rental properties on a turnover-friendly schedule.',
            href: '/services/vacation-rental-cleaning-charleston',
          },
          {
            title: 'Rust and Paint Removal',
            desc: 'Corrosion lifted from trailers, tools, and shop equipment away from the water.',
            href: '/services/rust-removal-charleston',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Keep your marine hardware in service
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates for all jobs. Send us a photo of the hardware and we will assess it and follow up within one business day.
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