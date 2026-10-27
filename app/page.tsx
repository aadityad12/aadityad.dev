"use client";

import { useEffect } from "react";
import Image from "next/image";
import AccordionVideo from "./components/AccordionVideo";
import GazeDemo from "./components/GazeDemo";
import TemperBench from "./components/TemperBench";
import OpenSourceCard from "./components/OpenSourceCard";
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

    // one passive listener drives both the header pin and the progress bar
    const header = document.getElementById("site-header");
    const bar = document.getElementById("header-progress-bar");
    const hero = document.getElementById("top");
    let frame = 0;
    const sync = () => {
      frame = 0;
      const y = window.scrollY;
      // pin once the hero is most of the way gone, so the two button sets never coexist
      const trigger = Math.max(160, (hero?.offsetHeight ?? 600) * 0.62);
      header?.classList.toggle("is-pinned", y > trigger);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      revealObserver.disconnect();
      scrambleObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main>
      <a className="skip-link" href="#top">Skip to content</a>
      <header className="site-header" id="site-header">
        <div className="shell header-inner">
          <a className="header-mark" href="#top" aria-label="Back to top">
            <span className="header-mark-initials" aria-hidden="true">AD</span>
            <span className="header-mark-name">Aaditya Desai</span>
          </a>
          <nav className="site-nav" aria-label="Primary navigation">
            <a className="nav-section" href="#experience">Experience</a>
            <a className="nav-section" href="#projects">Projects</a>
            <a href="https://github.com/aadityad12" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/aaditya-desai-12d" target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="nav-resume" href="/Aaditya_Desai_Portfolio_Resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a>
          </nav>
        </div>
        <div className="header-progress" aria-hidden="true"><span id="header-progress-bar" /></div>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow" data-scramble>COMPUTER ENGINEERING @ SJSU · EXPECTED MAY 2028</p>
            <h1 className="hero-name">Aaditya Desai</h1>
            <p className="hero-headline">Software for real constraints.</p>
            <p className="hero-intro">
              I&apos;m a computer engineering student at San José State. I&apos;ve built a head-mounted obstacle
              detector with Infineon, a small programming language with a hand-written ARM64 JIT, an Android app I
              use every day, and tools for AI coding agents.
            </p>
            <p className="hero-availability">
              Looking for a Summer 2027 internship or Winter 2027 co-op in software, AI/ML, embedded and hardware,
              DevOps, or security.
            </p>
            <div className="hero-actions" id="hero-actions" aria-label="Résumé and professional profiles">
              <a className="button button-primary" href="/Aaditya_Desai_Portfolio_Resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a>
              <a className="button" href="https://github.com/aadityad12" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a className="button" href="https://www.linkedin.com/in/aaditya-desai-12d" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
            <p className="hero-secondary">
              <a href="mailto:aaditya.d.desai@gmail.com">aaditya.d.desai@gmail.com</a>
              <span aria-hidden="true">·</span>
              <a className="hero-jump" href="#experience">Experience <span aria-hidden="true">↓</span></a>
              <span aria-hidden="true">·</span>
              <a className="hero-jump" href="#projects">Projects <span aria-hidden="true">↓</span></a>
            </p>
          </div>
          <div className="hero-critter-slot">
            <HeroMascot />
          </div>
        </div>
        <ul className="hero-proof" aria-label="Selected highlights">
          <li><b>Winner</b><span>UC BERKELEY AI HACKATHON 2026</span></li>
          <li><b>&#9733; 240+</b><span>ON ACCORDION, THE TEAM REPO</span></li>
          <li><b>Infineon</b><span>RESEARCH INTERNSHIP, 2026</span></li>
        </ul>
      </section>

      <section className="section shell" id="experience">
        <div className="section-head">
          <h2>Experience</h2>
        </div>
        <ol className="xp-list">
          <li className="xp-item reveal">
            <p className="xp-when">APR 2026 TO JUN 2026<br />CUPERTINO, CA</p>
            <div>
              <h3>Research Intern and Technical Lead, VisionAssist</h3>
              <p className="xp-org">Infineon Technologies, with De Anza College</p>
              <p>
                Software lead on a team of five, through De Anza&apos;s ENGR 77 engineering projects course with the
                Infineon University Alliance. I built the on-device vision, distance, and speech pipeline, evaluated
                Infineon&apos;s 60 GHz radar and wrote up why we cut it, and demoed the finished device to
                Infineon&apos;s sponsors. <a href="#visionassist">More on VisionAssist ↓</a>
              </p>
            </div>
          </li>
          <li className="xp-item reveal">
            <p className="xp-when">AUG 2026 TO NOW<br />SAN JOSÉ, CA</p>
            <div>
              <h3>Teaching Assistant, ENGR 10: Introduction to Engineering</h3>
              <p className="xp-org">San José State University</p>
              <p>
                I took this course in Spring 2026, where I wrote the control code for our robot (the fastest run in
                our section), and was brought back to TA it the next semester. I run two weekly lab sections of 30
                students. Teams solder an IR receiver board, build and program a VEX robot that hunts infrared
                beacons, and design and test wind turbine blades. Most of the job is debugging circuits and code at
                the bench.
              </p>
            </div>
          </li>
          <li className="xp-item reveal">
            <p className="xp-when">JAN 2025 TO DEC 2025<br />CUPERTINO, CA</p>
            <div>
              <h3>Teaching Assistant and Computer Science Tutor</h3>
              <p className="xp-org">De Anza College</p>
              <p>
                TA for x86 assembly and both introductory C++ courses, all of which I&apos;d taken, and a tutor in
                the CS lab for C++, assembly, Python, and data structures. Most students were writing their first
                programs, so I traced each bug back to its cause with them instead of handing over fixed code.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="section shell" id="projects">
        <div className="section-head">
          <h2>Projects</h2>
          <div className="section-peek reveal"><StaticMascot pose="peek" label="The portfolio mascot peeking over a line" /></div>
        </div>

        <nav className="project-index" aria-label="Project list">
          <ol>
            <li><a href="#visionassist"><b>VisionAssist</b><span>On-device obstacle detection, with Infineon</span></a></li>
            <li><a href="#rung"><b>Rung</b><span>A language built five ways, every speed-up measured</span></a></li>
            <li><a href="#accordion"><b>Accordion</b><span>Context manager for AI coding agents</span></a></li>
            <li><a href="#oss-scout"><b>OSS Scout</b><span>Nightly open-source scout with a human in charge</span></a></li>
            <li><a href="#apextracker"><b>ApexTracker</b><span>Offline-first Android app I use daily</span></a></li>
            <li><a href="#gazeboard"><b>GazeBoard</b><span>Eye-gaze communication on a phone NPU</span></a></li>
            <li><a href="#echo"><b>Echo</b><span>Emergency alerts over Bluetooth, no internet</span></a></li>
            <li><a href="#temper"><b>Temper</b><span>Finds where an agent&apos;s harness makes it worse</span></a></li>
          </ol>
        </nav>

        <article className="card" id="visionassist">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 01 · EMBEDDED VISION · INFINEON</p>
            <h3>VisionAssist</h3>
            <p className="card-hook">Obstacle warnings you can hear, with no phone or internet.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              A head-mounted Raspberry Pi 5 and camera that spot obstacles, estimate how far away they are, and say
              so through Bluetooth earbuds. Everything runs on the device. A team of five built it through De
              Anza&apos;s ENGR 77 course with Infineon, and we demoed it to Infineon&apos;s sponsors in June 2026.
            </p>
            <p className="card-body">
              <span className="body-kicker">MY PART /</span>
              I was the software lead. I built the pipeline from camera capture to YOLOv8n detection (about 200 ms a
              frame on the Pi&apos;s CPU), distance estimates from bounding-box height, and offline speech that
              announces only the riskiest, closest object, in feet and steps. It boots headless as a systemd service,
              with a phone web app as a second output.
            </p>
            <p className="card-body">
              <span className="body-kicker">WHAT DIDN&apos;T WORK /</span>
              We were asked to use Infineon&apos;s 60 GHz radar. Close-range readings were dominated by antenna
              leakage and floor reflections, and fusing radar with the camera would have needed 3D localization we
              couldn&apos;t build in one quarter. After several weeks I cut it and wrote up why for Infineon. The
              distance estimate still overshoots inside about four feet, and the repo says so.
            </p>
            <p className="tech-line">PYTHON · YOLOV8 · OPENCV · PICAMERA2 · FLASK · PIPER TTS · RASPBERRY PI 5</p>
            <ul className="chips">
              <li>ON-DEVICE</li>
              <li>INFINEON UNIVERSITY ALLIANCE</li>
              <li>MIT</li>
            </ul>
            <div className="card-links">
              <a href="https://github.com/aadityad12/Vision-Assist" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="card-media tilt reveal" style={{ "--tilt": "1deg" } as React.CSSProperties}>
            <figure className="device">
              <Image
                src="/projects/visionassist-device.jpg"
                alt="VisionAssist's Raspberry Pi 5 in a red 3D-printed case with a cooling fan, and an Arducam camera module mounted on top"
                width={711}
                height={755}
              />
            </figure>
            <p className="media-caption">the Pi 5 and camera</p>
          </div>
        </article>

        <article className="card flip" id="rung">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 02 · LANGUAGES · C++ AND ARM64</p>
            <h3>Rung</h3>
            <p className="card-hook">One tiny language, five engines, every speed-up measured.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              Every explanation of how Python, Lua, or JavaScript get fast lists the same tricks: bytecode, register
              machines, smaller values, JITs. I wanted to know how much each one actually helps, so I built a tiny
              language and implemented it five times: a tree-walking interpreter, a stack VM, a register VM, an
              ARM64 JIT, and a JIT that compiles on a background thread. All five have to print byte-identical
              output.
            </p>
            <p className="card-body">
              <span className="body-kicker">WHAT I FOUND /</span>
              The stack VM ran 1.30x to 4.99x faster than the tree-walker, and the JIT reached 22.64x on the one
              benchmark where a function compiles. NaN-boxing halved the size of every value and still made every
              benchmark slower. I don&apos;t know why yet, so it stays in the table. The JIT&apos;s ARM64 encoder is
              hand-written and checked byte for byte against LLVM&apos;s assembler.
            </p>
            <p className="card-body">
              <span className="body-kicker">TESTING /</span>
              Sanitizers, a fuzzer, and CI on macOS and Linux across ARM64 and x86-64. Looping the tests hundreds
              of times in CI exposed a crash in about 5% of runs: UBSan reads 8 bytes before the target of an
              indirect call, and JIT code at the very start of a page made that read hit unmapped memory. Sixteen
              zero bytes fixed it.
            </p>
            <p className="tech-line">C++20 · ARM64 · CMAKE · LIBFUZZER · ASAN / UBSAN / TSAN · GITHUB ACTIONS</p>
            <ul className="chips">
              <li>SOLO</li>
              <li>BENCHMARKED</li>
            </ul>
            <div className="card-links">
              <a href="https://github.com/aadityad12/rung" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="card-media reveal">
            <div className="result-panel mono">
              <p className="result-head">MEDIAN PER CALL · APPLE M1 PRO</p>
              <dl>
                <div><dt>Stack VM vs tree-walker</dt><dd>1.30x to 4.99x</dd></div>
                <div><dt>JIT vs tree-walker, loop_sum</dt><dd>22.64x</dd></div>
                <div><dt>NaN-boxing vs previous rung, sieve</dt><dd className="slower">0.63x</dd></div>
                <div><dt>Background JIT, p99 on warmup</dt><dd>0.82 to 0.32 ms</dd></div>
              </dl>
            </div>
            <p className="media-caption">including the one that got slower</p>
          </div>
        </article>

        <article className="card" id="accordion">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 03 · AI DEVELOPER TOOLS</p>
            <h3>Accordion</h3>
            <p className="card-hook">See what your coding agent remembers.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              When a coding agent&apos;s context fills up, most tools squash the session into one lossy summary.
              Accordion shows the context as a map instead, and lets you or the agent fold, unfold, or pin
              individual blocks. Folding only changes what the agent sees, so nothing is lost. Built by Tyler
              Darisme, Sheel Shah, Thy Tang, and me, it won The Token Company sponsor track at the UC Berkeley AI
              Hackathon 2026. In the team&apos;s hackathon-scale SlopCodeBench run, its Thermocline conductor
              finished 5 of 6 checkpoints, against 2 of 6 for naive compaction.
            </p>
            <p className="card-body">
              <span className="body-kicker">MY PART /</span>
              Through June 2026 I worked on the conductor, the part that decides what to fold. I built a way to
              tell whether folding was helping: health metrics, evaluators, and a harness that compares a session
              against naive compaction. I added a cross-encoder rerank stage for choosing what to unfold, ported the
              conductor onto Accordion&apos;s command contract (PRs #68 and #71), and built a dashboard showing the
              conductor&apos;s health and each decision it made.
            </p>
            <p className="tech-line">MY PART: TYPESCRIPT · HUGGING FACE TRANSFORMERS · SVELTEKIT</p>
            <ul className="chips">
              <li className="win">🏆 WINNER · UC BERKELEY AI HACKATHON 2026</li>
              <li className="chip-link"><a href="https://github.com/a-Fig/accordion" target="_blank" rel="noreferrer">★ 240+ · TEAM REPO ↗</a></li>
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

        <article className="card flip" id="oss-scout">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 04 · AUTOMATION · SECURITY DESIGN</p>
            <h3>OSS Scout</h3>
            <p className="card-hook">Finds open-source work every night. Posts nothing without me.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              Maintainers are buried in low-effort, machine-generated pull requests. OSS Scout automates the
              tedious parts of contributing (finding good issues, judging how welcoming a project is to outside
              contributors, reading unfamiliar code) and leaves the decisions to me. Each night it scans GitHub,
              prepares at most one tested draft fix, and emails me a summary in the morning. Nothing is posted until
              I approve it.
            </p>
            <p className="card-body">
              <span className="body-kicker">HOW IT STAYS SAFE /</span>
              The AI routine that prepares fixes can&apos;t write to GitHub at all: a guard hook blocks every write
              command, with 37 tests behind it. The only write token lives in a separate private repo the routine
              never sees, and a single workflow does all the posting after re-checking each item. Text from
              strangers&apos; issues is treated as data, not instructions.
            </p>
            <p className="tech-line">PYTHON · GITHUB ACTIONS · CLAUDE CODE HOOKS · CLOUDFLARE WORKERS AND ACCESS</p>
            <ul className="chips">
              <li>SOLO</li>
              <li>IN DAILY USE</li>
            </ul>
            <div className="card-links">
              <a href="https://github.com/aadityad12/oss-scout" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="https://oss.aadityad.dev" target="_blank" rel="noreferrer">My contributions ↗</a>
            </div>
          </div>
          <div className="card-media reveal">
            <ol className="flow-steps mono" aria-label="OSS Scout's nightly loop">
              <li><b>SCAN</b><span>nightly, plain Python, no AI</span></li>
              <li><b>PREPARE</b><span>at most one tested draft fix</span></li>
              <li><b>REVIEW</b><span>private dashboard and a morning email</span></li>
              <li><b>ACT</b><span>one tap; the only path that writes to GitHub</span></li>
              <li><b>TRACK</b><span>status read from GitHub, never self-reported</span></li>
            </ol>
            <p className="media-caption">the nightly loop</p>
          </div>
        </article>

        <article className="card" id="apextracker">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 05 · ANDROID · DAILY DRIVER</p>
            <h3>ApexTracker</h3>
            <p className="card-hook">One app instead of a pile of post-its.</p>
            <p className="card-body">
              <span className="body-kicker">WHY IT EXISTS /</span>
              ApexTracker started as an ordinary project to make myself build something every day. It stopped being
              an exercise when I noticed I was reaching for it instead of my post-its, three reminder apps, a
              calendar, and budget spreadsheets. It tracks budget, study time, screen time, reminders, notes, and
              papers, then scores each day by the goals I actually hit. Everything works offline; an account is
              optional and only adds sync.
            </p>
            <p className="card-body">
              <span className="body-kicker">WHAT I BUILT /</span>
              Room is the source of truth, encrypted with SQLCipher and gated by biometrics where it matters. Alarms
              survive reboots, receipts are read on-device, and there are five home-screen widgets, 15 hand-written
              schema migrations, and about 525 unit tests. My favorite bug: the receipt parser passed every test,
              then read the shop&apos;s street number as the total on a real phone.
            </p>
            <p className="tech-line">KOTLIN · JETPACK COMPOSE · ROOM · SQLCIPHER · FIREBASE</p>
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

        <article className="card flip" id="gazeboard">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 06 · ON-DEVICE ML · ANDROID</p>
            <h3>GazeBoard</h3>
            <p className="card-hook">Talking by looking, with nothing leaving the phone.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              A communication board for people who can&apos;t speak or use their hands. The front camera finds the
              face, crops one eye, and Qualcomm&apos;s EyeGaze model estimates where the person is looking. Holding
              their gaze on one of four tiles for a second selects it, and the phone speaks it. Because the camera
              points at someone&apos;s face all day, the app asks for camera access and nothing else, not even the
              internet.
            </p>
            <p className="card-body">
              <span className="body-kicker">MY PART /</span>
              I worked across the path from camera capture through calibration to speech output, and I owned the
              inference path: the model runs only on the phone&apos;s NPU, and if the NPU fails to load, the app
              says so instead of quietly falling back. I also built the debug overlay and the recalibration flow,
              trimmed the spelling vocabulary to 378 words, fixed the Gradle build, and later rewrote the docs.
              Built at the Qualcomm × Google LiteRT Developer Hackathon with Sheel Shah and Nishanth Nagesh.
            </p>
            <p className="tech-line">KOTLIN · COMPOSE · CAMERAX · ML KIT · LITERT · HEXAGON NPU</p>
            <ul className="chips">
              <li>ON-DEVICE</li>
              <li>CAMERA PERMISSION ONLY</li>
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

        <article className="card" id="echo">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 07 · BLUETOOTH · OFFLINE</p>
            <h3>Echo</h3>
            <p className="card-hook">Emergency alerts that keep moving when the internet doesn&apos;t.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              Weather alerts depend on networks that fail during the disasters they warn about. Echo passes
              National Weather Service alerts between nearby phones over Bluetooth Low Energy. Every phone both
              listens and broadcasts, so an alert can spread without a server.
            </p>
            <p className="card-body">
              <span className="body-kicker">MY PART /</span>
              Echo started as a native Android app. During the hackathon I ported it to Flutter, bringing along the
              Kotlin and Swift Bluetooth servers and building the Dart scanner and client, the chunked transfer
              protocol, SQLite storage, and the NWS feed. I also built a Raspberry Pi relay with its own tests, and
              later rewrote the docs and protocol spec. Built at Hack for Humanity 2026 at Santa Clara University
              with Sheel Shah and Oak Soe Khant.
            </p>
            <p className="tech-line">FLUTTER · DART · KOTLIN · SWIFT · BLE / GATT · SQLITE · RASPBERRY PI</p>
            <ul className="chips">
              <li>NO INTERNET NEEDED</li>
              <li>ANDROID AND iOS</li>
            </ul>
            <div className="card-links">
              <a href="https://github.com/aadityad12/Echo" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="card-media tilt reveal" style={{ "--tilt": "-1deg" } as React.CSSProperties}>
            <figure className="phone">
              <Image
                src="/projects/echo-alert.png"
                alt="Echo showing a severe weather alert received over Bluetooth"
                width={1206}
                height={2461}
              />
            </figure>
            <p className="media-caption">an alert that arrived with no internet</p>
          </div>
        </article>

        <article className="card flip" id="temper">
          <div className="reveal">
            <p className="card-kicker" data-scramble>PROJECT 08 · AI EVALUATION</p>
            <h3>Temper</h3>
            <p className="card-hook">Test the system around the model.</p>
            <p className="card-body">
              <span className="body-kicker">THE PROJECT /</span>
              A model&apos;s system prompt, skills, and tools can quietly make it worse. Temper asks the same
              questions with and without that harness; if the harness scores lower, the harness is the cause. It
              then writes replacement files for the parts that failed and re-checks only those.
            </p>
            <p className="card-body">
              <span className="body-kicker">MY PART /</span>
              I wrote the spec, API contract, and JSON Schemas, and built the local client, the pi extension, and
              the FastAPI service (Gemini as judge, DeepSeek as the bare baseline, and the patch generator). I also
              wrote a deliberately flawed customer-support agent with an answer key, so the whole evaluate, patch,
              re-evaluate loop runs offline with no API keys. That offline path is tested; the live-model path
              isn&apos;t currently verified. Built at the AI Engineer World&apos;s Fair Hackathon 2026 with Sheel
              Shah.
            </p>
            <p className="tech-line">PYTHON · FASTAPI · JSON SCHEMA · GEMINI · DEEPSEEK</p>
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
        <OpenSourceCard />
      </section>

      <section className="section shell" id="about">
        <div className="section-head">
          <h2>About</h2>
        </div>
        <div className="about-grid">
          <div className="about-copy reveal">
            <p>
              I&apos;m from India, and I got into engineering through VEX robotics, programming robots in RobotC.
              That came full circle this year: I wrote the control code for my team&apos;s robot in SJSU&apos;s
              ENGR 10, then came back the next semester to TA the course. I originally planned to study computer
              science and switched to computer engineering to get closer to the hardware.
            </p>
            <p>
              A lot of what I build starts with something I need or want to understand. ApexTracker began as a
              way to make myself code every day and ended up replacing my reminder apps and spreadsheets. Rung
              started because I wanted numbers, not claims, for how interpreters get fast. When a result
              doesn&apos;t go my way, like NaN-boxing making Rung slower, I keep it in the table.
            </p>
            <p>
              Teaching shaped how I debug: trace the symptom back to its cause and explain the mechanism, rather
              than hand over a fix. Outside engineering I follow F1, basketball, soccer, and cricket, and I go to
              Bay Area AI meetups. Long term, I want to start a company.
            </p>
            <ul className="about-meta">
              <li>BASED / SANTA CLARA, CA</li>
              <li>STUDY / B.S. COMPUTER ENGINEERING, MINOR IN AI @ SJSU · EXPECTED MAY 2028</li>
              <li>BEFORE THAT / C/C++ PROGRAMMING CERTIFICATE WITH HONORS, DE ANZA COLLEGE</li>
              <li>LOOKING FOR / SUMMER 2027 INTERNSHIPS · WINTER 2027 CO-OPS</li>
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
            <p className="contact-kicker">2027 INTERNSHIPS AND CO-OPS</p>
            <h2>Get in touch.</h2>
            <p className="contact-sub">
              I&apos;m open to software, AI/ML, embedded and hardware, DevOps, and security roles. Email is the
              fastest way to reach me.
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
