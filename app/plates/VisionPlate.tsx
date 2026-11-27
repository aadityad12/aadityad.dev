"use client";

import { useId } from "react";
import { Hatch, PlateFrame } from "./PlateFrame";
import type { CSSProperties } from "react";

export default function VisionPlate({ playing }: { playing: boolean }) {
  const id = `visionassist-${useId()}`;
  const hatch = `url(#${id}-cut)`;
  return (
    <PlateFrame name="visionassist" playing={playing}>
      <defs>
        <Hatch id={`${id}-cut`} />
      </defs>
      <g data-part="rays">
        <path d="M303 218 L693 236" strokeWidth="0.8" strokeDasharray="4 5" />
        <path d="M303 218 L657 322" strokeWidth="0.8" strokeDasharray="4 5" />
        <path d="M303 218 L680 409" strokeWidth="0.8" strokeDasharray="4 5" />
      </g>
      <path d="M76 413 H744" strokeWidth="1.45" />
      <path d="M319 414v7" strokeWidth="1.35" />
      <path d="M358 414v5" strokeWidth="1.35" />
      <path d="M397 414v7" strokeWidth="1.35" />
      <path d="M436 414v5" strokeWidth="1.35" />
      <path d="M475 414v7" strokeWidth="1.35" />
      <path d="M514 414v5" strokeWidth="1.35" />
      <path d="M553 414v7" strokeWidth="1.35" />
      <path d="M592 414v5" strokeWidth="1.35" />
      <path d="M631 414v7" strokeWidth="1.35" />
      <path d="M670 414v5" strokeWidth="1.35" />
      <path d="M709 414v7" strokeWidth="1.35" />
      <path data-part="warning-tick" d="M553 414v7" stroke="var(--red)" strokeWidth="2.5" />
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
      <path data-part="inner-ear" d="M195 243q-11 9 0 18" strokeWidth="2.35" />
      <path data-part="outer-ear" d="M187 236q-19 17 0 34" strokeWidth="2.35" />
      <g data-part="target">
        <path d="M623 328 L617 403 M681 329 L695 402" strokeWidth="4" />
        <path d="M623 328 L617 403 M681 329 L695 402" stroke="var(--hair)" />
        <path d="M616 334 L606 411 M675 334 L685 411" strokeWidth="5.8" />
        <path d="M616 334 L606 411 M675 334 L685 411" stroke="var(--paper)" strokeWidth="2.1" />
        <path d="M673 328 Q683 328 684 318 L691 253" strokeWidth="5" />
        <path d="M673 328 Q683 328 684 318 L691 253" stroke="var(--hair)" strokeWidth="1.7" />
        <path d="M599 323 Q619 322 640 325 Q659 328 675 321 L682 326 Q662 337 641 333 Q620 329 602 332 Q597 332 597 328Q597 325 599 323Z" fill="var(--ink)" />
        <path d="M682 287 L686 239 Q687 231 695 232 L699 234 L693 287 Q692 294 686 293 Q681 292 682 287Z" fill={hatch} strokeWidth="1.7" />
        <g data-part="reticle">
          <path data-part="corner" style={{ "--dx": "-10px", "--dy": "-10px" } as CSSProperties} d="M595 218h-16v18" stroke="var(--red)" strokeWidth="5.4" strokeLinecap="square" strokeLinejoin="miter" />
          <path data-part="corner" style={{ "--dx": "10px", "--dy": "-10px" } as CSSProperties} d="M703 218h17v18" stroke="var(--red)" strokeWidth="5.4" strokeLinecap="square" strokeLinejoin="miter" />
          <path data-part="corner" style={{ "--dx": "-10px", "--dy": "10px" } as CSSProperties} d="M579 408v18h17" stroke="var(--red)" strokeWidth="5.4" strokeLinecap="square" strokeLinejoin="miter" />
          <path data-part="corner" style={{ "--dx": "10px", "--dy": "10px" } as CSSProperties} d="M720 408v18h-17" stroke="var(--red)" strokeWidth="5.4" strokeLinecap="square" strokeLinejoin="miter" />
        </g>
      </g>
    </PlateFrame>
  );
}
