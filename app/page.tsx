"use client";

import { useEffect } from "react";
import { MascotHero, MascotHolding, MascotPeeking, MascotWave, MascotWorking } from "./components/mascot/poses";

const SCRAMBLE_GLYPHS = "/\\-_=+*·<>";

const POKE_LINES = [
  "beep.",
  "i'm powered by your scrolling.",
  "he really does open that tracker app every day.",
  "fold the bloat. keep the tail.",
  "8 ms. i counted.",
  "zero network permissions. your secrets are safe.",
  "hire my human.",
];

function GazePlaceholder() {
  return (
    <div className="gaze-diagram">
      <svg viewBox="0 0 240 200" role="img" aria-label="Diagram of an eye with four gaze directions: up, down, left, right">
        <g fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 40 100 C 62 66 96 48 120 48 C 144 48 178 66 200 100 C 178 134 144 152 120 152 C 96 152 62 134 40 100 Z" />
          <path d="M 120 72 C 137 72 148 84 148 100 C 148 116 136 128 119 128 C 103 128 92 115 92 99 C 92 84 104 72 120 72" />
          <path d="M 120 30 C 119 22 121 16 120 10 M 112 18 L 120 9 L 128 18" stroke="var(--accent)" />
          <path d="M 120 170 C 121 178 119 184 120 190 M 112 182 L 120 191 L 128 182" stroke="var(--accent)" />
          <path d="M 22 100 C 16 99 12 101 6 100 M 14 92 L 5 100 L 14 108" stroke="var(--accent)" />
          <path d="M 218 100 C 224 99 228 101 234 100 M 226 92 L 235 100 L 226 108" stroke="var(--accent)" />
        </g>
        <circle cx="122" cy="101" r="9" fill="var(--accent)" />
      </svg>
      <p>4 GAZE DIRECTIONS · ~8 MS PER FRAME · DEMO RECORDING COMING SOON</p>
    </div>
  );
}

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

    // hero pupil follows the cursor a little
    const pupil = document.querySelector<SVGCircleElement>(".mascot-hero .mascot-pupil");
    const onMove = (event: MouseEvent) => {
      if (!pupil) return;
      const rect = pupil.closest("svg")!.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      const reach = 6;
      pupil.style.transform = `translate(${(dx / len) * reach}px, ${(dy / len) * reach}px)`;
    };
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!reduceMotion && canHover) window.addEventListener("mousemove", onMove, { passive: true });

    // chest battery charges with scroll progress; full charge = every mascot hops once
    let chargeRaf = 0;
    let fullyCharged = false;
    const setCharge = () => {
      chargeRaf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 1;
      document.documentElement.style.setProperty("--charge", String(Math.max(0.08, progress)));
      if (progress > 0.97 && !fullyCharged && !reduceMotion) {
        fullyCharged = true;
        document.querySelectorAll(".mascot").forEach((m) => m.classList.add("poked"));
      }
    };
    const onScrollCharge = () => {
      if (!chargeRaf) chargeRaf = requestAnimationFrame(setCharge);
    };
    window.addEventListener("scroll", onScrollCharge, { passive: true });
    setCharge();

    // poke: hop (spin every 7th), plus a hand-written speech bubble
    let pokeCount = 0;
    const onPoke = (event: MouseEvent) => {
      const mascot = (event.target as Element).closest?.(".mascot");
      if (!mascot) return;
      pokeCount += 1;
      const easterEgg = pokeCount % 7 === 0;
      mascot.classList.remove("poked", "spin");
      void (mascot as unknown as HTMLElement).getBoundingClientRect();
      mascot.classList.add(easterEgg ? "spin" : "poked");
      const host = mascot.parentElement;
      if (!host) return;
      host.querySelector(".speech-bubble")?.remove();
      const bubble = document.createElement("div");
      bubble.className = "speech-bubble";
      bubble.setAttribute("aria-hidden", "true");
      bubble.textContent = easterEgg ? "ok, that's enough. back to the machines." : POKE_LINES[(pokeCount - 1) % POKE_LINES.length];
      host.appendChild(bubble);
      setTimeout(() => bubble.remove(), 2600);
    };
    document.addEventListener("click", onPoke);

    return () => {
      revealObserver.disconnect();
      scrambleObserver.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScrollCharge);
      document.removeEventListener("click", onPoke);
      if (chargeRaf) cancelAnimationFrame(chargeRaf);
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
            <a href="#contact">contact</a>
          </nav>
        </div>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-grid">
          <div>
            <h1 className="hero-name">Aaditya Desai</h1>
            <p className="hero-headline">I build strange, useful machines.</p>
            <p className="hero-sub">Computer engineering @ SJSU · Santa Clara, CA · seeking Summer 2027 internships</p>
            <ul className="proof-strip">
              <li><b className="win" data-scramble>WINNER</b><span>UC Berkeley AI Hackathon 2026</span></li>
              <li><b data-scramble>★ 225</b><span>open-source Accordion</span></li>
              <li><b data-scramble>8 MS</b><span>eye-tracking inference on a phone NPU</span></li>
              <li><b data-scramble>5</b><span>machines below ↓</span></li>
            </ul>
          </div>
          <div className="mascot-slot" id="mascot-slot">
            <MascotHero />
          </div>
        </div>
      </section>

      <section className="section shell" id="machines">
        <div className="section-head">
          <h2>Machines</h2>
          <div className="section-peek reveal"><MascotPeeking /></div>
        </div>

        <article className="card flagship">
          <div className="reveal">
            <p className="card-kicker" data-scramble>MACHINE 01 · CURRENT</p>
            <h3>Accordion</h3>
            <p className="card-hook">See what your agent remembers.</p>
            <p className="card-body">
              Coding agents quietly throw away their own context. Accordion makes that visible — the whole context
              window rendered as a foldable map, where cold blocks get compressed reversibly and a
              &ldquo;conductor&rdquo; decides what stays live. My pieces: the conductor&apos;s relevance pipeline —
              keyword scoring, then bi-encoder similarity, then a cross-encoder rerank, with self-calibrating fold
              targets — and the live dashboard that attributes every fold to user, agent, or conductor. It scores
              83.3% on SlopCodeBench at a 100k-token budget, against 33.3% for naive compaction.
            </p>
            <p className="tech-line">MY PART: PYTHON · HUGGINGFACE TRANSFORMERS · SVELTEKIT</p>
            <ul className="chips">
              <li className="win">🏆 WINNER — UC BERKELEY AI HACKATHON 2026</li>
              <li>★ 225</li>
              <li>18 FORKS</li>
              <li>MIT</li>
            </ul>
            <div className="card-links">
              <a href="https://get-accordion.dev" target="_blank" rel="noreferrer">get-accordion.dev ↗</a>
              <a href="https://github.com/a-Fig/accordion" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="card-media tilt reveal">
            <figure>
              <img
                src="/projects/accordion-hero.gif"
                alt="Accordion rendering a long coding-agent session as a grid of colored, foldable context blocks"
              />
            </figure>
            <div className="card-mascot at-right"><MascotHolding /></div>
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
              <img
                src="/projects/apextracker-dashboard.png"
                alt="ApexTracker's graphite dashboard: daily goal score and a consistency bar chart in monochrome"
              />
            </figure>
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
            <GazePlaceholder />
            <div className="card-mascot at-left"><MascotWorking /></div>
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
              <img
                src="/projects/echo-alert.png"
                alt="Echo showing a severe weather alert received over Bluetooth mesh, with translation controls"
              />
            </figure>
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
          <div className="card-media tilt reveal" style={{ "--tilt": "1.3deg" } as React.CSSProperties}>
            <figure>
              <img src="/projects/temper-logo.webp" alt="Temper's logo: a tempering flame over an evaluation grid" />
            </figure>
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
              I&apos;ve spent over a year teaching C++ and x86 assembly as a TA and tutor, and now run two weekly lab
              sections for SJSU&apos;s intro engineering course. Teaching debugging rewired how I build: work
              backward from the symptom — and if I wouldn&apos;t use it every day, it doesn&apos;t ship.
            </p>
            <ul className="about-meta">
              <li>BASED / SANTA CLARA, CA</li>
              <li>STUDY / COMPUTER ENGINEERING @ SJSU · B.S. EXPECTED 2028</li>
              <li>AWARDS / BERKELEY AI HACKATHON WIN · DA HACKS 2ND · HACKSTORM MVP</li>
              <li>LOOKING FOR / SUMMER 2027 INTERNSHIPS</li>
            </ul>
          </div>
          <div className="about-mascot reveal">
            <MascotWorking />
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
          <div className="contact-mascot reveal">
            <MascotWave />
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
