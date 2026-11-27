"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "../../lib/portfolio";
import { Arrow } from "./Icons";

// Ways around a case study. Internal moves use straight arrows; ↗ is kept for
// links that leave the site.

const count = String(projects.length).padStart(2, "0");

export function siblings(project: Project) {
  const i = projects.findIndex(item => item.id === project.id);
  return { previous: projects[(i - 1 + projects.length) % projects.length], next: projects[(i + 1) % projects.length] };
}

/* Top of the page: where you are, and the two neighbours. */
export function CaseTopBar({ project }: { project: Project }) {
  const { previous, next } = siblings(project);
  return <nav className="case-topbar" aria-label="Project navigation">
    <div className="case-crumbs"><Link href={`/#${project.id}`} className="case-back"><Arrow className="is-back" /> All work</Link><span className="case-count"><b>{project.number}</b> / {count}</span><span className="case-category">{project.category}</span></div>
    <div className="case-pager"><Link href={`/work/${previous.id}/`} aria-label={`Previous project: ${previous.name}`}><Arrow className="is-back" /><span>{previous.name}</span></Link><Link href={`/work/${next.id}/`} aria-label={`Next project: ${next.name}`}><span>{next.name}</span><Arrow /></Link></div>
  </nav>;
}

const notes = [
  { id: "problem", label: "The constraint" },
  { id: "approach", label: "The approach" },
  { id: "ownership", label: "My contribution" },
  { id: "decisions", label: "The decisions" },
  { id: "outcome", label: "What came out of it" },
];

/* Desktop sidebar: which part you're reading, and a way sideways. */
export function CaseSidebar({ project }: { project: Project }) {
  const { previous, next } = siblings(project);
  const [active, setActive] = useState(notes[0].id);
  useEffect(() => {
    const update = () => {
      const line = innerHeight * .35;
      let current = notes[0].id;
      for (const note of notes) { const el = document.getElementById(note.id); if (el && el.getBoundingClientRect().top <= line) current = note.id; }
      setActive(current);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return <aside className="case-sidebar">
    <nav aria-label="Sections of this case study"><span className="eyebrow">ON THIS PAGE</span>{notes.map((note, i) => <a key={note.id} href={`#${note.id}`} aria-current={active === note.id ? "location" : undefined}><span>0{i + 1}</span>{note.label}</a>)}</nav>
    <nav className="case-sidebar-switch" aria-label="Other projects"><span className="eyebrow">MORE WORK</span><Link href={`/work/${previous.id}/`}><Arrow className="is-back" />{previous.name}</Link><Link href={`/work/${next.id}/`}>{next.name}<Arrow /></Link><Link href={`/#${project.id}`}>All work</Link></nav>
  </aside>;
}

/* The end of a case study: the next story first, then everything else. */
export function KeepExploring({ project }: { project: Project }) {
  const { previous, next } = siblings(project);
  return <section className="keep-exploring wrap" aria-labelledby="keep-exploring-title">
    <div className="keep-head"><h2 id="keep-exploring-title" className="eyebrow">KEEP EXPLORING</h2><Link href={`/#${project.id}`} className="keep-all"><Arrow className="is-back" /> All {projects.length} projects</Link></div>
    <div className="keep-cards">
      <Link href={`/work/${next.id}/`} className="keep-card is-next">
        <div className="keep-card-text"><span className="keep-label">NEXT · <b>{next.number}</b> / {count} · {next.category}</span><span className="keep-name">{next.name}<Arrow /></span><span className="keep-summary">{next.summary}</span><span className="keep-proof"><b>{next.proof.value}</b>{next.proof.label}</span></div>
        <Image className="keep-thumb" src={`/projects/thumbs/${next.id}.webp`} alt="" width={1200} height={750} sizes="(max-width: 650px) 90vw, 280px" />
      </Link>
      <Link href={`/work/${previous.id}/`} className="keep-card is-previous">
        <span className="keep-label"><Arrow className="is-back" /> PREVIOUS · <b>{previous.number}</b> / {count}</span><span className="keep-name">{previous.name}</span><span className="keep-summary">{previous.summary}</span>
      </Link>
    </div>
    <nav className="keep-index" aria-label="All projects"><span className="eyebrow">ALL WORK</span><ul>{projects.map(item => <li key={item.id}><Link href={`/work/${item.id}/`} aria-current={item.id === project.id ? "page" : undefined}><span>{item.number}</span>{item.name}</Link></li>)}</ul></nav>
  </section>;
}

/* Phones have no sidebar, so the section list folds into the page instead. */
export function CaseSectionsMobile() {
  return <details className="case-sections-mobile"><summary><span className="eyebrow">ON THIS PAGE · 0{notes.length}</span><span aria-hidden="true">+</span></summary><nav aria-label="Sections of this case study">{notes.map((note, i) => <a key={note.id} href={`#${note.id}`}><span>0{i + 1}</span>{note.label}</a>)}</nav></details>;
}
