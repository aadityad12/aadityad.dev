/* Deterministic path jitter for the "boiling line" effect.
   HYDRATION CONTRACT: this module must be pure and deterministic — no
   Math.random, no Date, no environment reads. The same seed must produce
   byte-identical output during static prerender (Node) and in the browser. */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Jitter every numeric token in a path string by ±amp, rounded to 1 decimal.
   Only safe for paths built from M/C/L/Z commands with plain coordinates —
   never use on paths containing A (arc flags/radii must not be jittered). */
export function boilPath(d: string, rand: () => number, amp = 1.5): string {
  return d.replace(/-?\d+(?:\.\d+)?/g, (n) => {
    const v = parseFloat(n) + (rand() * 2 - 1) * amp;
    return (Math.round(v * 10) / 10).toString();
  });
}
