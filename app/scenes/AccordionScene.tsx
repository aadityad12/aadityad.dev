"use client";

import { Bubble, Ink, Pf, useStory, type SceneProps } from "./kit";

/* Accordion: an AI agent can only hold so much at once. Pathfinder plays the accordion. The shelf of
   note cards is what the agent is holding. Squeeze it and the older cards fold into slivers, so
   everything fits; one can be opened again later, nothing lost. Red is the one thing to look at. */

const STEPS = [3200, 3400, 3000, 3600];

const GROUND = 474;
const SIZE = 240;
const S = SIZE / 175;
const PX = 470; // Pathfinder's centre
const SHELF_Y = 172; // top of the plank, where the cards stand
const SHELF_END = 636;
const X0 = 44;
const CW = 56; // card width
const SW = 19; // folded width
const GAP = 8;
const N = 12;

type State = "full" | "sliver" | "need" | "open" | "fall";

const states = (step: number): State[] =>
  Array.from({ length: N }, (_, i) => {
    if (step === 0) return i < 9 ? "full" : "fall";
    if (i < 6) return step === 2 && i === 2 ? "need" : step === 3 && i === 2 ? "open" : "sliver";
    return "full";
  });

// Where each card stands: left edge x, laid out in a row with the folded ones thin.
const layout = (st: State[]) => {
  let x = X0;
  return st.map((s) => {
    if (s === "fall") return 0;
    const left = x;
    x += (s === "sliver" || s === "need" ? SW : CW) + GAP;
    return left;
  });
};

// Fallen cards: where each one pivots (its bottom-left corner) and how far it has tipped.
const FALL: [number, number, number][] = [
  [622, SHELF_Y, 17],
  [672, SHELF_Y + 60, 46],
  [704, SHELF_Y + 134, 68],
];

const SCRIBBLE = [
  "M 10 -74 C 21 -77 33 -72 46 -75 M 10 -57 C 23 -60 35 -55 46 -58 M 10 -40 C 20 -42 29 -39 38 -41 M 10 -23 C 19 -25 25 -22 31 -24",
  "M 10 -74 C 19 -76 29 -73 37 -75 M 10 -57 C 23 -59 35 -56 46 -58 M 10 -40 C 22 -42 33 -39 46 -41 M 10 -23 C 18 -25 24 -22 30 -24",
  "M 10 -72 C 22 -75 34 -70 46 -73 M 10 -53 C 20 -56 31 -51 41 -54 M 10 -34 C 21 -36 31 -33 44 -35",
];

const cardD = (i: number) =>
  `M 8 -95 C 20 -96 36 -96 48 -95 C 53 -95 56 -91 56 -86 C 57 -62 56 -30 56 -9 C 56 -4 53 0 48 0 C 35 1 20 1 8 0 C 3 0 0 -4 0 -9 C -1 -30 0 -62 0 -86 C 0 -91 3 -95 8 -95 Z ${SCRIBBLE[i % 3]}`;

const sliverD = `M 2 -94 C 6 -96 13 -96 17 -94 C 19 -60 19 -30 17 -3 C 13 0 6 0 2 -3 C 0 -30 0 -60 2 -94 Z M 4 -76 L 9.5 -70 L 15 -76 M 4 -58 L 9.5 -52 L 15 -58 M 4 -40 L 9.5 -34 L 15 -40 M 4 -22 L 9.5 -16 L 15 -22`;

const SPREAD = [162, 44, 44, 88];
const SAY: string[][] = [["Too much to hold."], ["Fold what it", "isn't using."], ["Wait, I need", "an old one."], ["Unfold it.", "Nothing lost."]];
const POSE = ["work", "boop-squash", "glance-l", "glance-l"] as const;

export default function AccordionScene({ step: forced = null, paused }: SceneProps) {
  const { ref, step } = useStory(STEPS, { forced, paused, rest: 3 });
  const st = states(step);
  const xs = layout(st);
  const spread = SPREAD[step];
  const say = SAY[step];

  // the accordion, held in front of Pathfinder at belly height
  const bx0 = PX - spread - 46;
  const bx1 = PX + spread;
  const BT = 390;
  const BB = 452;
  const folds = spread > 100 ? 8 : spread > 60 ? 7 : 6;
  const top: string[] = [];
  const bot: string[] = [];
  const pleats: string[] = [];
  for (let i = 0; i <= folds; i++) {
    const x = PX - spread + (2 * spread * i) / folds;
    const dy = i % 2 === 0 ? 0 : 7;
    top.push(`${x} ${400 + dy}`);
    bot.push(`${x} ${442 + dy}`);
    if (i > 0 && i < folds) pleats.push(`M ${x} ${400 + dy} L ${x} ${442 + dy}`);
  }
  const bellows = `M ${top.join(" L ")} L ${[...bot].reverse().join(" L ")} Z ${pleats.join(" ")}`;
  const box = (a: number, b: number) =>
    `M ${a + 9} ${BT + 1} C ${a + 20} ${BT - 1} ${b - 20} ${BT + 1} ${b - 9} ${BT} C ${b - 3} ${BT} ${b} ${BT + 4} ${b} ${BT + 9} C ${b + 1} ${BT + 24} ${b - 1} ${BT + 38} ${b} ${BB - 9} C ${b} ${BB - 3} ${b - 3} ${BB} ${b - 9} ${BB} C ${b - 22} ${BB + 1} ${a + 22} ${BB - 1} ${a + 9} ${BB} C ${a + 3} ${BB} ${a} ${BB - 3} ${a} ${BB - 9} C ${a - 1} ${BB - 28} ${a + 1} ${BT + 24} ${a} ${BT + 9} C ${a} ${BT + 3} ${a + 3} ${BT + 1} ${a + 9} ${BT + 1} Z`;
  const lbox = box(bx0, PX - spread);
  const rbox = box(PX + spread, PX + spread + 46);

  const sh = { x: 48 * S, y: GROUND - 83 * S }; // shoulders: Pathfinder's arms leave his sides here
  const hl = { x: PX - spread - 23, y: BT };
  const hr = { x: PX + spread + 23, y: BT };
  const arm = (sx: number, h: { x: number; y: number }) => `M ${sx} ${sh.y} C ${sx + (h.x - sx) * 0.1} ${sh.y + 14} ${h.x + (sx - h.x) * 0.3} ${h.y - 18} ${h.x} ${h.y - 3}`;

  return (
    <svg ref={ref} className="scene-svg" viewBox="0 0 800 500" role="img" aria-label="Accordion. An AI agent can hold only so much at once, shown as a shelf of note cards with three falling off the end. Pathfinder squeezes an accordion and the older cards fold up thin so everything fits. When the agent needs one, he unfolds it again at full size, so nothing is lost.">
      <Ink k="ground" d="M 14 478 C 200 474 480 481 786 476" />

      {/* the shelf: a plank with the label written along it */}
      <Ink k="plank" className="sc-fill" d={`M ${X0 - 14} ${SHELF_Y + 2} C 200 ${SHELF_Y} 420 ${SHELF_Y + 3} ${SHELF_END} ${SHELF_Y + 1} C ${SHELF_END + 7} ${SHELF_Y + 10} ${SHELF_END + 6} ${SHELF_Y + 24} ${SHELF_END} ${SHELF_Y + 34} C 420 ${SHELF_Y + 36} 200 ${SHELF_Y + 33} ${X0 - 14} ${SHELF_Y + 35} C ${X0 - 21} ${SHELF_Y + 24} ${X0 - 20} ${SHELF_Y + 11} ${X0 - 14} ${SHELF_Y + 2} Z`} />
      <text className="hand sc-shelf-text" x={X0 + 4} y={SHELF_Y + 25}>
        what the AI is holding
      </text>
      <Ink k="brk1" d={`M 74 ${SHELF_Y + 36} C 74 ${SHELF_Y + 50} 73 ${SHELF_Y + 62} 72 ${SHELF_Y + 72} M 72 ${SHELF_Y + 72} C 88 ${SHELF_Y + 66} 100 ${SHELF_Y + 52} 106 ${SHELF_Y + 36}`} />
      <Ink k="brk2" d={`M 552 ${SHELF_Y + 36} C 552 ${SHELF_Y + 50} 551 ${SHELF_Y + 62} 550 ${SHELF_Y + 72} M 550 ${SHELF_Y + 72} C 566 ${SHELF_Y + 66} 578 ${SHELF_Y + 52} 584 ${SHELF_Y + 36}`} />

      {/* the cards */}
      {st.map((s, i) => {
        if (s === "fall") {
          const [px, py, a] = FALL[i - 9];
          return (
            <g key={i} transform={`translate(${px} ${py}) rotate(${a})`}>
              <Ink k={`card${i}-fall`} className="sc-fill sc-red" d={cardD(i)} />
            </g>
          );
        }
        const sliver = s === "sliver" || s === "need";
        return (
          <g key={i} transform={`translate(${xs[i]} ${SHELF_Y})`}>
            <Ink k={`card${i}-${s}`} className={`sc-fill${s === "need" || s === "open" ? " sc-red" : ""}`} d={sliver ? sliverD : cardD(i)} />
          </g>
        );
      })}
      {step === 2 && (
        <g>
          <text className="hand sc-need" x={xs[2] + 10} y="40" textAnchor="middle">
            need this
          </text>
          <Ink k="needarrow" className="sc-red" d={`M ${xs[2] + 6} 50 C ${xs[2] + 13} 58 ${xs[2] + 7} 68 ${xs[2] + 10} 76 M ${xs[2] + 10} 76 L ${xs[2] + 3} 68 M ${xs[2] + 10} 76 L ${xs[2] + 17} 67`} />
        </g>
      )}

      {/* Pathfinder and the accordion */}
      <g className="sc-noarms">
        <Pf pose={POSE[step]} x={PX} y={GROUND} size={SIZE} />
      </g>
      <Ink k={`bellows${step}`} className="sc-fill" d={bellows} />
      <Ink k={`lbox${step}`} className="sc-fill" d={lbox} />
      <Ink k={`rbox${step}`} className="sc-fill" d={rbox} />
      {[0, 1, 2].map((j) => (
        <circle key={`l${j}`} className="sc-key" cx={bx0 + 16} cy={BT + 14 + j * 15} r="3.6" />
      ))}
      {[0, 1, 2, 3].map((j) => (
        <circle key={`r${j}`} className="sc-key" cx={PX + spread + 30} cy={BT + 11 + j * 13} r="3.4" />
      ))}
      <Ink k={`armL${step}`} d={arm(PX - sh.x, hl)} />
      <Ink k={`armR${step}`} d={arm(PX + sh.x, hr)} />

      {/* the squeeze, and the words */}
      {step === 1 && <Ink k="squeeze" className="sc-red" d={`M ${bx0 - 70} 402 C ${bx0 - 52} 392 ${bx0 - 28} 396 ${bx0 - 14} 414 M ${bx0 - 14} 414 L ${bx0 - 17} 400 M ${bx0 - 14} 414 L ${bx0 - 28} 411 M ${PX + spread + 116} 402 C ${PX + spread + 98} 392 ${PX + spread + 74} 396 ${PX + spread + 60} 414 M ${PX + spread + 60} 414 L ${PX + spread + 63} 400 M ${PX + spread + 60} 414 L ${PX + spread + 74} 411`} />}
      {say.length > 0 && <Bubble k={`say${step}`} cx={say.length === 1 ? 278 : 290} y={say.length === 1 ? 266 : 244} lines={say} tx={408} ty={344} />}
    </svg>
  );
}
