"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Tier = "high" | "med" | "low";
type Det = { cls: string; x: number; y: number; w: number; h: number; ft: number; tier: Tier };

const TIER_RANK: Record<Tier, number> = { high: 3, med: 2, low: 1 };
const FRAME_COUNT = 16;
const FRAME_MS = 900; // slowed from 200 ms so a human can follow; budget bar shows real figure

function frame(i: number): Det[] {
  const t = i / (FRAME_COUNT - 1);
  const dets: Det[] = [
    {
      cls: "chair",
      x: 44 - t * 10,
      y: 30 + t * 10,
      w: 13 + t * 9,
      h: 30 + t * 18,
      ft: Math.max(2.5, 9 - i * 0.45),
      tier: "high",
    },
  ];
  if (i >= 3 && i <= 12) {
    dets.push({
      cls: "person",
      x: 72 - (i - 3) * 6.5,
      y: 18,
      w: 12,
      h: 40,
      ft: 8 - (i - 3) * 0.2,
      tier: "med",
    });
  }
  if (i >= 5) {
    dets.push({ cls: "cup", x: 78, y: 80, w: 6, h: 7, ft: 3, tier: "low" });
  }
  if (i >= 8) {
    dets.push({ cls: "car", x: 6 + (i - 8), y: 20, w: 22, h: 16, ft: 24 - (i - 8) * 0.8, tier: "med" });
  }
  return dets;
}

function topEvent(dets: Det[]): Det | null {
  if (!dets.length) return null;
  return [...dets].sort((a, b) => TIER_RANK[b.tier] - TIER_RANK[a.tier] || a.ft - b.ft)[0];
}

function steps(ft: number) {
  return Math.max(1, Math.round(ft / 2.5));
}

export default function VisionDemo() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [infMs, setInfMs] = useState(187);
  const [said, setSaid] = useState("system ready — 5 fps loop, on-device");
  const lastSpoke = useRef({ key: "", frame: -10 });

  const advance = useCallback((next: number) => {
    setIdx(next);
    setInfMs(Math.round(165 + Math.random() * 35));
    const dets = frame(next);
    const top = topEvent(dets);
    if (top) {
      const key = `${top.cls}-${steps(top.ft)}`;
      const last = lastSpoke.current;
      // announce only when the message changes or a ~3 s cooldown expires
      if (key !== last.key || next - last.frame >= 5) {
        lastSpoke.current = { key, frame: next };
        setSaid(`${top.cls} — ${steps(top.ft)} step${steps(top.ft) === 1 ? "" : "s"} ahead`);
      }
    }
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => advance((idx + 1) % FRAME_COUNT), FRAME_MS);
    return () => window.clearInterval(id);
  }, [playing, idx, advance]);

  const dets = frame(idx);
  const ranked = [...dets].sort((a, b) => TIER_RANK[b.tier] - TIER_RANK[a.tier] || a.ft - b.ft);
  const top = ranked[0];

  return (
    <div className="demo" role="region" aria-label="VisionAssist perception-loop demo">
      <div className="demo-head">
        <span className="dot" aria-hidden="true" />
        Fig. 4 — Perception loop, one frame at a time
        <span className="demo-tag">
          YOLOv8n · Pi 5 CPU · <b>~200 ms budget</b>
        </span>
      </div>
      <div className="demo-body">
        <div className="vision-grid">
          <div>
            <div className="vision-scene">
              <span className="vs-frame-tag">
                FRAME {String(idx).padStart(4, "0")} · 5 FPS
              </span>
              <span className="vs-scanline" style={{ left: `${(idx % 8) * 12.5 + 6}%` }} aria-hidden="true" />
              {dets.map((d) => (
                <div
                  key={d.cls}
                  className={`vs-object tier-${d.tier}${top === d ? "" : ""}`}
                  style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.w}%`, height: `${d.h}%` }}
                >
                  <span className="vs-meta">
                    {d.cls} · {d.ft.toFixed(1)} ft
                  </span>
                </div>
              ))}
            </div>
            <div className="vision-controls">
              <button type="button" onClick={() => setPlaying(!playing)}>
                {playing ? "❚❚ Pause" : "▸ Play"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  advance((idx + 1) % FRAME_COUNT);
                }}
              >
                Step ▸
              </button>
            </div>
          </div>

          <div className="vision-side">
            <div className="vision-budget">
              INFERENCE — <span className="vb-val">{infMs} MS</span> / 200 MS BUDGET
              <div className="vb-bar" aria-hidden="true">
                <i style={{ transform: `scaleX(${Math.min(1, infMs / 200)})` }} />
              </div>
            </div>
            <div className="vision-say" aria-live="polite">
              <div className="vsy-label">▸ Piper TTS — speaks one event per frame</div>
              <div className="vsy-text">“{said}”</div>
            </div>
            <div className="vision-rank">
              {ranked.slice(0, 3).map((d, i) => (
                <div key={d.cls} className={`vr-row${i === 0 ? " top" : ""}`}>
                  {i + 1} · {d.cls.toUpperCase()} — {d.tier.toUpperCase()}, {d.ft.toFixed(1)} FT
                </div>
              ))}
              {ranked.length === 0 && <div className="vr-row">no detections</div>}
            </div>
          </div>
        </div>
      </div>
      <div className="demo-foot">
        <span>Rank: risk tier first, then distance — a cup never interrupts a chair</span>
        <span>Distances in steps (2.5 ft each), because “eight feet” is arithmetic mid-stride</span>
      </div>
    </div>
  );
}
