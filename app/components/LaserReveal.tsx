'use client';

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

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
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  // The prompt is only useful until they have worked out what the control is.
  const [used, setUsed] = useState(false);

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
    setUsed(true);
    setPct(Math.min(100, Math.max(0, value)));
  };

  /**
   * Drag is handled with pointer events rather than a stretched range input.
   * On touch, a range input only responds to a precise grab of its thumb, and
   * the thumb here was transparent, so on a phone there was nothing to hit and
   * the control did nothing at all.
   */
  const setFromClientX = (clientX: number) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    takeControl(((clientX - rect.left) / rect.width) * 100);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    // Move the beam before attempting capture. setPointerCapture can throw,
    // and doing it first meant one failed call silently killed the whole
    // interaction rather than just the capture.
    setFromClientX(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture is an optimisation for drags that leave the element, not a
      // requirement. Without it, pointermove on the element still works.
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) setFromClientX(e.clientX);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Already released, or never captured.
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 4;
    const moves: Record<string, number> = {
      ArrowLeft: -step,
      ArrowRight: step,
      Home: -100,
      End: 100,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    takeControl(e.key === 'Home' ? 0 : e.key === 'End' ? 100 : pct + moves[e.key]);
  };

  return (
    <figure className="m-0">
      <div
        ref={boxRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)} percent cleaned`}
        aria-label="Run the laser across the ironwork to compare corroded and cleaned metal"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        // pan-y keeps vertical page scrolling working while horizontal drags
        // stay with us instead of being swallowed by the browser.
        style={{ touchAction: 'pan-y' }}
        className="relative aspect-square w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-lg border border-[#397774]/30 bg-[#1a3958] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#397774] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e273e]"
      >
        {/* Corroded state underneath */}
        <Ironwork corroded />

        {/* Cleaned state, revealed from the left as the pass advances */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        >
          <div className="absolute inset-0 bg-[#0e273e]" />
          <Ironwork corroded={false} />
        </div>

        {/* The beam */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-[#397774]"
          style={{
            left: `${pct}%`,
            boxShadow:
              '0 0 12px 2px rgba(0,212,212,0.9), 0 0 40px 10px rgba(0,212,212,0.35)',
          }}
        />

        {/* Grip. Touch has no hover state, so the control has to look
            draggable before it is touched. */}
        <div
          className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#397774] bg-[#0e273e]/85 shadow-[0_0_16px_rgba(0,212,212,0.5)]"
          style={{ left: `${pct}%` }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#397774"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" />
          </svg>
        </div>

        {/* The prompt sits inside the image, in brand teal, because as muted
            grey text under the panel nobody read it. It clears itself once the
            control has been used. */}
        <div
          aria-hidden="true"
          // Inline rather than a conditional Tailwind class: the utility for
          // the hidden state was not being generated, so the prompt never
          // actually faded.
          style={{ opacity: used ? 0 : 1 }}
          className="pointer-events-none absolute inset-x-0 top-4 flex justify-center transition-opacity duration-500"
        >
          <span className="flex items-center gap-2 rounded-full border border-[#397774] bg-[#0e273e]/95 px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_0_24px_rgba(0,212,212,0.4)]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#397774"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5l-6 7 6 7" />
            </svg>
            Drag to run the laser
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#397774"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 5l6 7-6 7" />
            </svg>
          </span>
        </div>

        <span className="pointer-events-none absolute bottom-3 left-3 rounded bg-[#0e273e]/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#397774]">
          Cleaned
        </span>
        <span className="pointer-events-none absolute right-3 bottom-3 rounded bg-[#0e273e]/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
          Corroded
        </span>
      </div>
      <figcaption className="mt-3 text-center text-xs text-gray-500">
        Illustration, not a photograph. Real project photos post this fall.
      </figcaption>
    </figure>
  );
}
