"use client";

import { useId, useRef, useState, type CSSProperties } from "react";
import { Hatch, PlateFrame, activateWithKey } from "./PlateFrame";

const blockWidth = 85;
const creaseWidth = 16;
const blockTypes = ["chat", "log", "diff", "chat", "log", "diff", "log", "chat"] as const;
const recalled = 2;
const tail = 6;
const recallArc = "M447 229Q362 138 250 230";

function Block({ type }: { type: typeof blockTypes[number] }) {
  return (
    <g>
      <path d="M0 0h82v52H0z" fill="var(--paper)" />
      <path d="M0 52h82v4H0z" fill="currentColor" stroke="none" />
      {type === "chat" && <path d="M24 14h31v19H38l-8 7v-7h-6z" strokeWidth="2.4" />}
      {type === "log" && <path d="m18 18 6 5-6 5m12-10h32m-32 9h22m-22 9h29" strokeWidth="2.4" />}
      {type === "diff" && <path d="M20 19h12m-6-6v12m-6 10h12m8-16h24m-24 16h17" strokeWidth="2.4" />}
    </g>
  );
}

export default function AccordionPlate({ playing }: { playing: boolean }) {
  const id = `accordion-${useId()}`;
  const hatch = `url(#${id}-cut)`;
  const [mode, setMode] = useState<"folded" | "recalled">();
  const folded = mode === "folded";
  const recalledFace = useRef<SVGGElement>(null);
  const toggle = () => {
    const visible = recalledFace.current && Number(getComputedStyle(recalledFace.current).opacity) >= .5;
    setMode(visible ? "folded" : "recalled");
  };
  // Both ends of each leader stay attached as its block changes position and width.
  const blocks = blockTypes.map((type, i) => {
    const x = 72 + i * blockWidth;
    const isMiddle = i >= recalled && i < tail;
    const narrow = blockWidth - creaseWidth;
    const packed = -narrow * Math.max(0, Math.min(i, tail) - recalled);
    const final = packed + (i > recalled ? narrow : 0);
    const angle = (offset: number) => `${Math.atan(-offset / 97) * 180 / Math.PI}deg`;
    const style = {
      "--packed": `${packed}px`, "--rest": `${final}px`,
      "--packed-angle": angle(packed - (isMiddle ? narrow / 2 : 0)),
      "--rest-angle": angle(final - (isMiddle && i !== recalled ? narrow / 2 : 0)),
    } as CSSProperties;
    return { x, type, isMiddle, style };
  });

  return (
    <PlateFrame name="accordion" playing={playing} mode={mode} interactive>
      <defs>
        <Hatch id={`${id}-cut`} />
        <mask id={`${id}-arc`} maskUnits="userSpaceOnUse" x="230" y="165" width="310" height="85" style={{ maskType: "alpha" }}>
          <path data-part="recall-trace" d={recallArc} pathLength="1" strokeDasharray="1" strokeWidth="18" />
        </mask>
      </defs>
      <text className="mono" x="650" y="127" textAnchor="end">100K budget</text>
      <path d="M72 162v-12h578v12m0-12v83" strokeWidth="1.4" />
      <rect x="419" y="145" width="185" height="10" fill={hatch} strokeWidth="1" />
      <text className="mono secondary" x="510" y="177" textAnchor="middle">0.60–0.92</text>
      <text x="72" y="219">agent view</text>
      <g data-part="arc-span">
        <g data-part="recall-arc" mask={`url(#${id}-arc)`}>
          <path d={recallArc} strokeDasharray="4 5" />
          <path d="m300 198-4-8m50-2-1-8m47 20 3-8M258 229l-9 1 3-9" />
        </g>
      </g>
      {blocks.map(({ x, style }, i) => (
        <g key={x} transform={`translate(${x + 41} 388)`} style={style}>
          <g data-part={i >= tail ? "tail-leader" : undefined}>
            <path data-part="block-leader" d="M0 0v-97" strokeWidth="1" opacity=".5" />
            {i === recalled && <path data-part="recall-leader" d="M0 0v-97" stroke="var(--red)" strokeWidth="2.5" />}
            <circle r="2.2" fill="var(--ink)" stroke="none" />
            {i === recalled && <circle data-part="recall-pin" r="4" fill="var(--red)" stroke="none" />}
          </g>
        </g>
      ))}
      {blocks.map(({ x, type, isMiddle, style }, i) => (
        <g key={x} transform={`translate(${x} 235)`} style={style}>
          <g data-part="block-position">
            <g data-part={i === 7 ? "append-last" : i === tail ? "append-first" : undefined}>
              <g data-part={isMiddle ? (i === recalled ? "recall-width" : "fold-width") : undefined}>
                <Block type={type} />
              </g>
              {isMiddle && <g data-part={i === recalled ? "recall-crease" : "crease"}>
                <path d="m0 4 7-9 7 5v52l-7 9-7-5z" fill={hatch} />
                <path d="m7-5 7 5v52l-7 9z" fill="var(--ink)" />
              </g>}
              {i === recalled && <g ref={recalledFace} data-part="recall-ink" stroke="var(--red)" color="var(--red)">
                <Block type={type} />
              </g>}
              {i === tail && <g className="secondary" data-part="tail-caption">
                <path d="M2 63v6h164v-6" />
                <rect x="24" y="74" width="119" height="24" fill="var(--paper)" stroke="none" />
                <text x="84" y="92" textAnchor="middle">protected tail</text>
              </g>}
            </g>
          </g>
        </g>
      ))}
      {blocks.map(({ x, type }) => (
        <g key={x} transform={`translate(${x} 389)`}>
          <Block type={type} />
          <rect x="1" y="42" width="80" height="9" stroke="none" fill={hatch} />
        </g>
      ))}
      <text x="72" y="476">stored</text>
      <g role="button" tabIndex={0} aria-label="Toggle recall of the stored block"
        aria-pressed={mode ? !folded : undefined} data-control="fold" onClick={toggle} onKeyDown={event => activateWithKey(event, toggle)}>
        <rect x="234" y="211" width="150" height="110" fill="transparent" stroke="none" />
      </g>
    </PlateFrame>
  );
}
