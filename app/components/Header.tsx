'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-sm border-b border-[#0e7c7b]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Small.svg"
              alt="Coastal Surface Restoration"
              width={52}
              height={52}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[#00d4d4] border-b-2 border-[#00d4d4] pb-0.5'
                    : 'text-gray-300 hover:text-[#00d4d4]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className={`px-4 py-2 rounded text-sm font-bold transition-colors ${
                isActive('/quote')
                  ? 'bg-[#00b8b8] text-[#0a1628]'
                  : 'bg-[#00d4d4] text-[#0a1628] hover:bg-[#00b8b8]'
              }`}
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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[#00d4d4]'
                      : 'text-gray-300 hover:text-[#00d4d4]'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
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