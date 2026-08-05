import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';

export const metadata = pageMetadata({
  title: 'Laser Brick & Masonry Cleaning in Charleston, SC',
  description:
    'Laser brick and masonry cleaning in Charleston, SC. Remove efflorescence, grime, and staining from historic brick, stone, and stucco without pressure washing damage or chemicals. Free estimates.',
  path: '/services/brick-cleaning-charleston',
});

export default function BrickCleaningPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Brick & Masonry Cleaning', path: '/services/brick-cleaning-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Brick and Masonry Cleaning',
          description: 'Laser brick and masonry cleaning in Charleston, SC. Remove efflorescence, grime, and staining from historic brick, stone, and stucco without pressure washing damage or chemicals. Free estimates.',
          path: '/services/brick-cleaning-charleston',
          serviceType: 'Masonry cleaning',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Brick & Masonry Cleaning
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Brick and Masonry Cleaning in Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Charleston&apos;s historic brick is soft, hand-made, and easy to ruin. Pressure washing blasts away the fired surface and opens the brick to water damage. Laser cleaning lifts efflorescence, grime, and staining while leaving the original masonry and mortar completely intact.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#00d4d4] text-[#0a1628] px-8 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Context */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Historic Brick Needs a Gentler Method
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            The brick on Charleston&apos;s historic homes was fired in the 1700s and 1800s with a hard outer skin that protects the softer core. Once that skin is gone, the brick absorbs water, spalls, and deteriorates. High-pressure washing strips that skin in seconds, and it drives water and detergent deep into the wall and the lime mortar joints.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Efflorescence, the white crystalline haze that appears on brick and stucco, comes from salts migrating to the surface. Scrubbing it with acid can etch the masonry and leave a burn mark, and it often comes right back because the underlying moisture issue was never addressed.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning removes surface contamination without water, chemicals, or abrasion. The pulsed fiber laser targets the grime, efflorescence, or staining and stops at the masonry surface, so the original brick skin and mortar are preserved. It is a controlled, gentle process suited to exactly the kind of irreplaceable masonry Charleston is known for.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Masonry Surfaces We Clean
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Historic Brick Facades',
                desc: 'Hand-made and soft historic brick on homes and commercial buildings throughout the Charleston peninsula, cleaned without stripping the fired surface.',
              },
              {
                title: 'Efflorescence Removal',
                desc: 'The white crystalline haze on brick, block, and stucco removed at the surface without acid etching or burn marks.',
              },
              {
                title: 'Brick Stoops & Steps',
                desc: 'Entrance stoops, steps, and thresholds cleaned of grime, biological growth, and staining common in the humid Lowcountry.',
              },
              {
                title: 'Stone & Stucco',
                desc: 'Natural stone facades, stucco, and render cleaned of dirt, algae, and staining without damaging the finish.',
              },
              {
                title: 'Chimneys & Fireplaces',
                desc: 'Exterior chimneys and interior fireplace brick cleaned of soot, smoke staining, and grime.',
              },
              {
                title: 'Garden & Retaining Walls',
                desc: 'Brick and stone garden walls, retaining walls, and hardscape features cleaned of moss, mildew, and buildup.',
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

      {/* Comparison */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Laser vs. Pressure Washing vs. Acid Cleaning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                method: 'Pressure Washing',
                problem: 'Strips the hard fired skin off historic brick, erodes lime mortar joints, and drives water deep into the wall, leading to spalling and long-term damage.',
                safe: false,
              },
              {
                method: 'Acid Cleaning',
                problem: 'Etches and burns masonry, discolors brick, and often fails to stop efflorescence from returning. Creates hazardous runoff.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'Removes only the surface contamination and stops at the masonry. No water, no acid, no abrasion. The original brick skin and mortar are preserved.',
                safe: true,
              },
            ].map((item) => (
              <div
                key={item.method}
                className={`rounded-lg p-6 border ${
                  item.safe
                    ? 'bg-[#00d4d4]/5 border-[#00d4d4]/30'
                    : 'bg-[#0d1f3c] border-[#0e7c7b]/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-lg font-bold ${item.safe ? 'text-[#00d4d4]' : 'text-gray-300'}`}>
                    {item.method}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    item.safe ? 'bg-[#00d4d4]/20 text-[#00d4d4]' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {item.safe ? 'Recommended' : 'Risk to Historic Masonry'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Our Masonry Cleaning Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'On-Site Assessment',
                desc: 'We inspect the masonry in person, identify the type of brick or stone and the staining, and confirm laser cleaning is appropriate for the surface and its age.',
              },
              {
                step: '02',
                title: 'Test Patch',
                desc: 'On historic masonry we clean a small, discreet test area first so you can see the result and approve it before we proceed.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes grime, efflorescence, and staining layer by layer. Parameters are tuned to the specific masonry so the surface is preserved.',
              },
              {
                step: '04',
                title: 'Surface Inspection',
                desc: 'We inspect the cleaned surface and confirm the result before completing the job. Before and after photos are taken for your records.',
              },
              {
                step: '05',
                title: 'Moisture Guidance',
                desc: 'If recurring efflorescence points to a moisture issue, we will flag it so the underlying cause can be addressed and the problem does not simply return.',
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

      {/* Service Area */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Service Area</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            We clean brick and masonry for historic homes, commercial buildings, and residential properties throughout Charleston and the Lowcountry.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'South of Broad',
              'Historic District',
              'Downtown Charleston',
              'Harleston Village',
              'Ansonborough',
              'Radcliffeborough',
              'Mount Pleasant',
              'West Ashley',
              'James Island',
              'North Charleston',
              'Daniel Island',
              'Summerville',
            ].map((area) => (
              <span key={area} className="bg-[#0d1f3c] border border-[#0e7c7b]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Faq
        path='/services/brick-cleaning-charleston'
        items={[
          {
            q: "Is laser cleaning safe for Charleston's historic brick?",
            a:
              'Yes, and it addresses the specific risk with soft handmade brick. The fired outer skin protects the softer core, and pressure washing strips that skin away. Laser cleaning lifts surface soiling without removing the skin and without forcing water into the wall or the mortar joints.',
          },
          {
            q: 'Can you remove efflorescence?',
            a:
              'Yes. Efflorescence is salt deposit carried to the surface by moisture moving through the masonry, and the laser removes the deposit itself. If the underlying moisture path is not addressed the salts will return, so we will tell you when what you actually have is a water problem.',
          },
          {
            q: 'Will it damage lime mortar joints?',
            a:
              'Lime mortar is softer than the brick around it and is the first thing to fail under pressure washing. Because the process is dry and non-contact, the joints are not eroded and no water is driven into them.',
          },
          {
            q: 'Can you clean painted brick?',
            a:
              'Often yes. Removing paint from masonry is slower than removing it from metal, and the result depends on the paint type and how deeply it soaked in. We test a patch first so you can see the realistic outcome before committing to a full elevation.',
          },
          {
            q: 'Do you clean stucco and stone as well?',
            a:
              'Yes. Stucco, cast stone, and concrete all respond, with settings adjusted per material. Stucco in particular benefits from a dry method, since pressure washing drives water in behind the render.',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Clean your brick without damaging it
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates for all jobs. Send us a photo of the masonry and we will assess it and follow up within 24 hours. Minimum job size $400.
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