"use client";

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

// "?" at the top of the page, "!" once the name has docked (driven by --dock in CSS).
export function BrandMark() {
  return <span className="brand-mark brand-wonder" aria-hidden="true"><span>?</span><span>!</span></span>;
}
