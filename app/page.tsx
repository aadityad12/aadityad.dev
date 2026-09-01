"use client";

import { useEffect } from "react";
import Image from "next/image";
import AccordionVideo from "./components/AccordionVideo";
import GazeDemo from "./components/GazeDemo";
import TemperBench from "./components/TemperBench";
import HeroMascot from "./components/mascot/HeroMascot";
import { StaticMascot } from "./components/mascot/StaticMascot";

const SCRAMBLE_GLYPHS = "/\\-_=+*·<>";

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add("js-ready");

    // threshold must stay 0: a hidden/clipped target can report zero
    // intersection area, so any ratio threshold above 0 may never fire
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    // scramble-decode: mono labels resolve from glyph soup on first sight
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrambled = new WeakSet<Element>();
    const scramble = (el: Element) => {
      const final = el.textContent ?? "";
      const start = performance.now();
      const duration = 500;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const settled = Math.floor(final.length * t);
        el.textContent =
          final.slice(0, settled) +
          Array.from(final.slice(settled), (ch) =>
            ch === " " ? " " : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)],
          ).join("");
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = final;
      };
      requestAnimationFrame(tick);
    };
    const scrambleObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting && !scrambled.has(entry.target)) {
            scrambled.add(entry.target);
            scramble(entry.target);
          }
        }),
      { threshold: 0 },
    );
    if (!reduceMotion) {
      document.querySelectorAll("[data-scramble]").forEach((el) => scrambleObserver.observe(el));
    }

    return () => {
      revealObserver.disconnect();
      scrambleObserver.disconnect();
    };
  }, []);

  return (
    <main>
      <a className="skip-link" href="#top">Skip to content</a>
      <header className="site-header">
        <div className="shell">
          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a className="nav-resume" href="/Aaditya_Desai_Portfolio_Resume.pdf" target="_blank" rel="noreferrer">Résumé</a>
            <a className="nav-contact" href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow" data-scramble>COMPUTER ENGINEERING @ SJSU · EXPECTED MAY 2028</p>
            <h1 className="hero-name">Aaditya Desai</h1>
            <p className="hero-headline">Software for real constraints.</p>
            <p className="hero-intro">
              I work across on-device ML, offline-first applications, and AI infrastructure, following each
              project from the model or protocol to the interface people use.
            </p>
            <p className="hero-availability">Seeking Summer 2027 software engineering, ML, and systems internships.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">View projects ↓</a>
              <a className="button" href="/Aaditya_Desai_Portfolio_Resume.pdf" target="_blank" rel="noreferrer">View résumé ↗</a>
            </div>
            <div className="hero-socials" aria-label="Professional profiles and contact">
              <a href="https://github.com/aadityad12" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/aaditya-desai-12d" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href="mailto:aaditya.d.desai@gmail.com">Email ↗</a>
            </div>
          </div>
          <div className="hero-critter-slot">
            <HeroMascot />
          </div>
        </div>
        <dl className="hero-highlights" aria-label="Selected highlights">
          <div>
            <dt>UC Berkeley AI Hackathon</dt>
            <dd><strong>Winner</strong><span>The Token Company sponsor track</span></dd>
          </div>
          <div>
            <dt>Accordion</dt>
            <dd><strong>200+</strong><span>GitHub stars on the team repository</span></dd>
          </div>
          <div>
            <dt>GazeBoard</dt>
            <dd><strong>~8 ms</strong><span>inference on a phone NPU</span></dd>
          </div>
        </dl>
      </section>

      <section className="section shell" id="projects">
        <div className="section-head">
          <h2>Selected Projects</h2>
          <div className="section-peek reveal"><StaticMascot pose="peek" label="The portfolio mascot peeking over a line" /></div>
        </div>

        <article className="card flagship">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 01 · OPEN-SOURCE AI TOOLING</p>
            <h3>Accordion</h3>
            <p className="card-hook">See what your agent remembers.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              Most coding agents handle a full context window by flattening the session into one lossy summary.
              Accordion makes the window visible and reversible: individual blocks can be folded, unfolded, pinned,
              or recalled while a protected recent window stays intact.
            </p>
            <p className="card-body">
              <span className="body-kicker">MY PART /</span>
              On a team of three, I built the hackathon relevance pipeline with keyword scoring, bi-encoder retrieval,
              and cross-encoder reranking. I also built the live attribution view that shows whether a fold came from the
              user, agent, or conductor. In an early hackathon-scale SlopCodeBench run at a 100k-token budget,
              Accordion completed 5 of 6 checkpoints versus 2 of 6 for naive compaction. We won The Token Company
              sponsor track at UC Berkeley AI Hackathon 2026.
            </p>
            <p className="tech-line">MY PART: PYTHON · HUGGINGFACE TRANSFORMERS · SVELTEKIT</p>
            <ul className="chips">
              <li className="win">🏆 WINNER · UC BERKELEY AI HACKATHON 2026</li>
              <li className="chip-link"><a href="https://github.com/a-Fig/accordion" target="_blank" rel="noreferrer">★ 200+ · TEAM REPO ↗</a></li>
              <li>MIT</li>
            </ul>
            <div className="card-links">
              <a href="https://get-accordion.dev" target="_blank" rel="noreferrer">get-accordion.dev ↗</a>
              <a href="https://github.com/a-Fig/accordion" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="card-media reveal">
            <AccordionVideo />
            <div className="card-cameo cameo-perch">
              <StaticMascot pose="perch" hoverFrame="point" label="The portfolio mascot perched on the demo, pointing at the star count when you hover" />
            </div>
            <p className="media-caption">the context map, live</p>
          </div>
        </article>

        <article className="card flip">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 02 · ANDROID · DAILY DRIVER</p>
            <h3>ApexTracker</h3>
            <p className="card-hook">One app instead of a pile of post-its.</p>
            <p className="card-body">
              <span className="body-kicker">WHY IT EXISTS /</span>
              ApexTracker is the one app I use instead of a pile of post-its, three reminder apps, a calendar, and a
              couple of spreadsheets. It tracks budget, study time, screen time, reminders, notes, and papers, then
              scores each day by the goals I actually hit. Everything works offline; an account is optional and only
              adds Firestore sync.
            </p>
            <p className="card-body">
              <span className="body-kicker">WHAT I BUILT /</span>
              Room is the source of truth, encrypted with SQLCipher and gated by biometrics where needed. Reboot-safe
              alarms, five Glance widgets, on-device receipt parsing, handwritten schema migrations, JUnit tests,
              lint, and Compose screenshot tests make it a codebase I can keep using, not a demo I am afraid to
              update.
            </p>
            <p className="tech-line">KOTLIN · JETPACK COMPOSE · ROOM · SQLCIPHER</p>
            <ul className="chips">
              <li>DAILY DRIVER</li>
              <li>LOCAL-FIRST</li>
            </ul>
            <div className="card-links">
              <a href="https://github.com/aadityad12/Apex-Tracker" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="card-media tilt reveal" style={{ "--tilt": "1.1deg" } as React.CSSProperties}>
            <figure className="phone">
              <Image
                src="/projects/apextracker-dashboard.png"
                alt="ApexTracker's graphite dashboard: daily goal score and a consistency bar chart in monochrome"
                width={1080}
                height={2340}
              />
            </figure>
            <p className="media-caption">the day, scored</p>
          </div>
        </article>

        <article className="card">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 03 · ON-DEVICE ML</p>
            <h3>GazeBoard</h3>
            <p className="card-hook">Typing with your eyes, entirely on-device.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              A gaze-driven communication board for people who cannot reliably speak or use their hands. Because the
              camera stays pointed at the user&apos;s face, privacy was a requirement rather than a feature: frames stay
              on the phone and the app declares no network permission.
            </p>
            <p className="card-body">
              <span className="body-kicker">MY PART /</span>
              I built the Kotlin pipeline from CameraX capture and ML Kit face detection through LiteRT inference on
              the Hexagon NPU, four-point affine calibration, dwell-based tile selection, and speech output. On the
              Galaxy S25 Ultra used during the hackathon, the pipeline measured roughly 8 ms per inference at 15+
              FPS. Built with a team at the Qualcomm × Google LiteRT On-Device &amp; Edge AI Hackathon.
            </p>
            <p className="tech-line">KOTLIN · COMPOSE · CAMERAX · ML KIT · LITERT / HEXAGON NPU</p>
            <ul className="chips">
              <li>ON-DEVICE</li>
              <li>~8 MS INFERENCE</li>
              <li>ZERO NETWORK PERMISSIONS</li>
              <li>APACHE-2.0</li>
            </ul>
            <div className="card-links">
              <a href="https://github.com/aadityad12/GazeBoard" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="card-media reveal">
            <GazeDemo />
          </div>
        </article>

        <article className="card flip">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 04 · OFFLINE SYSTEMS</p>
            <h3>Echo</h3>
            <p className="card-hook">Emergency alerts that survive the internet dying.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              Echo is a prototype for carrying National Weather Service alerts between nearby devices when cellular
              and internet infrastructure are unavailable. It implements BLE discovery and a custom chunked GATT
              transfer path on Android and iOS, with optional Raspberry Pi relay utilities and compact alert IDs for
              deduplication.
            </p>
            <p className="card-body">
              <span className="body-kicker">MY PART /</span>
              I built the native Kotlin and Swift protocol layers. Once received, an alert can be translated
              on-device into 22 target languages and read aloud. Built for Hack for Humanity at Santa Clara
              University.
            </p>
            <p className="tech-line">FLUTTER · KOTLIN · SWIFT · BLE / GATT · SQLITE</p>
            <ul className="chips">
              <li>OFFLINE MESH</li>
              <li>22 LANGUAGES</li>
            </ul>
            <div className="card-links">
              <a href="https://github.com/aadityad12/Echo" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="card-media tilt reveal" style={{ "--tilt": "-1deg" } as React.CSSProperties}>
            <figure className="phone">
              <Image
                src="/projects/echo-alert.png"
                alt="Echo showing a severe weather alert received over Bluetooth mesh, with translation controls"
                width={1206}
                height={2461}
              />
            </figure>
            <p className="media-caption">an alert that arrived with no internet</p>
          </div>
        </article>

        <article className="card">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 05 · AI EVALUATION</p>
            <h3>Temper</h3>
            <p className="card-hook">Test the system around the model.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              AI agents are more than their base model. Prompts, tools, skills, and orchestration can help, or they
              can quietly make the same model worse. Temper compares an agent harness with a bare-model baseline across
              six dimensions, identifies harness-caused regressions, produces replacement artifacts, and reruns only
              the affected checks.
            </p>
            <p className="card-body">
              <span className="body-kicker">MY PART /</span>
              I built the local evaluator, FastAPI service, schemas and contracts, patch loop, deterministic
              integration path, and streaming dashboard. Its strongest current evidence is a reproducible offline
              fixture that verifies the complete evaluate → patch → re-evaluate protocol; live-model evaluation
              remains prototype work. Built at the AI Engineer World&apos;s Fair Hackathon 2026.
            </p>
            <p className="tech-line">PYTHON · FASTAPI · REACT · SSE · JSON SCHEMA</p>
            <ul className="chips">
              <li>AI EVALS</li>
              <li>HACKATHON BUILD</li>
            </ul>
            <div className="card-links">
              <a href="https://github.com/aadityad12/Temper" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="card-media reveal">
            <TemperBench />
            <div className="card-cameo cameo-work">
              <StaticMascot pose="work" hoverFrame="work-turn" label="The portfolio mascot tightening a bolt on the test bench" />
            </div>
            <p className="media-caption">the test bench, drawn</p>
          </div>
        </article>

        <div className="also-built reveal">
          <p>
            ALSO BUILT / <a href="https://github.com/aadityad12/Clear-Dispatch" target="_blank" rel="noreferrer">CLEAR DISPATCH</a>: a local
            emergency-dispatch simulation with a four-stage FastAPI pipeline, live WebSocket dashboard, Haversine
            unit assignment, and explicit dispatcher approval before heavy assets move · team project at HackDavis
            2026
          </p>
        </div>
      </section>

      <section className="section shell" id="about">
        <div className="section-head">
          <h2>About</h2>
        </div>
        <div className="about-grid">
          <div className="about-copy reveal">
            <p>
              I keep gravitating toward software with an awkward constraint: no network, a fixed compute budget, a
              latency target, or an agent that has run out of context. Those projects force me to understand the
              whole path, from the model or protocol through the interface someone actually touches. They make
              hand-waving difficult.
            </p>
            <p>
              ApexTracker is probably the clearest picture of how I build. It began as an intentionally ordinary
              tracker so I would write code every day; somewhere along the way, it replaced the post-its, reminder
              apps, and spreadsheets I was actually using. Teaching C++ and debugging to first-time programmers
              shaped the same habit: trace the symptom backward, explain the mechanism clearly, and stay with the
              problem until the abstraction stops hiding it.
            </p>
            <ul className="about-meta">
              <li>BASED / SANTA CLARA, CA</li>
              <li>STUDY / COMPUTER ENGINEERING @ SJSU · EXPECTED MAY 2028</li>
              <li>LOOKING FOR / SUMMER 2027 SOFTWARE, ML, OR SYSTEMS INTERNSHIPS</li>
            </ul>
          </div>
          <div className="about-mascot reveal">
            <StaticMascot pose="work" label="The portfolio mascot tinkering with a wrench" />
          </div>
        </div>
      </section>

      <footer className="section shell contact" id="contact">
        <div className="contact-grid">
          <div className="reveal">
            <p className="contact-kicker">SUMMER 2027 INTERNSHIPS</p>
            <h2>Get in touch.</h2>
            <p className="contact-sub">
              I&apos;m looking for software engineering, ML, and systems roles. Email is the fastest way to reach me.
            </p>
            <div className="contact-links">
              <a className="contact-primary" href="mailto:aaditya.d.desai@gmail.com">EMAIL ME ↗</a>
              <a href="/Aaditya_Desai_Portfolio_Resume.pdf" target="_blank" rel="noreferrer">RÉSUMÉ ↗</a>
              <a href="https://github.com/aadityad12" target="_blank" rel="noreferrer">GITHUB ↗</a>
              <a href="https://www.linkedin.com/in/aaditya-desai-12d" target="_blank" rel="noreferrer">LINKEDIN ↗</a>
            </div>
          </div>
        </div>
        <div className="footer-line">
          <span>AADITYA DESAI</span>
          <span>AADITYAD.DEV</span>
          <span>BUILT WITH NEXT.JS · 2026</span>
        </div>
      </footer>
    </main>
  );
}
