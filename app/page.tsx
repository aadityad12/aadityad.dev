import Image from "next/image";
import { SiteHeader } from "./components/SiteHeader";
import { Scope } from "./components/Scope";
import { Plate } from "./components/Plate";
import { Fold } from "./components/Fold";
import { Ladder } from "./components/Ladder";
import { Dwell } from "./components/Dwell";
import { Sight } from "./components/Sight";
import { LocalFirst } from "./components/LocalFirst";
import { Scout } from "./components/Scout";
import { Protocol } from "./components/Protocol";
import { EchoStory } from "./components/EchoPath";
import { DemoVideo } from "./components/DemoVideo";
import { also, experience, person, projects, proofs, type Project } from "./lib/content";

function Exhibit({ id }: { id: Project["exhibit"] }) {
  switch (id) {
    case "fold":
      return (
        <div className="stage-split">
          <Fold />
          <DemoVideo />
        </div>
      );
    case "ladder":
      return <Ladder />;
    case "dwell":
      return <Dwell />;
    case "sight":
      return <Sight />;
    case "local":
      return (
        <div className="diptych">
          <LocalFirst />
          <div className="phone">
            <div className="phone-screen">
              <Image
                src="/projects/apextracker-dashboard.png"
                alt="ApexTracker dashboard. Two of four goals are met: screen time under six hours, and reading a paper. An eight-week consistency grid sits below."
                fill
                sizes="260px"
                style={{ objectFit: "contain", objectPosition: "center top" }}
              />
            </div>
          </div>
        </div>
      );
    case "scout":
      return <Scout />;
    case "echo":
      return (
        <div className="diptych">
          <EchoStory />
          <div className="phone">
            <div className="phone-screen">
              <Image
                src="/projects/echo-alert.png"
                alt="Echo alert details for a severe thunderstorm warning. The echo path says the alert was received from a relay node, with zero further echoes."
                fill
                sizes="260px"
                style={{ objectFit: "contain", objectPosition: "center top" }}
              />
            </div>
          </div>
        </div>
      );
    case "protocol":
      return <Protocol />;
  }
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero shell" id="top">
          <div className="hero-meta">
            <p className="kicker">Computer engineering · SJSU · 2028</p>
            <p className="kicker">Santa Clara · Summer 2027</p>
          </div>
          <div className="hero-title">
            <h1>Aaditya Desai</h1>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#work">See the work</a>
              <a className="btn" href={person.resume} target="_blank" rel="noreferrer">Résumé</a>
              <a className="text-link" href={`mailto:${person.email}`}>{person.email}</a>
            </div>
          </div>
          <Scope />
          <dl className="proofs">
            {proofs.map((item) => (
              <div key={item.kicker}>
                <dt>{item.kicker}</dt>
                <dd>
                  <strong>{item.value}</strong>
                  <span>{item.detail}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="work" id="work">
          <div className="shell">
            <div className="section-head">
              <h2>Selected work</h2>
              <p>Each one had to fit inside something real: a context window, a phone with no network, a Raspberry Pi, or a day I actually live.</p>
            </div>
            <nav className="work-index" aria-label="Projects">
              {projects.map((project) => (
                <a key={project.id} href={`#${project.id}`}><span>{project.index}</span>{project.title}</a>
              ))}
            </nav>
            {projects.map((project) => {
              const { exhibit, ...plate } = project;
              return <Plate key={project.id} {...plate} exhibit={<Exhibit id={exhibit} />} />;
            })}
            <p className="also">
              Also, <a href={also.href} target="_blank" rel="noreferrer">{also.name}</a>. {also.text}
            </p>
          </div>
        </section>

        <section className="band" id="experience">
          <div className="shell">
            <div className="section-head">
              <h2>Along the way</h2>
              <p>Research, then teaching. The résumé has the full page.</p>
            </div>
            <div className="roles">
              {experience.map((role) => (
                <article key={role.place} className="role">
                  <p className="kicker">{role.when}</p>
                  <div>
                    <h3>{role.place}</h3>
                    <p className="role-title">{role.role}</p>
                    <p>{role.text}</p>
                    {role.href ? <a className="text-link" href={role.href}>{role.hrefLabel}</a> : null}
                  </div>
                </article>
              ))}
            </div>
            <p className="resume-row">
              <a className="btn" href={person.resume} target="_blank" rel="noreferrer">Full résumé</a>
            </p>
          </div>
        </section>

        <section className="band" id="about">
          <div className="shell about-grid">
            <div>
              <p className="kicker">About</p>
              <h2>Closer to the hardware.</h2>
              <div className="about-copy">
                <p>
                  I’m from India, and I got into engineering through VEX robotics, programming robots in RobotC. That came full circle this year: I wrote the control code for my team’s robot in SJSU’s ENGR 10, then came back the next semester to TA the course. I planned on computer science and switched to computer engineering to get closer to the hardware.
                </p>
                <p>
                  A lot of what I build starts with something I need or want to understand. ApexTracker began as a way to make myself code every day and ended up replacing my reminder apps and spreadsheets. Teaching shaped how I debug: trace the symptom back to its cause and explain the mechanism, rather than hand over a fix.
                </p>
                <p>
                  The same habit is in the projects. If a rung gets slower, or a radar range doesn’t belong to the object, I would rather publish that than smooth it over.
                </p>
              </div>
            </div>
            <ul className="about-meta">
              <li><span>Study</span>B.S. Computer Engineering, AI minor. San José State, expected May 2028. GPA 3.8, Dean’s Scholar.</li>
              <li><span>Before that</span>De Anza College, certificate in C and C++, with honors. GPA 3.8.</li>
              <li><span>Based</span>Santa Clara, California.</li>
              <li><span>Looking for</span>Summer 2027 software, ML, or systems internships.</li>
              <li><span>Also</span>ICPC 2025 Division 2, top 10 at site. DA Hacks 3.5, 2nd place. Co-founded the Applied Data Analytics Club at De Anza, 54 members.</li>
            </ul>
          </div>
        </section>

        <section className="band contact" id="contact">
          <div className="shell">
            <p className="kicker">Summer 2027</p>
            <h2>Get in touch.</h2>
            <p className="intro">Email is the fastest way. I’m looking for software engineering, ML, and systems roles.</p>
            <a className="contact-email" href={`mailto:${person.email}`}>{person.email}</a>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${person.email}`}>Email me</a>
              <a className="btn" href={person.resume} target="_blank" rel="noreferrer">Résumé</a>
              <a className="btn" href={person.github} target="_blank" rel="noreferrer">GitHub</a>
              <a className="btn" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell">
          <span>Aaditya Desai</span>
          <span>Santa Clara</span>
          <span>Summer 2027</span>
        </div>
      </footer>
    </>
  );
}
