import { boilPath, hashString, mulberry32 } from "./boil";

/* The critter as a flipbook: a fixed set of path SLOTS whose `d` data is
   swapped per frame. Frames are recipes over a small part library; each
   compiles to 3 variants (0 = as authored, 1-2 = deterministically jittered
   "boil" redraws). Everything here runs at module scope so server and client
   compute identical data — the hydration contract from boil.ts applies. */

export const SLOTS = [
  "body",
  "slot",
  "antStem",
  "antLoop",
  "legL",
  "legR",
  "armL",
  "armR",
  "armRHand",
  "eye",
  "lid",
  "ledCore",
  "ledHalo",
  "prop",
] as const;
export type Slot = (typeof SLOTS)[number];

/* ---------- part library (wobbly-ink style, 240×240) ---------- */

const BODY = {
  base: "M 74 101 C 71 93 77 87 85 88 C 108 84 149 85 157 89 C 165 90 170 96 168 104 C 171 127 170 151 167 164 C 166 172 160 176 152 175 C 126 178 96 177 83 174 C 76 173 70 168 71 160 C 68 140 71 119 74 101 Z",
  // top edge sags, sides bow out a little — tired chassis
  slump: "M 77 110 C 74 102 80 97 88 98 C 110 99 147 100 154 101 C 162 102 167 107 165 113 C 168 132 167 152 164 164 C 163 172 157 176 149 175 C 125 178 97 177 85 174 C 78 173 72 168 73 160 C 70 143 74 125 77 110 Z",
  // boop: wider and shorter, drawn (not scaled)
  squash: "M 66 112 C 63 104 69 99 78 100 C 104 95 152 96 161 100 C 170 101 176 107 174 114 C 177 132 176 151 173 162 C 172 170 166 174 157 173 C 128 177 92 176 79 173 C 71 172 64 167 65 159 C 62 142 64 126 66 112 Z",
  // startle: narrower and taller
  stretch: "M 80 93 C 77 85 83 79 91 80 C 111 76 145 77 152 81 C 160 82 165 88 163 96 C 166 123 165 150 162 164 C 161 172 155 176 148 175 C 126 178 99 177 87 174 C 80 173 75 168 76 160 C 73 137 77 112 80 93 Z",
};

const SLOT_LINE = {
  base: "M 96 84 C 111 80 130 81 144 84",
  slump: "M 98 94 C 112 91 130 91 143 94",
  squash: "M 90 96 C 108 91 132 92 150 96",
  stretch: "M 100 76 C 113 72 130 73 142 76",
};

const ANT = {
  up: { stem: "M 120 80 C 118 71 121 62 120 55", loop: "M 120 55 C 111 53 111 40 121 40 C 131 41 129 54 120 55" },
  half: { stem: "M 120 90 C 121 82 125 74 128 68", loop: "M 128 68 C 120 63 123 51 132 53 C 141 56 136 68 128 68" },
  droop: { stem: "M 120 90 C 123 85 131 80 137 78", loop: "M 137 78 C 132 71 139 61 147 66 C 154 71 145 80 137 78" },
};

const LEGS = {
  base: {
    l: "M 97 177 C 96 190 97 202 95 212 M 95 212 C 90 214 85 214 80 213",
    r: "M 143 177 C 144 190 143 202 145 212 M 145 212 C 150 214 155 214 160 213",
  },
  bent: {
    l: "M 95 175 C 91 186 92 196 90 206 M 90 206 C 85 208 80 208 75 207",
    r: "M 145 175 C 149 186 148 196 150 206 M 150 206 C 155 208 160 208 165 207",
  },
  dangle: {
    l: "M 106 177 C 106 189 104 199 106 209 M 106 209 C 102 212 98 212 94 212",
    r: "M 134 177 C 134 189 136 199 134 209 M 134 209 C 138 212 142 212 146 212",
  },
};

const ARM_L = {
  rest: "M 72 130 C 64 136 60 144 61 152",
  down: "M 73 134 C 68 143 67 152 68 160",
  knee: "M 74 132 C 70 142 72 150 78 156",
  point: "M 74 128 C 60 124 48 122 36 122",
};

const ARM_R = {
  rest: "M 168 132 C 176 138 180 146 179 154",
  down: "M 167 134 C 172 143 173 152 172 160",
  knee: "M 166 132 C 170 142 168 150 162 156",
  waveMid: "M 168 126 C 179 123 187 118 193 110",
  waveUp: "M 168 121 C 180 113 188 103 192 91",
  wrenchArm: "M 168 128 C 178 132 186 140 191 148",
};

const HAND = {
  wave: "M 192 91 C 190 84 197 79 201 84",
  wrenchA: "M 191 148 C 198 141 206 143 209 150 M 209 150 C 213 143 207 135 199 137",
  wrenchB: "M 191 148 C 199 144 207 148 208 155 M 208 155 C 214 149 210 140 202 140",
};

const EYE = {
  open: "M 120 103 C 136 103 147 114 147 129 C 147 144 135 155 119 155 C 104 155 93 143 93 128 C 93 113 105 103 120 103",
  half: "M 120 118 C 135 118 146 122 146 130 C 146 143 134 154 119 154 C 104 154 94 143 94 130 C 94 122 105 118 120 118",
  wide: "M 120 96 C 138 96 150 109 150 127 C 150 145 136 158 119 158 C 102 158 90 144 90 126 C 90 109 103 96 120 96",
};

const LID = {
  closed: "M 100 129 C 108 137 132 137 140 128 M 143 131 L 148 136",
  sleepy: "M 100 131 C 109 139 131 139 140 130",
};

/* LED drawn as geometry so its "glow" is drawing, not opacity: a filled core
   circle (arc commands — never boiled) plus little ray ticks that alternate
   across boil variants, like a hand-drawn twinkle. */
const LED = {
  core: "M 116 165 A 4 4 0 1 0 124 165 A 4 4 0 1 0 116 165 Z",
  coreSleep: "M 118 165 A 2.5 2.5 0 1 0 123 165 A 2.5 2.5 0 1 0 118 165 Z",
  haloUp: "M 111 159 L 108 156 M 129 159 L 132 156 M 120 155 L 120 151",
  haloSide: "M 110 165 L 105 165 M 130 165 L 135 165",
};

const PROP = {
  sweat: "M 56 78 C 53 83 56 87 59 84 C 61 82 59 78 56 78",
  ledge: "M 20 168 C 90 165 160 165 220 168",
  pointTicks: "M 36 122 L 28 119 M 36 122 L 29 127",
  zzz: "M 152 62 L 163 62 L 152 73 L 163 73 M 168 44 L 176 44 L 168 52 L 176 52",
};

/* peek pose has its own chassis geometry (top half over a ledge) */
const PEEK = {
  body: "M 74 168 C 72 130 76 100 85 92 C 108 86 148 87 156 92 C 165 101 168 131 166 168",
  slot: "M 98 88 C 112 84 130 85 143 88",
  antStem: "M 120 84 C 118 75 121 66 120 59",
  antLoop: "M 120 59 C 111 57 111 44 121 44 C 131 45 129 58 120 59",
  handL: "M 84 168 C 84 160 92 160 92 168",
  handR: "M 148 168 C 148 160 156 160 156 168",
  eye: "M 121 106 C 136 106 146 116 146 130 C 146 144 135 154 120 154 C 105 154 95 143 95 129 C 95 115 106 106 121 106",
};

/* ---------- frame recipes ---------- */

export interface PupilMeta {
  cx: number;
  cy: number;
  r: number;
}
export interface FrameMeta {
  pupil: PupilMeta | null;
}
type FrameRecipe = Partial<Record<Slot, string | null>> & { meta: FrameMeta };
export interface Frame {
  paths: Record<Slot, string | null>;
  meta: FrameMeta;
}

const STAND = {
  body: BODY.base,
  slot: SLOT_LINE.base,
  antStem: ANT.up.stem,
  antLoop: ANT.up.loop,
  legL: LEGS.base.l,
  legR: LEGS.base.r,
  armL: ARM_L.rest,
  armR: ARM_R.rest,
  eye: EYE.open,
  ledCore: LED.core,
};

const RECIPES = {
  idle: { ...STAND, meta: { pupil: { cx: 122, cy: 130, r: 7 } } },
  "blink-half": { ...STAND, eye: EYE.half, meta: { pupil: { cx: 121, cy: 136, r: 5.5 } } },
  "blink-closed": { ...STAND, eye: null, lid: LID.closed, meta: { pupil: null } },
  "glance-l": { ...STAND, meta: { pupil: { cx: 112, cy: 129, r: 7 } } },
  "glance-r": { ...STAND, meta: { pupil: { cx: 132, cy: 129, r: 7 } } },
  "peer-down": { ...STAND, meta: { pupil: { cx: 121, cy: 141, r: 6.5 } } },
  "wave-a": { ...STAND, armR: ARM_R.waveMid, meta: { pupil: { cx: 124, cy: 128, r: 7 } } },
  "wave-b": { ...STAND, armR: ARM_R.waveUp, armRHand: HAND.wave, meta: { pupil: { cx: 124, cy: 127, r: 7 } } },
  drowsy: {
    ...STAND,
    antStem: ANT.half.stem,
    antLoop: ANT.half.loop,
    eye: EYE.half,
    meta: { pupil: { cx: 120, cy: 137, r: 5 } },
  },
  slump: {
    body: BODY.slump,
    slot: SLOT_LINE.slump,
    antStem: ANT.half.stem,
    antLoop: ANT.half.loop,
    legL: LEGS.base.l,
    legR: LEGS.base.r,
    armL: ARM_L.down,
    armR: ARM_R.down,
    eye: EYE.half,
    ledCore: LED.core,
    meta: { pupil: { cx: 120, cy: 139, r: 4.5 } },
  },
  "sleep-a": {
    body: BODY.slump,
    slot: SLOT_LINE.slump,
    antStem: ANT.droop.stem,
    antLoop: ANT.droop.loop,
    legL: LEGS.base.l,
    legR: LEGS.base.r,
    armL: ARM_L.down,
    armR: ARM_R.down,
    lid: LID.sleepy,
    ledCore: LED.coreSleep,
    prop: PROP.zzz,
    meta: { pupil: null },
  },
  "sleep-b": {
    // breathing inbetween: chassis eases a touch lower, zzz omitted so it pulses
    body: "M 77 113 C 74 105 80 100 88 101 C 110 102 147 103 154 104 C 162 105 167 110 165 116 C 168 134 167 153 164 165 C 163 173 157 177 149 176 C 125 179 97 178 85 175 C 78 174 72 169 73 161 C 70 145 74 128 77 113 Z",
    slot: "M 98 97 C 112 94 130 94 143 97",
    antStem: ANT.droop.stem,
    antLoop: ANT.droop.loop,
    legL: LEGS.base.l,
    legR: LEGS.base.r,
    armL: ARM_L.down,
    armR: ARM_R.down,
    lid: LID.sleepy,
    ledCore: LED.coreSleep,
    meta: { pupil: null },
  },
  startle: {
    body: BODY.stretch,
    slot: SLOT_LINE.stretch,
    antStem: ANT.up.stem,
    antLoop: ANT.up.loop,
    legL: LEGS.base.l,
    legR: LEGS.base.r,
    armL: ARM_L.rest,
    armR: ARM_R.rest,
    eye: EYE.wide,
    ledCore: LED.core,
    ledHalo: LED.haloUp,
    meta: { pupil: { cx: 121, cy: 127, r: 8 } },
  },
  "boop-squash": {
    body: BODY.squash,
    slot: SLOT_LINE.squash,
    antStem: ANT.half.stem,
    antLoop: ANT.half.loop,
    legL: LEGS.bent.l,
    legR: LEGS.bent.r,
    armL: ARM_L.rest,
    armR: ARM_R.rest,
    eye: EYE.half,
    ledCore: LED.core,
    meta: { pupil: { cx: 121, cy: 135, r: 6 } },
  },
  peek: {
    body: PEEK.body,
    slot: PEEK.slot,
    antStem: PEEK.antStem,
    antLoop: PEEK.antLoop,
    armL: PEEK.handL,
    armR: PEEK.handR,
    eye: PEEK.eye,
    prop: PROP.ledge,
    meta: { pupil: { cx: 121, cy: 128, r: 8 } },
  },
  work: {
    ...STAND,
    armL: "M 72 132 C 64 138 61 146 62 154",
    armR: ARM_R.wrenchArm,
    armRHand: HAND.wrenchA,
    prop: PROP.sweat,
    meta: { pupil: { cx: 124, cy: 132, r: 7 } },
  },
  "work-turn": {
    ...STAND,
    armL: "M 72 132 C 64 138 61 146 62 154",
    armR: ARM_R.wrenchArm,
    armRHand: HAND.wrenchB,
    meta: { pupil: { cx: 125, cy: 131, r: 7 } },
  },
  perch: {
    ...STAND,
    legL: LEGS.dangle.l,
    legR: LEGS.dangle.r,
    armL: ARM_L.knee,
    armR: ARM_R.knee,
    meta: { pupil: { cx: 118, cy: 133, r: 7 } },
  },
  point: {
    ...STAND,
    legL: LEGS.dangle.l,
    legR: LEGS.dangle.r,
    armL: ARM_L.point,
    armR: ARM_R.knee,
    prop: PROP.pointTicks,
    meta: { pupil: { cx: 111, cy: 131, r: 7 } },
  },
} satisfies Record<string, FrameRecipe>;

export type FrameId = keyof typeof RECIPES;
export const FRAME_IDS = Object.keys(RECIPES) as FrameId[];

/* ---------- compile: 3 deterministic boil variants per frame ---------- */

export const BOIL_COUNT = 3;
const NO_BOIL: Slot[] = ["ledCore"]; // arc commands — flags/radii must not jitter

function compile(id: string, recipe: FrameRecipe): Frame[] {
  return Array.from({ length: BOIL_COUNT }, (_, variant) => {
    const rand = mulberry32(hashString(id) * 31 + variant * 7919 + 1);
    const paths = {} as Record<Slot, string | null>;
    for (const slot of SLOTS) {
      const d = (recipe[slot] as string | null | undefined) ?? null;
      paths[slot] = d && variant > 0 && !NO_BOIL.includes(slot) ? boilPath(d, rand) : d;
    }
    // the LED "twinkles" across variants: rays alternate up / side / none,
    // except where the recipe pins its own halo (e.g. startle) or sleeps
    if (!("ledHalo" in recipe) && recipe.ledCore === LED.core) {
      paths.ledHalo = [LED.haloUp, LED.haloSide, null][variant];
    }
    return { paths, meta: recipe.meta };
  });
}

export const FRAMES = Object.fromEntries(
  Object.entries(RECIPES).map(([id, recipe]) => [id, compile(id, recipe)]),
) as Record<FrameId, Frame[]>;

export const BASE_FRAME = FRAMES.idle[0];
