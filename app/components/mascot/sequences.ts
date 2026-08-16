import type { FrameId } from "./frames";

/* Timing data only. Holds in ms. Craft parameters from the plan:
   default action hold 85ms (~12fps), accent holds ~270ms, blinks close
   fast / open slow, sleep enters with anticipation and settles slow. */

export interface Step {
  f: FrameId;
  hold: number;
}
export type Sequence = Step[];

const H = 85;
const ACCENT = 270;

export const SEQUENCES = {
  blink: [
    { f: "blink-half", hold: 60 },
    { f: "blink-closed", hold: 80 },
    { f: "blink-half", hold: 55 },
    { f: "idle", hold: 120 },
  ],
  doubleBlink: [
    { f: "blink-half", hold: 55 },
    { f: "blink-closed", hold: 70 },
    { f: "blink-half", hold: 50 },
    { f: "idle", hold: 90 },
    { f: "blink-half", hold: 55 },
    { f: "blink-closed", hold: 75 },
    { f: "blink-half", hold: 55 },
    { f: "idle", hold: 120 },
  ],
  glanceL: [
    { f: "glance-l", hold: 950 },
    { f: "idle", hold: H },
  ],
  glanceR: [
    { f: "glance-r", hold: 950 },
    { f: "idle", hold: H },
  ],
  peerDown: [
    { f: "peer-down", hold: 1200 },
    { f: "idle", hold: H },
  ],
  wave: [
    { f: "wave-a", hold: H },
    { f: "wave-b", hold: 180 },
    { f: "wave-a", hold: H },
    { f: "wave-b", hold: 180 },
    { f: "wave-a", hold: H },
    { f: "idle", hold: ACCENT },
  ],
  sleepEnter: [
    { f: "blink-closed", hold: 130 }, // anticipation blink
    { f: "idle", hold: 110 },
    { f: "drowsy", hold: ACCENT },
    { f: "slump", hold: ACCENT },
    { f: "sleep-a", hold: ACCENT },
  ],
  sleepLoop: [
    { f: "sleep-a", hold: 1350 },
    { f: "sleep-b", hold: 1350 },
  ],
  wake: [
    { f: "startle", hold: ACCENT },
    { f: "idle", hold: H },
  ],
  boop: [
    { f: "boop-squash", hold: 100 },
    { f: "startle", hold: 90 },
    { f: "idle", hold: H },
  ],
  boopRare: [
    { f: "boop-squash", hold: 120 },
    { f: "startle", hold: 120 },
    { f: "boop-squash", hold: 110 },
    { f: "startle", hold: 420 },
    { f: "idle", hold: H },
  ],
} satisfies Record<string, Sequence>;

export type SequenceName = keyof typeof SEQUENCES;
