"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TILES = [
  { label: "YES", dir: "look ↖ upper left", phrase: "Yes." },
  { label: "NO", dir: "look ↗ upper right", phrase: "No." },
  { label: "WATER", dir: "look ↙ lower left", phrase: "Water, please." },
  { label: "HELP", dir: "look ↘ lower right", phrase: "I need help." },
];

const DWELL_MS = 1000;
const COOLDOWN_MS = 500;
const EMA_ALPHA = 0.18;
const RING_R = 18;
const RING_C = 2 * Math.PI * RING_R;

export default function GazeDemo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<SVGCircleElement>(null);

  const [transcript, setTranscript] = useState<string[]>([]);
  const [locked, setLocked] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [status, setStatus] = useState("idle");

  const sim = useRef({
    tx: 0, // target x (raw pointer)
    ty: 0, // target y (raw pointer)
    cx: 0, // smoothed x (EMA output)
    cy: 0, // smoothed y (EMA output)
    posInit: false,
    dwellTile: -1,
    dwellStart: 0,
    cooldownUntil: 0,
  });

  const select = useCallback((i: number) => {
    setLocked(i);
    setTranscript((t) => [...t.slice(-3), TILES[i].phrase]);
    setStatus(`spoke "${TILES[i].phrase}"`);
    window.setTimeout(() => setLocked((cur) => (cur === i ? null : cur)), 450);
  }, []);

  // rAF loop runs only while the pointer is over the pad
  useEffect(() => {
    if (!hovering) return;
    let raf = 0;
    const loop = () => {
      const s = sim.current;
      const wrap = wrapRef.current;
      const cursor = cursorRef.current;
      if (!wrap || !cursor) return;

      // EMA smoothing — the same trick the app applies to pitch/yaw
      if (!s.posInit) {
        s.cx = s.tx;
        s.cy = s.ty;
        s.posInit = true;
      }
      s.cx += (s.tx - s.cx) * EMA_ALPHA;
      s.cy += (s.ty - s.cy) * EMA_ALPHA;
      cursor.style.transform = `translate(${s.cx}px, ${s.cy}px)`;

      const now = performance.now();
      let hit = -1;
      if (now >= s.cooldownUntil) {
        const wr = wrap.getBoundingClientRect();
        tileRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (s.cx >= r.left - wr.left && s.cx <= r.right - wr.left && s.cy >= r.top - wr.top && s.cy <= r.bottom - wr.top)
            hit = i;
        });
      }

      if (hit !== s.dwellTile) {
        s.dwellTile = hit;
        s.dwellStart = now;
      }
      const dwellT = hit >= 0 ? now - s.dwellStart : 0;
      const frac = Math.min(1, dwellT / DWELL_MS);
      if (progRef.current) {
        progRef.current.style.strokeDashoffset = String(RING_C * (1 - frac));
      }
      cursor.classList.toggle("cooldown", now < s.cooldownUntil);
      if (hit >= 0 && frac >= 1 && now >= s.cooldownUntil) {
        select(hit);
        s.cooldownUntil = now + COOLDOWN_MS;
        s.dwellStart = now;
        s.dwellTile = -1;
      }
      setStatus((prev) => {
        const next =
          now < s.cooldownUntil
            ? "cooldown 500 ms"
            : hit >= 0
              ? `dwelling on ${TILES[hit].label} — ${Math.round(frac * 100)}%`
              : "tracking";
        return prev === next ? prev : next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hovering, select]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const wr = wrapRef.current?.getBoundingClientRect();
    if (!wr) return;
    sim.current.tx = e.clientX - wr.left;
    sim.current.ty = e.clientY - wr.top;
    if (!hovering) setHovering(true);
  };

  const onLeave = () => {
    setHovering(false);
    setStatus("idle");
  };

  return (
    <div className="demo" role="region" aria-label="GazeBoard dwell-selection demo">
      <div className="demo-head">
        <span className="dot" aria-hidden="true" />
        Fig. 2 — Dwell selection
        <span className="demo-tag">
          input: <b>your pointer stands in for an eye</b>
        </span>
      </div>
      <div className="demo-body">
        <div
          className="gaze-wrap"
          ref={wrapRef}
          onPointerMove={onMove}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={onLeave}
        >
          <div className="gaze-grid">
            {TILES.map((t, i) => (
              <button
                key={t.label}
                type="button"
                className={`gaze-tile${locked === i ? " locked" : ""}`}
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                onClick={() => select(i)}
                aria-label={`${t.label} — ${t.dir}. Activate to speak "${t.phrase}"`}
              >
                <span className="gt-label">{t.label}</span>
                <span className="gt-dir">{t.dir}</span>
              </button>
            ))}
          </div>
          <div className="gaze-cursor" ref={cursorRef} aria-hidden="true" style={{ opacity: hovering ? 1 : 0 }}>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle className="gc-ring" cx="22" cy="22" r={RING_R} fill="none" strokeWidth="1.5" />
              <circle
                className="gc-prog"
                ref={progRef}
                cx="22"
                cy="22"
                r={RING_R}
                fill="none"
                strokeWidth="2.5"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C}
                transform="rotate(-90 22 22)"
              />
              <circle className="gc-dot" cx="22" cy="22" r="2.5" />
            </svg>
          </div>
        </div>

        <div className="gaze-transcript" aria-live="polite">
          {transcript.length === 0 ? (
            <span className="gt-hint">Hold the cursor on a tile for 1 s — or just click / press enter.</span>
          ) : (
            transcript.map((line, i) => <div key={`${line}-${i}`}>▸ {line}</div>)
          )}
        </div>
        <div className="gaze-status">
          <span>
            pipeline: CameraX → ML Kit → <b>EyeGaze ≈ 8 ms</b> → EMA {EMA_ALPHA} → dwell 1000 ms
          </span>
          <span>
            state: <b>{status}</b>
          </span>
        </div>
      </div>
      <div className="demo-foot">
        <span>Illustrative sim — the real input is a 96×160 eye crop on the Hexagon NPU</span>
        <span>0 network permissions</span>
      </div>
    </div>
  );
}
