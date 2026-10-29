import { wobRect } from "./ink";

/* Accordion's context map, drawn: some blocks folded to thin bars (still in
   the session, just out of the agent's view), one pinned, and a protected
   recent tail. Static SVG, no JS. */

const X = 14;
const W = 168;

function Folded({ y, label, seed }: { y: number; label: string; seed: number }) {
  return (
    <g>
      <path d={wobRect(X, y, W, 14, seed)} />
      <path className="ink-thin" d={`M ${X + 12} ${y + 12} L ${X + 24} ${y + 2} M ${X + W - 24} ${y + 12} L ${X + W - 12} ${y + 2}`} />
      <text x={X + W / 2} y={y + 10.5} textAnchor="middle" className="ink-sub">{label}</text>
    </g>
  );
}

function Open({ y, label, seed }: { y: number; label: string; seed: number }) {
  return (
    <g>
      <path d={wobRect(X, y, W, 28, seed)} />
      <text x={X + W / 2} y={y + 18} textAnchor="middle" className="ink-label">{label}</text>
    </g>
  );
}

export default function AccordionMap() {
  return (
    <div className="ink-panel">
      <svg viewBox="0 0 360 210" role="img" aria-label="Accordion's context map: folded blocks stay in the session, one block is pinned, and the recent messages are a protected tail">
        <Folded y={8} label="SYSTEM + TOOLS" seed={1} />
        <Open y={32} label="READ src/App.tsx" seed={2} />
        <Folded y={70} label="TERMINAL pytest ✓" seed={3} />
        <Open y={94} label="DIFF +214 −38" seed={4} />
        <Open y={132} label="PLAN.md" seed={5} />
        {/* pin on PLAN.md */}
        <path className="ink-accent" d="M 170 147 L 170 139" />
        <circle className="ink-dot" cx={170} cy={136} r={3} />
        {/* protected tail */}
        <path className="ink-dash" d={wobRect(X - 4, 166, W + 8, 36, 6)} />
        <text x={X + W / 2} y={188} textAnchor="middle" className="ink-label">RECENT · 4 MESSAGES</text>

        {/* annotations */}
        <path className="ink-thin" d="M 188 15 C 208 13, 224 17, 240 17" />
        <text x={246} y={20} className="ink-note">folded, not deleted</text>
        <path className="ink-thin" d="M 188 46 C 208 48, 224 44, 240 44" />
        <text x={246} y={47} className="ink-note">still in the window</text>
        <path className="ink-thin" d="M 186 146 C 206 142, 224 138, 240 138" />
        <text x={246} y={141} className="ink-note ink-accent-t">pinned by you</text>
        <path className="ink-thin" d="M 192 184 C 212 186, 226 188, 240 188" />
        <text x={246} y={191} className="ink-note ink-accent-t">protected tail</text>
      </svg>
      <p className="ink-foot mono">SLOPCODEBENCH / <b>5 OF 6</b> CHECKPOINTS VS <b>2 OF 6</b> FOR NAIVE COMPACTION</p>
    </div>
  );
}
