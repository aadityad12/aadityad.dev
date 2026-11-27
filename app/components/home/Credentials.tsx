import { AWARDS, CERTS, EDUCATION, OPEN_SOURCE, OSS, SKILLS } from "../../content";

export default function Credentials() {
  return (
    <section id="education" className="section wrap">
      <div className="section-head"><h2>Education and recognition</h2></div>
      <div className="cred-grid">
        <div className="cred-block">
          <h3>Education</h3>
          <ul className="cred-list">
            {EDUCATION.map((entry) => (
              <li key={entry.school}>
                <strong>{entry.school}</strong>
                <p>{entry.degree}</p>
                <p className="cred-quiet">{entry.when}, {entry.note}</p>
                <details className="cred-more-d">
                  <summary>Courses</summary>
                  <p className="cred-quiet">{entry.courses}</p>
                </details>
              </li>
            ))}
          </ul>
          <h3 className="cred-sub">Certifications</h3>
          <ul className="cred-list cred-certs">{CERTS.map((cert) => <li key={cert}>{cert}</li>)}</ul>
        </div>
        <div className="cred-block">
          <h3>Recognition</h3>
          <ul className="cred-list">
            {AWARDS.map((award) => <li key={award.t}><strong>{award.t}</strong><p className="cred-quiet">{award.d}</p></li>)}
          </ul>
        </div>
        <div className="cred-block">
          <h3>Open source</h3>
          <ul className="cred-list">
            {OPEN_SOURCE.map((entry) => <li key={entry.href}>
              <strong><a href={entry.href}>{entry.name}</a></strong><p className="cred-quiet">{entry.what}</p><p>{entry.pr}</p>
            </li>)}
          </ul>
          <a className="arrow-link cred-more" href={OSS}>All my contributions <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <details className="cred-tools">
        <summary>
          <span className="cred-tools-h">Tools</span>
          <span className="cred-tools-peek">{SKILLS.slice(0, 4).flatMap((k) => k.items.slice(0, 2)).join(", ")} and more</span>
        </summary>
        <dl className="cred-tool-grid">
          {SKILLS.map((skill) => (
            <div className="cred-tool" key={skill.area}>
              <dt>{skill.area}</dt>
              <dd>{skill.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
