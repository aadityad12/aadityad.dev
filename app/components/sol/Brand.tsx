"use client";

import { useVariant } from "./variants";

// "Hi, I'm Aaditya Desai." and "aaditya." are the same element. --dock
// (0 at the top of the page, 1 once it has reached the nav) folds the
// extra words away, so the big hero name can become the small nav mark.
export function NameMorph({ greeting = false }: { greeting?: boolean }) {
  return <span className="nm" aria-hidden="true">
    {greeting && <span className="nm-hi">Hi, I’m</span>}
    <span className="nm-up">A</span><span className="nm-low">a</span><span>aditya</span>
    <span className="nm-last">Desai</span><span className="nm-dot">.</span>
  </span>;
}

const knot = Array.from({ length: 73 }, (_, i) => {
  const t = i / 72 * Math.PI * 2;
  return `${i ? "L" : "M"}${(16 + (Math.sin(t) + 2 * Math.sin(2 * t)) * 4.7).toFixed(2)} ${(16 - (Math.cos(t) - 2 * Math.cos(2 * t)) * 4.7).toFixed(2)}`;
}).join("") + "Z";

export function BrandMark() {
  const mark = useVariant("mark");
  if (mark === "dot") return null;
  if (mark === "knot") return <svg className="brand-mark brand-knot" viewBox="0 0 32 32" aria-hidden="true"><path d={knot} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /></svg>;
  if (mark === "wonder") return <span className="brand-mark brand-wonder" aria-hidden="true"><span>?</span><span>!</span></span>;
  return <span className="brand-mark brand-star" aria-hidden="true">✳</span>;
}
