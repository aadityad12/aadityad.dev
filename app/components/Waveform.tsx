const W = 520;
const H = 118;
const REPEATS = 5; // 240-unit motif, repeated to cover W + 240 for a seamless translateX(-240px) loop

function repeatMotif(motif: string): string {
  let d = "";
  for (let i = 0; i < REPEATS; i++) d += motif;
  return d;
}

// Each motif is exactly 240 units wide and ends where it starts, so the loop is seamless.
const LANES: { label: string; y: number; motif: string; red?: boolean }[] = [
  { label: "CTX", y: 16, motif: "h80 v12 h24 v-12 h64 v12 h24 v-12 h48" }, // mostly high, dips
  { label: "GAZE", y: 46, motif: "h12 v-12 h12 v12 h78 v-12 h12 v12 h90 v-12 h12 v12 h36", red: true },
  { label: "FRAME", y: 76, motif: "h60 v-12 h40 v12 h100 v-12 h40 v12" },
  { label: "SPK", y: 106, motif: "h150 v-12 h30 v12 h60" },
];

export default function Waveform() {
  return (
    <figure className="wave-fig" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} role="presentation">
        {/* lane baselines */}
        {LANES.map((l) => (
          <line key={`b-${l.label}`} x1="34" y1={l.y + 6} x2={W} y2={l.y + 6} stroke="#e9e9e0" strokeWidth="1" />
        ))}
        <g className="wave-scroll">
          {LANES.map((l) => (
            <path
              key={l.label}
              d={`M34,${l.y + 6} ${repeatMotif(l.motif)}`}
              fill="none"
              stroke={l.red ? "#d92b1c" : "#34373d"}
              strokeWidth={l.red ? 1.8 : 1.2}
            />
          ))}
        </g>
        {/* labels drawn on top, not scrolling */}
        {LANES.map((l) => (
          <text key={`t-${l.label}`} className="wave-lane-label" x="0" y={l.y + 9}>
            {l.label}
          </text>
        ))}
      </svg>
      <figcaption>FIG. 0 — EVERYTHING ON THIS PAGE RUNS AGAINST A CLOCK OR A BUDGET.</figcaption>
    </figure>
  );
}
