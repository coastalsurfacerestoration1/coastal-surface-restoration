/**
 * Line icons drawn from the objects we actually work on, replacing the emoji
 * that previously sat in these slots. Emoji render differently on every
 * platform and read as placeholder art.
 *
 * Kept to a few heavy strokes each: at 56px, anything finer turns to mush.
 */

type IconProps = { className?: string };

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

/** Arched wrought iron gate, for historic restoration. */
export function IronScrollIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 20a18 18 0 0 1 36 0" />
      <path d="M6 20v22M42 20v22" />
      <path d="M4 42h40" />
      <path d="M15 15v27M24 11v31M33 15v27" />
      <path d="M6 28h36" />
    </svg>
  );
}

/** Dock cleat, for marine work. */
export function CleatIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 24c-3 0-5-2-5-4.5S6 15 9 15c5 0 6 5 11 5h8c5 0 6-5 11-5 3 0 5 2 5 4.5S42 24 39 24" />
      <path d="M13 21h22" />
      <path d="M18 22v13M30 22v13" />
      <path d="M11 40h26" />
    </svg>
  );
}

/** Porch railing, for property and rental work. */
export function RailingIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12h40" />
      <path d="M4 38h40" />
      <path d="M12 12v26M24 12v26M36 12v26" />
      <path d="M8 38v6M40 38v6" />
      <path d="M4 24h40" />
    </svg>
  );
}

/** Bolt and nut, for rust and paint removal. */
export function BoltIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M17 8l10-3 10 3v11l-10 3-10-3z" />
      <path d="M27 22v18" />
      <path d="M20 28h14M20 34h14M20 40h14" />
    </svg>
  );
}

/** Brick coursing, for masonry cleaning. */
export function BrickIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h38v24H5z" />
      <path d="M5 20h38M5 28h38" />
      <path d="M17 12v8M31 12v8M11 20v8M25 20v8M37 20v8M17 28v8M31 28v8" />
    </svg>
  );
}

/** Spray can, for graffiti removal. */
export function SprayIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M16 18h14v24H16z" />
      <path d="M20 18v-6h6v6" />
      <path d="M36 10v3M40 15v3M36 20v3" />
    </svg>
  );
}

/** Urn, for antique and heirloom restoration. */
export function UrnIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M17 10h14" />
      <path d="M18 10c0 12-6 10-6 18a12 12 0 0 0 24 0c0-8-6-6-6-18" />
      <path d="M18 40h12" />
    </svg>
  );
}

/** Storefront, for commercial exteriors. */
export function StorefrontIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 18l4-8h28l4 8" />
      <path d="M6 18a5 5 0 0 0 10 0 5 5 0 0 0 10 0 5 5 0 0 0 10 0 5 5 0 0 0 6 0" />
      <path d="M9 22v18h30V22" />
      <path d="M20 40V28h8v12" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M15 6h-4a4 4 0 0 0-4 4c0 17 14 31 31 31a4 4 0 0 0 4-4v-4l-9-4-4 5a26 26 0 0 1-11-11l5-4z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 11h38v26H5z" />
      <path d="M5 13l19 13 19-13" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M24 43s14-13 14-24a14 14 0 0 0-28 0c0 11 14 24 14 24z" />
      <circle cx="24" cy="19" r="5" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 13v11l8 5" />
    </svg>
  );
}

/** Certificate, for the laser safety credential. */
export function CertificateIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 8h34v22H7z" />
      <path d="M14 15h20M14 22h12" />
      <path d="M30 30v12l6-4 6 4V30" />
    </svg>
  );
}

/** Shield, for insurance coverage. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M24 5l16 6v13c0 11-7 17-16 20-9-3-16-9-16-20V11z" />
      <path d="M17 24l5 5 10-10" />
    </svg>
  );
}
