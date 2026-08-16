/* Temper's test bench, drawn in the site's ink style: same model judged
   bare vs. wrapped in its harness. Static SVG + mono readouts — no JS. */

function InkBox({ x, label, sub }: { x: number; label: string; sub: string }) {
  return (
    <g className="bench-box">
      <path
        d={`M ${x - 34} 26 C ${x - 36} 20 ${x - 31} 16 ${x - 25} 16 L ${x + 25} 15 C ${x + 31} 15 ${x + 36} 19 ${x + 34} 25 L ${x + 35} 65 C ${x + 36} 71 ${x + 31} 75 ${x + 25} 75 L ${x - 25} 76 C ${x - 31} 76 ${x - 36} 72 ${x - 34} 66 Z`}
      />
      <text x={x} y={42} textAnchor="middle" className="bench-label">{label}</text>
      <text x={x} y={60} textAnchor="middle" className="bench-sub">{sub}</text>
    </g>
  );
}

function InkArrow({ x }: { x: number }) {
  return <path className="bench-arrow" d={`M ${x} 45 C ${x + 8} 43 ${x + 16} 47 ${x + 24} 45 M ${x + 17} 39 L ${x + 25} 45 L ${x + 17} 51`} />;
}

export default function TemperBench() {
  return (
    <div className="temper-bench-drawn">
      <svg viewBox="0 0 360 92" role="img" aria-label="Temper's pipeline: a baseline model, the same model with its harness, and a judge comparing them">
        <InkBox x={52} label="MODEL" sub="bare" />
        <InkArrow x={92} />
        <InkBox x={162} label="MODEL" sub="+ harness" />
        <InkArrow x={202} />
        <InkBox x={286} label="JUDGE" sub="6 dims" />
      </svg>
      <div className="bench-readout mono">
        <div><span>INSTRUCTION ADHERENCE</span><b>-27</b><i className="fail">PATCH</i></div>
        <div><span>TOOL ACCURACY</span><b>-41</b><i className="fail">PATCH</i></div>
        <div><span>OUTPUT FORMAT</span><b>-03</b><i>PASS</i></div>
        <div><span>SKILL TRIGGER</span><b>-08</b><i className="fail">PATCH</i></div>
      </div>
    </div>
  );
}
