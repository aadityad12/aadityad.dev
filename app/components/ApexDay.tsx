import { wobRect } from "./ink";

/* ApexTracker's day score, drawn: the number the app gives you each evening
   and the week of consistency behind it. Static SVG, no JS. */

const WEEK = [
  ["M", 34], ["T", 48], ["W", 30], ["T", 58], ["F", 52], ["S", 66], ["S", 76],
] as const;

export default function ApexDay() {
  return (
    <div className="ink-panel apex-day">
      <div className="apex-day-top">
        <div className="apex-score">
          <span className="apex-num">87</span>
          <span className="apex-cap mono">DAY SCORE</span>
        </div>
        <svg viewBox="0 0 186 92" role="img" aria-label="A week of daily goal scores rising from Monday to Sunday">
          {WEEK.map(([d, h], i) => (
            <g key={i}>
              <path d={wobRect(10 + i * 24, 70 - h, 12, h, i + 1, 0.7)} />
              <text x={16 + i * 24} y={86} textAnchor="middle" className="ink-sub">{d}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="ink-foot mono">BUDGET · STUDY · SCREEN TIME · REMINDERS · NOTES · PAPERS</p>
    </div>
  );
}
