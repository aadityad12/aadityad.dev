"use client";

import { useEffect, useRef, useState } from "react";
import { boilPath, hashString, mulberry32 } from "../components/mascot/boil";
import { BOIL_COUNT, FRAMES, SLOTS, type FrameId } from "../components/mascot/frames";

/* The drawing kit for project scenes. A scene is a small hand-drawn story starring Pathfinder:
   a few steps, a few seconds each, that show what a project does without any jargon.
   Everything here draws in Pathfinder's hand: round ink strokes, redrawn three times with a small
   deterministic jitter, the three drawings shown in turn so the line shimmers (classes .boil-g*). */

const V = [0, 1, 2] as const;

/** Three redraws of one path. Redraw 0 is the path as authored. Same output on server and client. */
export function boil(d: string, key: string, amp = 1): string[] {
  return V.map((v) => (v === 0 ? d : boilPath(d, mulberry32(hashString(key) * 31 + v * 7919 + 1), amp)));
}

/** One hand-drawn line or shape. `k` must be unique within the scene; it seeds the jitter. */
export function Ink({ d, k, amp, className = "", ...rest }: { d: string; k: string; amp?: number; className?: string } & React.SVGProps<SVGPathElement>) {
  const ds = boil(d, k, amp);
  return (
    <>
      {V.map((v) => (
        <path key={v} className={`sc-ink boil-g boil-g${v} ${className}`} d={ds[v]} {...rest} />
      ))}
    </>
  );
}

/** Pathfinder inside a scene. (x, y) is where his feet stand; `size` is his height in scene units. */
export function Pf({ pose = "idle", x, y, size = 150, flip = false }: { pose?: FrameId; x: number; y: number; size?: number; flip?: boolean }) {
  const s = size / 175; // the drawing is about 175 units tall, antenna to feet, feet at y = 213, centre x = 120
  const frames = FRAMES[pose];
  return (
    <g className="mascot sc-pf" transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(-120 -213)`}>
      {Array.from({ length: BOIL_COUNT }, (_, v) => (
        <g key={v} className={`boil-g boil-g${v}`}>
          {SLOTS.map((slot) => {
            const d = frames[v].paths[slot];
            return d === null ? null : <path key={slot} data-slot={slot} d={d} />;
          })}
          {frames[v].meta.pupil && <circle className="m-pupil" cx={frames[v].meta.pupil!.cx} cy={frames[v].meta.pupil!.cy} r={frames[v].meta.pupil!.r} />}
        </g>
      ))}
    </g>
  );
}

/** A speech bubble in Pathfinder's handwriting. The tail points at (tx, ty). */
export function Bubble({ cx, y, lines, tx, ty, k }: { cx: number; y: number; lines: string[]; tx: number; ty: number; k: string }) {
  const lh = 29;
  const w = Math.max(...lines.map((l) => l.length)) * 12.4 + 52; // the handwriting runs about 12.4 units a letter at this size
  const x = cx - w / 2;
  const h = lines.length * lh + 26;
  const r = 20;
  const below = ty > y + h; // tail leaves from the bottom edge, otherwise from the top
  const ax = Math.max(x + r + 12, Math.min(x + w - r - 26, tx + (tx < x + w / 2 ? 30 : -30)));
  const edge = below ? y + h : y;
  const tail = below ? `L ${ax + 22} ${edge} L ${tx} ${ty} L ${ax} ${edge}` : "";
  const tailTop = below ? "" : `L ${ax} ${edge} L ${tx} ${ty} L ${ax + 22} ${edge}`;
  const d = `M ${x + r} ${y} ${tailTop} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} ${tail} L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
  return (
    <g>
      <Ink d={d} k={k} className="sc-fill" />
      {lines.map((t, i) => (
        <text key={i} className="hand sc-say" x={cx} y={y + 38 + i * lh} textAnchor="middle">
          {t}
        </text>
      ))}
    </g>
  );
}

/**
 * Steps through a scene's story. Returns the current step. It only runs while the scene is on
 * screen, it holds still under reduced motion (showing `rest`, the step that reads best as a still),
 * and `forced` pins a step from outside (the stage uses it; null means run freely).
 */
export function useStory(durations: number[], opts: { rest?: number; forced?: number | null; paused?: boolean } = {}) {
  const { rest = durations.length - 1, forced = null, paused = false } = opts;
  const ref = useRef<SVGSVGElement>(null);
  const [step, setStep] = useState(rest);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting && !rm.matches), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = live && !paused && forced === null;
  useEffect(() => {
    if (!running) return;
    let i = 0;
    let t = 0;
    const tick = () => {
      setStep(i);
      t = window.setTimeout(() => {
        i = (i + 1) % durations.length;
        tick();
      }, durations[i]);
    };
    tick();
    return () => window.clearTimeout(t);
    // durations is a constant array declared by each scene
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return { ref, step: forced ?? step };
}

export type SceneProps = { step?: number | null; paused?: boolean };
