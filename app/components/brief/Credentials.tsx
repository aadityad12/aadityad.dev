import { AWARDS, CERTS, EDUCATION, OPEN_SOURCE, OSS, SKILLS } from "../../content";
import Status from "../Status";

export default function Credentials() {
  return (
    <section id="education" className="brief-cred" aria-labelledby="credentials-h">
      <header className="pi-head">
        <h2 id="credentials-h">Credentials</h2>
        <p>Degrees, awards, merged pull requests, and the toolbox.</p>
      </header>
      <div className="cred-cols">
        <div className="cred-col">
          <h3 className="cred-h">Education</h3>
          <ul className="edu">
            {EDUCATION.map((e) => (
              <li key={e.school}>
                <b>{e.school}</b>
                <span className="edu-deg">{e.degree}</span>
                <span className="edu-meta">
                  {e.when} · {e.note}
                </span>
                <span className="edu-courses">Coursework: {e.courses}</span>
              </li>
            ))}
          </ul>

          <h3 className="cred-h" id="awards">Awards</h3>
          <table className="awards">
            <caption className="visually-hidden">Awards</caption>
            <thead className="visually-hidden">
              <tr>
                <th scope="col">Award</th>
                <th scope="col">Detail</th>
              </tr>
            </thead>
            <tbody>
              {AWARDS.map((a) => (
                <tr key={a.t}>
                  <th scope="row">{a.t}</th>
                  <td>{a.d}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="cred-h">Certifications</h3>
          <ul className="certs">
            {CERTS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div className="cred-col">
          <h3 className="cred-h" id="open-source">Open source</h3>
          <ul className="oss">
            {OPEN_SOURCE.map((o) => (
              <li key={o.href}>
                <a href={o.href} target="_blank" rel="noreferrer">
                  <span className="oss-line">
                    Merged · {o.repo} · {o.stars} <Status s="Repo" />
                  </span>
                  <b>{o.name}</b>
                  <span className="oss-what">{o.what}</span>
                  <span className="oss-pr">{o.pr}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="oss-more">
            <a href={OSS} target="_blank" rel="noreferrer">
              Every contribution, tracked live ↗
            </a>
          </p>

          <h3 className="cred-h" id="toolbox">Toolbox</h3>
          <dl className="toolbox">
            {SKILLS.map((s) => (
              <div key={s.area}>
                <dt>{s.area}</dt>
                <dd>{s.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
