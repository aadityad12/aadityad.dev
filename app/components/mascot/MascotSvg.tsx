import type { CSSProperties } from "react";
import { SLOTS } from "./frames";
import type { Frame, Slot } from "./frames";

/* Presentational, server-renderable critter: 14 fixed path slots + pupil.
   The FramePlayer mutates d/display/pupil post-mount; without JS this renders
   whatever single frame it is given, complete and static. */

const DRAW_TIMING: Partial<Record<Slot, [delay: number, speed: number]>> = {
  body: [0, 800],
  slot: [350, 350],
  antStem: [450, 300],
  antLoop: [650, 400],
  legL: [500, 450],
  legR: [600, 450],
  armL: [700, 350],
  armR: [750, 400],
  armRHand: [1050, 300],
  eye: [900, 550],
  lid: [900, 550],
  ledHalo: [1600, 250],
  prop: [1250, 400],
};

function SlotPath({ slot, frame }: { slot: Slot; frame: Frame }) {
  const d = frame.paths[slot];
  const [delay, speed] = DRAW_TIMING[slot] ?? [0, 500];
  return (
    <path
      data-slot={slot}
      d={d ?? undefined}
      pathLength={1}
      style={
        {
          display: d === null ? "none" : undefined,
          "--path-delay": `${delay}ms`,
          "--path-speed": `${speed}ms`,
        } as CSSProperties
      }
    />
  );
}

export function MascotSvg({
  frame,
  label,
  className = "",
  withDraw = false,
}: {
  frame: Frame;
  label: string;
  className?: string;
  withDraw?: boolean;
}) {
  return (
    <svg
      className={`mascot mascot-flip ${withDraw ? "draw" : ""} ${className}`}
      viewBox="0 0 240 240"
      role="img"
      aria-label={label}
      focusable="false"
    >
      {SLOTS.filter((s) => s !== "antStem" && s !== "antLoop").map((slot) => (
        <SlotPath key={slot} slot={slot} frame={frame} />
      ))}
      <g className="m-antenna">
        <SlotPath slot="antStem" frame={frame} />
        <SlotPath slot="antLoop" frame={frame} />
      </g>
      <circle
        className="m-pupil"
        cx={frame.meta.pupil?.cx ?? 0}
        cy={frame.meta.pupil?.cy ?? 0}
        r={frame.meta.pupil?.r ?? 0}
        style={
          {
            display: frame.meta.pupil ? undefined : "none",
            "--pop-delay": "1400ms",
          } as CSSProperties
        }
      />
    </svg>
  );
}
