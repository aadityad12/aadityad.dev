import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navigation from "../../components/sol/Navigation";
import ProjectStage from "../../components/sol/ProjectStage";
import ProjectLab from "../../components/sol/ProjectLab";
import Contact from "../../components/sol/Contact";
import DemoVideo from "../../components/sol/DemoVideo";
import { CaseSectionsMobile, CaseSidebar, CaseTopBar, KeepExploring } from "../../components/sol/CaseNav";
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
  const project = projects.find(item => item.id === slug);
  if (!project) notFound();
  return <>
    <Navigation current={project.id} />
    <main className={`case-study case-${project.id}`} id="main">
      <section className="case-hero wrap" id="top"><CaseTopBar project={project} /><h1>{project.name}<span>.</span></h1><p className="case-headline">{project.headline}</p><p className="case-description">{project.description}</p><div className="case-meta"><div><span className="eyebrow">MY ROLE</span><p>{project.role}</p></div><div><span className="eyebrow">WHEN / WHERE</span><p>{project.period}</p></div><div className="case-stack"><span className="eyebrow">BUILT WITH</span><p>{project.stack.join(" · ")}</p></div><div className="case-source-links"><a className="button blue" href={project.repo} target="_blank" rel="noreferrer">Explore the source <Arrow diagonal /></a>{project.live && <a className="text-link" href={project.live} target="_blank" rel="noreferrer">Project site <Arrow diagonal /></a>}</div></div></section>
      <div className="case-exhibit wrap"><ProjectStage id={project.id} /><p className="case-exhibit-caption">THE SHORT VERSION. {project.id === "rung" ? "EVERY NUMBER COMES FROM THE PROJECT’S RECORDED RESULTS. " : ""}THERE IS A HANDS-ON ONE FURTHER DOWN.</p></div>
      <div className="case-body wrap"><CaseSectionsMobile /><CaseSidebar project={project} /><div className="case-narrative">
        <section id="problem"><span className="eyebrow">01 / THE CONSTRAINT</span><h2>The part that<br />made it interesting.</h2><p>{project.constraint}</p></section>
        <section id="approach"><span className="eyebrow">02 / THE APPROACH</span><h2>{project.approachTitle}</h2><p>{project.approach}</p><div className="architecture-flow" role="group" aria-label="System architecture">{project.flow.map((stage, i) => <div key={stage}><span>0{i+1}</span><b>{stage}</b>{i < project.flow.length - 1 && <Arrow />}</div>)}</div><ProjectLab id={project.id} /></section>
        <section id="ownership"><span className="eyebrow">03 / MY CONTRIBUTION</span><h2>What I actually built.</h2><ul className="ownership-list">{project.ownership.map((item, i) => <li key={item}><span>0{i+1}</span><p>{item}</p></li>)}</ul>
          {project.id === "accordion" && <>
            <figure className="case-artifact"><DemoVideo sources={[{ src: "/projects/accordion-demo.webm", type: "video/webm" }, { src: "/projects/accordion-demo.mp4", type: "video/mp4" }]} poster="/projects/accordion-poster.jpg" label="Accordion folding a long coding-agent session: the context map compresses cold blocks while the working tail stays live" width={1280} height={720} /><figcaption><span className="eyebrow">RECORDED IN THE APP</span><span>The context map, folding and restoring a real session.</span></figcaption></figure>
            <figure className="case-artifact"><a href="/projects/accordion-map.png" target="_blank" rel="noreferrer" aria-label="Open the full-size Accordion application screenshot"><Image src="/projects/accordion-map.png" alt="The actual Accordion application, showing a color-coded map of context blocks, session navigation, and a token budget" width={1348} height={1044} sizes="(max-width: 650px) 90vw, 760px" /></a><figcaption><span className="eyebrow">FROM THE ACTUAL BUILD</span><span>The Accordion app. Open the image to inspect the full context map.</span></figcaption></figure>
          </>}
          {project.id === "rung" && <figure className="case-artifact"><a href="/projects/rung-jit.gif" target="_blank" rel="noreferrer" aria-label="Open the full-size recording of the JIT compiling and falling back"><Image src="/projects/rung-jit.gif" alt="A recording of Rung compiling a hot loop to native ARM64, then handing a float back to the VM when a type guard fails" width={1000} height={550} sizes="(max-width: 650px) 90vw, 760px" unoptimized /></a><figcaption><span className="eyebrow">FROM THE REPOSITORY</span><span>The JIT at work: native code for the hot path, a safe handoff to the VM when an assumption breaks.</span></figcaption></figure>}
          {project.id === "visionassist" && <figure className="case-artifact"><div className="case-media-grid"><a href="/projects/visionassist-fit-cad.png" target="_blank" rel="noreferrer" aria-label="Open the full-size fit-check render"><Image src="/projects/visionassist-fit-cad.png" alt="CAD fit check: the board mounted over the eye of a mannequin head" width={800} height={675} sizes="(max-width: 650px) 45vw, 380px" /></a><a href="/projects/visionassist-mount-cad.png" target="_blank" rel="noreferrer" aria-label="Open the full-size head mount render"><Image src="/projects/visionassist-mount-cad.png" alt="CAD render of the head-mount plate with a curved forehead pad" width={1115} height={949} sizes="(max-width: 650px) 45vw, 380px" /></a></div><figcaption><span className="eyebrow">THE MOUNT, IN CAD</span><span>The head-mount plate and its fit check. The whole device is 3D-printed.</span></figcaption></figure>}
          {project.id === "alta" && <>
            <figure className="case-artifact"><DemoVideo sources={[{ src: "/projects/alta-overhead.mp4", type: "video/mp4" }]} label="The overhead camera view of a student’s breadboard, with a hand bringing in jumper wires" width={1280} height={720} /><figcaption><span className="eyebrow">WHAT ALTA SEES</span><span>The overhead camera feed from a bench session.</span></figcaption></figure>
            <figure className="case-artifact"><div className="case-media-grid"><a href="/projects/alta-overlay.jpg" target="_blank" rel="noreferrer" aria-label="Open the full-size overlay engine frames"><Image src="/projects/alta-overlay.jpg" alt="Camera frames with the overlay engine’s wire paths, a probe callout, and a highlighted power rail" width={740} height={840} sizes="(max-width: 650px) 45vw, 380px" /></a><a href="/projects/alta-pod-dock.png" target="_blank" rel="noreferrer" aria-label="Open the full-size probe pod dock drawing"><Image src="/projects/alta-pod-dock.png" alt="CAD drawing of the 3D-printed probe pod dock: an Arduino Uno outline, a mini breadboard, and color-coded probe jacks" width={1260} height={1050} sizes="(max-width: 650px) 45vw, 380px" /></a></div><figcaption><span className="eyebrow">OVERLAY & THE POD</span><span>The overlay engine marking up camera frames, and the printed dock for the probe pod.</span></figcaption></figure>
            <figure className="case-artifact"><a href="/projects/alta-setup.png" target="_blank" rel="noreferrer" aria-label="Open the full-size bench setup diagram"><Image src="/projects/alta-setup.png" alt="The full bench: the probe pod in its printed dock, a phone camera above the breadboard, and a laptop showing a live 5.01 volt reading" width={1990} height={855} sizes="(max-width: 650px) 90vw, 760px" /></a><figcaption><span className="eyebrow">THE WHOLE BENCH</span><span>Probe pod, overhead camera, and the agent, in one diagram.</span></figcaption></figure>
          </>}
          {project.id === "apextracker" && <figure className="case-artifact phone-artifact"><a href="/projects/apextracker-dashboard.png" target="_blank" rel="noreferrer" aria-label="Open the full-size ApexTracker application screenshot"><Image src="/projects/apextracker-dashboard.png" alt="The real ApexTracker Android dashboard, with daily goals, completion status, and an eight-week consistency grid" width={1080} height={2340} sizes="290px" /></a><figcaption><span className="eyebrow">FROM MY PHONE</span><span>The actual Android app: daily goals and the longer-term pattern behind them.</span></figcaption></figure>}
        </section>
        <section id="decisions"><span className="eyebrow">04 / THE ENGINEERING DECISIONS</span><h2>{project.decisionsTitle}</h2>{project.decisions.map((decision, i) => <article className="decision" key={decision.title}><span className="decision-number">0{i+1}</span><div><h3>{decision.title}</h3><p>{decision.body}</p></div></article>)}</section>
        <section id="outcome"><span className="eyebrow">05 / WHAT CAME OUT OF IT</span><div className="case-result"><b>{project.proof.value}</b><span>{project.proof.label}</span></div><p>{project.outcome}</p><a className="text-link" href={project.repo} target="_blank" rel="noreferrer">Read the code and methodology <Arrow diagonal /></a></section>
      </div></div>
      <KeepExploring project={project} />
    </main>
    <Contact compact />
  </>;
}
