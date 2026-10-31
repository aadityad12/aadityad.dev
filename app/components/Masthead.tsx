"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Ref = { id: string; title: string };
// `resume` is passed in so a route that never loads content.ts on the client does not pay for it here.
export type MastheadProps = { resume: string } & (
  | { variant: "brief" }
  | { variant: "work"; id: string; title: string; prev: Ref; next: Ref }
  | { variant: "datasheet" }
);

type Item = { href: string; label: string; short?: string; aria?: string; cur?: string; cls?: string };

// J / K land the target sheet 64px below the top of the viewport, under the masthead.
// The same offset is used to find "where I am", so K from a sheet J just landed on steps back.
const OFFSET = 64;
// A sheet within this many px of the reading line counts as "here", not as the next or previous one.
const NEAR = 24;

const BRIEF_ITEMS: Item[] = [
  { href: "#projects", label: "Projects", cur: "projects" },
  { href: "#experience", label: "Experience", cur: "experience" },
  { href: "#education", label: "Education", cur: "education" },
  { href: "#contact", label: "Contact", cur: "contact" },
  { href: "/datasheet/", label: "Datasheet" },
];

const DATASHEET_ITEMS: Item[] = [
  { href: "/datasheet/#block-diagram", label: "Projects" },
  { href: "/datasheet/#specs", label: "Specs" },
  { href: "/datasheet/#revisions", label: "Experience" },
  { href: "/datasheet/#ordering", label: "Contact" },
];

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function inField(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t?.closest?.("input, textarea, select, [contenteditable], [data-keys]");
}

export default function Masthead(props: MastheadProps) {
  const { variant } = props;
  const prevId = props.variant === "work" ? props.prev.id : "";
  const nextId = props.variant === "work" ? props.next.id : "";
  const router = useRouter();
  const [label, setLabel] = useState<{ num: string; title: string }>({ num: "1", title: "Overview" });
  const [current, setCurrent] = useState<string | null>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    // reading progress, on every route
    let raf = 0;
    let onSync: (() => void) | undefined;
    const sync = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      onSync?.();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(sync); };

    let io: IntersectionObserver | undefined;
    let onKey: ((e: KeyboardEvent) => void) | undefined;

    if (variant === "brief") {
      // the section under the reading line gets aria-current on its nav item
      const targets = Array.from(document.querySelectorAll<HTMLElement>("section[id], footer[id]"));
      onSync = () => {
        const line = window.innerHeight * 0.35;
        const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        let cur: string | null = null;
        for (const t of targets) if (t.getBoundingClientRect().top <= line) cur = t.id;
        if (atEnd && targets.length) cur = targets[targets.length - 1].id;
        setCurrent(cur);
      };
    }

    if (variant === "datasheet") {
      const sheets = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
      if (sheets.length > 0) {
        io = new IntersectionObserver(
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
        sheets.forEach((s) => io!.observe(s));

        // J / K page through the sheets, like a PDF viewer
        let last = { top: 0, at: -Infinity };
        onKey = (e) => {
          if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || inField(e)) return;
          const k = e.key.toLowerCase();
          if (k !== "j" && k !== "k") return;
          // a press during the smooth scroll of the previous one continues from where that one is headed
          const y = performance.now() - last.at < 900 ? last.top : window.scrollY + OFFSET;
          const tops = sheets.map((s) => s.getBoundingClientRect().top + window.scrollY);
          const target = k === "j" ? tops.find((top) => top > y + NEAR) : [...tops].reverse().find((top) => top < y - NEAR);
          if (target !== undefined) {
            e.preventDefault();
            last = { top: target, at: performance.now() };
            window.scrollTo({ top: target - OFFSET, behavior: reduced() ? "auto" : "smooth" });
          }
        };
      }
    }

    if (variant === "work") {
      // J goes to the next project, K to the previous one, as in the page footer
      onKey = (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || inField(e)) return;
        const k = e.key.toLowerCase();
        if (k !== "j" && k !== "k") return;
        e.preventDefault();
        router.push(`/work/${k === "j" ? nextId : prevId}/`);
      };
    }

    // Escape closes the mobile menu and hands focus back to its button
    const onEsc = (e: KeyboardEvent) => {
      const m = menu.current;
      if (e.key !== "Escape" || !m?.open) return;
      m.open = false;
      m.querySelector("summary")?.focus();
    };

    sync();
    window.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    if (onKey) window.addEventListener("keydown", onKey);
    return () => {
      io?.disconnect();
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (onKey) window.removeEventListener("keydown", onKey);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [variant, prevId, nextId, router]);

  const closeMenu = () => { if (menu.current) menu.current.open = false; };

  let items: Item[];
  if (props.variant === "work") {
    items = [
      { href: `/work/${props.prev.id}/`, label: `← ${props.prev.title}`, short: "←", aria: `Previous project: ${props.prev.title}`, cls: "mast-step" },
      { href: `/work/${props.next.id}/`, label: `${props.next.title} →`, short: "→", aria: `Next project: ${props.next.title}`, cls: "mast-step" },
      { href: "/#projects", label: "All projects" },
      { href: `/datasheet/#${props.id}`, label: "Datasheet entry" },
    ];
  } else {
    items = variant === "brief" ? BRIEF_ITEMS : DATASHEET_ITEMS;
  }

  const link = (it: Item, menuItem: boolean) => (
    <Link
      key={it.href}
      className={it.cls}
      href={it.href}
      aria-label={it.aria}
      title={it.aria}
      aria-current={it.cur && it.cur === current ? "true" : undefined}
      onClick={menuItem ? closeMenu : undefined}
    >
      {!menuItem && it.short ? (
        <>
          <span className="mast-step-s" aria-hidden="true">{it.short}</span>
          <span className="mast-step-l" aria-hidden="true">{it.label}</span>
        </>
      ) : (
        it.label
      )}
    </Link>
  );

  return (
    <header className={`mast mast-${variant}`}>
      <div className="mast-inner">
        <Link className="mast-mark" href="/" aria-label="Aaditya Desai, home">
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
          {variant === "datasheet" && <b>AD2028</b>}
          <span>Aaditya Desai</span>
        </Link>

        {props.variant === "datasheet" && (
          <div className="mast-mid mast-sec" aria-live="polite">
            <span>§{label.num}</span>
            {label.title}
          </div>
        )}
        {props.variant === "brief" && <div className="mast-mid mast-avail">Available Summer 2027</div>}
        {props.variant === "work" && (
          <div
            className="mast-mid mast-crumb"
            title={`Projects / ${props.title}. Press J for the next project (${props.next.title}), K for the previous (${props.prev.title}).`}
          >
            Projects / <b>{props.title}</b>
          </div>
        )}

        <div className="mast-end">
          <nav className="mast-nav" aria-label="Primary">
            {items.map((it) => link(it, false))}
          </nav>
          <a className="pdf" href={props.resume} target="_blank" rel="noreferrer">
            Résumé<span className="mast-pdf-x"> PDF</span> ↓
          </a>
          <details className="mast-menu" ref={menu}>
            <summary>Menu</summary>
            <nav className="mast-menu-list" aria-label="Menu">
              {items.map((it) => link(it, true))}
            </nav>
          </details>
        </div>
      </div>
      <div className="mast-prog" aria-hidden="true"><span ref={bar} /></div>
    </header>
  );
}
