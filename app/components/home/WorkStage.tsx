"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LAST_KEY } from "../work/RememberProject";
import { ROLE_CHOICES, setRole, useRole, type RoleChoice } from "../role";

/* The stage. On a wide screen it is a list of the flagship projects beside one picture of the real
   thing: a photo of the build, the app's own screens, measured numbers, or the code that matters.
   Nothing moves on its own; the visitor picks. On a phone the projects are cards, the first three
   shown and the rest one tap away. Without scripts every project is shown in order. */

export type StageItem = {
  id: string;
  title: string;
  tag: string;
  hook: string;
  roles: string[];
  value: string;
  label: string;
  /** The real artifact, rendered on the server. */
  visual: React.ReactNode;
};

const PHONE_FIRST = 3;

function relevance(roles: string[], role: RoleChoice | null) {
  if (!role) return 0;
  const i = roles.indexOf(role);
  return i === -1 ? 9 : i;
}

export function useSortedByRole<T extends { roles: string[] }>(items: T[]) {
  const role = useRole();
  const sorted = useMemo(
    () => items.map((it, i) => ({ it, i })).sort((a, b) => relevance(a.it.roles, role) - relevance(b.it.roles, role) || a.i - b.i).map((x) => x.it),
    [items, role],
  );
  return { role, sorted };
}

export default function WorkStage({ items }: { items: StageItem[] }) {
  const { role, sorted } = useSortedByRole(items);
  const [picked, setPicked] = useState<string | null>(null);
  const [allOnPhone, setAllOnPhone] = useState(false);

  // A new role starts again from the top of the newly sorted list.
  const [lastRole, setLastRole] = useState(role);
  if (lastRole !== role) {
    setLastRole(role);
    setPicked(null);
  }
  // Coming back from a case study, the stage shows that project again (and opens the phone list if it was hidden).
  useEffect(() => {
    let last: string | null = null;
    try {
      last = sessionStorage.getItem(LAST_KEY);
    } catch {
      // Storage can be blocked; then the stage opens on its first project.
    }
    const i = last ? sorted.findIndex((s) => s.id === last) : -1;
    if (i < 0) return;
    // After hydration, so the server and first client render agree.
    const t = window.setTimeout(() => {
      setPicked(sorted[i].id);
      if (i >= PHONE_FIRST) setAllOnPhone(true);
    }, 0);
    return () => window.clearTimeout(t);
    // Only on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAll = () => {
    setAllOnPhone(true);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`#wk-panel-${sorted[PHONE_FIRST]?.id} .wk-panel-head a`)?.focus());
  };

  const activeId = picked && sorted.some((s) => s.id === picked) ? picked : sorted[0]?.id;
  const activeIndex = sorted.findIndex((s) => s.id === activeId);

  const onKey = (e: React.KeyboardEvent) => {
    const last = sorted.length - 1;
    const to = e.key === "ArrowDown" ? (activeIndex + 1) % sorted.length : e.key === "ArrowUp" ? (activeIndex + last) % sorted.length : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (to < 0) return;
    e.preventDefault();
    const next = sorted[to];
    setPicked(next.id);
    document.getElementById(`wk-tab-${next.id}`)?.focus();
  };

  return (
    <div className="wk" data-all={allOnPhone || undefined}>
      <div className="section-head wk-head">
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

      <div className="wk-stage">
        <div className="wk-tabs" role="tablist" aria-orientation="vertical" aria-label="Preview featured projects">
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
                onClick={() => setPicked(it.id)}
                onKeyDown={onKey}
              >
                <b>{it.title}</b>
                <span className="wk-tab-k">{it.tag}</span>
              </button>
            );
          })}
        </div>

        <div className="wk-panels">
          {sorted.map((it, i) => {
            const on = it.id === activeId;
            return (
              <article
                key={it.id}
                id={`wk-panel-${it.id}`}
                className="wk-panel"
                role="tabpanel"
                aria-labelledby={`wk-tab-${it.id}`}
                data-active={on}
                data-later={i >= PHONE_FIRST || undefined}
              >
                <header className="wk-panel-head">
                  <h3>
                    <Link href={`/work/${it.id}/`}>{it.title}</Link>
                  </h3>
                  <p className="wk-tab-k">{it.tag}</p>
                </header>
                <div className="wk-media">{it.visual}</div>
                <div className="wk-foot">
                  <p className="wk-hook">{it.hook}</p>
                  <div className="wk-foot-row">
                    <p className="wk-num">
                      <b>{it.value}</b>
                      <span>{it.label}</span>
                    </p>
                    <Link className="btn wk-open" href={`/work/${it.id}/`}>
                      Read the case study<span className="visually-hidden">: {it.title}</span> <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
          {!allOnPhone && sorted.length > PHONE_FIRST && (
            <button type="button" className="btn quiet wk-more-btn" onClick={showAll}>
              Show {sorted.length - PHONE_FIRST} more projects
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
