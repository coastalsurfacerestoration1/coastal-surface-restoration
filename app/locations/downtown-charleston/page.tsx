import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';

export const metadata = pageMetadata({
  title: 'Laser Cleaning in Downtown Charleston, SC',
  description:
    'Mobile laser cleaning on the Charleston peninsula. Rust, paint, graffiti, and grime removed from historic ironwork, brick, and stucco with no chemicals, no sand, and no water runoff. Free estimates.',
  path: '/locations/downtown-charleston',
});

export default function DowntownCharlestonPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/locations' },
          { name: 'Downtown Charleston', path: '/locations/downtown-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Cleaning in Downtown Charleston',
          description: 'Mobile laser cleaning on the Charleston peninsula. Rust, paint, graffiti, and grime removed from historic ironwork, brick, and stucco with no chemicals, no sand, and no water runoff. Free estimates.',
          path: '/locations/downtown-charleston',
          serviceType: 'Laser cleaning',
          areaServed: ['Charleston'],
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Cleaning in Downtown Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            The Charleston peninsula holds some of the oldest surviving building material in the country. Wrought iron that predates the Civil War, soft handmade brick, original stucco, heart pine shutters. None of it can be replaced, and most of it cannot survive the cleaning methods people reach for first. Laser cleaning removes rust, paint, and grime while leaving the material underneath completely untouched.
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
            Why Downtown Properties Need a Different Method
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Downtown Charleston presents three problems at once. The materials are historic and irreplaceable. The properties sit shoulder to shoulder, so anything that sprays, drifts, or runs off lands on a neighbor. And the whole peninsula sits at sea level surrounded by salt water, which means corrosion never really stops.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Sandblasting erodes the fired outer skin of historic brick and the fine detail of decorative iron. Chemical stripping produces runoff that goes straight into storm drains that empty into the harbor, and it can react badly with antique alloys and lime mortar. Pressure washing drives water into masonry joints and behind stucco, where it causes far more expensive problems a year later.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning solves all three. It is a dry process with no chemicals, no sand, and no water. There is nothing to run off into a neighbor&apos;s courtyard garden or a storm drain, nothing to clean up afterward, and no abrasive contact with the original surface.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Clean on the Peninsula
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Wrought Iron Gates & Railings',
                desc: 'Entrance gates, garden gates, piazza railings, balcony rails, and window guards. Charleston has the most significant collection of historic ironwork in the Southeast and it responds extremely well to laser cleaning.',
              },
              {
                title: 'Historic Brick & Stucco',
                desc: 'Efflorescence, atmospheric soiling, biological growth, and paint overspray on soft handmade brick and original stucco, without eroding the fired surface or opening mortar joints.',
              },
              {
                title: 'Graffiti on Historic Surfaces',
                desc: 'Tags on brick, stone, and painted walls where solvent removal leaves a permanent ghost outline. Laser lifts the paint without driving it deeper into porous masonry.',
              },
              {
                title: 'Shutters, Doors & Hardware',
                desc: 'Original hinges, shutter dogs, knockers, locks, boot scrapers, and mail slots. Small pieces where preserving the original finish and any maker marks matters more than making it look new.',
              },
              {
                title: 'Storefronts & Commercial Metal',
                desc: 'King Street, Market Street, and East Bay retail and restaurant frontage. Railings, signage frames, security grates, and entry hardware cleaned outside business hours.',
              },
              {
                title: 'Courtyard & Garden Ironwork',
                desc: 'Benches, arbors, trellises, planters, fountains, and garden ornaments in the private courtyard gardens the peninsula is known for. Work is done in place.',
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

      {/* Working Downtown */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            Working on a Downtown Property
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Photo Estimate First',
                desc: 'Send a few photos before we schedule anything. Most downtown jobs can be scoped accurately from images, which saves you a site visit and tells us what we are dealing with in advance.',
              },
              {
                step: '02',
                title: 'Access & Staging',
                desc: 'Peninsula properties rarely have room for equipment. Our system is a backpack unit and a portable generator, so we can work through a side gate, down an alley, on a piazza, or in a courtyard with no scaffolding and no truck-mounted rig.',
              },
              {
                step: '03',
                title: 'Test Patch',
                desc: 'On historic brick, stucco, and antique metal we run a small test patch in an inconspicuous area first, confirm the result with you, then dial in the settings for the rest of the job.',
              },
              {
                step: '04',
                title: 'Clean Work, No Cleanup',
                desc: 'No sand to sweep, no chemical runoff to contain, no water to manage. Removed material is captured at the surface. Neighbors, plantings, and adjacent buildings are unaffected.',
              },
              {
                step: '05',
                title: 'Documentation',
                desc: 'Before and after photos for every job. If your property is under Board of Architectural Review oversight or you work with a preservation organization, we document the method and provide that record for your files.',
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

      {/* Neighborhoods */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Downtown Neighborhoods We Serve</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            We work across the full peninsula, from the Battery to upper King and the medical district.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'South of Broad',
              'The Battery',
              'Rainbow Row',
              'French Quarter',
              'Ansonborough',
              'Harleston Village',
              'Radcliffeborough',
              'Cannonborough-Elliotborough',
              'Wraggborough',
              'Mazyck-Wraggborough',
              'King Street',
              'Market Street',
              'East Bay',
              'College of Charleston Area',
              'Hampton Park Terrace',
              'North Central',
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
            Services Most Requested Downtown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Historic Ironwork Restoration',
                desc: 'Gates, railings, and decorative metalwork on properties where the original material cannot be replaced.',
                href: '/services/historic-ironwork-restoration-charleston',
              },
              {
                title: 'Brick & Masonry Cleaning',
                desc: 'Efflorescence, staining, and soiling on soft historic brick and original stucco.',
                href: '/services/brick-cleaning-charleston',
              },
              {
                title: 'Graffiti Removal',
                desc: 'Tag removal on historic masonry without the ghosting that chemical methods leave behind.',
                href: '/services/graffiti-removal-charleston',
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
        path='/locations/downtown-charleston'
        items={[
          {
            q: 'Do you work in the Charleston historic district?',
            a:
              'Yes, the peninsula is a primary service area. Work on a designated property should be cleared with the Board of Architectural Review or your preservation consultant first, and we can provide a written description of the method for that submission.',
          },
          {
            q: 'How do you handle access on narrow peninsula streets?',
            a:
              'The system is a portable unit and a generator rather than a truck-mounted rig, so it can be carried through a gate, into a courtyard, or up onto a piazza. That matters south of Broad and in the French Quarter, where there is nowhere to put a trailer.',
          },
          {
            q: 'Is there any runoff into courtyards or storm drains?',
            a:
              'No. The process is dry. Nothing is discharged into courtyards, gardens, or the storm system, which is the usual objection to pressure washing and chemical stripping downtown.',
          },
          {
            q: 'What downtown surfaces does this work on?',
            a:
              'Wrought iron gates and railings, handmade brick and lime mortar, original stucco, shutters and door hardware, and storefront metal. These are the materials most at risk from pressure washing and abrasive blasting.',
          },
          {
            q: 'How much does a job downtown cost?',
            a:
              'Every job starts with a free estimate. Send photos of the gate, railing, or wall and we will follow up with pricing, usually within 24 hours.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Other Service Areas"
        intro="We work across the Lowcountry, and the exposure changes with the neighborhood. See how the work reads for other parts of Charleston."
        items={[
          {
            title: 'Mount Pleasant',
            desc: 'Salt-driven corrosion on Old Village hardware, Wando dock equipment, and Carolina Park exterior metal.',
            href: '/locations/mount-pleasant',
          },
          {
            title: "Isle of Palms & Sullivan's Island",
            desc: 'Barrier island properties where salt spray hits the hardest, cleaned on site with no runoff.',
            href: '/locations/isle-of-palms-sullivans-island',
          },
          {
            title: 'James Island & Folly Beach',
            desc: 'Marsh-front hardware, dock and boat lift metal, and rentals on the tidal creek side of Charleston.',
            href: '/locations/james-island-folly-beach',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Serving downtown Charleston
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates on every job. Send a photo of the piece or surface and we will tell you what laser cleaning can do for it, usually within 24 hours.
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
