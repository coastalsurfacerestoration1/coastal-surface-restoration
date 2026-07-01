'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-sm border-b border-[#0e7c7b]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="text-white font-bold text-lg tracking-wide">
              COASTAL <span className="text-[#00d4d4]">SURFACE RESTORATION</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-gray-300 hover:text-[#00d4d4] text-sm font-medium transition-colors">
              Services
            </Link>
            <Link href="/gallery" className="text-gray-300 hover:text-[#00d4d4] text-sm font-medium transition-colors">
              Gallery
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-[#00d4d4] text-sm font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-[#00d4d4] text-sm font-medium transition-colors">
              Contact
            </Link>
            <Link
              href="/quote"
              className="bg-[#00d4d4] text-[#0a1628] px-4 py-2 rounded text-sm font-bold hover:bg-[#00b8b8] transition-colors"
            >
              Get a Quote
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-[#0e7c7b]/20">
            <nav className="flex flex-col gap-4">
              <Link href="/services" className="text-gray-300 hover:text-[#00d4d4] text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Services
              </Link>
              <Link href="/gallery" className="text-gray-300 hover:text-[#00d4d4] text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Gallery
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-[#00d4d4] text-sm font-medium" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-[#00d4d4] text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              <Link
                href="/quote"
                className="bg-[#00d4d4] text-[#0a1628] px-4 py-2 rounded text-sm font-bold text-center hover:bg-[#00b8b8] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Get a Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}