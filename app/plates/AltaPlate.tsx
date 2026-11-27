"use client";

import { useId } from "react";
import { Hatch, PlateFrame } from "./PlateFrame";

const contactRows = [228, 240, 252, 264, 276, 318, 330, 342, 354, 366];

export default function AltaPlate({ playing }: { playing: boolean }) {
  const id = `alta-${useId()}`;
  const hatch = `url(#${id}-cut)`;
  return (
    <PlateFrame name="alta" playing={playing}>
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
      <path d="M117 240 v-6 q0 -9 10 -9 h44 q10 0 10 10 v17" strokeWidth="4.4" />
      <path d="M117 240 v-6 q0 -9 10 -9 h44 q10 0 10 10 v17" stroke="var(--hair)" strokeWidth="1.5" />
      <path d="M243 354 v8 q0 10 10 10 h50 q10 0 10 -10 v-32" strokeWidth="4.4" />
      <path d="M243 354 v8 q0 10 10 10 h50 q10 0 10 -10 v-32" stroke="var(--hair)" strokeWidth="1.5" />
      <g transform="translate(215 300) rotate(90)">
        <path d="M-48 0 H46" strokeWidth="1.7" />
        <path d="M-21 -4 Q-19 -7 -14 -7 Q-7 -5 0 -5 Q7 -5 14 -7 Q19 -7 21 -4 V4 Q19 7 14 7 Q7 5 0 5 Q-7 5 -14 7 Q-19 7 -21 4Z" fill="var(--hair)" />
        <path d="M-13 -5 v10" strokeWidth="2.2" />
        <path d="M-6 -5 v10" strokeWidth="2.2" />
        <path d="M3 -5 v10" strokeWidth="2.2" />
        <path d="M12 -5 v10" strokeWidth="2.2" />
      </g>
      <path d="M271 252v-9 l8 -6v-12 M299 252v-12l-8 -5v-10" strokeWidth="1.5" />
      <path d="M274 226v-16 a11 11 0 0 1 22 0v16Z" fill="var(--paper)" />
      <rect x="271.5" y="225" width="27" height="4" rx="1" fill="var(--paper)" strokeWidth="1.4" />
      <path d="M280 210q0 -5 5 -6" strokeWidth="1" />
      <path d="M691 250 V212 C691 151 653 97 600 97 C564 97 540 114 517 144 L506 155" strokeWidth="5" />
      <path d="M691 250 V212 C691 151 653 97 600 97 C564 97 540 114 517 144 L506 155" stroke="var(--hair)" strokeWidth="1.3" />
      <path data-part="cable-pulse" d="M506 155 L517 144 C540 114 564 97 600 97 C653 97 691 151 691 212 V250" pathLength="1" strokeDasharray=".16 1" stroke="var(--red)" strokeWidth="3" />
      <rect x="667" y="241" width="44" height="19" rx="2" fill={hatch} strokeWidth="1.5" />
      <rect x="677" y="233" width="24" height="13" rx="2" fill="var(--ink)" strokeWidth="1.4" />
      <rect x="636" y="253" width="106" height="109" rx="7" fill="var(--hair)" />
      <rect x="631" y="249" width="106" height="108" rx="7" fill="var(--paper)" />
      <rect x="644" y="261" width="80" height="47" rx="2" fill="var(--ink)" strokeWidth="1.4" />
      <g data-part="readout" stroke="none">
        <text x="684" y="292" textAnchor="middle" fontFamily="var(--mono)" fontSize="19" fill="var(--paper)">5.01 V</text>
        <circle cx="716" cy="268" r="2" fill="var(--red)" />
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
      <g data-part="probe">
        <g transform="translate(383 276) rotate(-44)">
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
      <circle data-part="contact" cx="383" cy="276" r="3" fill="var(--red)" stroke="none" />
      <path data-part="ripple" data-beat="0" d="M371.8 267.6 A14 14 0 0 0 391.4 287.2" stroke="var(--red)" strokeWidth="3.8" />
      <path data-part="ripple" data-beat="1" d="M362.2 260.4 A26 26 0 0 0 398.6 296.8" stroke="var(--red)" strokeWidth="3.8" />
      <path data-part="ripple" data-beat="2" d="M352.6 253.2 A38 38 0 0 0 405.8 306.4" stroke="var(--red)" strokeWidth="3.8" />
    </PlateFrame>
  );
}
