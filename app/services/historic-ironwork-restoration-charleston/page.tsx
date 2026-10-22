import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';
import ServiceAreaChips from '@/app/components/ServiceAreaChips';

export const metadata = pageMetadata({
  title: 'Historic Ironwork Restoration in Charleston, SC',
  description:
    'Laser rust and paint removal for iron and steel gates and railings in Charleston, SC. No sandblasting or chemical strippers, test spot first. Pre-1978 paint needs a negative lead test. Free estimates.',
  path: '/services/historic-ironwork-restoration-charleston',
});

export default function HistoricIronworkPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Historic Ironwork Restoration', path: '/services/historic-ironwork-restoration-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Historic Ironwork Restoration',
          description: 'Laser rust and paint removal for iron and steel gates and railings in Charleston, SC. No sandblasting or chemical strippers, test spot first. Pre-1978 paint needs a negative lead test. Free estimates.',
          path: '/services/historic-ironwork-restoration-charleston',
          serviceType: 'Historic restoration',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Historic District & Beyond
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Restoration for Charleston&apos;s Historic Ironwork
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Charleston has one of the best collections of historic ironwork in the Southeast, and salt air is hard on all of it. Laser cleaning lifts rust and failed paint without sandblasting or chemical strippers, dialed in on a test spot to keep as much of the original iron as possible. True pre-1900 wrought iron gets extra testing.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#397774] text-white px-8 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Charleston Ironwork Context */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Charleston Ironwork, From Mild Steel to True Wrought Iron
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Charleston&apos;s historic district contains some of the most celebrated ironwork in North America. It runs from Philip Simmons-era gates to 1960s mild steel railings in West Ashley, and most of what we see is mild steel. Ironwork on individually listed landmarks belongs with a conservator, not with us.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            The challenge with restoring historic ironwork is that traditional cleaning methods all risk damaging or destroying the original surface. Sandblasting, chemical stripping, and wire brushing each take something off the piece that cannot be put back. On a gate that has stood since the 1800s, that risk is too high.
          </p>
          <p className="text-gray-400 leading-relaxed">
            A pulsed fiber laser is dialed in on a test spot to lift rust and paint and keep as much of the original iron as possible, and that spot shows how the surface responds before we quote. Cleaned iron looks matte and a little different. It also flash-rusts overnight here, so primer or a stable finish goes on the same day.
          </p>
        </div>
      </section>

      {/* What We Restore */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Historic Ironwork We Restore in Charleston
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Iron & Steel Gates',
                desc: 'Entrance, garden and passage gates on the peninsula and in Mount Pleasant. True pre-1900 wrought iron is test first, and painted gates on pre-1978 homes need a negative lead test.',
              },
              {
                title: 'Iron Railings & Fences',
                desc: 'Stair, balcony and perimeter railings, quoted per linear foot. On homes built before 1978 the paint needs a negative lead test first.',
              },
              {
                title: 'Church & Institutional Ironwork',
                desc: 'Gates and railings at churches and institutions that are not individually listed landmarks. Painted metal at schools or child-care buildings needs a negative lead test.',
              },
              {
                title: 'Decorative Hardware',
                desc: 'Hinges, knockers, shutter dogs and other iron or steel hardware, best done off the building on the bench. Plated or brass-tone pieces are not a fit.',
              },
              {
                title: 'Garden Features',
                desc: 'Cast iron and steel benches, urns, planters and ornaments from Charleston courtyard gardens. Cast aluminum pieces we cannot promise yet.',
              },
              {
                title: 'Antique & Heirloom Pieces',
                desc: 'Antique furniture hardware, tools, frames, and family heirloom metalwork where preserving the original surface is the top priority.',
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

      {/* Why Not Sandblasting */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Historic Ironwork Requires a Different Approach
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                method: 'Sandblasting',
                problem: 'Removes metal along with rust. Erodes fine details, decorative elements, and surface patina that took centuries to develop. Irreversible damage.',
                safe: false,
              },
              {
                method: 'Chemical Stripping',
                problem: "Harsh acids damage original iron surface, create toxic runoff near Charleston's waterways and historic gardens, and can react unpredictably with antique alloys.",
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'Dialed in on a test spot to lift the coating and keep as much of the iron as possible. No chemical strippers, no abrasion. Brick, glass and sealant next to the iron are shielded, since the beam can mark them.',
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
                    {item.safe ? 'Recommended' : 'Risk to Historic Pieces'}
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
            Our Historic Ironwork Restoration Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'On-Site Assessment',
                desc: 'We look at the ironwork in person, check whether the property is individually listed and whether the paint predates 1978, and confirm laser cleaning fits the piece.',
              },
              {
                step: '02',
                title: 'Surface Preparation',
                desc: 'A controlled laser area goes up with eyewear, brick, stone and plantings get shielded, and a test spot is run for your sign-off.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes rust, oxidation, and old paint layer by layer. Parameters are adjusted based on the specific material and condition of each piece.',
              },
              {
                step: '04',
                title: 'Surface Inspection',
                desc: 'The cleaned surface is checked with you and photographed before and after.',
              },
              {
                step: '05',
                title: 'Same-Day Primer',
                desc: 'Bare iron flash-rusts overnight in Charleston humidity, so primer goes on the same day. Have your painter lined up, or ask for a referral to a local painter we work with.',
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

          {/* Lead paint. Stated in full here rather than linked across to the
              rust page. Painted pre-1978 ironwork is the likeliest place on
              this site for lead to actually come up, and making someone click
              away to find out where we stand on it reads as evasive.
              Sits at the end of the process, next to the painter referral
              step, because it is the same kind of commitment: what happens
              when the job needs a trade we are not the right party for. */}
          <div className="bg-[#0e273e] border border-[#397774]/20 border-l-[3px] border-l-[#397774] rounded-lg p-6 mt-10">
            <h3 className="text-white font-bold text-lg mb-3">
              Lead paint on older ironwork
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A lot of Charleston housing stock predates 1978, which means the coating on a gate, a railing, or a section of fence may contain lead. We do not laser paint on pre-1978 homes or child-occupied buildings unless a lead test on that paint comes back negative. If lead is present or suspected, the job goes to a firm certified under the EPA Renovation, Repair and Painting rule. That call happens before a quote, not after work starts.
            </p>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Service Area</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            We serve historic properties throughout Charleston and the Lowcountry. Most work happens on site, so gates and railings stay where they are. Small hardware is often better done on the bench.
          </p>
          <ServiceAreaChips
            areas={[
              'Downtown Charleston',
              'Harleston Village',
              'Ansonborough',
              'French Quarter',
              'Radcliffeborough',
              'Mount Pleasant',
              'Isle of Palms',
              "Sullivan's Island",
              'James Island',
              'West Ashley',
            ]}
          />
        </div>
      </section>

      <Faq
        path='/services/historic-ironwork-restoration-charleston'
        items={[
          {
            q: 'Is laser cleaning safe for historic wrought iron?',
            a:
              'It can be, with the right settings and a test spot first. True pre-1900 wrought iron has a fibrous grain and forge texture that responds differently from mild steel, and too much energy can mark it. We test a small area, show you, and only then quote.',
          },
          {
            q: 'Will it damage the patina on antique ironwork?',
            a:
              'The process is adjustable, so we set it to the outcome you want. Some owners want corrosion removed and the aged surface kept, others want bare metal before recoating. We agree on that before starting and test a small area first.',
          },
          {
            q: 'Do you work on properties under Board of Architectural Review oversight?',
            a:
              'Yes, for district properties that are not individually listed. Clear the work with the BAR or your preservation consultant first, and we can write up the method for that submission. Individually listed landmarks go to a conservator.',
          },
          {
            q: 'How does this compare to sandblasting historic iron?',
            a:
              'Sandblasting removes base metal along with rust, rounds off crisp forged edges, and drives media into joints and surrounding masonry. On irreplaceable ironwork that damage cannot be undone. Laser cleaning, at settings proven on a test spot, removes the surface layer and keeps the original profile.',
          },
          {
            q: 'Can you clean ironwork that is still mounted?',
            a:
              'Usually, yes. We clean gates, railings and fence panels in place, with the brick, glass and sealant around them shielded. Sealant beads are cut back by hand, and iron set in soft historic brick or lime mortar gets hand work at the joint.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Related Services"
        intro="Historic ironwork sits on the same continuum as smaller antique hardware and general rust removal. These pair naturally with it."
        items={[
          {
            title: 'Antique and Hardware Restoration',
            desc: 'Heirloom hardware and metalwork, with a test area first to decide how much patina stays.',
            href: '/services/antique-restoration-charleston',
          },
          {
            title: 'Rust and Paint Removal',
            desc: 'Corrosion and failed coatings lifted from iron and steel, test spot first.',
            href: '/services/rust-removal-charleston',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Restore your historic ironwork the right way
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates for all jobs. Send us a photo of the piece and we will assess it and follow up within one business day.
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