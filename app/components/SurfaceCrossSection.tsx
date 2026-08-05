/**
 * Cross-section through a corroded surface, showing where each removal method
 * stops. This is the argument the whole business rests on, so it is drawn
 * rather than asserted in a list of bullet points.
 *
 * Built from positioned HTML rather than as one SVG. Text inside an SVG scales
 * with the viewBox, so a diagram sized to read on desktop renders its labels
 * at roughly 9px on a phone, and a horizontal scroll container just hides them
 * off the right edge instead. Keeping the bands as CSS and the labels as real
 * text lets the diagram stretch while the type stays put.
 */

const METHODS = [
  {
    name: 'Laser cleaning',
    color: '#00d4d4',
    /** Top of the base metal: exactly where you want to stop. */
    line: 72,
    label: 78,
    solid: true,
    note: 'Stops at the boundary. The contaminant and oxide are gone, the base metal is untouched.',
  },
  {
    name: 'Chemical stripping',
    color: '#fbbf24',
    line: 104,
    label: 110,
    solid: false,
    note: 'Soaks in unevenly and leaves residue in the surface, with runoff to contain.',
  },
  {
    name: 'Sandblasting',
    color: '#f87171',
    line: 136,
    label: 142,
    solid: false,
    note: 'Cuts past the corrosion and into sound metal, thinning the piece a little every time.',
  },
];

export default function SurfaceCrossSection() {
  return (
    <div>
      <div
        className="relative h-[210px] w-full overflow-hidden rounded-lg"
        role="img"
        aria-label="Cross-section of a corroded surface. Paint and grime sit on top, rust and oxide below that, then the base metal. Laser cleaning stops exactly at the top of the base metal. Chemical stripping penetrates into it, and sandblasting cuts deeper still."
      >
        {/* Layers */}
        <div className="absolute inset-x-0 top-0 h-[34px] bg-gradient-to-b from-[#4b5563] to-[#374151]" />
        <div className="absolute inset-x-0 top-[34px] h-[38px] bg-gradient-to-b from-[#a85c25] to-[#7c4a2a]" />
        <div className="absolute inset-x-0 top-[72px] bottom-0 bg-gradient-to-b from-[#b6c6d6] to-[#7f94aa]" />

        {/* Where each method stops */}
        {METHODS.map((m) => (
          <div
            key={m.name}
            className="absolute inset-x-0"
            style={{
              top: m.line,
              borderTopWidth: '2.5px',
              borderTopStyle: m.solid ? 'solid' : 'dashed',
              borderTopColor: m.color,
            }}
          />
        ))}

        {/* Labels sit on dark chips so the card colours stay readable against
            the light metal. */}
        <span className="absolute left-3 top-[8px] text-xs font-semibold text-gray-200">
          Paint, grime, graffiti
        </span>
        <span className="absolute left-3 top-[44px] text-xs font-semibold text-[#fde3cf]">
          Rust and oxide
        </span>
        {METHODS.map((m) => (
          <span
            key={m.name}
            className="absolute left-3 rounded bg-[#0a1628]/85 px-2 py-0.5 text-xs font-bold"
            style={{ top: m.label, color: m.color }}
          >
            {m.name}
          </span>
        ))}
        <span className="absolute bottom-3 left-3 text-xs font-bold text-[#16233a]">
          Base metal, what you are keeping
        </span>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {METHODS.map((m) => (
          <div
            key={m.name}
            className="rounded-lg border p-5"
            style={{
              borderColor: `${m.color}40`,
              backgroundColor: m.solid ? 'rgba(0,212,212,0.06)' : 'transparent',
            }}
          >
            <dt
              className="font-display text-lg font-bold tracking-wide"
              style={{ color: m.color }}
            >
              {m.name}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-gray-400">{m.note}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
