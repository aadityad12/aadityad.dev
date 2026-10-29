import Link from "next/link";
import Navigation from "./components/sol/Navigation";
import ConstraintLab from "./components/sol/ConstraintLab";
import ProjectExhibit from "./components/sol/ProjectExhibit";
import Contact from "./components/sol/Contact";
import { Arrow } from "./components/sol/Icons";
import { archive, contact, projects } from "./lib/portfolio";

export default function Home() {
  return <>
    <Navigation home />
    <main id="main">
      <section className="hero wrap" id="top">
        <div className="hero-meta"><span className="eyebrow"><span className="blue-text">A BUILDER’S PORTFOLIO</span> / SELECTED WORK, 2026</span><span className="hero-location">BASED IN THE BAY AREA <span>↙</span></span></div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-intro-label">Hi, I’m Aaditya.</p>
            <h1>Big ideas.<br />Real <em>constraints.</em></h1>
            <p className="hero-description">I make AI agents remember, phones speak with a glance, and small computers see. Computer engineering at San José State, building from the silicon to the interface.</p>
            <div className="hero-actions"><a className="button blue" href="#work">Explore the work <Arrow /></a><a className="text-link" href={contact.resume} target="_blank" rel="noreferrer">The résumé version <Arrow diagonal /></a></div>
            <div className="hero-availability"><span className="availability"><i /> LOOKING FOR MY NEXT HARD PROBLEM</span><p>Summer 2027 internships · Winter 2027 co-ops</p></div>
          </div>
          <ConstraintLab />
        </div>
        <div className="proof-strip"><div className="proof-intro"><span className="eyebrow">A FEW REASONS<br />TO KEEP SCROLLING</span><span aria-hidden="true">↓</span></div><div><b>Berkeley AI Hackathon</b><span>2026 SPONSOR-TRACK WINNER</span></div><div><b>Infineon × De Anza</b><span>RESEARCH & TECHNICAL LEADERSHIP</span></div><div><b>Hardware to human</b><span>ARM64 · EMBEDDED AI · ANDROID</span></div></div>
      </section>

      <section className="work-section wrap" id="work">
        <div className="section-heading"><div><span className="eyebrow">01 / SELECTED WORK</span><h2>Less pitch.<br /><em>More proof.</em></h2></div><p>Five different problems. One throughline:<br />make the constraints part of the design.<br /><span>Every exhibit below is yours to explore.</span></p></div>
        <nav className="work-index" aria-label="Jump to a project">{projects.map(project => <a key={project.id} href={`#${project.id}`}><span>{project.number}</span>{project.name}<span className="index-arrow">↙</span></a>)}</nav>
        <div className="project-list">{projects.map(project => <article className={`project-row project-${project.id}`} id={project.id} key={project.id}>
          <div className="project-visual"><div className="project-visual-label"><span>{project.number} / {project.category}</span><span>ENGINEERING EXHIBIT</span></div><ProjectExhibit id={project.id} /></div>
          <div className="project-copy"><div className="project-title-row"><h3>{project.name}</h3><a className="project-repo-icon" href={project.repo} target="_blank" rel="noreferrer" aria-label={`${project.name} source on GitHub`}><Arrow diagonal /></a></div><h4>{project.headline}</h4><p className="project-description">{project.description}</p><p className="project-role"><span>MY PART</span>{project.role}</p><div className="project-proof"><b>{project.proof.value}</b><span>{project.proof.label}</span></div><div className="project-stack">{project.stack.join(" / ")}</div><Link className="case-link" href={`/work/${project.id}/`}>Inside the build <Arrow /></Link></div>
        </article>)}</div>
        <div className="archive"><div className="archive-heading"><h3>The other tabs I have open.</h3><span className="eyebrow">MORE THINGS I’VE BUILT</span></div>{archive.map((project, i) => <details key={project.name} className="archive-row"><summary><span className="archive-number">0{i+6}</span><span className="archive-name">{project.name}</span><span className="archive-description">{project.description}</span><span className="archive-plus" aria-hidden="true">+</span></summary><div className="archive-content"><p>{project.detail}</p><div><span className="eyebrow">{project.stack}</span><a href={project.repo} target="_blank" rel="noreferrer">View source <Arrow diagonal /></a></div></div></details>)}</div>
      </section>

      <section className="about-section" id="about"><div className="wrap"><div className="about-layout"><div className="about-title"><span className="eyebrow">02 / THE PERSON BEHIND THE PROJECTS</span><h2>Curious down<br />to the <em>metal.</em></h2><div className="about-coordinate"><span aria-hidden="true">✳</span><p>SJSU → THE BAY → WHAT’S NEXT<br /><span>37.3541° N / 121.9552° W</span></p></div></div><div className="about-copy"><p className="about-lead">I like knowing what’s happening underneath.</p><p>Sometimes that means writing ARM64 instructions by hand. Sometimes it means finding out why a radar is confidently measuring the wrong thing. And sometimes it means using my own app long enough to discover that a receipt parser thinks a street number is a price.</p><p>I’m studying computer engineering at San José State, with a minor in AI. I also teach introductory engineering, where a big part of the job is helping someone turn “it doesn’t work” into a question they can actually answer.</p><p className="about-principle">Build it. Measure it. Understand what broke.<br /><strong>Then make it better.</strong></p><div className="education"><span className="eyebrow">CURRENTLY</span><div><b>B.S. Computer Engineering · AI minor</b><p>San José State University · Class of 2028<br />3.8 GPA · Dean’s Scholar</p></div></div></div></div></div></section>

      <section className="experience-section wrap" id="experience"><div className="experience-intro"><span className="eyebrow">03 / ALONG THE WAY</span><h2>Real work.<br /><em>Shared knowledge.</em></h2><p>Building things is one half.<br />Helping other people build is the other.</p><a className="text-link" href={contact.resume} target="_blank" rel="noreferrer">Full résumé <Arrow diagonal /></a></div><div className="experience-list">
        <article><div className="experience-date"><span>APR — JUN 2026</span><span>01</span></div><h3>Infineon Technologies</h3><p className="experience-position">Research Intern & Technical Lead</p><p>With De Anza College. Led a five-person group from concept to a working assistive-vision prototype. Owned the device software, from camera capture to spoken warnings.</p><a href="#visionassist">Meet the device <Arrow /></a></article>
        <article><div className="experience-date"><span>AUG 2026 — PRESENT</span><span>02</span></div><h3>San José State University</h3><p className="experience-position">Teaching Assistant · Introduction to Engineering</p><p>Two weekly lab sections covering CAD, programming, and circuits. A lot of live debugging, and a lot of making a hard problem feel approachable.</p></article>
        <article><div className="experience-date"><span>JAN — DEC 2025</span><span>03</span></div><h3>De Anza College</h3><p className="experience-position">Teaching Assistant & CS Tutor</p><p>C++, x86 assembly, Python, and data structures. Tracing bugs from symptom to root cause, alongside students writing their first programs.</p></article>
      </div></section>
    </main>
    <Contact />
  </>;
}
