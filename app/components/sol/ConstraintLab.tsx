"use client";

import { useState } from "react";
import { Arrow } from "./Icons";

const modes = [
  { id: "accordion", label: "Memory", code: "01", constraint: "Finite context. Recoverable memory.", title: "Accordion", top: "CONTEXT", middle: "RELEVANCE", bottom: "MEMORY", value: "5 of 6", unit: "BENCHMARK CHECKPOINTS", note: "Fold the noise. Keep the knowledge." },
  { id: "rung", label: "Runtime", code: "02", constraint: "Same answer. A faster path.", title: "Rung", top: "SOURCE", middle: "BYTECODE", bottom: "ARM64", value: "4.54×", unit: "NATIVE fib / REGISTER VM", note: "From an idea to machine code." },
  { id: "visionassist", label: "Hardware", code: "03", constraint: "Small device. Entirely local.", title: "VisionAssist", top: "PERCEPTION", middle: "PRIORITY", bottom: "PI 5 CPU", value: "~200 ms", unit: "PER FRAME · CPU ONLY", note: "See locally. Speak selectively." },
];

export default function ConstraintLab() {
  const [selected, setSelected] = useState(0);
  const mode = modes[selected];
  return <div className="constraint-lab">
    <div className="lab-top"><span className="eyebrow">FIG. 01 / THE CONSTRAINT LAB</span><span className="lab-live"><i /> INTERACTIVE</span></div>
    <div className={`lab-art mode-${selected}`}>
      <svg viewBox="0 0 560 410" role="img" aria-label={`${mode.title} system illustration: ${mode.top}, ${mode.middle}, ${mode.bottom}`}>
        <defs>
          <pattern id="lab-grid" width="28" height="16" patternUnits="userSpaceOnUse" patternTransform="matrix(1 .5 -1 .5 280 185)"><path d="M28 0H0v16" fill="none" stroke="currentColor" strokeOpacity=".1" strokeWidth=".6" /></pattern>
          <linearGradient id="slab-top" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fafbff" /><stop offset="1" stopColor="#dce2f6" /></linearGradient>
          <linearGradient id="slab-side" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#203da6" /><stop offset="1" stopColor="#536bdb" /></linearGradient>
          <filter id="slab-shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" /></filter>
        </defs>
        <path d="m0 220 280-140 280 140-280 140Z" fill="url(#lab-grid)" />
        <ellipse cx="280" cy="338" rx="116" ry="18" fill="#2345a0" opacity=".12" filter="url(#slab-shadow)" />
        <g className="lab-scaffold" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="1" strokeDasharray="3 5">
          <path d="M140 146v148m280-148v148M280 75v264M140 294l140 70 140-70" />
          <path d="m140 146 140-70 140 70-140 70Z" />
        </g>
        <g className="slab slab-bottom">
          <path d="m140 264 140-70 140 70v19l-140 70-140-70Z" fill="#c5cde7" stroke="#9faed2" strokeWidth=".8" />
          <path d="m140 264 140 70 140-70-140-70Z" fill="#dce3f5" stroke="#9faed2" strokeWidth=".8" />
          <path d="m280 334 140-70v19l-140 70Z" fill="#a5b5df" />
          {Array.from({length: 9}, (_, i) => <path key={i} d={`m${164 + i * 12} ${276 + i * 6}v8`} stroke="#748ec4" strokeWidth="2" />)}
          <path d="m180 264 100-50 100 50-100 50Z" fill="none" stroke="#879ac5" strokeWidth="1" />
          <text x="280" y="270" textAnchor="middle" transform="rotate(-26.565 280 270)" fill="#435b93" className="slab-label">{mode.bottom}</text>
        </g>
        <g className="slab slab-middle">
          <path d="m140 202 140-70 140 70v17l-140 70-140-70Z" fill="url(#slab-side)" stroke="#2548ba" strokeWidth=".8" />
          <path d="m140 202 140-70 140 70-140 70Z" fill="#3155d9" stroke="#6582eb" strokeWidth=".8" />
          <path d="m172 202 108-54 108 54-108 54Z" fill="none" stroke="#7691f3" strokeWidth="1" />
          <g stroke="#95acff" strokeWidth=".8" opacity=".65">{[0,1,2,3].map(i => <g key={i}><path d={`m${188+i*19} ${211+i*9.5} 84-42`} /><path d={`m${216+i*19} ${164+i*9.5} 84 42`} /></g>)}</g>
          <path d="m230 202 50-25 50 25-50 25Z" fill="#2344b9" stroke="#b6c6ff" />
          <text x="280" y="207" textAnchor="middle" transform="rotate(-26.565 280 207)" fill="#fff" className="slab-label">{mode.middle}</text>
        </g>
        <g className="slab slab-top">
          <path d="m140 140 140-70 140 70v14l-140 70-140-70Z" fill="#becbea" stroke="#94a6d1" strokeWidth=".8" />
          <path d="m140 140 140-70 140 70-140 70Z" fill="url(#slab-top)" stroke="#a0b0d5" strokeWidth=".8" />
          <path d="m168 140 112-56 112 56-112 56Z" fill="none" stroke="#c0cbe5" />
          {[0,1,2,3,4].map(i => <path key={i} d={`m${202+i*18} ${124+i*9} 55-27.5 12 6-55 27.5Z`} fill={i === selected + 1 ? "#3155d9" : "#b7c5e7"} />)}
          <text x="280" y="175" textAnchor="middle" transform="rotate(-26.565 280 175)" fill="#3e548c" className="slab-label">{mode.top}</text>
        </g>
        <g className="lab-labels" fill="none" stroke="#8b9cc4" strokeWidth=".8">
          <path d="M366 108h64l20-20h48" /><path d="M176 220h-53l-20 20H52" /><path d="M366 300h45l20 20h65" />
          <circle cx="366" cy="108" r="3" fill="#3155d9" stroke="none" /><circle cx="176" cy="220" r="3" fill="#3155d9" stroke="none" /><circle cx="366" cy="300" r="3" fill="#3155d9" stroke="none" />
        </g>
        <g fill="#687591" className="lab-svg-note"><text x="450" y="78">INPUT</text><text x="50" y="257">PROCESS</text><text x="435" y="340">OUTPUT</text></g>
        <g className="lab-orbit"><circle cx="99" cy="152" r="4" fill="#c3e365" /><path d="M94 152h10m-5-5v10" stroke="#50642b" strokeWidth=".8" /></g>
        <text x="34" y="380" fill="#8b94a8" className="lab-svg-note">37.3541° N / 121.9552° W</text>
        <path d="M500 370v16m-8-8h16" stroke="#8b94a8" />
      </svg>
    </div>
    <div className="lab-readout" aria-live="polite">
      <div><p className="eyebrow">{mode.title} / {mode.constraint}</p><p className="lab-note">{mode.note}</p></div>
      <a href={`#${mode.id}`} aria-label={`Explore ${mode.title}`}><Arrow diagonal /></a>
    </div>
    <div className="lab-controls" role="group" aria-label="Choose a constraint">
      {modes.map((item, i) => <button key={item.id} aria-pressed={selected === i} onClick={() => setSelected(i)}><span>{item.code}</span>{item.label}<span className="mode-dot" /></button>)}
    </div>
  </div>;
}
