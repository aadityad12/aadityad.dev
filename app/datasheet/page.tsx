import type { Metadata } from "next";
import AppNote from "../components/AppNote";
import BlockDiagram from "../components/BlockDiagram";
import Chip from "../components/Chip";
import Masthead from "../components/Masthead";
import { SectionHead, Sheet } from "../components/parts";
import { FIGURES } from "../figures";
import {
  ABOUT,
  ALSO,
  APPLICATIONS,
  AWARDS,
  CERTS,
  COURSEWORK,
  DESCRIPTION,
  DEVPOST,
  EDUCATION,
  EMAIL,
  FEATURES,
  GITHUB,
  LINKEDIN,
  NOTES,
  OPEN_SOURCE,
  OSS,
  PINS,
  RESUME,
  REVISIONS,
  SPECS,
} from "../content";

export const metadata: Metadata = {
  title: "AD2028 Datasheet · Aaditya Desai",
  description:
    "Computer engineering student at SJSU building from the metal up: an ARM64 JIT, bare-metal firmware, on-device vision, and tools for AI agents. Available for Summer 2027 internships.",
};

const noteById = (id: string) => NOTES.find((n) => n.id === id)!;
const statusClass = (s: string) => (s === "Measured" ? "measured" : s === "Observed" ? "observed" : s === "Single run" ? "single" : "repo");

export default function Home() {
  const half = Math.ceil(PINS.length / 2);
  return (
    <>
      <a className="skip-link" href="#block-diagram">Skip to projects</a>
      <Masthead />
      <main>
        {/* ---------------- Page 1 ---------------- */}
        <Sheet id="top" page={1} title="Engineer, intern grade · Datasheet" section="1|Overview">
          <div className="hero">
            <div>
              <p className="part-line">
                <span className="pn">AD2028</span>
                <span>Computer Engineering · SJSU</span>
                <span className="status"><i />Sampling for Summer 2027</span>
              </p>
              <h1 className="name">
                <span>Aaditya</span>
                <span>Desai</span>
              </h1>
              <p className="tagline">
                Software for real constraints, <em>from the metal up</em>: an ARM64 JIT, bare-metal firmware, on-device vision, and tools for AI agents.
              </p>
              <div className="actions">
                <a className="button primary" href={RESUME} target="_blank" rel="noreferrer">Résumé PDF ↓</a>
                <a className="button" href={`mailto:${EMAIL}`}>Email</a>
                <a className="button" href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗</a>
                <a className="button" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              </div>
            </div>
            <Chip />
          </div>

          <div className="front">
            <div>
              <h2><span>1</span>Features</h2>
              <ul className="feat">
                {FEATURES.map((f) => (
                  <li key={f.k}><b>{f.k}</b>: {f.v}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2><span>2</span>Applications</h2>
              <ul className="feat">
                {APPLICATIONS.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p style={{ marginTop: 14 }}>Available <b>May to August 2027</b>. Based in Santa Clara, CA.</p>
            </div>
            <div>
              <h2><span>3</span>Description</h2>
              <p>{DESCRIPTION}</p>
              <p>
                This datasheet documents ten devices he built. Each has an application note with a working figure you can operate, and an errata box for what does not work yet.
              </p>
            </div>
          </div>
        </Sheet>

        {/* ---------------- Page 2 ---------------- */}
        <Sheet id="block-diagram" page={2} title="Functional block diagram" section="4|Functional block diagram">
          <SectionHead num="4" title="Functional block diagram" aside="Projects as signal chains" />
          <p className="lede">
            Every project is one block: what goes in, what it does, and what comes out. Two shared lines run through the whole device: which blocks work with no network, and which ones leave the final say to a person.
          </p>
          <BlockDiagram />
        </Sheet>

        {/* ---------------- Page 3 ---------------- */}
        <Sheet id="specs" page={3} title="Pin configuration and specifications" section="5|Pins and specifications">
          <SectionHead num="5" title="Pin configuration and functions" aside="28 pins" />
          <p className="lede">The pins on Figure 0, as a table. Each one is a skill, linked to the application notes where it carries a signal.</p>
          <div className="spec-grid">
            {[PINS.slice(0, half), PINS.slice(half)].map((col, ci) => (
              <div className="tbl-wrap" key={ci}>
                <table className="dt pin-tbl">
                  <thead>
                    <tr><th>Pin</th><th>Name</th><th>Type</th><th>Function</th><th>Used in</th></tr>
                  </thead>
                  <tbody>
                    {col.map((p) => (
                      <tr key={p.n}>
                        <td className="num">{p.n}</td>
                        <td className="mono" style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</td>
                        <td className="pin-type">{p.type}</td>
                        <td className="cond">{p.desc}</td>
                        <td className="uses">
                          {p.uses.length ? p.uses.map((u) => <a key={u} href={`#${u}`}>{noteById(u).an}</a>) : <span className="muted">TA</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <SectionHead num="6" title="Specifications" />
          <div className="spec-grid">
            <div>
              <div className="ssh"><span>6.1</span>Absolute maximum ratings</div>
              <div className="tbl-wrap">
                <table className="dt">
                  <thead><tr><th>Parameter</th><th style={{ textAlign: "right" }}>Max</th><th>Note</th></tr></thead>
                  <tbody>
                    {SPECS.absMax.map((r) => (
                      <tr key={r.p}><td>{r.p}</td><td className="big">{r.v}</td><td className="muted">{r.note}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="ssh"><span>6.2</span>Recommended operating conditions</div>
              <div className="tbl-wrap">
                <table className="dt">
                  <thead><tr><th>Parameter</th><th>Min</th><th>Typ</th><th>Max</th><th>Note</th></tr></thead>
                  <tbody>
                    {SPECS.operating.map((r) => (
                      <tr key={r.p}>
                        <td>{r.p}</td>
                        <td className="num">{r.min}</td>
                        <td className="num" style={{ fontWeight: 600 }}>{r.typ}</td>
                        <td className="num">{r.max}</td>
                        <td className="muted">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="ssh"><span>6.3</span>Electrical characteristics</div>
          <div className="tbl-wrap">
            <table className="dt">
              <thead>
                <tr><th>Parameter</th><th>Test conditions</th><th style={{ textAlign: "right" }}>Typ</th><th>Unit</th><th>Status</th><th>Source</th></tr>
              </thead>
              <tbody>
                {SPECS.electrical.map((r) => (
                  <tr key={r.p}>
                    <td>{r.p}</td>
                    <td className="cond">{r.cond}</td>
                    <td className="big">{r.typ}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{r.u}</td>
                    <td><span className={`tag ${statusClass(r.status)}`}>{r.status}</span></td>
                    <td><a href={`#${r.src}`}>{noteById(r.src).an} →</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="note">
            Measured: a recorded result in the repo. Observed: read live during a hackathon, not logged. Single run: one hackathon-scale benchmark. Repo: a count you can check in the code.
          </p>
        </Sheet>

        {/* ---------------- Application notes ---------------- */}
        {NOTES.map((n, i) => {
          const F = FIGURES[n.id];
          return (
            <AppNote key={n.id} note={n} index={i + 1} page={4 + i}>
              {F ? <F /> : null}
            </AppNote>
          );
        })}

        {/* ---------------- Page 14 ---------------- */}
        <Sheet id="revisions" page={14} title="Revision history and background" section="8|Revision history">
          <SectionHead num="8" title="Revision history" aside="Experience, newest first" />
          <div className="tbl-wrap">
            <table className="dt rev-tbl">
              <thead><tr><th>Rev</th><th>Date</th><th>Changes</th></tr></thead>
              <tbody>
                {REVISIONS.map((r) => (
                  <tr key={r.rev}>
                    <td>{r.rev}</td>
                    <td>{r.date}</td>
                    <td>
                      <span className="role">{r.title}</span>
                      <span className="org">{r.org}{r.link && <> · <a href={r.link}>see AN-03</a></>}</span>
                      <ul>{r.points.map((p) => <li key={p}>{p}</li>)}</ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="two" style={{ marginTop: 34 }}>
            <div>
              <div className="ssh"><span>8.1</span>Education</div>
              <div className="tbl-wrap">
                <table className="dt">
                  <tbody>
                    {EDUCATION.map((e) => (
                      <tr key={e.school}>
                        <td><b style={{ fontWeight: 650 }}>{e.school}</b><span className="muted" style={{ display: "block" }}>{e.degree}</span></td>
                        <td className="num" style={{ fontSize: 12.5 }}>{e.when}<span className="muted" style={{ display: "block" }}>{e.note}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="note">Coursework: {COURSEWORK}</p>

              <div className="ssh"><span>8.2</span>Awards and certifications</div>
              <div className="tbl-wrap">
                <table className="dt">
                  <tbody>
                    {AWARDS.map((a) => (
                      <tr key={a.t}><td style={{ fontWeight: 650 }}>{a.t}</td><td className="cond">{a.d}</td></tr>
                    ))}
                    {CERTS.map((c) => (
                      <tr key={c}><td className="muted" colSpan={2}>{c}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="ssh"><span>8.3</span>Merged upstream</div>
              <ul className="oss-list">
                {OPEN_SOURCE.map((o) => (
                  <li key={o.name}>
                    <b>{o.name} {o.stars}</b>{o.what} <a href={o.href} target="_blank" rel="noreferrer">PR ↗</a>
                  </li>
                ))}
                <li><a href={OSS} target="_blank" rel="noreferrer">All contributions at oss.aadityad.dev ↗</a></li>
              </ul>
              <div className="ssh"><span>8.4</span>Also built</div>
              <ul className="oss-list">
                {ALSO.map((a) => (
                  <li key={a.title}><b>{a.title}</b>{a.text} <span className="muted">{a.tag}.</span> <a href={a.href} target="_blank" rel="noreferrer">Link ↗</a></li>
                ))}
              </ul>
            </div>
          </div>

          <SectionHead num="9" title="Device background" aside="About" />
          <div className="about two">
            <div>{ABOUT.slice(0, 2).map((p) => <p key={p}>{p}</p>)}</div>
            <div>{ABOUT.slice(2).map((p) => <p key={p}>{p}</p>)}</div>
          </div>
        </Sheet>

        {/* ---------------- Page 15 ---------------- */}
        <Sheet id="ordering" page={15} title="Ordering information" section="10|Ordering information">
          <SectionHead num="10" title="Ordering information" aside="Contact" />
          <div className="order">
            <div>
              <h2 className="order-h">Get in touch.</h2>
              <p className="lede">I&apos;m looking for Summer 2027 internships in software, embedded systems, and ML or AI infrastructure. Email is the fastest way to reach me.</p>
              <div className="lbl" style={{ marginTop: 26 }}>Part number decoder</div>
              <div className="decoder" aria-label="Part number AD2028-SU27-SWE">
                <span data-k="Initials">AD</span>
                <span data-k="Class of 2028">2028</span>
                <span className="sep">-</span>
                <span data-k="Summer 2027, May to Aug">SU27</span>
                <span className="sep">-</span>
                <span data-k="Software, systems, ML">SWE</span>
              </div>
            </div>
            <div>
              <ul className="contact-list">
                <li><a href={`mailto:${EMAIL}`}><span>Email</span><span>{EMAIL}</span><span>→</span></a></li>
                <li><a href={RESUME} target="_blank" rel="noreferrer"><span>Résumé</span><span>One-page PDF</span><span>↓</span></a></li>
                <li><a href={GITHUB} target="_blank" rel="noreferrer"><span>GitHub</span><span>github.com/aadityad12</span><span>↗</span></a></li>
                <li><a href={LINKEDIN} target="_blank" rel="noreferrer"><span>LinkedIn</span><span>in/aaditya-desai-12d</span><span>↗</span></a></li>
                <li><a href={DEVPOST} target="_blank" rel="noreferrer"><span>Devpost</span><span>devpost.com/aadityad12</span><span>↗</span></a></li>
              </ul>
              <p className="colophon">
                Colophon: a static Next.js export with no tracking. Every figure is hand-built SVG and runs in your browser. Press <span className="kbd">J</span> and <span className="kbd">K</span> to page through the sheets, or print this page for a paper copy.
              </p>
            </div>
          </div>
        </Sheet>
      </main>
    </>
  );
}
