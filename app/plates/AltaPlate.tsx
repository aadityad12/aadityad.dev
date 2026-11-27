"use client";

import { useId, useRef, useState } from "react";
import { activateWithKey, Hatch, PlateFrame } from "./PlateFrame";

const contactRows = [228, 240, 252, 264, 276, 318, 330, 342, 354, 366];

export default function AltaPlate({ playing }: { playing: boolean }) {
  const id = `alta-${useId()}`;
  const hatch = `url(#${id}-cut)`;
  const [mode, setMode] = useState<"open" | "seated">();
  const open = mode === "open";
  const led = useRef<SVGGElement>(null);
  const toggle = () => {
    const lit = led.current && Number(getComputedStyle(led.current).opacity) >= .5;
    setMode(lit ? "open" : "seated");
  };
  return (
    <PlateFrame name="alta" playing={playing} mode={mode} interactive>
      <defs>
        <Hatch id={`${id}-cut`} />
      </defs>
      <rect x="69" y="192" width="435" height="226" rx="9" fill="var(--hair)" />
      <rect x="68" y="188" width="435" height="226" rx="9" fill="var(--paper)" strokeWidth="1.9" />
      <path d="M71 219 H500" strokeWidth="0.7" />
      <path d="M71 382 H500" strokeWidth="0.7" />
      <rect x="69" y="295" width="433" height="12" fill="var(--hair)" strokeWidth="0.8" />
      <rect x="82" y="296" width="12" height="10" fill={hatch} strokeWidth="0.6" />
      <rect x="477" y="296" width="12" height="10" fill={hatch} strokeWidth="0.6" />
      {Array.from({ length: 29 }, (_, column) => (
        <g key={column} transform={`translate(${89 + column * 14} 0)`} stroke="none" fill="var(--ink)">
          {contactRows.map(y => <rect key={y} x="-1.35" y={y - 1.35} width="2.7" height="2.7" rx=".55" />)}
          {column % 6 !== 5 && [201, 209, 392, 400].map(y => <circle key={y} cy={y} r="1.25" />)}
        </g>
      ))}
      <path d="M85 195h400" strokeWidth="0.55" />
      <path d="M85 214h400" strokeWidth="0.55" />
      <path d="M85 386h400" strokeWidth="0.55" />
      <path d="M85 407h400" strokeWidth="0.55" />
      <path d="M201 209v18q0 12 12 12h60q12 0 12 13" strokeWidth="2.2" />
      <g transform="translate(241 239)">
        <path d="M-21 -4 Q-19 -7 -14 -7 Q-7 -5 0 -5 Q7 -5 14 -7 Q19 -7 21 -4 V4 Q19 7 14 7 Q7 5 0 5 Q-7 5 -14 7 Q-19 7 -21 4Z" fill="var(--hair)" />
        <path d="M-13 -5 v10" strokeWidth="2.2" />
        <path d="M-6 -5 v10" strokeWidth="2.2" />
        <path d="M3 -5 v10" strokeWidth="2.2" />
        <path d="M12 -5 v10" strokeWidth="2.2" />
      </g>
      <path d="M285 264v-10l11-9v-22m17 41v-12l-9-8v-21" strokeWidth="2" />
      <path d="M287 221v-16a13 13 0 0 1 26 0v16z" fill="var(--paper)" />
      <g ref={led} data-part="led" fill="var(--red)" stroke="var(--red)">
        <path d="M288 220v-15a12 12 0 0 1 24 0v15z" />
        <path d="M300 182v-10m-18 16-6-8m42 8 6-8m-50 21-9-3m61 3 9-3" strokeWidth="2.3" />
      </g>
      <rect x="284" y="220" width="32" height="5" rx="1" fill="var(--paper)" />
      <path d="M239 333h18l28-50" strokeWidth="1.2" />
      <rect x="134" y="314" width="103" height="31" rx="2" fill="var(--paper)" strokeWidth="1" />
      <text className="mono" x="185" y="337" textAnchor="middle">row 15</text>
      <circle cx="369" cy="400" r="5.5" fill="var(--paper)" />
      <g data-part="ground-wire">
        <path d="M313 264c0-20 28-22 44-5 40 43 12 89 12 122" strokeWidth="6.2" />
        <path d="M313 264c0-20 28-22 44-5 40 43 12 89 12 122" strokeWidth="2" stroke="var(--hair)" />
        <path d="M369 381v19" strokeWidth="2.8" />
        <rect x="365" y="372" width="8" height="17" rx="1.4" fill="var(--ink)" />
      </g>
      <path d="M369 412v15l12 10h10" strokeWidth="1.2" />
      <text className="mono" x="398" y="447">GND</text>
      <path d="M691 250V212C691 144 640 95 565 95 500 95 456 108 408 155" strokeWidth="5.6" />
      <path d="M691 250V212C691 144 640 95 565 95 500 95 456 108 408 155" stroke="var(--hair)" strokeWidth="2.8" />
      <path data-part="meter-pulse" d="M408 155C456 108 500 95 565 95 640 95 691 144 691 212v38" pathLength="1" strokeDasharray=".12 1" strokeWidth="3.2" />
      <rect x="667" y="241" width="44" height="19" rx="2" fill={hatch} strokeWidth="1.5" />
      <rect x="677" y="233" width="24" height="13" rx="2" fill="var(--ink)" strokeWidth="1.4" />
      <rect x="636" y="253" width="106" height="109" rx="7" fill="var(--hair)" />
      <rect x="631" y="249" width="106" height="108" rx="7" fill="var(--paper)" />
      <rect x="637" y="264" width="94" height="42" rx="2" fill="var(--ink)" strokeWidth="1.4" />
      <g textAnchor="middle" className="meter">
        <text data-part="high-voltage" className="mono" x="684" y="292">5.01 V</text>
        <text data-part="low-voltage" className="mono" x="684" y="292">1.92 V</text>
      </g>
      <g data-part="speaker">
        <path d="M648 315 h3" strokeWidth="1" />
        <path d="M656 315 h3" strokeWidth="1" />
        <path d="M664 315 h3" strokeWidth="1" />
        <path d="M672 315 h3" strokeWidth="1" />
        <path d="M680 315 h3" strokeWidth="1" />
        <path d="M688 315 h3" strokeWidth="1" />
        <path d="M696 315 h3" strokeWidth="1" />
        <path d="M704 315 h3" strokeWidth="1" />
        <path d="M712 315 h3" strokeWidth="1" />
      </g>
      <circle cx="643" cy="260" r="2.1" fill="var(--paper)" strokeWidth="1" />
      <path d="M641.992 261.008l2.016 -2.016" strokeWidth="0.85" />
      <circle cx="643" cy="346" r="2.1" fill="var(--paper)" strokeWidth="1" />
      <path d="M641.992 347.008l2.016 -2.016" strokeWidth="0.85" />
      <circle cx="725" cy="260" r="2.1" fill="var(--paper)" strokeWidth="1" />
      <path d="M723.992 261.008l2.016 -2.016" strokeWidth="0.85" />
      <circle cx="725" cy="346" r="2.1" fill="var(--paper)" strokeWidth="1" />
      <path d="M723.992 347.008l2.016 -2.016" strokeWidth="0.85" />
      <circle cx="689" cy="333" r="8" fill="var(--paper)" strokeWidth="1.3" />
      <circle cx="689" cy="333" r="3" fill="var(--ink)" strokeWidth="1" />
      <g data-part="meter-probe">
        <g transform="translate(285 276) rotate(-44)">
          <path d="M0 0 L20 -3 L20 3 Z" fill="var(--ink)" strokeWidth="0.9" />
          <path d="M19 -3 L49 -7 V7 L19 3Z" fill="var(--hair)" strokeWidth="1.5" />
          <rect x="47" y="-10" width="9" height="20" rx="2" fill={hatch} strokeWidth="1.4" />
          <path d="M56 -8 L71 -10 H157 Q166 -10 166 -4 V4 Q166 10 157 10 H71 L56 8Z" fill="var(--ink)" />
          <path d="M68 -6v12" stroke="var(--paper)" strokeWidth="0.9" />
          <path d="M74 -6v12" stroke="var(--paper)" strokeWidth="0.9" />
          <path d="M80 -6v12" stroke="var(--paper)" strokeWidth="0.9" />
          <path d="M86 -6v12" stroke="var(--paper)" strokeWidth="0.9" />
          <path d="M92 -6v12" stroke="var(--paper)" strokeWidth="0.9" />
          <rect x="165" y="-4" width="20" height="8" rx="1" fill={hatch} strokeWidth="1.3" />
        </g>
      </g>
      <circle cx="285" cy="276" r="3" fill="var(--ink)" stroke="none" />
      <path data-part="probe-ring" d="M273 268a14 14 0 0 0 21 19m-30-24a25 25 0 0 0 35 34" strokeWidth="2" />
      <path d="M671 365q14 8 28 0m-32 6q18 12 37 0" data-part="voice-arcs" />
      <path d="m655 380-11 13h-92" strokeWidth="1" />
      <text data-part="diagnosis" x="542" y="425">no current flowing</text>
      <text data-part="confirmed" x="542" y="425">that&apos;s it</text>
      <g role="button" tabIndex={0} data-control="ground" aria-label="Toggle the ground jumper"
        aria-pressed={mode ? !open : undefined} onClick={toggle} onKeyDown={event => activateWithKey(event, toggle)}>
        <rect x="315" y="299" width="138" height="111" rx="7" fill="transparent" stroke="none" />
      </g>
    </PlateFrame>
  );
}
