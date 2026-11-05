import Link from "next/link";
import { AWARDS_BRIEF, EDUCATION, EXPERIENCE, OPEN_SOURCE } from "../../content";

const EXT = { target: "_blank", rel: "noreferrer" } as const;

export default function Experience() {
  return (
    <section id="experience" className="brief-xp" aria-labelledby="experience-h">
      <header className="pi-head">
        <h2 id="experience-h">Experience</h2>
        <p><Link className="cta" href="/datasheet/#revisions">Full record in the datasheet ↗</Link></p>
      </header>
      <ol className="xp">
        {EXPERIENCE.map((job) => (
          <li key={job.role}>
            <span className="xp-k">{job.when}</span>
            <h3>{job.role}</h3>
            <span className="xp-d">{job.org}</span>
          </li>
        ))}
      </ol>
      <div className="xp-group">
        <h3 className="xp-k" id="education">Education</h3>
        <ul className="xp-list">
          {EDUCATION.map((e) => (
            <li key={e.school}><b>{e.school}</b><span className="xp-d">{e.degree} · {e.when}</span></li>
          ))}
        </ul>
      </div>
      <div className="xp-group">
        <h3 className="xp-k" id="awards">Awards</h3>
        <ul className="xp-list">
          {AWARDS_BRIEF.map((a) => (
            <li key={a.t}><b>{a.t}</b><span className="xp-d">{a.d}</span></li>
          ))}
        </ul>
      </div>
      <div className="xp-group">
        <h3 className="xp-k" id="open-source">Open source</h3>
        <ul className="xp-list">
          {OPEN_SOURCE.map((o) => (
            <li key={o.href}>
              <b>{o.name}</b>
              <span className="xp-d">{o.stars} · {o.what} · <a href={o.href} {...EXT}>Merged upstream ↗</a></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
