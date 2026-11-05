import Image from "next/image";
import { BRIEF, FEATURED, NOTES, PHOTOS } from "../../content";

// Natural size of each frame in public/cards/, so a row shows the whole figure. Update alongside the PNGs (scripts/cards/README.md).
const FRAMES: Record<(typeof FEATURED)[number], { w: number; h: number }> = {
  visionassist: { w: 1000, h: 1064 },
  accordion: { w: 1000, h: 774 },
  rung: { w: 1000, h: 828 },
  alta: { w: 1000, h: 818 },
};

const byId = (id: (typeof FEATURED)[number]) => NOTES.find((note) => note.id === id)!;
const REST = [...NOTES].sort((a, b) => a.order - b.order).filter((note) => !FEATURED.some((id) => id === note.id));
const num = (n: number) => String(n).padStart(2, "0");

export default function Work() {
  return (
    <section id="work" className="brief-work" aria-labelledby="work-h">
      <header className="pi-head">
        <h2 id="work-h">Work</h2>
        <p>{BRIEF.workIntro}</p>
      </header>
      <ol className="wr">
        {FEATURED.map((id) => {
          const note = byId(id);
          const frame = FRAMES[id];
          const photos = (PHOTOS[id] ?? []).slice(0, 3);
          return (
            <li key={id} className="wr-row">
              {/* The frame repeats the title's link; it leaves the accessibility tree and the tab order so the row reads once. The arrow is the same kind of link, so the accent stays on something clickable. */}
              <a className="wr-fig" href={`/work/${id}/`} tabIndex={-1} aria-hidden="true">
                <Image src={`/cards/${id}.png`} alt="" width={frame.w} height={frame.h} />
              </a>
              <div className="wr-body">
                <span className="wr-n" aria-hidden="true">{num(note.order)}</span>
                <a className="wr-a" href={`/work/${id}/`} tabIndex={-1} aria-hidden="true">→</a>
                <h3><a href={`/work/${id}/`}>{note.title}</a></h3>
                <p className="wr-line">{note.oneLiner}</p>
                <p className="wr-where">{note.where}</p>
                {photos.length > 0 && (
                  <ul className="wr-gallery" aria-label={`Photos of ${note.title}`}>
                    {photos.map((p) => (
                      <li key={p.src}>
                        <a href={`/work/${id}/#photos`}>
                          <Image src={p.src} alt={p.alt} width={p.w} height={p.h} />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <ol className="wc">
        {REST.map((note) => (
          <li key={note.id}>
            <a href={`/work/${note.id}/`} className="wc-row">
              <span className="wc-n" aria-hidden="true">{num(note.order)}</span>
              <b className="wc-t">{note.title}</b>
              <span className="wc-d">{note.oneLiner}</span>
              <span className="wc-a" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
