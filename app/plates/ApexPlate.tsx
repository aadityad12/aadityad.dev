"use client";

import { PlateFrame } from "./PlateFrame";

// Four previously pale cells per tool resolve into the source drawing's score.
const litCells = [0, 5, 9, 12, 18, 25, 29, 34, 35, 40, 44, 51, 57, 60, 64, 69];
const cells = Array.from({ length: 70 }, (_, index) => {
  const row = Math.floor(index / 7);
  const col = index % 7;
  const slot = litCells.indexOf(index);
  const fill = (row + 2 * col) % 5 < 2 && slot === -1 ? "var(--paper)" : "var(--hair)";
  return { x: 570 + col * 21.5, y: 119 + row * 24, fill, beat: slot < 0 ? undefined : Math.floor(slot / 4) };
});

export default function ApexPlate({ playing }: { playing: boolean }) {
  return (
    <PlateFrame name="apextracker" playing={playing}>
      <g data-part="feed" data-beat="0">
        <path data-part="feed-line" pathLength="1" strokeDasharray="1" d="M435 114 C473 114 480 170 532 183" strokeWidth="1.05" />
        <g data-part="feed-head">
          <g transform="translate(532 183) rotate(14)">
            <path d="M-7 -2.8 0 0 -7 2.8" strokeWidth="1.15" />
          </g>
        </g>
      </g>
      <g data-part="feed" data-beat="1">
        <path data-part="feed-line" pathLength="1" strokeDasharray="1" d="M256 202 C367 199 447 211 532 220" strokeWidth="1.05" />
        <g data-part="feed-head">
          <g transform="translate(532 220) rotate(6)">
            <path d="M-7 -2.8 0 0 -7 2.8" strokeWidth="1.15" />
          </g>
        </g>
      </g>
      <g data-part="feed" data-beat="2">
        <path data-part="feed-line" pathLength="1" strokeDasharray="1" d="M234 314 C359 314 436 268 532 263" strokeWidth="1.05" />
        <g data-part="feed-head">
          <g transform="translate(532 263) rotate(-3)">
            <path d="M-7 -2.8 0 0 -7 2.8" strokeWidth="1.15" />
          </g>
        </g>
      </g>
      <g data-part="feed" data-beat="3">
        <path data-part="feed-line" pathLength="1" strokeDasharray="1" d="M429 374 C483 374 488 318 532 310" strokeWidth="1.05" />
        <g data-part="feed-head">
          <g transform="translate(532 310) rotate(-11)">
            <path d="M-7 -2.8 0 0 -7 2.8" strokeWidth="1.15" />
          </g>
        </g>
      </g>
      <g data-part="tool" data-beat="0">
        <g transform="translate(374 105) rotate(9)">
          <path d="M-46 -42 H46 V26 L30 43 H-46Z" fill="var(--hair)" />
          <path d="M46 25 Q40 30 29 27 Q33 35 30 43Z" fill="var(--paper)" strokeWidth="1.3" />
          <path d="M-40 -32h79" strokeWidth="0.7" />
        </g>
      </g>
      <g data-part="tool" data-beat="1">
        <g transform="translate(190 194) rotate(-10)">
          <rect x="-52" y="-37" width="105" height="78" rx="4" fill="var(--hair)" strokeWidth="1.5" />
          <rect x="-55" y="-41" width="105" height="78" rx="4" fill="var(--paper)" />
          <path d="M-19 11 Q-13 5 -13 -6 Q-13 -19 -2 -20 Q10 -21 13 -8 Q14 5 19 11Z" fill="var(--hair)" strokeWidth="1.7" />
          <path d="M-19 12h38" strokeWidth="2.3" />
          <path d="M-6 16q4 9 10 0" fill="var(--ink)" strokeWidth="1.1" />
          <circle cx="-1" cy="-22" r="2.8" fill="var(--ink)" strokeWidth="1" />
          <path d="M-22 -13q-4 5 -4 11 M20 -14q5 5 5 11" strokeWidth="1.25" />
        </g>
      </g>
      <g data-part="tool" data-beat="2">
        <g transform="translate(164 316) rotate(6)">
          <rect x="-56" y="-37" width="111" height="76" rx="2" fill="var(--hair)" strokeWidth="1.4" />
          <rect x="-57" y="-41" width="111" height="76" rx="2" fill="var(--paper)" />
          <rect x="-57" y="-41" width="111" height="16" rx="2" fill="var(--hair)" strokeWidth="1.3" />
          <rect x="-38" y="-47" width="4" height="13" rx="2" fill="var(--ink)" strokeWidth="0.8" />
          <rect x="-15" y="-47" width="4" height="13" rx="2" fill="var(--ink)" strokeWidth="0.8" />
          <rect x="10" y="-47" width="4" height="13" rx="2" fill="var(--ink)" strokeWidth="0.8" />
          <rect x="35" y="-47" width="4" height="13" rx="2" fill="var(--ink)" strokeWidth="0.8" />
          <rect x="-48" y="-17" width="91" height="41" strokeWidth="0.8" />
          <path d="M-35 -17v41" strokeWidth="0.7" />
          <path d="M-22 -17v41" strokeWidth="0.7" />
          <path d="M-9 -17v41" strokeWidth="0.7" />
          <path d="M4 -17v41" strokeWidth="0.7" />
          <path d="M17 -17v41" strokeWidth="0.7" />
          <path d="M30 -17v41" strokeWidth="0.7" />
          <path d="M-48 -7h91" strokeWidth="0.7" />
          <path d="M-48 3h91" strokeWidth="0.7" />
          <path d="M-48 13h91" strokeWidth="0.7" />
        </g>
      </g>
      <g data-part="tool" data-beat="3">
        <g transform="translate(362 379) rotate(-11)">
          <rect x="-49" y="-47" width="99" height="100" rx="1" fill="var(--hair)" strokeWidth="1.4" />
          <path d="M-53 -52 H30 L45 -37 V48 H-53Z" fill="var(--paper)" />
          <path d="M30 -52v15h15" fill="var(--hair)" strokeWidth="1.2" />
          <rect x="-44" y="-24" width="78" height="58" strokeWidth="0.85" />
          <path d="M8 -24v58 M22 -24v58" strokeWidth="0.95" />
          <path d="M-44 -14h78" strokeWidth="0.7" />
          <path d="M-44 -4h78" strokeWidth="0.7" />
          <path d="M-44 6h78" strokeWidth="0.7" />
          <path d="M-44 16h78" strokeWidth="0.7" />
          <path d="M-44 25h78" strokeWidth="0.7" />
          <path d="M-44 28h78" strokeWidth="0.7" />
        </g>
      </g>
      <rect x="554" y="81" width="179" height="319" rx="20" fill="var(--ink)" />
      {cells.map(({ x, y, fill, beat }) => (
        <g key={`${x}-${y}`} stroke="none">
          <rect x={x} y={y} width="16.5" height="16.5" rx="1" fill={fill} />
          {beat !== undefined && (
            <rect data-part="cell" data-beat={beat} x={x} y={y} width="16.5" height="16.5" rx="1" fill="var(--paper)" />
          )}
        </g>
      ))}
      <rect data-part="today" x="656" y="215" width="16.5" height="16.5" rx="1" fill="var(--red)" stroke="none" />
    </PlateFrame>
  );
}
