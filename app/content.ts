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
  specs: { param: string; value: string; note?: string }[];
  stack: string[];
  links: Link[];
  errata: string[];
  figure: string;
  compact?: boolean;
};

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
  "Aaditya Desai is a computer engineering student at San José State University who builds software for awkward constraints: no network, a fixed compute budget, a latency target, or an agent that has run out of context. He works from the metal up, from interrupt-driven firmware and a hand-written JIT to on-device vision and tools for AI coding agents, and documents what does not work as carefully as what does.";

// Pin map: every pin is a real skill, cross-referenced to the app notes that use it.
export type Pin = { n: number; name: string; type: "I/O" | "IN" | "OUT" | "PWR"; desc: string; uses: string[] };
export const PINS: Pin[] = [
  { n: 1, name: "C++", type: "I/O", desc: "C++20 runtime, VMs and JIT; taught intro C++", uses: ["rung"] },
  { n: 2, name: "C", type: "I/O", desc: "Bare-metal AVR firmware, no Arduino libraries", uses: ["alta"] },
  { n: 3, name: "ARM64", type: "I/O", desc: "Hand-encoded instructions, checked against LLVM", uses: ["rung"] },
  { n: 4, name: "x86", type: "I/O", desc: "MASM assembly, taught as a TA at De Anza", uses: [] },
  { n: 5, name: "PYTHON", type: "I/O", desc: "Perception loop, FastAPI services, CI tooling", uses: ["visionassist", "accordion", "temper", "oss-scout", "clear-dispatch"] },
  { n: 6, name: "KOTLIN", type: "I/O", desc: "Android apps and the native BLE GATT layer", uses: ["gazeboard", "apextracker", "echo"] },
  { n: 7, name: "TS", type: "I/O", desc: "TypeScript dashboards and reducers", uses: ["accordion", "clear-dispatch"] },
  { n: 8, name: "SWIFT", type: "I/O", desc: "CoreBluetooth GATT server via platform channels", uses: ["echo"] },
  { n: 9, name: "PYTORCH", type: "IN", desc: "YOLOv8n inference on the Pi 5 CPU", uses: ["visionassist"] },
  { n: 10, name: "LITERT", type: "IN", desc: "CompiledModel on the Hexagon NPU, no fallback", uses: ["gazeboard"] },
  { n: 11, name: "HF", type: "IN", desc: "Bi-encoder and cross-encoder relevance ranking", uses: ["accordion"] },
  { n: 12, name: "OPENCV", type: "IN", desc: "Frame processing, board overlay engine", uses: ["visionassist", "alta"] },
  { n: 13, name: "ML KIT", type: "IN", desc: "Face landmarks, on-device receipt OCR", uses: ["gazeboard", "apextracker"] },
  { n: 14, name: "LLM API", type: "IN", desc: "Claude, Gemini and DeepSeek with deterministic fallbacks", uses: ["temper", "clear-dispatch", "oss-scout"] },
  { n: 15, name: "BLE", type: "I/O", desc: "GATT central and peripheral, chunked transfer", uses: ["echo"] },
  { n: 16, name: "AVR", type: "I/O", desc: "ATmega328P registers, interrupts, simavr", uses: ["alta"] },
  { n: 17, name: "LINUX", type: "PWR", desc: "Raspberry Pi OS, BlueZ, ALSA, headless boot", uses: ["visionassist", "echo"] },
  { n: 18, name: "SYSTEMD", type: "PWR", desc: "Units that run the device on power-up", uses: ["visionassist"] },
  { n: 19, name: "CMAKE", type: "PWR", desc: "Presets, sanitizer builds, three-platform CI", uses: ["rung"] },
  { n: 20, name: "GH ACT", type: "PWR", desc: "CI pipelines and a nightly scan", uses: ["rung", "oss-scout"] },
  { n: 21, name: "FASTAPI", type: "OUT", desc: "REST, WebSockets and Server-Sent Events", uses: ["temper", "clear-dispatch"] },
  { n: 22, name: "REACT", type: "OUT", desc: "Live dashboards fed by event streams", uses: ["clear-dispatch", "temper"] },
  { n: 23, name: "SVELTE", type: "OUT", desc: "Accordion's context map UI", uses: ["accordion"] },
  { n: 24, name: "COMPOSE", type: "OUT", desc: "Jetpack Compose UIs and Glance widgets", uses: ["gazeboard", "apextracker"] },
  { n: 25, name: "FLUTTER", type: "OUT", desc: "Cross-platform alert relay app", uses: ["echo"] },
  { n: 26, name: "SQL", type: "I/O", desc: "Room, SQLCipher and SQLite, hand-written migrations", uses: ["apextracker", "echo"] },
  { n: 27, name: "TTS", type: "OUT", desc: "Piper on-device speech, Android TextToSpeech", uses: ["visionassist", "gazeboard"] },
  { n: 28, name: "FUZZ", type: "IN", desc: "libFuzzer, ASan, UBSan and TSan in CI", uses: ["rung"] },
];

export const SPECS = {
  absMax: [
    { p: "Numbers on this page without a status tag", v: "0", u: "", note: "Each is tagged Measured, Observed, Single run or Repo" },
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
    { p: "JIT speedup, recursive fib", cond: "Rung, vs. tree-walker, Apple M1 Pro", typ: "38.84", u: "×", src: "rung", status: "Measured" },
    { p: "JIT speedup over optimized register VM", cond: "Rung, fib, same interleaved session", typ: "4.54", u: "×", src: "rung", status: "Measured" },
    { p: "Per-frame detection latency", cond: "VisionAssist, YOLOv8n, Raspberry Pi 5 CPU", typ: "200", u: "ms", src: "visionassist", status: "Measured" },
    { p: "Gaze inference time", cond: "GazeBoard, Hexagon NPU, Galaxy S25 Ultra", typ: "≈8", u: "ms", src: "gazeboard", status: "Observed" },
    { p: "Checkpoints cleared, 100K-token budget", cond: "Accordion vs. naive compaction, SlopCodeBench", typ: "5 / 6", u: "vs 2 / 6", src: "accordion", status: "Single run" },
    { p: "Probe sample rate, per channel", cond: "Alta pod, ATmega328P, bare-metal ADC", typ: "1,200", u: "Hz", src: "alta", status: "Measured" },
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
    context: "UC Berkeley AI Hackathon 2026 · Sponsor Track winner",
    role: "Team of 3",
    when: "Jun 2026",
    hook: "Lets an AI coding agent forget without losing anything.",
    problem:
      "Agents get worse on long tasks because their context fills with material that no longer matters. The usual fixes are destructive: compaction flattens the session into one lossy summary, and sliding windows just drop the oldest tokens. Accordion folds stale blocks out of the agent's view instead. Folding changes only what the agent sees, never what is stored, so anything can come back.",
    built: [
      "Built the hackathon **relevance pipeline**: keyword scoring, bi-encoder retrieval, then a **cross-encoder reranker** that picks which folded context to bring back, behind a self-calibrating fold target.",
      "Built the **evaluation harness** that benchmarks folding against summarization, plus health metrics that show whether folding is helping a session.",
      "Built the **live attribution view** that shows who made each fold: the user, the agent, or the conductor.",
    ],
    specs: [
      { param: "SlopCodeBench @ 100K tokens", value: "5 / 6 vs 2 / 6", note: "checkpoints vs. naive compaction, one hackathon-scale run" },
      { param: "GitHub stars, team repo", value: "240+", note: "a-Fig/accordion, Oct 2026" },
      { param: "Fold target", value: "0.60–0.92", note: "of the token budget, self-calibrating" },
    ],
    stack: ["Python", "Hugging Face Transformers", "TypeScript", "SvelteKit", "Tauri"],
    links: [
      { label: "get-accordion.dev", href: "https://get-accordion.dev" },
      { label: "GitHub", href: "https://github.com/a-Fig/accordion" },
      { label: "npm @a-fig/accordion", href: "https://www.npmjs.com/package/@a-fig/accordion" },
    ],
    errata: [
      "The benchmark is a single hackathon-scale run on a subset of problems. The README says to read it as a signal, not a guarantee.",
      "The team has since shipped stronger conductors (Thermocline). My part is the hackathon relevance pipeline, the eval harness and the attribution view.",
      "Scores are 83.3% vs 33.3% on that one run; there are no error bars yet.",
    ],
    figure: "Context map of a simulated agent session. Click a block to fold it, or run the conductor against the budget.",
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
      { param: "fib, JIT vs. tree-walker", value: "38.84×", note: "median process total ÷ calls, M1 Pro" },
      { param: "fib, JIT vs. register VM", value: "4.54×", note: "register VM vs. JIT, same session" },
      { param: "Largest single-rung loss", value: "0.63×", note: "NaN-boxing on sieve, kept in the table" },
    ],
    stack: ["C++20", "ARM64", "CMake", "Clang", "libFuzzer", "ASan / UBSan / TSan", "GitHub Actions"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/rung" }],
    errata: [
      "The JIT compiles functions in two of six main benchmarks (fib, loop_sum). The other four fall back to the VM; outlined bars show that.",
      "Results come from one M1 Pro, and three marginal ratios span measurement sessions.",
      "NaN-boxing halved heap allocation but slowed all six benchmarks. The cause is not yet known.",
    ],
    figure: "Speedup over the tree-walker, rung by rung. Real measurements from the repo's results tables.",
  },
  {
    id: "visionassist",
    an: "AN-03",
    title: "VisionAssist",
    block: "EDGE VISION",
    domain: "Embedded vision",
    context: "Infineon Technologies, with De Anza College",
    role: "Technical lead · team of 5",
    when: "Apr–Jun 2026",
    hook: "A wearable that tells a blind user what is ahead, and how many steps away.",
    problem:
      "A person walking down a sidewalk can't wait for a network, and any round trip adds latency to a collision warning. So everything runs on a head-mounted Raspberry Pi 5: one process, one loop, about five frames a second. That single requirement drove the model choice, the distance method, the speech engine, and the decision to cut the radar.",
    built: [
      "Built the whole pipeline: camera capture, **YOLOv8n at about 200 ms a frame** on the Pi 5 CPU, monocular distance from bounding-box height, and **risk-ranked speech in steps, not feet**.",
      "Evaluated Infineon's **60 GHz radar** and traced its phantom close-range readings to antenna leakage and floor reflections. Delivered the analysis to Infineon and shipped an empirically tuned monocular distance estimator instead.",
      "Shipped it as a **headless systemd service** that boots on power-up, with an annotated MJPEG stream and a phone web app as a second output path.",
    ],
    specs: [
      { param: "Detection latency", value: "≈200 ms / frame", note: "YOLOv8n, PyTorch CPU" },
      { param: "Distance model", value: "d = H·f / h", note: "27 class heights, f = 900 px" },
      { param: "Announcements per frame", value: "1", note: "highest risk tier, then nearest" },
    ],
    stack: ["Python", "PyTorch", "YOLOv8", "OpenCV", "Picamera2", "Flask", "Piper TTS", "systemd", "Raspberry Pi 5"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Vision-Assist" }],
    errata: [
      "Distance overestimates inside about 4 ft: a partly visible object gives a shorter box, which reads as farther away. Zone thresholds were raised as a mitigation, not a fix.",
      "The real fix, suppressing distance when a box touches the frame edge, is not implemented. Try it in the figure.",
      "No stair or drop-off detection. That is the most important gap for real-world use.",
    ],
    figure: "Drag the obstacles. The pipeline estimates distance from box height, ranks by risk, and announces one thing.",
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
      { param: "Inference", value: "≈8 ms", note: "observed on the debug overlay, single session" },
      { param: "Dwell / cooldown", value: "1 s / 500 ms", note: "per selection" },
      { param: "Network permissions", value: "0", note: "camera only" },
    ],
    stack: ["Kotlin", "Jetpack Compose", "CameraX", "ML Kit", "LiteRT", "Hexagon NPU"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/GazeBoard" }],
    errata: [
      "The 8 ms figure was read from the debug overlay during the hackathon. It was not logged, and the repo has no latency dataset.",
      "No accuracy, fatigue, lighting or glasses study exists. Android lint currently reports one error.",
      "A 2×2 layout has far lower input bandwidth than a keyboard. That is a deliberate trade for easier selection.",
    ],
    figure: "Your pointer stands in for gaze. Hold it on a quadrant for one second to select. Arrow keys work too.",
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
      { param: "Sample rate", value: "≈1,200 Hz", note: "per probe, 4 probes" },
      { param: "Report interval", value: "50 ms", note: "one JSON line" },
      { param: "Time to first word", value: "2.57 s", note: "median, after the talk button is released" },
    ],
    stack: ["C", "avr-gcc", "ATmega328P", "simavr", "Python", "OpenCV", "Arduino Uno"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Alta" }],
    errata: [
      "The camera can't yet place highlights reliably on the board, so the automatic board watcher is off by default.",
      "It needs the internet for the language model and voice.",
      "Lab 2 passes simulated tests but hasn't been measured on real hardware.",
    ],
    figure: "Lab 1, ground wire missing. Move the yellow probe the way Alta asks, then fix the circuit.",
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
      { param: "Unit tests", value: "≈525", note: "JUnit over logic extracted from ViewModels" },
      { param: "Schema migrations", value: "15", note: "hand-written, no data loss" },
      { param: "In daily use", value: "since Jan 2026", note: "the longest-running codebase" },
    ],
    stack: ["Kotlin", "Jetpack Compose", "Room", "SQLCipher", "WorkManager", "Glance", "ML Kit", "Firebase"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Apex-Tracker" }],
    errata: [
      "The receipt parser passed every test and then read the street number from the shop's address. Text recognition returns labels and amounts as separate blocks. Lesson: it isn't done until it has run on a device.",
    ],
    figure: "A study session that crosses midnight. Two code paths banked the same time to different days, until they shared one.",
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
      { param: "Transport", value: "BLE GATT", note: "indexed chunks, gzip" },
      { param: "Translation", value: "22 languages", note: "on-device, plus text-to-speech" },
      { param: "Internet required", value: "none", note: "after the first device has the alert" },
    ],
    stack: ["Flutter", "Dart", "Kotlin", "Swift", "BLE / GATT", "SQLite", "BlueZ", "Raspberry Pi"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Echo" }],
    errata: [
      "No recorded end-to-end hardware test and no automated multi-hop test.",
      "Continuous background relay is blocked by an advertisement metadata mismatch, documented in the README. The figure shows the intended path.",
    ],
    figure: "The tower is down. Click a phone to give it the alert and watch it hop, chunk by chunk.",
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
      { param: "Write paths to GitHub", value: "1", note: "act.yml, started only by a tap" },
      { param: "Tests", value: "≈280", note: "37 on the guard hook alone" },
      { param: "Merged upstream", value: "Soup, fusioncore", note: "9.8k★ and 380★ projects" },
    ],
    stack: ["Python", "GitHub Actions", "Claude Code hooks", "Cloudflare Workers", "Cloudflare Access", "pytest"],
    links: [
      { label: "GitHub", href: "https://github.com/aadityad12/oss-scout" },
      { label: "My contributions", href: OSS },
    ],
    errata: ["GitHub often starts the scheduled scan hours late, so the morning email can be quiet. Zero ready items is a normal night."],
    figure: "Two ways to reach GitHub. Only one of them has a switch, and you are holding it.",
    compact: true,
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
      { param: "Scoring dimensions", value: "6", note: "adherence, tools, format, skills, latency, recovery" },
      { param: "Offline protocol test", value: "deterministic", note: "make test-integration" },
    ],
    stack: ["Python", "FastAPI", "JSON Schema", "SSE", "Gemini", "DeepSeek", "React"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Temper" }],
    errata: [
      "The offline scores are fixture constants, not live measurements. The fixture is the achievement, not the score.",
      "Sessions are in memory with no expiry, and the coding benchmark runs submitted Python unsandboxed.",
    ],
    figure: "The protocol, one step at a time. Deltas are shown by sign only.",
    compact: true,
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
      { param: "Surge threshold", value: "> 10 calls / 60 s", note: "sampled every 5 s" },
      { param: "Heavy-asset hold", value: "60 s", note: "explicit confirmation" },
    ],
    stack: ["Python", "FastAPI", "WebSockets", "React", "TypeScript", "Claude Haiku"],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Clear-Dispatch" }],
    errata: ["Synthetic scenarios and in-memory state only. No test suite beyond a six-stage smoke script."],
    figure: "MONITOR's timing. Inject calls and watch the mode flip. Heavy assets wait for you.",
    compact: true,
  },
];

export const REVISIONS = [
  {
    rev: "D",
    date: "Aug 2026 →",
    title: "Teaching Assistant, ENGR 10: Introduction to Engineering",
    org: "San José State University",
    points: [
      "Invited back to TA the course one semester after taking it.",
      "Run two weekly lab sections of 30 students who solder IR receiver boards and build and program VEX robots, and debug their circuits and code live at the bench.",
    ],
  },
  {
    rev: "C",
    date: "Apr–Jun 2026",
    title: "Research Intern and Technical Lead, VisionAssist",
    org: "Infineon Technologies (in collaboration with De Anza College)",
    points: [
      "Led software on a five-person team building an offline navigation aid for blind users on a Raspberry Pi 5.",
      "Characterized Infineon's 60 GHz radar, root-caused its phantom readings, delivered the analysis to Infineon, and demoed the finished device to the sponsors.",
    ],
    link: "#visionassist",
  },
  {
    rev: "B",
    date: "Apr–Dec 2025",
    title: "Co-Founder and Co-President, Applied Data Analytics Club",
    org: "De Anza College",
    points: ["Started the campus's first applied-ML student group, grew it to 54 members, and built its workshop program from scratch."],
  },
  {
    rev: "A",
    date: "Jan–Dec 2025",
    title: "Teaching Assistant and Computer Science Tutor",
    org: "De Anza College",
    points: [
      "TA for x86 assembly, computer architecture, and both introductory C++ courses.",
      "Traced student bugs from symptom back to root cause instead of handing over fixes.",
    ],
  },
];

export const EDUCATION = [
  {
    school: "San José State University",
    degree: "B.S. Computer Engineering, Minor in Artificial Intelligence",
    when: "Expected May 2028",
    note: "GPA 3.8 · Dean's Scholar",
  },
  {
    school: "De Anza College",
    degree: "Certificate of Achievement, Programming in C/C++, with Honors",
    when: "Mar 2026",
    note: "GPA 3.8 · Dean's List",
  },
];

export const COURSEWORK =
  "Computer Organization and Architecture · Algorithms and Data Structure Design · Software Engineering · AI and Data Engineering · Circuit Analysis · Discrete Mathematics · Linear Algebra";

export const AWARDS = [
  { t: "Sponsor Track winner", d: "UC Berkeley AI Hackathon 2026 · Accordion" },
  { t: "2nd place", d: "DA Hacks 3.5 · ClassPath AI" },
  { t: "Top 10 at site", d: "ICPC 2025 Regionals, Division 2" },
  { t: "Most Valuable Peer", d: "HackStorm 2.0, May 2026" },
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
  { name: "Soup", stars: "9.8k★", what: "Strip bidi controls and invisible separators from terminal output, so a dataset row can't hide what's displayed.", href: "https://github.com/MakazhanAlpamys/Soup/pull/1953" },
  { name: "fusioncore", stars: "380★", what: "Tests for the robot_localization config converter, and clear failures on empty or malformed input.", href: "https://github.com/manankharwar/fusioncore/pull/171" },
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
