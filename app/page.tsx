import type { ReactNode } from "react";
import Enhance from "./components/Enhance";
import { PATHFINDER } from "@/lab/shared.js";
import {
  ABOUT, AWARDS, CERTS, EDUCATION, EMAIL, EXPERIENCE, GITHUB, HERO, LINKEDIN, MORE, OPEN_SOURCE, OSS, PROJECTS, PROOF, RESUME, SKILLS,
  type Project, type Visual,
} from "./content";

const ext = { target: "_blank", rel: "noreferrer" } as const;

// "**bold**" in the copy becomes <strong>
function rich(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function VisualFallback({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return <img className={`v-${visual.frame ?? "plate"}`} src={visual.src} alt={visual.alt} loading="lazy" decoding="async" />;
    case "phone":
      return (
        <figure className="phone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={visual.src} alt={visual.alt} loading="lazy" decoding="async" />
        </figure>
      );
    case "video":
      return <video className="demo" src={visual.src} poster={visual.poster} muted loop playsInline preload="none" aria-label={visual.label} />;
    case "artifact":
      return <p className="artifact-fallback">{visual.label}</p>;
  }
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <article
      className={`pc${index % 2 ? " flip" : ""}`}
      id={project.id}
      aria-labelledby={`${project.id}-title`}
      data-pin={project.pin}
      data-stamp={project.stamp}
      data-bg={project.stampBg}
      data-where={project.where}
    >
      <div className="pc-pic">
        <VisualFallback visual={project.visual} />
      </div>
      <div className="pc-msg">
        <div className="pc-head">
          <p className="kicker mono"><span className="num">{n}</span>{project.kicker}</p>
          <h3 id={`${project.id}-title`}>{project.title}</h3>
          <p className="hook">{project.hook}</p>
          <p className="pc-place mono">{project.where} · {project.when}</p>
        </div>
        <ul className="badges" aria-label="Highlights">
          {project.badges.map((badge) => <li key={badge.text} className={badge.win ? "win" : undefined}>{badge.text}</li>)}
        </ul>
        <p className="summary">{project.summary}</p>
        <h4 className="mono built-title">What I built</h4>
        <ul className="built">
          {project.built.map((line) => <li key={line}>{rich(line)}</li>)}
        </ul>
        <p className="stack mono" aria-label="Stack">{project.stack.join(" · ")}</p>
        <div className="links">
          {project.links.map((link) => <a key={link.href} href={link.href} {...ext}>{link.label} ↗</a>)}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#projects">Skip to projects</a>

      <header className="top" id="hdr">
        <div className="shell">
          <a className="mark" href="#top" aria-label="Aaditya Desai, back to top"><b>AD</b><span>Aaditya Desai</span></a>
          <nav aria-label="Primary">
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#recognition" className="wide-only">Awards</a>
            <a href="#about" className="wide-only">About</a>
            <a href={GITHUB} className="wide-only" {...ext}>GitHub</a>
            <a href={LINKEDIN} className="wide-only" {...ext}>LinkedIn</a>
            <a className="cv" href={RESUME} {...ext}>Résumé ↗</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-name">
          <div className="hero-scene">
            <div id="map" role="region" aria-label="Illustrated map of the San Francisco Bay Area with a pin for each project"></div>
            <button className="map-entry" id="map-entry" type="button" aria-label="Open the Bay Area map explorer" aria-haspopup="dialog" disabled>Open the map</button>
            <p className="map-load mono" role="status">Drawing the Bay…</p>
            <div className="map-caption">
              <p className="map-title">Where I&apos;ve built things.</p>
              <p className="mono map-instructions">Pick a pin, or let Pathfinder show you around</p>
              <div className="map-tools">
                <button className="btn primary" id="whole" type="button" aria-haspopup="dialog" disabled>Explore the map ↗</button>
                <button className="btn" id="map-motion" type="button" aria-pressed="false" disabled>Pause</button>
              </div>
            </div>
          </div>
          <div className="hero-copy">
            <p className="eyebrow mono">{HERO.eyebrow}</p>
            <h1 id="hero-name">Aaditya Desai<span>.</span></h1>
            <p className="lead">{HERO.lead}</p>
            <p className="intro">{HERO.intro}</p>
            <div className="actions">
              <a className="btn primary" href="#projects">See my work ↓</a>
              <a className="btn" href={RESUME} {...ext}>Résumé ↗</a>
              <a className="btn" href={`mailto:${EMAIL}`}>Email me</a>
            </div>
            <p className="hero-socials">
              <a href={GITHUB} {...ext}>GitHub ↗</a>
              <a href={LINKEDIN} {...ext}>LinkedIn ↗</a>
              <span>Santa Clara, CA</span>
            </p>
          </div>
          <div className="hero-foot">
            <ul className="proof" aria-label="Highlights">
              {PROOF.map((item) => (
                <li key={item.big}><a href={item.href}><b>{item.big}</b><span>{item.small}</span></a></li>
              ))}
            </ul>
            <p className="avail"><span className="dot" aria-hidden="true"></span>{HERO.avail}</p>
          </div>
        </section>

        <div className="land">
          <section className="work shell" id="projects" aria-labelledby="work-title">
            <div className="work-heading">
              <div>
                <p className="mono">Selected work · {PROJECTS.length} projects</p>
                <h2 id="work-title">Things I&apos;ve built.</h2>
              </div>
              <p>Compilers, firmware, on-device AI, Android, and agent tooling. Each one shipped, measured, and on GitHub.</p>
            </div>
            <nav className="rack" aria-label="Jump to a project">
              {PROJECTS.map((project) => <a key={project.id} href={`#${project.id}`}>{project.title}</a>)}
            </nav>
            <div className="journey">
              {PROJECTS.map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)}
            </div>
          </section>

          <section className="sec shell" id="more" aria-labelledby="more-title">
            <div className="sec-head"><h2 id="more-title">More builds</h2><p>Smaller projects, hackathon wins, and one fast robot.</p></div>
            <ul className="more">
              {MORE.map((item) => (
                <li key={item.title}>
                  <p className="mono tag">{item.tag}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <a href={item.href} {...ext}>{item.link} ↗</a>
                </li>
              ))}
            </ul>
          </section>

          <section className="sec shell" id="open-source" aria-labelledby="oss-title">
            <div className="sec-head"><h2 id="oss-title">Open source</h2><p>Merged pull requests in projects I don&apos;t own.</p></div>
            <ul className="oss">
              {OPEN_SOURCE.map((item) => (
                <li key={item.href}>
                  <a href={item.href} {...ext}>
                    <p className="mono"><span className="merged">Merged</span>{item.repo} · {item.stars}</p>
                    <h3>{item.what}</h3>
                    <p>{item.pr}</p>
                  </a>
                </li>
              ))}
            </ul>
            <p className="oss-more"><a href={OSS} {...ext}>Every contribution, tracked live ↗</a></p>
          </section>

          <section className="sec shell" id="experience" aria-labelledby="xp-title">
            <div className="sec-head"><h2 id="xp-title">Experience</h2><p>Industry research, teaching, and leadership.</p></div>
            <ol className="xp">
              {EXPERIENCE.map((job) => (
                <li key={job.role}>
                  <p className="when mono">{job.when}<br />{job.where}</p>
                  <div>
                    <h3>{job.role}</h3>
                    <p className="org">{job.org}</p>
                    <ul>{job.points.map((point) => <li key={point}>{point}</li>)}</ul>
                    {job.link ? <p className="xp-link"><a href={job.link.href}>More on {job.link.label} ↓</a></p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="sec shell" id="recognition" aria-labelledby="awards-title">
            <div className="sec-head"><h2 id="awards-title">Recognition</h2><p>Awards, honors, and certifications.</p></div>
            <ul className="awards">
              {AWARDS.map((award) => (
                <li key={award.title} className={award.win ? "win" : undefined}><b>{award.title}</b><span>{award.detail}</span></li>
              ))}
            </ul>
            <p className="certs"><span className="mono">Certifications</span>{CERTS.join(" · ")}</p>
          </section>

          <section className="sec shell split" id="education" aria-labelledby="edu-title">
            <div>
              <div className="sec-head"><h2 id="edu-title">Education</h2></div>
              <ul className="edu">
                {EDUCATION.map((school) => (
                  <li key={school.school}>
                    <p className="when mono">{school.when}</p>
                    <h3>{school.school}</h3>
                    <p className="org">{school.degree}</p>
                    <p className="note">{school.note}</p>
                    <p className="courses"><span className="mono">Coursework</span>{school.courses}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div id="skills">
              <div className="sec-head"><h2>Toolbox</h2></div>
              <dl className="skills">
                {SKILLS.map((group) => (
                  <div key={group.area}><dt className="mono">{group.area}</dt><dd>{group.items.join(" · ")}</dd></div>
                ))}
              </dl>
            </div>
          </section>

          <section className="sec shell" id="about" aria-labelledby="about-title">
            <div className="sec-head"><h2 id="about-title">About</h2></div>
            <div className="about">
              <div>{ABOUT.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              <ul>
                <li><span className="mono">Based</span>Santa Clara, CA</li>
                <li><span className="mono">Studying</span>B.S. Computer Engineering, minor in AI, SJSU</li>
                <li><span className="mono">Graduating</span>May 2028</li>
                <li><span className="mono">Available</span>Summer 2027 · Winter 2027 co-op</li>
              </ul>
            </div>
          </section>

          <footer className="shell" id="contact">
            <button className="pathfinder" type="button" aria-label="Pathfinder, the robot from the map, says hi" data-pathfinder>
              <svg viewBox="40 30 160 195" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d={PATHFINDER[0]} fill="#FBFAFE" />
                  {PATHFINDER.slice(1, 6).map((d: string) => <path key={d} d={d} />)}
                  <g className="pf-arm-l"><path d={PATHFINDER[6]} /></g>
                  <g className="pf-arm-r"><path d={PATHFINDER[7]} /></g>
                  <path d={PATHFINDER[8]} />
                </g>
                <ellipse className="pf-eye" cx="122" cy="130" rx="7" ry="7" fill="#FF5A47" />
                <circle cx="120" cy="165" r="4" fill="#FF5A47" />
              </svg>
            </button>
            <p className="mono kicker-accent">Summer 2027 internships · Winter 2027 co-ops</p>
            <h2>Let&apos;s build something<span>.</span></h2>
            <p>I&apos;m looking for roles in software, AI/ML, and embedded systems. Email is the fastest way to reach me.</p>
            <div className="actions">
              <a className="btn primary" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a className="btn" href={RESUME} {...ext}>Résumé ↗</a>
              <a className="btn" href={GITHUB} {...ext}>GitHub ↗</a>
              <a className="btn" href={LINKEDIN} {...ext}>LinkedIn ↗</a>
            </div>
            <div className="fline mono"><span>Aaditya Desai</span><span>Santa Clara, CA</span><span>aadityad.dev</span></div>
          </footer>
        </div>
      </main>

      <dialog className="map-explorer" id="map-explorer" aria-labelledby="explorer-title">
        <div className="explorer-stage" id="explorer-stage"></div>
        <div className="explorer-bar">
          <div><h2 id="explorer-title">Around the Bay.</h2><p>Drag to wander · scroll to zoom · pick a pin</p></div>
          <div className="explorer-controls">
            <button className="btn" id="explorer-reset" type="button">Whole Bay</button>
            <button className="btn" id="explorer-motion" type="button">Pause</button>
            <button className="btn primary" id="explorer-close" type="button">Back to site ↙</button>
          </div>
        </div>
        <nav className="explorer-index" id="explorer-index" aria-label="Projects by place"></nav>
        <aside className="project-preview" id="project-preview" aria-label="Selected project" hidden>
          <div className="preview-top"><p className="mono" id="preview-place"></p><button id="preview-dismiss" type="button" aria-label="Close preview">×</button></div>
          <h3 id="preview-title" aria-live="polite" aria-atomic="true">Project</h3>
          <div id="preview-artifact"></div>
          <p className="preview-hook" id="preview-hook"></p>
          <p className="preview-meta mono" id="preview-meta"></p>
          <div className="preview-related" id="preview-related"></div>
          <button className="btn primary preview-cta" id="preview-cta" type="button">View full project ↓</button>
        </aside>
      </dialog>
      <Enhance />
    </>
  );
}
