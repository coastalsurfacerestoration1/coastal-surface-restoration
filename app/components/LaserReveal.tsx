'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A wrought iron gate detail that the visitor can run a laser across.
 *
 * Everything left of the scan line is clean metal, everything right of it is
 * still corroded, which is literally what the tool does. Drawn entirely in SVG
 * because there are no project photos yet. When real before and after shots
 * exist, the two <Ironwork> layers become two <img> layers and the mechanics
 * here do not change.
 */

/** Charleston gate motif: rails, pickets, and an S-scroll centerpiece. */
function Ironwork({ corroded }: { corroded: boolean }) {
  const id = corroded ? 'rust' : 'clean';
  return (
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        {/* userSpaceOnUse is required, not stylistic: the default
            objectBoundingBox units collapse on the straight rails and pickets,
            whose bounding boxes have zero height or width, and those elements
            then fail to paint at all. */}
        <linearGradient
          id={`${id}-stroke`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2="200"
        >
          {corroded ? (
            <>
              <stop offset="0%" stopColor="#7c4a2a" />
              <stop offset="45%" stopColor="#a85c25" />
              <stop offset="100%" stopColor="#5d3320" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#eef4fa" />
              <stop offset="50%" stopColor="#9fb3c8" />
              <stop offset="100%" stopColor="#d6e2ee" />
            </>
          )}
        </linearGradient>
        {corroded && (
          // Roughens every edge so the corroded pass reads as pitted metal
          // rather than as the clean pass in a different colour.
          <filter id="pitting">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.5"
              numOctaves="3"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        )}
      </defs>

      <g
        fill="none"
        stroke={`url(#${id}-stroke)`}
        strokeLinecap="round"
        filter={corroded ? 'url(#pitting)' : undefined}
      >
        {/* Frame */}
        <path d="M22 30 H178" strokeWidth="9" />
        <path d="M22 172 H178" strokeWidth="9" />
        <path d="M22 30 V172" strokeWidth="8" />
        <path d="M178 30 V172" strokeWidth="8" />
        {/* Pickets */}
        <path d="M61 30 V172" strokeWidth="5" />
        <path d="M139 30 V172" strokeWidth="5" />
        <path d="M100 30 V172" strokeWidth="6" />
        {/* Scrollwork */}
        <path
          d="M100 66 C 134 66, 134 100, 100 100 C 66 100, 66 134, 100 134"
          strokeWidth="6"
        />
        <path d="M78 50 C 78 60, 86 66, 96 66" strokeWidth="4" />
        <path d="M122 150 C 122 140, 114 134, 104 134" strokeWidth="4" />
        {/* Finials */}
        <circle cx="61" cy="22" r="4.5" strokeWidth="3.5" />
        <circle cx="100" cy="19" r="5.5" strokeWidth="3.5" />
        <circle cx="139" cy="22" r="4.5" strokeWidth="3.5" />
      </g>
    </svg>
  );
}

const START = 6;
const SETTLE = 62;

export default function LaserReveal() {
  const [pct, setPct] = useState(START);
  const frame = useRef<number | null>(null);

  // One pass on load to show what the control does, then it is the visitor's.
  // All state updates happen inside the frame callback rather than directly in
  // the effect body, which would fire a cascading render.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const begin = performance.now();
    const duration = 2200;
    const delay = 450;

    const step = (now: number) => {
      if (reduced) {
        setPct(SETTLE);
        return;
      }
      const elapsed = now - begin - delay;
      if (elapsed >= 0) {
        const p = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setPct(START + (SETTLE - START) * eased);
        if (p >= 1) return;
      }
      frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const takeControl = (value: number) => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    setPct(value);
  };

  return (
    <figure className="m-0">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-[#0e7c7b]/30 bg-[#0d1f3c] focus-within:ring-2 focus-within:ring-[#00d4d4] focus-within:ring-offset-2 focus-within:ring-offset-[#0a1628]">
        {/* Corroded state underneath */}
        <Ironwork corroded />

        {/* Cleaned state, revealed from the left as the pass advances */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        >
          <div className="absolute inset-0 bg-[#0a1628]" />
          <Ironwork corroded={false} />
        </div>

        {/* The beam */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-[#00d4d4]"
          style={{
            left: `${pct}%`,
            boxShadow:
              '0 0 12px 2px rgba(0,212,212,0.9), 0 0 40px 10px rgba(0,212,212,0.35)',
          }}
        />

        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pct}
          onChange={(e) => takeControl(Number(e.target.value))}
          aria-label="Run the laser across the ironwork to compare corroded and cleaned metal"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />

        <span className="pointer-events-none absolute bottom-3 left-3 rounded bg-[#0a1628]/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#00d4d4]">
          Cleaned
        </span>
        <span className="pointer-events-none absolute right-3 bottom-3 rounded bg-[#0a1628]/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
          Corroded
        </span>
      </div>
      <figcaption className="mt-3 text-center text-xs text-gray-500">
        Drag to run the laser. Illustration, not a photograph. Real project
        photos post this fall.
      </figcaption>
    </figure>
  );
}
