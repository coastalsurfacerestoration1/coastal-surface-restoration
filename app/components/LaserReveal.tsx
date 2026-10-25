'use client';

import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

/**
 * A rusted cast iron skillet that the visitor can run a laser across.
 *
 * Everything left of the scan line is the after photo, everything right of it
 * is still the before, which is literally what the tool does. It is a test
 * piece, not a customer job, and the caption says so. The two photos must keep
 * exactly the same size and crop or the scan line will not line up; both are
 * 960x1265 in public/images.
 */
const PHOTO = { width: 960, height: 1265 };
const BEFORE = {
  src: '/images/skillet-before.jpg',
  alt: 'Cast iron skillet covered in heavy rust before laser cleaning',
};
const AFTER = {
  src: '/images/skillet-after.jpg',
  alt: 'Same cast iron skillet after laser cleaning, bare gray iron',
};

/** The frame is capped at 28rem wide (max-w-md) and is full width below that. */
const SIZES = '(min-width: 640px) 28rem, 100vw';

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
    <figure className="m-0 mx-auto w-full max-w-md">
      <div
        ref={boxRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)} percent cleaned`}
        aria-label="Run the laser across the cast iron skillet to compare it before and after cleaning"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        // pan-y keeps vertical page scrolling working while horizontal drags
        // stay with us instead of being swallowed by the browser.
        style={{ touchAction: 'pan-y' }}
        className="relative aspect-[960/1265] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-lg border border-[#397774]/30 bg-[#1a3958] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#397774] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e273e]"
      >
        {/* Before photo underneath. Preloaded: it is the hero's largest image. */}
        <Image
          src={BEFORE.src}
          alt={BEFORE.alt}
          {...PHOTO}
          sizes={SIZES}
          preload
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* After photo, revealed from the left as the pass advances */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        >
          <Image
            src={AFTER.src}
            alt={AFTER.alt}
            {...PHOTO}
            sizes={SIZES}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
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
          After
        </span>
        <span className="pointer-events-none absolute right-3 bottom-3 rounded bg-[#0e273e]/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
          Before
        </span>
      </div>
      <figcaption className="mt-3 text-center text-xs text-gray-500">
        Cast iron skillet, test piece. Heavy rust removed with the laser, no sandblasting or chemical strippers.
      </figcaption>
    </figure>
  );
}
