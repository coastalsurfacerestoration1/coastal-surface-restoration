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
    { href: '/locations', label: 'Service Areas' },
    { href: '/how-laser-cleaning-works', label: 'How It Works' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-50 bg-[#0e273e]/95 backdrop-blur-sm border-b border-[#397774]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 min-w-0 flex-1 md:flex-none md:shrink-0 mr-3">
            <Image
              src="/logo-social.png"
              alt=""
              width={1986}
              height={1986}
              priority
              className="h-9 w-9 shrink-0 rounded-full bg-white sm:h-10 sm:w-10 md:h-12 md:w-12"
            />
            <span className="text-white font-bold text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg tracking-wide whitespace-nowrap truncate">
              COASTAL <span className="text-[#397774]">SURFACE RESTORATION</span>
            </span>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(link.href)
                    ? 'text-[#397774] border-b-2 border-[#397774] pb-0.5'
                    : 'text-gray-300 hover:text-[#397774]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className={`px-4 py-2 rounded text-sm font-bold transition-colors ${
                isActive('/quote')
                  ? 'bg-[#2a5c5a] text-white'
                  : 'bg-[#397774] text-white hover:bg-[#2a5c5a]'
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-[#397774]/20">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[#397774]'
                      : 'text-gray-300 hover:text-[#397774]'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/quote"
                className="bg-[#397774] text-white px-4 py-2 rounded text-sm font-bold text-center hover:bg-[#2a5c5a] transition-colors"
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