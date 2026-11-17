import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navigation from "../../components/sol/Navigation";
import ProjectStage from "../../components/sol/ProjectStage";
import ProjectLab from "../../components/sol/ProjectLab";
import Contact from "../../components/sol/Contact";
import { Arrow } from "../../components/sol/Icons";
import { projects } from "../../lib/portfolio";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(project => ({slug: project.id}));
}

export async function generateMetadata({ params }: { params: Promise<{slug: string}> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.id === slug);
  if (!project) return {};
  return { title: `${project.name} — Inside the build | Aaditya Desai`, description: project.description, alternates: { canonical: `/work/${project.id}/` }, openGraph: {title: `${project.name} | Aaditya Desai`, description: project.description, url: `/work/${project.id}/`} };
}

export default async function CaseStudy({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params;
  const projectIndex = projects.findIndex(item => item.id === slug);
  if (projectIndex === -1) notFound();
  const project = projects[projectIndex];
  const next = projects[(projectIndex + 1) % projects.length];
  return <>
    <Navigation />
    <main className={`case-study case-${project.id}`} id="main">
      <section className="case-hero wrap" id="top"><Link className="back-link" href={`/#${project.id}`}>← All selected work</Link><div className="case-eyebrow"><span className="eyebrow">{project.number} / {project.category}</span><span className="eyebrow">INSIDE THE BUILD</span></div><h1>{project.name}<span>.</span></h1><p className="case-headline">{project.headline}</p><p className="case-description">{project.description}</p><div className="case-meta"><div><span className="eyebrow">MY ROLE</span><p>{project.role}</p></div><div><span className="eyebrow">WHEN / WHERE</span><p>{project.period}</p></div><div className="case-source-links"><a className="button blue" href={project.repo} target="_blank" rel="noreferrer">Explore the source <Arrow diagonal /></a>{project.live && <a className="text-link" href={project.live} target="_blank" rel="noreferrer">Project site <Arrow diagonal /></a>}</div></div></section>
      <div className="case-exhibit wrap"><ProjectStage id={project.id} /><p className="case-exhibit-caption">THE SHORT VERSION. {project.id === "rung" ? "EVERY NUMBER COMES FROM THE PROJECT’S RECORDED RESULTS. " : ""}THERE IS A HANDS-ON ONE FURTHER DOWN.</p></div>
      <div className="case-body wrap"><aside className="case-sidebar"><span className="eyebrow">FIELD NOTES</span><a href="#problem">01 The constraint</a><a href="#approach">02 The approach</a><a href="#ownership">03 My contribution</a><a href="#decisions">04 The decisions</a><a href="#outcome">05 What came out of it</a><div className="case-sidebar-stack"><span className="eyebrow">BUILT WITH</span>{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div></aside><div className="case-narrative">
        <section id="problem"><span className="eyebrow">01 / THE CONSTRAINT</span><h2>The part that<br />made it interesting.</h2><p>{project.constraint}</p></section>
        <section id="approach"><span className="eyebrow">02 / THE APPROACH</span><h2>{project.approachTitle}</h2><p>{project.approach}</p><div className="architecture-flow" role="group" aria-label="System architecture">{project.flow.map((stage, i) => <div key={stage}><span>0{i+1}</span><b>{stage}</b>{i < project.flow.length - 1 && <Arrow />}</div>)}</div><ProjectLab id={project.id} /></section>
        <section id="ownership"><span className="eyebrow">03 / MY CONTRIBUTION</span><h2>What I actually built.</h2><ul className="ownership-list">{project.ownership.map((item, i) => <li key={item}><span>0{i+1}</span><p>{item}</p></li>)}</ul>
          {project.id === "accordion" && <figure className="case-artifact"><a href="/projects/accordion-map.png" target="_blank" rel="noreferrer" aria-label="Open the full-size Accordion application screenshot"><Image src="/projects/accordion-map.png" alt="The actual Accordion application, showing a color-coded map of context blocks, session navigation, and a token budget" width={1348} height={1044} sizes="(max-width: 650px) 90vw, 760px" /></a><figcaption><span className="eyebrow">FROM THE ACTUAL BUILD</span><span>The Accordion app. Open the image to inspect the full context map.</span></figcaption></figure>}
          {project.id === "apextracker" && <figure className="case-artifact phone-artifact"><a href="/projects/apextracker-dashboard.png" target="_blank" rel="noreferrer" aria-label="Open the full-size ApexTracker application screenshot"><Image src="/projects/apextracker-dashboard.png" alt="The real ApexTracker Android dashboard, with daily goals, completion status, and an eight-week consistency grid" width={1080} height={2340} sizes="290px" /></a><figcaption><span className="eyebrow">FROM MY PHONE</span><span>The actual Android app: daily goals and the longer-term pattern behind them.</span></figcaption></figure>}
        </section>
        <section id="decisions"><span className="eyebrow">04 / THE ENGINEERING DECISIONS</span><h2>{project.decisionsTitle}</h2>{project.decisions.map((decision, i) => <article className="decision" key={decision.title}><span className="decision-number">0{i+1}</span><div><h3>{decision.title}</h3><p>{decision.body}</p></div></article>)}</section>
        <section id="outcome"><span className="eyebrow">05 / WHAT CAME OUT OF IT</span><div className="case-result"><b>{project.proof.value}</b><span>{project.proof.label}</span></div><p>{project.outcome}</p><a className="text-link" href={project.repo} target="_blank" rel="noreferrer">Read the code and methodology <Arrow diagonal /></a></section>
      </div></div>
      <div className="next-project wrap"><span className="eyebrow">NEXT / {next.category}</span><Link href={`/work/${next.id}/`}><span>{next.name}</span><Arrow diagonal /></Link></div>
    </main>
    <Contact />
  </>;
}
