import Image from "next/image";
import Chrome from "./components/Chrome";
import Waveform from "./components/Waveform";
import AccordionDemo from "./components/demos/AccordionDemo";
import GazeDemo from "./components/demos/GazeDemo";
import DispatchSim from "./components/demos/DispatchSim";
import VisionDemo from "./components/demos/VisionDemo";

export default function Home() {
  return (
    <Chrome>
      <main id="top">
        {/* ============ TITLE BLOCK ============ */}
        <div className="doc-control">
          <span>
            DOCUMENT <b>AD-2027</b>
          </span>
          <span>
            REV <b>A</b>
          </span>
          <span>
            DATE <b>2026-10-29</b>
          </span>
          <span>
            SHEET <b>1 OF 1</b>
          </span>
          <span className="dc-prelim">Preliminary — specifications subject to change</span>
        </div>

        <section className="hero" aria-label="Introduction">
          <div>
            <span className="kicker">Human Component · Software Engineering</span>
            <h1>
              Aaditya
              <br />
              <span className="ln2">Desai</span>
            </h1>
            <p className="hero-role">
              <b>Computer Engineering, San José State University</b> · Minor in AI · Expected May 2028
            </p>
            <p className="hero-pos">
              I build software for <strong>awkward constraints</strong> — no network, a fixed compute budget, a
              latency target, an agent that has run out of context. Those constraints force me to understand the
              whole path, from the model or protocol to the interface a person actually touches.
            </p>
            <p className="hero-note">
              This site is formatted as a datasheet, because that is how I think: every project below ships with its
              operating conditions, its measured numbers, and its errata.
            </p>
            <div className="hero-links">
              <a className="btn btn-solid" href="/Aaditya_Desai_Resume.pdf">
                Résumé (PDF) ↓
              </a>
              <a className="btn" href="https://github.com/aadityad12" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a className="btn" href="https://linkedin.com/in/aaditya-desai-12d" target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              <a className="btn" href="mailto:aaditya.d.desai@gmail.com">
                Email
              </a>
            </div>
            <span className="hero-avail">
              <span className="led" aria-hidden="true" />
              Seeking internships · Summer 2027 (May–Aug) · Winter 2027 co-ops also open
            </span>
          </div>

          <div>
            <div className="features-box">
              <div className="fb-head">
                <span>Features</span>
                <span>AD-2027</span>
              </div>
              <ul>
                <li>
                  <b>B.S. Computer Engineering + AI minor, SJSU</b> — GPA 3.8, Dean&apos;s Scholar
                </li>
                <li>
                  <b>Sponsor Track winner, UC Berkeley AI Hackathon 2026</b> — Accordion, 200+ GitHub stars
                </li>
                <li>
                  On-device ML: <b>≈8 ms NPU gaze inference</b>; 200 ms/frame CPU perception on a Pi 5
                </li>
                <li>
                  Real-time systems: event-driven 911 dispatch console, <b>zero client polling</b>
                </li>
                <li>
                  Research intern &amp; technical lead, <b>Infineon × De Anza</b> vision capstone
                </li>
                <li>TA at SJSU (ENGR 10); C++, x86 assembly &amp; Python tutor at De Anza</li>
                <li>ICPC 2025 Regionals — top 10 at site, Division 2</li>
              </ul>
            </div>

            <div className="hero-meta">
              <div className="stamp" aria-hidden="true">
                <span>
                  Qualified
                  <small>UC Berkeley</small>
                  <small>AI Hackathon 2026</small>
                </span>
              </div>
              <div className="barcode" aria-hidden="true">
                <div className="bars" />
                <span className="bc-label">AADITYAD·DEV</span>
              </div>
            </div>

            <Waveform />
          </div>
        </section>

        {/* at a glance */}
        <div className="glance reveal" aria-label="Key figures">
          <div className="g">
            <div className="gv">
              3<em>.</em>8
            </div>
            <div className="gk">GPA · Dean&apos;s Scholar · SJSU CE &apos;28</div>
          </div>
          <div className="g">
            <div className="gv">
              5<em>/</em>6
            </div>
            <div className="gk">SlopCodeBench checkpoints @ 100K tokens — vs 2/6 naive</div>
          </div>
          <div className="g">
            <div className="gv">
              ≈8<em>ms</em>
            </div>
            <div className="gk">On-device gaze inference, observed on Galaxy S25 Ultra NPU</div>
          </div>
          <div className="g">
            <div className="gv">
              4<em>×</em>
            </div>
            <div className="gk">Competition honors — Berkeley win · DA Hacks 2nd · ICPC top 10 · HackStorm MVP</div>
          </div>
        </div>

        {/* ============ 2.0 OPERATING CONSTRAINTS ============ */}
        <section className="sect reveal" id="constraints" aria-label="Operating constraints">
          <div className="sect-head">
            <span className="sect-no">2.0</span>
            <h2 className="sect-title">Operating Constraints</h2>
            <span className="sect-note">The through-line: every system below runs out of something</span>
          </div>
          <p className="sect-lede">
            A datasheet is a list of things a part must survive. These are the conditions my projects run under —
            each one shaped the design more than any feature list did.
          </p>
          <table className="spec">
            <thead>
              <tr>
                <th>System</th>
                <th>Constraint</th>
                <th>Budget</th>
                <th>What it forced</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="t-name">GazeBoard</td>
                <td className="t-dim">Camera pointed at a disabled user&apos;s face; nothing may leave the phone</td>
                <td className="t-budget">NPU-only · 0 net perms</td>
                <td className="t-dim">LiteRT CompiledModel with no CPU/GPU fallback; failure shows an error, never a silent downgrade</td>
              </tr>
              <tr>
                <td className="t-name">VisionAssist</td>
                <td className="t-dim">A person walking cannot wait on a network round trip</td>
                <td className="t-budget">200 ms / frame · Pi 5 CPU</td>
                <td className="t-dim">YOLOv8n over heavier variants, frame skipping under load, one spoken event per frame</td>
              </tr>
              <tr>
                <td className="t-name">Accordion</td>
                <td className="t-dim">Agents degrade on long tasks as context fills with dead weight</td>
                <td className="t-budget">100K tokens</td>
                <td className="t-dim">Hide instead of delete: reversible folds scored by a three-stage relevance pipeline</td>
              </tr>
              <tr>
                <td className="t-name">Clear Dispatch</td>
                <td className="t-dim">Errors are measured in lives; surges arrive without warning</td>
                <td className="t-budget">60 s sliding window</td>
                <td className="t-dim">Automation handles volume; heavy assets hold for explicit human approval</td>
              </tr>
              <tr>
                <td className="t-name">Echo</td>
                <td className="t-dim">Disasters kill the same infrastructure alerts depend on</td>
                <td className="t-budget">BLE only</td>
                <td className="t-dim">Hand-rolled chunked wire protocol; phone-to-phone relay, no internet at all</td>
              </tr>
              <tr>
                <td className="t-name">ApexTracker</td>
                <td className="t-dim">A tool you don&apos;t open daily is decoration</td>
                <td className="t-budget">Offline-first</td>
                <td className="t-dim">&quot;Would I open this every single day?&quot; — if not, it doesn&apos;t ship</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ============ 3.0 APPLICATIONS ============ */}
        <section className="sect" id="applications" aria-label="Applications">
          <div className="sect-head">
            <span className="sect-no">3.0</span>
            <h2 className="sect-title">Application Notes</h2>
            <span className="sect-note">Figures 1–4 are live. They run locally, in your browser, right now.</span>
          </div>

          {/* ---- 3.1 Accordion ---- */}
          <article className="appnote reveal" id="accordion">
            <div className="appnote-demo">
              <AccordionDemo />
              <figure className="appnote-media">
                <video controls muted playsInline loop preload="none" poster="/projects/accordion-poster.jpg">
                  <source src="/projects/accordion-demo.webm" type="video/webm" />
                  <source src="/projects/accordion-demo.mp4" type="video/mp4" />
                </video>
                <figcaption>Recorded demo — the real extension folding and recalling live context</figcaption>
              </figure>
            </div>
            <div className="appnote-copy">
              <div className="appnote-kicker">
                <span>3.1 / AI Tooling — Context Management</span>
                <span className="an-date">Jun 2026</span>
              </div>
              <h3>Accordion</h3>
              <p className="an-tag">
                An agent can forget. <em>Its context shouldn&apos;t.</em>
              </p>
              <p>
                A context-management layer for LLM coding agents. The whole context window renders as a live grid of
                token-weighted blocks that fold, unfold, pin, and recall — reversibly. Folding changes what the agent
                sees, never what is stored. Compaction flattens a session into one lossy summary; sliding windows just
                drop the oldest tokens. Accordion makes hiding inspectable instead.
              </p>
              <div className="an-part">
                <b>My part — team of three</b>
                The hackathon relevance pipeline: keyword scoring → bi-encoder retrieval (Hugging Face Transformers) →
                cross-encoder rerank, behind a self-calibrating fold target of 0.60–0.92 of budget. Also the live
                per-actor attribution view. The team has since built stronger conductors — the framing here is scoped
                to what I built.
              </div>
              <div className="proof-row">
                <span className="proof">
                  <b>5/6</b> vs 2/6 checkpoints
                </span>
                <span className="proof">
                  <b>83.3%</b> vs 33.3% @ 100K
                </span>
                <span className="proof">
                  <b>200+</b> GitHub stars
                </span>
                <span className="proof">
                  <b>Winner</b> Sponsor Track · The Token Company
                </span>
              </div>
              <div className="an-stack">Python · TypeScript · SvelteKit · Hugging Face Transformers</div>
              <div className="an-links">
                <a href="https://github.com/a-Fig/accordion" target="_blank" rel="noreferrer">
                  Repository ↗
                </a>
                <a href="https://get-accordion.dev" target="_blank" rel="noreferrer">
                  get-accordion.dev ↗
                </a>
                <a href="https://www.npmjs.com/package/@a-fig/accordion" target="_blank" rel="noreferrer">
                  npm @a-fig/accordion ↗
                </a>
              </div>
            </div>
          </article>

          {/* ---- 3.2 GazeBoard ---- */}
          <article className="appnote flip reveal" id="gazeboard">
            <div className="appnote-demo">
              <GazeDemo />
            </div>
            <div className="appnote-copy">
              <div className="appnote-kicker">
                <span>3.2 / On-Device ML — Android</span>
                <span className="an-date">Apr–May 2026</span>
              </div>
              <h3>GazeBoard</h3>
              <p className="an-tag">
                <em>Talk by looking at tiles.</em> No hardware but a phone.
              </p>
              <p>
                An Android app that lets someone who cannot speak or use their hands communicate by looking at tiles.
                Four gaze directions drive spoken quick phrases and a spelling mode. The camera points continuously at
                a user&apos;s face, so nothing may leave the device: the app declares camera permission and nothing
                else — no internet permission, no network client, no analytics.
              </p>
              <div className="an-part">
                <b>How it runs — team of three</b>
                CameraX → ML Kit face landmarks → 96×160 eye crop → Qualcomm EyeGaze via LiteRT CompiledModel,
                NPU-only by design (a load failure shows an error rather than silently switching accelerators) → EMA
                smoothing → quadrant mapping → one-second dwell. Four-point calibration corrects per-user facial
                geometry; seven Qualcomm v79 runtime libraries ship as an SM8750 dynamic feature.
              </div>
              <div className="proof-row">
                <span className="proof">
                  <b>≈8 ms</b> inference, observed¹
                </span>
                <span className="proof">
                  <b>15+</b> FPS end-to-end
                </span>
                <span className="proof">
                  <b>0</b> network permissions
                </span>
                <span className="proof">
                  <b>NPU-only</b> no fallback
                </span>
              </div>
              <div className="an-stack">Kotlin · Jetpack Compose · CameraX · ML Kit · LiteRT · Qualcomm Hexagon NPU</div>
              <div className="an-links">
                <a href="https://github.com/aadityad12/GazeBoard" target="_blank" rel="noreferrer">
                  Repository ↗
                </a>
              </div>
              <p className="mono" style={{ marginTop: 14, textTransform: "none", letterSpacing: "0.02em" }}>
                ¹ Read from the in-app debug overlay on a Galaxy S25 Ultra during the Qualcomm × Google Edge AI
                Hackathon; a dated first-hand observation, not a logged dataset.
              </p>
            </div>
          </article>

          {/* ---- 3.3 Clear Dispatch ---- */}
          <article className="appnote reveal" id="cleardispatch">
            <div className="appnote-demo">
              <DispatchSim />
            </div>
            <div className="appnote-copy">
              <div className="appnote-kicker">
                <span>3.3 / Real-Time Systems</span>
                <span className="an-date">May 2026 · HackDavis</span>
              </div>
              <h3>Clear Dispatch</h3>
              <p className="an-tag">
                Automation handles the volume. <em>A human keeps the authority.</em>
              </p>
              <p>
                A 911 dispatch console that triages synthetic calls and routes the nearest available unit in real
                time. The design question was where automation belongs in a system whose errors are measured in
                lives. The answer: every automated transition stays overridable, and heavy assets — air tankers,
                heavy rescue, hazmat — hold until a dispatcher explicitly confirms.
              </p>
              <div className="an-part">
                <b>How it runs — team of three</b>
                A four-stage pipeline — MONITOR, TRIAGE, RESOURCE, RELAY — over FastAPI and WebSockets. MONITOR
                samples the previous 60 seconds of calls and escalates to surge mode; RESOURCE Haversine-ranks 20
                unit fixtures; every state transition is a typed event into a pure TypeScript reducer, so the client
                never polls.
              </div>
              <div className="proof-row">
                <span className="proof">
                  <b>60 s</b> sliding surge window
                </span>
                <span className="proof">
                  <b>0</b> polls — event-driven
                </span>
                <span className="proof">
                  <b>HOLD</b> before heavy assets move
                </span>
              </div>
              <div className="an-stack">Python · FastAPI · WebSockets · React 18 · TypeScript · Claude Haiku</div>
              <div className="an-links">
                <a href="https://github.com/aadityad12/Clear-Dispatch" target="_blank" rel="noreferrer">
                  Repository ↗
                </a>
              </div>
            </div>
          </article>

          {/* ---- 3.4 VisionAssist ---- */}
          <article className="appnote flip reveal" id="visionassist">
            <div className="appnote-demo">
              <VisionDemo />
              <figure className="appnote-media">
                <Image
                  src="/projects/visionassist-device.jpg"
                  alt="The VisionAssist prototype: a 3D-printed head-mounted enclosure holding a Raspberry Pi 5 and camera"
                  width={1200}
                  height={900}
                />
                <figcaption>The physical prototype — 3D-printed enclosure, Pi 5, Arducam IMX708</figcaption>
              </figure>
            </div>
            <div className="appnote-copy">
              <div className="appnote-kicker">
                <span>3.4 / Embedded Perception — Infineon × De Anza</span>
                <span className="an-date">Apr–Jun 2026</span>
              </div>
              <h3>VisionAssist</h3>
              <p className="an-tag">
                A head-mounted spotter for someone <em>walking toward things they can&apos;t see.</em>
              </p>
              <p>
                A wearable that watches the path ahead of a visually impaired user, works out what is in the way and
                roughly how far off, and says so through Bluetooth earbuds — in steps, not feet. One loop at about
                five frames per second, entirely on a Raspberry Pi 5: no phone, no cloud, no internet.
              </p>
              <div className="an-part">
                <b>My part — research intern &amp; technical lead, team of five</b>
                All of the code: the Python perception service (YOLOv8n on the Pi 5 CPU at ~200 ms/frame), the
                priority-tiered ranking that speaks one event per frame, the Piper on-device TTS path, and the
                systemd units that run it headless on power-up.
              </div>
              <div className="proof-row">
                <span className="proof">
                  <b>200 ms</b> per frame · CPU
                </span>
                <span className="proof">
                  <b>3</b> risk tiers × 3 distance zones
                </span>
                <span className="proof">
                  <b>0</b> cloud dependencies
                </span>
              </div>
              <div className="an-stack">Python · PyTorch · YOLOv8 · OpenCV · Picamera2 · Piper TTS · systemd · Pi 5</div>
              <div className="an-links">
                <a href="https://github.com/aadityad12/Vision-Assist" target="_blank" rel="noreferrer">
                  Repository ↗
                </a>
              </div>
              <div className="field-note">
                <div className="fn-label">Field note — the radar we didn&apos;t ship</div>
                <p>
                  The project began with an Infineon BGT60TR13C 60 GHz radar supplying distance. We cut it
                  mid-project, and the reason is the real lesson: radar tells you how far the nearest reflective
                  surface is, but not what it is; monocular vision tells you what something is, but not reliably how
                  far. Fusing them means answering &quot;is the thing the radar ranges the thing the camera
                  sees?&quot; — a 3D localization problem, out of scope for the timeline.
                </p>
                <p>
                  We root-caused the bad readings to the sensor locking onto the strongest reflector, wrote up the
                  findings for Infineon, and shipped a calibrated monocular estimator instead. The radar code stays in
                  the repo. Abandoned work you understand beats work you quietly hide.
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* ============ 4.0 ERRATA ============ */}
        <section className="sect reveal" id="errata" aria-label="Errata">
          <div className="sect-head">
            <span className="sect-no">4.0</span>
            <h2 className="sect-title">Errata</h2>
            <span className="sect-note">Known limitations, documented like a grown-up datasheet</span>
          </div>
          <p className="errata-note">
            Every README I ship states what does not work. That is not a confession — it is the same engineering
            maturity as the numbers above, and it is usually the best interview conversation I have.
          </p>
          <table className="spec">
            <thead>
              <tr>
                <th>Erratum</th>
                <th>Description</th>
                <th>Affects</th>
                <th>Status / workaround</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="t-errat">E-001</td>
                <td className="t-dim">
                  Distance overestimates inside 4 ft: a partially visible object yields a shorter box, and a shorter
                  box reads as farther. Exactly backwards.
                </td>
                <td className="t-name">VisionAssist</td>
                <td className="t-dim">Zones raised to 9/6 ft as mitigation. Edge-clip suppression scoped (~20 lines), not yet shipped.</td>
              </tr>
              <tr>
                <td className="t-errat">E-002</td>
                <td className="t-dim">No path from spelling mode back to quick phrases except recalibrating.</td>
                <td className="t-name">GazeBoard</td>
                <td className="t-dim">Documented; navigation gesture planned.</td>
              </tr>
              <tr>
                <td className="t-errat">E-003</td>
                <td className="t-dim">Dashboard does not rehydrate after a refresh; state rebuilds from new events.</td>
                <td className="t-name">Clear Dispatch</td>
                <td className="t-dim">Acceptable for demo scope; snapshot event is the known fix.</td>
              </tr>
              <tr>
                <td className="t-errat">E-004</td>
                <td className="t-dim">The 5/6 benchmark is a hackathon-scale run — a signal, not a guarantee.</td>
                <td className="t-name">Accordion</td>
                <td className="t-dim">The README carries the same caveat. Larger interleaved runs are in progress.</td>
              </tr>
              <tr>
                <td className="t-errat">E-005</td>
                <td className="t-dim">
                  No GPU/CUDA work yet; the C++ skill line rests on teaching and a certificate, not an artifact.
                </td>
                <td className="t-name">This document</td>
                <td className="t-dim">Porting the VisionAssist perception pipeline to C++ is the next build.</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ============ 5.0 ADDITIONAL DEVICES ============ */}
        <section className="sect reveal" id="more-builds" aria-label="Additional builds">
          <div className="sect-head">
            <span className="sect-no">5.0</span>
            <h2 className="sect-title">Additional Devices</h2>
            <span className="sect-note">Same family, smaller die</span>
          </div>
          <table className="spec">
            <thead>
              <tr>
                <th>Device</th>
                <th>Function</th>
                <th>Notable design rule</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="t-name">ApexTracker</td>
                <td className="t-dim">
                  One offline-first Android app — budget, study, screen time, notes, reading log — that replaced a
                  pile of post-its and three reminder apps. My daily driver since Jan 2026; the longest-running
                  codebase I own. SQLCipher at rest, five home-screen widgets, hand-written migrations.
                </td>
                <td className="t-dim">&quot;Would I open this every single day?&quot; If not, it doesn&apos;t ship.</td>
                <td className="t-mono">
                  <a href="https://github.com/aadityad12/Apex-Tracker" target="_blank" rel="noreferrer">
                    github ↗
                  </a>
                </td>
              </tr>
              <tr>
                <td className="t-name">Temper</td>
                <td className="t-dim">
                  An evaluator for AI harnesses: runs a model bare vs. with its system prompt, skills, and tools;
                  finds which dimensions the harness makes worse; writes replacement files and re-checks only those.
                  The full evaluate → patch → re-evaluate loop runs deterministically with no API keys.
                </td>
                <td className="t-dim">A deliberately failing agent, encoded as deterministic test data, is the artifact.</td>
                <td className="t-mono">
                  <a href="https://github.com/aadityad12/Temper" target="_blank" rel="noreferrer">
                    github ↗
                  </a>
                </td>
              </tr>
              <tr>
                <td className="t-name">Echo</td>
                <td className="t-dim">
                  Emergency alerts relayed phone-to-phone over BLE when there is no internet. Custom indexed chunk
                  protocol over GATT, National Weather Service GeoJSON intake, on-device translation into 22
                  languages. My only Flutter/Dart, Swift, and hand-rolled wire protocol.
                </td>
                <td className="t-dim">Alerts depend on the infrastructure disasters destroy. Build the path that survives.</td>
                <td className="t-mono">
                  <a href="https://github.com/aadityad12/Echo" target="_blank" rel="noreferrer">
                    github ↗
                  </a>
                </td>
              </tr>
              <tr>
                <td className="t-name">This document</td>
                <td className="t-dim">
                  The page you are reading: a portfolio formatted as a preliminary datasheet. Next.js static export,
                  hand-rolled CSS, four live instrument demos, zero trackers, zero analytics.
                </td>
                <td className="t-dim">If a site claims the engineer cares about constraints, the site should have some.</td>
                <td className="t-mono">you are here</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ============ 6.0 DESCRIPTION ============ */}
        <section className="sect reveal" id="about" aria-label="Description">
          <div className="sect-head">
            <span className="sect-no">6.0</span>
            <h2 className="sect-title">Description</h2>
            <span className="sect-note">The human behind the part number</span>
          </div>
          <div className="about-grid">
            <div className="about-copy">
              <p>
                I&apos;m a second-year computer engineering student at San José State, transferred in from De Anza
                with a C/C++ certificate with honors. I keep noticing the same pattern: <strong>one specific person
                having a bad day</strong> — someone who cannot speak, someone navigating a sidewalk, a dispatcher
                during a surge — is a better design brief than any feature list.
              </p>
              <p>
                The habit underneath the projects comes from two years of tutoring C++, x86 assembly, and Python:
                trace the symptom backward, explain the mechanism, stay with the problem until the abstraction stops
                hiding it. I now run that same loop as a TA for first-time engineers at SJSU, and it is how the radar
                got cut, how the dispatch console kept its human checkpoint, and how Accordion kept its context
                recoverable.
              </p>
              <p>
                When nobody is assigning anything, I build the tools I then actually use — ApexTracker is on its
                300-somethingth day of being opened every morning.
              </p>
            </div>
            <div className="about-facts">
              <div className="about-fact">
                <div className="af-k">Teaching</div>
                <div className="af-v">
                  TA, ENGR 10 at SJSU (2026– ) — two weekly lab sections. Before that, TA &amp; CS tutor at De Anza
                  (2025): C++, MASM, Python, data structures.
                </div>
              </div>
              <div className="about-fact">
                <div className="af-k">Building community</div>
                <div className="af-v">
                  Co-founder &amp; co-president, Applied Data Analytics Club — zero to 54 members in under a year;
                  mentor at DA Hacks 4.0; Most Valuable Peer at HackStorm 2.0.
                </div>
              </div>
              <div className="about-fact">
                <div className="af-k">Credentials</div>
                <div className="af-v">
                  AWS Certified Cloud Practitioner (2026–2029); AWS AI Practitioner in progress; three Anthropic
                  courses on Claude Code and MCP.
                </div>
              </div>
              <div className="about-fact">
                <div className="af-k">Competitions</div>
                <div className="af-v">
                  UC Berkeley AI Hackathon 2026 Sponsor Track winner · DA Hacks 3.5, 2nd place · ICPC 2025 Regionals,
                  top 10 at site (Div 2).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 7.0 ORDERING INFORMATION ============ */}
        <section className="sect reveal" id="order" aria-label="Ordering information">
          <div className="sect-head">
            <span className="sect-no">7.0</span>
            <h2 className="sect-title">Ordering Information</h2>
            <span className="sect-note">MOQ 1 · Responds within 24 h</span>
          </div>
          <div className="order-grid">
            <div>
              <p className="order-big">
                Production ramp: <em>May 2027.</em>
              </p>
              <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: "26rem" }}>
                Available for software engineering internships May–August 2027, and Winter 2027 co-ops. ML, systems,
                and infrastructure roles all welcome — the constraints above are the filter, not the track.
              </p>
              <table className="spec" style={{ marginTop: 10 }}>
                <tbody>
                  <tr>
                    <td className="t-name">Part number</td>
                    <td className="t-mono">AD-2027-INTERN</td>
                  </tr>
                  <tr>
                    <td className="t-name">Status</td>
                    <td className="t-mono" style={{ color: "var(--red)", fontWeight: 700 }}>
                      PRE-PRODUCTION
                    </td>
                  </tr>
                  <tr>
                    <td className="t-name">Availability</td>
                    <td className="t-mono">MAY 2027 – AUG 2027</td>
                  </tr>
                  <tr>
                    <td className="t-name">Location</td>
                    <td className="t-mono">SAN JOSÉ / BAY AREA · OPEN TO RELOCATION</td>
                  </tr>
                  <tr>
                    <td className="t-name">Lead time</td>
                    <td className="t-mono">&lt; 24 H RESPONSE</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="contact-rows">
              <a className="contact-row" href="mailto:aaditya.d.desai@gmail.com">
                <span className="cr-k">Email</span>
                <span className="cr-v">aaditya.d.desai@gmail.com</span>
                <span className="cr-arrow">→</span>
              </a>
              <a className="contact-row" href="https://github.com/aadityad12" target="_blank" rel="noreferrer">
                <span className="cr-k">GitHub</span>
                <span className="cr-v">github.com/aadityad12</span>
                <span className="cr-arrow">↗</span>
              </a>
              <a className="contact-row" href="https://linkedin.com/in/aaditya-desai-12d" target="_blank" rel="noreferrer">
                <span className="cr-k">LinkedIn</span>
                <span className="cr-v">linkedin.com/in/aaditya-desai-12d</span>
                <span className="cr-arrow">↗</span>
              </a>
              <a className="contact-row" href="/Aaditya_Desai_Resume.pdf">
                <span className="cr-k">Résumé</span>
                <span className="cr-v">Aaditya_Desai_Resume.pdf</span>
                <span className="cr-arrow">↓</span>
              </a>
              <a className="contact-row" href="tel:+16694677824">
                <span className="cr-k">Phone</span>
                <span className="cr-v">669-467-7824</span>
                <span className="cr-arrow">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="site-foot">
          <div className="foot-grid">
            <div>
              <div className="foot-title">Revision History</div>
              <table className="rev">
                <thead>
                  <tr>
                    <th>Rev</th>
                    <th>Date</th>
                    <th>Changes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="rv-rev">0.1</td>
                    <td className="rv-date">2025</td>
                    <td>Initial release. Dark phosphor theme; retired.</td>
                  </tr>
                  <tr>
                    <td className="rv-rev">0.2</td>
                    <td className="rv-date">2026-08</td>
                    <td>&quot;Playful crafted&quot; redesign; sketchbook theme, mascot introduced.</td>
                  </tr>
                  <tr>
                    <td className="rv-rev">A</td>
                    <td className="rv-date">2026-10-29</td>
                    <td>
                      Reissued as a preliminary datasheet. Adds operating-constraint table, four live instrument
                      figures, and §4.0 errata.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="foot-title">Document Control</div>
              <p style={{ fontSize: 13.5, color: "var(--muted)", margin: 0, maxWidth: "26rem" }}>
                This datasheet is a living document; specifications — and the engineer — are subject to change
                without notice. Figures 1–4 are interactive simulations and recordings, labeled as such. All numbers
                are either in the linked repositories or marked as first-hand observations. Set in IBM Plex.
              </p>
            </div>
          </div>
          <div className="foot-fine">
            <span>AD-2027 REV A · SHEET 1 OF 1 · AADITYAD.DEV</span>
            <span>No trackers · No analytics · Demos run locally</span>
            <span className="ff-right">© 2026 Aaditya Desai</span>
          </div>
        </footer>
      </main>
    </Chrome>
  );
}
