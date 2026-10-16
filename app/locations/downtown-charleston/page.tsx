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
    'Mobile laser cleaning on the Charleston peninsula. Rust and failed paint removed from iron gates, railings and cast iron hardware with no chemicals or blast media, test spot first. Free estimates.',
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
          description: 'Mobile laser cleaning on the Charleston peninsula. Rust and failed paint removed from iron gates, railings and cast iron hardware with no chemicals or blast media, test spot first. Free estimates.',
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
            The peninsula&apos;s gates and railings run from pre-1900 wrought iron to mid-century mild steel, and harbor air rusts both fast. We take the rust off with a laser set to stop at the metal, after a test spot. Soft handmade brick, stucco and pre-1978 painted wood are not part of the work.
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
            Sandblasting erodes the fine detail of decorative iron. Chemical stripping produces runoff that goes straight into storm drains that empty into the harbor, and it can react badly with antique alloys. Pressure washing drives water into masonry joints, where it causes far more expensive problems a year later.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Laser cleaning helps with all three. It is a dry process with no chemicals, no sand and no water, so nothing runs into a neighbor&apos;s courtyard or a storm drain. Dust and fume are extracted and vacuumed up before we leave.
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
                title: 'Iron Gates & Railings',
                desc: 'Entrance gates, garden gates, piazza rails and window guards. Bare rust comes off with a test spot first. Painted iron on pre-1978 homes needs a negative lead test first.',
              },
              {
                title: 'Cast Iron Caps & Finials',
                desc: 'Fence caps, finials, urns and bench ends, often removed and cleaned on the bench, then primed the same day.',
              },
              {
                title: 'Graffiti on Hard Masonry',
                desc: 'Dark spray paint tags on hard, non-historic brick, block and stone. Every job starts with a test patch you see before we quote. Silver and metallic paint, and soft historic brick, are not taken.',
              },
              {
                title: 'Door & Shutter Hardware',
                desc: 'Iron hinges, shutter dogs, boot scrapers and solid brass knockers, best removed and cleaned on the bench. Brass is tested first, and plated pieces are not taken.',
              },
              {
                title: 'Storefronts & Commercial Metal',
                desc: 'King Street, Market Street and East Bay frontage. Railings, sign frames, security grates and entry hardware, done outside business hours inside a coned-off, controlled work zone.',
              },
              {
                title: 'Courtyard & Garden Ironwork',
                desc: 'Cast iron benches, steel arbors and plant stands, and iron garden ornaments. Small pieces go to the bench; fixed pieces are done in place.',
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
                desc: 'Send a few photos before we schedule anything. Many jobs can be scoped from photos, which saves you a site visit and tells us what we are dealing with in advance.',
              },
              {
                step: '02',
                title: 'Access & Staging',
                desc: 'Peninsula properties rarely have room for equipment. The laser is a backpack unit with a portable generator and air compressor, so we can work through a side gate, on a piazza or in a courtyard, with the area closed off while it fires.',
              },
              {
                step: '03',
                title: 'Test Patch',
                desc: 'On every job we run a small test patch in an inconspicuous spot, confirm the result with you on a signed authorization, then set the rest of the job.',
              },
              {
                step: '04',
                title: 'Contained Work Area',
                desc: 'No sand, no chemical runoff, no water. Removed coating becomes dust and fume, so an extractor runs on coated work, nearby surfaces are masked, and the area is HEPA-vacuumed after.',
              },
              {
                step: '05',
                title: 'Documentation',
                desc: 'Before and after photos for every job. If your property is under Board of Architectural Review oversight, we document the method for your files. Individually listed landmarks are not taken.',
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
              'The Battery',
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
            Services for Downtown Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Historic Ironwork Restoration',
                desc: 'Gates, railings, and decorative metalwork on properties where the original material cannot be replaced.',
                href: '/services/historic-ironwork-restoration-charleston',
              },
              {
                title: 'Rust & Paint Removal',
                desc: 'Rust and failed paint off steel and iron, test spot first, primed the same day.',
                href: '/services/rust-removal-charleston',
              },
              {
                title: 'Graffiti Removal',
                desc: 'Dark tag removal on hard, non-historic masonry, starting with a test patch you see before we quote.',
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
              'Yes, for homes and businesses that are not individually listed landmarks. We do not laser paint on pre-1978 homes or child-occupied buildings unless a lead test comes back negative; we refer it to an EPA RRP certified firm. If the BAR needs a written method, we provide one.',
          },
          {
            q: 'How do you handle access on narrow peninsula streets?',
            a:
              'The system is a backpack unit, a generator and a small compressor rather than a truck-mounted rig, so it can be carried through a gate, into a courtyard, or up onto a piazza. That matters south of Broad and in the French Quarter, where there is nowhere to put a trailer.',
          },
          {
            q: 'Is there any runoff into courtyards or storm drains?',
            a:
              'No liquid runoff. The process is dry. Removed coating becomes dust and fume, which is extracted and vacuumed up, not washed into a courtyard or drain.',
          },
          {
            q: 'What downtown surfaces does this work on?',
            a:
              'Iron gates and railings, cast iron caps and finials, door and shutter hardware, and storefront metal. Soft handmade brick, lime mortar and stucco are not offered.',
          },
          {
            q: 'How much does a job downtown cost?',
            a:
              'Every job starts with a free estimate and has a $400 minimum. Send photos of the gate or railing and we follow up with pricing, usually within one business day.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Other Service Areas"
        intro="We work across the Lowcountry, and the exposure changes with the neighborhood. See how the work reads for other parts of Charleston."
        items={[
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
            Serving downtown Charleston
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates on every job. Send a photo of the piece or surface and we will tell you what laser cleaning can do for it, usually within one business day.
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
