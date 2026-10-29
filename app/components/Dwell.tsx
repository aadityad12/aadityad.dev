"use client";

import { useRef, useState } from "react";

const PHRASES = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
  { id: "help", label: "Help" },
  { id: "water", label: "Water" },
];

const DWELL_MS = 1000;
const RADIUS = 14;
const CIRC = 2 * Math.PI * RADIUS;

export function Dwell() {
  const [spoken, setSpoken] = useState<string | null>(null);
  const frame = useRef(0);
  const active = useRef<HTMLButtonElement | null>(null);

  function resetRing(button: HTMLButtonElement | null) {
    const ring = button?.querySelector<SVGCircleElement>("[data-ring]");
    if (ring) ring.style.strokeDashoffset = String(CIRC);
  }

  function cancel() {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    resetRing(active.current);
    active.current = null;
  }

  function begin(button: HTMLButtonElement) {
    if (active.current === button && frame.current) return;
    cancel();
    active.current = button;
    const ring = button.querySelector<SVGCircleElement>("[data-ring]");
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / DWELL_MS);
      if (ring) ring.style.strokeDashoffset = String(CIRC * (1 - progress));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      frame.current = 0;
      active.current = null;
      setSpoken(button.dataset.phrase ?? null);
      resetRing(button);
    };
    frame.current = requestAnimationFrame(tick);
  }

  const phrase = PHRASES.find((item) => item.id === spoken);

  return (
    <div className="dwell">
      <p className="hint" id="dwell-help">Hold a target for one second. Enter or Space does the same while the target is focused.</p>
      <div className="dwell-grid">
        {PHRASES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={spoken === item.id ? "dwell-tile is-spoken" : "dwell-tile"}
            data-phrase={item.id}
            aria-describedby="dwell-help"
            aria-label={`${item.label}. Hold one second to speak.`}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              begin(event.currentTarget);
            }}
            onPointerUp={cancel}
            onPointerLeave={cancel}
            onPointerCancel={cancel}
            onKeyDown={(event) => {
              if (event.key !== " " && event.key !== "Enter") return;
              event.preventDefault();
              if (event.repeat) return;
              begin(event.currentTarget);
            }}
            onKeyUp={(event) => {
              if (event.key === " " || event.key === "Enter") cancel();
            }}
            onBlur={cancel}
          >
            <span>{item.label}</span>
            <svg className="dwell-ring" viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r={RADIUS} />
              <circle data-ring="" cx="18" cy="18" r={RADIUS} style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC }} />
            </svg>
          </button>
        ))}
      </div>
      <p className="spoken" role="status">
        {phrase ? <>Spoken · {phrase.label}</> : "Nothing spoken yet."}
      </p>
    </div>
  );
}
