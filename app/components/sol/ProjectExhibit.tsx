"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProjectId } from "../../lib/portfolio";
import { Arrow } from "./Icons";

function ExhibitTop({ name, status }: { name: string; status: string }) {
  return <div className="exhibit-top"><span><i />{name}</span><span>{status}</span></div>;
}

const memory = [
  { title: "System instructions", type: "PINNED", size: 8, pinned: true },
  { title: "Terminal history", type: "TOOL OUTPUT", size: 18, pinned: false },
  { title: "Earlier source reads", type: "FILE CONTEXT", size: 15, pinned: false },
  { title: "Current plan", type: "PINNED", size: 10, pinned: true },
  { title: "Recent conversation", type: "PROTECTED", size: 25, pinned: true },
];

function AccordionExhibit() {
  const [folded, setFolded] = useState<number[]>([1]);
  const active = 76 - memory.reduce((sum, block, i) => sum + (folded.includes(i) ? block.size : 0), 0);
  return <div className="exhibit accordion-exhibit">
    <ExhibitTop name="accordion / context explorer" status="ILLUSTRATIVE SESSION" />
    <div className="memory-workspace">
      <div className="memory-list"><div className="mini-label">SESSION BLOCKS <span>05</span></div>
        {memory.map((block, i) => {
          const isFolded = folded.includes(i);
          return <button className={`memory-block ${isFolded ? "folded" : ""} ${block.pinned ? "pinned" : ""}`} key={block.title} disabled={block.pinned} aria-expanded={!isFolded} aria-label={`${isFolded ? "Restore" : "Fold"} ${block.title}`} onClick={() => setFolded(previous => previous.includes(i) ? previous.filter(n => n !== i) : [...previous, i])}>
            <span className="block-symbol">{block.pinned ? "⌑" : isFolded ? "+" : "−"}</span><span className="block-text"><b>{block.title}</b><small>{isFolded ? "FOLDED · STILL STORED" : block.type}</small></span><span className="block-size">{isFolded ? "···" : `${block.size}k`}</span>
            {!isFolded && <span className="block-lines" aria-hidden="true"><i /><i /><i /></span>}
          </button>;
        })}
      </div>
      <div className="memory-meter"><div className="mini-label">MODEL’S VIEW</div><div className="token-count" aria-live="polite">{active}<span>k</span></div><p>active tokens</p><div className="token-column" aria-hidden="true">{Array.from({length: 20}, (_, i) => <i key={i} className={i < Math.round(active / 4) ? "filled" : ""} />)}</div><span className="stored-label">76k stored<br /><b>0 deleted</b></span></div>
    </div>
    <div className="exhibit-bottom"><span className="interaction-dot" />Click a file or terminal block to fold / restore.<span className="exhibit-hint">REVERSIBLE BY DESIGN</span></div>
  </div>;
}

function RungExhibit() {
  const [benchmark, setBenchmark] = useState<"fib" | "loop_sum">("fib");
  const ratio = benchmark === "fib" ? 4.54 : 2.26;
  return <div className="exhibit rung-exhibit">
    <ExhibitTop name="rung / benchmark explorer" status="RECORDED RESULTS" />
    <div className="rung-workspace">
      <div className="rung-source"><div className="mini-label">hot_loop.rg <span>C++20 RUNTIME</span></div><pre><code><span className="code-purple">fn</span> <span className="code-green">sum</span>(n) {"{"}{"\n"}  <span className="code-purple">let</span> total = <span className="code-orange">0</span>;{"\n"}  <span className="code-purple">let</span> i = <span className="code-orange">0</span>;{"\n"}  <span className="code-purple">while</span> (i &lt; n) {"{"}{"\n"}    total = (total + i){"\n"}            % <span className="code-orange">1000007</span>;{"\n"}    i = i + <span className="code-orange">1</span>;{"\n"}  {"}"}{"\n"}  <span className="code-purple">return</span> total;{"\n"}{"}"}{"\n"}<span className="code-purple">print</span> sum(<span className="code-orange">10000</span>);</code></pre><div className="source-foot"><span>●</span> SAME SEMANTICS. EVERY ENGINE.</div></div>
      <div className="rung-chart"><div className="mini-label">CHOOSE A BENCHMARK</div><div className="bench-tabs">{(["fib", "loop_sum"] as const).map(name => <button key={name} aria-pressed={benchmark === name} onClick={() => setBenchmark(name)}>{name}</button>)}</div>
        <div className="benchmark-ratio" aria-live="polite">{ratio}<span>×</span></div><p>faster with native code</p>
        <div className="benchmark-bars"><div><span>Register VM</span><b>1.00×</b><i style={{width: `${100 / ratio}%`}} /></div><div className="jit-bar"><span>ARM64 JIT</span><b>{ratio}×</b><i style={{width: "100%"}} /></div></div>
        <p className="chart-caption">Same-session comparison.<br />M1 Pro · higher is faster.</p>
      </div>
    </div>
    <div className="exhibit-bottom"><span className="regression-dot" />NaN-boxing slowed all six benchmarks. I kept the results.</div>
  </div>;
}

const phrases = [{word:"Yes",symbol:"↖"},{word:"No",symbol:"↗"},{word:"Help",symbol:"↙"},{word:"Spell",symbol:"↘"}];

function GazeExhibit() {
  const [active, setActive] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [spoken, setSpoken] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const cancel = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; setActive(null); };
  const select = (i: number) => { if (timer.current) clearTimeout(timer.current); timer.current = null; setSelected(i); setSpoken(false); setActive(null); };
  const hover = (i: number, pointerType: string) => {
    if (pointerType !== "mouse") return;
    if (timer.current) clearTimeout(timer.current);
    setActive(i);
    timer.current = setTimeout(() => select(i), 1000);
  };
  const speak = () => {
    if (selected === null) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(phrases[selected].word === "Spell" ? "Spelling mode" : phrases[selected].word));
      setSpoken(true);
    }
  };
  const eyePosition = active ?? selected;
  return <div className="exhibit gaze-exhibit">
    <ExhibitTop name="gazeboard / dwell interaction" status="NO CAMERA NEEDED" />
    <div className="gaze-workspace">
      <div className="gaze-board">{phrases.map((phrase, i) => <button key={phrase.word} className={`phrase ${active === i ? "dwelling" : ""} ${selected === i ? "selected" : ""}`} onPointerEnter={event => hover(i, event.pointerType)} onPointerLeave={cancel} onClick={() => select(i)} aria-pressed={selected === i}><span>{phrase.symbol}</span><b>{phrase.word}</b><small>{active === i ? "HOLD FOR 1 SECOND" : selected === i ? "SELECTED" : "DWELL OR CLICK"}</small><i className="dwell-progress" /></button>)}
        <div className="gaze-eye" aria-hidden="true"><svg viewBox="0 0 100 65"><path d="M7 32.5Q50-15 93 32.5 50 80 7 32.5Z" fill="#f9f8f3" stroke="#6f8072" strokeWidth="1" /><g style={{transform: `translate(${eyePosition === null ? 0 : eyePosition % 2 === 0 ? -7 : 7}px, ${eyePosition === null ? 0 : eyePosition < 2 ? -5 : 5}px)`}}><circle cx="50" cy="32.5" r="16" fill="#3d654d" /><circle cx="50" cy="32.5" r="7" fill="#183925" /><circle cx="54" cy="28" r="3" fill="white" /></g></svg></div>
      </div>
      <div className="gaze-output"><span className="mini-label">SELECTED PHRASE</span><p aria-live="polite">{selected === null ? "A moment of focus.\nA way to be heard." : selected === 3 ? "Spelling mode." : `${phrases[selected].word}.`}</p><button disabled={selected === null} onClick={speak}>{spoken ? "Speak again" : "Hear phrase"} <span aria-hidden="true">↗</span></button><small>Browser interaction sketch.<br />No eye tracking or camera access.</small></div>
    </div>
    <div className="exhibit-bottom"><span className="interaction-dot" />Hover for 1 second, or select a tile with touch / keyboard.</div>
  </div>;
}

function VisionExhibit() {
  const [view, setView] = useState<"device" | "pipeline">("device");
  return <div className="exhibit vision-exhibit">
    <ExhibitTop name="visionassist / field prototype" status="ON-DEVICE SYSTEM" />
    <div className="vision-tabs"><button aria-pressed={view === "device"} onClick={() => setView("device")}>The device</button><button aria-pressed={view === "pipeline"} onClick={() => setView("pipeline")}>Inside the pipeline</button></div>
    <div className="vision-workspace">{view === "device" ? <div className="device-photo"><Image src="/projects/visionassist-device.jpg" alt="VisionAssist head-mounted Raspberry Pi camera prototype" fill sizes="(max-width: 760px) 90vw, 55vw" /><span className="photo-caption">ACTUAL PROJECT PROTOTYPE</span><span className="photo-corner top-left" /><span className="photo-corner bottom-right" /></div> : <div className="vision-pipeline"><span className="mini-label">PERCEPTION → A SINGLE SPOKEN WARNING</span>{["Camera capture", "YOLOv8n detection", "Approximate distance", "Priority-tier ranking", "Offline neural speech"].map((stage, i) => <div className="pipeline-stage" key={stage}><span>0{i+1}</span><b>{stage}</b>{i === 3 && <small>one event / frame</small>}<Arrow /></div>)}<p>Systemd starts the full loop on power-up.</p></div>}
      <div className="device-specs"><span className="mini-label">FIELD NOTES</span><b>Pi 5</b><span>CPU inference</span><b>~200<span>ms</span></b><span>per frame</span><div className="spec-rule" /><p>No cloud.<br />No laptop.<br />One priority.</p></div>
    </div>
    <div className="exhibit-bottom"><span className="interaction-dot" />Built with Infineon × De Anza College.<span className="exhibit-hint">RESEARCH PROTOTYPE</span></div>
  </div>;
}

const habits = ["Move a little", "Read 20 pages", "Build something"];

function ApexExhibit() {
  const [checked, setChecked] = useState([true, false, true]);
  const count = checked.filter(Boolean).length;
  return <div className="exhibit apex-exhibit">
    <ExhibitTop name="apextracker / a small daily ritual" status="LOCAL-FIRST" />
    <div className="apex-workspace"><div className="apex-caption"><span className="mini-label">DESIGNED AROUND<br />THE EVERYDAY.</span><h4>A little<br />better,<br /><em>daily.</em></h4><p>Offline by default.<br />An account is optional.</p><span className="apex-offline"><i /> NO CONNECTION REQUIRED</span></div>
      <div className="phone"><div className="phone-camera" /><div className="phone-status"><span>9:41</span><span>▰ ▰</span></div><div className="phone-heading"><span>YOUR DAY, AT A GLANCE</span><h4>Make it count<span>.</span></h4><p>Small things add up.</p></div><div className="habit-progress"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="33" fill="none" stroke="#e9e4d9" strokeWidth="6" /><circle cx="40" cy="40" r="33" fill="none" stroke="#b45d36" strokeWidth="6" strokeDasharray={`${count / 3 * 207.35} 207.35`} strokeLinecap="round" transform="rotate(-90 40 40)" /></svg><div><b aria-live="polite">{count}<span>/3</span></b><small>DAILY HABITS</small></div></div><div className="habit-list">{habits.map((habit, i) => <button key={habit} role="checkbox" aria-checked={checked[i]} onClick={() => setChecked(current => current.map((value, index) => index === i ? !value : value))}><span>{habit}</span><i className={checked[i] ? "checked" : ""}>{checked[i] ? "✓" : ""}</i></button>)}</div><div className="phone-nav"><b>Today</b><span>Plan</span><span>Insights</span></div><div className="phone-home" /></div>
    </div>
    <div className="exhibit-bottom"><span className="interaction-dot" />Try checking a habit. Sample data, just for this exhibit.</div>
  </div>;
}

export default function ProjectExhibit({ id }: { id: ProjectId }) {
  switch (id) {
    case "accordion": return <AccordionExhibit />;
    case "rung": return <RungExhibit />;
    case "gazeboard": return <GazeExhibit />;
    case "visionassist": return <VisionExhibit />;
    case "apextracker": return <ApexExhibit />;
  }
}
