"use client";

import { ALSO, NOTES } from "../../content";
import Status from "../Status";
import { pinStore, usePins } from "./pinStore";

const ROWS = [...NOTES].sort((a, b) => a.order - b.order);
const SHOWN = 4;

export default function ProjectIndex() {
  const { active, selected } = usePins();
  const pin = selected ?? active;
  const hits = ROWS.filter((n) => !pin || n.skills.includes(pin)).length;

  return (
    <section id="projects" className="brief-projects" aria-labelledby="projects-h">
      <header className="pi-head">
        <h2 id="projects-h">Projects</h2>
        <p>
          Ten things I built. One page each. The long version is in the <a href="/datasheet/">datasheet</a>.
        </p>
      </header>
      {selected && (
        <p className="pi-filter" role="status">
          Showing <b>{hits}</b> {hits === 1 ? "project" : "projects"} using <b>{selected}</b> ·{" "}
          <button type="button" onClick={() => pinStore.set({ selected: null, active: null })}>
            Clear
          </button>
        </p>
      )}
      <div className="pi-cols" aria-hidden="true">
        <span>#</span>
        <span>Project</span>
        <span>What it is</span>
        <span>Number</span>
        <span>Stack</span>
        <span />
      </div>
      <ul className="pi">
        {ROWS.map((n) => {
          const hit = !pin || n.skills.includes(pin);
          const more = n.stack.length - SHOWN;
          return (
            <li key={n.id}>
              <a
                href={`/work/${n.id}/`}
                className={`row${hit ? (pin ? " lit" : "") : " dim"}`}
                aria-label={`${n.title}: ${n.oneLiner}`}
              >
                <span className="pi-n">{String(n.order).padStart(2, "0")}</span>
                <b className="pi-t">{n.title}</b>
                <small className="pi-c">
                  {n.context} · {n.role}
                </small>
                <span className="pi-d">{n.oneLiner}</span>
                <span className="pi-h">
                  <b className="num">
                    {n.headline.value}
                    {n.headline.unit ? " " + n.headline.unit : ""}
                  </b>
                  <small>{n.headline.label}</small>
                  {n.headline.status && <Status s={n.headline.status} />}
                </span>
                <span className="pi-s">
                  {n.stack.slice(0, SHOWN).join(" · ")}
                  {more > 0 && ` +${more}`}
                </span>
                <span className="pi-a" aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="pi-also">
        Also: <a href={ALSO[0].href}>{ALSO[0].title}</a> (2nd place, DA Hacks 3.5) ·{" "}
        <a href={ALSO[1].href}>{ALSO[1].title}</a> (fastest run in section, 14.41 s) ↗
      </p>
    </section>
  );
}
