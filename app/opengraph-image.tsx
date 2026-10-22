import { ImageResponse } from 'next/og';

// Applies to every route via the file convention — a page-level
// opengraph-image would override it for that route only.
export const alt =
  "Coastal Surface Restoration, Charleston's surface restoration specialists";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0e273e 0%, #1a3958 50%, #0e273e 100%)',
          padding: 72,
        }}
      >
        {/* Teal glow, mirroring the hero treatment on the site. A radial
            gradient rather than a circle — satori has no blur filter, so a
            plain div would render as a hard-edged disc. */}
        <div
          style={{
            position: 'absolute',
            top: 15,
            left: 330,
            width: 740,
            height: 740,
            background:
              'radial-gradient(circle, rgba(0,212,212,0.16) 0%, rgba(0,212,212,0.06) 45%, rgba(0,212,212,0) 70%)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              letterSpacing: 6,
              color: '#397774',
              fontWeight: 600,
            }}
          >
            CHARLESTON&apos;S SURFACE RESTORATION SPECIALISTS
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 34,
              fontSize: 86,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.05,
            }}
          >
            We remove the rust,
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 86,
              fontWeight: 700,
              color: '#397774',
              lineHeight: 1.05,
            }}
          >
            not the iron.
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 30,
              color: '#9ca3af',
              maxWidth: 820,
            }}
          >
            Rust and paint off metal, wood, masonry and concrete. Test spot first.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid rgba(14, 124, 123, 0.45)',
            paddingTop: 30,
          }}
        >
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#ffffff' }}>
            COASTAL&nbsp;<span style={{ color: '#397774' }}>SURFACE RESTORATION</span>
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: '#9ca3af' }}>
            No sandblasting · No chemical strippers
          </div>
        </div>
      </div>
    ),
    size,
  );
}
