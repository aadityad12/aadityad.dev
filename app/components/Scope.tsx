"use client";

import { useState } from "react";

type Mode = "metal" | "memory" | "glance" | "sight" | "day";

const MODES: { id: Mode; label: string; screen: string; readout: string }[] = [
  {
    id: "metal",
    label: "Metal",
    screen: "Rung · fib",
    readout: "NaN-boxing on fib, 0.90× the rung before it. The row stayed in the table.",
  },
  {
    id: "memory",
    label: "Memory",
    screen: "Accordion",
    readout: "Cold blocks fold. The 86-line result is still stored, and can come back whole.",
  },
  {
    id: "glance",
    label: "Glance",
    screen: "GazeBoard",
    readout: "Hold a target for one second. The camera frame never leaves the phone.",
  },
  {
    id: "sight",
    label: "Sight",
    screen: "VisionAssist",
    readout: "The chair is the warning. The radar’s close return was not the chair, so it did not ship.",
  },
  {
    id: "day",
    label: "Day",
    screen: "ApexTracker",
    readout: "Five widgets read the phone. Signing in copies the day. It does not create it.",
  },
];

const DIP = "196,96 282,196 368,74";
const FULL = "24,148 110,62 196,96 282,196 368,74 454,108 540,58 626,102 716,28";

export function Scope() {
  const [mode, setMode] = useState<Mode>("metal");
  const current = MODES.find((item) => item.id === mode) ?? MODES[0];

  return (
    <figure className="scope">
      <div className="scope-top">
        <p className="scope-thesis">The interesting part is the limit.</p>
        <p className="scope-live">{current.screen}</p>
      </div>
      <div className={`scope-screen is-${mode}`}>
        <svg className="scope-grid" viewBox="0 0 740 250" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <line key={`h${index}`} x1="0" x2="740" y1={20 + index * 40} y2={20 + index * 40} />
          ))}
          {Array.from({ length: 10 }, (_, index) => (
            <line key={`v${index}`} y1="0" y2="250" x1={20 + index * 78} x2={20 + index * 78} />
          ))}
        </svg>

        {mode === "metal" ? (
          <svg className="scope-plot" viewBox="0 0 740 250" role="img" aria-label="Fib speedup across eight rungs. The trace dips below the previous rung at NaN-boxing, and that row is kept.">
            <line className="scope-axis" x1="24" x2="716" y1="148" y2="148" />
            <text className="scope-axis-label" x="560" y="138">previous rung</text>
            <polyline className="trace" points={FULL} pathLength={100} />
            <polyline className="trace-dip" points={DIP} />
            <circle className="trace-dot" cx="282" cy="196" r="5" />
            <text className="dip-label" x="304" y="214">0.90×</text>
          </svg>
        ) : null}

        {mode === "memory" ? (
          <div className="scope-blocks" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <span key={index} className={index >= 14 ? "scope-cell is-protect" : "scope-cell"} data-kind={index % 4} />
            ))}
          </div>
        ) : null}

        {mode === "glance" ? (
          <div className="scope-dwell" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="46" />
              <circle className="scope-dwell-ring" cx="60" cy="60" r="46" pathLength={100} />
            </svg>
            <strong>Yes</strong>
          </div>
        ) : null}

        {mode === "sight" ? (
          <div className="scope-range" aria-hidden="true">
            <span className="scope-blip is-real" style={{ left: "46%" }} />
            <span className="scope-blip is-ghost" style={{ left: "12%" }} />
            <span className="scope-range-labels"><em>camera</em><em>4 ft</em><em>8 ft</em></span>
          </div>
        ) : null}

        {mode === "day" ? (
          <ul className="scope-day" aria-hidden="true">
            <li>Room</li>
            <li>Widgets</li>
            <li>Alarms</li>
            <li>Receipt</li>
            <li className="is-off">Cloud</li>
          </ul>
        ) : null}

        {mode === "metal" ? <span className="stamp">Kept</span> : null}
        <p className="scope-readout">{current.readout}</p>
      </div>
      <div className="scope-knobs" role="group" aria-label="Which limit to put on the scope">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === mode ? "knob is-on" : "knob"}
            aria-pressed={item.id === mode}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </figure>
  );
}
