import Link from "next/link";
import Navigation from "./components/sol/Navigation";
import IdeaSculpture from "./components/sol/IdeaSculpture";
import ProjectStage from "./components/sol/ProjectStage";
import Contact from "./components/sol/Contact";
import HeroClaims from "./components/sol/HeroClaims";
import { NameMorph } from "./components/sol/Brand";
import { Arrow } from "./components/sol/Icons";
import { archive, contact, projects } from "./lib/portfolio";

const summaries: Record<string, { description: string; ownership: string }> = {
  accordion: { description: "AI agents shouldn’t have to lose their train of thought. A visual, reversible memory layer for long coding sessions.", ownership: "I built the conductor, the policy that decides what to fold, along with its evaluation layer and activity dashboard. Our team won The Token Company’s track at the Berkeley AI Hackathon." },
  rung: { description: "How fast can a small language go? I built the same language five ways, all the way down to handwritten ARM64.", ownership: "Solo-built the runtime, bytecode engines, native compiler, and benchmark ladder. Even the optimizations that made it slower are in the results." },
  gazeboard: { description: "For someone who can’t speak or use their hands, a glance can be a whole sentence. An on-device Android research prototype.", ownership: "I integrated Qualcomm’s NPU, built the debug and recalibration flows, and helped turn camera frames into four directional selections." },
  visionassist: { description: "A small computer with a little more awareness. A wearable, entirely local vision-to-speech prototype.", ownership: "Technical lead in a five-person group with Infineon and De Anza. I wrote the device software, from perception to offline speech." },
  apextracker: { description: "I wanted less life admin. So I built the local-first Android app I now use every day.", ownership: "Solo-built and continuously used. Room owns the data; login and sync are optional. Five widgets keep the useful parts on the home screen." },
};

export default function Home() {
  return <>
    <Navigation home />
    <div className="page-shell">
    <div className="name-rail"><div className="wrap"><a className="hero-name" href="#top"><span className="sr-only">Hi, I’m Aaditya Desai.</span><NameMorph greeting /></a><span className="hero-role">COMPUTER ENGINEER. CHRONICALLY CURIOUS.</span></div></div>
    <main id="main">
      <section className="hero wrap" id="top">
        <div className="hero-overline"><span className="hello"><span className="orange-dot" /> HI, I’M AADITYA DESAI.</span><span>COMPUTER ENGINEER. CHRONICALLY CURIOUS.</span></div>
        <div className="hero-main">
          <div className="hero-copy"><h1>I wonder.<br />Then I <span>build.</span></h1><HeroClaims /><p className="hero-intro">I’m a computer engineering student at San José State.<br />I like finding out how far an idea can go.</p><a className="pill-link" href="#work"><span>See what I mean</span><span className="pill-arrow"><Arrow /></span></a></div>
          <IdeaSculpture />
        </div>
        <div className="hero-foot"><div className="hero-proof"><span className="proof-star" aria-hidden="true">✳</span><p>Berkeley AI Hackathon<span>2026 sponsor-track winner</span></p></div><div className="hero-proof"><span className="proof-symbol" aria-hidden="true">↗</span><p>Infineon × De Anza<span>Research & technical leadership</span></p></div><a href={`mailto:${contact.email}`} className="hero-open"><span className="orange-dot" /><span>Open to 2027 internships<br /><small>Let’s build something together.</small></span><Arrow diagonal /></a></div>
      </section>
      <div className="curiosity-ticker" aria-hidden="true"><div>{[0,1].map(i => <span key={i}>WONDER <b>✳</b> BUILD <b>✳</b> BREAK <b>✳</b> LEARN <b>✳</b> REPEAT <b>✳</b> </span>)}</div></div>

      <section className="work-section wrap" id="work"><div className="work-heading" data-entrance><span className="eyebrow">01 / A FEW ANSWERS TO “WHAT IF?”</span><h2>Not just ideas.<br /><span>Things I’ve built.</span></h2><p>Go on. Pull them apart.</p></div>
        {projects.map(project => <article className={`project project-${project.id}`} id={project.id} key={project.id}>
          <div className="project-heading" data-entrance><div><span className="project-number">{project.number}</span><span className="eyebrow">{project.category}</span></div><div className="project-intro"><h3>{project.name}</h3><p>{summaries[project.id].description}</p></div></div>
          <ProjectStage id={project.id} />
          <div className="project-after"><div className="project-ownership"><span className="eyebrow">WHAT I BUILT</span><p>{summaries[project.id].ownership}</p><div className="project-stack">{project.stack.map(item => <span key={item}>{item}</span>)}</div></div><div className="project-result"><b>{project.proof.value}</b><p>{project.proof.label}</p></div><div className="project-actions"><Link href={`/work/${project.id}/`} className="pill-link"><span>The story & the code</span><span className="pill-arrow"><Arrow diagonal /></span></Link><a className="source-link" href={project.repo} target="_blank" rel="noreferrer">Straight to GitHub <Arrow diagonal /></a></div></div>
        </article>)}
        <div className="archive"><div className="archive-heading"><h3>Still curious?</h3><p>A few more things I couldn’t leave alone.</p></div>{archive.map((project, i) => <details className="archive-row" key={project.name}><summary><span className="archive-number">0{i+6}</span><span className="archive-name">{project.name}</span><span className="archive-description">{project.category.toLowerCase()}</span><span className="archive-plus" aria-hidden="true">+</span></summary><div className="archive-content"><p>{project.description} {project.detail}</p><a href={project.repo} target="_blank" rel="noreferrer">Explore the source <Arrow diagonal /></a></div></details>)}</div>
      </section>

      <section className="about-section" id="about"><div className="wrap"><span className="eyebrow">02 / THE HUMAN PART</span><div className="about-layout"><div className="about-copy" data-entrance><h2>One more<br /><span>“why?”</span></h2><p className="about-lead">That’s usually how it starts.</p><p>Why did a radar measure the wrong object? What actually makes an interpreter faster? Could looking at a phone be enough to make it speak?</p><p>I’m Aaditya, a computer engineering student at San José State with an AI minor. I build across the stack because the interesting part is usually between the layers.</p><p>I also teach introductory engineering. Helping someone turn “it doesn’t work” into “now I get it” is a pretty good use of an afternoon.</p><div className="education"><b>SJSU · Computer Engineering + AI</b><span>Class of 2028 · 3.8 GPA · Dean’s Scholar</span></div></div><div className="experience-list"><span className="eyebrow">BUILDING & HELPING OTHERS BUILD</span><article><span className="experience-date">APR — JUN 2026</span><h3>Infineon Technologies</h3><p className="experience-position">Research Intern & Technical Lead</p><p>With De Anza College. Led a five-person group to a working wearable vision prototype. Owned the on-device software.</p></article><article><span className="experience-date">AUG 2026 — PRESENT</span><h3>San José State</h3><p className="experience-position">Teaching Assistant · Engineering</p><p>Two weekly labs. CAD, circuits, programming, and a lot of live debugging at the bench.</p></article><article><span className="experience-date">JAN — DEC 2025</span><h3>De Anza College</h3><p className="experience-position">Teaching Assistant & CS Tutor</p><p>C++, x86 assembly, Python, and data structures. Finding the cause, not just handing over the fix.</p></article><a href={contact.resume} target="_blank" rel="noreferrer" className="about-resume">The full résumé <Arrow diagonal /></a></div></div></div></section>
    </main>
    <Contact />
    </div>
  </>;
}
