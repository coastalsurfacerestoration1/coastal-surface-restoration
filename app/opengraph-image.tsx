import { ImageResponse } from 'next/og';

// Applies to every route via the file convention — a page-level
// opengraph-image would override it for that route only.
export const alt =
  'Coastal Surface Restoration, mobile laser cleaning in Charleston, SC';
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
          background: 'linear-gradient(135deg, #0a1628 0%, #0d2040 50%, #0a1628 100%)',
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
              color: '#00d4d4',
              fontWeight: 600,
            }}
          >
            CHARLESTON, SC &amp; THE LOWCOUNTRY
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
            Laser Precision.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 86,
              fontWeight: 700,
              color: '#00d4d4',
              lineHeight: 1.05,
            }}
          >
            Zero Damage.
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
            Mobile laser cleaning for historic, marine, and property restoration.
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
            COASTAL&nbsp;<span style={{ color: '#00d4d4' }}>SURFACE RESTORATION</span>
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: '#9ca3af' }}>
            No chemicals · No abrasives · No mess
          </div>
        </div>
      </div>
    ),
    size,
  );
}
