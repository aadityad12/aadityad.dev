// From the repo's generated results tables (median process total ÷ calls, Apple M1 Pro).
export const RUNGS = [
  { id: "01_tree", name: "Tree-walker" },
  { id: "02_stack", name: "Stack VM" },
  { id: "03_goto", name: "+ computed goto" },
  { id: "04_nanbox", name: "+ NaN-boxing" },
  { id: "05_register", name: "Register VM" },
  { id: "06_super", name: "+ superinstructions" },
  { id: "07_ic", name: "+ inline caches" },
  { id: "08_fold", name: "+ constant folding" },
  { id: "09_jit", name: "+ ARM64 JIT" },
];

export const DATA: Record<string, { v: number[]; fallback: boolean }> = {
  fib: { v: [1, 3.8, 4.53, 4.06, 5.71, 5.76, 8.41, 8.55, 38.84], fallback: false },
  loop_sum: { v: [1, 3.8, 5.22, 3.89, 6.82, 10.22, 7.03, 9.9, 22.38], fallback: false },
  sieve: { v: [1, 4.99, 9.04, 5.72, 13.51, 16.81, 16.84, 16.52, 16.15], fallback: true },
  nbody: { v: [1, 4.7, 6.17, 4.8, 6.67, 6.95, 6.96, 6.89, 6.87], fallback: true },
  strcat: { v: [1, 1.3, 1.33, 1.31, 1.35, 1.35, 1.35, 1.38, 1.39], fallback: true },
  closures: { v: [1, 4.04, 4.66, 4.25, 5.11, 5.34, 5.21, 5.39, 5.29], fallback: true },
};
