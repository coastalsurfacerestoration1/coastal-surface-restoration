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
