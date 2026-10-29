"use client";

import { useState } from "react";

export function Sight() {
  const [source, setSource] = useState<"camera" | "radar">("camera");

  return (
    <div className="sight">
      <svg className="sight-scene" viewBox="0 0 420 210" role="img" aria-label="Example scene. A chair about four feet ahead, and a person farther away, seen from a head-mounted camera.">
        <line x1="28" y1="168" x2="400" y2="168" />
        <text x="36" y="188">camera</text>
        <text x="210" y="188">4 ft</text>
        <text x="330" y="188">8 ft</text>
        <polygon points="48,132 250,78 250,158" />
        <rect x="40" y="118" width="22" height="16" />
        <circle cx="66" cy="126" r="5" />
        <rect x="232" y="78" width="10" height="58" />
        <rect x="214" y="118" width="46" height="8" />
        <rect x="220" y="126" width="6" height="42" />
        <rect x="248" y="126" width="6" height="42" />
        <text x="214" y="70">chair</text>
        <circle cx="352" cy="104" r="8" />
        <line x1="352" y1="112" x2="352" y2="146" />
        <line x1="352" y1="124" x2="338" y2="136" />
        <line x1="352" y1="124" x2="366" y2="136" />
        <line x1="352" y1="146" x2="342" y2="168" />
        <line x1="352" y1="146" x2="364" y2="168" />
        <text x="332" y="92">person</text>
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
