"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/* A working miniature of GazeBoard, drawn in the site's ink style: a big eye
   whose pupil follows your pointer; dwell on one of the four phrase tiles and
   it "types" the phrase letter-by-letter, then speaks-by-caption. Without JS
   or with reduced motion this renders as a complete static diagram. */

const TILES = [
  { id: "up", label: "YES", x: 120, y: 26 },
  { id: "down", label: "NO", x: 120, y: 174 },
  { id: "left", label: "HELP", x: 26, y: 100 },
  { id: "right", label: "WATER", x: 214, y: 100 },
] as const;

const DWELL_MS = 600;

export default function GazeDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [live, setLive] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const liveTimer = window.setTimeout(() => setLive(true), 0);

    const pupil = svg.querySelector<SVGCircleElement>(".gaze-pupil")!;
    let raf = 0;
    let px = 0, py = 0, tx = 0, ty = 0;
    let dwellTile: string | null = null;
    let dwellStart = 0;
    let typing = 0;

    const quadrant = (nx: number, ny: number): (typeof TILES)[number] | null => {
      if (Math.hypot(nx, ny) < 0.25) return null;
      if (Math.abs(nx) > Math.abs(ny)) return nx < 0 ? TILES[2] : TILES[3];
      return ny < 0 ? TILES[0] : TILES[1];
    };

    const typePhrase = (phrase: string) => {
      window.clearInterval(typing);
      let i = 0;
      setTyped("");
      typing = window.setInterval(() => {
        i += 1;
        setTyped(phrase.slice(0, i));
        if (i >= phrase.length) window.clearInterval(typing);
      }, 90);
    };

    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      px += (tx - px) * 0.12;
      py += (ty - py) * 0.12;
      pupil.setAttribute("cx", String(120 + px * 14));
      pupil.setAttribute("cy", String(100 + py * 11));
      const q = quadrant(px, py);
      const now = performance.now();
      if (q?.id !== dwellTile) {
        dwellTile = q?.id ?? null;
        dwellStart = now;
        setActive(null);
      } else if (q && now - dwellStart > DWELL_MS) {
        dwellStart = Infinity; // fire once per entry
        setActive(q.id);
        typePhrase(q.label);
      }
    };

    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerdown", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerdown", onMove);
      cancelAnimationFrame(raf);
      window.clearInterval(typing);
      window.clearTimeout(liveTimer);
    };
  }, []);

  return (
    <div className="gaze-demo">
      <svg
        ref={svgRef}
        viewBox="0 0 240 200"
        role="img"
        aria-label="Interactive diagram of GazeBoard: an eye that follows your pointer; hold your gaze on a phrase tile to type it"
      >
        {/* four phrase tiles, hand-drawn boxes */}
        {TILES.map((t) => (
          <g key={t.id} className={`gaze-tile ${active === t.id ? "is-active" : ""}`}>
            <path
              d={`M ${t.x - 24} ${t.y - 13} C ${t.x - 25} ${t.y - 17} ${t.x - 21} ${t.y - 19} ${t.x - 17} ${t.y - 19} L ${t.x + 17} ${t.y - 19} C ${t.x + 22} ${t.y - 19} ${t.x + 25} ${t.y - 16} ${t.x + 24} ${t.y - 12} L ${t.x + 24} ${t.y + 12} C ${t.x + 25} ${t.y + 16} ${t.x + 21} ${t.y + 19} ${t.x + 17} ${t.y + 19} L ${t.x - 17} ${t.y + 19} C ${t.x - 22} ${t.y + 19} ${t.x - 25} ${t.y + 16} ${t.x - 24} ${t.y + 12} Z`}
            />
            <text x={t.x} y={t.y + 4} textAnchor="middle">{t.label}</text>
          </g>
        ))}
        {/* the eye */}
        <g className="gaze-eye">
          <path d="M 78 100 C 88 78 106 68 120 68 C 134 68 152 78 162 100 C 152 122 134 132 120 132 C 106 132 88 122 78 100 Z" />
          <path d="M 120 76 C 134 76 144 86 144 99 C 144 112 133 122 119 122 C 106 122 96 112 96 99 C 96 87 106 76 120 76" />
        </g>
        <circle className="gaze-pupil" cx={120} cy={100} r={8} />
      </svg>
      <p className="gaze-output mono" aria-live="polite">
        <span className="gaze-cursor">▮</span> {typed || (live ? "look around…" : "4 gaze directions · dwell to type")}
      </p>
      <p className="media-caption" style={{ marginTop: "4px" } as CSSProperties}>
        {live ? "try it — hold your gaze on a tile" : "dwell-based eye typing, drawn to scale"}
      </p>
    </div>
  );
}
