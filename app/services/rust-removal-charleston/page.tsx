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
    'Laser rust and paint removal in Charleston, SC. Chemical-free laser cleaning for iron and steel railings, gates and parts, plus stainless and bronze boat hardware. No blast media, test spot first. Free estimates.',
  path: '/services/rust-removal-charleston',
});

export default function RustRemovalPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
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
          description: 'Laser rust and paint removal in Charleston, SC. Chemical-free laser cleaning for iron and steel railings, gates and parts, plus stainless and bronze boat hardware. No blast media, test spot first. Free estimates.',
          path: '/services/rust-removal-charleston',
          serviceType: 'Rust removal',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Rust & Paint Removal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Laser Rust and Paint Removal in Charleston
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Charleston&apos;s salt air and humidity are hard on metal. Rust, flaking paint, and oxidation show up fast on iron, steel, and marine hardware. Laser cleaning lifts it without abrasives or chemicals, set to stop at the metal, and leaves a clean surface that needs primer the same day.
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
            Rust Removal Without Blast Media or Chemicals
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Traditional rust removal forces a tradeoff. Sandblasting cuts into the metal and warps thin material. Chemical strippers create hazardous runoff and can pit the surface. Wire wheels and grinders leave gouges and struggle in tight detail. For anything detailed, thin, or valuable, those methods do as much harm as good.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            The laser is set to vaporize the contaminant and stop at the metal, and a test spot confirms the setting first. There is no grit, no chemical bath and no water. The removed coating turns to dust and fume, which we capture with extraction and clean up with a HEPA vacuum.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The result is clean metal with its original profile. On bare steel and iron that surface is ready for primer, and it needs it the same day, because bare steel flash-rusts overnight in Charleston humidity. Laser prep is the step before the coating.
          </p>
        </div>
      </section>

      {/* What We Clean */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Remove Rust and Paint From
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Steel & Iron Gates, Railings & Fencing',
                desc: 'Steel and iron gates, stair and balcony railings and fencing from West Ashley to Daniel Island, quoted per linear foot. Pre-1978 paint needs a negative lead test.',
              },
              {
                title: 'Steel & Fabricated Metal',
                desc: 'Brackets, fabricated parts and welded assemblies before coating, plus weld heat tint on stainless. Tight mill scale gets a test spot first.',
              },
              {
                title: 'Marine & Trailer Hardware',
                desc: 'Stainless and bronze cleats, rails and fittings off the boat or on the hard, plus steel trailer parts. No work on docks or over water.',
              },
              {
                title: 'Machinery & Equipment',
                desc: 'Vintage tools, cast and forged classic car parts, brackets and machine parts. Not body panels, chrome or thin stamped sheet metal.',
              },
              {
                title: 'Painted & Coated Surfaces',
                desc: 'Old paint and failing coatings come off steel and iron after a test spot. Powder coat is test first. Stripping galvanized steel takes zinc with it, so plan on a zinc-rich primer; if the galvanizing must stay intact, laser is the wrong tool.',
              },
              {
                title: 'Antique Metal & Tools',
                desc: 'Antique hardware, cast iron, frames, and heirloom tools where preserving the original surface is the priority.',
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

      {/* Paint Removal.
          Deep link target for the /paint short path, which is printed on
          material that is specifically about paint. Someone arriving from one
          of those lands here rather than at the top of the page, so this
          section has to stand on its own and read as being about paint from
          the first line.
          scroll-mt clears the sticky header, which would otherwise sit on top
          of the heading the anchor just scrolled to.
          The gradient bridges the solid section above into the solid section
          below, so inserting a band here does not break the page's alternating
          backgrounds. */}
      <section
        id="paint-removal"
        className="scroll-mt-24 py-8 lg:py-12 bg-gradient-to-b from-[#1a3958] to-[#0e273e]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Paint Removal
          </p>
          <h2 className="text-3xl font-bold text-white mb-6">
            Laser Paint Removal in Charleston
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Stripping paint usually means choosing which kind of damage you are willing to accept. Chemical strippers soften everything they touch, run into seams and joints, and leave residue that the next coat has to bond through. Media blasting drives grit into the surface and rounds off the detail it passes over. Both are all or nothing: they take the entire coating system down to bare substrate whether that is what the piece needed or not.
          </p>
          <p className="text-gray-400 leading-relaxed mb-10">
            A pulsed fiber laser removes coating by absorption rather than by force, which makes the depth controllable. Each pass can be set lighter or heavier. Whether the beam can stop cleanly at a sound primer depends on the paint system, and a test spot tells us before we quote. When it works, you recoat instead of rebuilding the whole finish.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                title: 'Topcoat Only',
                desc: 'Where a test spot shows the topcoat lifts and the primer holds, we stop at the primer. If the layers will not separate cleanly, you hear that before the quote.',
              },
              {
                title: 'Down to Primer',
                desc: 'Take the finish back to a sound layer on a test spot first, so you can see what is underneath before deciding how far to go.',
              },
              {
                title: 'Back to Bare Metal',
                desc: 'A full strip where the whole coating has failed, leaving clean metal with no grit or chemical residue. Bare steel needs primer the same day.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#0e273e] border border-[#397774]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-400 leading-relaxed mb-6">
            The same control is what makes the process suited to detailed work. Paint sitting in the crevices of a forged railing, in threads, or in the recesses of a casting is exactly where blasting either fails to reach or erodes the detail trying. Laser cleaning follows the shape of the piece, so ornamental ironwork, hardware, and fabricated assemblies come out with their profile intact.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Galvanized steel needs one more step. Stripping paint from a galvanized railing or gate takes zinc with it, so a zinc-rich primer goes on before paint. If you need the galvanizing kept intact, laser stripping is not the right method. That applies to the galvanized railings common on Daniel Island and in newer Mount Pleasant construction.
          </p>
          <p className="text-gray-400 leading-relaxed mb-8">
            There is no solvent runoff, which matters on any property near Charleston&apos;s tidal creeks, and no spent abrasive to haul away. The paint comes off as dust and fume, so we run extraction and HEPA-vacuum the area before leaving. Bare steel flash-rusts overnight in this humidity, so primer goes on the same day the metal is cleaned.
          </p>

          {/* Lead paint. Stated plainly rather than left out, because a
              visitor with a pre-1978 property is likely to be wondering about
              it, and silence on the point reads worse than the limitation
              does. We hold no EPA RRP certification, so this claims no
              capability and commits to assessing first and handing off where
              lead is involved.
              Neutral styling on purpose. Amber is the form's warning colour
              and would frame a statement of practice as an alarm. */}
          <div className="bg-[#0e273e] border border-[#397774]/20 border-l-[3px] border-l-[#397774] rounded-lg p-6 mb-10">
            <h3 className="text-white font-bold text-lg mb-3">
              Lead paint on older surfaces
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A lot of Charleston housing stock predates 1978, which means the coating on a shutter, a railing, or a door may contain lead. We do not laser paint on pre-1978 homes or child-occupied buildings unless a lead test on that paint comes back negative. If lead is present or suspected, the job goes to a firm certified under the EPA Renovation, Repair and Painting rule. That call happens before a quote, not after work starts.
            </p>
          </div>

          <Link
            href="/quote"
            className="inline-block bg-[#397774] text-white px-8 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Get a Free Paint Removal Estimate
          </Link>
        </div>
      </section>

      {/* Why Not Sandblasting / Chemical */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
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
                problem: 'Set to lift the rust, paint or oxidation and stop at the metal, with a test spot first. No grit, no chemicals, no water. Dust and fume are captured and HEPA-cleaned.',
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
      <section className="py-8 lg:py-12 bg-[#1a3958]">
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
                desc: 'A controlled laser area goes up with signage and eyewear, glass, sealant and plantings get covered, and a test spot is run for your sign-off.',
              },
              {
                step: '03',
                title: 'Laser Cleaning',
                desc: 'Our 300W JPT MOPA pulsed fiber laser removes rust, oxidation, and old paint layer by layer. Parameters are tuned to the specific metal and condition of each piece.',
              },
              {
                step: '04',
                title: 'Surface Inspection',
                desc: 'The cleaned surface is checked with you and photographed before and after.',
              },
              {
                step: '05',
                title: 'Same-Day Primer',
                desc: 'Bare steel and iron flash-rust overnight in Charleston humidity, so primer goes on the same day. Have your painter lined up, or ask for a referral to a local painter we work with.',
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
            We serve residential, commercial, and marine clients throughout Charleston and the Lowcountry. All work is performed on-site wherever possible, so there is no need to transport gates, railings, or equipment.
          </p>
          <ServiceAreaChips
            areas={[
              'Downtown Charleston',
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
              'Jobs are quoted per piece, per job, or per linear foot for railings, with a $400 minimum. Price depends on the coating, how heavy the rust is and access. Send photos for a free estimate, usually within one business day.',
          },
          {
            q: 'Does laser cleaning remove the metal underneath the rust?',
            a:
              'Not when the settings are right. The pulse is set to lift the oxide and stop at the metal, and too much energy can melt or mark steel, which is why every job starts with a test spot. Cleaned metal has a matte texture. Sandblasting cuts into sound metal along with the rust.',
          },
          {
            q: 'Will the rust come back after cleaning?',
            a:
              'Yes, if bare steel is left uncoated. In Charleston humidity it flash-rusts overnight, so primer has to go on the same day. We schedule the work around that and can refer you to a local painter.',
          },
          {
            q: 'Can you remove paint as well as rust?',
            a:
              'Yes, on steel and iron after a test spot. Sometimes a failed topcoat lifts and leaves sound primer, but that depends on the paint system, and the test spot shows it before we quote. On galvanized steel, stripping takes some of the zinc layer too, so we recommend a zinc-rich primer before repainting.',
          },
          {
            q: 'Can you remove lead paint?',
            a:
              'No. CSR is not RRP certified and does not laser paint on pre-1978 homes or child-occupied buildings unless a lead test comes back negative. A lot of Charleston housing predates 1978, so we ask about the build year first. If lead is present or suspected, we refer the job to an EPA RRP certified firm before any quote.',
          },
          {
            q: 'Do you have to take the piece to a shop?',
            a:
              'No. The system is portable, so we clean gates, railings, trailers and hardware where they sit. That matters most for anything mounted, structural, or too heavy to move without a crew.',
          },
        ]}
      />

      <RelatedItemsSection
        heading="Related Services"
        intro="Rust removal is often the broader category that specific work falls under. These are the specialties within it."
        items={[
          {
            title: 'Historic Ironwork Restoration',
            desc: "Gates and railings in Charleston's historic neighborhoods, set to lift rust and paint and keep the forged detail.",
            href: '/services/historic-ironwork-restoration-charleston',
          },
          {
            title: 'Marine Cleaning',
            desc: 'Stainless and bronze boat hardware and steel trailer parts, cleaned on land or on the hard.',
            href: '/services/marine-cleaning-charleston',
          },
          {
            title: 'Antique and Hardware Restoration',
            desc: 'Heirloom hardware and tools, with a test area first to decide how much patina stays.',
            href: '/services/antique-restoration-charleston',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get the rust off, test spot first
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free estimates for all jobs. Send us a photo and we will assess it and follow up within one business day.
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