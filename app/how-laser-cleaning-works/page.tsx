import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';

export const metadata = pageMetadata({
  title: 'How Laser Cleaning Works',
  description:
    'A plain-language guide to laser cleaning. How a pulsed fiber laser removes rust and paint without chemicals or blast media, where it stops, and what it cannot do. Diagrams and comparisons.',
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
];

const VIDEO_DISCLAIMER =
  'Example footage from other laser cleaning equipment, not our machine. Our own Charleston footage will replace these as jobs are completed.';

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
        ariaLabel="Diagram: the laser has removed a section of the rust layer in the middle, and fine particles rise from the cleaned area. The base metal beneath is exposed."
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
        caption="The coating is gone and the metal is bare, with a matte texture. The removed coating leaves as dust and fume for the extractor. No sand, chemical residue or water."
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
            A short, plain-language explanation of what laser cleaning is, what it removes, and how it is set to stop at the surface underneath. If you have never seen it before, this is the page to read first.
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
            A laser cleaner fires very short pulses of light at one wavelength, 1064 nm. Rust and paint absorb that light and leave as fine dust and fume. Bare metal reflects more of it, so with the right settings the beam takes the coating and stops at the metal.
          </p>
          <p className="text-gray-400 leading-relaxed">
            No sand, no chemicals, no water. CSR runs a Chihalo CF-300, a 300 W pulsed fiber laser in a backpack unit, and brings it to your property.
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
                desc: 'The laser fires nanosecond pulses, not a continuous beam. Each pulse is very short and very intense, which limits the heat that reaches the surface underneath when the settings are right.',
              },
              {
                step: '02',
                title: 'The Contaminant Absorbs the Energy',
                desc: 'Rust, paint, and dirt readily absorb near-infrared laser light. When a pulse hits, the contaminant absorbs the energy and lifts off as a fine dust, part vaporized and part shed as small particles from the sudden thermal shock. The whole family of removal effects is called laser ablation.',
              },
              {
                step: '03',
                title: 'Settings Decide Where It Stops',
                desc: 'Bare steel and iron reflect much of this wavelength, so a pulse set for the coating does little to the metal. Too much energy will still mark it: steel can melt, brass can darken and brick can gray. That is why every job starts with a test spot and logged settings.',
              },
              {
                step: '04',
                title: 'Fume Extraction and Cleanup',
                desc: 'Removed coating becomes dust and fume. A HEPA and carbon fume extractor runs beside the work on coated jobs, and the area gets a HEPA vacuum and wipe-down after. We do not laser paint on pre-1978 homes or child-occupied buildings unless a lead test comes back negative; we refer it to an EPA RRP certified firm.',
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
        </div>
      </section>

      {/* What it removes */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">What Laser Cleaning Removes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'Rust and Corrosion', desc: 'Surface rust, mill scale, fire scale and flash rust from iron and steel. Deep pitting is a separate issue and cannot be reversed by any cleaning method.' },
              { title: 'Paint and Coatings', desc: 'Paint and primer off steel and iron, with a test spot first. Powder coat is tested before quoting. Bare steel flash-rusts overnight here, so primer goes on the same day.' },
              { title: 'Grease and Oil', desc: 'Carbonized grease on grill grates and small parts, and cutting oil on machined steel, often paired with a degreaser and tested first.' },
              { title: 'Graffiti', desc: 'Dark spray paint and marker on hard, non-historic brick, block and stone, tested before quoting. Silver and metallic paint on masonry is not taken, and red or yellow may not fully lift.' },
              { title: 'Marine Stainless and Bronze', desc: 'Tea staining on 316 and 304 stainless, verdigris on bronze cleats and portlights, and oxide on trailer parts, on land or with the boat on the hard.' },
              { title: 'Soot and Smoke Film', desc: 'Soot and smoke film on hard brick or stone fireplace surrounds, tested first. Historic soft brick, lime mortar, stucco and algae on masonry are not offered. Efflorescence is a moisture problem in the wall, so CSR does not clean it.' },
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
          <h2 className="text-3xl font-bold text-white mb-6">Surfaces We Work On, After a Test Spot</h2>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-2xl">
            Because the laser does not grind across the surface, it suits detailed metal that blasting would wear down.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Mild steel',
              'Cast iron',
              'Pre-1900 wrought iron (test first)',
              'Stainless steel',
              'Bronze hardware',
              'Solid brass fixtures (test first)',
              'Vintage tools and hardware',
              'Unsealed concrete (small areas)',
              'Hard-fired brick (test first)',
            ].map((surface) => (
              <span key={surface} className="bg-[#0e273e] border border-[#397774]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {surface}
              </span>
            ))}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mt-6 max-w-2xl">
            Every job starts with a small test spot, and the settings are dialed in for that material before the full piece.
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
                problem: 'Erodes the surface it is cleaning. On ironwork and antique metal the abrasive removes maker marks, tooling, and surface detail along with the rust. Creates dust and media cleanup.',
                safe: false,
              },
              {
                method: 'Chemical Stripping',
                problem: 'Strips everything uniformly and produces liquid runoff that has to be contained or discharged. On old alloys it can react in ways that damage the surface long after the job is done.',
                safe: false,
              },
              {
                method: 'Pressure Washing',
                problem: 'Drives water into masonry joints, causing problems that appear a year later. Loosens paint and biological growth but does not touch rust or coatings, so it is a partial fix at best.',
                safe: false,
              },
              {
                method: 'Laser Cleaning',
                problem: 'Non-contact and dry, set to stop at the metal after a test spot. No blast media or chemicals to contain, and no water. Removed coating still needs extraction and cleanup.',
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
              { title: 'Rust and Paint Removal', desc: 'Rust and paint off iron and steel, primed the same day.', href: '/services/rust-removal-charleston' },
              { title: 'Marine Cleaning', desc: 'Boat trailers, stainless rails and bronze fittings, on land.', href: '/services/marine-cleaning-charleston' },
              { title: 'Graffiti Removal', desc: 'Dark tags on hard, non-historic masonry, with a test patch before any quote.', href: '/services/graffiti-removal-charleston' },
              { title: 'Antiques and Hardware', desc: 'Vintage tools, hinges, shutter dogs and cast hardware, cleaned on the bench.', href: '/services/antique-restoration-charleston' },
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
              { title: 'It is not the fastest method for every job.', desc: 'Whole walls, floors and siding are not quoted; other methods are faster there. Laser fits railings, castings and hardware, where detail matters and blast cleanup would cost more.' },
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
          <h2 className="text-3xl font-bold text-white mb-6">Safety and Training</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            A 300W pulsed fiber laser is a Class 4 device operating at a near-infrared wavelength that is invisible to the human eye. Running one on a residential or commercial property means wavelength-rated eye protection for everyone in the work area, a controlled boundary around the job while the laser is firing, a fire watch for combustibles nearby, and documented safety procedures.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Coastal Surface Restoration is run by a Laser Safety Officer trained to ANSI Z136.1 through the Laser Institute of America, and every job follows a written safety plan. We do not laser paint on pre-1978 homes or child-occupied buildings unless a lead test comes back negative; we refer it to an EPA RRP certified firm.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The business carries Commercial General Liability coverage. Full details on the About page.
          </p>
        </div>
      </section>

      <Faq
        path='/how-laser-cleaning-works'
        items={[
          {
            q: 'Is laser cleaning safe for the surface being cleaned?',
            a:
              'When the settings match the material, yes. Too much energy can melt steel, darken brass or gray brick, so every job starts with a test spot. A cleaned area can look matte next to the metal around it.',
          },
          {
            q: 'Is it loud?',
            a:
              'Quieter than sandblasting. The generator and air compressor are the loudest things on site, and the beam makes a light crackle as the coating lifts.',
          },
          {
            q: 'Does it use any chemicals or water?',
            a:
              'No. It is a dry, non-contact process with no runoff into landscaping, gutters or storm drains. Removed coating leaves as dust and fume, so it is extracted and vacuumed, not rinsed.',
          },
          {
            q: 'How long does a typical job take?',
            a:
              'It depends on the piece, the coating and how thick it is. We time a test spot on your piece and quote from that, so the scope is set before work starts.',
          },
          {
            q: 'Can you show me on my specific piece before committing?',
            a:
              'Yes. Send a few photos through the quote form and we will follow up with an estimate and a plan. We run a small test spot on site, under a signed test authorization, before working the rest.',
          },
          {
            q: 'How much does it cost?',
            a:
              'Jobs are quoted per piece, per job, or per linear foot for railings, with a $400 minimum. Send photos and we reply with a price, usually within one business day. Estimates are free.',
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
            Send a photo and a short description. We will tell you what laser cleaning can do for it, usually within one business day. Free estimates, no obligation.
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
