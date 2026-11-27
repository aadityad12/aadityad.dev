"use client";

import { useId } from "react";
import { Hatch, PlateFrame } from "./PlateFrame";

export default function VisionPlate({ playing }: { playing: boolean }) {
  const id = `visionassist-${useId()}`;
  const hatch = `url(#${id}-cut)`;
  return (
    <PlateFrame name="visionassist" playing={playing}>
      <defs>
        <Hatch id={`${id}-cut`} />
        <clipPath id={`${id}-floor`}><rect x="314" y="411" width="428" height="17" /></clipPath>
      </defs>
      <g data-part="sight-cone" strokeWidth="1">
        <path d="m305 212 431-18M305 212l438 176" strokeDasharray="5 6" />
        <path d="M305 212l402 79" strokeDasharray="2 7" />
      </g>
      <path d="M76 413H744" strokeWidth="1.6" />
      <g clipPath={`url(#${id}-floor)`}>
        <g data-part="step-ticks" strokeDasharray="1.8 76.2" strokeLinecap="butt">
          <path d="M236 419H822" strokeWidth="10" />
          <path d="M275 416.5H822" strokeWidth="5" />
        </g>
      </g>
      <path d="M85 409 C98 393 122 383 148 374 Q168 363 169 343 L170 325 C147 306 133 283 133 248 C133 194 169 154 222 153 C261 152 286 176 289 209 L291 233 C292 241 298 253 305 263 Q308 268 302 270 L292 273 L289 292 Q290 307 280 318 Q272 325 246 326 L242 349 Q242 361 257 369 C282 382 289 396 298 409Z" fill="var(--paper)" strokeWidth="2" />
      <path d="M149 376 Q177 392 205 409 L191 409 Q167 399 141 380Z" fill={hatch} strokeWidth="1" />
      <path d="M240 351q-4 9 -3 15" strokeWidth="1" />
      <path d="M133 221 Q181 196 251 204 L258 218 Q181 209 133 235Z" fill="var(--ink)" />
      <path d="M140 223q38 -17 75 -17" stroke="var(--paper)" strokeWidth="0.7" />
      <rect x="233" y="198" width="22" height="24" rx="3" fill="var(--hair)" strokeWidth="1.4" />
      <circle cx="241" cy="205" r="2" fill="var(--paper)" strokeWidth="1" />
      <path d="M240.04 205.96l1.92 -1.92" strokeWidth="0.85" />
      <circle cx="247" cy="215" r="2" fill="var(--paper)" strokeWidth="1" />
      <path d="M246.04 215.96l1.92 -1.92" strokeWidth="0.85" />
      <path d="M253 188 H289 L300 197 V224 L293 231 H253 Q248 231 248 226 V194 Q248 188 253 188Z" fill="var(--ink)" />
      <rect x="295" y="201" width="9" height="21" rx="1" fill="var(--hair)" strokeWidth="1.3" />
      <rect x="302" y="203" width="6" height="17" rx="1" fill="var(--ink)" strokeWidth="1.2" />
      <path d="M258 194h25" stroke="var(--paper)" strokeWidth="0.95" />
      <path d="M213 240q-8-6-15 0t-6 15q0 13 10 17" strokeWidth="1.3" />
      <path d="M197 247q0-6 6-6h3q6 0 6 6v2q0 4-6 5v9q0 3-4 3t-4-4z" fill="var(--ink)" />
      <path data-part="ear-sound" d="M184 241q-9 10-2 19m-6-25q-15 15-4 31" strokeWidth="2" />
      <g data-part="warning">
        <path d="M205 235v-55l73-60h77" strokeWidth="1.1" />
        <rect x="360" y="93" width="375" height="53" rx="3" fill="var(--paper)" />
        <text className="speech" x="378" y="127">Stop. Chair, 2 steps ahead.</text>
      </g>
      <g transform="translate(631 278)">
        <path d="M0 3h98v14H0zm1 21h96l-4 7H-3z" fill={hatch} />
        <path d="M8 18v7m78-7v7M7 32l-4 27m82-27 4 27m-70-27-1 18m59-18 2 18" strokeWidth="3.2" />
        <path data-part="bench-box" d="M-13 8V-7H3m91 0h15V8m0 41v17H94M2 66h-15V50" strokeWidth="1.6" />
      </g>
      <g transform="translate(-153 0)">
        <g data-part="chair">
          <path d="M623 328 L617 403 M681 329 L695 402" strokeWidth="4" />
          <path d="M623 328 L617 403 M681 329 L695 402" stroke="var(--hair)" />
          <path d="M616 334 L606 411 M675 334 L685 411" strokeWidth="5.8" />
          <path d="M616 334 L606 411 M675 334 L685 411" stroke="var(--paper)" strokeWidth="2.1" />
          <path d="M673 328 Q683 328 684 318 L691 253" strokeWidth="5" />
          <path d="M673 328 Q683 328 684 318 L691 253" stroke="var(--hair)" strokeWidth="1.7" />
          <path d="M599 323 Q619 322 640 325 Q659 328 675 321 L682 326 Q662 337 641 333 Q620 329 602 332 Q597 332 597 328Q597 325 599 323Z" fill="var(--ink)" />
          <path d="M682 287 L686 239 Q687 231 695 232 L699 234 L693 287 Q692 294 686 293 Q681 292 682 287Z" fill={hatch} strokeWidth="1.7" />
          <path d="M595 218h-16v18m124-18h17v18m-141 172v18h17m124-18v18h-17" strokeWidth="1.1" />
          <g data-part="chair-lock" stroke="var(--red)">
            <path d="M595 218h-16v18m124-18h17v18m-141 172v18h17m124-18v18h-17" strokeWidth="4.2" strokeLinecap="square" />
            <path d="M731 232h12m-6 0v178m-6 0h12" strokeWidth="2" />
            <text className="mono secondary height-label" x="746" y="327">h</text>
          </g>
        </g>
      </g>
      <g className="secondary">
        <rect x="83" y="443" width="179" height="32" rx="2" fill="var(--paper)" />
        <text className="mono" x="172" y="465" textAnchor="middle">200 ms / frame</text>
        <text className="mono" x="507" y="465" textAnchor="middle">d = H·f/h</text>
      </g>
    </PlateFrame>
  );
}
