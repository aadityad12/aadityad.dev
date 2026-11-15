// Alta's numbers as data, so the AltaBench beats read them instead of retyping them. They repeat the
// values in NOTES.alta (specs, built, beats); change both together. Kept in its own module so the client
// figure does not pull content.ts into its bundle. Source: the Alta README's measured results.
export const ALTA = {
  sampleHz: 1200, // each probe is sampled about 1,200 times a second
  reportMs: 50, // SAMPLE_MS in the firmware: one JSON line every 50 ms
  soak: { samples: 1200, seconds: 60, bad: 0 }, // a 60 s soak at one line per 50 ms is 1,200 lines
  trials: { passed: 3, of: 3 }, // real-board runs that found and fixed the fault
  realBoardSeconds: [205, 110, 322], // LED in backwards, missing ground wire, 10 kΩ instead of 220 Ω
  speakMedianS: 2.57, // from releasing the talk button to Alta starting to speak
  transcriptMedianS: 0.55,
  simulated: { named: 42, of: 42, confirmed: 41 }, // 7 faults, 3 runs each, graded by a second model
  serverTests: 195,
  speakFirstS: { before: 4.7, after: 1.9 },
};
