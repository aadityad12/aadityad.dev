"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "home", number: "00", label: "HOME" },
  { id: "current", number: "01", label: "CURRENT" },
  { id: "work", number: "02", label: "SELECTED WORK" },
  { id: "systems", number: "03", label: "SYSTEMS" },
  { id: "about", number: "04", label: "ABOUT" },
  { id: "signal", number: "05", label: "SIGNAL" },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function SectionRail({ number, label }: { number: string; label: string }) {
  return (
    <div className="section-rail reveal">
      <span>{number} / {label}</span>
      <i />
      <b>{number}</b>
    </div>
  );
}

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={`mechanical-link ${className}`} href={href} target="_blank" rel="noreferrer">
      <span>{children}</span><i /><Arrow />
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const [active, setActive] = useState(sections[0]);

  useEffect(() => {
    const onScroll = () => setCompressed(window.scrollY > 70);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const next = sections.find((section) => section.id === visible.target.id);
          if (next) setActive(next);
        }
      },
      { rootMargin: "-25% 0px -58% 0px", threshold: [0, 0.1, 0.3] },
    );
    sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) sectionObserver.observe(node);
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className={`site-header ${compressed ? "is-compressed" : ""} ${menuOpen ? "menu-open" : ""}`}>
        <div className="header-inner">
          <a className="brand" href="#home" onClick={closeMenu} aria-label="Aaditya Desai, home">[AD]<span> / 00</span></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {sections.slice(1).map((section) => (
              <a href={`#${section.id}`} key={section.id} className={active.id === section.id ? "active" : ""}>
                <span>{section.number}</span> {section.label === "SELECTED WORK" ? "WORK" : section.label}
              </a>
            ))}
          </nav>
          <div className="compressed-label" aria-live="polite">{active.number} / {active.label}</div>
          <a className="header-github" href="https://github.com/aadityad12" target="_blank" rel="noreferrer">GITHUB <Arrow /></a>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-index" onClick={() => setMenuOpen((value) => !value)}>
            INDEX / {menuOpen ? "−" : "+"}
          </button>
        </div>
        <nav id="mobile-index" className="mobile-index" aria-label="Mobile navigation">
          {sections.slice(1).map((section) => (
            <a href={`#${section.id}`} key={section.id} onClick={closeMenu}>
              <span>{section.number}</span><b>{section.label}</b><i>→</i>
            </a>
          ))}
        </nav>
        <div className="header-progress" style={{ width: `${(Number(active.number) / 5) * 100}%` }} />
      </header>

      <section id="home" className="hero content-shell">
        <div className="hero-copy reveal is-visible">
          <p className="eyebrow">AADITYA DESAI / COMPUTER ENGINEERING @ SJSU</p>
          <h1>BUILDING THE<br />MACHINERY BEHIND<br />INTELLIGENCE.</h1>
          <div className="hero-meta">
            <span>AI SYSTEMS / SOFTWARE / INFRASTRUCTURE</span>
            <a href="#current">ENTER THE SYSTEM <span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <div className="system-panel reveal is-visible" aria-label="System map connecting model, context, tools, runtime, memory, hardware, and compute">
          <div className="panel-top"><span>// SYSTEM MAP</span><span>STATE / ACTIVE</span></div>
          <div className="system-map">
            <i className="wire wire-a" /><i className="wire wire-b" /><i className="wire wire-c" /><i className="wire wire-d" /><i className="wire wire-e" /><i className="wire wire-f" />
            <span className="map-node node-model">MODEL <b>01</b></span>
            <span className="map-node node-context">CONTEXT <b>02</b></span>
            <span className="map-node node-tools">TOOLS <b>03</b></span>
            <span className="map-node node-runtime active">RUNTIME <b>04</b></span>
            <span className="map-node node-memory">MEMORY <b>05</b></span>
            <span className="map-node node-hardware">HARDWARE <b>06</b></span>
            <span className="map-node node-compute">COMPUTE <b>07</b></span>
          </div>
          <div className="panel-bottom"><span>PATH / CONTEXT → RUNTIME → HARDWARE</span><span className="status-dot">NOMINAL</span></div>
        </div>
      </section>

      <section id="current" className="project-section content-shell">
        <SectionRail number="01" label="CURRENT" />
        <div className="accordion-feature">
          <div className="project-copy reveal">
            <p className="project-kicker">PROJECT / 001 · AI INFRASTRUCTURE</p>
            <h2>ACCORDION</h2>
            <h3>SEE WHAT YOUR<br />AGENT REMEMBERS.</h3>
            <p className="project-description">Accordion turns an agent&apos;s context into a visible, reversible system: fold the bloat, preserve the working tail, and let people, agents, and conductors steer what stays live.</p>
            <div className="proof-grid">
              <div><b>225+</b><span>GITHUB STARS</span></div>
              <div><b>WINNER</b><span>UC BERKELEY AI HACKATHON</span></div>
              <div><b>OPEN</b><span>MIT LICENSED</span></div>
            </div>
            <div className="project-links">
              <ExternalLink href="https://get-accordion.dev">VIEW PROJECT</ExternalLink>
              <ExternalLink href="https://github.com/a-Fig/accordion">GITHUB</ExternalLink>
            </div>
          </div>

          <figure className="instrument-frame reveal">
            <figcaption><span>// LIVE PRODUCT</span><span>ACCORDION / CONTEXT MAP / 001</span></figcaption>
            <div className="asset-window accordion-window">
              <img src="/projects/accordion-map.png" alt="Accordion context map showing a long AI agent session as visible, foldable blocks" />
            </div>
            <div className="frame-footer"><span>109,407 / 512,000 TOKENS</span><span>LIVE / REVERSIBLE / STEERABLE</span></div>
          </figure>
        </div>
      </section>

      <section id="work" className="work-section content-shell">
        <SectionRail number="02" label="SELECTED WORK" />

        <article className="work-row apex-row">
          <div className="project-copy reveal">
            <p className="project-kicker">PROJECT / 002 · ANDROID SYSTEMS</p>
            <h2>APEXTRACKER</h2>
            <h3>A PERSONAL SYSTEM<br />FOR THE DAY.</h3>
            <p className="project-description">One local-first Android app for the things I actually track: time, budget, goals, reminders, notes, papers, and the cost of looking at my phone.</p>
            <p className="tech-line">KOTLIN / JETPACK COMPOSE / ROOM / SQLCIPHER</p>
            <ExternalLink href="https://github.com/aadityad12/Trackers">VIEW REPOSITORY</ExternalLink>
          </div>

          <div className="apex-system reveal">
            <div className="system-callouts left-callouts" aria-hidden="true">
              <span>ROOM / SOURCE OF TRUTH<i /></span>
              <span>SQLCIPHER / KEYSTORE<i /></span>
              <span>WORKMANAGER / ALARMS<i /></span>
            </div>
            <figure className="phone-frame">
              <span className="phone-speaker" />
              <img src="/projects/apextracker-dashboard.png" alt="ApexTracker's graphite dashboard showing daily goals and a consistency chart" />
            </figure>
            <div className="system-callouts right-callouts" aria-hidden="true">
              <span><i />GLANCE / WIDGETS</span>
              <span><i />ML KIT / RECEIPTS</span>
              <span><i />FIRESTORE / OPTIONAL SYNC</span>
            </div>
            <div className="mobile-callout-list">
              <span>LOCAL-FIRST</span><span>ENCRYPTED DB</span><span>ON-DEVICE OCR</span><span>WIDGETS</span>
            </div>
          </div>
        </article>

        <article className="work-row temper-row">
          <div className="temper-bench reveal" aria-label="Temper before and after evaluation test bench">
            <div className="bench-header"><span>// TEST BENCH</span><span>RUN / FIXTURE_0042</span></div>
            <div className="bench-pipeline">
              <div className="bench-unit baseline"><small>BASELINE</small><b>MODEL</b><span>NO HARNESS</span></div>
              <div className="bench-arrow">→</div>
              <div className="bench-unit harness"><small>HARNESS</small><b>MODEL</b><span>+ PROMPTS</span><span>+ TOOLS</span><span>+ SKILLS</span></div>
              <div className="bench-arrow">→</div>
              <div className="bench-unit judge"><small>COMPARE</small><b>JUDGE</b><span>6 DIMENSIONS</span></div>
            </div>
            <div className="bench-results">
              <div><span>INSTRUCTION ADHERENCE</span><b>-27</b><i className="fail">PATCH</i></div>
              <div><span>TOOL ACCURACY</span><b>-41</b><i className="fail">PATCH</i></div>
              <div><span>OUTPUT FORMAT</span><b>-03</b><i>PASS</i></div>
              <div><span>SKILL TRIGGER</span><b>-08</b><i className="fail">PATCH</i></div>
            </div>
            <div className="bench-loop"><span>REGRESSION</span><i>→</i><span>REPLACE ARTIFACT</span><i>→</i><span>RE-EVALUATE</span><i>↺</i></div>
            <div className="bench-note">DETERMINISTIC FIXTURE DATA / PROTOCOL EVIDENCE, NOT A LIVE BENCHMARK</div>
          </div>

          <div className="project-copy reveal">
            <p className="project-kicker">PROJECT / 003 · AI EVALUATION</p>
            <h2>TEMPER</h2>
            <h3>TEST THE SYSTEM<br />AROUND THE MODEL.</h3>
            <p className="project-description">Temper compares a bare model with the same model wrapped in prompts, tools, and skills. When the harness causes a regression, it generates replacement artifacts and re-runs the affected checks.</p>
            <p className="tech-line">PYTHON / FASTAPI / REACT / SSE / JSON SCHEMA</p>
            <ExternalLink href="https://github.com/aadityad12/Temper">VIEW REPOSITORY</ExternalLink>
          </div>
        </article>
      </section>

      <section id="systems" className="systems-section content-shell">
        <SectionRail number="03" label="SYSTEMS" />
        <div className="systems-intro reveal">
          <p>// SYSTEM INVENTORY</p>
          <h2>THE TOOLS FOLLOW<br />THE PROBLEM.</h2>
        </div>
        <div className="inventory reveal">
          <div><span>01 / LANGUAGES</span><b>C++ / PYTHON / TYPESCRIPT / KOTLIN</b><i>→</i></div>
          <div><span>02 / SYSTEMS</span><b>LINUX / ANDROID / LOCAL-FIRST</b><i>→</i></div>
          <div><span>03 / CLOUD</span><b>AWS / GCP</b><i>→</i></div>
          <div><span>04 / AI</span><b>AGENTS / EVALUATION / CONTEXT SYSTEMS</b><i>→</i></div>
        </div>
      </section>

      <section id="about" className="about-section content-shell">
        <SectionRail number="04" label="ABOUT" />
        <div className="about-grid">
          <p className="about-marker reveal">// WHAT KEEPS<br />PULLING ME IN</p>
          <div className="about-copy reveal">
            <p>I&apos;m still finding my footing as an engineer, but lately I keep getting pulled toward the parts of computing people don&apos;t see: memory being thrown away, compute sitting idle, context being discarded, or an abstraction hiding something interesting underneath.</p>
            <p>I like finding performance and useful capability in places that would otherwise be wasted. That&apos;s where the pieces have started to meet for me: AI, the software I&apos;ve spent years building, and a deeper interest in infrastructure and hardware.</p>
          </div>
          <div className="about-meta reveal">
            <span>BASED / SANTA CLARA, CA</span>
            <span>STUDY / COMPUTER ENGINEERING</span>
            <span>STATUS / BUILDING</span>
          </div>
        </div>
      </section>

      <footer id="signal" className="signal-section content-shell">
        <SectionRail number="05" label="SIGNAL" />
        <p className="signal-heading reveal">FIND THE WORK.<br />START A CONVERSATION.</p>
        <div className="signal-links reveal">
          <ExternalLink href="https://github.com/aadityad12" className="signal-link"><span>GITHUB</span><small>CODE / PROJECTS</small></ExternalLink>
          <ExternalLink href="https://www.linkedin.com/in/aaditya-desai-12d" className="signal-link"><span>LINKEDIN</span><small>WORK / CONTACT</small></ExternalLink>
          <ExternalLink href="https://get-accordion.dev" className="signal-link"><span>ACCORDION</span><small>CURRENT / BUILD</small></ExternalLink>
        </div>
        <div className="footer-line"><span>[AD] / AADITYA DESAI</span><span>AADITYAD.DEV</span><span>END / 2026</span></div>
      </footer>
    </main>
  );
}
