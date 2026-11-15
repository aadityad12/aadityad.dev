import Link from "next/link";
import { MORE, NOTES, PHOTOS } from "../../content";
import WorkStage, { type StageItem } from "./WorkStage";

// The six projects that play on the stage, in their default order. The rest are listed under it.
const FLAGSHIPS = ["visionassist", "accordion", "rung", "alta", "apextracker", "oss-scout"];

export default function Work() {
  const byId = new Map(NOTES.map((n) => [n.id, n]));
  const items: StageItem[] = FLAGSHIPS.flatMap((id) => {
    const n = byId.get(id);
    if (!n) return [];
    const photo = PHOTOS[id]?.[0];
    return [
      {
        id,
        title: n.title,
        hook: n.hook,
        kicker: n.award ?? [n.context, n.role].filter(Boolean).join(" · "),
        roles: n.roles ?? [],
        value: `${n.headline.value}${n.headline.unit ? ` ${n.headline.unit}` : ""}`,
        label: n.headline.label,
        photo: photo ? { src: photo.src, w: photo.w, h: photo.h, alt: photo.alt } : undefined,
      },
    ];
  });
  const rest = [...NOTES].filter((n) => !FLAGSHIPS.includes(n.id)).sort((a, b) => a.order - b.order);

  return (
    <section id="work" className="section wrap">
      <WorkStage items={items} />

      <h3 className="wk-more-h">More work</h3>
      <ul className="wk-rows">
        {rest.map((n) => (
          <li key={n.id}>
            <Link className="wk-row" href={`/work/${n.id}/`}>
              <b>{n.title}</b>
              <span>{n.oneLiner}</span>
              <span className="wk-row-k">{n.award ?? n.context}</span>
              <span className="wk-row-go" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
        {MORE.map((m) => (
          <li key={m.title}>
            {m.href ? (
              <a className="wk-row" href={m.href}>
                <b>{m.title}</b>
                <span>{m.text}</span>
                <span className="wk-row-k">{m.tag}</span>
                <span className="wk-row-go" aria-hidden="true">↗</span>
              </a>
            ) : (
              <div className="wk-row">
                <b>{m.title}</b>
                <span>{m.text}</span>
                <span className="wk-row-k">{m.tag}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
