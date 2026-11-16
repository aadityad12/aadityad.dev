"use client";

import { Bubble, Ink, Pf, useStory, type SceneProps } from "./kit";

/* OSS Scout: every night it looks through bug notes, writes one tested fix, and stops at a gate.
   Nothing reaches GitHub until he presses the button himself. */

const STEPS = [3400, 3200, 3600, 3400];
const GROUND = 458;

const SAY: string[][] = [
  ["Every night it looks", "for bugs worth fixing."],
  ["It writes a fix", "and tests it."],
  ["It can't post.", "Only I can."],
  ["One tap from me,", "and it's sent."],
];

const BUGS = ["crash", "typo", "blank", "slow", "stuck", "wrong", "fails", "broken"];

function sheet(w: number, h: number): string {
  return `M 10 5 C ${w * 0.38} 1 ${w * 0.7} 4 ${w - 12} 7 C ${w - 4} 10 ${w + 1} 18 ${w - 1} 26 C ${w + 1} ${h * 0.46} ${w - 2} ${h * 0.72} ${w - 4} ${h - 16} C ${w - 6} ${h - 6} ${w - 16} ${h + 1} ${w - 26} ${h - 1} C ${w * 0.55} ${h + 2} ${w * 0.3} ${h - 1} 18 ${h - 1} C 8 ${h - 1} 1 ${h - 10} 2 ${h - 18} C 0 ${h * 0.58} 4 ${h * 0.32} 3 22 C 2 12 5 7 10 5 Z`;
}

function disk(cx: number, cy: number, r: number): string {
  const k = r * 0.55;
  return `M ${cx} ${cy - r} C ${cx + k + 1} ${cy - r - 1} ${cx + r} ${cy - k} ${cx + r - 1} ${cy + 1} C ${cx + r} ${cy + k + 1} ${cx + k} ${cy + r + 1} ${cx} ${cy + r - 1} C ${cx - k - 1} ${cy + r} ${cx - r - 1} ${cy + k} ${cx - r} ${cy} C ${cx - r} ${cy - k - 1} ${cx - k} ${cy - r} ${cx} ${cy - r} Z`;
}

function Night({ morning = false }: { morning?: boolean }) {
  return morning ? (
    <g>
      <Ink k="sun" className="sc-fill" d={disk(62, 58, 20)} />
      <Ink k="rays" d="M 62 30 C 63 22 61 16 62 10 M 82 40 C 92 34 100 30 108 24 M 86 64 C 96 68 104 74 112 78 M 78 78 C 82 88 84 96 80 106 M 46 80 C 40 90 34 98 28 104 M 38 60 C 28 64 20 66 12 64 M 40 40 C 32 32 26 26 18 20 M 62 34 C 70 26 74 20 78 14" />
    </g>
  ) : (
    <g>
      <Ink k="moon" className="sc-fill" d="M 86 18 C 54 30 46 68 60 100 C 72 124 104 136 126 122 C 98 130 72 112 66 84 C 60 56 78 34 110 28 C 100 20 92 16 86 18 Z" />
      {[
        [168, 30],
        [214, 52],
        [156, 78],
        [250, 26],
        [198, 86],
      ].map(([x, y], i) => (
        <Ink key={i} k={`star${i}`} d={`M ${x} ${y - 8} C ${x + 1} ${y - 3} ${x - 1} ${y + 3} ${x} ${y + 8} M ${x - 8} ${y} C ${x - 3} ${y + 1} ${x + 3} ${y - 1} ${x + 8} ${y} M ${x - 6} ${y - 6} C ${x - 2} ${y - 2} ${x + 2} ${y + 2} ${x + 6} ${y + 6} M ${x + 6} ${y - 6} C ${x + 2} ${y - 2} ${x - 2} ${y + 2} ${x - 6} ${y + 6}`} />
      ))}
    </g>
  );
}

function Board({ k, notes, nw = 104, nh = 76, mark = -1 }: { k: string; notes: { x: number; y: number; r: number; w: string }[]; nw?: number; nh?: number; mark?: number }) {
  const minX = Math.min(...notes.map((n) => n.x)) - 18;
  const minY = Math.min(...notes.map((n) => n.y)) - 24;
  const maxX = Math.max(...notes.map((n) => n.x)) + nw + 16;
  const maxY = Math.max(...notes.map((n) => n.y)) + nh + 18;
  return (
    <g>
      <Ink k={`${k}board`} className="sc-fill" d={`M ${minX} ${minY} C ${(minX + maxX) / 2} ${minY - 4} ${maxX - 40} ${minY + 2} ${maxX} ${minY + 6} C ${maxX + 4} ${(minY + maxY) / 2} ${maxX - 2} ${maxY - 30} ${maxX - 4} ${maxY} C ${(minX + maxX) / 2} ${maxY + 4} ${minX + 40} ${maxY - 2} ${minX + 6} ${maxY - 2} C ${minX - 2} ${(minY + maxY) / 2} ${minX + 2} ${minY + 30} ${minX} ${minY} Z`} />
      {mark >= 0 && <Ink k={`${k}pick`} className="sc-red" d={disk(notes[mark].x + nw / 2, notes[mark].y + nh / 2, Math.max(nw, nh) * 0.62)} />}
      {notes.map((n, i) => (
        <g key={i} transform={`translate(${n.x} ${n.y}) rotate(${n.r})`}>
          <Ink k={`${k}n${i}`} className="sc-fill" d={sheet(nw, nh)} />
          <circle className="sc-key" cx={nw / 2} cy={12} r="3.2" />
          <text className="hand sc-app" x={nw / 2} y={nh * 0.58} textAnchor="middle">{n.w}</text>
        </g>
      ))}
    </g>
  );
}

const BOARD = [
  { x: 36, y: 148, r: -4, w: BUGS[0] },
  { x: 150, y: 140, r: 3, w: BUGS[1] },
  { x: 264, y: 150, r: -3, w: BUGS[2] },
  { x: 376, y: 142, r: 5, w: BUGS[3] },
  { x: 48, y: 252, r: 4, w: BUGS[4] },
  { x: 164, y: 260, r: -5, w: BUGS[5] },
  { x: 278, y: 254, r: 2, w: BUGS[6] },
  { x: 390, y: 262, r: -3, w: BUGS[7] },
];

function Lantern({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Ink k="lhan" d="M 26 30 C 20 8 64 6 60 30" />
      <Ink k="lcap" className="sc-fill" d="M 14 30 C 30 26 56 26 72 32 C 70 42 16 42 14 30 Z" />
      <Ink k="lglass" className="sc-fill" d="M 18 44 C 16 64 18 96 22 112 C 36 118 58 118 70 110 C 76 96 74 62 70 44 C 56 38 30 38 18 44 Z" />
      <Ink k="lbars" d="M 36 46 C 34 70 36 96 34 112 M 52 46 C 54 72 52 96 54 112" />
      <Ink k="lbase" className="sc-fill" d="M 12 108 C 30 118 60 118 80 108 C 74 126 18 126 12 108 Z" />
      <Ink k="lflame" d="M 46 92 C 38 82 40 66 48 60 C 54 68 56 82 48 92 C 44 86 42 78 46 92 Z" />
      <Ink k="lglow" className="sc-red" d="M 2 66 C -10 54 -8 36 6 28 M 0 90 C -14 80 -10 58 2 46 M 84 64 C 98 52 96 34 82 26 M 86 92 C 102 80 98 56 84 44 M 46 26 C 47 16 45 8 46 2 M 24 48 C 14 40 8 34 2 28 M 68 48 C 80 38 86 32 94 24" />
    </g>
  );
}

function FixSheet({ x, y, k }: { x: number; y: number; k: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-3)`}>
      <Ink k={k} className="sc-fill" d={sheet(150, 112)} />
      <text className="hand sc-word" x="16" y="36">fix</text>
      <Ink k={`${k}lines`} className="sc-thin" d="M 16 52 C 50 48 80 54 120 50 M 16 70 C 46 66 78 72 110 68 M 16 88 C 40 84 70 90 96 86" />
      <Ink k={`${k}ok`} d="M 108 78 C 114 86 118 90 122 86 C 128 74 134 64 142 54" />
    </g>
  );
}

function House() {
  return (
    <g>
      <text className="hand sc-word" x="690" y="168" textAnchor="middle">GitHub</text>
      <Ink k="roof" className="sc-fill" d="M 604 214 C 650 168 742 166 786 216 C 760 200 670 198 624 220 Z" />
      <Ink k="walls" className="sc-fill" d="M 622 216 C 670 210 740 212 770 218 C 776 300 774 390 768 456 C 700 462 650 460 626 454 C 616 370 618 280 622 216 Z" />
      <Ink k="door" d="M 676 456 C 674 400 678 366 682 354 C 700 348 720 350 726 360 C 730 400 728 430 730 456" />
      <Ink k="win" d="M 640 268 C 658 264 676 268 678 288 C 674 308 656 312 640 306 C 632 292 632 276 640 268 Z M 658 268 L 658 308 M 640 288 L 678 288" />
    </g>
  );
}

function Gate({ open }: { open: boolean }) {
  return open ? (
    <g>
      <Ink k="postA" d="M 360 168 C 356 260 364 370 358 458" />
      <Ink k="door" className="sc-fill" d="M 300 176 C 328 170 352 174 358 184 C 354 260 356 340 352 430 C 330 438 308 434 300 424 C 294 340 296 250 300 176 Z" />
      <Ink k="doorrail" d="M 308 230 C 330 226 348 230 356 234 M 306 310 C 332 306 350 310 356 314 M 308 210 C 332 280 340 340 352 410" />
      <Ink k="btn3" className="sc-fill sc-red" d={disk(330, 292, 34)} />
      <text className="hand sc-app" x="330" y="298" textAnchor="middle">my tap</text>
      <Ink k="press" className="sc-red" d="M 330 246 C 332 232 328 220 330 208 M 286 270 C 270 262 258 260 244 254 M 288 322 C 272 332 260 340 246 348 M 372 268 C 388 258 400 254 414 248 M 374 318 C 390 328 404 336 418 344" />
    </g>
  ) : (
    <g>
      <Ink k="postL" d="M 392 156 C 388 250 396 360 390 458" />
      <Ink k="postR" d="M 508 152 C 512 260 504 370 510 458" />
      <Ink k="railA" d="M 388 214 C 430 208 470 212 514 218" />
      <Ink k="railB" d="M 390 300 C 440 294 476 298 512 306" />
      <Ink k="railC" d="M 390 378 C 436 372 478 376 512 384" />
      <Ink k="brace" d="M 400 196 C 440 260 470 320 502 390" />
      <Ink k="btn2" className="sc-fill sc-red" d={disk(450, 292, 46)} />
      <text className="hand sc-word" x="450" y="300" textAnchor="middle">my tap</text>
    </g>
  );
}

export default function ScoutScene({ step: forced = null, paused }: SceneProps) {
  const { ref, step } = useStory(STEPS, { forced, paused, rest: 3 });
  const say = SAY[step];
  const night = step < 3;

  const pose = step === 0 ? "walk-a" : step === 1 ? "work" : step === 2 ? "point-stand" : "wave-b";
  const pfx = step === 0 ? 708 : step === 1 ? 636 : step === 2 ? 156 : 128;
  const pfs = step === 1 ? 220 : 214;
  const flip = step === 2;
  const sc = pfs / 175;
  const sign = flip ? -1 : 1;
  const shoulder = { x: pfx + sign * (72 - 120) * sc, y: GROUND - (213 - 130) * sc };
  const grip = { x: 590, y: 286 };

  return (
    <svg ref={ref} className="scene-svg" viewBox="0 0 800 500" role="img" aria-label="OSS Scout. At night Pathfinder searches a board of bug notes with a lantern, circles one, and writes a tested fix. A gate blocks the way to GitHub until he presses the button, and in the morning the fix is sent.">
      <Night morning={!night} />
      <Ink k="ground" d={`M 16 ${GROUND} C 220 ${GROUND - 4} 520 ${GROUND + 4} 784 ${GROUND - 2}`} />

      {step === 0 && (
        <g>
          <Board k="b0" notes={BOARD} />
          <Lantern x={548} y={236} />
        </g>
      )}

      {step === 1 && (
        <g>
          <Board
            k="b1"
            mark={0}
            nw={86}
            nh={62}
            notes={[
              { x: 22, y: 156, r: -3, w: BUGS[0] },
              { x: 118, y: 150, r: 2, w: BUGS[1] },
              { x: 214, y: 158, r: -2, w: BUGS[2] },
              { x: 308, y: 150, r: 4, w: BUGS[3] },
              { x: 28, y: 232, r: 3, w: BUGS[4] },
              { x: 124, y: 238, r: -4, w: BUGS[5] },
              { x: 220, y: 232, r: 2, w: BUGS[6] },
              { x: 314, y: 236, r: -3, w: BUGS[7] },
            ]}
          />
          <Ink k="bench" className="sc-fill" d="M 430 400 C 540 394 680 396 772 402 C 780 406 782 416 772 424 C 620 432 500 430 438 422 C 418 418 416 408 430 400 Z" />
          <Ink k="blegL" d="M 468 422 C 462 440 468 452 458 458" />
          <Ink k="blegR" d="M 740 422 C 746 440 738 452 750 458" />
          <FixSheet k="fix1" x={400} y={296} />
        </g>
      )}

      {(step === 2 || step === 3) && (
        <g>
          <House />
          <Gate open={step === 3} />
          <FixSheet k={step === 2 ? "fix2" : "fix3"} x={step === 2 ? 262 : 618} y={step === 2 ? 366 : 310} />
        </g>
      )}

      <g className={step === 0 ? "sc-hide-l" : step === 1 ? "sc-hide-r" : undefined}>
        <Pf pose={pose} x={pfx} y={GROUND} size={pfs} flip={flip} />
      </g>
      {step === 0 && (
        <Ink k="holdL" d={`M ${shoulder.x} ${shoulder.y} C ${shoulder.x - 30} ${shoulder.y - 20} ${grip.x + 30} ${grip.y + 24} ${grip.x} ${grip.y}`} />
      )}
      {step === 1 && (
        <g>
          <Ink k="wrenArm" d={`M ${pfx + 52} ${GROUND - 100} C ${pfx + 78} ${GROUND - 78} ${pfx + 96} ${GROUND - 52} ${pfx + 112} ${GROUND - 36}`} />
          <Ink k="wrench" d={`M ${pfx + 106} ${GROUND - 42} C ${pfx + 122} ${GROUND - 58} ${pfx + 140} ${GROUND - 52} ${pfx + 134} ${GROUND - 36} C ${pfx + 144} ${GROUND - 30} ${pfx + 132} ${GROUND - 16} ${pfx + 118} ${GROUND - 24} M ${pfx + 134} ${GROUND - 36} C ${pfx + 148} ${GROUND - 44} ${pfx + 154} ${GROUND - 30} ${pfx + 140} ${GROUND - 22}`} />
        </g>
      )}

      <Bubble k={`say${step}`} cx={step === 0 ? 590 : step === 1 ? 640 : step === 2 ? 250 : 230} y={16} lines={say} tx={pfx + (flip ? 30 : -10)} ty={GROUND - pfs + 30} />
    </svg>
  );
}
