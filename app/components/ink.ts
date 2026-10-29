/* Shared helpers for the drawn project artifacts: wobbly ink rectangles and
   arrows in the site's sketched style. Offsets are deterministic (seeded sine)
   so the static export and the client render identical paths. */

export function wobRect(x: number, y: number, w: number, h: number, seed = 0, jitter = 1.8): string {
  const j = (n: number) => Math.sin(seed * 91.7 + n * 37.3) * jitter;
  return [
    `M ${x + j(1)} ${y + j(2)}`,
    `C ${x + w * 0.3 + j(3)} ${y + j(4)}, ${x + w * 0.7 + j(5)} ${y + j(6)}, ${x + w + j(7)} ${y + j(8)}`,
    `C ${x + w + j(9)} ${y + h * 0.4 + j(10)}, ${x + w + j(11)} ${y + h * 0.7 + j(12)}, ${x + w + j(13)} ${y + h + j(14)}`,
    `C ${x + w * 0.7 + j(15)} ${y + h + j(16)}, ${x + w * 0.3 + j(17)} ${y + h + j(18)}, ${x + j(19)} ${y + h + j(20)}`,
    `C ${x + j(21)} ${y + h * 0.7 + j(22)}, ${x + j(23)} ${y + h * 0.3 + j(24)}, ${x + j(1)} ${y + j(2)}`,
    "Z",
  ].join(" ");
}

export function inkArrow(x1: number, y: number, len: number, seed = 0): string {
  const j = (n: number) => Math.sin(seed * 53.1 + n * 29.7) * 1.2;
  const x2 = x1 + len;
  return `M ${x1} ${y + j(1)} C ${x1 + len * 0.4} ${y + j(2)}, ${x1 + len * 0.7} ${y + j(3)}, ${x2} ${y + j(4)} M ${x2 - 7} ${y - 5 + j(5)} L ${x2} ${y + j(4)} L ${x2 - 7} ${y + 5 + j(6)}`;
}
