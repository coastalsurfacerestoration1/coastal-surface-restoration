import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-[#0e7c7b]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">
              COASTAL <span className="text-[#00d4d4]">SURFACE RESTORATION</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Charleston's mobile laser cleaning specialist for historic, marine, and property restoration.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/services/rust-removal-charleston" className="text-gray-400 hover:text-[#00d4d4] text-sm transition-colors">Rust Removal</Link></li>
              <li><Link href="/services/historic-restoration-charleston" className="text-gray-400 hover:text-[#00d4d4] text-sm transition-colors">Historic Restoration</Link></li>
              <li><Link href="/services/marine-cleaning-charleston" className="text-gray-400 hover:text-[#00d4d4] text-sm transition-colors">Marine Cleaning</Link></li>
              <li><Link href="/services/brick-cleaning-charleston" className="text-gray-400 hover:text-[#00d4d4] text-sm transition-colors">Brick Cleaning</Link></li>
              <li><Link href="/services/graffiti-removal-charleston" className="text-gray-400 hover:text-[#00d4d4] text-sm transition-colors">Graffiti Removal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="tel:8542227790" className="text-gray-400 hover:text-[#00d4d4] text-sm transition-colors">
                  854-222-7790
                </a>
              </li>
              <li>
                <a href="mailto:tyler@coastalsurfacerestoration.com" className="text-gray-400 hover:text-[#00d4d4] text-sm transition-colors">
                  tyler@coastalsurfacerestoration.com
                </a>
              </li>
              <li className="text-gray-400 text-sm">Charleston, SC & Lowcountry</li>
            </ul>
            <Link
              href="/quote"
              className="inline-block mt-4 bg-[#00d4d4] text-[#0a1628] px-4 py-2 rounded text-sm font-bold hover:bg-[#00b8b8] transition-colors"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>

        <div className="border-t border-[#0e7c7b]/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Coastal Surface Restoration LLC. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Licensed & Insured · Charleston, SC
          </p>
        </div>
      </div>
    </footer>
  );
}