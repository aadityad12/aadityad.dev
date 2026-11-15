import { EXPERIENCE } from "../../content";

export default function Experience() {
  return (
    <section id="experience" className="section wrap">
      <div className="section-head"><h2>Experience</h2></div>
      <div>
        {EXPERIENCE.map((entry) => (
          <article className="exp-row" key={`${entry.org}-${entry.role}`}>
            <div className="exp-meta"><p>{entry.when}</p><p>{entry.where}</p></div>
            <div className="exp-role"><h3>{entry.role}</h3><p>{entry.org}</p></div>
            <div className="exp-detail">
              {entry.points.slice(0, 2).map((point) => <p key={point}>{point}</p>)}
              {"link" in entry && entry.link && <a className="arrow-link" href={entry.link.href}>{entry.link.label} <span aria-hidden="true">→</span></a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
