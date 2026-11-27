"use client";

import { useId, useState } from "react";
import { Hatch, PlateFrame, activateWithKey } from "./PlateFrame";

export default function AccordionPlate({ playing }: { playing: boolean }) {
  const id = `accordion-${useId()}`;
  const hatch = `url(#${id}-cut)`;
  const [mode, setMode] = useState<"folded" | "retrieved" | undefined>();
  const [lastPlaying, setLastPlaying] = useState(playing);
  if (lastPlaying !== playing) {
    setLastPlaying(playing);
    setMode(undefined);
  }
  const folded = mode === "folded";
  const toggle = () => setMode(folded ? "retrieved" : "folded");
  return (
    <PlateFrame name="accordion" playing={playing} mode={mode} interactive>
      <defs>
        <Hatch id={`${id}-cut`} />
        <clipPath id={`${id}-crease`}><rect width="800" height="235" /></clipPath>
      </defs>
      <g data-part="left-tail">
        <path d="M58 389 L126 389 L156 298 L88 298 Z" fill="var(--paper)" />
        <path d="M91.80 381.39 L98.80 381.39 L100.30 376.59 L93.30 376.59 Z" fill="var(--ink)" strokeWidth="0.45" />
        <path d="M115.20 310.41 L122.20 310.41 L123.70 305.61 L116.70 305.61 Z" fill="var(--ink)" strokeWidth="0.45" />
        <path d="M58 389 L126 389 L126 392.50 L58 392.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M126 389 L194 389 L224 298 L156 298 Z" fill="var(--paper)" />
        <path d="M159.80 381.39 L166.80 381.39 L168.30 376.59 L161.30 376.59 Z" fill="var(--ink)" strokeWidth="0.45" />
        <path d="M183.20 310.41 L190.20 310.41 L191.70 305.61 L184.70 305.61 Z" fill="var(--ink)" strokeWidth="0.45" />
        <path d="M126 389 L194 389 L194 392.50 L126 392.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M194 389 L256 356 L286 265 L224 298 Z" fill="var(--paper)" />
        <path d="M224.80 364.89 L231.80 364.89 L233.30 360.09 L226.30 360.09 Z" fill="var(--ink)" strokeWidth="0.45" />
        <path d="M248.20 293.91 L255.20 293.91 L256.70 289.11 L249.70 289.11 Z" fill="var(--ink)" strokeWidth="0.45" />
        <path d="M194 389 L256 356 L256 359.50 L194 392.50 Z" fill="var(--ink)" strokeWidth="0.8" />
      </g>
      <g data-part="pleats">
        <path d="M256 356 L282 297 L312 206 L286 265 Z" fill="var(--paper)" />
        <path d="M256 356 L282 297 L282 300.50 L256 359.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M282 297 L295 366 L325 275 L312 206 Z" fill={hatch} />
        <path d="M282 297 L295 366 L295 369.50 L282 300.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M295 366 L309 297 L339 206 L325 275 Z" fill="var(--paper)" />
        <path d="M295 366 L309 297 L309 300.50 L295 369.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M309 297 L322 366 L352 275 L339 206 Z" fill="var(--ink)" />
        <path d="M309 297 L322 366 L322 369.50 L309 300.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M322 366 L336 297 L366 206 L352 275 Z" fill="var(--paper)" />
        <path d="M322 366 L336 297 L336 300.50 L322 369.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M336 297 L349 366 L379 275 L366 206 Z" fill={hatch} />
        <path d="M336 297 L349 366 L349 369.50 L336 300.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M349 366 L363 297 L393 206 L379 275 Z" fill="var(--paper)" />
        <path d="M349 366 L363 297 L363 300.50 L349 369.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M363 297 L376 366 L406 275 L393 206 Z" fill="var(--ink)" />
        <path d="M363 297 L376 366 L376 369.50 L363 300.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M376 366 L390 297 L420 206 L406 275 Z" fill="var(--paper)" />
        <path d="M376 366 L390 297 L390 300.50 L376 369.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M390 297 L403 366 L433 275 L420 206 Z" fill={hatch} />
        <path d="M390 297 L403 366 L403 369.50 L390 300.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M403 366 L423 305 L453 214 L433 275 Z" fill="var(--paper)" />
        <path d="M403 366 L423 305 L423 308.50 L403 369.50 Z" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M423 305 L450 365 L480 274 L453 214 Z" fill="var(--ink)" />
        <path d="M423 305 L450 365 L450 368.50 L423 308.50 Z" fill="var(--ink)" strokeWidth="0.8" />
      </g>
      <path d="M450 365 L512 389 L542 298 L480 274 Z" fill="var(--paper)" />
      <path d="M480.80 369.39 L487.80 369.39 L489.30 364.59 L482.30 364.59 Z" fill="var(--ink)" strokeWidth="0.45" />
      <path d="M504.20 298.41 L511.20 298.41 L512.70 293.61 L505.70 293.61 Z" fill="var(--ink)" strokeWidth="0.45" />
      <path d="M450 365 L512 389 L512 392.50 L450 368.50 Z" fill="var(--ink)" strokeWidth="0.8" />
      <path d="M512 389 L580 389 L610 298 L542 298 Z" fill="var(--paper)" />
      <path d="M545.80 381.39 L552.80 381.39 L554.30 376.59 L547.30 376.59 Z" fill="var(--ink)" strokeWidth="0.45" />
      <path d="M569.20 310.41 L576.20 310.41 L577.70 305.61 L570.70 305.61 Z" fill="var(--ink)" strokeWidth="0.45" />
      <path d="M512 389 L580 389 L580 392.50 L512 392.50 Z" fill="var(--ink)" strokeWidth="0.8" />
      <path d="M580 389 L648 389 L678 298 L610 298 Z" fill="var(--paper)" />
      <path d="M613.80 381.39 L620.80 381.39 L622.30 376.59 L615.30 376.59 Z" fill="var(--ink)" strokeWidth="0.45" />
      <path d="M637.20 310.41 L644.20 310.41 L645.70 305.61 L638.70 305.61 Z" fill="var(--ink)" strokeWidth="0.45" />
      <path d="M580 389 L648 389 L648 392.50 L580 392.50 Z" fill="var(--ink)" strokeWidth="0.8" />
      <path d="M648 389 L716 389 L746 298 L678 298 Z" fill="var(--paper)" />
      <path d="M681.80 381.39 L688.80 381.39 L690.30 376.59 L683.30 376.59 Z" fill="var(--ink)" strokeWidth="0.45" />
      <path d="M705.20 310.41 L712.20 310.41 L713.70 305.61 L706.70 305.61 Z" fill="var(--ink)" strokeWidth="0.45" />
      <path d="M648 389 L716 389 L716 392.50 L648 392.50 Z" fill="var(--ink)" strokeWidth="0.8" />
      <g clipPath={`url(#${id}-crease)`}>
        <g data-part="panel">
          <path d="M328 184 L396 184 L426 93 L358 93 Z" fill="var(--red)" />
          <path d="M361.80 176.39 L368.80 176.39 L370.30 171.59 L363.30 171.59 Z" fill="var(--paper)" strokeWidth="0.6" />
          <path d="M385.20 105.41 L392.20 105.41 L393.70 100.61 L386.70 100.61 Z" fill="var(--paper)" strokeWidth="0.6" />
        </g>
      </g>
      <g data-part="arrow">
        <path data-part="shaft" pathLength="1" strokeDasharray="1" d="M431 255 C448 248 454 232 454 214 V163" strokeWidth="2" />
        <path data-part="head" d="M449 171 L454 160 L459 171" fill="var(--ink)" strokeWidth="1" />
      </g>
      <g role="button" tabIndex={0} aria-label={folded ? "Tap to unfold" : "Tap to fold"}
        aria-pressed={!folded} onClick={toggle} onKeyDown={event => activateWithKey(event, toggle)}
        data-control="fold" stroke="none" fill="transparent">
        <path d="M250 360L285 248 320 203 324 180 352 86H437L416 184 459 207 486 272 453 375H285Z" />
      </g>
    </PlateFrame>
  );
}
