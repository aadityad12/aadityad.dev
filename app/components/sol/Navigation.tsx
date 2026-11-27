"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { contact, projects, type ProjectId } from "../../lib/portfolio";
import { Arrow } from "./Icons";
import Motion from "./Motion";
import { BrandMark, NameMorph } from "./Brand";

export default function Navigation({ home = false, current }: { home?: boolean; current?: ProjectId }) {
  const [menu, setMenu] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const prefix = home ? "" : "/";
  const contactHref = home || current ? "#contact" : "/#contact";
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else dialog.current?.showModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  // Escape closes the phone menu and hands focus back to its button.
  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenu(false); menuButton.current?.focus(); } };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [menu]);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${home ? "is-home" : ""}`}><div className="nav-inner wrap">
      <Link href="/" className="brand" aria-label="Aaditya Desai, home"><BrandMark /><span className="brand-text"><NameMorph /></span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation"><Link href={`${prefix}#work`} aria-current={current ? "true" : undefined}>Work <span>06</span></Link><Link href={`${prefix}#about`}>The human</Link><Link href={contactHref}>Say hello</Link></nav>
      <div className="nav-actions"><Motion /><button className="quick-button" onClick={() => dialog.current?.showModal()} aria-label="Open recruiter overview">Quick intro <kbd>⌘ K</kbd></button><a className="resume-link" href={contact.resume} target="_blank" rel="noreferrer">Résumé <Arrow diagonal /></a><button ref={menuButton} className="menu-button" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu(!menu)}>{menu ? "Close" : "Menu"}<span aria-hidden="true">{menu ? "−" : "+"}</span></button></div>
    </div><div className="reading-line" /></header>
    {menu && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation"><Link href={`${prefix}#work`} onClick={() => setMenu(false)}>The work <Arrow /></Link><Link href={`${prefix}#about`} onClick={() => setMenu(false)}>The human <Arrow /></Link><Link href={contactHref} onClick={() => setMenu(false)}>Say hello <Arrow /></Link><div className="menu-projects"><span className="eyebrow">PROJECTS</span><ul>{projects.map(project => <li key={project.id}><Link href={`/work/${project.id}/`} aria-current={project.id === current ? "page" : undefined} onClick={() => setMenu(false)}><span>{project.number}</span>{project.name}</Link></li>)}</ul></div><button onClick={() => { setMenu(false); dialog.current?.showModal(); dialog.current?.addEventListener("close", () => menuButton.current?.focus(), { once: true }); }}>The 30-second intro <Arrow /></button></nav>}
    <dialog ref={dialog} className="quick-dialog" aria-labelledby="quick-dialog-title"><div className="quick-top"><span className="eyebrow">SHORT ON TIME? START HERE.</span><button onClick={() => dialog.current?.close()} className="dialog-close" aria-label="Close overview">×</button></div><h2 id="quick-dialog-title">Hi, I’m Aaditya.</h2><p>Computer engineering at San José State. AI minor. Class of 2028. Looking for a Summer 2027 internship or Winter 2027 co-op.</p><ul className="quick-projects">{projects.map(project => <li key={project.id}><Link href={`/work/${project.id}/`} onClick={() => dialog.current?.close()}><span>{project.name}<small>{project.category.toLowerCase()}</small></span><Arrow /></Link></li>)}</ul><p className="quick-proof">Berkeley AI Hackathon sponsor-track winner.<br />Research & technical lead, Infineon × De Anza.<br />Teaching assistant, SJSU.</p><div className="quick-links"><a className="pill-link" href={contact.resume} target="_blank" rel="noreferrer">Open résumé <Arrow diagonal /></a><a href={`mailto:${contact.email}`}>Email me <Arrow diagonal /></a></div></dialog>
  </>;
}
