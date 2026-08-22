import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';
import RelatedItemsSection from '@/app/components/RelatedItemsSection';
import ServiceAreaChips from '@/app/components/ServiceAreaChips';

export const metadata = pageMetadata({
  title: 'Laser Rust & Paint Removal in Charleston, SC',
  description:
    'Laser rust and paint removal in Charleston, SC. Chemical-free, non-abrasive cleaning for iron, steel, marine hardware, and metal surfaces. No sandblasting, no chemicals, no substrate damage. Free estimates.',
  path: '/services/rust-removal-charleston',
});

export default function RustRemovalPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Rust & Paint Removal', path: '/services/rust-removal-charleston' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Rust and Paint Removal',
          description: 'Laser rust and paint removal in Charleston, SC. Chemical-free, non-abrasive cleaning for iron, steel, marine hardware, and metal surfaces. No sandblasting, no chemicals, no substrate damage. Free estimates.',
          path: '/services/rust-removal-charleston',
          serviceType: 'Rust removal',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Rust & Paint Removal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Rust and Paint Removal in Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Charleston&apos;s salt air and humidity are hard on metal. Rust, flaking paint, and oxidation show up fast on iron, steel, and marine hardware. Laser cleaning strips it all away without abrasives, chemicals, or damage to the metal underneath, leaving a clean surface ready for coating or reuse.
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
            Rust Removal Without the Collateral Damage
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Traditional rust removal forces a tradeoff. Sandblasting cuts into the metal and warps thin material. Chemical strippers create hazardous runoff and can pit the surface. Wire wheels and grinders leave gouges and only reach flat areas. For anything detailed, thin, or valuable, those methods do as much harm as good.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Laser cleaning removes only the rust, paint, or oxidation layer. Our pulsed fiber laser vaporizes the contaminant and stops at the clean metal beneath it, so the base material is left intact. There is no grit, no chemical bath, and no water, which means no mess to contain and no waste to dispose of on your property.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The result is a uniformly clean surface with the original profile preserved. For bare steel and iron, that clean surface is also the ideal foundation for primer and paint, which is why laser prep produces longer-lasting coatings than blasted or hand-cleaned metal.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Remove Rust and Paint From
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Iron Gates, Railings & Fencing',
                desc: 'Wrought iron gates, stair and balcony railings, and perimeter fencing on homes and commercial properties across the Charleston area.',
              },
              {
                title: 'Steel & Fabricated Metal',
                desc: 'Structural steel, brackets, beams, fabricated parts, and welded assemblies that need rust and mill scale removed before coating or repair.',
              },
              {
                title: 'Marine & Trailer Hardware',
                desc: 'Boat trailers, fittings, cleats, brackets, and dock hardware corroded by salt water and Lowcountry humidity.',
              },
              {
                title: 'Machinery & Equipment',
                desc: 'Rusted tools, machine frames, automotive and equipment parts where a clean surface is needed without warping thin metal.',
              },
              {
                title: 'Painted & Coated Surfaces',
                desc: 'Old paint, powder coat, and failing coatings stripped back to bare metal without gouging or chemical residue.',
              },
              {
                title: 'Antique Metal & Tools',
                desc: 'Antique hardware, cast iron, frames, and heirloom tools where preserving the original surface is the priority.',
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

      {/* Why Not Sandblasting / Chemical */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Laser vs. Sandblasting vs. Chemical Stripping
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                method: 'Sandblasting',
                problem: 'Removes base metal along with rust. Warps thin material, erodes detail, and leaves grit and dust that must be contained and cleaned up.',
                safe: false,
              },
              {
                method: 'Chemical Stripping',
                problem: "Harsh acids and solvents create hazardous runoff near Charleston's waterways, can pit the surface, and leave residue that interferes with new coatings.",
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'Targets only the rust, paint, or oxidation layer. Base metal is untouched. No grit, no chemicals, no water, and no waste left on site.',
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
                    {item.safe ? 'Recommended' : 'Risk to the Metal'}
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
            Our Rust Removal Process
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'On-Site Assessment',
                desc: 'We inspect the piece in person, assess the type and extent of rust or coating, and confirm laser cleaning is the right approach for the material and its condition.',
              },
              {
                step: '02',
                title: 'Surface Preparation',
                desc: 'We set up safety perimeters and protect surrounding surfaces and plantings before beginning work.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes rust, oxidation, and old paint layer by layer. Parameters are tuned to the specific metal and condition of each piece.',
              },
              {
                step: '04',
                title: 'Surface Inspection',
                desc: 'We inspect the cleaned surface and confirm the result before completing the job. Before and after photos are taken for your records.',
              },
              {
                step: '05',
                title: 'Coating Referral (if needed)',
                desc: "Bare steel and iron will flash rust in Charleston's salt air without a protective coating. We work with local painting contractors and can refer you to a trusted partner for same-day primer application.",
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
            We serve residential, commercial, and marine clients throughout Charleston and the Lowcountry. All work is performed on-site wherever possible, so there is no need to transport gates, railings, or equipment.
          </p>
          <ServiceAreaChips
            areas={[
              'Downtown Charleston',
              'Historic District',
              'South of Broad',
              'Mount Pleasant',
              'Isle of Palms',
              "Sullivan's Island",
              'James Island',
              'Folly Beach',
              'West Ashley',
              'Daniel Island',
              'North Charleston',
              'Summerville',
            ]}
          />
        </div>
      </section>

      <Faq
        path='/services/rust-removal-charleston'
        items={[
          {
            q: 'How much does laser rust removal cost in Charleston?',
            a:
              'Pricing depends on the surface area, how heavy the corrosion is, and how accessible the piece is. Every job starts with a free estimate. Send photos of the piece and we will follow up with pricing, usually within 24 hours.',
          },
          {
            q: 'Does laser cleaning remove the metal underneath the rust?',
            a:
              'No. The pulse is tuned so it lifts the oxide layer and leaves the base metal behind. That is the main difference from sandblasting, which cuts into sound metal along with the rust and thins the piece slightly every time it is done.',
          },
          {
            q: 'Will the rust come back after cleaning?',
            a:
              'Bare steel in Charleston salt air will begin to flash rust if it is left uncoated, sometimes within days. For exterior and structural pieces we time the work so a protective coating can go on promptly, and we can refer you to a local painting contractor to handle it.',
          },
          {
            q: 'Can you remove paint as well as rust?',
            a:
              'Yes. The same process lifts old coatings, and it can often be dialed in to take one layer at a time. That is useful when you want to remove a failed topcoat without stripping sound primer, or when you need to see what is under old paint before deciding how to proceed.',
          },
          {
            q: 'Do you have to take the piece to a shop?',
            a:
              'No. The system is portable, so gates, railings, trailers, and hardware are cleaned where they sit. That matters most for anything mounted, structural, or too heavy to move without a crew.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Related Services"
        intro="Rust removal is often the broader category that specific work falls under. These are the specialties within it."
        items={[
          {
            title: 'Historic Ironwork Restoration',
            desc: 'Wrought iron gates and railings on Charleston historic properties, cleaned without erasing forged detail.',
            href: '/services/historic-ironwork-restoration-charleston',
          },
          {
            title: 'Marine Cleaning',
            desc: 'Boat trailers, dock hardware, and marine fittings cleaned dockside with no runoff.',
            href: '/services/marine-cleaning-charleston',
          },
          {
            title: 'Antique and Hardware Restoration',
            desc: 'Heirloom pieces cleaned with a controlled hand that preserves patina.',
            href: '/services/antique-restoration-charleston',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get the rust gone without the damage
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates for all jobs. Send us a photo and we will assess it and follow up within 24 hours.
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