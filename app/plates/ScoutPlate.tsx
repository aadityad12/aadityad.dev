"use client";

import { useEffect, useId, useState } from "react";
import { Hatch, PlateFrame, activateWithKey } from "./PlateFrame";

export default function ScoutPlate({ playing }: { playing: boolean }) {
  const id = `oss-scout-${useId()}`;
  const hatch = `url(#${id}-cut)`;
  const [press, setPress] = useState(0);
  useEffect(() => {
    if (!press) return;
    const timer = window.setTimeout(() => setPress(0), 1900);
    return () => window.clearTimeout(timer);
  }, [press]);
  const post = () => setPress(value => value + 1);
  return (
    <PlateFrame name="oss-scout" playing={playing || Boolean(press)} mode={press ? "post" : undefined} interactive>
      <defs>
        <Hatch id={`${id}-cut`} />
        <clipPath id={`${id}-delivery`}><path d="M180 225h472v89H180z" /></clipPath>
      </defs>
      <g key={press}>
        <path d="M94 167a18 18 0 1 0 19 23 19 19 0 0 1-19-23z" fill="var(--ink)" />
        <text className="secondary" x="126" y="191">night scan</text>
        <path d="M72 244l9-8h104v118l-9 8V244z" fill={hatch} />
        <rect x="72" y="244" width="104" height="118" rx="3" fill="var(--ink)" />
        <rect x="85" y="258" width="78" height="59" rx="2" fill="var(--paper)" />
        {[271, 284, 297].map((y, i) => <g key={y}>
          <circle cx="95" cy={y} r="2.1" fill="var(--ink)" />
          <path d={`M104 ${y}h${[46, 36, 43][i]}`} />
        </g>)}
        <path d="m86 348 8-8m1 8 8-8m1 8 8-8" stroke="var(--paper)" strokeWidth="1.2" />
        <path d="M177 310h299v6H177zm345 0h214v6H522z" fill={hatch} />
        <g data-part="issues" strokeWidth="2">
          <path d="M194 258h50m-44 10h33m-28 10h43" strokeDasharray="3 5 40 0" />
        </g>

        <path d="M176 350h13v37h277" strokeWidth="2" />
        <text className="mono" x="209" y="373">gh write</text>
        <g data-part="write-packet">
          <path d="M201 381h16l6 6-6 6h-16z" fill="var(--ink)" />
        </g>
        {[[148, 76], [323, 100]].map(([y, height]) => <g key={y}>
          <rect x="479" y={y} width="37" height={height} fill={hatch} />
          <path d={`M479 ${y}v${height}`} strokeWidth="6" />
          {[y + 9, y + height - 10].map(bolt => <g key={bolt}>
            <rect x="473" y={bolt - 3} width="48" height="6" rx="1" fill="var(--hair)" strokeWidth="1" />
            <circle cx="513" cy={bolt} r="4.2" fill="var(--paper)" />
            <path d={`m511 ${bolt + 2} 4-4`} strokeWidth=".9" />
          </g>)}
        </g>)}
        <g data-part="guard-stop">
          <path d="M462 373h16v28h-16z" fill={hatch} strokeWidth="2.3" />
          <path d="M461 371v32" strokeWidth="3" />
        </g>
        <path data-part="blocked" d="m433 354 14 14m0-14-14 14" strokeWidth="3" />
        <path d="M466 409v13l-14 15h-22" strokeWidth="1" />
        <text className="mono" x="416" y="447" textAnchor="end">guard · 37 tests</text>

        <path d="M517 190h8l9 10v99l-12 14" strokeWidth="1.4" />
        <circle cx="534" cy="200" r="2.8" fill="var(--paper)" />
        <path data-part="bridge" d="M475 310h48v6h-48z" fill="var(--ink)" />
        <circle cx="522" cy="313" r="4" fill="var(--paper)" />
        <g clipPath={`url(#${id}-delivery)`}>
          <g data-part="draft">
            <path d="M297 236h144l14 14v57H297z" fill="var(--paper)" />
            <path d="M441 236v14h14" strokeWidth="1" />
            <text data-part="draft-title" className="mono" x="310" y="264">draft fix</text>
            <path d="M313 277h10m-5-5v10m-5 9h10m8-14h49m-49 14h34" />
            <path d="m408 284 5 5 11-13" strokeWidth="2.7" />
          </g>
        </g>
        <g>
          <path d="M606 234h132l12 12v61H606z" fill="var(--paper)" />
          <path d="M605 307h147v4H605z" fill="var(--ink)" />
          <text x="678" y="264" textAnchor="middle">GitHub PR</text>
          <g transform="translate(664 274)">
            <path d="M2 0v23m20-22v5q0 9-9 9H2" strokeWidth="2.3" />
            <g fill="var(--paper)"><circle cx="2" r="3.3" /><circle cx="2" cy="23" r="3.3" /><circle cx="22" r="3.3" /></g>
            <g data-part="merge" fill="var(--ink)" stroke="none"><circle cx="2" r="3" /><circle cx="2" cy="23" r="3" /><circle cx="22" r="3" /></g>
          </g>
        </g>
        <g data-part="post-button">
          <circle cx="498" cy="182" r="23" fill="var(--paper)" />
          <circle cx="498" cy="178" r="20" fill="var(--red)" />
        </g>
        <g data-part="fingertip">
          <g transform="translate(501 145) rotate(29)">
            <path d="M-12-60v43q0 18 12 18t12-18v-43" fill="var(--paper)" />
            <path d="M-7-17q6-4 14 0v7q0 5-7 5t-7-6z" fill="var(--hair)" strokeWidth="1" />
            <path d="M-8-31q5 2 10 0" strokeWidth=".9" />
          </g>
        </g>
        <text x="545" y="189">tap to post</text>
      </g>
      <g role="button" tabIndex={0} data-control="post" aria-label="Tap to post the draft fix"
        onClick={post} onKeyDown={event => activateWithKey(event, post)}>
        <rect x="455" y="116" width="223" height="111" rx="9" fill="transparent" stroke="none" />
      </g>
    </PlateFrame>
  );
}
