// Every fact on the page lives here. Sources: the master reference (revised Nov 11, 2026) and the
// project READMEs. Check any new claim against the master reference before adding it; where a README
// and the reference disagree on a measured number, the README wins.

export const RESUME = "/Aaditya_Desai_Portfolio_Resume.pdf";
export const EMAIL = "aaditya.d.desai@gmail.com";
export const GITHUB = "https://github.com/aadityad12";
export const LINKEDIN = "https://www.linkedin.com/in/aaditya-desai-12d";
export const DEVPOST = "https://devpost.com/aadityad12";
export const OSS = "https://oss.aadityad.dev";

export { ALTA } from "./alta";

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

// The front-page stage, in order: one artifact per flagship project, and a short tag for its row.
// Stills are 1600 x 1000, made from the photos and screenshots above (public/projects/stage/).
// Real material a project page shows that has no other home there.
export type StageMedia =
  | { kind: "video"; src: string; poster: string; alt: string }
  | { kind: "guard" };

// The plate is a two-ink drawing of the project's idea (public/projects/plates/<id>), with a short label set over its
// empty top-left corner. The media, where there is one, is shown on the project page under "From the build".
export type Plate = { big: string; line: string; alt: string };
export const STAGE: { id: string; tag: string; plate: Plate; media?: StageMedia }[] = [
  { id: "accordion", tag: "Hackathon winner, UC Berkeley", plate: { big: "Fold it, don't delete it.", line: "5 / 6 benchmark checkpoints, against 2 / 6 for naive compaction", alt: "A ribbon of blocks: the ones not needed are folded into tight pleats, and one red block lifts back out whole" }, media: { kind: "video", src: "/projects/stage/accordion-loop", poster: "/projects/stage/accordion-loop-poster.jpg", alt: "Accordion's desktop app folding a real agent session: coloured blocks for each message, tool call and result, with the token count falling as blocks fold" } },
  { id: "rung", tag: "Personal project, C++ and ARM64", plate: { big: "One language, five engines.", line: "From a tree-walker up to a hand-written ARM64 JIT, every step measured", alt: "Five rungs of a ladder, each a faster engine, the top red rung almost the full width" } },
  { id: "alta", tag: "Cal Hacks 13.0, 36 hours", plate: { big: "Put the probe in row 15.", line: "It reads the real voltage, then walks the student to the fault", alt: "A breadboard seen from above, with a probe on one row sending out red signal arcs" } },
  { id: "visionassist", tag: "Infineon, software lead", plate: { big: "Chair, two steps ahead.", line: "Spoken in steps, about 200 ms a frame, fully offline", alt: "A head wearing a small camera; dashed sight lines run over step marks to a chair held in a red bracket" } },
  { id: "oss-scout", tag: "Personal project, runs nightly", plate: { big: "Nothing posts without my tap.", line: "It drafts fixes overnight; one write path, behind a guard with 37 tests", alt: "A night machine pushes fix cards at a wall; the only way through is one red button under a fingertip" }, media: { kind: "guard" } },
  { id: "apextracker", tag: "In daily use since Jan 2026", plate: { big: "Four tools, one app.", line: "Fully offline, in daily use since Jan 2026", alt: "A sticky note, an alarm card, a calendar and a budget sheet converge into one phone showing a habit grid with one red square" } },
];

export type Headline = { value: string; unit?: string; label: string };
export type Beat = { title: string; body: string };

// Which kinds of internship a project is evidence for. "embedded" covers hardware, firmware and low-level
// work; "infra" covers DevOps, CI, deployment and security design.
export type Role = "software" | "embedded" | "ai" | "infra";

export type AppNote = {
  id: string;
  title: string;
  domain: string;
  context: string;
  role?: string;
  team?: string; // "Solo", or the team size and names
  award?: string; // placement or prize, only where there is one
  focus?: string; // one first-person sentence: the parts of the project that were mine
  roles: Role[]; // one to three, strongest first
  when: string;
  where: string;
  hook: string;
  problem: string;
  built: string[];
  specs: { param: string; value: string; note?: string }[];
  stack: string[];
  links: Link[];
  figure: string;
  oneLiner: string; // <= 90 chars, plain, for the front-page table
  headline: Headline; // the single number for the front-page table
  beats?: Beat[]; // 3 to 5 beats for the project page Reel
  order: number; // front-page sort order, 1 = first
};

// The hero. `lead` is also the page description; the hero component repeats it with a link on each phrase.
export const HERO = {
  who: "Computer engineering at San José State, looking for a Summer 2027 internship",
  lead: "I build things like tools that keep AI coding agents on track, a lab assistant that walks students to the fault in their circuit, and a wearable that tells a blind person what's ahead.",
};

export const NOTES: AppNote[] = [
  {
    id: "accordion",
    title: "Accordion",
    domain: "AI developer tools",
    context: "UC Berkeley AI Hackathon 2026",
    team: "Team of four: Tyler Darisme, Aaditya Desai, Sheel Shah, Thy Tang",
    award: "Sponsor Track winner (The Token Company), UC Berkeley AI Hackathon 2026",
    focus: "I built the conductor, the folding policy that decides what to hide and what to bring back, plus its health and evaluation layer and the conductor activity dashboard.",
    roles: ["ai", "software"],
    when: "since Jun 2026",
    where: "UC Berkeley AI Hackathon 2026 · Sponsor Track winner",
    hook: "Lets an AI coding agent forget without losing anything.",
    problem:
      "Agents get worse on long tasks because their context fills with material that no longer matters. Compaction flattens the session into one lossy summary, and sliding windows drop the oldest tokens. Accordion hides what isn't carrying weight, reversibly and inspectably: folding changes only what the agent sees, never what is stored, so anything can come back, and a protected tail is never folded. It is a pi extension plus a Tauri and SvelteKit desktop app, and it won the Sponsor Track (The Token Company) at the UC Berkeley AI Hackathon 2026. In November 2026 I started taking it in a new direction: independent of pi, with an algorithm-based conductor in place of a small model, weighing cost against performance as a replacement for /compact. It is the most technically demanding project I have worked on.",
    built: [
      "Built the **conductor**, Accordion's folding policy: a budget that persists across reconnects, a self-calibrating fold target that holds context in a 0.60 to 0.92 band, and a **three-stage relevance pipeline** (keyword scoring, bi-encoder retrieval, cross-encoder rerank) on the unfold shortlist.",
      "Built the **health and evaluation layer**: health metrics with tests, a folding evaluator, a session evaluator, and a harness that compares against naive compaction. With the Thermocline conductor, Accordion reached 5 of 6 SlopCodeBench checkpoints against 2 of 6.",
      "Built the **conductor activity dashboard**: health verdict, needed-fold rate, calibration events, fact ledger, relevance table of contents, and a per-decision view of everything the conductor did.",
      "Ported the conductor onto Accordion's fold, replace and group command contract (PRs #68 and #71), with retention telemetry, query-aware extractive trim and a fact ledger.",
    ],
    specs: [
      { param: "SlopCodeBench @ 100K tokens", value: "5 / 6 vs 2 / 6", note: "83.3% vs 33.3% for naive compaction, DeepSeek V4 Pro" },
      { param: "GitHub stars, team repo", value: "240+", note: "a-Fig/accordion" },
      { param: "Site visits, get-accordion.dev", value: "10,000+", note: "passed in Oct 2026" },
      { param: "npm package", value: "Published", note: "@a-fig/accordion" },
    ],
    stack: ["TypeScript", "Hugging Face Transformers", "SvelteKit", "Tauri", "Node.js", "WebSockets", "Vitest"],
    links: [
      { label: "get-accordion.dev", href: "https://get-accordion.dev" },
      { label: "GitHub", href: "https://github.com/a-Fig/accordion" },
      { label: "npm @a-fig/accordion", href: "https://www.npmjs.com/package/@a-fig/accordion" },
    ],
    figure: "Context map of a simulated agent session. Click a block to fold it, or run the conductor against the budget.",
    order: 2,
    oneLiner: "Context manager for AI coding agents: folds what isn't carrying weight, reversibly.",
    headline: { value: "240+", unit: "★", label: "GitHub stars, team repo" },
    beats: [
      { title: "A session fills up.", body: "A long coding-agent session is a stream of blocks: user turns, replies, thinking, tool calls, tool results. The window has a budget. The usual fix flattens it into one lossy summary." },
      { title: "Fold, don't delete.", body: "Accordion hides blocks that aren't carrying weight. Folding changes only what the agent sees, never what is stored, so anything can come back. A protected tail is never folded." },
      { title: "Decide what to bring back.", body: "When the agent needs something folded, the unfold shortlist goes through three stages: keyword scoring, bi-encoder retrieval, and a cross-encoder rerank (ms-marco MiniLM). A self-calibrating target holds context between 0.60 and 0.92 of the budget." },
      { title: "Measure whether it helped.", body: "The health layer scores every session: metrics, a folding evaluator, a session evaluator, and a harness against naive compaction. On SlopCodeBench at a 100K budget, Accordion reached 5 of 6 checkpoints (83.3%) against 2 of 6 (33.3%)." },
    ],
  },
  {
    id: "rung",
    title: "Rung",
    domain: "Compilers and runtimes",
    context: "Personal project",
        roles: ["software", "embedded"],
    when: "Sep to Oct 2026",
    where: "Personal project · Sep to Oct 2026",
    hook: "A programming language I built five ways, to measure what really makes code run fast.",
    problem:
      "How much is each classic interpreter optimization actually worth? Every explanation of how Python, Lua or JavaScript get fast lists the same techniques, so I built each one myself and measured it. One small language, built five ways: a tree-walker, a stack VM, a register VM, a baseline ARM64 JIT and a JIT that compiles on a background thread. All five share one runtime and garbage collector, and every engine must print byte-identical output. The benchmark ladder adds one change per rung and measures only what that change buys.",
    built: [
      "Hand-wrote the **ARM64 instruction encoder**, verified byte for byte against LLVM's assembler, with no codegen library. When a type check fails, the JIT **bails out mid-function and resumes in the VM**, even four calls deep.",
      "Built a **background compiler** that hands code off with release/acquire ordering, checked under TSan. On the warmup benchmark it cut p99 from 0.89 ms to 0.28 ms.",
      "Tested it in five layers: a conformance suite on every engine, **ASan, UBSan and TSan** builds, a **libFuzzer** harness, and CI on macOS ARM64, Linux ARM64 and Linux x86-64, including a 60 s fuzz job.",
      "Found a JIT crash in about 5% of Linux ARM64 runs by looping the test 300 to 600 times in CI. UBSan reads 8 bytes before an indirect-call target; 16 zero bytes before the code fixed it.",
    ],
    specs: [
      { param: "fib, JIT vs. tree-walker", value: "38.84×", note: "median per call, Apple M1 Pro" },
      { param: "loop_sum, JIT vs. tree-walker", value: "22.38×", note: "the JIT compiles functions in fib and loop_sum" },
      { param: "fib, JIT vs. register VM", value: "4.54×", note: "13.37 ms to 2.94 ms, same session" },
      { param: "Stack VM vs. tree-walker", value: "1.30× to 4.99×", note: "across six benchmarks" },
    ],
    stack: ["C++20", "ARM64", "CMake", "Ninja", "Clang", "libFuzzer", "ASan / UBSan / TSan", "Docker", "GitHub Actions"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/rung" }],
    figure: "Speedup over the tree-walker, rung by rung. Real measurements from the repo's results tables.",
    order: 3,
    oneLiner: "One small language built five ways, down to a hand-written ARM64 JIT, every speed-up measured.",
    headline: { value: "38.84×", label: "JIT vs. tree-walker, fib" },
    beats: [
      { title: "One language, five engines.", body: "32-bit ints, floats, strings, arrays, closures. Small enough to build five times: tree-walker, stack VM, register VM, baseline ARM64 JIT, background JIT. All five must print byte-identical output." },
      { title: "Bytecode beats walking the tree.", body: "The stack VM runs 1.30× to 4.99× faster than the tree-walker across six benchmarks. Computed-goto dispatch adds up to another 1.81× on sieve." },
      { title: "Fewer instructions, same work.", body: "The register VM does sieve's work in a third of the stack VM's instructions. Superinstructions cut strcat's dispatched instructions by 36.5%, and inline caching for globals gave fib 1.46×." },
      { title: "A rung that measured slower.", body: "NaN-boxing halved value size, 16 to 8 bytes, and heap allocation, about 192 MB to 96 MB per process. Sieve still ran at 0.63× the rung below. I kept the result in the table." },
      { title: "Native code, with an exit.", body: "The JIT hand-encodes ARM64, checked byte for byte against LLVM's assembler. When a type check fails mid-function it bails out and resumes in the VM. fib runs 38.84× faster than the tree-walker and 4.54× faster than the register VM." },
    ],
  },
  {
    id: "visionassist",
    title: "VisionAssist",
    domain: "Embedded vision",
    context: "Infineon Technologies, with De Anza College",
    role: "Software lead",
    team: "Team of five, supervised by Prof. Saied Rafati",
    focus: "As software lead I owned the vision pipeline, distance estimation, audio output and the web layer.",
    roles: ["embedded", "ai", "software"],
    when: "Apr to Jun 2026",
    where: "Infineon Technologies · software lead · Apr to Jun 2026",
    hook: "Tells someone walking without sight what is ahead, and how many steps away.",
    problem:
      "A person walking down a sidewalk without sight can't wait for a network, and any round trip adds delay to a collision warning. So everything runs on a head-mounted Raspberry Pi 5: one process, one loop, about five frames a second, with no phone, cloud or internet. That requirement drove the model choice, the distance method, the speech engine, and the camera-only design I chose after evaluating Infineon's 60 GHz radar. It was built through De Anza's ENGR 77 with the Infineon University Alliance, and the finished device was demoed to the Infineon sponsors.",
    built: [
      "Built the whole on-device pipeline: camera capture, **YOLOv8n at about 200 ms a frame** on the Pi 5 CPU, monocular distance from bounding-box height, and risk-ranked speech **in feet and steps** (2.5 ft per step) to Bluetooth earbuds.",
      "Evaluated Infineon's **60 GHz radar** on the PSoC 6 AI Kit, traced its close-range readings to antenna leakage and floor reflections, and delivered the write-up to Infineon.",
      "Deployed it as a **headless systemd service** that boots on power-up, with an annotated MJPEG stream and a phone web app as a second output path.",
    ],
    specs: [
      { param: "Detection latency", value: "≈200 ms / frame", note: "YOLOv8n, PyTorch CPU, about 5 FPS end to end" },
      { param: "Distance model", value: "d = H·f / h", note: "27 class heights, f = 900 px" },
      { param: "Warning zones", value: "9 ft / 6 ft", note: "caution, then \"stop\" under 6 ft" },
      { param: "Announcements per frame", value: "1", note: "highest risk tier, then nearest" },
    ],
    stack: ["Python", "PyTorch", "YOLOv8", "OpenCV", "Picamera2", "Flask", "Piper TTS", "systemd", "Raspberry Pi 5"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Vision-Assist" }],
    figure: "Drag the obstacles. The pipeline estimates distance from box height, ranks by risk, and announces one thing.",
    order: 1,
    oneLiner: "Head-mounted Pi 5 that spots obstacles and says how many steps away, fully offline.",
    headline: { value: "≈200", unit: "ms / frame", label: "YOLOv8n on the Pi 5 CPU" },
    beats: [
      { title: "See.", body: "An Arducam on a head mount feeds 1280×720 frames to one Python process on the Raspberry Pi 5, about five frames a second. Nothing leaves the device." },
      { title: "Detect.", body: "YOLOv8n runs on the Pi's CPU at about 200 ms per frame, with a 0.45 confidence floor and a blocklist for classes that don't matter on a sidewalk." },
      { title: "Measure.", body: "Distance comes from box height: real height × focal length ÷ pixels. 27 hand-set class heights, focal length tuned from a theoretical 1435 px to 900 px. I rejected ground-plane projection because head tilt varies by about ±15°." },
      { title: "Choose one thing to say.", body: "Objects are ranked by risk tier, then distance. Only the single riskiest, closest one is announced, in feet and steps, and only when it changes or after a 3 s cooldown." },
      { title: "Speak.", body: "Piper TTS on-device, through Bluetooth earbuds, as a systemd service that boots headless. I evaluated Infineon's 60 GHz radar for weeks and sent the analysis to Infineon." },
    ],
  },
  {
    id: "gazeboard",
    title: "GazeBoard",
    domain: "On-device ML",
    context: "Qualcomm × Google LiteRT Developer Hackathon",
    team: "Team of three: Aaditya Desai, Sheel Shah, Nishanth Nagesh",
    focus: "I built the NPU inference path, the debug overlay, recalibration, the spelling vocabulary, the build fixes and the documentation.",
    roles: ["ai", "embedded", "software"],
    when: "Apr to May 2026",
    where: "Qualcomm × Google LiteRT Hackathon · Apr 30 to May 1, 2026",
    hook: "Lets someone who can't speak or use their hands talk by looking at a phone.",
    problem:
      "The camera points at a disabled person's face the whole time, so running on-device was a privacy requirement, not an optimization. The app declares camera permission and nothing else: no internet permission, no network client, no analytics. The front camera finds the eye, a 96×160 grayscale crop of the left eye goes to Qualcomm's EyeGaze model on the Hexagon NPU, and a one-second look picks a phrase or a letter group.",
    built: [
      "Built the inference path: EyeGaze running **only on the Hexagon NPU** through LiteRT's CompiledModel, at **about 8 ms per inference and 15+ FPS** on a Galaxy S25 Ultra. A load failure shows an error screen instead of switching accelerators.",
      "Shipped the NPU runtime as **seven Qualcomm v79 libraries in an Android dynamic feature** targeted at the Snapdragon SM8750, so other phones never download it.",
      "Built the **four-corner calibration** (four 1.5 s samples set per-user pitch and yaw thresholds), the recalibration flow, and a debug overlay showing frame rate, model time, raw pitch and yaw.",
      "Built spelling mode: four gaze directions map to A-G, H-M, N-S and T-Z, and a **378-word list** is filtered by gesture prefix to show up to three candidates.",
    ],
    specs: [
      { param: "Inference", value: "≈8 ms", note: "15+ FPS, Galaxy S25 Ultra, read from the debug overlay" },
      { param: "Dwell / cooldown", value: "1 s / 500 ms", note: "per selection" },
      { param: "Network permissions", value: "0", note: "camera only" },
      { param: "Spelling vocabulary", value: "378 words", note: "deterministic, on-device" },
    ],
    stack: ["Kotlin", "Jetpack Compose", "CameraX", "ML Kit", "LiteRT", "Hexagon NPU"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/GazeBoard" }],
    figure: "Your pointer stands in for gaze. Hold it on a quadrant for one second to select. Arrow keys work too.",
    order: 6,
    oneLiner: "Talk by looking at tiles on a phone. Gaze model on the NPU, no network permission.",
    headline: { value: "≈8", unit: "ms", label: "per inference, Hexagon NPU" },
  },
  {
    id: "alta",
    title: "Alta",
    domain: "Hardware and firmware",
    context: "Cal Hacks 13.0 · 36 hours",
    team: "Team of four: Aaditya Desai, Oak Soe Khant, Thy Tang, A Zin Kyaw",
    focus: "I built the probe pod, hardware and bare-metal firmware, plus the lab definitions, the probe monitor and the camera overlay engine.",
    roles: ["embedded", "ai", "software"],
    when: "Oct 2026",
    where: "Cal Hacks 13.0 · probe pod and firmware · Oct 24 to 25, 2026",
    hook: "A voice TA for the stuck student: it reads real voltages and walks them to the fault.",
    problem:
      "In an intro electronics lab, one TA covers a room, and most students get stuck on the same few mistakes: an LED in backwards, a resistor with the wrong bands, a ground wire that never reached the rail. A student waits ten minutes for a TA who finds it in thirty seconds, often by fixing it for them. Alta is the TA already at the bench. A probe pod measures the student's breadboard, an AI agent talks with them by voice, and Alta teaches from a real voltage reading, with hints instead of the answer. It comes from my own work as a TA for ENGR 10 lab sections, and we built it in 36 hours at Cal Hacks 13.0.",
    built: [
      "Wrote the probe pod firmware in **bare-metal C on the ATmega328P**, no Arduino libraries: interrupt-driven ADC, UART and timer drivers. It samples each probe about 1,200 times a second and sends one JSON line every 50 ms.",
      "Tested the firmware in the simavr simulator against the server's real serial bridge: **25 checks plus a 60 s soak**, button latency of about 19 ms, and a bouncy press giving exactly one down and one up.",
      "Built the **probe monitor** and the labs as data. When a reading holds steady for 500 ms or jumps into range, the agent speaks with no button press. Each lab is one lab.yaml of parts, holes, expected voltages and hint ladders.",
      "Built the camera **overlay engine**: corner calibration and a homography map camera pixels to breadboard holes, and it draws highlights and annotated frames, with tests.",
    ],
    specs: [
      { param: "Real-board runs", value: "3 / 3", note: "fault found and fixed, 110 s to 322 s, no errors" },
      { param: "Time to first speech", value: "2.57 s", note: "median from releasing the talk button; transcript 0.55 s" },
      { param: "Simulated runs naming the right fault", value: "42 / 42", note: "7 faults, 3 runs each, graded by a second model" },
      { param: "Server tests", value: "195", note: "pytest" },
    ],
    stack: ["C", "avr-gcc", "ATmega328P", "simavr", "Arduino Uno", "Python", "FastAPI", "Claude Opus 5.5", "Cartesia", "React"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Alta" }],
    figure: "Lab 1, ground wire missing. Move the yellow probe the way Alta asks, then fix the circuit.",
    order: 4,
    oneLiner: "Voice lab TA that reads real voltages off a breadboard and walks you to the fault.",
    headline: { value: "3 / 3", label: "real-board runs found and fixed the fault" },
    beats: [
      { title: "Probe the row.", body: "Alta asks the student to put a probe in a row. It doesn't guess from a photo; it reads the real voltage." },
      { title: "Sample fast, on the metal.", body: "The probe pod is bare-metal C on an ATmega328P: interrupt-driven ADC, UART and timer, no Arduino libraries. About 1,200 reads a second per probe, with the supply voltage measured against the internal 1.1 V bandgap." },
      { title: "One line every 50 ms.", body: "The pod streams a JSON line with mean, min and max per probe in millivolts, the supply voltage and the button state. make check runs the real firmware in simavr against the server's real serial bridge: 25 checks and a 60 s soak." },
      { title: "Teach, don't tell.", body: "Alta talks the student toward the fault without handing over the answer, and the probe monitor confirms the fix on its own. On the real board it fixed all 3 of 3 timed faults, starting to speak a median 2.57 s after the talk button was released." },
    ],
  },
  {
    id: "sisyphus",
    title: "Sisyphus",
    domain: "AI agents",
    context: "AIE Code Summit 2026 Hackathon",
    team: "Team of four: Aaditya Desai, Tyler Darisme, Harish Thanigaivel, Thy Tang",
    award: "Top 6 finalist, AIE Code Summit 2026 Hackathon",
    focus: "I built the Reviewer and Auditor agents: the Reviewer that approves a clip or sends it back with reasons, and the Auditor that turns failures into tested changes.",
    roles: ["ai", "software"],
    when: "Nov 2026",
    where: "AIE Code Summit 2026 Hackathon · top 6 finalist · Nov 7, 2026",
    hook: "A video editor whose agents fix their own failures, and keep a fix only if it wins.",
    problem:
      "Sisyphus is a self-improving video editing system, built at the AIE Code Summit 2026 Hackathon (Cerebral Valley, Shack15, San Francisco) for the track \"The System That Gets Better\". Failures become versioned changes to the agents' skills and tools, and a change is kept only if it proves itself on held-out work. It is a desktop app with three agents: a Creator that makes and edits short-form videos, a Reviewer that approves them or sends them back, and an Auditor that improves the other two. The team was selected as a top 6 finalist.",
    built: [
      "Built the **Auditor**: it turns failures into versioned changes to the agents' skills, tools and software, tests each in a **shadow A/B on held-out footage**, and merges its git branch or rolls it back, without overreacting to one failure.",
      "Built the **Reviewer**: it approves a video or sends it back with reasons, and a rejected clip returns to the Creator with those reasons and the rejected plan, up to three attempts.",
      "Closed the loop with people: users leave feedback in the app, a Rejected tab shows every clip the Reviewer sent back, and a rejected clip a human liked counts as a Reviewer failure.",
      "Moved transcription to **whisper.cpp** with a pre-warm script, since faster-whisper has no Mac GPU backend: a 15-minute talk in **47 s on an M3, against 282 s** on the CPU.",
    ],
    specs: [
      { param: "Transcription, 15-minute talk", value: "47 s vs 282 s", note: "whisper.cpp on an M3 vs faster-whisper on the CPU" },
      { param: "Reviewer retries", value: "up to 3", note: "rejected clips return to the Creator with reasons" },
      { param: "Parallel jobs", value: "6 by default", note: "adjustable live" },
    ],
    stack: ["Python", "uv", "pytest", "faster-whisper", "whisper.cpp", "ffmpeg", "SQLite", "TypeScript", "React", "Tauri", "Meta Model API"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Sisyphus" }],
    figure: "",
    order: 5,
    oneLiner: "A video editor that improves itself: changes ship only if they win on held-out footage.",
    headline: { value: "47", unit: "s", label: "to transcribe a 15-minute talk on an M3, vs 282 s" },
  },
  {
    id: "oss-scout",
    title: "OSS Scout",
    domain: "Automation and security design",
    context: "Personal project, in daily use",
        roles: ["infra", "ai", "software"],
    when: "Sep to Oct 2026",
    where: "Personal project · Sep to Oct 2026",
    hook: "An agent that prepares open-source fixes every night, and can't post a thing without my tap.",
    problem:
      "Maintainers are drowning in low-effort, machine-generated pull requests. The answer isn't to generate more of them faster. OSS Scout automates the tedious parts (search, triage, reading unfamiliar code) and leaves the trust-building parts to a person: deciding, reading the change, defending it in review, following through. Nothing is posted without my one tap, because someone looked at the change and stands behind it.",
    built: [
      "**Least privilege by construction**: a Claude Code guard hook with 37 tests blocks every GitHub write from the unattended agent, and the only write token lives in a private repo's secrets where the agent never runs.",
      "A nightly scan in plain Python ranks issues by **how each project treats outside contributors**, scored from its last 300 closed outside PRs: merge rate, time to merge, time to first maintainer reply.",
      "A Claude cloud routine prepares **at most one tested draft fix a night**, plus up to two briefings, for a private dashboard behind Cloudflare Access, with an 8 am email.",
      "Treats text from strangers as data: the dashboard escapes and sanitises it, and the Worker re-validates the Access token, rejects cross-site requests, and accepts only a fixed list of actions.",
    ],
    specs: [
      { param: "Write paths to GitHub", value: "1", note: "act.yml, started only by a tap" },
      { param: "Tests", value: "≈278", note: "pytest and Node tests, counted Oct 2026" },
      { param: "Guard hook tests", value: "37", note: "every GitHub write blocked" },
    ],
    stack: ["Python", "GitHub Actions", "Claude Code hooks", "Cloudflare Workers", "Cloudflare Access", "Resend", "pytest"],
    links: [
      { label: "GitHub", href: "https://github.com/aadityad12/oss-scout" },
      { label: "My contributions", href: OSS },
    ],
    figure: "Two ways to reach GitHub. Only one of them has a switch, and you are holding it.",
    order: 7,
    oneLiner: "Nightly agent that finds open-source work and can't post anything without my tap.",
    headline: { value: "1", label: "write path to GitHub, started only by my tap" },
  },
  {
    id: "apextracker",
    title: "ApexTracker",
    domain: "Android",
    context: "Personal project, in daily use",
        roles: ["software", "infra"],
    when: "since Jan 2026",
    where: "Personal · in daily use since Jan 2026",
    hook: "One offline app that replaced my sticky notes, reminder apps, calendar and budget sheets.",
    problem:
      "I started it as a deliberately ordinary project, to build the habit of building. It became the app I open most. It tracks budget, study time, screen time, reminders, notes and a research-paper queue, then scores each day by the goals I actually hit, some of them evaluated automatically from the other trackers. The rule for every feature is simple: would I open this every single day? If not, it doesn't ship.",
    built: [
      "Offline-first on Room with **SQLCipher encryption at rest** under an Android Keystore key, and a biometric lock on Budget and Notes, with the bypasses found and closed.",
      "**Five Glance home-screen widgets**, exact alarms that survive reboots, and on-device receipt scanning with ML Kit through the photo picker, so it needs no camera permission and uploads nothing.",
      "Schema version 26 with **15 hand-written migrations**, about **525 unit tests** across 61 test files, and Compose screenshot tests over logic extracted from the ViewModels.",
      "Optional sync through Firebase Auth and Firestore with App Check, and the app builds and runs fully offline with no Firebase config.",
    ],
    specs: [
      { param: "Unit tests", value: "≈525", note: "61 test files, counted Oct 2026" },
      { param: "Schema migrations", value: "15", note: "hand-written, schema version 26" },
      { param: "In daily use", value: "since Jan 2026", note: "I open it every day" },
    ],
    stack: ["Kotlin", "Jetpack Compose", "Room", "SQLCipher", "WorkManager", "Glance", "ML Kit", "Firebase"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Apex-Tracker" }],
    figure: "A study session that crosses midnight. Two code paths banked the same time to different days, until they shared one.",
    order: 8,
    oneLiner: "The offline Android app that replaced my sticky notes, reminders, calendar and budget sheet.",
    headline: { value: "≈525", label: "unit tests, in daily use since Jan 2026" },
  },
  {
    id: "echo",
    title: "Echo",
    domain: "Bluetooth LE",
    context: "Hack for Humanity 2026, Santa Clara University",
    team: "Team of three: Aaditya Desai, Sheel Shah, Oak Soe Khant",
    focus: "I ported the project from native Kotlin to Flutter and built the BLE transport and chunking protocol, storage, the NWS feed, the background service, the Raspberry Pi relay and the documentation.",
    roles: ["embedded", "software"],
    when: "Feb to Mar 2026",
    where: "Hack for Humanity 2026 · Feb 28 to Mar 1, 2026",
    hook: "Alerts that hop phone to phone through a neighborhood with no signal.",
    problem:
      "Emergency alerts depend on the same cellular and internet infrastructure that fails during the disasters they warn about. Echo carries National Weather Service alerts between nearby phones over Bluetooth Low Energy, with proximity in place of servers. Every phone both listens and broadcasts. We submitted it on Devpost as RE3, \"Alert. Relay. Repeat.\"",
    built: [
      "Ported the app from native Kotlin to Flutter during the event, bridging **native Kotlin and Swift GATT servers** through platform channels so each phone is both BLE central and peripheral.",
      "Built the **chunked, gzipped transfer protocol**: one characteristic selects a chunk index, another returns it, and the receiver accepts gzip or raw UTF-8 so it reads the Python senders. Multi-hop relay increments a hop count, with compact alert IDs preventing loops.",
      "Built the background service (IPC asks the main engine to restart advertising), the NWS GeoJSON feed with a severity filter, SQLite storage, and on-device translation into **22 languages**.",
      "Built a **Raspberry Pi relay** on BlueZ D-Bus with 9 passing unit tests, a desktop relay for macOS and Windows on bless, and a Streamlit UI.",
    ],
    specs: [
      { param: "Transport", value: "BLE GATT", note: "indexed chunks, gzip" },
      { param: "Translation", value: "22 languages", note: "on-device, plus text-to-speech" },
      { param: "Pi relay tests", value: "9 passing", note: "alert model, metadata packing, chunk framing" },
      { param: "Internet required", value: "none", note: "after the first device has the alert" },
    ],
    stack: ["Flutter", "Dart", "Kotlin", "Swift", "BLE / GATT", "SQLite", "BlueZ", "Raspberry Pi"],
    links: [
      { label: "GitHub", href: "https://github.com/aadityad12/Echo" },
      { label: "Devpost", href: "https://devpost.com/software/re3-x6kj0r" },
    ],
    figure: "The tower is down. Click a phone to give it the alert and watch it hop, chunk by chunk.",
    order: 9,
    oneLiner: "Emergency alerts hop phone to phone over Bluetooth LE when the network is down.",
    headline: { value: "0", label: "internet needed after the first phone has the alert" },
  },
  {
    id: "temper",
    title: "Temper",
    domain: "AI evaluation",
    context: "AI Engineer World's Fair Hackathon 2026",
    team: "Team of three: Aaditya Desai, Sheel Shah, Oak Soe Khant",
    focus: "I wrote the spec and API contract and built the local layer, the cloud evaluation service, the patch loop, the pi extension, the integration test and the documentation.",
    roles: ["ai", "software"],
    when: "Jun 2026",
    where: "AI Engineer World's Fair Hackathon 2026 · Jun 27 to 28, 2026",
    hook: "Finds where an agent's own prompts and tools make it worse, then patches them.",
    problem:
      "An agent is more than its base model. Its system prompt, skills and tool definitions can help, or they can quietly make the same model worse. Temper asks the same questions with and without that harness and has Gemini judge each pair across six dimensions. A negative delta isolates the harness as the cause. It was built for the Self-Improvement Stack track.",
    built: [
      "Wrote the spec, API contract and **Draft 7 JSON Schema**, then built the local layer that bundles system_prompt.md, skills and tools, and the **FastAPI service** that generates questions and runs a bare DeepSeek baseline.",
      "Built the **patch loop**: it returns complete replacement files for each failing dimension, requests a dimension-scoped re-evaluation, and renders before and after.",
      "Built both clients: a Python CLI with Rich reports, and a **pi extension** (/patch command, temper_reeval tool) with a React dashboard streaming per-question updates over SSE.",
      "Wrote a deliberately flawed customer-support agent with an answer key, so evaluate, patch and re-evaluate **run offline with no API keys**. make test-integration covers 12 initial questions and three patch artifacts.",
    ],
    specs: [
      { param: "Scoring dimensions", value: "6", note: "adherence, tools, format, skills, latency, recovery" },
      { param: "Integration test", value: "12 questions", note: "three patch artifacts, four dimensions re-evaluated with eight questions" },
      { param: "Offline mode", value: "no API keys", note: "deterministic, make test-integration" },
    ],
    stack: ["Python", "FastAPI", "JSON Schema", "SSE", "Gemini", "DeepSeek", "React"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Temper" }],
    figure: "The protocol, one step at a time. Deltas are shown by sign only.",
    order: 10,
    oneLiner: "Finds where an agent's own prompt, skills and tools make it worse, then patches them.",
    headline: { value: "6", label: "judged dimensions, offline-reproducible loop" },
  },
  {
    id: "clear-dispatch",
    title: "Clear Dispatch",
    domain: "Real-time systems",
    context: "HackDavis 2026",
    role: "Backend",
    team: "Team of three: Aaditya Desai, Sheel Shah, Harish Thanigaivel",
    focus: "I built the entire backend (four pipeline agents, FastAPI routers, WebSocket hub, call simulator, unit and vulnerability data), the ElevenLabs surge-call flow and SOS voice page, the map features and the README.",
    roles: ["software", "ai"],
    when: "May 2026",
    where: "HackDavis 2026 · backend · May 9 to 10, 2026",
    hook: "A wildfire floods 911. Automation handles the volume; a dispatcher keeps authority.",
    problem:
      "Where does automation belong in a system whose errors are measured in lives? This wildfire-surge dispatch simulation, built on Park Fire scenario data, lets automation classify synthetic 911 calls and assign response units, keeps every automated step overridable, and blocks heavy assets until a dispatcher confirms. A live dashboard shows the state as it changes.",
    built: [
      "Built the whole backend: a **four-stage pipeline** (MONITOR, TRIAGE, RESOURCE, RELAY), the FastAPI routers, the WebSocket hub, the call simulator, and the unit and vulnerability data.",
      "MONITOR samples the last 60 s of calls every 5 s and switches from Assisted to **Surge** above a threshold, then back once load subsides and 120 s have passed. TRIAGE uses Claude Haiku for structured JSON, with a deterministic fallback.",
      "RESOURCE ranks 20 unit fixtures by Haversine distance. Air tankers, heavy rescue and hazmat emit **HOLD_REQUIRED** and wait up to 60 s for a human; a cancel or timeout returns the unit to the pool.",
      "Built the ElevenLabs surge-call flow and an SOS voice page with a QR code, and the map features on a Leaflet mission-control dashboard fed by typed JSON events over one WebSocket.",
    ],
    specs: [
      { param: "Call window", value: "60 s", note: "sampled every 5 s" },
      { param: "Heavy-asset hold", value: "60 s", note: "explicit confirmation" },
      { param: "Relay briefing", value: "< 25 words", note: "optionally voiced through ElevenLabs" },
    ],
    stack: ["Python", "FastAPI", "WebSockets", "React", "TypeScript", "Leaflet", "Claude Haiku", "ElevenLabs"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Clear-Dispatch" }],
    figure: "MONITOR's timing. Inject calls and watch the mode flip. Heavy assets wait for you.",
    order: 11,
    oneLiner: "911 surge simulation: automation handles volume, a human keeps authority.",
    headline: { value: "60", unit: "s", label: "human hold before any heavy asset moves" },
  },
];

export const EXPERIENCE = [
  {
    when: "Aug 2026 to now",
    where: "San José, CA",
    role: "Teaching Assistant, ENGR 10: Introduction to Engineering",
    org: "San José State University",
    points: [
      "Brought back to TA the course one semester after taking it, recommended by Prof. Saied Rafati.",
      "Run two weekly lab sections of 30 students each, 6 contact hours a week.",
      "Guide student teams through soldering an IR receiver board, building a VEX robot chassis and arm from scratch, and programming the controller in RobotC or C++ so the robot finds and acts on infrared beacons.",
      "Debug student circuits and code live at the bench, and support CAD design, fabrication and power and efficiency testing for the wind turbine project.",
    ],
  },
  {
    when: "Apr 2026 to Jun 2026",
    where: "Cupertino, CA",
    role: "Research Intern and Technical Lead, VisionAssist",
    org: "Infineon Technologies, with De Anza College",
    points: [
      "Software lead for a team of five building an offline navigation aid on a Raspberry Pi 5, through the Infineon University Alliance and De Anza's ENGR 77, supervised by Prof. Saied Rafati.",
      "Built the on-device pipeline: camera capture, YOLOv8n detection at about 200 ms a frame, monocular distance estimation, risk-ranked announcements, and offline speech to Bluetooth earbuds.",
      "Evaluated Infineon's 60 GHz radar (BGT60TR13C on the PSoC 6 AI Kit), root-caused its close-range readings to antenna leakage and floor reflections, and wrote up the findings for Infineon.",
      "Deployed it as a headless systemd service that boots on power-up, with a phone web app as a second output path, and demoed the finished device to the Infineon sponsors.",
    ],
    link: { label: "VisionAssist", href: "/work/visionassist/" },
  },
  {
    when: "Jan 2025 to Dec 2025",
    where: "Cupertino, CA",
    role: "Teaching Assistant and Computer Science Tutor",
    org: "De Anza College",
    points: [
      "TA for CIS 21JA (x86 assembly and computer architecture), CIS 22A and CIS 22B (C++), all courses I had completed myself.",
      "Tutored C++, x86 assembly (MASM), Python, data structures and algorithms, and object-oriented programming in the CS lab, mostly with first-time programmers, tracing each bug from symptom back to root cause with the student.",
    ],
  },
  {
    when: "Apr 2025 to Dec 2025",
    where: "Cupertino, CA",
    role: "Co-Founder and Co-President",
    org: "Applied Data Analytics Club, De Anza College",
    points: [
      "Co-founded the club on a campus with no applied-ML student group, grew it to 54 members, and built its workshop program from scratch.",
      "Ran hands-on workshops on applied machine learning, model evaluation and Python data pipelines.",
    ],
  },
];

export const EDUCATION = [
  {
    school: "San José State University",
    degree: "B.S. Computer Engineering, Minor in Artificial Intelligence",
    when: "Expected May 2028",
    note: "GPA 3.8 · Dean's Scholar",
    courses:
      "Completed: Introduction to Engineering, Assembly Language Programming (x86), Computer Organization and Architecture, Engineering Statistics. In progress, Fall 2026: Algorithms and Data Structure Design, Software Engineering I, AI, Data Engineering, and Ethics, Engineering Reports, Introduction to Circuit Analysis, Introductory Electrical Engineering Laboratory (group project: a hardware true random number generator).",
  },
  {
    school: "De Anza College",
    degree: "Certificate of Achievement, Programming in C/C++, with Honors",
    when: "Mar 2026",
    note: "GPA 3.8 · Dean's List",
    courses: "Advanced C, Data Structures and Algorithms, Object-Oriented C++, Beginning C++, x86 Assembly, Linear Algebra, Discrete Math, Calculus I to IV, Differential Equations",
  },
];

// Ordered by strength.
export const AWARDS = [
  { t: "Sponsor Track winner", d: "UC Berkeley AI Hackathon 2026 · Accordion · The Token Company" },
  { t: "Top 6 finalist", d: "AIE Code Summit 2026 Hackathon · Sisyphus" },
  { t: "2nd place", d: "DA Hacks 3.5 · ClassPath AI" },
  { t: "Top 10 at site", d: "ICPC 2025 Regionals, Division 2" },
  { t: "Most Valuable Peer", d: "HackStorm 2.0, May 2026 · peer-nominated for cross-team technical contribution" },
  { t: "Dean's Scholar", d: "San José State University" },
  { t: "Dean's List", d: "De Anza College" },
];

export const CERTS = [
  "AWS Certified Cloud Practitioner · Amazon Web Services, Jan 2026",
  "Anthropic: Model Context Protocol, Advanced Topics · Sep 2026",
  "Anthropic: Introduction to Model Context Protocol · Jul 2026",
  "Anthropic: Claude Code in Action · Mar 2026",
  "Oracle Cloud Infrastructure Generative AI Professional · Oracle, Jul 2024",
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
  "I'm from India, and I got into engineering through VEX robotics, programming robots in RobotC. It came full circle at SJSU: I wrote the control code for my team's robot in ENGR 10 and posted the fastest run in the section, 14.41 s, then was brought back the next semester to TA the course. I started out in computer science and switched to computer engineering to get closer to the hardware. Alta is where those threads meet: an AI lab TA for the kind of bench I now supervise.",
  "Most of what I build starts with something I need or want to understand. ApexTracker began as a deliberately ordinary project to build the habit of building, and became the app I use every day. Rung started because I wanted measured numbers, not claims, for how interpreters get fast. I like work where I can measure the result, and I like being the person who traces a bug all the way down to its cause.",
  "Outside engineering I'm into sports, playing and watching basketball, soccer and cricket and following F1, and I go to Bay Area AI and ML meetups.",
];

export const SKILLS = [
  { area: "Languages", items: ["C++", "Python", "Kotlin", "C", "x86 assembly", "ARM64 assembly", "TypeScript", "JavaScript", "SQL", "Dart", "Swift"] },
  { area: "Frameworks", items: ["FastAPI", "Jetpack Compose", "Room", "React", "Next.js", "SvelteKit", "React Native / Expo", "Flutter", "Flask", "SQLAlchemy / Alembic", "Tauri"] },
  { area: "AI and ML", items: ["PyTorch", "YOLOv8", "OpenCV", "LiteRT (NPU)", "ML Kit", "Hugging Face Transformers", "Gemini (Vertex AI, Firebase AI)", "Claude API", "Claude Code", "DeepSeek", "ElevenLabs", "Cartesia", "Piper TTS", "faster-whisper", "whisper.cpp", "Rasa"] },
  { area: "DevOps and infrastructure", items: ["GitHub Actions", "Docker", "Cloudflare Workers and Access", "Firebase", "EAS Build", "systemd", "Linux (Ubuntu)", "Tailscale", "CMake", "Ninja", "Make"] },
  { area: "Cloud", items: ["AWS Certified Cloud Practitioner"] },
  { area: "Databases", items: ["SQLite / Room", "SQLCipher", "PostgreSQL (Cloud SQL)", "Firestore"] },
  { area: "Testing and quality", items: ["JUnit", "pytest", "Compose screenshot tests", "doctest", "ASan / UBSan / TSan", "libFuzzer", "Conformance testing", "Firmware-in-simulator testing (simavr)", "Host-side unit tests for embedded C"] },
  { area: "Hardware and embedded", items: ["Bare-metal AVR (ATmega328P)", "avr-gcc and avrdude", "Arduino Uno", "Raspberry Pi 5", "PSoC 6", "60 GHz radar (BGT60TR13C)", "BLE / GATT", "Qualcomm Hexagon NPU", "VEX controllers", "Serial protocols", "Breadboard circuits", "Soldering", "CAD", "3D printing"] },
  { area: "Security design", items: ["SQLCipher with Android Keystore", "Firebase ID-token verification", "App Check (Play Integrity)", "Least-privilege write paths", "Guard hook blocking GitHub writes", "Prompt-injection handling"] },
];

// Smaller builds listed under the main projects on the front page. One sentence each.
export const MORE: { title: string; tag: string; text: string; href?: string; roles?: Role[] }[] = [
  {
    title: "Autonomous beacon robot",
    roles: ["embedded"],
    tag: "Fastest run in section · SJSU ENGR 10",
    text: "A VEX robot that finds an infrared beacon, switches it off, then drags a second one out of the arena. I wrote all the control code, and it ran the course in 14.41 s.",
    href: "https://youtube.com/shorts/Y7p0N8BDqbQ",
  },
  {
    title: "ClassPath AI",
    roles: ["ai", "software"],
    tag: "2nd place · DA Hacks 3.5",
    text: "A transfer planner that turns articulation data into a quarter-by-quarter plan for community college students. I built its chatbot counselor.",
    href: "https://devpost.com/software/class-path-ai",
  },
  {
    title: "Wind turbine",
    roles: ["embedded"],
    tag: "SJSU ENGR 10",
    text: "A 3D-printed wind turbine. I led the rotor blade design, and it spun past 5,800 RPM in a 25 mph wind.",
  },
];
