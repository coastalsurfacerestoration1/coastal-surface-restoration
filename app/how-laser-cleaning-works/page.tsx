import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';

export const metadata = pageMetadata({
  title: 'How Laser Cleaning Works',
  description:
    'A plain-language guide to laser cleaning. How the pulsed fiber laser removes rust, paint, and coatings without chemicals, abrasives, or damage to the underlying surface. Diagrams, video, and comparisons.',
  path: '/how-laser-cleaning-works',
});

// Stand-in videos from third parties, used until Coastal Surface Restoration
// has its own footage (targeted Oct 2026, when first jobs start). Any video
// here needs the third-party disclaimer rendered near it, see VideoSlot below.
const VIDEO_IDS: { id: string; caption: string; credit: string }[] = [
  {
    id: '078v2jLQTt0',
    caption: 'How laser cleaning works',
    credit: 'P-Laser',
  },
  {
    id: 'JRzg3i7o-IA',
    caption: 'Removing decades of rust from a car body',
    credit: 'Insider Cars',
  },
];

const VIDEO_DISCLAIMER =
  'Example footage from other laser cleaning equipment, not our machine. Our own before-and-after videos from Charleston jobs will replace these starting October 2026.';

function VideoSlot({ id, caption, credit }: { id: string; caption: string; credit: string }) {
  return (
    <figure>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#0e273e] border border-[#397774]/20">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={caption}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <figcaption className="mt-3 text-center text-sm text-gray-500">
        {caption}. Video credit: {credit}.
      </figcaption>
      <p className="mt-2 text-center text-xs italic text-gray-600 max-w-xl mx-auto">
        {VIDEO_DISCLAIMER}
      </p>
    </figure>
  );
}

/**
 * Three-panel cross-section of a laser cleaning pass: contaminated surface,
 * mid-ablation, clean substrate. Built from positioned HTML rather than an SVG
 * for the same reason as SurfaceCrossSection: keeping the labels as real text
 * lets them render at a legible size on small screens.
 *
 * Colors match SurfaceCrossSection so both diagrams on the site read as parts
 * of the same visual vocabulary.
 */
function ProcessStep({
  step,
  title,
  caption,
  ariaLabel,
  children,
}: {
  step: string;
  title: string;
  caption: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="relative h-[180px] w-full overflow-hidden rounded-lg border border-[#397774]/20 bg-[#0e273e]"
        role="img"
        aria-label={ariaLabel}
      >
        {children}
        <div className="absolute left-3 top-3 rounded bg-[#397774] px-2 py-0.5 text-xs font-bold text-white">
          {step}
        </div>
      </div>
      <h3 className="mt-4 text-white font-bold text-base">{title}</h3>
      <p className="mt-1 text-gray-400 text-sm leading-relaxed">{caption}</p>
    </div>
  );
}

function LaserProcessDiagram() {
  // Shared layer geometry: contamination sits on top of the base metal.
  const layers = (opts: { gap?: boolean }) => (
    <>
      {/* Base metal */}
      <div className="absolute inset-x-0 bottom-0 h-[70px] bg-gradient-to-b from-[#b6c6d6] to-[#7f94aa]" />
      {/* Contamination band, rust and paint colors matched to SurfaceCrossSection */}
      {!opts.gap ? (
        <div className="absolute inset-x-0 bottom-[70px] h-[36px] bg-gradient-to-b from-[#a85c25] to-[#7c4a2a]" />
      ) : (
        <>
          <div className="absolute left-0 bottom-[70px] h-[36px] w-[35%] bg-gradient-to-b from-[#a85c25] to-[#7c4a2a]" />
          <div className="absolute right-0 bottom-[70px] h-[36px] w-[35%] bg-gradient-to-b from-[#a85c25] to-[#7c4a2a]" />
        </>
      )}
    </>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProcessStep
        step="01"
        title="Contact"
        caption="A short pulse of laser light meets the contaminated surface. Rust and paint absorb energy at this wavelength strongly."
        ariaLabel="Diagram: a laser beam angling down onto a rust layer sitting on top of clean base metal."
      >
        {layers({ gap: false })}
        {/* Laser beam angling down onto the surface */}
        <div
          className="absolute"
          style={{
            top: '10px',
            right: '38%',
            width: '3px',
            height: '96px',
            background: 'linear-gradient(to bottom, rgba(0,212,212,0), #397774)',
            transform: 'rotate(12deg)',
            transformOrigin: 'top center',
            boxShadow: '0 0 8px #397774',
          }}
        />
        {/* Contact glow */}
        <div
          className="absolute"
          style={{
            bottom: '96px',
            left: '48%',
            width: '18px',
            height: '18px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(0,212,212,0.75) 0%, rgba(0,212,212,0) 70%)',
          }}
        />
      </ProcessStep>

      <ProcessStep
        step="02"
        title="Ablation"
        caption="The contaminant absorbs the energy and vaporizes off as fine dust. The base metal reflects most of the light and stays put."
        ariaLabel="Diagram: the laser has removed a section of the rust layer in the middle, and fine particles rise from the cleaned area. The base metal beneath is exposed and undamaged."
      >
        {layers({ gap: true })}
        {/* Laser beam entering the gap */}
        <div
          className="absolute"
          style={{
            top: '10px',
            left: '50%',
            width: '3px',
            height: '96px',
            background: 'linear-gradient(to bottom, rgba(0,212,212,0), #397774)',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 8px #397774',
          }}
        />
        {/* Vapor particles above the ablation zone */}
        {[
          { l: '38%', b: 115, s: 4 },
          { l: '44%', b: 128, s: 3 },
          { l: '52%', b: 132, s: 5 },
          { l: '58%', b: 120, s: 3 },
          { l: '48%', b: 145, s: 3 },
          { l: '55%', b: 152, s: 2 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#c99672]/80"
            style={{ left: p.l, bottom: p.b, width: p.s, height: p.s }}
          />
        ))}
      </ProcessStep>

      <ProcessStep
        step="03"
        title="Clean substrate"
        caption="The contamination is gone, the surface underneath is intact. No sand to clean up, no chemical residue, no water to soak in."
        ariaLabel="Diagram: only clean base metal remains, with no contamination on top and no laser beam active."
      >
        {/* Base metal only */}
        <div className="absolute inset-x-0 bottom-0 h-[106px] bg-gradient-to-b from-[#b6c6d6] to-[#7f94aa]" />
        {/* Subtle teal check to signal complete */}
        <svg
          className="absolute right-4 bottom-4 h-7 w-7 text-[#397774]"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 12.5l3.2 3.2L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ProcessStep>
    </div>
  );
}

export default function HowLaserCleaningWorksPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'How Laser Cleaning Works', path: '/how-laser-cleaning-works' },
        ]}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Laser Cleaning',
          description:
            'Mobile laser cleaning services in Charleston, SC. A pulsed fiber laser lifts rust, paint, and coatings without chemicals, abrasives, or water runoff.',
          path: '/how-laser-cleaning-works',
          serviceType: 'Laser cleaning',
        })}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            The Technology
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            How Laser Cleaning Works
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            A short, plain-language explanation of what laser cleaning is, what it removes, and why it does not damage the surface underneath. If you have never seen it before, this is the page to read first.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#397774] text-white px-8 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* 30-second version */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">The 30 Second Version</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            A laser cleaner fires very short pulses of light at a specific frequency. Rust, paint, and other contaminants absorb that light and vaporize off as fine dust. The material underneath, whether it is metal, brick, stone, or wood, absorbs much less of it and is left intact.
          </p>
          <p className="text-gray-400 leading-relaxed">
            No sand, no chemicals, no water, no abrasion. It is the same technology used in aerospace, museum conservation, and nuclear decommissioning, packaged into a portable unit we bring to your property.
          </p>
        </div>
      </section>

      {/* Featured video */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">See It In Action</h2>
          <p className="text-gray-400 text-center mb-8">
            The first ten seconds of the video explains it better than any paragraph can.
          </p>
          <VideoSlot {...VIDEO_IDS[0]} />
        </div>
      </section>

      {/* How it actually works */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">What Is Happening at the Surface</h2>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Pulsed Light, Not a Steady Beam',
                desc: 'The laser fires nanosecond pulses, not a continuous beam. Each pulse is very short and very intense, which lets it do the work in a fraction of a second and move on before the surface underneath heats up.',
              },
              {
                step: '02',
                title: 'The Contaminant Absorbs the Energy',
                desc: 'Rust, paint, and dirt readily absorb near-infrared laser light. When a pulse hits, the contaminant absorbs the energy and lifts off as a fine dust, part vaporized and part shed as small particles from the sudden thermal shock. The whole family of removal effects is called laser ablation.',
              },
              {
                step: '03',
                title: 'The Substrate Is Left Intact',
                desc: 'Clean metal, brick, stone, and wood absorb far less of that specific wavelength than the contamination does, so the pulses have little effect on them. As a second margin of safety, the total energy per pulse is set below the level that would start removing the substrate itself. That is why the rust comes off and the surface underneath does not.',
              },
              {
                step: '04',
                title: 'Fume Extraction Handles the Rest',
                desc: 'The removed material is captured by a HEPA-filtered extractor at the cleaning head, so nothing settles on surrounding surfaces and there is no cleanup afterward. On old paint or coatings that may contain lead or other hazardous binders, that source capture is a safety requirement, not a convenience.',
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

      {/* Process diagram */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">The Process in Three Steps</h2>
          <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            A cross-section through the surface as the laser passes over it. Contamination on top, base material underneath.
          </p>
          <LaserProcessDiagram />
          <p className="mt-10 text-center text-sm italic text-gray-500 max-w-xl mx-auto">
            Real before-and-after photos from our Charleston jobs coming October 2026.
          </p>
        </div>
      </section>

      {/* What it removes */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">What Laser Cleaning Removes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'Rust and Corrosion', desc: 'Surface rust, scale, oxidation, and flash rust from iron, steel, and aluminum. Deep pitting is a separate issue and cannot be reversed by any cleaning method.' },
              { title: 'Paint and Coatings', desc: 'Old paint, primer, powder coating, varnish, and clear coats. The laser lifts the coating cleanly so a fresh finish has bare, ready-to-coat metal underneath.' },
              { title: 'Grease, Oil, and Tar', desc: 'Baked-on grease, cutting fluid, road tar, and industrial residue. Common on tools, trailers, and shop equipment.' },
              { title: 'Graffiti', desc: 'Spray paint and marker on brick, stone, and metal. Removed without the ghost outline that solvents leave behind on porous surfaces.' },
              { title: 'Marine Growth', desc: 'Salt buildup, calcium deposits, biological staining, and light oxidation on marine hardware, trailers, and dock fittings.' },
              { title: 'Efflorescence and Soiling', desc: 'Mineral deposits, atmospheric soiling, and biological staining on historic brick, stucco, and stone without opening mortar joints. Heavy or recurring efflorescence often points to a moisture problem in the wall itself, and that has to be addressed separately.' },
            ].map((item) => (
              <div key={item.title} className="bg-[#1a3958] border border-[#397774]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safe surfaces */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Surfaces It Is Safe On</h2>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-2xl">
            Because the laser targets the contaminant rather than grinding across the surface, it works on materials that other methods have to avoid.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Iron',
              'Steel',
              'Aluminum',
              'Brass and bronze',
              'Cast iron',
              'Brick',
              'Stone',
              'Stucco',
              'Concrete',
              'Wood',
              'Marine hardware',
              'Antique and heirloom metal',
            ].map((surface) => (
              <span key={surface} className="bg-[#0e273e] border border-[#397774]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {surface}
              </span>
            ))}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mt-6 max-w-2xl">
            On anything historic or irreplaceable we still run a small test area first before working the full piece, and dial in the settings to match the material.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Laser vs. the Alternatives
          </h2>
          <p className="text-gray-400 leading-relaxed mb-10 max-w-2xl">
            Most people compare laser cleaning to the method they already know. Here is how it stacks up against the three most common ones.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                method: 'Sandblasting',
                problem: 'Erodes the surface it is cleaning. On historic brick, wrought iron, and antique metal the abrasive removes maker marks, tooling, and surface detail along with the rust. Creates dust and media cleanup.',
                safe: false,
              },
              {
                method: 'Chemical Stripping',
                problem: 'Strips everything uniformly and produces liquid runoff that has to be contained or discharged. On old alloys and lime mortar it can react in ways that damage the surface long after the job is done.',
                safe: false,
              },
              {
                method: 'Pressure Washing',
                problem: 'Drives water into masonry joints and behind stucco, causing problems that appear a year later. Loosens paint and biological growth but does not touch rust or coatings, so it is a partial fix at best.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'Non-contact, dry, and controllable. Removes the contamination while leaving original material intact. No abrasive to clean up, no chemicals to contain, no water to drive into a wall.',
                safe: true,
              },
            ].map((item) => (
              <div
                key={item.method}
                className={`rounded-lg p-6 border ${
                  item.safe
                    ? 'bg-[#397774]/5 border-[#397774]/30'
                    : 'bg-[#0e273e] border-[#397774]/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-lg font-bold ${item.safe ? 'text-[#397774]' : 'text-gray-300'}`}>
                    {item.method}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    item.safe ? 'bg-[#397774]/20 text-[#397774]' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {item.safe ? 'Recommended' : 'Trade-offs'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary video */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">A Closer Look</h2>
          <p className="text-gray-400 text-center mb-8">
            The ablation process, up close. This is what is actually happening at the surface.
          </p>
          <VideoSlot {...VIDEO_IDS[1]} />
        </div>
      </section>

      {/* What we work on */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Common Surfaces We Work On</h2>
          <p className="text-gray-400 leading-relaxed mb-10 max-w-2xl">
            Each of these is its own service page with more detail on the material, the process, and what to expect.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Historic Ironwork', desc: 'Charleston gates, railings, and antique iron.', href: '/services/historic-ironwork-restoration-charleston' },
              { title: 'Rust and Paint Removal', desc: 'Iron, steel, and aluminum stripped clean.', href: '/services/rust-removal-charleston' },
              { title: 'Marine Cleaning', desc: 'Boat trailers, hulls, dock hardware, and fittings.', href: '/services/marine-cleaning-charleston' },
              { title: 'Brick and Masonry', desc: 'Efflorescence and soiling on historic surfaces.', href: '/services/brick-cleaning-charleston' },
              { title: 'Graffiti Removal', desc: 'Tag removal without ghost outlines on masonry.', href: '/services/graffiti-removal-charleston' },
              { title: 'Antiques and Hardware', desc: 'Heirloom pieces where the patina must survive.', href: '/services/antique-restoration-charleston' },
            ].map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="block bg-[#0e273e] border border-[#397774]/20 rounded-lg p-6 hover:border-[#397774]/50 transition-colors group"
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

      {/* What it does not do */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Honest Limits</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Laser cleaning is not magic and there are things it cannot do. Being straight about those up front saves everyone time.
          </p>
          <div className="space-y-4">
            {[
              { title: 'It cannot restore metal that is already gone.', desc: 'Deep pitting, holes, and structural loss are permanent. Cleaning reveals them, it does not fill them.' },
              { title: 'Some surfaces are not candidates.', desc: 'Very thin plating, painted surfaces you want to keep, and materials that absorb laser light the same way the contamination does. On anything questionable we run a small test area first.' },
              { title: 'It is not the fastest method for every job.', desc: 'On a large flat wall with soft paint, hand scraping can be faster. Laser wins on detail, delicate substrates, and jobs where cleanup and containment would otherwise be the main cost.' },
            ].map((item) => (
              <div key={item.title} className="bg-[#1a3958] border border-[#397774]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Safety and Certification</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            A 300W pulsed fiber laser is a Class 4 device operating at a near-infrared wavelength that is invisible to the human eye. Running one on a residential or commercial property means wavelength-rated eye protection for everyone in the work area, a controlled boundary around the job while the laser is firing, a fire watch for combustibles nearby, and documented safety procedures.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Coastal Surface Restoration is run by a Laser Safety Officer trained to ANSI Z136.1 through the Laser Institute of America, and every job follows a written safety plan. On older paint and coatings, the same fume extraction that keeps the site clean also keeps hazardous binders like lead out of the air.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The business is fully insured through Burlington Insurance Company. Full details on the About page.
          </p>
        </div>
      </section>

      <Faq
        path='/how-laser-cleaning-works'
        items={[
          {
            q: 'Is laser cleaning safe for the surface being cleaned?',
            a:
              'For the substrates it is used on, yes. The laser is tuned so that the contamination absorbs the energy and the base material reflects it, which is the whole reason the method exists. On anything historic or irreplaceable we still run a test area first before working the full surface.',
          },
          {
            q: 'Is it loud?',
            a:
              'Much quieter than sandblasting and roughly in line with a pressure washer. The generator that powers the unit is usually the loudest thing on the job site. The cleaning itself makes a light popping or crackling sound as the contamination lifts off.',
          },
          {
            q: 'Does it use any chemicals or water?',
            a:
              'No. It is a completely dry, non-contact process. Nothing runs off into landscaping, gutters, or storm drains, which is why it is a fit for downtown Charleston and waterfront properties.',
          },
          {
            q: 'How long does a typical job take?',
            a:
              'It depends on the piece and the layer being removed. A single antique gate might take a few hours. A boat trailer is usually a half day. Larger commercial work is quoted with a time estimate before it starts.',
          },
          {
            q: 'Can you show me on my specific piece before committing?',
            a:
              'Yes. Send a few photos through the quote form and we will follow up with an estimate and a plan. On historic or irreplaceable pieces we run a small, discreet test area on site before working the rest.',
          },
          {
            q: 'How much does it cost?',
            a:
              'Every job is quoted individually. Send photos of what you want cleaned and we come back with a price, usually within 24 hours. Estimates are free.',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Have a piece you are curious about?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Send a photo and a short description. We will tell you what laser cleaning can do for it, usually within 24 hours. Free estimates, no obligation.
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
