"use client";

import { useEffect } from "react";
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
      <header className="site-header">
        <div className="shell">
          <a className="wordmark" href="#top">Aaditya Desai</a>
          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#machines">machines</a>
            <a href="#about">about</a>
            <a className="nav-resume" href="/Aaditya_Desai_Portfolio_Resume.pdf" target="_blank" rel="noreferrer">resume ↗</a>
            <a href="#contact">contact</a>
          </nav>
        </div>
      </header>

      <section className="hero shell" id="top">
        <h1 className="hero-name">Aaditya Desai</h1>
        <p className="hero-headline">I build strange, useful machines.</p>
        <p className="hero-sub">Computer engineering @ SJSU · Santa Clara, CA · seeking Summer 2027 internships</p>
        <div className="proof-block">
          <div className="hero-critter-slot">
            <HeroMascot />
          </div>
          <ul className="proof-strip proof-full">
            <li><b className="win" data-scramble>WINNER</b><span>UC Berkeley AI Hackathon 2026</span></li>
            <li><b data-scramble>★ 225</b><span>open-source Accordion · team of 3, my conductor inside</span></li>
            <li><b data-scramble>8 MS</b><span>eye-tracking inference on a phone NPU</span></li>
            <li><b data-scramble>5</b><span>machines below ↓</span></li>
          </ul>
          <div className="proof-compact">
            <p><b className="win">WINNER</b> — UC BERKELEY AI HACKATHON</p>
            <p><b>★ 225</b> OSS · <b>8 MS</b> ON-NPU · <b>5</b> MACHINES ↓</p>
          </div>
        </div>
      </section>

      <section className="section shell" id="machines">
        <div className="section-head">
          <h2>Machines</h2>
          <div className="section-peek reveal"><StaticMascot pose="peek" label="The machine critter peeking over a line" /></div>
        </div>

        <article className="card flagship">
          <div className="reveal">
            <p className="card-kicker" data-scramble>MACHINE 01 · CURRENT</p>
            <h3>Accordion</h3>
            <p className="card-hook">See what your agent remembers.</p>
            <p className="card-body">
              <span className="body-kicker">THE MACHINE /</span>
              Coding agents quietly throw away their own context. Accordion makes that visible — the whole context
              window rendered as a foldable map, where cold blocks get compressed reversibly and a
              &ldquo;conductor&rdquo; decides what stays live. It scores 83.3% on SlopCodeBench at a 100k-token
              budget, against 33.3% for naive compaction.
            </p>
            <p className="card-body">
              <span className="body-kicker">MY PART /</span>
              The conductor&apos;s relevance pipeline — keyword scoring, then bi-encoder similarity, then a
              cross-encoder rerank, with self-calibrating fold targets — and the live dashboard that attributes
              every fold to user, agent, or conductor.
            </p>
            <p className="tech-line">MY PART: PYTHON · HUGGINGFACE TRANSFORMERS · SVELTEKIT</p>
            <ul className="chips">
              <li className="win">🏆 WINNER — UC BERKELEY AI HACKATHON 2026</li>
              <li>TEAM OF 3</li>
              <li className="chip-link"><a href="https://github.com/a-Fig/accordion" target="_blank" rel="noreferrer">★ 225 — TEAM REPO ↗</a></li>
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
              <StaticMascot pose="perch" hoverFrame="point" label="The machine critter perched on the demo, pointing at the star count when you hover" />
            </div>
            <p className="media-caption">the context map, live</p>
          </div>
        </article>

        <article className="card flip">
          <div className="reveal">
            <p className="card-kicker" data-scramble>MACHINE 02 · DAILY DRIVER</p>
            <h3>ApexTracker</h3>
            <p className="card-hook">One app instead of a pile of post-its.</p>
            <p className="card-body">
              Budget, study timer, screen time, reminders, notes, a reading log for papers — and a home screen that
              scores each day by how many of my own goals I hit. I started it to build the habit of building; it
              became the app I actually open every day. Local-first, encrypted, no account.
            </p>
            <p className="tech-line">KOTLIN · JETPACK COMPOSE · ROOM · SQLCIPHER</p>
            <ul className="chips">
              <li>DAILY DRIVER</li>
              <li>LOCAL-FIRST</li>
            </ul>
            <div className="card-links">
              <a href="https://github.com/aadityad12/Trackers" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="card-media tilt reveal" style={{ "--tilt": "1.1deg" } as React.CSSProperties}>
            <figure className="phone">
              <img loading="lazy"
                src="/projects/apextracker-dashboard.png"
                alt="ApexTracker's graphite dashboard: daily goal score and a consistency bar chart in monochrome"
              />
            </figure>
            <p className="media-caption">the day, scored</p>
          </div>
        </article>

        <article className="card">
          <div className="reveal">
            <p className="card-kicker" data-scramble>MACHINE 03 · ON-DEVICE ML</p>
            <h3>GazeBoard</h3>
            <p className="card-hook">Typing with your eyes, 8 ms at a time.</p>
            <p className="card-body">
              An Android keyboard for people who can&apos;t speak or use their hands, built with a team at the
              Qualcomm × Google LiteRT Edge AI Hackathon: four gaze directions drive quick phrases and grouped-letter
              typing, spoken aloud — 15+ FPS across a 478-landmark face mesh, ~8 ms per inference on the phone&apos;s
              Hexagon NPU, zero network permissions declared. My pieces: the NPU deployment and the 4-point
              calibration engine that maps raw gaze into screen space.
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
            <p className="card-kicker" data-scramble>MACHINE 04 · OFFLINE SYSTEMS</p>
            <h3>Echo</h3>
            <p className="card-hook">Emergency alerts that survive the internet dying.</p>
            <p className="card-body">
              When cell and wifi are down, phones running Echo relay National Weather Service alerts to each other
              over Bluetooth LE — a custom chunked GATT protocol implemented natively twice, in Kotlin and in Swift.
              Alerts translate into 22 languages on-device and are read aloud.
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
              <img loading="lazy"
                src="/projects/echo-alert.png"
                alt="Echo showing a severe weather alert received over Bluetooth mesh, with translation controls"
              />
            </figure>
            <p className="media-caption">an alert that arrived with no internet</p>
          </div>
        </article>

        <article className="card">
          <div className="reveal">
            <p className="card-kicker" data-scramble>MACHINE 05 · AI EVALS</p>
            <h3>Temper</h3>
            <p className="card-hook">Test the system around the model.</p>
            <p className="card-body">
              Same model, judged with and without its prompts, tools, and skills, across six dimensions. When the
              harness causes a regression, Temper generates replacement artifacts and re-runs the affected checks.
              Built at the AI Engineer World&apos;s Fair Hackathon 2026.
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
              <StaticMascot pose="work" hoverFrame="work-turn" label="The machine critter tightening a bolt on the test bench" />
            </div>
            <p className="media-caption">the test bench, drawn</p>
          </div>
        </article>

        <div className="also-built reveal">
          <p>
            ALSO BUILT / <a href="https://github.com/aadityad12/Clear-Dispatch" target="_blank" rel="noreferrer">CLEAR DISPATCH</a> — multi-agent 911
            dispatch sim with human-in-the-loop approvals · HackDavis 2026
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
              Almost everything I build follows one of two threads: machines that keep working when the network
              doesn&apos;t — an assistive-vision headset, an eye-typing keyboard, a Bluetooth alert mesh — and
              machines that make AI systems inspectable, like context maps and harness evals.
            </p>
            <p>
              The headset was the long one: a semester as technical lead of VisionAssist, a five-person on-device
              navigation aid built with Infineon, where I wrote the perception pipeline, proved their radar
              couldn&apos;t tell a wall from a chair, and delivered the findings report that cut it. I also
              co-founded my college&apos;s applied-ML club and grew it to 44 members.
            </p>
            <p>
              I&apos;ve spent over a year teaching C++ and x86 assembly as a TA and tutor, and I&apos;m currently a
              TA for an Intro to Engineering course at SJSU. Teaching debugging rewired how I build: work backward
              from the symptom — and if I wouldn&apos;t use it every day, it doesn&apos;t ship.
            </p>
            <ul className="about-meta">
              <li>BASED / SANTA CLARA, CA</li>
              <li>STUDY / COMPUTER ENGINEERING @ SJSU · B.S. EXPECTED SPRING 2028</li>
              <li>AWARDS / BERKELEY AI HACKATHON WIN · DA HACKS 2ND · HACKSTORM MVP</li>
              <li>LOOKING FOR / SUMMER 2027 INTERNSHIPS</li>
            </ul>
          </div>
          <div className="about-mascot reveal">
            <StaticMascot pose="work" label="The machine critter tinkering with a wrench" />
          </div>
        </div>
      </section>

      <footer className="section shell contact" id="contact">
        <div className="contact-grid">
          <div className="reveal">
            <h2>Say hi.</h2>
            <p className="contact-sub">
              Find me on GitHub or LinkedIn — or open an issue on anything I&apos;ve built. That&apos;s the fastest
              way to my attention.
            </p>
            <div className="contact-links">
              <a href="/Aaditya_Desai_Portfolio_Resume.pdf" target="_blank" rel="noreferrer">RESUME ↗</a>
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
