"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProjectId } from "../../lib/portfolio";
import { Arrow } from "./Icons";

function Accordion() {
  const [folded, setFolded] = useState(false);
  return <div className={`stage stage-accordion ${folded ? "is-folded" : ""}`} data-scene>
    <div className="stage-caption"><span>01 / ACCORDION</span><span>LESS CONTEXT. SAME MEMORY.</span></div>
    <span className="stage-watermark" aria-hidden="true">remember.</span>
    <div className="context-orbit" aria-hidden="true">{["system.md", "terminal.log", "source.ts", "plan.md"].map((name, i) => <div className={`context-sheet sheet-${i}`} key={name} style={{ "--sheet": i } as React.CSSProperties}><div><span>◈</span>{name}<b>{i === 3 ? "PINNED" : folded && i < 3 ? "FOLDED" : "IN MEMORY"}</b></div><span className="sheet-code">{i === 3 ? "Keep what matters." : i === 2 ? "const context = recoverable;" : i === 1 ? "$ tests passed ✓" : "You are building something."}</span><div className="sheet-bars"><i /><i /><i /></div></div>)}</div>
    <div className="stage-bottom"><p>{folded ? "Out of sight. Not out of memory." : "Memory shouldn’t be disposable."}</p><button className="stage-button" aria-pressed={folded} onClick={() => setFolded(!folded)}>{folded ? "Unfold the context" : "Fold the context"}<span>{folded ? "+" : "−"}</span></button></div>
  </div>;
}

function Rung() {
  const [engine, setEngine] = useState(0);
  const names = ["Tree walker", "Stack VM", "Register VM", "ARM64 JIT"];
  return <div className={`stage stage-rung engine-${engine}`} data-scene>
    <div className="stage-caption"><span>02 / RUNG</span><span>FROM A THOUGHT TO MACHINE CODE</span></div>
    <div className="rung-composition"><div className="rung-input"><span>THE SAME PROGRAM</span><code><i>fn</i> sum(n) {"{"}<br />&nbsp; <i>let</i> total = 0;<br />&nbsp; <i>while</i> (i &lt; n) {"{"}<br />&nbsp;&nbsp; total = total + i;<br />&nbsp; {"}"}<br />&nbsp; <i>return</i> total;<br />{"}"}</code></div><div className="processor"><div className="processor-pins" /><div className="processor-chip"><span>RUNG / EXECUTION ENGINE</span><b>{names[engine]}</b><svg viewBox="0 0 120 56" aria-hidden="true"><path d="M4 28h18l10-20 16 40L64 8l15 40 12-20h25" /></svg><small>SAME ANSWER. DIFFERENT PATH.</small></div></div></div>
    <div className="stage-bottom"><p>Explore the execution ladder.<small>Architecture sketch, not a live compiler.</small></p><div className="engine-controls" role="group" aria-label="Explore execution engines">{names.map((name, i) => <button aria-pressed={i === engine} key={name} onClick={() => setEngine(i)} aria-label={name}>{i + 1}</button>)}</div></div>
    <div className="instruction-stream" aria-hidden="true"><span>LOAD → ADD → GUARD → COMPILE → EXECUTE → </span><span>LOAD → ADD → GUARD → COMPILE → EXECUTE → </span></div>
  </div>;
}

const phrases = ["Yes", "No", "Help", "Spell"];
function Gaze() {
  const [phrase, setPhrase] = useState<number | null>(null);
  const [dwelling, setDwelling] = useState<number | null>(null);
  const [speech, setSpeech] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eye = useRef<SVGGElement>(null);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 25;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 18;
      eye.current?.setAttribute("transform", `translate(${x} ${y})`);
    };
    element.addEventListener("pointermove", move);
    return () => { element.removeEventListener("pointermove", move); if (timer.current) clearTimeout(timer.current); };
  }, []);
  function cancel() { if (timer.current) clearTimeout(timer.current); timer.current = null; setDwelling(null); }
  function choose(i: number) { cancel(); setPhrase(i); setSpeech(""); }
  function dwell(i: number, pointerType: string) { if (pointerType !== "mouse") return; cancel(); setDwelling(i); timer.current = setTimeout(() => choose(i), 1000); }
  function speak() {
    if (phrase === null) return;
    if (!("speechSynthesis" in window)) { setSpeech("Speech isn’t supported in this browser."); return; }
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(phrase === 3 ? "Spelling mode" : phrases[phrase]));
    setSpeech("Speak again");
  }
  return <div ref={host} className="stage stage-gaze" data-scene>
    <div className="stage-caption"><span>03 / GAZEBOARD</span><span>A GLANCE. A VOICE.</span></div>
    <div className="gaze-interaction">{phrases.map((word, i) => <button className={`gaze-target target-${i} ${dwelling === i ? "is-dwelling" : ""}`} key={word} aria-pressed={phrase === i} onPointerEnter={event => dwell(i, event.pointerType)} onPointerLeave={cancel} onClick={() => choose(i)}><span>↗</span>{word}<i /></button>)}
      <svg className="living-eye" viewBox="0 0 400 240" role="img" aria-label="An eye that follows your pointer"><defs><radialGradient id="iris"><stop stopColor="#a9bd70" /><stop offset=".7" stopColor="#6e8650" /><stop offset="1" stopColor="#304b38" /></radialGradient></defs><path d="M20 120Q200-65 380 120 200 305 20 120Z" fill="#f6f5e9" stroke="#31503a" strokeWidth="2" /><g ref={eye}><circle cx="200" cy="120" r="68" fill="url(#iris)" />{Array.from({ length: 48 }, (_, i) => <path key={i} d="M200 61v17" stroke="#d2dfad" strokeWidth=".7" transform={`rotate(${i * 7.5} 200 120)`} opacity=".7" />)}<circle cx="200" cy="120" r="30" fill="#20382d" /><circle cx="220" cy="99" r="12" fill="#fff" opacity=".8" /></g><path className="eye-lid" d="M20 120Q200-65 380 120" fill="none" stroke="#31503a" strokeWidth="3" /></svg>
    </div>
    <div className="gaze-result" aria-live="polite">{phrase === null ? "Look at what’s possible." : phrase === 3 ? "Spelling mode." : `${phrases[phrase]}.`}{phrase !== null && <button onClick={speak}>{speech || "Hear it"} <Arrow diagonal /></button>}</div>
    <div className="stage-bottom"><p>Dwell for a second, or click a phrase.<small>A browser sketch. No camera or eye tracking.</small></p><span className="privacy-tag">100% ON YOUR DEVICE</span></div>
  </div>;
}

function Vision() {
  const [pipeline, setPipeline] = useState(false);
  return <div className={`stage stage-vision ${pipeline ? "show-pipeline" : ""}`} data-scene>
    <div className="stage-caption"><span>04 / VISIONASSIST</span><span>SMALL DEVICE. REAL WORLD.</span></div>
    <div className="vision-scene"><div className="vision-photo"><Image src="/projects/visionassist-device.jpg" alt="The actual head-mounted VisionAssist camera and Raspberry Pi prototype" fill sizes="(max-width: 760px) 90vw, 65vw" /><div className="scanner-line" /><span>THE ACTUAL PROTOTYPE / PI 5</span></div>
      <div className="vision-steps">{["See", "Detect", "Prioritize", "Speak"].map((word, i) => <div key={word}><span>0{i+1}</span><b>{word}</b><Arrow /></div>)}<p>Camera → YOLOv8n → one priority → offline speech.</p></div>
    </div>
    <div className="stage-bottom"><p>No cloud round trip.<small>An Infineon × De Anza research prototype.</small></p><button className="stage-button" aria-pressed={pipeline} onClick={() => setPipeline(!pipeline)}>{pipeline ? "See the device" : "See how it works"}<Arrow /></button></div>
  </div>;
}

function Apex() {
  return <div className="stage stage-apex" data-scene>
    <div className="stage-caption"><span>05 / APEXTRACKER</span><span>THE APP I ACTUALLY USE.</span></div>
    <div className="apex-statement" aria-hidden="true">A little<br />better.<br /><span>Every day.</span></div>
    <div className="apex-phone"><div className="apex-phone-camera" /><Image src="/projects/apextracker-dashboard.png" alt="ApexTracker’s actual Android interface, with daily goals and an eight-week consistency grid" width={1080} height={2340} sizes="(max-width: 650px) 200px, 310px" /></div>
    <div className="apex-orbit"><span>OFFLINE</span><span>BY DEFAULT</span><i /></div>
    <div className="stage-bottom"><p>One app. Less mental overhead.<small>Solo-built. Local-first. A daily driver.</small></p><span className="privacy-tag">NO ACCOUNT REQUIRED</span></div>
  </div>;
}

export default function ProjectStage({ id }: { id: ProjectId }) {
  switch (id) {
    case "accordion": return <Accordion />;
    case "rung": return <Rung />;
    case "gazeboard": return <Gaze />;
    case "visionassist": return <Vision />;
    case "apextracker": return <Apex />;
  }
}
