import { BOIL_COUNT, FRAMES } from "./frames";
import type { Frame, FrameId, Slot } from "./frames";
import { SLOTS } from "./frames";

/* Non-performing instances (section peek, about, card cameos): a drawn pose
   whose linework shimmers via pure-CSS cycling of three deterministic
   redraws. No player, no JS. `hoverFrame` renders a second pose revealed by
   CSS on card hover (fine pointers only). */

function FrameGroup({ frame, className }: { frame: Frame; className?: string }) {
  return (
    <g className={className}>
      {SLOTS.map((slot: Slot) => {
        const d = frame.paths[slot];
        if (d === null) return null;
        return <path key={slot} data-slot={slot} d={d} pathLength={1} />;
      })}
      {frame.meta.pupil && (
        <circle className="m-pupil" cx={frame.meta.pupil.cx} cy={frame.meta.pupil.cy} r={frame.meta.pupil.r} />
      )}
    </g>
  );
}

export function StaticMascot({
  pose,
  label,
  hoverFrame,
  className = "",
}: {
  pose: FrameId;
  label: string;
  hoverFrame?: FrameId;
  className?: string;
}) {
  const variants = FRAMES[pose];
  return (
    <svg
      className={`mascot mascot-static ${hoverFrame ? "has-hover" : ""} ${className}`}
      viewBox="0 0 240 240"
      role="img"
      aria-label={label}
      focusable="false"
    >
      {Array.from({ length: BOIL_COUNT }, (_, v) => (
        <FrameGroup key={v} frame={variants[v]} className={`boil-g boil-g${v}`} />
      ))}
      {hoverFrame && <FrameGroup frame={FRAMES[hoverFrame][0]} className="hover-alt" />}
    </svg>
  );
}
