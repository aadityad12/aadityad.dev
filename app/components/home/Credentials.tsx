import { AWARDS, CERTS, EDUCATION, OPEN_SOURCE, OSS, SKILLS } from "../../content";

export default function Credentials() {
  return (
    <section id="education" className="section wrap">
      <div className="section-head"><h2>Education and recognition</h2></div>
      <div className="cred-grid">
        <div className="cred-block">
          <h3>Education</h3>
          <ul className="cred-list">
            {EDUCATION.map((entry) => <li key={entry.school}>
              <strong>{entry.school}</strong><p>{entry.degree}</p><p>{entry.when}</p><p>{entry.note}</p><p className="cred-quiet">{entry.courses}</p>
            </li>)}
          </ul>
        </div>
        <div className="cred-block">
          <h3>Recognition</h3>
          <ul className="cred-list">
            {AWARDS.map((award) => <li key={award.t}><strong>{award.t}</strong><p className="cred-quiet">{award.d}</p></li>)}
          </ul>
          <h4>Certifications</h4>
          <ul className="cred-list cred-certs">{CERTS.map((cert) => <li key={cert}>{cert}</li>)}</ul>
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
      <div className="cred-tools">
        <h3>Tools</h3>
        <dl>{SKILLS.map((skill) => <div className="cred-tool-row" key={skill.area}><dt>{skill.area}</dt><dd>{skill.items.join(", ")}</dd></div>)}</dl>
      </div>
    </section>
  );
}
