"use client";

import { useEffect } from "react";

export default function Chrome({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    // threshold must stay 0: a zero-area target may never intersect otherwise
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sheet">
      <span className="cropmark crop-tl" aria-hidden="true" />
      <span className="cropmark crop-tr" aria-hidden="true" />
      <span className="cropmark crop-bl" aria-hidden="true" />
      <span className="cropmark crop-br" aria-hidden="true" />

      <header className="site-head">
        <div className="site-head-in">
          <a className="part-no" href="#top" aria-label="AD-2027 — back to top">
            <span className="pn">
              AD<b>-2027</b>
            </span>
            <span className="pd">Computer Engineering · Preliminary Datasheet</span>
          </a>
          <nav className="site-nav" aria-label="Sections">
            <a href="#constraints">Constraints</a>
            <a href="#applications">Applications</a>
            <a href="#errata">Errata</a>
            <a href="#about">Description</a>
            <a href="#order">Ordering</a>
          </nav>
          <span className="head-status">
            <span className="led" aria-hidden="true" />
            Available May–Aug 2027
          </span>
          <a className="head-resume" href="/Aaditya_Desai_Resume.pdf">
            Résumé ↓
          </a>
        </div>
      </header>

      {children}
    </div>
  );
}
