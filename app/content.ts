// Every fact on the page lives here. Sources: the master reference, the project READMEs,
// and the curated content file of Oct 2026. Barred claims (GazeBoard "face mesh", Temper's
// fixture scores, Operating Systems coursework) must never be added.

export const PART = "AD2028";
export const REV = "Rev. 2026.10";
export const RESUME = "/Aaditya_Desai_Portfolio_Resume.pdf";
export const EMAIL = "aaditya.d.desai@gmail.com";
export const GITHUB = "https://github.com/aadityad12";
export const LINKEDIN = "https://www.linkedin.com/in/aaditya-desai-12d";
export const DEVPOST = "https://devpost.com/aadityad12";
export const OSS = "https://oss.aadityad.dev";

export type Status = "Measured" | "Observed" | "Single run" | "Repo" | "Stated";

export const STATUS_HELP: Record<Status, string> = {
  Measured: "A recorded result in the project repository.",
  Observed: "Read live during the event, not logged.",
  "Single run": "One benchmark run at hackathon scale.",
  Repo: "A count you can check in the code.",
  Stated: "My account; nothing public behind it.",
};

export type Link = { label: string; href: string };
export type Photo = { src: string; w: number; h: number; alt: string; cap: string };

export const PHOTOS: Record<string, Photo[]> = {
  accordion: [
    { src: "/projects/accordion-context-map.png", w: 1112, h: 1000, alt: "Accordion's context map: a 109,407-token agent session drawn as coloured blocks for user, reply, thinking, tool call and tool result", cap: "A real 109,407-token session in the context map" },
  ],
  visionassist: [
    { src: "/projects/visionassist-device.jpg", w: 711, h: 755, alt: "VisionAssist's Raspberry Pi 5 in a red 3D-printed case with a cooling fan, and an Arducam camera module mounted on top", cap: "The build: Pi 5, printed case, Arducam" },
    { src: "/projects/visionassist-fit-cad.png", w: 800, h: 675, alt: "CAD model of the VisionAssist mount: the Pi 5 and camera on a visor bracket, on a head form", cap: "How it's worn: the visor mount in CAD" },
  ],
  alta: [
    { src: "/projects/alta-setup.png", w: 1990, h: 855, alt: "Alta's bench: a phone camera over the student's breadboard, the probe pod in its printed dock, and a laptop showing 'Yellow 5.01 V (expect about 2)'", cap: "The bench at Cal Hacks: camera, board, pod, laptop" },
    { src: "/projects/alta-overlay.jpg", w: 740, h: 840, alt: "Alta's camera overlay engine marking wires, the hole where the yellow probe goes, and the power rails on a real breadboard", cap: "The overlay marking where the probe goes" },
    { src: "/projects/alta-pod-dock.png", w: 1260, h: 1050, alt: "Top view of the 3D-printed pod dock holding the Arduino Uno and the mini breadboard, with Y B G W probe labels", cap: "The probe pod in its printed dock" },
  ],
  echo: [
    { src: "/projects/echo-alert.jpg", w: 600, h: 1226, alt: "Echo showing a severe weather alert received over Bluetooth", cap: "An alert received with no internet" },
    { src: "/projects/echo-home.jpg", w: 600, h: 1304, alt: "Echo's home screen listing severe weather alerts received from nearby phones", cap: "Every alert it carried" },
  ],
};

export type Headline = { value: string; unit?: string; label: string; status?: Status };
export type Beat = { title: string; body: string };

export type AppNote = {
  id: string;
  an: string;
  title: string;
  block: string;
  domain: string;
  context: string;
  role: string;
  when: string;
  hook: string;
  problem: string;
  built: string[];
  specs: { param: string; value: string; note?: string; status?: Status }[];
  stack: string[];
  links: Link[];
  errata: string[];
  figure: string;
  compact?: boolean;
  oneLiner: string; // <= 90 chars, plain, for the front-page table
  headline: Headline; // the single number for the front-page table
  skills: string[]; // PIN names (exact strings from PINS[].name) used by this project
  beats?: Beat[]; // 3 to 5 beats for the project page Reel
  order: number; // front-page sort order, 1 = first
};

export const HERO = {
  eyebrow: "Computer Engineering · SJSU · Class of 2028",
  lead: "I build from the metal up: an ARM64 JIT compiler, bare-metal firmware, on-device vision, and tools for AI agents.",
  intro:
    "I led the software for VisionAssist, a wearable obstacle detector built with Infineon Technologies, and co-built Accordion, a context manager for AI coding agents that won the Sponsor Track at the UC Berkeley AI Hackathon 2026 and has 240+ stars on GitHub.",
  avail: "Available for Summer 2027 internships · May to August 2027",
};

export type Proof = { big: string; small: string; href: string; status?: Status };
export const PROOF: Proof[] = [
  { big: "Infineon", small: "Research intern and technical lead", href: "#experience" },
  { big: "Winner", small: "Sponsor Track, UC Berkeley AI Hackathon 2026", href: "/work/accordion/" },
  { big: "38.84×", small: "my ARM64 JIT vs. the interpreter", href: "/work/rung/", status: "Measured" },
  { big: "3.8 GPA", small: "Dean's Scholar, SJSU", href: "#education" },
];

export const FEATURES = [
  { k: "ARM64 JIT", v: "hand-written in C++20; recursive fib 38.8× faster than the tree-walker" },
  { k: "Infineon", v: "research intern and technical lead for an on-device vision wearable" },
  { k: "Award winner", v: "Sponsor Track, UC Berkeley AI Hackathon 2026; team repo 240+ stars" },
  { k: "Bare-metal C", v: "ATmega328P probe firmware with its own ADC, UART and timer drivers" },
  { k: "On-device ML", v: "Hexagon NPU, Raspberry Pi 5 CPU, ML Kit: no cloud round trips" },
  { k: "3.8 GPA", v: "Computer Engineering, SJSU, Dean's Scholar; TA for ENGR 10" },
];

export const APPLICATIONS = [
  "Software engineering internships",
  "Embedded and systems roles",
  "ML and AI infrastructure",
  "Compilers, runtimes and developer tools",
];

export const DESCRIPTION =
  "Aaditya Desai is a computer engineering student at San José State University who builds software for real constraints: no network, a fixed compute budget, a latency target, or an agent that has run out of context. He works from the metal up, from interrupt-driven firmware and a hand-written JIT to on-device vision and tools for AI coding agents, and documents what does not work as carefully as what does.";

// Pin map: every pin is a real skill, cross-referenced to the app notes that use it.
// `uses` is filled in at the bottom of this file from NOTES[].skills (see PIN_USES).
export type Pin = { n: number; name: string; type: "I/O" | "IN" | "OUT" | "PWR"; desc: string; uses: string[] };
export const PINS: Pin[] = [
  { n: 1, name: "C++", type: "I/O", desc: "C++20 runtime, VMs and JIT; taught intro C++", uses: [] },
  { n: 2, name: "C", type: "I/O", desc: "Bare-metal AVR firmware, no Arduino libraries", uses: [] },
  { n: 3, name: "ARM64", type: "I/O", desc: "Hand-encoded instructions, checked against LLVM", uses: [] },
  { n: 4, name: "x86", type: "I/O", desc: "MASM assembly, taught as a TA at De Anza", uses: [] },
  { n: 5, name: "PYTHON", type: "I/O", desc: "Perception loop, FastAPI services, CI tooling", uses: [] },
  { n: 6, name: "KOTLIN", type: "I/O", desc: "Android apps and the native BLE GATT layer", uses: [] },
  { n: 7, name: "TS", type: "I/O", desc: "TypeScript dashboards and reducers", uses: [] },
  { n: 8, name: "SWIFT", type: "I/O", desc: "CoreBluetooth GATT server via platform channels", uses: [] },
  { n: 9, name: "PYTORCH", type: "IN", desc: "YOLOv8n inference on the Pi 5 CPU", uses: [] },
  { n: 10, name: "LITERT", type: "IN", desc: "CompiledModel on the Hexagon NPU, no fallback", uses: [] },
  { n: 11, name: "HF", type: "IN", desc: "Cross-encoder relevance reranking", uses: [] },
  { n: 12, name: "OPENCV", type: "IN", desc: "Frame processing, board overlay engine", uses: [] },
  { n: 13, name: "ML KIT", type: "IN", desc: "Face landmarks, on-device receipt OCR", uses: [] },
  { n: 14, name: "LLM API", type: "IN", desc: "Claude, Gemini and DeepSeek with deterministic fallbacks", uses: [] },
  { n: 15, name: "BLE", type: "I/O", desc: "GATT central and peripheral, chunked transfer", uses: [] },
  { n: 16, name: "AVR", type: "I/O", desc: "ATmega328P registers, interrupts, simavr", uses: [] },
  { n: 17, name: "LINUX", type: "PWR", desc: "Raspberry Pi OS, BlueZ, ALSA, headless boot", uses: [] },
  { n: 18, name: "SYSTEMD", type: "PWR", desc: "Units that run the device on power-up", uses: [] },
  { n: 19, name: "CMAKE", type: "PWR", desc: "Presets, sanitizer builds, three-platform CI", uses: [] },
  { n: 20, name: "GH ACT", type: "PWR", desc: "CI pipelines and a nightly scan", uses: [] },
  { n: 21, name: "FASTAPI", type: "OUT", desc: "REST, WebSockets and Server-Sent Events", uses: [] },
  { n: 22, name: "REACT", type: "OUT", desc: "Live dashboards fed by event streams", uses: [] },
  { n: 23, name: "SVELTE", type: "OUT", desc: "Accordion's context map UI", uses: [] },
  { n: 24, name: "COMPOSE", type: "OUT", desc: "Jetpack Compose UIs and Glance widgets", uses: [] },
  { n: 25, name: "FLUTTER", type: "OUT", desc: "Cross-platform alert relay app", uses: [] },
  { n: 26, name: "SQL", type: "I/O", desc: "Room, SQLCipher and SQLite, hand-written migrations", uses: [] },
  { n: 27, name: "TTS", type: "OUT", desc: "Piper on-device speech, Android TextToSpeech", uses: [] },
  { n: 28, name: "FUZZ", type: "IN", desc: "libFuzzer, ASan, UBSan and TSan in CI", uses: [] },
];

export type ElectricalRow = { p: string; cond: string; typ: string; u: string; src: string; status: Status };

export const SPECS: {
  absMax: { p: string; v: string; u: string; note: string }[];
  operating: { p: string; min: string; typ: string; max: string; note: string }[];
  electrical: ElectricalRow[];
} = {
  absMax: [
    { p: "Numbers on this page without a status tag", v: "0", u: "", note: "Each is tagged Measured, Observed, Single run, Repo or Stated" },
    { p: "Silent fallbacks", v: "0", u: "", note: "GazeBoard refuses to switch accelerators without saying so" },
    { p: "Posts made without a human tap", v: "0", u: "", note: "OSS Scout's guard hook, 37 tests" },
    { p: "Use of the word \"passionate\"", v: "0", u: "", note: "" },
  ],
  operating: [
    { p: "Availability", min: "May 2027", typ: "", max: "Aug 2027", note: "Summer 2027 internship" },
    { p: "Location", min: "", typ: "Santa Clara, CA", max: "", note: "Bay Area on site, or remote" },
    { p: "Graduation", min: "", typ: "May 2028", max: "", note: "B.S. Computer Engineering, Minor in AI" },
    { p: "GPA", min: "", typ: "3.8", max: "4.0", note: "Dean's Scholar, SJSU" },
  ],
  electrical: [
    // TODO(aadi): refresh master reference Rung numbers. The repo's committed results (README, results/09_jit.json,
    // checked Oct 2026) give 38.84x on fib and a warmup p99 of 0.89 ms to 0.28 ms; the reference says 22.64x on loop_sum.
    { p: "JIT speedup, recursive fib", cond: "Rung, vs. tree-walker, Apple M1 Pro", typ: "38.84", u: "×", src: "rung", status: "Measured" },
    { p: "JIT speedup over optimized register VM", cond: "Rung, fib, same interleaved session", typ: "4.54", u: "×", src: "rung", status: "Measured" },
    { p: "Per-frame detection latency", cond: "VisionAssist, YOLOv8n, Raspberry Pi 5 CPU", typ: "200", u: "ms", src: "visionassist", status: "Measured" },
    { p: "Gaze inference time", cond: "GazeBoard, Hexagon NPU, Galaxy S25 Ultra", typ: "≈8", u: "ms", src: "gazeboard", status: "Observed" },
    { p: "Checkpoints cleared, 100K-token budget", cond: "Accordion vs. naive compaction, SlopCodeBench", typ: "5 / 6", u: "vs 2 / 6", src: "accordion", status: "Single run" },
    // The 1,200 Hz row is Stated: the Alta README says "about 1,200 times a second" but no recorded run backs it.
    { p: "Probe sample rate, per channel", cond: "Alta pod, ATmega328P, bare-metal ADC", typ: "1,200", u: "Hz", src: "alta", status: "Stated" },
    { p: "Faults found and fixed on real hardware", cond: "Alta, three timed runs", typ: "3 / 3", u: "", src: "alta", status: "Measured" },
    { p: "Unit tests", cond: "ApexTracker, JUnit over extracted logic", typ: "≈525", u: "", src: "apextracker", status: "Repo" },
    { p: "Translation targets", cond: "Echo, on-device", typ: "22", u: "lang", src: "echo", status: "Repo" },
  ],
};

export const NOTES: AppNote[] = [
  {
    id: "accordion",
    an: "AN-01",
    title: "Accordion",
    block: "CONTEXT MMU",
    domain: "AI developer tools",
    context: "UC Berkeley AI Hackathon 2026 · Sponsor Track winner (The Token Company)",
    role: "Team of 4",
    when: "Jun 2026",
    hook: "Lets an AI coding agent forget without losing anything.",
    problem:
      "Agents get worse on long tasks because their context fills with material that no longer matters. The usual fixes are destructive: compaction flattens the session into one lossy summary, and sliding windows just drop the oldest tokens. Accordion folds stale blocks out of the agent's view instead. Folding changes only what the agent sees, never what is stored, so anything can come back. Developed through June 2026; my active contribution ended June 25, 2026.",
    built: [
      "Added a **cross-encoder rerank stage** (MS MARCO MiniLM) on the unfold shortlist, with retention telemetry, a query-aware extractive trim, a fact ledger and a relevance TOC.",
      "Built the **health and evaluation layer**: health metrics with tests, a folding evaluator, a session evaluator, and a harness that compares a session against naive compaction.",
      "Built the **conductor activity dashboard**: health verdict, needed-fold rate, calibration events, fact ledger, relevance TOC and a per-decision view. Ported the conductor onto Accordion's fold, replace and group command contract (PR #68) and built the-conductor-v2 (PR #71).",
    ],
    specs: [
      { param: "SlopCodeBench @ 100K tokens", value: "5 / 6 vs 2 / 6", note: "checkpoints vs. naive compaction, one hackathon-scale run", status: "Single run" },
      { param: "GitHub stars, team repo", value: "240+", note: "a-Fig/accordion, Oct 2026", status: "Repo" },
      { param: "Site visits, get-accordion.dev", value: "10,000+", note: "Oct 2026", status: "Stated" },
    ],
    stack: ["TypeScript", "Hugging Face Transformers", "SvelteKit", "Tauri", "Node.js", "WebSockets"],
    links: [
      { label: "get-accordion.dev", href: "https://get-accordion.dev" },
      { label: "GitHub", href: "https://github.com/a-Fig/accordion" },
      { label: "npm @a-fig/accordion", href: "https://www.npmjs.com/package/@a-fig/accordion" },
    ],
    errata: [
      "The benchmark is a single hackathon-scale run on a subset of problems. The README says to read it as a signal, not a guarantee.",
      "The SlopCodeBench result is credited to the team's Thermocline conductor, not to my work. My conductor and dashboard were removed from main in the August 2026 cleanup and survive in history (PRs #68 and #71).",
      "Scores are 83.3% vs 33.3% on that one run; there are no error bars yet.",
    ],
    figure: "Context map of a simulated agent session. Click a block to fold it, or run the conductor against the budget.",
    order: 2,
    oneLiner: "Context manager for AI coding agents: folds what isn't carrying weight, reversibly.",
    headline: { value: "240+", unit: "★", label: "team repo, Oct 2026", status: "Repo" },
    skills: ["TS", "HF", "SVELTE"],
    beats: [
      { title: "A session fills up.", body: "A long coding-agent session is a stream of blocks: user turns, replies, thinking, tool calls, tool results. The window has a budget. The usual fix flattens it into one lossy summary." },
      { title: "Fold, don't delete.", body: "Accordion hides blocks that aren't carrying weight. Folding changes only what the agent sees, never what is stored, so anything can come back. A protected tail is never folded." },
      { title: "Decide what to bring back.", body: "When the agent needs something folded, a shortlist is reranked by a cross-encoder (MS MARCO MiniLM). I built that stage, plus a fact ledger and a relevance table of contents." },
      { title: "Measure whether it helped.", body: "I built the health layer: metrics, a folding evaluator, a session evaluator, and a harness that compares a session against naive compaction. The dashboard shows every decision the conductor made." },
    ],
  },
  {
    id: "rung",
    an: "AN-02",
    title: "Rung",
    block: "RUNTIME CORE",
    domain: "Compilers and runtimes",
    context: "Personal project",
    role: "Solo",
    when: "Sep–Oct 2026",
    hook: "One small language, built five ways, down to hand-written ARM64 machine code.",
    problem:
      "How much is each classic interpreter optimization actually worth? To find out, I built one dynamically typed language five ways: a tree-walker, a stack VM, a register VM, a baseline ARM64 JIT and a background-thread JIT. All five share one runtime and garbage collector, and every configuration must print byte-identical output. The benchmark ladder measures only what changes in speed, and it keeps every regression.",
    built: [
      "Hand-wrote the **ARM64 instruction encoder**, verified byte for byte against LLVM's assembler. The JIT uses type guards, and when one fails it **bails out mid-function and resumes in the VM**, even four calls deep.",
      "Built a **background compiler** with release/acquire publication and instruction-cache sync. It cut warmup p99 from 0.89 ms to 0.28 ms.",
      "Hardened it with **ASan, UBSan, TSan and libFuzzer** in CI on macOS ARM64, Linux ARM64 and Linux x86-64.",
    ],
    specs: [
      { param: "fib, JIT vs. tree-walker", value: "38.84×", note: "median process total ÷ calls, M1 Pro", status: "Measured" },
      { param: "fib, JIT vs. register VM", value: "4.54×", note: "register VM vs. JIT, same session", status: "Measured" },
      { param: "Largest single-rung loss", value: "0.63×", note: "NaN-boxing on sieve, kept in the table", status: "Measured" },
    ],
    stack: ["C++20", "ARM64", "CMake", "Clang", "libFuzzer", "ASan / UBSan / TSan", "GitHub Actions"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/rung" }],
    errata: [
      "The JIT compiles functions in two of six main benchmarks (fib, loop_sum). The other four fall back to the VM; outlined bars show that.",
      "Results come from one M1 Pro, and three marginal ratios span measurement sessions.",
      "NaN-boxing halved heap allocation but slowed all six benchmarks. The cause is not yet known.",
    ],
    figure: "Speedup over the tree-walker, rung by rung. Real measurements from the repo's results tables.",
    order: 3,
    oneLiner: "One tiny language built five ways, down to a hand-written ARM64 JIT, to measure each speed-up.",
    headline: { value: "38.84×", label: "JIT vs. tree-walker, fib", status: "Measured" },
    skills: ["C++", "ARM64", "CMAKE", "GH ACT", "FUZZ"],
    beats: [
      { title: "One language, five engines.", body: "32-bit ints, floats, strings, arrays, closures. Small enough to build five times: tree-walker, stack VM, register VM, baseline ARM64 JIT, background JIT. All five must print byte-identical output." },
      { title: "Bytecode beats walking the tree.", body: "The stack VM runs 1.30× to 4.99× faster than the tree-walker across six benchmarks. Computed-goto dispatch adds a little more." },
      { title: "Fewer instructions, same work.", body: "The register VM does sieve's work in a third of the stack VM's instructions. Superinstructions cut strcat's dispatch count by 36.5% with almost no time change: the string runtime dominates." },
      { title: "A speed-up that wasn't.", body: "NaN-boxing halved value size and heap use, and made every benchmark slower; sieve ran at 0.63× the rung below. It stays in the table. The cause is still unexplained." },
      { title: "Native code, with an exit.", body: "The JIT hand-encodes ARM64, checked byte for byte against LLVM's assembler. When a type guard fails mid-function it bails out and resumes in the VM. 38.84× faster than the tree-walker on fib." },
    ],
  },
  {
    id: "visionassist",
    an: "AN-03",
    title: "VisionAssist",
    block: "EDGE VISION",
    domain: "Embedded vision",
    context: "Infineon Technologies, with De Anza College",
    role: "Software lead · team of 5",
    when: "Apr–Jun 2026",
    hook: "A wearable that tells a blind user what is ahead, and how many steps away.",
    problem:
      "A person walking down a sidewalk can't wait for a network, and any round trip adds latency to a collision warning. So everything runs on a head-mounted Raspberry Pi 5: one process, one loop, about five frames a second. That single requirement drove the model choice, the distance method, the speech engine, and the decision to cut the radar.",
    built: [
      "Built the whole pipeline: camera capture, **YOLOv8n at about 200 ms a frame** on the Pi 5 CPU, monocular distance from bounding-box height, and risk-ranked speech **in feet and steps** (2.5 ft per step).",
      "Evaluated Infineon's **60 GHz radar** and traced its phantom close-range readings to antenna leakage and floor reflections. Delivered the analysis to Infineon and shipped an empirically tuned monocular distance estimator instead.",
      "Shipped it as a **headless systemd service** that boots on power-up, with an annotated MJPEG stream and a phone web app as a second output path.",
    ],
    specs: [
      { param: "Detection latency", value: "≈200 ms / frame", note: "YOLOv8n, PyTorch CPU", status: "Measured" },
      { param: "Distance model", value: "d = H·f / h", note: "27 class heights, f = 900 px", status: "Repo" },
      { param: "Announcements per frame", value: "1", note: "highest risk tier, then nearest", status: "Repo" },
    ],
    stack: ["Python", "PyTorch", "YOLOv8", "OpenCV", "Picamera2", "Flask", "Piper TTS", "systemd", "Raspberry Pi 5"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Vision-Assist" }],
    errata: [
      "Distance overestimates inside about 4 ft: a partly visible object gives a shorter box, which reads as farther away. Zone thresholds were raised as a mitigation, not a fix.",
      "The real fix, suppressing distance when a box touches the frame edge, is not implemented. Try it in the figure.",
      "No stair or drop-off detection. That is the most important gap for real-world use.",
    ],
    figure: "Drag the obstacles. The pipeline estimates distance from box height, ranks by risk, and announces one thing.",
    order: 1,
    oneLiner: "Head-mounted Pi 5 that spots obstacles and says how many steps away, fully offline.",
    headline: { value: "≈200", unit: "ms / frame", label: "YOLOv8n on the Pi 5 CPU", status: "Measured" },
    skills: ["PYTHON", "PYTORCH", "OPENCV", "LINUX", "SYSTEMD", "TTS"],
    beats: [
      { title: "See.", body: "An Arducam on a head mount feeds 1280×720 frames to one Python process on the Raspberry Pi 5, about five frames a second. Nothing leaves the device." },
      { title: "Detect.", body: "YOLOv8n runs on the Pi's CPU at about 200 ms per frame, with a 0.45 confidence floor and a blocklist for classes that don't matter on a sidewalk." },
      { title: "Measure.", body: "Distance comes from box height: real height × focal length ÷ pixels. 27 hand-set class heights, focal length tuned from a theoretical 1435 px to 900 px. Ground-plane projection was rejected because head tilt varies by about ±15°." },
      { title: "Choose one thing to say.", body: "Objects are ranked by risk tier, then distance. Only the single riskiest, closest one is announced, in feet and steps, and only when it changes or after a 3 s cooldown." },
      { title: "Speak.", body: "Piper TTS on-device, through Bluetooth earbuds, as a systemd service that boots headless. The radar was cut after weeks of phantom readings; the write-up went to Infineon." },
    ],
  },
  {
    id: "gazeboard",
    an: "AN-04",
    title: "GazeBoard",
    block: "GAZE NPU",
    domain: "On-device ML",
    context: "Qualcomm × Google LiteRT On-Device & Edge AI Hackathon",
    role: "Team of 3",
    when: "Apr 2026",
    hook: "Lets someone who can't speak or use their hands talk by looking at a phone.",
    problem:
      "The camera points at a disabled person's face the whole time, so running on-device was a privacy requirement, not an optimization. The app declares camera permission and nothing else: no internet permission, no network client, no analytics. The front camera finds the eye, Qualcomm's EyeGaze model estimates where it is looking, and a one-second look picks a phrase or a letter group.",
    built: [
      "Owned the inference path: EyeGaze running **only on the Hexagon NPU** through LiteRT's CompiledModel, at **about 8 ms per inference and 15+ FPS** on a Galaxy S25 Ultra.",
      "Made failure loud: if the NPU can't load the model, the app shows an error instead of silently switching to a slower accelerator.",
      "Built the debug overlay and the four-corner recalibration flow, and tuned spelling mode's prefix prediction over a **378-word ordered word list**.",
      "Shipped the NPU runtime as **seven Qualcomm v79 libraries in an Android dynamic feature** targeted at SM8750 devices, so the base APK stays small and other phones never download it.",
    ],
    specs: [
      { param: "Inference", value: "≈8 ms", note: "observed on the debug overlay, single session", status: "Observed" },
      { param: "Dwell / cooldown", value: "1 s / 500 ms", note: "per selection", status: "Repo" },
      { param: "Network permissions", value: "0", note: "camera only", status: "Repo" },
    ],
    stack: ["Kotlin", "Jetpack Compose", "CameraX", "ML Kit", "LiteRT", "Hexagon NPU"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/GazeBoard" }],
    errata: [
      "The 8 ms figure was read from the debug overlay during the hackathon. It was not logged, and the repo has no latency dataset.",
      "No accuracy, fatigue, lighting or glasses study exists. Android lint currently reports one error.",
      "A 2×2 layout has far lower input bandwidth than a keyboard. That is a deliberate trade for easier selection.",
    ],
    figure: "Your pointer stands in for gaze. Hold it on a quadrant for one second to select. Arrow keys work too.",
    order: 5,
    oneLiner: "Talk by looking at tiles on a phone. Gaze model on the NPU, no network permission.",
    headline: { value: "≈8", unit: "ms", label: "per inference, Hexagon NPU", status: "Observed" },
    skills: ["KOTLIN", "LITERT", "ML KIT", "COMPOSE", "TTS"],
  },
  {
    id: "alta",
    an: "AN-05",
    title: "Alta",
    block: "PROBE AFE",
    domain: "Hardware and firmware",
    context: "Cal Hacks 13.0 · 36 hours",
    role: "Hardware and firmware lead · team of 4",
    when: "Oct 2026",
    hook: "A voice lab TA that measures your breadboard and walks you to the fault.",
    problem:
      "In an intro electronics lab, one TA covers a room, and most students get stuck on the same few mistakes. Alta is the TA that is already at the bench. It doesn't guess from a photo. It asks the student to put a probe in a row, reads the real voltage, and teaches from that reading without handing over the answer.",
    built: [
      "Wrote the probe pod firmware in **bare-metal C on the ATmega328P**: interrupt-driven ADC, UART and timer drivers, no Arduino libraries.",
      "Each probe is sampled **about 1,200 times a second**. Every 50 ms the pod emits one JSON line of mean, min and max per probe, plus the measured supply voltage. The firmware also runs in simavr against the real server.",
      "Built the camera **board overlay engine** and the lab definitions. On the real board, Alta found and fixed the fault in **3 of 3 timed runs**.",
    ],
    specs: [
      { param: "Sample rate", value: "≈1,200 Hz", note: "per probe, 4 probes", status: "Stated" },
      { param: "Report interval", value: "50 ms", note: "one JSON line", status: "Repo" },
      { param: "Time to first word", value: "2.57 s", note: "median, after the talk button is released", status: "Measured" },
    ],
    stack: ["C", "avr-gcc", "ATmega328P", "simavr", "Python", "OpenCV", "Arduino Uno"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Alta" }],
    errata: [
      "The camera can't yet place highlights reliably on the board, so the automatic board watcher is off by default.",
      "It needs the internet for the language model and voice.",
      "Lab 2 passes simulated tests but hasn't been measured on real hardware.",
    ],
    figure: "Lab 1, ground wire missing. Move the yellow probe the way Alta asks, then fix the circuit.",
    order: 4,
    oneLiner: "Voice lab TA that reads real voltages off a breadboard and walks you to the fault.",
    headline: { value: "≈1,200", unit: "Hz", label: "per probe, bare-metal ADC", status: "Stated" },
    skills: ["C", "AVR", "OPENCV", "PYTHON"],
    // TODO(aadi): verify the 1,199-sample, 60 s soak in beat 3 and the 4.6 KB flash figure; neither is recorded in the Alta repo (firmware/bringup.py and firmware/sim/check_firmware.py run a 60 s soak and print the count but nothing is committed). 'About 1,200 reads a second' is README prose only, so it is tagged Stated.
    beats: [
      { title: "Probe the row.", body: "Alta asks the student to put a probe in a row. It doesn't guess from a photo; it reads the real voltage." },
      { title: "Sample fast, on the metal.", body: "The probe pod is bare-metal C on an ATmega328P: interrupt-driven ADC, UART and timer, no Arduino libraries. About 1,200 reads a second per probe, corrected against the measured supply voltage." },
      { title: "One line every 50 ms.", body: "The pod streams a JSON line with mean, min and max per probe. In a 60 s soak it sent 1,199 samples with zero bad lines." },
      { title: "Teach, don't tell.", body: "Alta talks the student toward the fault without handing over the answer, and the probe monitor confirms the fix on its own. 3 of 3 timed trials on the real board." },
    ],
  },
  {
    id: "apextracker",
    an: "AN-06",
    title: "ApexTracker",
    block: "RTC + NVM",
    domain: "Android",
    context: "Personal, in daily use",
    role: "Solo",
    when: "Jan 2026 →",
    hook: "One offline app that replaced my sticky notes, three reminder apps, a calendar and a spreadsheet.",
    problem:
      "I started it to build a habit: the habit of building. It became the app I open most. It tracks budget, study time, screen time, reminders, notes and a research-paper queue, then scores each day by the goals I actually hit. The rule for every feature is simple: would I open this every single day? If not, it doesn't ship.",
    built: [
      "Offline-first on Room with **SQLCipher encryption at rest** under an Android Keystore key, plus a biometric lock on budget and notes.",
      "**Five Glance home-screen widgets**, exact alarms that survive reboots, and on-device receipt scanning with ML Kit.",
      "Schema version 26 with **15 hand-written migrations**, about **525 unit tests**, lint, and Compose screenshot tests.",
    ],
    specs: [
      { param: "Unit tests", value: "≈525", note: "JUnit over logic extracted from ViewModels", status: "Repo" },
      { param: "Schema migrations", value: "15", note: "hand-written, no data loss", status: "Repo" },
      { param: "In daily use", value: "since Jan 2026", note: "the longest-running codebase", status: "Stated" },
    ],
    stack: ["Kotlin", "Jetpack Compose", "Room", "SQLCipher", "WorkManager", "Glance", "ML Kit", "Firebase"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Apex-Tracker" }],
    errata: [
      "The receipt parser passed every test and then read the street number from the shop's address. Text recognition returns labels and amounts as separate blocks. Lesson: it isn't done until it has run on a device.",
    ],
    figure: "A study session that crosses midnight. Two code paths banked the same time to different days, until they shared one.",
    order: 7,
    oneLiner: "The offline Android app that replaced my sticky notes, reminders, calendar and budget sheet.",
    headline: { value: "≈525", label: "unit tests, in daily use since Jan 2026", status: "Repo" },
    skills: ["KOTLIN", "COMPOSE", "SQL", "ML KIT"],
  },
  {
    id: "echo",
    an: "AN-07",
    title: "Echo",
    block: "BLE MESH PHY",
    domain: "Bluetooth LE",
    context: "Hack for Humanity 2026, Santa Clara University",
    role: "Team of 3",
    when: "Feb 2026",
    hook: "Emergency alerts that travel phone to phone when the network is down.",
    problem:
      "Emergency alerts depend on the same cellular and internet infrastructure that fails during the disasters they warn about. Echo carries National Weather Service alerts between nearby phones over Bluetooth Low Energy. Every phone both listens and broadcasts.",
    built: [
      "Bridged **native Kotlin and Swift GATT servers** into Flutter through platform channels, so one device is both central and peripheral.",
      "Built the **chunked, gzipped transfer protocol**: one characteristic selects a chunk index, another returns it. The receiver also accepts raw UTF-8 so it can read the Python senders.",
      "Built the Dart scanner and client, SQLite storage, the NWS feed, and a **Raspberry Pi relay** on BlueZ D-Bus with 9 passing tests.",
    ],
    specs: [
      { param: "Transport", value: "BLE GATT", note: "indexed chunks, gzip", status: "Repo" },
      { param: "Translation", value: "22 languages", note: "on-device, plus text-to-speech", status: "Repo" },
      { param: "Internet required", value: "none", note: "after the first device has the alert", status: "Repo" },
    ],
    stack: ["Flutter", "Dart", "Kotlin", "Swift", "BLE / GATT", "SQLite", "BlueZ", "Raspberry Pi"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Echo" }],
    errata: [
      "No recorded end-to-end hardware test and no automated multi-hop test.",
      "Continuous background relay is blocked by an advertisement metadata mismatch, documented in the README. The figure shows the intended path.",
    ],
    figure: "The tower is down. Click a phone to give it the alert and watch it hop, chunk by chunk.",
    order: 8,
    oneLiner: "Emergency alerts hop phone to phone over Bluetooth LE when the network is down.",
    headline: { value: "0", label: "internet needed after the first phone has the alert", status: "Repo" },
    skills: ["KOTLIN", "SWIFT", "FLUTTER", "BLE", "SQL", "LINUX"],
  },
  {
    id: "oss-scout",
    an: "AN-08",
    title: "OSS Scout",
    block: "INTERLOCK",
    domain: "Automation and security design",
    context: "Personal project",
    role: "Solo",
    when: "Sep–Oct 2026",
    hook: "An agent that prepares open-source fixes every night, and can't post a thing without my tap.",
    problem:
      "Maintainers are drowning in low-effort, machine-generated pull requests. The answer isn't to generate more of them faster. OSS Scout automates the tedious parts (search, triage, reading unfamiliar code) and leaves the trust-building parts to a person. The tap is the point: someone looked at the change and stands behind it.",
    built: [
      "A nightly scan in plain Python ranks issues by **how each project treats outside contributors**: merge rate, time to merge, time to first reply.",
      "An agent prepares **at most one tested draft fix a night** for a private dashboard behind Cloudflare Access, with an 8 am email.",
      "**Least privilege by construction**: a guard hook with 37 tests blocks every GitHub write from the agent, and the only write token lives where the agent never runs.",
    ],
    specs: [
      { param: "Write paths to GitHub", value: "1", note: "act.yml, started only by a tap", status: "Repo" },
      { param: "Tests", value: "≈280", note: "37 on the guard hook alone", status: "Repo" },
      { param: "Merged upstream", value: "Soup, fusioncore", note: "9.8k★ and 380★ projects", status: "Repo" },
    ],
    stack: ["Python", "GitHub Actions", "Claude Code hooks", "Cloudflare Workers", "Cloudflare Access", "pytest"],
    links: [
      { label: "GitHub", href: "https://github.com/aadityad12/oss-scout" },
      { label: "My contributions", href: OSS },
    ],
    errata: ["GitHub often starts the scheduled scan hours late, so the morning email can be quiet. Zero ready items is a normal night."],
    figure: "Two ways to reach GitHub. Only one of them has a switch, and you are holding it.",
    compact: true,
    order: 6,
    oneLiner: "Nightly agent that finds open-source work and can't post anything without my tap.",
    headline: { value: "2", label: "PRs merged upstream (9.8k★ and 380★ repos)", status: "Repo" },
    skills: ["PYTHON", "GH ACT", "LLM API"],
  },
  {
    id: "temper",
    an: "AN-09",
    title: "Temper",
    block: "EVAL UNIT",
    domain: "AI evaluation",
    context: "AI Engineer World's Fair Hackathon 2026",
    role: "Team of 3",
    when: "Jun 2026",
    hook: "Finds where an agent's own prompts and tools make it worse, then patches them.",
    problem:
      "An agent is more than its base model. Its system prompt, skills and tool definitions can help, or they can quietly make the same model worse. Temper asks the same questions with and without that harness and scores both across six dimensions. A negative delta isolates the harness as the cause.",
    built: [
      "Wrote the spec, API contract and **JSON Schemas**, then built both the local client and the **FastAPI service**, with Gemini judging against a bare DeepSeek baseline.",
      "Built the **patch loop**: it rewrites failing files and re-evaluates only those dimensions, streaming results to a dashboard over SSE.",
      "Wrote a deliberately flawed agent with an answer key, so the whole evaluate, patch, re-evaluate loop **runs offline with no API keys**.",
    ],
    specs: [
      { param: "Scoring dimensions", value: "6", note: "adherence, tools, format, skills, latency, recovery", status: "Repo" },
      { param: "Offline protocol test", value: "deterministic", note: "make test-integration", status: "Repo" },
    ],
    stack: ["Python", "FastAPI", "JSON Schema", "SSE", "Gemini", "DeepSeek", "React"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Temper" }],
    errata: [
      "The offline scores are fixture constants, not live measurements. The fixture is the achievement, not the score.",
      "Sessions are in memory with no expiry, and the coding benchmark runs submitted Python unsandboxed.",
    ],
    figure: "The protocol, one step at a time. Deltas are shown by sign only.",
    compact: true,
    order: 9,
    oneLiner: "Finds where an agent's own prompt, skills and tools make it worse, then patches them.",
    headline: { value: "6", label: "judged dimensions, offline-reproducible loop", status: "Repo" },
    skills: ["PYTHON", "FASTAPI", "REACT", "LLM API"],
  },
  {
    id: "clear-dispatch",
    an: "AN-10",
    title: "Clear Dispatch",
    block: "ARBITER",
    domain: "Real-time systems",
    context: "HackDavis 2026",
    role: "Backend · team of 3",
    when: "May 2026",
    hook: "Automation handles the volume of 911 calls. A human keeps the authority.",
    problem:
      "Where does automation belong in a system whose errors are measured in lives? This dispatch simulation lets automation triage and route, keeps every automated step overridable, and blocks heavy assets until a dispatcher confirms.",
    built: [
      "Built the whole backend: a **four-stage pipeline** (MONITOR, TRIAGE, RESOURCE, RELAY), the FastAPI routers, the WebSocket hub and the call simulator.",
      "MONITOR samples the last 60 s of calls every 5 s and switches to **Surge** above 10, then back once it subsides and 120 s have passed.",
      "Heavy assets emit **HOLD_REQUIRED** and wait up to 60 s for a human. A cancel or timeout returns the unit to the pool.",
    ],
    specs: [
      { param: "Surge threshold", value: "> 10 calls / 60 s", note: "sampled every 5 s", status: "Repo" },
      { param: "Heavy-asset hold", value: "60 s", note: "explicit confirmation", status: "Repo" },
    ],
    stack: ["Python", "FastAPI", "WebSockets", "React", "TypeScript", "Claude Haiku"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Clear-Dispatch" }],
    errata: ["Synthetic scenarios and in-memory state only. No test suite beyond a six-stage smoke script."],
    figure: "MONITOR's timing. Inject calls and watch the mode flip. Heavy assets wait for you.",
    compact: true,
    order: 10,
    oneLiner: "911 surge simulation: automation handles volume, a human keeps authority.",
    headline: { value: "60", unit: "s", label: "human hold before any heavy asset moves", status: "Repo" },
    skills: ["PYTHON", "FASTAPI", "REACT", "TS", "LLM API"],
  },
];

export const EXPERIENCE = [
  {
    when: "Apr 2026 to Jun 2026",
    where: "Cupertino, CA",
    role: "Research Intern and Technical Lead, VisionAssist",
    org: "Infineon Technologies, with De Anza College",
    points: [
      "Led software on a five-person team building an offline navigation aid for blind users on a Raspberry Pi 5, through the Infineon University Alliance.",
      "Built the on-device detection, distance, and speech pipeline, and deployed it as a service that boots headless on power-up.",
      "Characterized Infineon's 60 GHz radar, root-caused its phantom close-range readings to antenna leakage and floor reflections, and delivered the analysis to Infineon.",
      "Demoed the finished device to the sponsors at Infineon.",
    ],
    link: { label: "VisionAssist", href: "#visionassist" },
  },
  {
    when: "Aug 2026 to now",
    where: "San José, CA",
    role: "Teaching Assistant, ENGR 10: Introduction to Engineering",
    org: "San José State University",
    points: [
      "Invited back to TA the course one semester after taking it.",
      "Run two weekly lab sections of 30 students each, 6 contact hours a week, who solder IR receiver boards and build and program VEX robots in C++ and RobotC depending on the section.",
      "Debug student circuits and code live at the bench, and support CAD, fabrication, and power testing for the wind turbine project.",
    ],
  },
  {
    when: "Jan 2025 to Dec 2025",
    where: "Cupertino, CA",
    role: "Teaching Assistant and Computer Science Tutor",
    org: "De Anza College",
    points: [
      "TA for x86 assembly and computer architecture, and for both introductory C++ courses.",
      "Tutored C++, x86 assembly, Python, and data structures in the CS lab, tracing each bug back to its root cause with the student.",
    ],
  },
  {
    when: "Apr 2025 to Dec 2025",
    where: "Cupertino, CA",
    role: "Co-Founder and Co-President",
    org: "Applied Data Analytics Club, De Anza College",
    points: [
      "Started the campus's first applied-ML student group, grew it to 54 members, and built its workshop program on model evaluation and Python data pipelines from scratch.",
    ],
  },
];

export const EDUCATION = [
  {
    school: "San José State University",
    degree: "B.S. Computer Engineering, Minor in Artificial Intelligence",
    when: "Expected May 2028",
    note: "GPA 3.8 · Dean's Scholar",
    courses: "Computer Organization and Architecture, x86 Assembly, Algorithms and Data Structure Design, Software Engineering, AI and Data Engineering, Circuit Analysis",
  },
  {
    school: "De Anza College",
    degree: "Certificate of Achievement, Programming in C/C++, with Honors",
    when: "Mar 2026",
    note: "GPA 3.8 · Dean's List",
    courses: "Advanced C, Data Structures and Algorithms, Object-Oriented C++, x86 Assembly, Linear Algebra, Discrete Math, Calculus I to IV, Differential Equations",
  },
];

export const AWARDS = [
  { t: "Sponsor Track winner", d: "UC Berkeley AI Hackathon 2026 · Accordion" },
  { t: "2nd place", d: "DA Hacks 3.5 · ClassPath AI" },
  { t: "Top 10 at site", d: "ICPC 2025 Regionals, Division 2" },
  { t: "Most Valuable Peer", d: "HackStorm 2.0, May 2026" },
  { t: "Dean's Scholar", d: "San José State University" },
];

export const CERTS = [
  "AWS Certified Cloud Practitioner",
  "Oracle Cloud Infrastructure Generative AI Professional",
  "Anthropic: Model Context Protocol, Advanced Topics",
  "Anthropic: Introduction to Model Context Protocol",
  "Anthropic: Claude Code in Action",
  "AWS Certified AI Practitioner (in progress)",
];

export const OPEN_SOURCE = [
  {
    name: "Soup",
    repo: "MakazhanAlpamys/Soup",
    stars: "9.8k★",
    what: "LLM fine-tuning toolkit",
    pr: "Strip bidi controls and invisible separators from terminal output, so a dataset row can't reorder or hide what's displayed.",
    href: "https://github.com/MakazhanAlpamys/Soup/pull/1953",
  },
  {
    name: "fusioncore",
    repo: "manankharwar/fusioncore",
    stars: "380★",
    what: "ROS 2 localization for outdoor robots",
    pr: "Tests for the robot_localization config converter, and clear failures on empty or malformed input.",
    href: "https://github.com/manankharwar/fusioncore/pull/171",
  },
];

export const ABOUT = [
  "I'm from India, and I got into engineering through VEX robotics, programming robots in RobotC. It came full circle at SJSU: I wrote the control code for my team's robot in ENGR 10, posted the fastest run in the section, and was brought back the next semester to teach the course. I started out in computer science and switched to computer engineering to get closer to the hardware.",
  "Most of what I build starts with something I need or want to understand. ApexTracker began as a way to make myself code every day and ended up running my life. Rung started because I wanted numbers, not claims, for how interpreters get fast. I like work where I can measure the result, and I like being the person who traces a bug all the way down to its cause.",
  "Outside engineering I follow F1, basketball, soccer and cricket, and I go to Bay Area AI and ML meetups.",
];

export const ALSO = [
  { title: "ClassPath AI", tag: "2nd place · DA Hacks 3.5", text: "A transfer planner for community college students. I built its Rasa chatbot counselor.", href: "https://devpost.com/software/class-path-ai" },
  { title: "Beacon robot", tag: "Fastest run in section", text: "VEX robot control code as a three-state machine in RobotC. 14.41 s in SJSU ENGR 10.", href: "https://youtube.com/shorts/Y7p0N8BDqbQ" },
];

export const SKILLS = [
  { area: "Languages", items: ["C++", "C", "Python", "Kotlin", "TypeScript", "JavaScript", "SQL", "ARM64 assembly", "x86 assembly", "Dart", "Swift"] },
  { area: "Systems and hardware", items: ["Linux", "Linux (Ubuntu)", "Tailscale", "Raspberry Pi", "ATmega328P", "PSoC 6", "BLE / GATT", "Hexagon NPU", "systemd", "Soldering", "CAD", "3D printing"] },
  { area: "AI and ML", items: ["PyTorch", "YOLOv8", "OpenCV", "Hugging Face Transformers", "LiteRT", "ML Kit", "Claude API", "Claude Code"] },
  { area: "Infrastructure and testing", items: ["GitHub Actions", "Docker", "CMake", "Cloudflare Workers", "Firebase", "ASan / UBSan / TSan", "libFuzzer", "pytest", "JUnit"] },
  { area: "Frameworks", items: ["FastAPI", "Flask", "React", "Next.js", "SvelteKit", "Jetpack Compose", "Flutter", "Room", "three.js"] },
];

export const MORE = [
  {
    title: "Clear Dispatch",
    tag: "HackDavis 2026",
    text: "A wildfire-surge 911 dispatch simulation where automation handles the volume and a human keeps authority. I built the entire backend: a four-stage agent pipeline, the FastAPI routers, the WebSocket hub, and the call simulator.",
    href: "https://github.com/aadityad12/Clear-Dispatch",
    link: "GitHub",
  },
  {
    title: "Autonomous beacon robot",
    tag: "Fastest run in section",
    text: "A VEX robot that finds an infrared beacon, switches it off with its arm, then drags a second beacon out of the arena. I wrote all the control code as a three-state machine in RobotC. Fastest run in our SJSU ENGR 10 section: 14.41 s.",
    href: "https://youtube.com/shorts/Y7p0N8BDqbQ",
    link: "Watch the run",
  },
  {
    title: "ClassPath AI",
    tag: "2nd place · DA Hacks 3.5",
    text: "A transfer planner that turns ASSIST articulation data into a quarter-by-quarter plan for community college students. I built its Rasa chatbot counselor: NLU training data, custom actions, and JSON instructions for the backend.",
    href: "https://devpost.com/software/class-path-ai",
    link: "Devpost",
  },
  {
    title: "This site",
    tag: "Next.js",
    text: "A static Next.js export with a front page, one page per project, and the full datasheet. Every figure is hand-built SVG.",
    href: "https://github.com/aadityad12/aadityad.dev",
    link: "GitHub",
  },
];

// Derived, so the pin table and the project notes can never disagree.
export const PIN_USES = (name: string) => NOTES.filter((n) => n.skills.includes(name)).map((n) => n.id);
for (const p of PINS) p.uses = PIN_USES(p.name);

// Build-time check: every skill named on a project must be a pin.
for (const n of NOTES) for (const s of n.skills) if (!PINS.some((p) => p.name === s)) throw new Error(`Unknown skill ${s} on ${n.id}`);
