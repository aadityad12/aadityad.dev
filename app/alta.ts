// Alta's numbers as data, so the AltaBench beats read them instead of retyping them. They repeat the
// values in NOTES.alta (specs, built, beats); change both together. Kept in its own module so the client
// figure does not pull content.ts into its bundle.
export const ALTA = {
  sampleHz: 1200, // Stated: README prose, no recorded run
  reportMs: 50, // Repo: SAMPLE_MS in the firmware
  // TODO(aadi): soak count not recorded in the repo; confirm
  soak: { samples: 1199, seconds: 60, bad: 0 }, // Stated
  trials: { passed: 3, of: 3 }, // Measured
};
