import { Fragment } from "react";
import { AWARDS_BRIEF, CERTS_BRIEF, EDUCATION, OPEN_SOURCE, OSS } from "../../content";

export default function Credentials() {
  return (
    <section id="education" className="brief-cred" aria-labelledby="credentials-h">
      <header className="pi-head">
        <h2 id="credentials-h">Education</h2>
        <p>Degrees, awards, open source.</p>
      </header>
      <div className="cred-cols">
        <div className="cred-col">
          <ul className="edu">
            {EDUCATION.map((e) => (
              <li key={e.school}>
                <h3>{e.school}</h3>
                <p className="edu-deg">{e.degree}</p>
                <span className="edu-meta">
                  {e.when} · {e.note}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="cred-col">
          <h3 className="cred-h" id="awards">Awards</h3>
          <ul className="awards-list">
            {AWARDS_BRIEF.map((a) => (
              <li key={a.t}><b>{a.t}</b> · {a.d}</li>
            ))}
          </ul>
          <h3 className="cred-h" id="open-source">Open source</h3>
          <p className="oss-line">
            Merged upstream: {OPEN_SOURCE.map((o, i) => (
              <Fragment key={o.href}>
                {i > 0 && ", "}<a href={o.href} target="_blank" rel="noreferrer">{o.name}</a> ({o.stars})
              </Fragment>
            ))}
            . <a href={OSS} target="_blank" rel="noreferrer">All contributions ↗</a>
          </p>
          <h3 className="cred-h">Certifications</h3>
          <p className="certs-line">{CERTS_BRIEF.join(" · ")}</p>
        </div>
      </div>
    </section>
  );
}
