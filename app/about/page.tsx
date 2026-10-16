import Link from 'next/link';
import { CertificateIcon, IronScrollIcon, ShieldIcon } from '@/app/components/icons';
import { pageMetadata } from '@/lib/seo';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata = pageMetadata({
  title: 'About',
  description:
    // "ANSI-certified" is not a thing and is not what the credential says.
    // The body of this page has always had it right, so the description was
    // the only place on the site still claiming certification rather than
    // training, and it is the copy that shows in search snippets.
    "Coastal Surface Restoration is Charleston's mobile laser cleaning specialist. Founder Tyler Scherzer is a Laser Safety Officer trained to ANSI Z136.1 through the LIA.",
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0e273e]">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />

      {/* Hero */}
      <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-gradient-to-b from-[#1a3958] to-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#397774] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            About Us
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Built for Charleston.<br />
            <span className="text-[#397774]">Built to Last.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Coastal Surface Restoration is a mobile laser cleaning company serving Charleston and the Lowcountry. We remove rust and old paint from iron, steel and marine hardware, with no chemicals or blast media and a test spot before every job.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why Laser Cleaning?</h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Charleston&apos;s historic architecture, coastal climate, and salt air create a perfect storm for rust, oxidation, and surface degradation. Traditional cleaning methods like sandblasting, chemical stripping, and pressure washing often cause more damage than they fix on the iron gates, railings and cast hardware that define this city&apos;s streets.
                </p>
                <p>
                  Laser cleaning changes that equation entirely. A pulsed fiber laser breaks up rust and paint and lifts them off as dust and fume, set to stop at the metal. No blast media to sweep. No chemicals near Charleston&apos;s waterways. Glass, sealant and siding nearby get masked.
                </p>
                <p>
                  Tyler Scherzer started Coastal Surface Restoration to bring this method to Charleston&apos;s iron, steel and marine hardware.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { number: '300W', label: 'JPT MOPA Pulsed Fiber Laser', desc: 'Chihalo CF-300 backpack unit with a JPT 300 W MOPA source, 1064 nm, Class 4.' },
                { number: '0', label: 'Chemicals Used', desc: 'The laser itself uses no chemical solvents, acids, or blast media.' },
                { number: 'On site', label: 'Mobile Service', desc: 'We come to your property. Small parts and hardware can also go to our bench.' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#1a3958] border border-[#397774]/20 rounded-lg p-6">
                  <div className="text-[#397774] text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
                  <div className="text-gray-400 text-sm">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-8 lg:py-12 bg-[#1a3958]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Trained, not certified. The credential is ANSI Z136.1 training
                through the LIA, and this heading was the largest text on the
                page still calling it certification. */}
            <h2 className="text-3xl font-bold text-white mb-4">Trained. Insured. Ready.</h2>
            {/* Says only what can be evidenced. The previous wording claimed
                "certifications" plural, which overstated an ANSI Z136.1
                training credential and implied others that are not held, EPA
                RRP among them. This version is accurate regardless of what
                the declarations page turns out to say. */}
            <p className="text-gray-400 max-w-xl mx-auto">
              Trained to ANSI Z136.1 through the Laser Institute of America, and carrying general liability insurance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { Icon: CertificateIcon, title: 'ANSI Z136.1 Trained', desc: 'Designated Laser Safety Officer trained to ANSI Z136.1 through the Laser Institute of America.' },
              // Limits stay, carrier name goes. The limits are verifiable and
              // already appear on certificates issued to CLIMB and AvantStay.
              // The legal entity is not: the policy was placed through a
              // wholesaler, so the name on the paperwork is not necessarily
              // the entity on the declarations page. Add it back only once the
              // agent confirms it.
              { Icon: ShieldIcon, title: 'General Liability Insured', desc: 'Commercial General Liability coverage. $1M per occurrence / $2M aggregate.' },
              // Describes what the service suits, not what has been done. The
              // old title, "Historic District Experience", implied a job
              // history that does not exist yet.
              { Icon: IronScrollIcon, title: 'Historic District Ready', desc: 'Works on district homes that are not individually listed, with a written method for BAR files. We do not laser paint on pre-1978 homes or child-occupied buildings unless a lead test comes back negative; we refer it to an EPA RRP certified firm.' },
            ].map((item) => (
              <div key={item.title} className="bg-[#0e273e] border border-[#397774]/20 rounded-lg p-6 text-center">
                <item.Icon className="h-12 w-12 text-[#397774] mb-4 mx-auto" />
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-8 lg:py-12 bg-[#0e273e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Service Area</h2>
            <p className="text-gray-400">Based in Charleston, SC, serving the peninsula, East Cooper, the islands, West Ashley, North Charleston and Summerville.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['Downtown Charleston', 'Mount Pleasant', 'Isle of Palms', "Sullivan's Island", 'James Island', 'Folly Beach', 'West Ashley', 'North Charleston', 'Summerville', 'Daniel Island'].map((area) => (
              <span key={area} className="bg-[#1a3958] border border-[#397774]/20 text-gray-300 px-4 py-2 rounded text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 lg:py-12 bg-[#1a3958] border-t border-[#397774]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8">Free estimates for all jobs. We respond within one business day.</p>
          <Link href="/quote" className="bg-[#397774] text-white px-10 py-4 rounded font-bold text-lg hover:bg-[#2a5c5a] transition-colors">
            Request a Free Quote
          </Link>
        </div>
      </section>

    </div>
  );
}