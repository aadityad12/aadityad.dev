import { Fragment } from "react";
import Image from "next/image";
import { BRIEF, FEATURED, NOTES } from "../../content";

const byId = (id: (typeof FEATURED)[number]) => NOTES.find((note) => note.id === id)!;
const REST = [...NOTES]
  .sort((a, b) => a.order - b.order)
  .filter((note) => !FEATURED.some((id) => id === note.id));

export default function Work() {
  return (
    <section id="work" className="brief-work" aria-labelledby="work-h">
      <header className="pi-head">
        <h2 id="work-h">Selected work</h2>
        <p>{BRIEF.workIntro}</p>
      </header>
      <ol className="wk">
        {FEATURED.map((id, i) => {
          const note = byId(id);
          return (
            <li key={id}>
              <a href={`/work/${id}/`} className="wk-card" aria-label={`${note.title}: ${note.oneLiner}`}>
                <div className="wk-fig" aria-hidden="true">
                  <Image src={`/cards/${id}.png`} alt="" fill sizes="(max-width: 899px) 92vw, 570px" style={{ objectFit: "cover", objectPosition: "50% 0" }} />
                </div>
                <div className="wk-body">
                  <span className="wk-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="wk-a" aria-hidden="true">→</span>
                  <h3>{note.title}</h3>
                  <p>{note.oneLiner}</p>
                  <small>{note.where}</small>
                </div>
              </a>
            </li>
          );
        })}
      </ol>
      <p className="wk-more">
        {BRIEF.moreWork}{" "}
        {REST.map((note, i) => (
          <Fragment key={note.id}>
            {i > 0 && ", "}<a href={`/work/${note.id}/`}>{note.title}</a>
          </Fragment>
        ))}.
      </p>
    </section>
  );
}
