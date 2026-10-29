"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { contact, projects } from "../../lib/portfolio";
import { Arrow, Mark } from "./Icons";

export default function Navigation({ home = false }: { home?: boolean }) {
  const [menu, setMenu] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const prefix = home ? "" : "/";

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

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <div className="nav-inner wrap">
        <Link href="/" className="brand" aria-label="Aaditya Desai, home"><Mark /><span>Aaditya Desai<span className="brand-sub">COMPUTER ENGINEER & BUILDER</span></span></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href={`${prefix}#work`}>Work <span>05</span></Link>
          <Link href={`${prefix}#about`}>About</Link>
          <Link href={`${prefix}#contact`}>Contact</Link>
        </nav>
        <div className="nav-actions">
          <button className="quick-button" onClick={() => dialog.current?.showModal()} aria-label="Open quick overview"><span className="quick-label">Quick look</span><kbd>⌘ K</kbd></button>
          <a className="resume-link" href={contact.resume} target="_blank" rel="noreferrer">Résumé <Arrow diagonal /></a>
          <button className="menu-button" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu(!menu)}>{menu ? "Close" : "Menu"}<span aria-hidden="true">{menu ? "−" : "+"}</span></button>
        </div>
      </div>
      {menu && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
        <Link onClick={() => setMenu(false)} href={`${prefix}#work`}>Selected work <span>01</span></Link>
        <Link onClick={() => setMenu(false)} href={`${prefix}#about`}>About & experience <span>02</span></Link>
        <Link onClick={() => setMenu(false)} href={`${prefix}#contact`}>Get in touch <span>03</span></Link>
        <button onClick={() => { setMenu(false); dialog.current?.showModal(); }}>The 30-second version <Arrow /></button>
      </nav>}
    </header>
    <dialog ref={dialog} className="quick-dialog" aria-labelledby="quick-dialog-title">
      <div className="quick-top"><span className="eyebrow">THE 30-SECOND VERSION</span><button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close overview">×</button></div>
      <h2 id="quick-dialog-title">A builder.<br />Across the stack.</h2>
      <p>Computer engineering at San José State, AI minor, graduating May 2028. Looking for a Summer 2027 internship or Winter 2027 co-op.</p>
      <ul className="quick-projects">{projects.map(project => <li key={project.id}><Link href={`/work/${project.id}/`} onClick={() => dialog.current?.close()}><span>{project.name}<small>{project.category.toLowerCase()}</small></span><b>{project.proof.value}</b><Arrow /></Link></li>)}</ul>
      <div className="quick-links"><a className="button blue" href={contact.resume} target="_blank" rel="noreferrer">Open résumé <Arrow diagonal /></a><a href={`mailto:${contact.email}`}>Email me <Arrow diagonal /></a></div>
      <p className="quick-foot">Research intern & technical lead, Infineon × De Anza.<br />Teaching assistant, SJSU. Berkeley AI Hackathon sponsor-track winner.</p>
    </dialog>
  </>;
}
