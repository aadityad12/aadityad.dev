import { person } from "../lib/content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip" href="#main">Skip to content</a>
      <div className="shell header-inner">
        <a className="brand" href="#top">Aaditya Desai</a>
        <nav className="nav" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href={person.resume} target="_blank" rel="noreferrer">Résumé</a>
        </nav>
      </div>
    </header>
  );
}
