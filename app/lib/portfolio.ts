export type ProjectId = "accordion" | "rung" | "gazeboard" | "alta" | "visionassist" | "apextracker";

export type Project = {
  id: ProjectId;
  number: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  /** One line for cards and lists: what it is and why it matters. */
  summary: string;
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
  approachTitle: string;
  decisionsTitle: string;
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
    summary: "AI agents shouldn’t have to lose their train of thought. A visual, reversible memory layer for long coding sessions.",
    role: "Conductor, evaluation layer & activity dashboard · team of four",
    period: "UC Berkeley AI Hackathon · June 2026–present",
    stack: ["TypeScript", "SvelteKit", "Tauri", "Transformers"],
    repo: "https://github.com/a-Fig/accordion",
    live: "https://get-accordion.dev",
    proof: { value: "5/6", label: "checkpoints, vs. 2/6 with naive compaction" },
    constraint: "A coding agent has a finite context window. Summarizing a long session makes room, but can permanently erase the detail it needs for the next step.",
    approachTitle: "Two views of one session.",
    decisionsTitle: "Three rules the folding follows.",
    approach: "Separate the complete session from the model’s current view. Context becomes a set of inspectable blocks that can be folded, unfolded, and pinned, rather than one progressively degraded summary.",
    ownership: [
      "Built the conductor, the policy that decides what to fold. It keeps a folding budget across reconnects and calibrates its own target to hold context between 60% and 92% full.",
      "Built its three-stage relevance pipeline for bringing context back: keyword scoring, bi-encoder retrieval, then cross-encoder reranking.",
      "Built the health and evaluation layer, with a harness that compares folding against naive compaction, and the activity dashboard that shows every folding decision.",
    ],
    decisions: [
      { title: "Hide information. Don’t destroy it.", body: "Folding changes the model-visible view, not the underlying stored context. That makes a mistaken relevance decision recoverable." },
      { title: "Spend the expensive model call last.", body: "A cheap keyword pass and bi-encoder narrow the candidates before the cross-encoder reranks them. The pipeline reserves the most expensive comparison for a smaller set." },
      { title: "Make the invisible inspectable.", body: "An agent’s context is usually hidden machinery. The context map and the conductor dashboard let a person see where the budget goes, rather than guessing what the agent remembers." },
    ],
    outcome: "Won The Token Company sponsor track at the 2026 UC Berkeley AI Hackathon. In the team’s SlopCodeBench experiment, Accordion cleared 5 of 6 checkpoints versus 2 of 6 for naive compaction, with the same 100K-token budget and DeepSeek V4 Pro. The project has since passed 240 GitHub stars and 10,000 visits to its site.",
    flow: ["Session blocks", "Keyword scoring", "Bi-encoder", "Cross-encoder", "Fold / restore"],
  },
  {
    id: "rung",
    number: "02",
    name: "Rung",
    category: "LANGUAGES & SYSTEMS",
    headline: "One language.\nEvery speed-up earned.",
    description: "A small language in C++20, from a tree-walker to handwritten ARM64 machine code. Same programs, different engines, and a benchmark ladder that keeps the regressions.",
    summary: "How fast can a small language go? I built the same language five ways, all the way down to handwritten ARM64.",
    role: "Solo project · language, runtime, JIT & benchmarks",
    period: "September–October 2026",
    stack: ["C++20", "ARM64", "CMake", "Python"],
    repo: "https://github.com/aadityad12/rung",
    proof: { value: "38.84×", label: "faster than the tree-walker on fib, as native ARM64" },
    constraint: "Interpreter optimizations sound convincing in a textbook. I wanted to know what each one actually buys, without changing the answer a program produces.",
    approachTitle: "Five engines, one language.",
    decisionsTitle: "Faster only counts if it’s still right.",
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
    outcome: "Compiled to native ARM64, fib runs 38.84× faster than the tree-walker it started as, and loop_sum 22.38× faster. Against the already optimized register VM, measured in one interleaved session on an M1 Pro, native code is still 4.54× faster on fib: 13.37 ms → 2.94 ms.",
    flow: ["Source", "Parse & resolve", "Bytecode", "Register VM", "ARM64 JIT ↔ VM"],
  },
  {
    id: "alta",
    number: "03",
    name: "Alta",
    category: "AI LAB ASSISTANT",
    headline: "Measure first.\nThen teach.",
    description: "A voice-driven lab TA for intro electronics. A probe pod measures the student’s breadboard, and an AI agent walks them to the fault with measurements and hints instead of handing over the answer.",
    summary: "A TA for the electronics bench. A probe pod measures the student’s circuit, and a voice agent walks them to the fault with hints, not answers.",
    role: "Probe pod, bare-metal firmware & probe monitor · team of four",
    period: "Cal Hacks 13.0 · October 2026",
    stack: ["C", "ATmega328P", "Python", "FastAPI", "React", "Cartesia"],
    repo: "https://github.com/aadityad12/Alta",
    proof: { value: "3/3", label: "real-board faults found and fixed, unassisted" },
    approachTitle: "The bench is the interface.",
    decisionsTitle: "Measure before you say anything.",
    constraint: "In an intro electronics lab, one TA covers thirty students, and most of them are stuck on the same few mistakes: an LED in backwards, a resistor with the wrong bands, a ground wire that never reached the rail. A student waits ten minutes for a fix that takes thirty seconds, and learns nothing from it.",
    approach: "Put a TA at every bench. A probe pod measures the student’s actual circuit and reports real voltages twenty times a second. An agent talks with the student by voice, and a four-step hint ladder keeps the answer out of reach until the student has had a real try.",
    ownership: [
      "Built the probe pod: an Arduino Uno in a 3D-printed dock that powers the student’s board and reads four colour-coded probe wires.",
      "Wrote the bare-metal firmware in C: an interrupt-driven ADC sampling each probe about 1,200 times a second, ring-buffer UART, and a documented serial protocol.",
      "Tested the firmware in a simulator against the real serial bridge: 25 checks plus a 60-second soak, down to a bouncy button press producing exactly one event.",
      "Built the probe monitor, so the agent speaks up the moment a reading moves into the expected range, with no button press.",
    ],
    decisions: [
      { title: "Measure before diagnosing.", body: "The agent’s core rule: take a probe reading before saying what is wrong. When the camera and the probes disagree, the probes win." },
      { title: "Hints are a ladder, not an answer.", body: "Nudge, question, point at the spot, then the fix. The fix comes only after the student asks twice, fails three times, or stays stuck through four questions." },
      { title: "Labs are data, not code.", body: "Each lab is one file: parts, expected voltages at each point, and every known fault with its readings and hint ladder. Adding a lab means writing a file, and a validator checks every one." },
    ],
    outcome: "On the real board at the venue, Alta found and fixed all three timed faults with no errors: an LED in backwards in 205 seconds, a missing ground wire in 110, and a wrong resistor in 322. Its first words land about two seconds after the student lets go of the talk button.",
    flow: ["Probe pod", "Bare-metal C", "Serial bridge", "Agent & tools", "Voice"],
  },
  {
    id: "gazeboard",
    number: "04",
    name: "GazeBoard",
    category: "ON-DEVICE AI",
    headline: "A glance can\nbe a voice.",
    description: "An Android research prototype that turns four gaze directions into spoken phrases. Camera frames stay on the phone, with an explicit path to Qualcomm’s NPU.",
    summary: "For someone who can’t speak or use their hands, a glance can be a whole sentence.",
    role: "NPU integration, calibration flow & debugging · team project",
    period: "Qualcomm × Google LiteRT Developer Hackathon · May 2026",
    stack: ["Kotlin", "Jetpack Compose", "LiteRT", "CameraX"],
    repo: "https://github.com/aadityad12/GazeBoard",
    proof: { value: "0", label: "Internet permissions declared by the app" },
    constraint: "An interface is not useful if its user cannot touch it. A gaze-to-speech system also needs to keep camera data local and make its hardware assumptions explicit.",
    approachTitle: "From a camera frame to a spoken word.",
    decisionsTitle: "Built around the person using it.",
    approach: "CameraX captures the latest frame, ML Kit locates the eye, and a grayscale crop feeds Qualcomm’s EyeGaze model through LiteRT. Calibration maps the result to four large targets; dwell selects a phrase or spelling group.",
    ownership: [
      "Integrated the NPU inference path and its device-targeted Qualcomm runtime packaging.",
      "Built the debug overlay, the recalibration flow, and the spelling vocabulary.",
      "Built with Sheel Shah and Nishanth Nagesh.",
    ],
    decisions: [
      { title: "No invisible fallback.", body: "The model explicitly requests the NPU. Unsupported hardware gets a visible error screen instead of quietly switching to a different accelerator." },
      { title: "Four targets, not a tiny keyboard.", body: "Large quadrants and a one-second dwell reduce selection complexity. Spelling mode maps the alphabet onto the same four directions, so any word is a few glances away." },
      { title: "Drop stale frames.", body: "CameraX keeps only the latest analysis frame. That prevents an ever-growing backlog." },
    ],
    outcome: "Implemented the camera-to-speech pipeline, calibration state machine, local prefix predictor, and SM8750-targeted NPU feature. Debug and release artifacts build, including the bundled runtime libraries.",
    flow: ["CameraX", "Eye crop", "LiteRT / NPU", "Calibration", "Dwell → speech"],
  },
  {
    id: "visionassist",
    number: "05",
    name: "VisionAssist",
    category: "EMBEDDED VISION",
    headline: "Small computer.\nA little more awareness.",
    description: "A head-mounted obstacle-warning prototype, built with Infineon and De Anza College. A Raspberry Pi sees, prioritizes, and speaks, without a cloud round trip.",
    summary: "A wearable that spots what’s ahead and says how far away it is, entirely on the device.",
    role: "Research Intern & Technical Lead · five-person project group",
    period: "Infineon × De Anza College · April–June 2026",
    stack: ["Python", "YOLOv8n", "OpenCV", "Raspberry Pi 5"],
    repo: "https://github.com/aadityad12/Vision-Assist",
    proof: { value: "~200 ms", label: "per frame on a Raspberry Pi 5 CPU" },
    constraint: "A small, battery-powered computer cannot run every model or announce every detection. Spoken warnings need to be selective enough to be useful.",
    approachTitle: "See, choose, speak. All on the device.",
    decisionsTitle: "What to say, and what to leave out.",
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
    flow: ["Camera", "YOLOv8n", "Distance estimate", "Priority ranking", "Offline speech"],
  },
  {
    id: "apextracker",
    number: "06",
    name: "ApexTracker",
    category: "ANDROID & LOCAL-FIRST",
    headline: "Built for a user\nI can’t ignore. Me.",
    description: "My daily driver for habits, money, and the things I mean to do. A solo Android app that works offline, with encrypted storage and optional sync.",
    summary: "I wanted less life admin. So I built the local-first Android app I now use every day.",
    role: "Solo project · product, Android engineering & testing",
    period: "January 2026–present",
    stack: ["Kotlin", "Compose", "Room", "Glance"],
    repo: "https://github.com/aadityad12/Apex-Tracker",
    proof: { value: "5", label: "home-screen widgets, backed by local data" },
    constraint: "My life was split across reminders, spreadsheets, and notes. A daily tool should work before I log in, when I lose connection, and after the phone reboots.",
    approachTitle: "The phone is the source of truth.",
    decisionsTitle: "Choices that came from daily use.",
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
    flow: ["Compose UI", "ViewModel", "Room database", "Widgets & alarms", "Optional sync"],
  },
];

export const archive = [
  { name: "Sisyphus", category: "SELF-IMPROVING AGENTS", description: "A video-editing system whose failures become versioned changes to its own agents, kept only if they prove themselves on held-out work.", detail: "A four-person project at the AIE Code Summit 2026 hackathon, selected as a top 6 finalist. I built the Reviewer and Auditor agents.", stack: "Python · React · Tauri", repo: "https://github.com/aadityad12/Sisyphus" },
  { name: "Echo", category: "OFFLINE COMMUNICATION", description: "Emergency alerts between nearby phones over Bluetooth. Native GATT servers in Kotlin and Swift, bridged into Flutter.", detail: "Built the BLE transport and chunking protocol, the native GATT servers, storage, and the background relay. Alerts are spoken and translated on the device into 22 languages.", stack: "Flutter · Kotlin · Swift · BLE", repo: "https://github.com/aadityad12/Echo" },
  { name: "Temper", category: "AGENT EVALUATION", description: "Find where an agent’s prompts, tools, and skills make it worse, then patch and retest the affected dimensions.", detail: "Built the specification, API contract, JSON Schemas, local client, pi extension, and FastAPI evaluation service with Sheel Shah and Oak Soe Khant. A patch loop rewrites the failing files and retests only the dimensions they affect.", stack: "Python · FastAPI · JSON Schema", repo: "https://github.com/aadityad12/Temper" },
  { name: "Clear Dispatch", category: "REAL-TIME SYSTEMS", description: "A dispatch simulation that keeps a human’s approval between an automated recommendation and a heavy asset moving.", detail: "A three-person HackDavis project. Typed WebSocket events drive a React reducer, with reservations, cancellation, and a 60-second approval timeout.", stack: "FastAPI · WebSockets · React", repo: "https://github.com/aadityad12/Clear-Dispatch" },
  { name: "OSS Scout", category: "DEVELOPER AUTOMATION", description: "A nightly contribution scout that prepares a tested draft, then leaves the decision to publish with a human.", detail: "A solo project in daily use. The unattended agent cannot write to GitHub: a guard hook with 37 tests blocks every write, and publishing takes one tap from me.", stack: "Python · GitHub Actions · Agent tooling", repo: "https://github.com/aadityad12/oss-scout" },
];

export const contact = {
  email: "aaditya.d.desai@gmail.com",
  github: "https://github.com/aadityad12",
  linkedin: "https://www.linkedin.com/in/aaditya-desai-12d",
  resume: "/Aaditya_Desai_Portfolio_Resume.pdf",
};
