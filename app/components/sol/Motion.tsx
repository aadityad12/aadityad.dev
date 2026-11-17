"use client";

import { useEffect, useState } from "react";

export default function Motion() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const view = innerHeight;
      document.querySelectorAll<HTMLElement>("[data-scene]").forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > view + 100) return;
        const progress = (view / 2 - rect.top - rect.height / 2) / view;
        element.style.setProperty("--scene-progress", String(media.matches ? 0 : progress));
      });
      const max = document.documentElement.scrollHeight - innerHeight;
      root.style.setProperty("--reading", String(max ? scrollY / max : 0));
      // 0 at the top of the page, 1 once the hero name has reached the nav.
      const rail = document.querySelector<HTMLElement>(".name-rail");
      const travel = rail && rail.offsetHeight ? rail.offsetTop : 110;
      root.style.setProperty("--dock", Math.min(1, Math.max(0, scrollY / (travel || 110))).toFixed(3));
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    }), { rootMargin: "0px 0px -7% 0px", threshold: 0 });
    document.querySelectorAll("[data-entrance], [data-scene]").forEach(element => observer.observe(element));
    addEventListener("scroll", scroll, { passive: true });
    addEventListener("resize", scroll);
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); removeEventListener("scroll", scroll); removeEventListener("resize", scroll); root.classList.remove("motion-paused"); };
  }, []);
  return <button className="motion-toggle" aria-pressed={paused} onClick={() => { document.documentElement.classList.toggle("motion-paused", !paused); window.dispatchEvent(new CustomEvent("sol-motion", { detail: { paused: !paused } })); setPaused(!paused); }} aria-label={paused ? "Resume ambient motion" : "Pause ambient motion"}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span><span>{paused ? "Motion off" : "Motion on"}</span></button>;
}
