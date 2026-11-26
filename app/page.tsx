import Link from "next/link";
import Navigation from "./components/sol/Navigation";
import IdeaSculpture from "./components/sol/IdeaSculpture";
import ProjectStage from "./components/sol/ProjectStage";
import WorkRail from "./components/sol/WorkRail";
import Contact from "./components/sol/Contact";
import HeroClaims from "./components/sol/HeroClaims";
import { NameMorph } from "./components/sol/Brand";
import HeroMascot from "./components/mascot/HeroMascot";
import { Arrow } from "./components/sol/Icons";
import { archive, contact, projects } from "./lib/portfolio";

const summaries: Record<string, string> = {
  accordion: "AI agents shouldn’t have to lose their train of thought. A visual, reversible memory layer for long coding sessions.",
  rung: "How fast can a small language go? I built the same language five ways, all the way down to handwritten ARM64.",
  alta: "A TA for the electronics bench. A probe pod measures the student’s circuit, and a voice agent walks them to the fault with hints instead of answers.",
  gazeboard: "For someone who can’t speak or use their hands, a glance can be a whole sentence.",
  visionassist: "A wearable that spots what’s ahead and says how far away it is, entirely on the device.",
  apextracker: "I wanted less life admin. So I built the local-first Android app I now use every day.",
};
const toolbox = ["C / C++20", "ARM64 assembly", "Python", "TypeScript", "Kotlin", "React", "FastAPI", "OpenCV", "Raspberry Pi & AVR"];
const featured = projects.slice(0, 3);
const compact = projects.slice(3);

export default function Home() {
  return <>
    <Navigation home />
    <div className="page-shell">
    <div className="name-rail"><div className="wrap"><a className="hero-name" href="#top"><span className="sr-only">Hi, I’m Aaditya Desai.</span><NameMorph greeting /></a><span className="hero-role">COMPUTER ENGINEERING · SJSU · CLASS OF 2028</span></div></div>
    <main id="main">
      <section className="hero wrap" id="top">
        <div className="hero-main">
          <div className="hero-copy"><h1>I wonder.<br />Then I <span>build.</span></h1><HeroClaims /><p className="hero-intro">I’m a computer engineering student at San José State,<br />looking for a Summer 2027 internship.</p><a className="pill-link" href="#work"><span>See what I mean</span><span className="pill-arrow"><Arrow /></span></a></div>
          <IdeaSculpture />
        </div>
        <div className="hero-foot"><div className="hero-proof"><span className="proof-star" aria-hidden="true">✳</span><p>Berkeley AI Hackathon<span>2026 sponsor-track winner</span></p></div><div className="hero-proof"><span className="proof-symbol" aria-hidden="true">↗</span><p>Infineon × De Anza<span>Research & technical leadership</span></p></div><a href={`mailto:${contact.email}`} className="hero-open"><span className="orange-dot" /><span>Open to 2027 internships<br /><small>Let’s build something together.</small></span><Arrow diagonal /></a></div>
      </section>
      <div className="toolbox"><div className="wrap"><span className="eyebrow">WHAT I BUILD WITH</span><ul>{toolbox.map(tool => <li key={tool}>{tool}</li>)}</ul></div></div>

      <section className="work-section wrap" id="work"><div className="work-heading" data-entrance><div><span className="eyebrow">01 / SELECTED WORK</span><h2>Not just ideas. <span>Things I’ve built.</span></h2></div><p>Go on. Pull them apart.</p></div>
        <div className="work-index"><WorkRail items={projects.map(({ id, number, name }) => ({ id, number, name }))} />
        {featured.map(project => <article className={`project project-${project.id}`} id={project.id} key={project.id}>
          <div className="project-heading" data-entrance>
            <div className="project-title"><span className="eyebrow"><b>{project.number}</b>{project.category}</span><h3>{project.name}</h3></div>
            <div className="project-intro"><p>{summaries[project.id]}</p><p className="project-proof"><b>{project.proof.value}</b>{project.proof.label}</p></div>
            <Link href={`/work/${project.id}/`} className="pill-link"><span>The story & the code</span><span className="pill-arrow"><Arrow diagonal /></span></Link>
          </div>
          <ProjectStage id={project.id} />
        </article>)}
        <div className="more-work"><div className="archive-heading"><h3>And three more.</h3><p>Each one opens into its full story.</p></div>{compact.map(project => <Link className="project-row" id={project.id} key={project.id} href={`/work/${project.id}/`}><span className="archive-number">{project.number}</span><span className="project-row-name">{project.name}</span><span className="project-row-line">{summaries[project.id]}</span><span className="project-row-proof"><b>{project.proof.value}</b>{project.proof.label}</span><Arrow diagonal /></Link>)}</div></div>
        <div className="archive"><div className="archive-heading"><h3>Still curious?</h3><p>A few more things I couldn’t leave alone.</p></div>{archive.map((project, i) => <details className="archive-row" key={project.name}><summary><span className="archive-number">{String(i + 7).padStart(2, "0")}</span><span className="archive-name">{project.name}</span><span className="archive-description">{project.category.toLowerCase()}</span><span className="archive-plus" aria-hidden="true">+</span></summary><div className="archive-content"><p>{project.description} {project.detail}</p><a href={project.repo} target="_blank" rel="noreferrer">Explore the source <Arrow diagonal /></a></div></details>)}</div>
      </section>

      <section className="about-section" id="about"><div className="wrap"><span className="eyebrow">02 / THE HUMAN PART</span><div className="about-layout"><div className="about-copy" data-entrance><h2>One more<br /><span>“why?”</span></h2><p className="about-lead">That’s usually how it starts.</p><p>Why did a radar measure the wrong object? What actually makes an interpreter faster? Could looking at a phone be enough to make it speak?</p><p>I’m Aaditya, a computer engineering student at San José State with an AI minor. I build across the stack because the interesting part is usually between the layers.</p><p>I also teach introductory engineering. Helping someone turn “it doesn’t work” into “now I get it” is a pretty good use of an afternoon.</p><div className="education"><b>SJSU · Computer Engineering + AI</b><span>Class of 2028 · 3.8 GPA · Dean’s Scholar</span><span>De Anza · C/C++ certificate, with Honors · AWS Cloud Practitioner</span></div><div className="about-critter"><HeroMascot /></div></div><div className="experience-list"><span className="eyebrow">BUILDING & HELPING OTHERS BUILD</span><article><span className="experience-date">APR — JUN 2026</span><h3>Infineon Technologies</h3><p className="experience-position">Research Intern & Technical Lead</p><p>With De Anza College. Led a five-person group to a working wearable vision prototype. Owned the on-device software.</p></article><article><span className="experience-date">AUG 2026 — PRESENT</span><h3>San José State</h3><p className="experience-position">Teaching Assistant · Engineering</p><p>Two weekly labs. CAD, circuits, programming, and a lot of live debugging at the bench.</p></article><article><span className="experience-date">APR — DEC 2025</span><h3>Applied Data Analytics Club</h3><p className="experience-position">Co-Founder & Co-President</p><p>Started De Anza’s applied ML club from zero and ran its hands-on workshop program. Grew it to 54 members.</p></article><article><span className="experience-date">JAN — DEC 2025</span><h3>De Anza College</h3><p className="experience-position">Teaching Assistant & CS Tutor</p><p>C++, x86 assembly, Python, and data structures. Finding the cause, not just handing over the fix.</p></article><a href={contact.resume} target="_blank" rel="noreferrer" className="about-resume">The full résumé <Arrow diagonal /></a></div></div></div></section>
    </main>
    <Contact />
    </div>
  </>;
}
