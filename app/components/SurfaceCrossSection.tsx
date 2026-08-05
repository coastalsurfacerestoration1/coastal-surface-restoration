/**
 * Cross-section through a corroded surface, showing where each removal method
 * stops. This is the argument the whole business rests on, so it is drawn
 * rather than asserted in a list of bullet points.
 */

/** Depths are y-coordinates in the SVG below, where 70 is the top of the base metal. */
const METHODS = [
  {
    name: 'Sandblasting',
    depth: 102,
    color: '#f87171',
    note: 'Cuts past the corrosion and into sound metal, thinning the piece a little every time.',
  },
  {
    name: 'Chemical stripping',
    depth: 88,
    color: '#fbbf24',
    note: 'Soaks in unevenly and leaves residue in the surface, with runoff to contain.',
  },
  {
    name: 'Laser cleaning',
    depth: 70,
    color: '#00d4d4',
    note: 'Stops at the boundary. The contaminant and oxide are gone, the base metal is untouched.',
  },
];

export default function SurfaceCrossSection() {
  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 520 168"
          className="h-auto w-full min-w-[440px]"
          role="img"
          aria-label="Cross-section of a corroded surface. Contaminant and oxide layers sit above the base metal. Laser cleaning stops exactly at the top of the base metal, while sandblasting cuts into it and chemical stripping penetrates unevenly."
        >
          <defs>
            <linearGradient id="xs-contaminant" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4b5563" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>
            <linearGradient id="xs-oxide" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a85c25" />
              <stop offset="100%" stopColor="#7c4a2a" />
            </linearGradient>
            <linearGradient id="xs-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b6c6d6" />
              <stop offset="100%" stopColor="#7f94aa" />
            </linearGradient>
          </defs>

          {/* Layers */}
          <rect x="0" y="10" width="330" height="28" fill="url(#xs-contaminant)" />
          <rect x="0" y="38" width="330" height="32" fill="url(#xs-oxide)" />
          <rect x="0" y="70" width="330" height="88" fill="url(#xs-metal)" />

          {/* Layer labels. The base metal label sits low enough to clear the
              marker lines that cut across it. */}
          <text x="12" y="29" fill="#e5e7eb" fontSize="12" fontWeight="600">
            Paint, grime, graffiti
          </text>
          <text x="12" y="59" fill="#fde3cf" fontSize="12" fontWeight="600">
            Rust and oxide
          </text>
          <text x="12" y="134" fill="#16233a" fontSize="12" fontWeight="700">
            Base metal, what you are keeping
          </text>

          {/* Where each method stops */}
          {METHODS.map((m) => (
            <g key={m.name}>
              <line
                x1="0"
                y1={m.depth}
                x2="392"
                y2={m.depth}
                stroke={m.color}
                strokeWidth="2.5"
                strokeDasharray={m.name === 'Laser cleaning' ? undefined : '7 5'}
              />
              <circle cx="392" cy={m.depth} r="3.5" fill={m.color} />
              <text
                x="402"
                y={m.depth + 4}
                fill={m.color}
                fontSize="12"
                fontWeight="700"
              >
                {m.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {METHODS.map((m) => (
          <div
            key={m.name}
            className="rounded-lg border p-5"
            style={{
              borderColor: `${m.color}40`,
              backgroundColor:
                m.name === 'Laser cleaning' ? 'rgba(0,212,212,0.06)' : 'transparent',
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
