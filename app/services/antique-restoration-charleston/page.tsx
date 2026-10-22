import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';
import ServiceAreaChips from '@/app/components/ServiceAreaChips';

export const metadata = pageMetadata({
  title: 'Laser Antique & Hardware Restoration in Charleston, SC',
  description:
    'Laser cleaning for antique hardware, vintage tools, cast iron and classic car parts in Charleston, SC. Rust and old paint removed, with a test area first to set how much patina stays. Free estimates.',
  path: '/services/antique-restoration-charleston',
});

export default function AntiqueRestorationPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Antique Restoration', path: '/services/antique-restoration-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Antique and Hardware Restoration',
          description: 'Laser cleaning for antique hardware, vintage tools, cast iron and classic car parts in Charleston, SC. Rust and old paint removed, with a test area first to set how much patina stays. Free estimates.',
          path: '/services/antique-restoration-charleston',
          serviceType: 'Antique restoration',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Antique & Hardware Restoration
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Restoration for Antiques and Heirloom Metalwork
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            With antiques, the surface is the value. Aggressive cleaning that removes rust also removes the detail, the maker&apos;s marks, and the patina that make a piece worth keeping. Laser cleaning lifts rust and old paint while leaving more of the surface than a wire wheel or a dip, and a test area shows how a piece responds first.
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
            Detail Work on Small Metal Pieces
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Antique hardware, tools, and decorative metalwork carry their history on the surface. Casting marks, tooling, engraving, and the fine detail of period craftsmanship are the difference between a restored piece and a ruined one. Sandblasting, wire wheels, and chemical dips do not know the difference, and they take it all.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            A pulsed fiber laser removes rust and old coatings in thin passes, and the settings can be turned down for delicate work. Too much energy can darken brass or mark steel, so a test area comes first and sets how far to go.
          </p>
          <p className="text-gray-400 leading-relaxed">
            For a family heirloom or a vintage tool, that control is the point. For museum-grade conservation work, a trained conservator is the right call, and we will say so.
          </p>
        </div>
      </section>

      {/* What We Restore */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Pieces We Restore
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Antique Hardware',
                desc: 'Iron and solid brass hinges, knockers, locks and pulls. Brass gets a test first and hand finishing after; plated hardware is not a fit.',
              },
              {
                title: 'Vintage Tools',
                desc: 'Hand tools, cast iron, planes, and shop equipment cleaned of rust without erasing maker\'s marks or grinding away detail.',
              },
              {
                title: 'Decorative Metalwork',
                desc: 'Andirons, fireplace tools, iron frames and sconces. Solid brass pieces are test first with hand finishing; plated or brass-tone pieces are not a fit.',
              },
              {
                title: 'Light Fixtures & Lamps',
                desc: 'Solid brass lamp bases and iron or copper lanterns, test first. Lamp parts plated over steel or zinc are not a fit, and a magnet check comes first.',
              },
              {
                title: 'Cast Iron',
                desc: 'Garden urns, bench ends, finials and other cast iron, cleaned of rust and old paint. Cast iron cookware gets a test first.',
              },
              {
                title: 'Family Heirlooms',
                desc: 'One-of-a-kind pieces, handled with a test area and your approval before any full cleaning.',
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
            Laser vs. Abrasive vs. Chemical Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                method: 'Abrasive Methods',
                problem: 'Sandblasting and wire wheels erase maker\'s marks, tooling, and fine detail, and destroy the patina that gives an antique its value.',
                safe: false,
              },
              {
                method: 'Chemical Dips',
                problem: 'Harsh dips strip everything uniformly, discolor metal, seep into seams and joints, and leave residue that keeps reacting over time.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'Adjustable pass by pass. Removes rust and old paint, with a test area first to set how much patina stays. No abrasion, no chemical strippers.',
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
                    {item.safe ? 'Recommended' : 'Risk to the Piece'}
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
            Our Restoration Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Assessment & Goals',
                desc: 'We look at the piece with you and agree on the goal, whether that is removing all corrosion or preserving a specific patina and finish.',
              },
              {
                step: '02',
                title: 'Test Area',
                desc: 'A small, out-of-sight area gets cleaned first so you can see and approve the result.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes rust, tarnish and coatings at the settings the test area proved out.',
              },
              {
                step: '04',
                title: 'Inspection & Handoff',
                desc: 'We inspect the finished piece with you and confirm the result. Before and after photos are taken for your records.',
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
            We restore antiques and hardware for collectors, dealers, and homeowners throughout Charleston and the Lowcountry. Drop-off and pickup can be arranged for smaller pieces.
          </p>
          <ServiceAreaChips />
        </div>
      </section>

      <Faq
        path='/services/antique-restoration-charleston'
        items={[
          {
            q: 'Will laser cleaning devalue my antique?',
            a:
              "It can, if it goes too far, which is why we agree on how far to go and test a small area first. Rust removal usually helps a piece; stripping original finish or patina can hurt its value. If a piece should not be cleaned at all, we will say so.",
          },
          {
            q: 'Can you keep the patina and remove only the rust?',
            a:
              'Often yes. Active corrosion and stable patina respond differently, which makes it possible to lift the rust while leaving aged surface behind. It is decided piece by piece, and we test an inconspicuous area first.',
          },
          {
            q: 'What kinds of pieces do you work on?',
            a:
              'Iron and steel hardware, vintage tools, cast iron, classic car brackets and castings, and small solid brass pieces after a test. Not plated hardware, chrome or car body panels.',
          },
          {
            q: 'Do I need to bring the piece to you?',
            a:
              'For small items that is often easiest and we can arrange a handoff. For anything heavy, mounted, or fragile enough that transport is the real risk, we come to it.',
          },
          {
            q: 'How do you approach a piece you have not seen before?',
            a:
              'We start with an inconspicuous test area, show you the result, and adjust before going further. On anything irreplaceable, that step is not optional.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Related Services"
        intro="Pieces that hold their value through the surface often need more than one kind of care. These pair well with antique restoration."
        items={[
          {
            title: 'Rust and Paint Removal',
            desc: 'Corrosion and failed coatings lifted from iron and steel without sandblasting or chemical strippers.',
            href: '/services/rust-removal-charleston',
          },
          {
            title: 'Historic Ironwork Restoration',
            desc: 'Iron and steel gates and railings, set to keep forged detail and maker marks.',
            href: '/services/historic-ironwork-restoration-charleston',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Restore the piece, keep the history
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