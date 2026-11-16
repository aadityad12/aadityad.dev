"use client";

import { Bubble, Ink, Pf, useStory, type SceneProps } from "./kit";

/* Rung: the same small programming language built five times, each with one more classic speed trick.
   A wooden ladder, one rung per version, and Pathfinder climbs it. The number beside each rung is how
   much faster that version runs the same test program than the first one did. The top rung, which
   turns the program into the processor's own machine code, is the one red thing. */

const STEPS = [3000, 3200, 3000, 3800];

const GROUND = 476;
const XL0 = 290; // left rail at the ground
const W = 150; // distance between the rails
const T = 0.45; // how far the ladder leans: units right per unit up
const TOP = 112; // where the rails end
const SIZE = 184;

const RUNG_Y = [440, 386, 332, 278, 224];
const SPEED = ["1×", "3.8×", "5.7×", "8.6×", "38.8×"];
const lx = (y: number) => XL0 + (GROUND - y) * T; // left rail's centre line
const cx = (y: number) => lx(y) + W / 2; // the middle of the ladder at height y

// How high Pathfinder has climbed: -1 is on the ground, otherwise the rung he stands on.
const AT = [-1, 1, 3, 4];
const POSE = ["glance-r", "glance-r", "glance-r", "wave-b"] as const;
const SAY: string[][] = [["Same program.", "Five ways to run it."], ["Each rung, one", "new trick."], [], ["38.8 times faster.", "Measured."]];

// A hand-drawn rail: a long thin plank, edges drifting a little.
const rail = (side: 0 | 1) => {
  const off = side * W;
  const ys = [GROUND + 2, 400, 300, 200, TOP];
  const wob = [
    [0, 1.2, -1.1, 0.8, 0],
    [0, -1, 1.3, -0.7, 0],
  ];
  const a = ys.map((y, i) => [XL0 + (GROUND - y) * T + off - 7 + wob[side][i], y]);
  const b = ys.map((y, i) => [XL0 + (GROUND - y) * T + off + 7 - wob[side][i] * 0.6, y]).reverse();
  const seg = (p: number[], q: number[]) => `C ${p[0] + (q[0] - p[0]) / 3} ${p[1] + (q[1] - p[1]) / 3 + 3} ${p[0] + ((q[0] - p[0]) * 2) / 3} ${p[1] + ((q[1] - p[1]) * 2) / 3 - 3} ${q[0]} ${q[1]}`;
  let d = `M ${a[0][0]} ${a[0][1]}`;
  for (let i = 1; i < a.length; i++) d += ` ${seg(a[i - 1], a[i])}`;
  d += ` C ${a[4][0]} ${TOP - 5} ${b[0][0]} ${TOP - 5} ${b[0][0]} ${b[0][1]}`;
  for (let i = 1; i < b.length; i++) d += ` ${seg(b[i - 1], b[i])}`;
  return `${d} C ${b[4][0] - 1} ${GROUND + 6} ${a[0][0] + 1} ${GROUND + 6} ${a[0][0]} ${a[0][1]} Z`;
};

const rung = (y: number, n: number) => {
  const l = lx(y) + 2;
  const r = lx(y) + W - 2;
  const j = [0.8, -0.9, 1.1, -0.6, 0.7][n];
  return `M ${l} ${y - 6 + j} C ${l + 40} ${y - 7} ${r - 40} ${y - 5 + j} ${r} ${y - 6} L ${r} ${y + 5} C ${r - 40} ${y + 6 - j} ${l + 40} ${y + 7} ${l} ${y + 6 - j} Z`;
};

// short wood grain strokes, a few per rail
const GRAIN = [
  [380, 0],
  [296, 1],
  [214, 0],
  [150, 1],
];

export default function RungScene({ step: forced = null, paused }: SceneProps) {
  const { ref, step } = useStory(STEPS, { forced, paused, rest: 3 });
  const at = AT[step];
  const px = at < 0 ? 112 : cx(RUNG_Y[at]);
  const py = at < 0 ? GROUND - 2 : RUNG_Y[at] - 6;
  const say = SAY[step];
  // the numbers Pathfinder has reached are in ink, the rest stay quiet
  const reached = at < 0 ? -1 : at;
  const final = step === 3;

  return (
    <svg ref={ref} className="scene-svg" viewBox="0 0 800 500" role="img" aria-label="Rung. The same small programming language built five times, each with one more speed trick, drawn as a ladder with five rungs. Pathfinder climbs it as each version runs the same test program faster: 1 times, 3.8, 5.7, 8.6, and at the top, 38.8 times faster, measured.">
      <Ink k="ground" d="M 14 478 C 200 474 480 481 786 476" />

      {/* the ladder */}
      {RUNG_Y.map((y, n) => (
        <Ink key={n} k={`rung${n}`} className="sc-fill" d={rung(y, n)} />
      ))}
      <Ink k="railL" className="sc-fill" d={rail(0)} />
      <Ink k="railR" className="sc-fill" d={rail(1)} />
      {GRAIN.map(([y, side], i) => {
        const x = lx(y) + side * W;
        return <Ink key={i} k={`grain${i}`} className="sc-thin" d={`M ${x - 2} ${y} C ${x - 1} ${y + 10} ${x + 2} ${y + 18} ${x} ${y + 30}`} />;
      })}

      {/* what each rung is worth */}
      {RUNG_Y.map((y, n) => {
        const x = lx(y) + W + 24;
        if (n === 4 && final) return null;
        return (
          <text key={n} className={`hand sc-rung${n <= reached ? " on" : ""}`} x={x} y={y + 8}>
            {SPEED[n]}
          </text>
        );
      })}
      {final && (
        <g>
          <text className="hand sc-big" x={lx(RUNG_Y[4]) + W + 26} y={RUNG_Y[4] + 22}>
            38.8×
          </text>
          <Ink k="zoom" className="sc-red" d={`M 586 ${RUNG_Y[4] - 56} C 600 ${RUNG_Y[4] - 66} 622 ${RUNG_Y[4] - 66} 636 ${RUNG_Y[4] - 58} M 664 ${RUNG_Y[4] - 62} L 676 ${RUNG_Y[4] - 76} M 700 ${RUNG_Y[4] - 54} L 718 ${RUNG_Y[4] - 66} M 742 ${RUNG_Y[4] + 2} L 774 ${RUNG_Y[4] - 4} M 746 ${RUNG_Y[4] + 22} L 784 ${RUNG_Y[4] + 22} M 738 ${RUNG_Y[4] + 42} L 768 ${RUNG_Y[4] + 48}`} />
        </g>
      )}

      <Pf pose={POSE[step]} x={px} y={py} size={SIZE} />
      {say.length > 0 && <Bubble k={`say${step}`} cx={step === 0 ? 180 : 190} y={step === 3 ? 30 : step === 0 ? 108 : 150} lines={say} tx={at < 0 ? px + 6 : px - 54} ty={at < 0 ? py - SIZE - 6 : py - SIZE * 0.45} />}
    </svg>
  );
}
