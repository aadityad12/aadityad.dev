"use client";

import { Bubble, Ink, Pf, useStory, type SceneProps } from "./kit";

/* ApexTracker: the offline app that replaced a desk of notes, reminders, a calendar and a budget
   sheet. The phone checks off the day, and each kept day fills a square. */

const STEPS = [3400, 3000, 3600, 3400];
const GROUND = 458;

const SAY: (string[] | null)[] = [
  ["Notes, reminders, budget,", "all over the place."],
  ["One app instead."],
  ["Every day", "gets a score."],
  ["Still running", "my days."],
];

const CELL = 22;
const GAP = 5;
const STEP = CELL + GAP;

// Phone on the clear desk. Screen content is inset from this box.
const PH = { x: 132, y: 22, w: 236, h: 378 };
const OX = PH.x + 22;
const OY = PH.y + 62;
const GX = OX + 6;
const GY = OY + 124;
const TODAY = { x: GX + 6 * STEP + CELL / 2, y: GY + 4 * STEP + CELL / 2 };

const HEAT: (number | "today")[][] = [
  [0.4, 0.82, 0.33, 0.9, 0.55, 0.72, 0.28],
  [0.7, 0.36, 0.86, 0.48, 0.74, 0.42, 0.64],
  [0.32, 0.78, 0.58, 0.94, 0.4, 0.68, 0.3],
  [0.76, 0.44, 0.66, 0.34, 0.88, 0.52, 0.7],
  [0.46, 0.8, 0.38, 0.72, 0.56, 0.84, "today"],
];

function sheet(w: number, h: number): string {
  return `M 12 6 C ${w * 0.36} 1 ${w * 0.68} 5 ${w - 16} 8 C ${w - 5} 11 ${w + 2} 20 ${w - 1} 30 C ${w + 2} ${h * 0.46} ${w - 3} ${h * 0.74} ${w - 6} ${h - 22} C ${w - 8} ${h - 8} ${w - 20} ${h + 2} ${w - 32} ${h - 1} C ${w * 0.52} ${h + 3} ${w * 0.28} ${h - 2} 22 ${h - 2} C 9 ${h - 2} 1 ${h - 12} 3 ${h - 26} C 0 ${h * 0.55} 5 ${h * 0.32} 4 28 C 3 16 6 9 12 6 Z`;
}

function disk(cx: number, cy: number, r: number): string {
  const k = r * 0.55;
  return `M ${cx} ${cy - r} C ${cx + k + 1} ${cy - r - 1} ${cx + r + 1} ${cy - k} ${cx + r} ${cy + 1} C ${cx + r + 1} ${cy + k + 1} ${cx + k} ${cy + r + 1} ${cx - 1} ${cy + r} C ${cx - k - 1} ${cy + r} ${cx - r - 1} ${cy + k} ${cx - r} ${cy - 1} C ${cx - r} ${cy - k - 1} ${cx - k} ${cy - r + 1} ${cx} ${cy - r} Z`;
}

function ruled(x: number, y: number, w: number, h: number, cols: number, rows: number): string {
  const parts: string[] = [];
  for (let c = 1; c < cols; c++) {
    const vx = x + (w * c) / cols;
    const bow = c % 2 === 0 ? 1.5 : -1.2;
    parts.push(`M ${vx + bow} ${y} C ${vx - bow} ${y + h * 0.38} ${vx + bow} ${y + h * 0.7} ${vx - bow * 0.4} ${y + h}`);
  }
  for (let r = 1; r < rows; r++) {
    const hy = y + (h * r) / rows;
    const bow = r % 2 === 0 ? 1.2 : -1;
    parts.push(`M ${x} ${hy + bow} C ${x + w * 0.4} ${hy - bow} ${x + w * 0.72} ${hy + bow} ${x + w} ${hy - bow * 0.3}`);
  }
  return parts.join(" ");
}

function squiggle(x: number, y: number, w: number, n: number, seed: number): string {
  return Array.from({ length: n }, (_, i) => {
    const yy = y + i * 15;
    const j = ((seed + i * 3) % 5) - 2;
    return `M ${x} ${yy + j} C ${x + w * 0.3} ${yy - 2} ${x + w * 0.62} ${yy + 2} ${x + w} ${yy + j * 0.4}`;
  }).join(" ");
}

function blob(x: number, y: number, s: number, n: number): string {
  const a = ((n * 13) % 5) - 2;
  const b = ((n * 7) % 5) - 2;
  return `M ${x + 1.4} ${y + a * 0.3} C ${x + s * 0.4} ${y - 1} ${x + s * 0.7} ${y + 1} ${x + s - 1} ${y + b * 0.3} C ${x + s + 0.6} ${y + s * 0.4} ${x + s - 0.4} ${y + s * 0.72} ${x + s - 1.2} ${y + s - 1} C ${x + s * 0.58} ${y + s + 0.8} ${x + s * 0.3} ${y + s - 0.2} ${x + 1.2} ${y + s - 1} C ${x - 0.6} ${y + s * 0.58} ${x + 0.4} ${y + s * 0.28} ${x + 1.4} ${y + a * 0.3} Z`;
}

function phonePath(x: number, y: number, w: number, h: number): string {
  const r = 26;
  return `M ${x + r} ${y + 2} C ${x + w * 0.38} ${y - 1} ${x + w * 0.66} ${y + 3} ${x + w - r} ${y + 1} C ${x + w - 8} ${y + 2} ${x + w + 1} ${y + 14} ${x + w} ${y + r} C ${x + w + 2} ${y + h * 0.42} ${x + w - 1} ${y + h * 0.7} ${x + w - 1} ${y + h - r} C ${x + w - 1} ${y + h - 10} ${x + w - 14} ${y + h + 2} ${x + w - r} ${y + h} C ${x + w * 0.58} ${y + h + 2} ${x + w * 0.34} ${y + h - 1} ${x + r + 2} ${y + h - 1} C ${x + 12} ${y + h - 1} ${x - 1} ${y + h - 14} ${x + 1} ${y + h - r} C ${x - 1} ${y + h * 0.6} ${x + 2} ${y + h * 0.32} ${x + 1} ${y + r} C ${x + 1} ${y + 12} ${x + 10} ${y + 1} ${x + r} ${y + 2} Z`;
}

function Desk() {
  return (
    <g>
      <Ink k="legL" d="M 92 336 C 86 378 94 418 80 458" />
      <Ink k="legR" d="M 456 338 C 464 380 452 420 466 458" />
      <Ink k="top" className="sc-fill" d="M 36 308 C 160 302 340 304 512 312 C 526 315 532 326 526 336 C 390 344 170 342 46 336 C 30 333 26 320 36 308 Z" />
      <Ink k="draw" className="sc-fill" d="M 156 334 C 230 332 330 333 392 336 C 398 354 396 388 388 398 C 300 404 210 402 160 396 C 148 382 150 348 156 334 Z" />
      <circle className="sc-key" cx="274" cy="366" r="4.5" />
    </g>
  );
}

function Clock({ k, x, y, s = 1, rings = false, rot = 0 }: { k: string; x: number; y: number; s?: number; rings?: boolean; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <Ink k={`${k}bl`} className="sc-fill" d={disk(48, 58, 28)} />
      <Ink k={`${k}br`} className="sc-fill" d={disk(112, 56, 28)} />
      <Ink k={`${k}ham`} d="M 72 36 C 80 24 98 24 106 38" />
      <Ink k={`${k}body`} className="sc-fill" d={disk(80, 148, 70)} />
      <Ink k={`${k}face`} d={disk(80, 146, 46)} />
      <Ink k={`${k}ticks`} d="M 80 108 L 80 116 M 118 146 L 110 146 M 80 184 L 80 176 M 42 146 L 50 146" />
      <Ink k={`${k}hands`} d="M 80 146 C 78 132 79 120 76 110 M 80 146 C 92 150 104 158 114 166" />
      <Ink k={`${k}feet`} d="M 52 210 C 44 224 46 236 36 242 M 108 210 C 116 224 114 236 126 242" />
      {rings && (
        <Ink
          k={`${k}ring`}
          className="sc-red"
          d="M 6 118 C -16 98 -14 66 8 50 M -10 142 C -42 114 -38 62 -6 36 M 154 116 C 176 96 174 64 152 48 M 168 140 C 200 112 196 60 162 34"
        />
      )}
    </g>
  );
}

function Paper({ k, x, y, w, h, rot, word, kind }: { k: string; x: number; y: number; w: number; h: number; rot: number; word?: string; kind: "note" | "cal" | "sheet" }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <Ink k={k} className="sc-fill" d={sheet(w, h)} />
      {kind === "cal" && (
        <g>
          <circle className="sc-key" cx={w / 2} cy={14} r="3.4" />
          <text className="hand sc-word" x={w / 2} y={40} textAnchor="middle">March</text>
          <Ink k={`${k}r`} d={`M 14 52 C ${w * 0.4} 49 ${w * 0.7} 51 ${w - 14} 54`} />
          <Ink k={`${k}g`} className="sc-thin" d={ruled(14, 62, w - 28, h - 76, 7, 4)} />
        </g>
      )}
      {kind === "sheet" && (
        <g>
          <text className="hand sc-word" x="14" y="30">budget</text>
          <Ink k={`${k}g`} className="sc-thin" d={ruled(12, 42, w - 26, h - 56, 3, 4)} />
          <text className="hand sc-note" x="18" y="64">rent</text>
          <text className="hand sc-note" x="18" y="86">food</text>
          <text className="hand sc-note" x={w - 62} y="64">640</text>
          <text className="hand sc-note" x={w - 62} y="86">180</text>
        </g>
      )}
      {kind === "note" && word && (
        <g>
          <text className="hand sc-word" x="12" y="32">{word}</text>
          <Ink k={`${k}s`} className="sc-thin" d={squiggle(12, 48, w - 28, 3, w)} />
        </g>
      )}
    </g>
  );
}

function TrackerFace() {
  const rows = [
    { t: "Study 2h", y: OY },
    { t: "Budget", y: OY + 40 },
    { t: "Read a paper", y: OY + 80 },
  ];
  let n = 0;
  return (
    <g>
      {rows.map((row) => (
        <g key={row.t}>
          <Ink k={`box${row.t}`} d={`M ${OX + 2} ${row.y + 2} C ${OX + 12} ${row.y} ${OX + 20} ${row.y + 2} ${OX + 24} ${row.y + 4} C ${OX + 26} ${row.y + 14} ${OX + 24} ${row.y + 22} ${OX + 20} ${row.y + 25} C ${OX + 12} ${row.y + 26} ${OX + 5} ${row.y + 24} ${OX + 2} ${row.y + 20} C ${OX} ${row.y + 12} ${OX + 1} ${row.y + 6} ${OX + 2} ${row.y + 2} Z`} />
          <Ink k={`tick${row.t}`} d={`M ${OX + 6} ${row.y + 14} C ${OX + 10} ${row.y + 19} ${OX + 13} ${row.y + 20} ${OX + 15} ${row.y + 15} C ${OX + 18} ${row.y + 8} ${OX + 22} ${row.y + 2} ${OX + 28} ${row.y - 4}`} />
          <text className="hand sc-app" x={OX + 36} y={row.y + 20}>{row.t}</text>
        </g>
      ))}
      <Ink k="scoreline" className="sc-thin" d={`M ${OX} ${GY - 14} C ${OX + 70} ${GY - 17} ${OX + 130} ${GY - 12} ${OX + 184} ${GY - 15}`} />
      {HEAT.map((row, r) =>
        row.map((v, c) => {
          const i = n++;
          const x = GX + c * STEP;
          const y = GY + r * STEP;
          if (v === 0) return <Ink key={i} k={`e${i}`} className="sc-thin" d={blob(x, y, CELL - 3, i)} />;
          const today = v === "today";
          return <path key={i} className={today ? "sc-today" : "sc-day"} opacity={today ? 1 : v} d={blob(x, y, CELL - 3, i)} />;
        }),
      )}
    </g>
  );
}

export default function ApexScene({ step: forced = null, paused }: SceneProps) {
  const { ref, step } = useStory(STEPS, { forced, paused, rest: 3 });
  const say = SAY[step];
  const showApp = step >= 2;
  const held = step === 1;

  const pfx = step === 0 ? 688 : step === 1 ? 640 : step === 2 ? 590 : 668;
  const pfs = 232;
  const pose = step === 0 ? "startle" : step === 1 ? "glance-l" : step === 2 ? "glance-l" : "wave-b";
  const sc = pfs / 175;
  const shoulder = { x: pfx + (72 - 120) * sc, y: GROUND - (213 - 130) * sc };

  const handPhone = { x: 336, y: 118, w: 118, h: 172 };
  const grip = { x: handPhone.x + handPhone.w - 4, y: handPhone.y + 108 };

  return (
    <svg ref={ref} className="scene-svg" viewBox="0 0 800 500" role="img" aria-label="ApexTracker. Pathfinder's desk is covered in notes, a calendar, a budget sheet and a ringing alarm. One phone takes their place, checks off the day, and scores each day he keeps. He is still using it.">
      <Ink k="ground" d={`M 16 ${GROUND} C 220 ${GROUND - 5} 540 ${GROUND + 4} 784 ${GROUND - 2}`} />
      {step !== 1 && <Desk />}

      {step === 0 && (
        <g>
          <Paper k="cal" x={22} y={16} w={200} h={162} rot={-2} kind="cal" />
          <Paper k="bud" x={26} y={186} w={184} h={132} rot={-4} kind="sheet" />
          <Paper k="n2" x={228} y={28} w={128} h={92} rot={3} kind="note" word="quiz Fri" />
          <Paper k="n3" x={206} y={132} w={112} h={82} rot={-5} kind="note" word="rent" />
          <Paper k="n1" x={214} y={248} w={132} h={96} rot={6} kind="note" word="call mom" />
          <Clock k="clk" x={392} y={176} s={0.86} rings />
        </g>
      )}

      {step === 1 && (
        <g>
          <Paper k="bud1" x={18} y={78} w={168} h={112} rot={-16} kind="sheet" />
          <Paper k="n4" x={36} y={214} w={120} h={92} rot={12} kind="note" word="rent due" />
          <Paper k="cal1" x={24} y={328} w={156} h={112} rot={-10} kind="cal" />
          <Clock k="clk1" x={168} y={186} s={0.55} rot={16} rings />
          <Ink k="fly" d="M 292 132 C 312 124 328 132 342 122 M 286 158 C 310 150 326 160 346 148 M 278 186 C 304 178 322 188 344 176 M 270 214 C 296 206 314 216 338 204" />
        </g>
      )}

      {showApp && (
        <g>
          <Ink k="phone" className="sc-fill" d={phonePath(PH.x, PH.y, PH.w, PH.h)} />
          <Ink k="side" d={`M ${PH.x + PH.w - 1} ${PH.y + 86} C ${PH.x + PH.w + 8} ${PH.y + 88} ${PH.x + PH.w + 8} ${PH.y + 118} ${PH.x + PH.w - 1} ${PH.y + 120}`} />
          <circle className="sc-lens" cx={PH.x + PH.w / 2} cy={PH.y + 30} r="6.5" />
          <TrackerFace />
        </g>
      )}

      {held && (
        <g>
          <Ink k="phone1" className="sc-fill" d={phonePath(handPhone.x, handPhone.y, handPhone.w, handPhone.h)} />
          <circle className="sc-lens" cx={handPhone.x + handPhone.w / 2} cy={handPhone.y + 26} r="5" />
          <Ink k="side1" d={`M ${handPhone.x + handPhone.w} ${handPhone.y + 64} C ${handPhone.x + handPhone.w + 7} ${handPhone.y + 66} ${handPhone.x + handPhone.w + 7} ${handPhone.y + 88} ${handPhone.x + handPhone.w} ${handPhone.y + 90}`} />
        </g>
      )}

      {step === 3 && (
        <g transform="translate(392 108) rotate(-3)">
          <Ink k="daily" className="sc-fill" d={sheet(196, 92)} />
          <text className="hand sc-word" x="16" y="36">used daily</text>
          <text className="hand sc-word" x="16" y="66">since January</text>
        </g>
      )}
      {step === 3 && (
        <Ink k="toGrid" d={`M 404 196 C 390 230 ${TODAY.x + 36} ${TODAY.y - 16} ${TODAY.x + 14} ${TODAY.y} M ${TODAY.x + 14} ${TODAY.y} L ${TODAY.x + 26} ${TODAY.y - 9} M ${TODAY.x + 14} ${TODAY.y} L ${TODAY.x + 24} ${TODAY.y + 8}`} />
      )}

      <g className={held ? "sc-hide-l" : undefined}>
        <Pf pose={pose} x={pfx} y={GROUND} size={pfs} />
      </g>
      {held && (
        <g>
          <Ink k="hold" d={`M ${shoulder.x} ${shoulder.y} C ${shoulder.x - 20} ${shoulder.y - 46} ${grip.x + 28} ${grip.y + 34} ${grip.x} ${grip.y}`} />
          <Ink k="palm" className="sc-fill" d={`M ${grip.x + 4} ${grip.y - 18} C ${grip.x - 20} ${grip.y - 10} ${grip.x - 22} ${grip.y + 18} ${grip.x - 2} ${grip.y + 22} C ${grip.x + 12} ${grip.y + 16} ${grip.x + 10} ${grip.y - 6} ${grip.x + 4} ${grip.y - 18} Z`} />
        </g>
      )}

      {say && (
        <Bubble
          k={`say${step}`}
          cx={step === 1 ? 250 : step === 0 ? 575 : 640}
          y={14}
          lines={say}
          tx={step === 1 ? handPhone.x + 40 : pfx - 16}
          ty={step === 1 ? handPhone.y + 8 : GROUND - pfs + 28}
        />
      )}
    </svg>
  );
}
