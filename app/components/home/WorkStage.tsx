"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { ROLE_CHOICES, setRole, useRole, type RoleChoice } from "../role";
import type { SceneProps } from "../../scenes/kit";

/* The stage. On a wide screen it is a list of the flagship projects beside one large picture:
   the picture plays the selected project's story, and the list moves on by itself until the
   visitor touches it. On a phone there is no stage, just the projects one after another.
   Without scripts every project is simply shown in order. */

export type StageItem = {
  id: string;
  title: string;
  hook: string;
  kicker: string;
  roles: string[];
  value: string;
  label: string;
  photo?: { src: string; w: number; h: number; alt: string };
};

// A project's picture: its hand-drawn scene if it has one, otherwise its working figure.
const SCENES: Record<string, ComponentType<SceneProps>> = {
  alta: dynamic(() => import("../../scenes/AltaScene")),
  visionassist: dynamic(() => import("../../scenes/VisionScene")),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the figures take slightly different optional props
const FIGS: Record<string, ComponentType<any>> = {
  accordion: dynamic(() => import("../../figures/AccordionMap")),
  rung: dynamic(() => import("../../figures/RungLadder")),
  apextracker: dynamic(() => import("../../figures/ApexMidnight")),
  "oss-scout": dynamic(() => import("../../figures/ScoutInterlock")),
};

const DWELL = 14000;

/** Mounts its children the first time it comes near the screen. A hidden panel never does. */
function Lazy({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [on]);
  return (
    <div ref={ref} className="wk-visual-in">
      {on ? children : null}
    </div>
  );
}

function Visual({ item, playing }: { item: StageItem; playing: boolean }) {
  const Scene = SCENES[item.id];
  if (Scene) return <Scene paused={!playing} />;
  const F = FIGS[item.id];
  if (F) return <F />;
  if (item.photo) return <Image src={item.photo.src} width={item.photo.w} height={item.photo.h} alt={item.photo.alt} sizes="(max-width: 1000px) 90vw, 760px" />;
  return null;
}

function relevance(item: StageItem, role: RoleChoice | null) {
  if (!role) return 0;
  const i = item.roles.indexOf(role);
  return i === -1 ? 9 : i;
}

export default function WorkStage({ items }: { items: StageItem[] }) {
  const role = useRole();
  const sorted = useMemo(
    () => items.map((it, i) => ({ it, i })).sort((a, b) => relevance(a.it, role) - relevance(b.it, role) || a.i - b.i).map((x) => x.it),
    [items, role],
  );
  const [picked, setPicked] = useState<string | null>(null);
  const [auto, setAuto] = useState(true);
  const [held, setHeld] = useState(false);
  const [seen, setSeen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // A new role starts again from the top of the newly sorted list.
  const [lastRole, setLastRole] = useState(role);
  if (lastRole !== role) {
    setLastRole(role);
    setPicked(null);
  }
  const activeId = picked && sorted.some((s) => s.id === picked) ? picked : sorted[0]?.id;
  const activeIndex = sorted.findIndex((s) => s.id === activeId);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = auto && !held && seen;
  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 1000) return;
    const t = window.setTimeout(() => setPicked(sorted[(activeIndex + 1) % sorted.length].id), DWELL);
    return () => window.clearTimeout(t);
  }, [running, activeIndex, sorted]);

  const pick = (id: string) => {
    setPicked(id);
    setAuto(false);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = sorted[(activeIndex + d + sorted.length) % sorted.length];
    pick(next.id);
    root.current?.querySelector<HTMLElement>(`#wk-tab-${next.id}`)?.focus();
  };

  return (
    <div className="wk" ref={root}>
      <div className="section-head">
        <h2>Work</h2>
        <div className="wk-roles" role="group" aria-label="Sort the work for a kind of role">
          <span>Sorted for</span>
          <button type="button" aria-pressed={role === null} onClick={() => setRole(null)}>Everything</button>
          {ROLE_CHOICES.map((r) => (
            <button key={r.id} type="button" aria-pressed={role === r.id} onClick={() => setRole(r.id)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="wk-stage" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
        <div className="wk-tabs" role="tablist" aria-orientation="vertical" aria-label="Featured projects">
          {sorted.map((it) => {
            const on = it.id === activeId;
            return (
              <button
                key={it.id}
                id={`wk-tab-${it.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`wk-panel-${it.id}`}
                tabIndex={on ? 0 : -1}
                className="wk-tab"
                onClick={() => pick(it.id)}
                onKeyDown={onKey}
              >
                {on && <i key={`${it.id}-${running}`} className="wk-progress" data-running={running} style={{ animationDuration: `${DWELL}ms` }} />}
                <b>{it.title}</b>
                <span className="wk-tab-hook">{it.hook}</span>
                <span className="wk-tab-k">{it.kicker}</span>
              </button>
            );
          })}
          <button type="button" className="wk-pause" onClick={() => setAuto((a) => !a)}>
            {auto ? "Pause" : "Play"}
          </button>
        </div>

        <div className="wk-panels">
          {sorted.map((it) => {
            const on = it.id === activeId;
            return (
              <article key={it.id} id={`wk-panel-${it.id}`} className="wk-panel" role="tabpanel" aria-labelledby={`wk-tab-${it.id}`} data-active={on}>
                <header className="wk-panel-head">
                  <h3>{it.title}</h3>
                  <p>{it.hook}</p>
                  <p className="wk-tab-k">{it.kicker}</p>
                </header>
                <div className="fig-body wk-visual">
                  <Lazy>
                    <Visual item={it} playing={on} />
                  </Lazy>
                </div>
                <div className="wk-foot">
                  <p>
                    <b className="num">{it.value}</b>
                    <span>{it.label}</span>
                  </p>
                  <Link className="arrow-link" href={`/work/${it.id}/`}>
                    How {it.title} works <span>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
