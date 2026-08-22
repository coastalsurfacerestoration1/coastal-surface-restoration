import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import Faq from '@/app/components/Faq';

export const metadata = pageMetadata({
  title: 'How Laser Cleaning Works',
  description:
    'A plain-language guide to laser cleaning. How the pulsed fiber laser removes rust, paint, and coatings without chemicals, abrasives, or damage to the underlying surface. Video, photos, and comparisons.',
  path: '/how-laser-cleaning-works',
});

// Placeholder slots for real assets. Drop files into public/media/how-it-works/
// and video IDs into the VIDEO_IDS array once available, then delete the
// `pending` flag on the item.
const VIDEO_IDS: { id: string; caption: string; pending: boolean }[] = [
  { id: '', caption: 'Laser cleaning rust off wrought iron', pending: true },
  { id: '', caption: 'Close-up of the ablation process', pending: true },
];

const PHOTOS: { src: string; alt: string; pending: boolean }[] = [
  { src: '/media/how-it-works/before-rust-gate.jpg', alt: 'Wrought iron gate covered in surface rust before laser cleaning', pending: true },
  { src: '/media/how-it-works/during-laser-pass.jpg', alt: 'Laser cleaning head making a pass across a rusted metal surface', pending: true },
  { src: '/media/how-it-works/after-clean-metal.jpg', alt: 'Same wrought iron gate cleaned to bare metal with detail preserved', pending: true },
];

function VideoSlot({ id, caption, pending }: { id: string; caption: string; pending: boolean }) {
  return (
    <figure>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#0a1628] border border-[#0e7c7b]/20">
        {pending || !id ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
            Video coming soon
          </div>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={caption}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      <figcaption className="mt-3 text-center text-sm text-gray-500">{caption}</figcaption>
    </figure>
  );
}

function PhotoSlot({ src, alt, pending }: { src: string; alt: string; pending: boolean }) {
  return (
    <figure>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#0a1628] border border-[#0e7c7b]/20">
        {pending ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs px-4 text-center">
            Photo coming soon
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
    </figure>
  );
}

export default function HowLaserCleaningWorksPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
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
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
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
            className="inline-block bg-[#00d4d4] text-[#0a1628] px-8 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* 30-second version */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">The 30 Second Version</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            A laser cleaner fires very short pulses of light at a surface. Rust, paint, and coatings absorb that energy and lift off as fine dust. The trick is that the laser is tuned to a level that removes the contamination but sits below the level that would affect the metal, brick, or stone underneath. Clean the top layer off, and the pulses have nothing left to work on.
          </p>
          <p className="text-gray-400 leading-relaxed">
            No sand, no chemicals, no water, no abrasion. It is the same technology used in aerospace, museum conservation, and nuclear decommissioning, packaged into a portable unit we bring to your property.
          </p>
        </div>
      </section>

      {/* Featured video */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">See It In Action</h2>
          <p className="text-gray-400 text-center mb-8">
            The first ten seconds of the video explains it better than any paragraph can.
          </p>
          <VideoSlot {...VIDEO_IDS[0]} />
        </div>
      </section>

      {/* How it actually works */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
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
                title: 'The Substrate Stays Below Its Threshold',
                desc: 'Every material has a minimum energy level, called an ablation threshold, before the laser starts to remove it. The pulse strength is set above the threshold of the contamination and below the threshold of the surface underneath. That gap is why the rust comes off and the metal, brick, or stone does not.',
              },
              {
                step: '04',
                title: 'Fume Extraction Handles the Rest',
                desc: 'The removed material is captured by a HEPA-filtered extractor at the cleaning head, so nothing settles on surrounding surfaces and there is no cleanup afterward. On old paint or coatings that may contain lead or other hazardous binders, that source capture is a safety requirement, not a convenience.',
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

      {/* Photo strip */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Before, During, After</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PHOTOS.map((photo) => (
              <PhotoSlot key={photo.src} {...photo} />
            ))}
          </div>
        </div>
      </section>

      {/* What it removes */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
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
              <div key={item.title} className="bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
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
                    ? 'bg-[#00d4d4]/5 border-[#00d4d4]/30'
                    : 'bg-[#0a1628] border-[#0e7c7b]/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-lg font-bold ${item.safe ? 'text-[#00d4d4]' : 'text-gray-300'}`}>
                    {item.method}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    item.safe ? 'bg-[#00d4d4]/20 text-[#00d4d4]' : 'bg-red-900/30 text-red-400'
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
      <section className="py-8 lg:py-12 bg-[#0a1628]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">A Closer Look</h2>
          <p className="text-gray-400 text-center mb-8">
            The ablation process, up close. This is what is actually happening at the surface.
          </p>
          <VideoSlot {...VIDEO_IDS[1]} />
        </div>
      </section>

      {/* What we work on */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
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
                className="block bg-[#0a1628] border border-[#0e7c7b]/20 rounded-lg p-6 hover:border-[#00d4d4]/50 transition-colors group"
              >
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#00d4d4] transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="inline-flex items-center gap-1 text-[#00d4d4] font-semibold text-sm group-hover:gap-2 transition-all">
                  Learn more <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What it does not do */}
      <section className="py-8 lg:py-12 bg-[#0a1628]">
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
              <div key={item.title} className="bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-8 lg:py-12 bg-[#0d1f3c]">
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
      <section className="py-8 lg:py-12 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Have a piece you are curious about?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Send a photo and a short description. We will tell you what laser cleaning can do for it, usually within 24 hours. Free estimates, no obligation.
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
