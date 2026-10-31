"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useInView } from "./hooks";
import s from "./GazeBoardDemo.module.css";

type Mode = "calib" | "phrases" | "spell" | "words";
type St = { mode: Mode; seq: number[] };
type Pt = { x: number; y: number };
type View = { raw: Pt | null; sm: Pt | null; trail: Pt[]; q: number; ms: number; cool: boolean; flash: number };

const STATE_NAME: Record<Mode, string> = { calib: "Calibrating", phrases: "QuickPhrases", spell: "Spelling", words: "WordSelection" };
const PHRASES = ["Yes", "No", "Help", "Spell"];
const GROUPS = ["A–G", "H–M", "N–S", "T–Z"];
const RANGES: [string, string][] = [["a", "g"], ["h", "m"], ["n", "s"], ["t", "z"]];
// Built-in demo list in priority order. The real app ships a 378-line ordered list.
const WORDS = (
  "water,help,pain,yes,no,thanks,hello,bathroom,tired,cold,hot,hungry,thirsty,mom,dad,doctor,nurse,medicine,music,light," +
  "bed,sit,stand,more,stop,please,sorry,love,happy,sad,home,now,later,book,phone,open,close,outside,food,drink," +
  "family,friend,good,bad,okay,wait,go,come,call,sleep,wash,turn,move,up,down,read,write,TV,window,door," +
  "chair,warm,blanket,pillow,glasses,hurt,sick,better,yesterday,today,tomorrow,morning,night,eat,juice,tea,coffee,walk,help me,thank you"
).split(",");
const DWELL = 1000;
const COOL = 500;
const CAL_MS = 1500;
const CORNERS: Pt[] = [{ x: 0.1, y: 0.06 }, { x: 0.9, y: 0.06 }, { x: 0.1, y: 0.94 }, { x: 0.9, y: 0.94 }];
const EMPTY: View = { raw: null, sm: null, trail: [], q: -1, ms: 0, cool: false, flash: -1 };

const letters = (w: string) => w.toLowerCase().replace(/[^a-z]/g, "");
const matches = (seq: number[]) =>
  WORDS.filter((w) => {
    const l = letters(w);
    return l.length >= seq.length && seq.every((g, i) => l[i] >= RANGES[g][0] && l[i] <= RANGES[g][1]);
  });
const quadOf = (p: Pt) => (p.x < 0.5 ? 0 : 1) + (p.y < 0.5 ? 0 : 2);
const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const signed = (v: number) => `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(2)}`;

export default function GazeBoardDemo() {
  const [st, setSt] = useState<St>({ mode: "phrases", seq: [] });
  const [view, setView] = useState<View>(EMPTY);
  const [log, setLog] = useState<string[]>([]);
  const [sound, setSound] = useState(false);
  const [cal, setCal] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const stRef = useRef(st);
  const soundRef = useRef(sound);
  const raw = useRef<Pt | null>(null);
  const sm = useRef<Pt | null>(null);
  const trail = useRef<Pt[]>([]);
  const dwell = useRef({ q: -1, ms: 0 });
  const coolUntil = useRef(0);
  const flash = useRef({ q: -1, until: 0 });
  const raf = useRef(0);
  const lastT = useRef(0);
  const reducedRef = useRef(false);
  const calTimer = useRef(0);

  useEffect(() => { stRef.current = st; }, [st]);
  useEffect(() => { soundRef.current = sound; }, [sound]);
  useEffect(() => { reducedRef.current = matchMedia("(prefers-reduced-motion: reduce)").matches; }, []);

  const say = (w: string) => {
    setLog((l) => [...l.slice(-5), w]);
    if (soundRef.current && typeof speechSynthesis !== "undefined") {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(w));
    }
  };

  const select = (q: number) => {
    const cur = stRef.current;
    let next: St = cur;
    if (cur.mode === "calib") return;
    if (cur.mode === "phrases") {
      if (q === 3) next = { mode: "spell", seq: [] };
      else say(PHRASES[q]);
    } else if (cur.mode === "spell") {
      const seq = [...cur.seq, q];
      next = { mode: seq.length >= 2 || matches(seq).length <= 3 ? "words" : "spell", seq };
    } else {
      if (q === 3) next = { mode: "spell", seq: cur.seq };
      else {
        const w = matches(cur.seq)[q];
        if (!w) return;
        say(w);
        next = { mode: "phrases", seq: [] };
      }
    }
    stRef.current = next;
    setSt(next);
    const now = performance.now();
    coolUntil.current = now + COOL;
    flash.current = { q, until: now + 220 };
    dwell.current = { q, ms: 0 };
  };

  const frame = (t: number) => {
    const dt = Math.min(64, lastT.current ? t - lastT.current : 16);
    lastT.current = t;
    const r = raw.current;
    if (r) {
      const p = sm.current;
      const a = reducedRef.current ? 1 : 1 - Math.exp(-dt / 90);
      sm.current = p ? { x: p.x + a * (r.x - p.x), y: p.y + a * (r.y - p.y) } : r;
      trail.current = reducedRef.current ? [] : [...trail.current.slice(-9), sm.current];
      const q = quadOf(sm.current);
      if (t < coolUntil.current || stRef.current.mode === "calib") dwell.current = { q, ms: 0 };
      else if (q !== dwell.current.q) dwell.current = { q, ms: 0 };
      else {
        dwell.current.ms += dt;
        if (dwell.current.ms >= DWELL) select(q);
      }
    }
    const cool = t < coolUntil.current;
    const fl = t < flash.current.until ? flash.current.q : -1;
    setView({ raw: r, sm: r ? sm.current : null, trail: r ? trail.current : [], q: dwell.current.q, ms: dwell.current.ms, cool, flash: fl });
    if (r || cool || fl >= 0) raf.current = requestAnimationFrame(frame);
    else { raf.current = 0; lastT.current = 0; }
  };
  const kick = () => { if (!raf.current) raf.current = requestAnimationFrame(frame); };

  useEffect(() => {
    if (!inView) { raw.current = null; }
    return () => { cancelAnimationFrame(raf.current); raf.current = 0; };
  }, [inView]);
  useEffect(() => () => {
    window.clearInterval(calTimer.current);
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  }, []);

  const setGaze = (p: Pt | null) => {
    raw.current = p;
    if (!p) { sm.current = null; trail.current = []; }
    kick();
  };
  const fromPointer = (e: PointerEvent) => {
    const b = board.current?.getBoundingClientRect();
    if (!b) return;
    const x = (e.clientX - b.left) / b.width;
    const y = (e.clientY - b.top) / b.height;
    setGaze(x < 0 || x > 1 || y < 0 || y > 1 ? null : { x, y });
  };
  const onKey = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    const cur = raw.current ? quadOf(raw.current) : -1;
    const col = cur < 0 ? -1 : cur % 2;
    const row = cur < 0 ? -1 : cur >> 1;
    let q = -1;
    if (k === "arrowleft" || k === "a") q = (row < 0 ? 0 : row) * 2;
    else if (k === "arrowright" || k === "d") q = (row < 0 ? 0 : row) * 2 + 1;
    else if (k === "arrowup" || k === "w") q = col < 0 ? 0 : col;
    else if (k === "arrowdown" || k === "s") q = 2 + (col < 0 ? 0 : col);
    else if (k === "enter" || k === " ") {
      e.preventDefault();
      if (cur >= 0) select(cur);
      return;
    } else return;
    e.preventDefault();
    setGaze({ x: q % 2 ? 0.75 : 0.25, y: q >> 1 ? 0.75 : 0.25 });
  };

  const home = () => {
    window.clearInterval(calTimer.current);
    const next: St = { mode: "phrases", seq: [] };
    stRef.current = next;
    setSt(next);
    dwell.current = { q: -1, ms: 0 };
  };
  const calibrate = () => {
    window.clearInterval(calTimer.current);
    const next: St = { mode: "calib", seq: [] };
    stRef.current = next;
    setSt(next);
    setCal(0);
    const t0 = performance.now();
    calTimer.current = window.setInterval(() => {
      const el = performance.now() - t0;
      if (el >= CAL_MS * 4) home();
      else setCal(el);
    }, 50);
  };

  const cands = st.mode === "spell" || st.mode === "words" ? matches(st.seq) : [];
  const labels =
    st.mode === "phrases" ? PHRASES : st.mode === "spell" ? GROUPS : st.mode === "words" ? [cands[0] ?? "–", cands[1] ?? "–", cands[2] ?? "–", "More letters"] : [];
  const subs =
    st.mode === "phrases" ? ["speaks", "speaks", "speaks", "A–Z mode"]
      : st.mode === "spell" ? GROUPS.map((_, g) => `${matches([...st.seq, g]).length} words`)
        : st.mode === "words" ? ["word", "word", "word", "keep spelling"] : [];
  const yaw = view.sm ? (view.sm.x - 0.5) * 0.6 : 0;
  const pitch = view.sm ? (0.5 - view.sm.y) * 0.6 : 0;
  const ring = (q: number) => {
    const active = view.q === q && !!view.raw;
    const p = view.cool && view.q === q ? 1 : active ? Math.min(1, view.ms / DWELL) : 0;
    return (
      <svg viewBox="0 0 40 40" className={`${s.ring} ${view.cool && view.q === q ? s.cool : ""}`} aria-hidden="true">
        <circle cx="20" cy="20" r="16" className={s.track} />
        <circle cx="20" cy="20" r="16" className={s.prog} strokeDasharray={`${(p * 100.53).toFixed(2)} 200`} transform="rotate(-90 20 20)" />
      </svg>
    );
  };
  const calIdx = Math.min(3, Math.floor(cal / CAL_MS));

  return (
    <div ref={root} className={s.root}>
      <div className={s.main}>
        <div className={s.phone}>
          <div className={s.notch} aria-hidden="true"><i /></div>
          <div
            ref={board}
            className={s.board}
            tabIndex={0}
            role="button"
            aria-roledescription="gaze board"
            data-keys
            aria-label={`GazeBoard, ${STATE_NAME[st.mode]}. Arrow keys or WASD move gaze between quadrants; hold for one second or press Enter to select.`}
            onPointerMove={fromPointer}
            onPointerDown={fromPointer}
            onPointerUp={(e) => { if (e.pointerType !== "mouse") setGaze(null); }}
            onPointerLeave={() => setGaze(null)}
            onPointerCancel={() => setGaze(null)}
            onKeyDown={onKey}
            onBlur={() => setGaze(null)}
          >
            {st.mode === "calib" ? (
              <div className={s.calib}>
                {CORNERS.map((c, i) => (
                  <span key={i} className={`${s.target} ${i === calIdx ? s.tOn : i < calIdx ? s.tDone : ""}`} style={{ left: pct(c.x), top: pct(c.y) }}>
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <circle cx="20" cy="20" r="15" className={s.track} />
                      <circle cx="20" cy="20" r="15" className={s.prog} transform="rotate(-90 20 20)"
                        strokeDasharray={`${((i < calIdx ? 1 : i === calIdx ? (cal - i * CAL_MS) / CAL_MS : 0) * 94.25).toFixed(2)} 200`} />
                      <circle cx="20" cy="20" r="3" className={s.dot} />
                    </svg>
                  </span>
                ))}
                <p className={s.calTxt}>Look at corner {calIdx + 1} of 4<br />1.5 s sample</p>
              </div>
            ) : (
              labels.map((l, q) => (
                <div
                  key={q}
                  className={`${s.quad} ${view.raw && view.q === q ? s.on : ""} ${view.flash === q ? s.flash : ""} ${l === "–" ? s.empty : ""}`}
                >
                  {ring(q)}
                  <b className={st.mode === "spell" ? s.mono : ""}>{l}</b>
                  <span>{subs[q]}</span>
                </div>
              ))
            )}
            {view.trail.length > 1 && (
              <svg className={s.trail} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polyline points={view.trail.map((p) => `${(p.x * 100).toFixed(2)},${(p.y * 100).toFixed(2)}`).join(" ")} />
              </svg>
            )}
            {view.raw && <i className={s.raw} style={{ left: pct(view.raw.x), top: pct(view.raw.y) }} />}
            {view.sm && <i className={s.sm} style={{ left: pct(view.sm.x), top: pct(view.sm.y) }} />}
            {!view.raw && st.mode !== "calib" && log.length === 0 && <span className={s.hint}>Move your pointer over the phone</span>}
          </div>
          <div className={s.bar}>
            {st.mode === "spell" || st.mode === "words" ? (
              <span>{st.seq.length ? st.seq.map((g) => GROUPS[g]).join(" · ") : "pick a letter group"} · {cands.length} match{cands.length === 1 ? "" : "es"}</span>
            ) : (
              <span>{STATE_NAME[st.mode]}</span>
            )}
          </div>
        </div>

        <div className={s.side}>
          <span className="lbl">State machine</span>
          <ol className={s.sm4}>
            {(["calib", "phrases", "spell", "words"] as Mode[]).map((m, i) => (
              <li key={m} className={st.mode === m ? s.cur : ""}>
                <span>{STATE_NAME[m]}</span>
                {i < 3 && <em aria-hidden="true">{i === 2 ? "⇅" : "↓"}</em>}
              </li>
            ))}
          </ol>
          <p className={s.note}>A selected word returns to QuickPhrases. Spelling has no other way back except restarting the app; Home below exists only in this demo.</p>
          <div className={s.facts}>
            <span><b>1 s</b> dwell</span>
            <span><b>500 ms</b> cooldown</span>
            <span><b>EMA</b> on pitch, yaw</span>
            <span><b>4 × 1.5 s</b> calibration</span>
          </div>
          <div className="ctl">
            <button className="btn" onClick={home}>Home (demo only)</button>
            <button className="btn" onClick={calibrate} disabled={st.mode === "calib"}>Calibrate</button>
            <button className="btn" aria-pressed={sound} onClick={() => setSound(!sound)}>Sound {sound ? "on" : "off"}</button>
          </div>
          <div className={s.legend}>
            <span><i className={s.kRaw} />raw gaze</span>
            <span><i className={s.kSm} />EMA-smoothed</span>
          </div>
          <p className={s.note}>Demo word list: {WORDS.length} words in priority order (the app ships 378). A word matches when its i-th letter falls in the i-th chosen group.</p>
        </div>
      </div>

      <div className={s.log} aria-live="polite">
        {log.length ? log.map((w, i) => <span key={i}>Said: <b>{w}</b></span>) : <span className={s.dim}>Nothing said yet</span>}
      </div>
      <div className={s.debug}>
        <span><em>STATE</em> {STATE_NAME[st.mode]}</span>
        <span><em>ACCEL</em> NPU (simulated)</span>
        <span><em>yaw/pitch from pointer</em> {view.sm ? `${signed(yaw)} / ${signed(pitch)}` : "– / –"}</span>
        <span><em>dwell</em> {view.raw && !view.cool ? Math.round(view.ms) : 0} ms</span>
      </div>
    </div>
  );
}
