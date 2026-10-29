"use client";

import { useState } from "react";

export function Sight() {
  const [source, setSource] = useState<"camera" | "radar">("camera");

  return (
    <div className="sight">
      <svg className={source === "radar" ? "sight-scene is-radar" : "sight-scene"} viewBox="0 0 760 318" role="img" aria-label="Example scene. A chair about four feet ahead is inside the warning zone. A person at eight feet is farther away. The camera speaks the chair.">
        <rect className="zone zone-warn" x="70" y="206" width="465" height="28" />
        <rect className="zone zone-caution" x="535" y="206" width="155" height="28" />
        <text className="zone-label zone-label-warn" x="300" y="296" textAnchor="middle">warning · under 6 ft</text>
        <text className="zone-label zone-label-caution" x="612" y="296" textAnchor="middle">caution · 6–8 ft</text>
        <line className="floor" x1="40" y1="234" x2="720" y2="234" />
        {[0, 2, 4, 6, 8].map((feet) => (
          <g key={feet} className="tick">
            <line x1={70 + feet * 77.5} x2={70 + feet * 77.5} y1="234" y2="248" />
            <text x={70 + feet * 77.5} y="268" textAnchor="middle">{feet} ft</text>
          </g>
        ))}
        <polygon className="frustum" points="148,196 392,108 392,228" />
        <g className="camera-body">
          <polygon className="cam-top" points="36,188 72,174 154,174 118,188" />
          <rect x="36" y="188" width="82" height="34" rx="4" />
          <circle className="lens" cx="118" cy="205" r="11" />
          <circle className="lens-dot" cx="118" cy="205" r="4" />
          <text x="36" y="162">camera</text>
        </g>
        <g className="chair">
          <rect x="348" y="156" width="96" height="16" rx="3" />
          <rect x="360" y="172" width="12" height="62" />
          <rect x="420" y="172" width="12" height="62" />
          <rect x="386" y="78" width="18" height="94" rx="2" />
          <text x="396" y="66" textAnchor="middle">chair</text>
        </g>
        <g className="badge">
          <rect x="186" y="124" width="132" height="26" rx="13" />
          <text x="252" y="142" textAnchor="middle">warning · 4 ft</text>
        </g>
        <g className="person-fill" transform="translate(640,108)">
          <circle cx="0" cy="16" r="15" />
          <rect x="-18" y="36" width="36" height="42" rx="12" />
          <rect x="-32" y="42" width="14" height="30" rx="7" />
          <rect x="18" y="42" width="14" height="30" rx="7" />
          <rect x="-14" y="74" width="12" height="52" rx="6" />
          <rect x="2" y="74" width="12" height="52" rx="6" />
          <text x="0" y="-6" textAnchor="middle">person</text>
        </g>
        <g className="ghosts">
          <path d="M148 205 q36 -40 8 -62" />
          <path d="M148 205 q78 -8 52 -48" />
          <path d="M148 205 q28 28 6 46" />
          <text x="188" y="146">not the chair</text>
        </g>
      </svg>
      <div className="exhibit-actions" role="group" aria-label="Range source">
        <button type="button" className={source === "camera" ? "btn btn-primary" : "btn"} aria-pressed={source === "camera"} onClick={() => setSource("camera")}>
          Camera estimate
        </button>
        <button type="button" className={source === "radar" ? "btn btn-primary" : "btn"} aria-pressed={source === "radar"} onClick={() => setSource("radar")}>
          Radar range
        </button>
      </div>
      <dl className="readout">
        {source === "camera" ? (
          <>
            <div><dt>Subject</dt><dd>chair</dd></div>
            <div><dt>Why</dt><dd>high risk, then closer</dd></div>
            <div><dt>Said</dt><dd>the chair, not the person</dd></div>
            <div><dt>Person at 8 ft</dt><dd>not announced</dd></div>
          </>
        ) : (
          <>
            <div><dt>Radar</dt><dd>a close reflection</dd></div>
            <div><dt>It knows</dt><dd>range, not identity</dd></div>
            <div><dt>The chair?</dt><dd className="regress">not established</dd></div>
            <div><dt>Shipped</dt><dd className="regress">no</dd></div>
          </>
        )}
      </dl>
    </div>
  );
}
