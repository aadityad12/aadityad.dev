export type ProjectId = "accordion" | "rung" | "gazeboard" | "visionassist" | "apextracker";

export type Project = {
  id: ProjectId;
  number: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  role: string;
  period: string;
  stack: string[];
  repo: string;
  live?: string;
  proof: { value: string; label: string };
  constraint: string;
  approach: string;
  ownership: string[];
  decisions: { title: string; body: string }[];
  outcome: string;
  limitation: string;
  flow: string[];
};

export const projects: Project[] = [
  {
    id: "accordion",
    number: "01",
    name: "Accordion",
    category: "AI TOOLS",
    headline: "An agent can forget.\nIts context shouldn’t.",
    description: "A visual memory layer for AI coding agents. Fold stale context out of the way, then bring it back exactly when it matters. Nothing gets thrown away.",
    role: "Relevance pipeline & attribution · team project",
    period: "UC Berkeley AI Hackathon · June 2026",
    stack: ["Python", "SvelteKit", "TypeScript", "Transformers"],
    repo: "https://github.com/a-Fig/accordion",
    live: "https://get-accordion.dev",
    proof: { value: "5/6", label: "checkpoints, vs. 2/6 with naive compaction" },
    constraint: "A coding agent has a finite context window. Summarizing a long session makes room, but can permanently erase the detail it needs for the next step.",
    approach: "Separate the complete session from the model’s current view. Context becomes a set of inspectable blocks that can be folded, unfolded, and pinned, rather than one progressively degraded summary.",
    ownership: [
      "Built the hackathon relevance pipeline: keyword scoring, bi-encoder retrieval, then cross-encoder reranking.",
      "Built the live per-actor attribution view to make context usage inspectable.",
      "Collaborated on the hackathon prototype. The later Thermocline conductor is not my work.",
    ],
    decisions: [
      { title: "Hide information. Don’t destroy it.", body: "Folding changes the model-visible view, not the underlying stored context. That makes a mistaken relevance decision recoverable." },
      { title: "Spend the expensive model call last.", body: "A cheap keyword pass and bi-encoder narrow the candidates before the cross-encoder reranks them. The pipeline reserves the most expensive comparison for a smaller set." },
      { title: "Make the invisible inspectable.", body: "An agent’s context is usually hidden machinery. The map and per-actor attribution let a person see where the budget goes, rather than guessing what the agent remembers." },
    ],
    outcome: "Won The Token Company sponsor track at the 2026 UC Berkeley AI Hackathon. In the team’s SlopCodeBench experiment, Accordion cleared 5 of 6 checkpoints versus 2 of 6 for naive compaction, with the same 100K-token budget and DeepSeek V4 Pro.",
    limitation: "This is a small, hackathon-scale benchmark, not a general claim about every agent or coding task. The portfolio exhibit is a simplified interaction, not the production Accordion engine.",
    flow: ["Session blocks", "Keyword scoring", "Bi-encoder", "Cross-encoder", "Fold / restore"],
  },
  {
    id: "rung",
    number: "02",
    name: "Rung",
    category: "LANGUAGES & SYSTEMS",
    headline: "One language.\nEvery speed-up earned.",
    description: "A small language in C++20, from a tree-walker to handwritten ARM64 machine code. Same programs, different engines, and a benchmark ladder that keeps the regressions.",
    role: "Solo project · language, runtime, JIT & benchmarks",
    period: "Ongoing · 2026",
    stack: ["C++20", "ARM64", "CMake", "Python"],
    repo: "https://github.com/aadityad12/rung",
    proof: { value: "4.54×", label: "native fib vs. optimized register VM" },
    constraint: "Interpreter optimizations sound convincing in a textbook. I wanted to know what each one actually buys, without changing the answer a program produces.",
    approach: "Build a shared frontend and runtime, then climb an execution ladder: tree-walker, stack VM, register VM, synchronous ARM64 JIT, and background compilation. Measure each step and preserve its failures.",
    ownership: [
      "Built the language and execution ladder in C++20, using Crafting Interpreters and Lua 5.0 as explicit foundations.",
      "Wrote the ARM64 instruction encoder, type guards, recursive-call support, and precise fallback into the VM.",
      "Built the reproducible measurement pipeline and background compiler, including publication, instruction-cache synchronization, and GC rooting.",
    ],
    decisions: [
      { title: "Correctness before cleverness.", body: "The engines share semantics and errors. Conformance programs, forced GC, sanitizers, and frontend fuzzing check that a faster engine still runs the same language." },
      { title: "A failed guard is a handoff, not a crash.", body: "When a value violates a JIT assumption, execution resumes at the exact bytecode instruction in the VM, even several recursive calls deep." },
      { title: "Keep the embarrassing row.", body: "NaN-boxing reduced the value representation but slowed all six benchmarks. The worst marginal result was 0.63×. It stays in the published ladder because an unexplained regression is useful evidence." },
    ],
    outcome: "In one interleaved session on an M1 Pro, native recursion ran fib 4.54× faster than the optimized register VM: 13.37 ms → 2.94 ms, using median process total divided by calls. The JIT compiles two of the six main benchmarks; the other four fall back to the VM.",
    limitation: "Results are from one M1 Pro. The JIT is ARM64-only and deliberately supports a subset of the language. Earlier ladder rows span measurement sessions. The exhibit shows committed results, not a browser-executed compiler.",
    flow: ["Source", "Parse & resolve", "Bytecode", "Register VM", "ARM64 JIT ↔ VM"],
  },
  {
    id: "gazeboard",
    number: "03",
    name: "GazeBoard",
    category: "ON-DEVICE AI",
    headline: "A glance can\nbe a voice.",
    description: "An Android research prototype that turns four gaze directions into spoken phrases. Camera frames stay on the phone, with an explicit path to Qualcomm’s NPU.",
    role: "NPU integration, calibration flow & debugging · team project",
    period: "Qualcomm × Google Edge AI Hackathon · 2026",
    stack: ["Kotlin", "Jetpack Compose", "LiteRT", "CameraX"],
    repo: "https://github.com/aadityad12/GazeBoard",
    proof: { value: "0", label: "Internet permissions declared by the app" },
    constraint: "An interface is not useful if its user cannot touch it. A gaze-to-speech system also needs to keep camera data local and make its hardware assumptions explicit.",
    approach: "CameraX captures the latest frame, ML Kit locates the eye, and a grayscale crop feeds Qualcomm’s EyeGaze model through LiteRT. Calibration maps the result to four large targets; dwell selects a phrase or spelling group.",
    ownership: [
      "Integrated the NPU inference path and its device-targeted Qualcomm runtime packaging.",
      "Built the debug overlay and recalibration flow, and worked on vocabulary trimming, build fixes, and documentation.",
      "Built with Sheel Shah and Nishanth Nagesh.",
    ],
    decisions: [
      { title: "No invisible fallback.", body: "The model explicitly requests the NPU. Unsupported hardware gets a visible error screen instead of quietly switching to a different accelerator." },
      { title: "Four targets, not a tiny keyboard.", body: "Large quadrants and a one-second dwell reduce selection complexity. The tradeoff is lower input bandwidth and the possibility of accidental dwell selections." },
      { title: "Drop stale frames.", body: "CameraX keeps only the latest analysis frame. That prevents an ever-growing backlog, without pretending it guarantees a particular latency." },
    ],
    outcome: "Implemented the camera-to-speech pipeline, calibration state machine, local prefix predictor, and SM8750-targeted NPU feature. Debug and release artifacts build, including the bundled runtime libraries.",
    limitation: "A research prototype, not a validated assistive device. Target-device execution, accuracy, latency, and sustained frame rate have not been re-verified. The browser exhibit uses pointer, touch, or keyboard input, not eye tracking, and does not access the camera.",
    flow: ["CameraX", "Eye crop", "LiteRT / NPU", "Calibration", "Dwell → speech"],
  },
  {
    id: "visionassist",
    number: "04",
    name: "VisionAssist",
    category: "EMBEDDED VISION",
    headline: "Small computer.\nA little more awareness.",
    description: "A head-mounted obstacle-warning prototype, built with Infineon and De Anza College. A Raspberry Pi sees, prioritizes, and speaks, without a cloud round trip.",
    role: "Research Intern & Technical Lead · five-person project group",
    period: "Infineon × De Anza College · April–June 2026",
    stack: ["Python", "YOLOv8n", "OpenCV", "Raspberry Pi 5"],
    repo: "https://github.com/aadityad12/Vision-Assist",
    proof: { value: "~200 ms", label: "per frame on a Raspberry Pi 5 CPU" },
    constraint: "A small, battery-powered computer cannot run every model or announce every detection. Spoken warnings need to be selective enough to be useful.",
    approach: "Build an entirely local perception-to-speech loop: camera capture, YOLO detection, approximate distance estimation, event prioritization, and neural speech. Deploy it headlessly so it starts when the device powers on.",
    ownership: [
      "Led the five-person project group and wrote the device software, from perception to offline speech.",
      "Benchmarked model variants, added frame skipping under load, and ranked events so one highest-priority warning is emitted per frame.",
      "Investigated the 60 GHz radar failure, documented it for Infineon, and shipped the camera-based distance estimator instead.",
    ],
    decisions: [
      { title: "The sensor was working. The association wasn’t.", body: "Radar selected the strongest reflector, not necessarily the object the camera was tracking. Without spatial localization, the range could not be reliably assigned to a detection. I cut the integration instead of presenting misleading precision." },
      { title: "One warning beats five competing ones.", body: "Priority tiers choose the most important event rather than speaking every detection. Perception throughput is not useful if the audio queue overwhelms the person wearing it." },
      { title: "Power on should mean ready.", body: "Systemd units run the device headlessly. Deployment and recovery are part of the prototype, not steps left to a laptop and a terminal." },
    ],
    outcome: "Demonstrated a working on-device prototype to the project’s Infineon sponsors. YOLOv8n runs at approximately 200 ms per frame on the Pi 5 CPU, with local distance estimation and speech output.",
    limitation: "A prototype, not validated navigation or safety equipment. Camera-based distance can overestimate inside four feet, and the system does not detect stairs or drop-offs. The portfolio exhibit is a schematic, not a live perception feed.",
    flow: ["Camera", "YOLOv8n", "Distance estimate", "Priority ranking", "Offline speech"],
  },
  {
    id: "apextracker",
    number: "05",
    name: "ApexTracker",
    category: "ANDROID & LOCAL-FIRST",
    headline: "Built for a user\nI can’t ignore. Me.",
    description: "My daily driver for habits, money, and the things I mean to do. A solo Android app that works offline, with encrypted storage and optional sync.",
    role: "Solo project · product, Android engineering & testing",
    period: "January 2026–present",
    stack: ["Kotlin", "Compose", "Room", "Glance"],
    repo: "https://github.com/aadityad12/Apex-Tracker",
    proof: { value: "5", label: "home-screen widgets, backed by local data" },
    constraint: "My life was split across reminders, spreadsheets, and notes. A daily tool should work before I log in, when I lose connection, and after the phone reboots.",
    approach: "Make Room the source of truth. Build the daily workflows around local data, add encrypted storage and reboot-safe alarms, then offer Firebase login and sync as optional layers.",
    ownership: [
      "Designed and built the app as a sustained solo project, and use it daily.",
      "Built five Glance widgets, local persistence, handwritten migrations, and reboot-safe alarms.",
      "Added receipt OCR using the system photo picker, with unit and screenshot testing across the app.",
    ],
    decisions: [
      { title: "Offline is the default, not the fallback.", body: "Room owns the data. An account is optional. Core workflows don’t wait for network availability or successful authentication." },
      { title: "A photo picker is enough.", body: "Receipt OCR uses a user-selected image, avoiding a camera permission request and an upload pipeline." },
      { title: "Use the thing you build.", body: "The receipt parser passed its tests, then read a shop’s street number as the total on a real phone. Daily use finds failures that a happy-path fixture never will." },
    ],
    outcome: "A daily-use Android app with five home-screen widgets, encrypted local storage, explicit migrations, optional cloud sync, and offline receipt parsing. The most useful result is that I still use it.",
    limitation: "This is a personal, ongoing application, not a claim of external user adoption. The portfolio exhibit uses sample habit data and does not write to the Android app.",
    flow: ["Compose UI", "ViewModel", "Room database", "Widgets & alarms", "Optional sync"],
  },
];

export const archive = [
  { name: "Echo", category: "OFFLINE COMMUNICATION", description: "Emergency alerts between nearby phones over Bluetooth. Native GATT servers in Kotlin and Swift, bridged into Flutter.", detail: "Built native BLE servers and cross-platform integration. The project supports on-device translation into 22 languages; end-to-end multi-hop reliability is not yet demonstrated.", stack: "Flutter · Kotlin · Swift · BLE", repo: "https://github.com/aadityad12/Echo" },
  { name: "Temper", category: "AGENT EVALUATION", description: "Find where an agent’s prompts, tools, and skills make it worse, then patch and retest the affected dimensions.", detail: "Built the specification, API contract, JSON Schemas, local client, pi extension, and FastAPI service with Sheel Shah. An offline answer-key fixture exercises the protocol; its scores are not live-model results.", stack: "Python · FastAPI · JSON Schema", repo: "https://github.com/aadityad12/Temper" },
  { name: "Clear Dispatch", category: "REAL-TIME SYSTEMS", description: "A dispatch simulation that keeps a human’s approval between an automated recommendation and a heavy asset moving.", detail: "A three-person HackDavis project. Typed WebSocket events drive a React reducer, with reservations, cancellation, and a 60-second approval timeout. Synthetic calls and in-memory state, not a production emergency system.", stack: "FastAPI · WebSockets · React", repo: "https://github.com/aadityad12/Clear-Dispatch" },
  { name: "OSS Scout", category: "DEVELOPER AUTOMATION", description: "A nightly contribution scout that prepares a tested draft, then leaves the decision to publish with a human.", detail: "A solo automation project. Draft preparation and write authority are separated; publication is not part of the autonomous loop.", stack: "Python · GitHub Actions · Agent tooling", repo: "https://github.com/aadityad12/oss-scout" },
];

export const contact = {
  email: "aaditya.d.desai@gmail.com",
  github: "https://github.com/aadityad12",
  linkedin: "https://www.linkedin.com/in/aaditya-desai-12d",
  resume: "/Aaditya_Desai_Portfolio_Resume.pdf",
};
