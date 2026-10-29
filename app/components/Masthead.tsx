"use client";

import { useEffect, useRef, useState } from "react";
import { RESUME } from "../content";

export default function Masthead() {
  const [label, setLabel] = useState<{ num: string; title: string }>({ num: "1", title: "Overview" });
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sheets = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const [num, title] = (e.target.getAttribute("data-section") ?? "").split("|");
            setLabel({ num, title });
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sheets.forEach((s) => io.observe(s));

    let raf = 0;
    const sync = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(sync); };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });

    // J / K page through the sheets, like a PDF viewer
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable], [data-keys]")) return;
      const k = e.key.toLowerCase();
      if (k !== "j" && k !== "k") return;
      const y = window.scrollY + 80;
      const tops = sheets.map((s) => s.getBoundingClientRect().top + window.scrollY);
      const target = k === "j" ? tops.find((top) => top > y + 4) : [...tops].reverse().find((top) => top < y - 4);
      if (target !== undefined) {
        e.preventDefault();
        window.scrollTo({ top: target - 64, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="mast">
      <div className="mast-inner">
        <a className="mast-mark" href="#top" aria-label="Aaditya Desai, back to top">
          <svg className="mast-ic" viewBox="0 0 24 24" aria-hidden="true">
            <g fill="#8d8d87">
              {[5, 9.5, 14, 18.5].map((p) => (
                <g key={p}>
                  <rect x={p - 1} y="1" width="2" height="4" />
                  <rect x={p - 1} y="19" width="2" height="4" />
                  <rect x="1" y={p - 1} width="4" height="2" />
                  <rect x="19" y={p - 1} width="4" height="2" />
                </g>
              ))}
            </g>
            <rect x="4" y="4" width="16" height="16" rx="1.5" fill="#151515" />
            <circle cx="7.2" cy="7.2" r="1.1" fill="#555" />
          </svg>
          <b>AD2028</b>
          <span>Aaditya Desai</span>
        </a>
        <div className="mast-sec" aria-live="polite">
          <span>§{label.num}</span>
          {label.title}
        </div>
        <nav className="mast-nav" aria-label="Primary">
          <a href="#block-diagram">Projects</a>
          <a href="#specs">Specs</a>
          <a href="#revisions">Experience</a>
          <a href="#ordering">Contact</a>
          <a className="pdf" href={RESUME} target="_blank" rel="noreferrer">Résumé PDF ↓</a>
        </nav>
      </div>
      <div className="mast-prog" aria-hidden="true"><span ref={bar} /></div>
    </header>
  );
}
