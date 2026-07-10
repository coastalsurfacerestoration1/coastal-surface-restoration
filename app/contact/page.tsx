import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Coastal Surface Restoration',
  description:
    'Contact Coastal Surface Restoration for mobile laser cleaning in Charleston, SC. Call, email, or request a free quote online.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Questions about a project? Ready to schedule? We respond to every inquiry within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Info + Quote CTA */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Contact Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Direct Contact</h2>

              <a href="tel:8542227790" className="flex items-start gap-4 bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6 hover:border-[#00d4d4]/40 transition-colors group">
                <span className="text-2xl">📞</span>
                <div>
                  <div className="text-[#00d4d4] font-semibold text-sm uppercase tracking-wider mb-1">Phone</div>
                  <div className="text-white font-bold text-lg group-hover:text-[#00d4d4] transition-colors">854-222-7790</div>
                  <div className="text-gray-400 text-sm mt-1">Available Mon-Sat, 8am-7pm</div>
                </div>
              </a>

              <a href="mailto:tyler@coastalsurfacerestoration.com" className="flex items-start gap-4 bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6 hover:border-[#00d4d4]/40 transition-colors group">
                <span className="text-2xl">✉️</span>
                <div>
                  <div className="text-[#00d4d4] font-semibold text-sm uppercase tracking-wider mb-1">Email</div>
                  <div className="text-white font-bold group-hover:text-[#00d4d4] transition-colors break-all">tyler@coastalsurfacerestoration.com</div>
                  <div className="text-gray-400 text-sm mt-1">We respond within 24 hours</div>
                </div>
              </a>

              <div className="flex items-start gap-4 bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="text-[#00d4d4] font-semibold text-sm uppercase tracking-wider mb-1">Service Area</div>
                  <div className="text-white font-bold">Charleston, SC & Lowcountry</div>
                  <div className="text-gray-400 text-sm mt-1">Downtown Charleston, Mount Pleasant, Isle of Palms, Sullivan's Island, James Island, Folly Beach, and surrounding areas</div>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg p-6">
                <span className="text-2xl">🕐</span>
                <div>
                  <div className="text-[#00d4d4] font-semibold text-sm uppercase tracking-wider mb-1">Hours</div>
                  <div className="text-white font-bold">Monday - Saturday</div>
                  <div className="text-gray-400 text-sm mt-1">8:00 AM - 7:00 PM</div>
                </div>
              </div>
            </div>

            {/* Quote CTA */}
            <div className="bg-[#0d1f3c] border border-[#0e7c7b]/30 rounded-lg p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Want a Free Estimate?</h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  The fastest way to get a quote is through our online form. Tell us about your project and we will follow up with pricing within 24 hours.
                </p>
                <ul className="space-y-3 mb-8">
                  {['No obligation', 'Response within 24 hours', 'On-site estimates available', 'Minimum job size $400'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                      <span className="text-[#00d4d4] font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/quote" className="block text-center bg-[#00d4d4] text-[#0a1628] px-8 py-4 rounded font-bold text-lg hover:bg-[#00b8b8] transition-colors">
                Request a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Common Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'How quickly can you schedule a job?', a: 'Most jobs can be scheduled within 1-2 weeks. For urgent projects, contact us directly by phone and we will do our best to accommodate.' },
              { q: 'Do I need to be present during the job?', a: 'Not necessarily. For outdoor work on gates, fences, or exterior surfaces, we can often complete the job without you present. We will confirm details beforehand.' },
              { q: 'What is your service area?', a: "We serve Charleston and the surrounding Lowcountry including Mount Pleasant, Isle of Palms, Sullivan's Island, James Island, Folly Beach, West Ashley, and Summerville." },
              { q: 'What is the minimum job size?', a: 'Our minimum job size is $400. This reflects the cost of mobilization and setup for any job regardless of size.' },
              { q: 'Is laser cleaning safe for historic materials?', a: 'Yes -- it is one of the safest methods available for historic surfaces. The laser removes only the contaminant layer without affecting the underlying material.' },
            ].map((faq) => (
              <div key={faq.q} className="bg-[#0a1628] border border-[#0e7c7b]/20 rounded-lg p-6">
                <h3 className="text-white font-bold mb-3">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}