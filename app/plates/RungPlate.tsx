"use client";

import { useId } from "react";
import { Hatch, PlateFrame } from "./PlateFrame";
import type { CSSProperties } from "react";

const returnPath = "M574 202 C574 230 551 245 516 245 H329";

export default function RungPlate({ playing }: { playing: boolean }) {
  const id = `rung-${useId()}`;
  const hatch = `url(#${id}-cut)`;
  return (
    <PlateFrame name="rung" playing={playing}>
      <defs>
        <Hatch id={`${id}-cut`} />
        <clipPath id={`${id}-rails`}><rect x="190" y="130" width="560" height="310" /></clipPath>
        <mask id={`${id}-return`} maskUnits="userSpaceOnUse" x="318" y="198" width="265" height="56"
          style={{ maskType: "alpha" }}>
          <path data-part="return-draw" d={returnPath} pathLength="1" strokeDasharray="1" strokeWidth="5" />
        </mask>
      </defs>
      <g clipPath={`url(#${id}-rails)`}>
        <g data-part="bar" data-beat="0" style={{ "--travel": "-21px" } as CSSProperties}>
          <path d="M190 407 L196 402 L210.05 402 L204.05 407 Z" fill="var(--hair)" />
          <rect x="190" y="407" width="14.05" height="18" fill="var(--ink)" />
          <path d="M204.05 407 L210.05 402 L210.05 420 L204.05 425 Z" fill="var(--ink)" />
        </g>
        <g data-part="bar" data-beat="1" style={{ "--travel": "-60px" } as CSSProperties}>
          <path d="M190 349 L196 344 L249.39 344 L243.39 349 Z" fill="var(--hair)" />
          <rect x="190" y="349" width="53.39" height="18" fill={hatch} />
          <path d="M243.39 349 L249.39 344 L249.39 362 L243.39 367 Z" fill="var(--ink)" />
        </g>
        <g data-part="bar" data-beat="2" style={{ "--travel": "-87px" } as CSSProperties}>
          <path d="M190 291 L196 286 L276.09 286 L270.09 291 Z" fill="var(--hair)" />
          <rect x="190" y="291" width="80.08500000000001" height="18" fill="var(--ink)" />
          <path d="M270.09 291 L276.09 286 L276.09 304 L270.09 309 Z" fill="var(--ink)" />
        </g>
        <g data-part="bar" data-beat="3" style={{ "--travel": "-128px" } as CSSProperties}>
          <path d="M190 233 L196 228 L316.83 228 L310.83 233 Z" fill="var(--hair)" />
          <rect x="190" y="233" width="120.83" height="18" fill={hatch} />
          <path d="M310.83 233 L316.83 228 L316.83 246 L310.83 251 Z" fill="var(--ink)" />
        </g>
        <g data-part="bar" data-beat="4" style={{ "--travel": "-552px" } as CSSProperties}>
          <path d="M190 175 L196 170 L741.14 170 L735.14 175 Z" fill="var(--red)" />
          <rect x="190" y="175" width="545.14" height="18" fill="var(--red)" />
          <path d="M735.14 175 L741.14 170 L741.14 188 L735.14 193 Z" fill="var(--red)" />
        </g>
      </g>
      <rect x="167" y="145" width="23" height="301" rx="2" fill="var(--ink)" />
      <path d="M190 145 L198 139 L198 439 L190 446 Z" fill={hatch} />
      <circle cx="178" cy="155" r="3.4" fill="var(--paper)" strokeWidth="1" />
      <path d="M176.368 156.632l3.264 -3.264" strokeWidth="0.85" />
      <circle cx="178" cy="435" r="3.4" fill="var(--paper)" strokeWidth="1" />
      <path d="M176.368 436.632l3.264 -3.264" strokeWidth="0.85" />
      <rect x="185" y="404" width="8" height="25" rx="1.5" fill="var(--paper)" strokeWidth="1.6" />
      <rect x="185" y="346" width="8" height="25" rx="1.5" fill="var(--paper)" strokeWidth="1.6" />
      <rect x="185" y="288" width="8" height="25" rx="1.5" fill="var(--paper)" strokeWidth="1.6" />
      <rect x="185" y="230" width="8" height="25" rx="1.5" fill="var(--paper)" strokeWidth="1.6" />
      <rect x="185" y="172" width="8" height="25" rx="1.5" fill="var(--paper)" strokeWidth="1.6" />
      <path data-part="collar-flash" d="M189 232v20" stroke="var(--red)" strokeWidth="3" />
      <path d={returnPath} strokeDasharray="5 5" strokeWidth="1.5" mask={`url(#${id}-return)`} />
      <path data-part="return-head" d="M333 241 L323 245 L333 249" fill="var(--ink)" strokeWidth="1" />
      <rect data-part="cursor" x="194" y="181" width="4" height="4" fill="var(--ink)" stroke="none" />
    </PlateFrame>
  );
}
