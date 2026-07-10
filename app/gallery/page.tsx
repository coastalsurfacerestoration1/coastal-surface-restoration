'use client';

import Link from 'next/link';
import type { Metadata } from 'next';

const categories = ['All', 'Historic / Iron', 'Marine', 'Brick & Masonry', 'Vacation Rental', 'Graffiti Removal'];

const placeholders = [
  { label: 'Historic Iron Gate', location: 'Downtown Charleston', service: 'Rust Removal' },
  { label: 'Wrought Iron Railing', location: 'South of Broad', service: 'Historic Restoration' },
  { label: 'Boat Trailer', location: 'Shem Creek', service: 'Marine Cleaning' },
  { label: 'Brick Stoop', location: 'Harleston Village', service: 'Brick & Masonry' },
  { label: 'Marine Hardware', location: 'Isle of Palms', service: 'Marine Cleaning' },
  { label: 'Fence Gate', location: "Sullivan's Island", service: 'Rust Removal' },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#0d1f3c] to-[#0a1628]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00d4d4] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Results
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Before &amp; After
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Every job tells a story. Here is what laser cleaning looks like in the real world.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-[#0a1628] border-b border-[#0e7c7b]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  i === 0
                    ? 'bg-[#00d4d4] text-[#0a1628]'
                    : 'bg-[#0d1f3c] text-gray-400 border border-[#0e7c7b]/20 hover:border-[#00d4d4]/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {placeholders.map((item) => (
              <div key={item.label} className="bg-[#0d1f3c] border border-[#0e7c7b]/20 rounded-lg overflow-hidden">
                <div className="aspect-[4/3] bg-[#0a1628] flex items-center justify-center border-b border-[#0e7c7b]/10">
                  <div className="text-center">
                    <div className="text-4xl mb-3 opacity-30">📷</div>
                    <p className="text-gray-600 text-sm">Photo coming soon</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold text-sm">{item.label}</h3>
                    <span className="text-[#00d4d4] text-xs font-medium">{item.service}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{item.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="bg-[#0d1f3c] border border-[#0e7c7b]/30 rounded-lg p-10 text-center">
            <div className="text-5xl mb-6">⚡</div>
            <h2 className="text-white font-bold text-2xl mb-4">
              First Jobs Launching Fall 2026
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
              We are currently in the final stages of equipment setup and will be taking our first jobs in September 2026. Before and after photos from real Charleston projects will be posted here as they are completed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="bg-[#00d4d4] text-[#0a1628] px-8 py-3 rounded font-bold hover:bg-[#00b8b8] transition-colors"
              >
                Be One of Our First Jobs
              </Link>
              <Link
                href="https://www.instagram.com/coastalsurfacerestoration"
                target="_blank"
                className="border border-[#00d4d4]/40 text-[#00d4d4] px-8 py-3 rounded font-bold hover:border-[#00d4d4] hover:bg-[#00d4d4]/10 transition-colors"
              >
                Follow on Instagram
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}