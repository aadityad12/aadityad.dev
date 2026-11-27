"use client";

import { useId, type CSSProperties } from "react";
import { Hatch, PlateFrame } from "./PlateFrame";

const lanes = [
  { label: "ARM64 JIT", y: 218, speed: 38.84, glyph: "M0 0h18v17H0zM4-4v4m6-4v4m6-4v4M4 17v4m6-4v4m6-4v4" },
  { label: "reg VM", y: 282, speed: 5.71, glyph: "M0 1h20v6H0zM0 12h20v6H0z" },
  { label: "stack VM", y: 346, speed: 3.8, glyph: "m0 4 10-4 11 4-11 5zM0 10l10 5 11-5M0 16l10 5 11-5" },
  { label: "tree-walk", y: 410, speed: 1, glyph: "M9 0v9M2 16v-7h15v7M0 17h4m11 0h4M7 0h4" },
];
const start = 383;
const finish = 720;

export default function RungPlate({ playing }: { playing: boolean }) {
  const id = `rung-${useId()}`;
  const hatch = `url(#${id}-cut)`;
  return (
    <PlateFrame name="rung" playing={playing}>
      <defs><Hatch id={`${id}-cut`} /></defs>
      <path d="M138 297h38m0-143v256" strokeWidth="3" />
      <path d="M176 154h18m-18 64h18m-18 64h18m-18 64h18m-18 64h18" />
      <rect x="61" y="261" width="78" height="68" rx="3" fill="var(--paper)" />
      <path d="M61 261l7-7h77v68l-6 7v-68z" fill={hatch} />
      <text className="mono" x="100" y="304" textAnchor="middle">fib</text>
      {[154, ...lanes.map(lane => lane.y)].map(y => (
        <path key={y} data-part="split-pulse" d={`M146 297h30V${y}h19`} pathLength="1"
          strokeDasharray=".14 1" strokeWidth="4.5" />
      ))}
      <circle data-part="source-pulse" cx="145" cy="297" r="4.5" fill="var(--ink)" stroke="none" />

      <text x="740" y="113" textAnchor="end">same output</text>
      <rect x="714" y="136" width="12" height="293" rx="2" fill={hatch} />
      <rect x="697" y="126" width="46" height="29" rx="2" fill="var(--ink)" />
      <path d="M711 137h18m-18 7h18" stroke="var(--paper)" strokeWidth="2.8" />
      <path d="M194 154h230l38 64" strokeWidth="1.5" />
      <path d="M201 147h17v6h-17zm5 10h17v6h-17z" fill="var(--hair)" />
      <g className="secondary">
        <rect x="236" y="140" width="99" height="28" fill="var(--paper)" stroke="none" />
        <text className="mono" x="249" y="161">bg JIT</text>
      </g>
      <g data-part="background-code">
        <rect x="378" y="149" width="10" height="10" fill="var(--ink)" />
      </g>
      {lanes.map(({ label, y, speed, glyph }, index) => {
        const isJit = index === 0;
        const ink = isJit ? "var(--red)" : "var(--ink)";
        return <g key={label} transform={`translate(0 ${y})`}>
          <rect x="194" y="-17" width="32" height="34" rx="2" fill={isJit ? hatch : "var(--paper)"} />
          <path d={glyph} transform="translate(200 -9)" strokeWidth="1.6" />
          <text className="mono" x="239" y="8">{label}</text>
          <path d={`M${start} 0H${finish}`} stroke={ink} strokeWidth={isJit ? 3.5 : 1.6} />
          <path d={`M${start} -6v12`} stroke={ink} />
          <circle cx={finish} r="5.5" fill="var(--paper)" stroke={ink} />
          <g data-part="runner" style={{ "--snapshot": `${(finish - start) * speed / 38.84}px`, "--distance": `${finish - start}px` } as CSSProperties}>
            <rect x={start - 5} y="-7" width="10" height="14" rx="2" fill={ink} stroke={ink} />
          </g>
        </g>;
      })}
      <path d="M520 228v40l14 14" strokeDasharray="4 5" />
      <path d="m525 281 10 2-1-10" />
      <path d="m520 207 11 11-11 11-11-11z" stroke="var(--red)" fill="var(--paper)" strokeWidth="2.3" />
      <circle data-part="bail-runner" cx={start} cy="218" r="5.5" fill="var(--ink)" stroke="var(--paper)" />
      <text data-part="speedup" className="mono speed" x="700" y="196" textAnchor="end">38.84×</text>
    </PlateFrame>
  );
}
