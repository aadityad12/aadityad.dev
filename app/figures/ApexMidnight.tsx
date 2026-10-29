"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "./hooks";
import s from "./ApexMidnight.module.css";

type Fix = "before" | "after";
type Path = "widget" | "app";
type Seg = { a: number; b: number; wrong?: boolean };

// Minutes after 22:00 on Monday. The axis spans 22:00 to 02:00.
const SPAN = 240;
const START = 70; // 23:10
const MID = 120; // 00:00
const STOP = 170; // 00:50
const EARLIER = 80; // Monday study logged before this session (illustrative)
const GOAL = 120; // "Study 2h"
const SWEEP_MS = 3400;

const pct = (m: number) => +((m / SPAN) * 100).toFixed(2);
const pad = (n: number) => String(n).padStart(2, "0");
const clock = (m: number) => {
  const t = (22 * 60 + Math.round(m)) % 1440;
  return `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
};
const hm = (m: number) => `${Math.floor(m / 60)}h ${pad(m % 60)}m`;

function bank(fix: Fix, path: Path): { mon: Seg[]; tue: Seg[] } {
  if (fix === "after") return { mon: [{ a: START, b: MID }], tue: [{ a: MID, b: STOP }] };
  if (path === "widget") return { mon: [{ a: START, b: MID }, { a: MID, b: STOP, wrong: true }], tue: [] };
  return { mon: [], tue: [{ a: START, b: MID, wrong: true }, { a: MID, b: STOP }] };
}

const HI = 4;
const LO = 20;
function wave(segs: Seg[]) {
  let d = `M0 ${LO}`;
  for (const g of segs) d += ` H${g.a} V${HI} H${g.b} V${LO}`;
  return `${d} H${SPAN}`;
}

function Track({ segs, upTo, children }: { segs: Seg[]; upTo: number; children?: React.ReactNode }) {
  return (
    <div className={s.track} style={{ clipPath: `inset(0 ${(100 - pct(upTo)).toFixed(2)}% 0 0)` }}>
      <svg viewBox={`0 0 ${SPAN} 24`} preserveAspectRatio="none" aria-hidden="true">
        {segs.map((g, i) => (
          <rect key={i} x={g.a} y={HI} width={g.b - g.a} height={LO - HI} className={g.wrong ? s.wrongFill : s.fill} />
        ))}
        <path d={wave(segs)} className={s.sig} vectorEffect="non-scaling-stroke" />
      </svg>
      {children}
    </div>
  );
}

const SHOTS = [
  { src: "/projects/apextracker-dashboard.jpg", cap: "Dashboard", alt: "ApexTracker dashboard: the day's goals and the consistency heatmap" },
  { src: "/projects/apextracker-study.jpg", cap: "Study timer", alt: "ApexTracker study timer screen" },
  { src: "/projects/apextracker-insights.jpg", cap: "Insights", alt: "ApexTracker daily insights screen" },
];

export default function ApexMidnight() {
  const [fix, setFix] = useState<Fix>("before");
  const [path, setPath] = useState<Path>("widget");
  const [t, setT] = useState(SPAN);
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const played = useRef(false);
  const inView = useInView(ref);
  const reduced = useReducedMotion();

  const play = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (reduced) { setT(SPAN); return; }
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / SWEEP_MS);
      setT(Math.round(p * SPAN));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [reduced]);

  useEffect(() => {
    if (inView && !played.current && !reduced) {
      played.current = true;
      play();
    }
  }, [inView, reduced, play]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const b = bank(fix, path);
  const stopped = t >= STOP;
  const sum = (segs: Seg[]) => segs.reduce((n, g) => n + g.b - g.a, 0);
  const monAdd = stopped ? sum(b.mon) : 0;
  const tueAdd = stopped ? sum(b.tue) : 0;
  const mon = EARLIER + monAdd;
  const met = mon >= GOAL;
  const who = path === "widget" ? "Widget" : "App";
  const session: Seg[] = [{ a: START, b: STOP }];
  const strobe: Seg[] = [{ a: STOP - 1.5, b: STOP + 1.5 }];

  const label = (segs: Seg[], add: number) =>
    stopped && add > 0 ? (
      <span className={s.amt} style={{ left: `${pct((segs[0].a + segs[0].b) / 2)}%` }}>+{add} min</span>
    ) : null;
  const wrongTag = (segs: Seg[]) => {
    const w = segs.find((g) => g.wrong);
    return stopped && w ? <span className={s.wrongTag} style={{ left: `${pct((w.a + w.b) / 2)}%` }}>wrong day</span> : null;
  };

  const summary = !stopped
    ? `Session running, ${clock(t)}.`
    : fix === "before"
      ? `Before fix, stopped from the ${who.toLowerCase()}: all ${STOP - START} minutes banked to ${path === "widget" ? "Monday" : "Tuesday"}. ${path === "widget" ? "Fifty of those minutes were Tuesday's" : "Fifty of those minutes were Monday's"}. Monday ${hm(mon)}, Study 2h ${met ? "met" : "missed"}.`
      : `After fix, stopped from the ${who.toLowerCase()}: 50 minutes to Monday, 50 to Tuesday. Monday ${hm(mon)}, Study 2h met. Same result from either button.`;

  return (
    <div ref={ref} className={s.root}>
      <div className={s.ctlRow}>
        <div className="ctl" role="group" aria-label="Code version">
          <button className="btn" aria-pressed={fix === "before"} onClick={() => setFix("before")}>Before fix</button>
          <button className="btn" aria-pressed={fix === "after"} onClick={() => setFix("after")}>After fix</button>
        </div>
        <div className="ctl" role="group" aria-label="Stop the timer from">
          <span className="lbl">Stop from</span>
          <button className="btn" aria-pressed={path === "widget"} onClick={() => setPath("widget")}>Widget</button>
          <button className="btn" aria-pressed={path === "app"} onClick={() => setPath("app")}>App</button>
        </div>
        <button className="btn" onClick={play} aria-label="Replay the session">Replay ▶</button>
      </div>

      <div className={s.diagram} role="img" aria-label={`Timing diagram, 22:00 to 02:00. A study session runs from 23:10 to 00:50, across the midnight day boundary. ${summary}`}>
        <div className={s.labels} aria-hidden="true">
          <span className={s.headSp} />
          <span>Session</span>
          <span>Stop</span>
          <span>Banked<b>→ MON</b></span>
          <span>Banked<b>→ TUE</b></span>
          <span className={s.footSp} />
        </div>
        <div className={s.plot} aria-hidden="true">
          <div className={s.days}>
            <span>◀ MON</span>
            <span className={s.bLbl}>00:00 · day boundary</span>
            <span>TUE ▶</span>
          </div>
          <div className={s.axis}>
            {[0, 60, 120, 180, 240].map((m) => (
              <span key={m} style={{ left: `${pct(m)}%` }}>{clock(m)}</span>
            ))}
          </div>
          <Track segs={session} upTo={Math.min(t, SPAN)} />
          <Track segs={stopped ? strobe : []} upTo={t}>
            {stopped && <span className={s.who} style={{ left: `${pct(STOP)}%` }}>{who.toUpperCase()}</span>}
          </Track>
          <Track segs={stopped ? b.mon : []} upTo={SPAN}>{label(b.mon, monAdd)}{wrongTag(b.mon)}</Track>
          <Track segs={stopped ? b.tue : []} upTo={SPAN}>{label(b.tue, tueAdd)}{wrongTag(b.tue)}</Track>
          <div className={s.marks}>
            <span style={{ left: `${pct(START)}%` }}>23:10</span>
            <span style={{ left: `${pct(STOP)}%` }}>00:50</span>
          </div>
          <i className={s.boundary} style={{ left: `${pct(MID)}%` }} />
          <i className={s.tick} style={{ left: `${pct(START)}%` }} />
          <i className={s.tick} style={{ left: `${pct(STOP)}%` }} />
          {t < SPAN && <i className={s.playhead} style={{ left: `${pct(t)}%` }} />}
        </div>
      </div>

      <div className={s.result}>
        <div className={s.graph} aria-label="Call graph">
          <span className="lbl">{fix === "before" ? "Two copies of the logic" : "One shared file"}</span>
          <svg viewBox="0 0 280 46" className={s.cg} role="img"
            aria-label={fix === "before" ? "WidgetPath calls bank with the start day; AppPath calls bank with the stop day" : "WidgetPath and AppPath both call StudyTimer.bank()"}>
            <text x="0" y="14" className={path === "widget" ? s.on : s.off}>WidgetPath</text>
            <text x="0" y="40" className={path === "app" ? s.on : s.off}>AppPath</text>
            {fix === "before" ? (
              <>
                <g className={path === "widget" ? s.on : s.off}><path d="M76 10 H122" /><path d="M122 6 L130 10 L122 14 Z" /><text x="136" y="14">bank(startDay)</text></g>
                <g className={path === "app" ? s.on : s.off}><path d="M76 36 H122" /><path d="M122 32 L130 36 L122 40 Z" /><text x="136" y="40">bank(stopDay)</text></g>
              </>
            ) : (
              <>
                <path d="M76 10 H100 V23" className={path === "widget" ? s.on : s.off} />
                <path d="M76 36 H100 V23" className={path === "app" ? s.on : s.off} />
                <g className={s.on}><path d="M100 23 H122" /><path d="M122 19 L130 23 L122 27 Z" /><circle cx="100" cy="23" r="2.4" /><text x="136" y="27">StudyTimer.bank()</text></g>
              </>
            )}
          </svg>
        </div>
        <div className={s.chips}>
          <div className={s.chip}>
            <span className="lbl">MON total</span>
            <b>{hm(mon)}</b>
            <span className={`${s.goal} ${met ? s.met : s.miss}`}>Study 2h · {met ? "met" : "missed"}</span>
          </div>
          <div className={s.chip}>
            <span className="lbl">TUE total</span>
            <b>{hm(tueAdd)}</b>
            <span className={s.goal}>day open</span>
          </div>
        </div>
      </div>

      <p className={`readout ${s.live}`} aria-live="polite">{summary}</p>
      <p className={s.note}>
        Illustrative: the before-fix rules, the {hm(EARLIER)} studied earlier on Monday, the split at midnight, and the function names. Documented: the widget and the in-app button now bank time through one shared file.
      </p>

      <div className={s.shots}>
        {SHOTS.map((sh) => (
          <figure key={sh.src} className={s.phone}>
            <Image src={sh.src} alt={sh.alt} width={600} height={1300} sizes="(max-width: 600px) 30vw, 160px" />
            <figcaption>{sh.cap}</figcaption>
          </figure>
        ))}
        <span className={s.shotsLbl}>Real screenshots from the app</span>
      </div>
    </div>
  );
}
