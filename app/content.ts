// Every word on the page lives here. Facts follow Aadi's master reference and the project repos.

export const RESUME = "/Aaditya_Desai_Portfolio_Resume.pdf";
export const EMAIL = "aaditya.d.desai@gmail.com";
export const GITHUB = "https://github.com/aadityad12";
export const LINKEDIN = "https://www.linkedin.com/in/aaditya-desai-12d";
export const DEVPOST = "https://devpost.com/aadityad12";
export const OSS = "https://oss.aadityad.dev";

export type Link = { label: string; href: string };
export type Badge = { text: string; win?: boolean };
export type Visual =
  | { kind: "image"; src: string; alt: string; frame?: "photo" | "plate" | "ui" | "terminal" | "chart" }
  | { kind: "phone"; src: string; alt: string }
  | { kind: "video"; src: string; poster: string; label: string }
  | { kind: "artifact"; label: string };

export type Project = {
  id: string;
  title: string;
  kicker: string;
  hook: string;
  summary: string;
  built: string[];
  stack: string[];
  badges: Badge[];
  links: Link[];
  where: string;
  when: string;
  pin?: string;
  stamp?: string;
  stampBg: string;
  visual: Visual;
};

export const HERO = {
  eyebrow: "Computer Engineering · San José State · Class of 2028",
  lead: "I build from the metal up: hand-written ARM64 machine code, bare-metal firmware, on-device vision, and tools for AI agents.",
  intro:
    "I'm a computer engineering student at SJSU. I led the software for a wearable obstacle detector with Infineon Technologies, and I helped build Accordion, a context manager for AI coding agents that won its track at the UC Berkeley AI Hackathon and has 240+ stars on GitHub.",
  avail: "Open to Summer 2027 internships and Winter 2027 co-ops in software, AI/ML, and embedded systems.",
};

export const PROOF = [
  { big: "Infineon", small: "Research intern and technical lead", href: "#experience" },
  { big: "Winner", small: "UC Berkeley AI Hackathon 2026", href: "#accordion" },
  { big: "38.8×", small: "faster with my ARM64 JIT", href: "#rung" },
  { big: "3.8 GPA", small: "Dean's Scholar at SJSU", href: "#education" },
];

export const PROJECTS: Project[] = [
  {
    id: "visionassist",
    title: "VisionAssist",
    kicker: "Embedded vision · Infineon Technologies",
    hook: "A wearable that spots obstacles and tells you how many steps away they are. No phone, no cloud.",
    summary:
      "A head-mounted Raspberry Pi 5 and camera that detect obstacles, estimate their distance, and announce the most urgent one through Bluetooth earbuds, entirely on the device. Built by a team of five with Infineon Technologies and demoed to Infineon's sponsors.",
    built: [
      "Led the software and built the whole pipeline, from camera capture to **YOLOv8n detection at about 200 ms a frame** on the Pi 5's CPU, distance estimation, and risk-ranked speech **in feet and steps**.",
      "Evaluated Infineon's **60 GHz radar**, traced its phantom close-range readings to antenna leakage and floor reflections, and delivered the analysis to Infineon.",
      "Shipped it as a **headless systemd service** that boots on power-up, with a phone web app and live annotated video stream as a second output.",
    ],
    stack: ["Python", "PyTorch", "YOLOv8", "OpenCV", "Picamera2", "Flask", "Piper TTS", "systemd", "Raspberry Pi 5"],
    badges: [{ text: "Infineon Technologies", win: true }, { text: "Software lead · team of 5" }, { text: "Demoed to sponsors" }],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Vision-Assist" }],
    where: "De Anza College, Cupertino",
    when: "APR–JUN 2026",
    pin: "visionassist",
    stamp: "ridge:deanza",
    stampBg: "#DCD7F0",
    visual: { kind: "image", frame: "photo", src: "/projects/visionassist-device.jpg", alt: "VisionAssist's Raspberry Pi 5 in a red 3D-printed case with a cooling fan, and an Arducam camera module mounted on top" },
  },
  {
    id: "accordion",
    title: "Accordion",
    kicker: "AI developer tools · UC Berkeley AI Hackathon 2026",
    hook: "Lets AI coding agents forget without losing anything, so long sessions stay sharp.",
    summary:
      "Coding agents get worse as their context fills up, and the usual fix, summarizing the session, throws information away. Accordion folds stale blocks out of the agent's view instead, so anything can come back, and it won the Sponsor Track at the UC Berkeley AI Hackathon 2026.",
    built: [
      "Built the conductor's **health and evaluation layer**: health metrics, folding and session evaluators, and a harness that benchmarks folding against naive compaction.",
      "Added a **cross-encoder rerank stage** (MS MARCO MiniLM) that decides what to unfold, plus retention telemetry and a fact ledger.",
      "Ported the conductor onto Accordion's fold, replace, and group contract, and built the **activity dashboard** that shows every fold decision.",
    ],
    stack: ["TypeScript", "Hugging Face Transformers", "SvelteKit", "Tauri", "Node.js", "WebSockets"],
    badges: [{ text: "🏆 Sponsor Track winner", win: true }, { text: "★ 240+ on GitHub" }, { text: "10,000+ site visits" }],
    links: [
      { label: "get-accordion.dev", href: "https://get-accordion.dev" },
      { label: "GitHub", href: "https://github.com/a-Fig/accordion" },
    ],
    where: "UC Berkeley",
    when: "JUN 2026",
    pin: "accordion",
    stamp: "lm:campanile",
    stampBg: "#D9E8DD",
    visual: { kind: "video", src: "/projects/accordion-demo.mp4", poster: "/projects/accordion-poster.jpg", label: "Accordion's context map folding and unfolding blocks of a live coding-agent session" },
  },
  {
    id: "rung",
    title: "Rung",
    kicker: "Compilers and runtimes · Solo",
    hook: "One programming language, built five times over, down to hand-written ARM64 machine code.",
    summary:
      "To measure what each classic interpreter speed-up is actually worth, I built one small language five ways: a tree-walker, a stack VM, a register VM, a baseline ARM64 JIT, and a background-thread JIT. All five share one runtime and garbage collector and must print byte-identical output.",
    built: [
      "The JIT runs recursive fib **38.8× faster than the tree-walker**, and when a type guard fails it bails out mid-function and resumes in the VM, even several calls deep.",
      "Hand-wrote the **ARM64 instruction encoder**, verified byte for byte against the LLVM assembler, and a background compiler that cut warmup p99 from 0.89 ms to 0.28 ms.",
      "Hardened with **ASan, UBSan, TSan, and libFuzzer** in CI on three platforms, and root-caused a crash in 5% of Linux ARM64 runs to UBSan reading 8 bytes before a JIT entry point.",
    ],
    stack: ["C++20", "ARM64", "CMake", "Clang", "libFuzzer", "ASan / UBSan / TSan", "Docker", "GitHub Actions"],
    badges: [{ text: "38.8× speed-up", win: true }, { text: "Solo" }, { text: "Released v0.1.0" }],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/rung" }],
    where: "Home, Santa Clara",
    when: "SEP–OCT 2026",
    pin: "home",
    stamp: "ridge:home",
    stampBg: "#F6DCD3",
    visual: { kind: "image", frame: "terminal", src: "/projects/rung-jit.gif", alt: "Terminal output: Rung compiles a function to ARM64, then a float fails the integer type guard and the VM finishes the call" },
  },
  {
    id: "alta",
    title: "Alta",
    kicker: "Hardware and firmware · Cal Hacks 13.0",
    hook: "A voice lab TA that measures your breadboard and walks you to the fault.",
    summary:
      "Alta reads real voltages off a student's breadboard through a probe pod, talks with them by voice, and walks them to the fault the way a good TA does, without handing over the answer. Built in 36 hours by a team of four.",
    built: [
      "Owned the hardware and firmware: the probe pod runs **bare-metal C on the ATmega328P's registers**, with interrupt-driven ADC, UART, and timer code, no Arduino libraries, in 4.6 KB of flash.",
      "Each probe gets **about 1,200 reads a second**, corrected against the measured supply voltage and streamed as a JSON line every 50 ms. In a 60 s soak test it sent 1,199 samples with **zero bad lines**.",
      "Built the board overlay engine and the probe monitor that spots a changed reading and confirms the fix on its own. On the real board, Alta **found and fixed the fault in 3 of 3 timed runs**.",
    ],
    stack: ["C", "avr-gcc", "ATmega328P", "simavr", "Python", "OpenCV", "Arduino Uno"],
    badges: [{ text: "Bare-metal firmware", win: true }, { text: "Hardware lead · team of 4" }, { text: "Built in 36 hours" }],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Alta" }],
    where: "Cal Hacks 13.0",
    when: "OCT 2026",
    stampBg: "#F3E7C9",
    visual: { kind: "image", frame: "ui", src: "/projects/alta-setup.png", alt: "Alta's bench: a phone camera over the student's breadboard, the probe pod in its printed dock, and a laptop showing 'Yellow 5.01 V (expect about 2)'" },
  },
  {
    id: "oss-scout",
    title: "OSS Scout",
    kicker: "Automation and security design · Solo",
    hook: "An agent pipeline that finds open-source work every night, and can't post a thing without my approval.",
    summary:
      "Maintainers are buried in low-effort, machine-generated pull requests. OSS Scout automates the tedious parts of contributing, like finding good issues and reading unfamiliar code, and leaves every decision to me; its work has landed merged PRs upstream.",
    built: [
      "A nightly scan in plain Python on GitHub Actions ranks issues by **how each project treats outside contributors**: merge rate, time to merge, and time to first maintainer reply.",
      "An agent prepares **at most one tested draft fix a night** for a private dashboard behind Cloudflare Access, with an 8 am email digest.",
      "**Least privilege by design**: a tested guard hook blocks every GitHub write from the agent, and the only write token lives in a private repo it never sees. About **280 tests** cover it.",
    ],
    stack: ["Python", "GitHub Actions", "Claude Code hooks", "Cloudflare Workers", "Cloudflare Access", "pytest"],
    badges: [{ text: "Merged PRs upstream", win: true }, { text: "Solo" }, { text: "~280 tests" }],
    links: [
      { label: "GitHub", href: "https://github.com/aadityad12/oss-scout" },
      { label: "My contributions", href: OSS },
    ],
    where: "Home, Santa Clara",
    when: "SEP–OCT 2026",
    pin: "home",
    stamp: "ridge:home",
    stampBg: "#E4E0F5",
    visual: { kind: "artifact", label: "The nightly loop: scan, prepare, review, act, track. Only one path can write to GitHub, and it waits for my tap." },
  },
  {
    id: "apextracker",
    title: "ApexTracker",
    kicker: "Android · Solo",
    hook: "One app that replaced my sticky notes, three reminder apps, a calendar, and a budget spreadsheet.",
    summary:
      "It started as a way to make myself build every day and became the app I open most. It tracks budget, study time, screen time, reminders, notes, and a research-paper queue, then scores each day by the goals I actually hit, fully offline.",
    built: [
      "Offline-first on Room with **SQLCipher encryption at rest** under an Android Keystore key, plus a biometric lock on budget and notes.",
      "**Five home-screen widgets**, exact alarms that survive reboots, on-device receipt scanning with ML Kit, and optional Firebase sync.",
      "Schema version 26 with **15 hand-written migrations**, about **525 unit tests**, and Compose screenshot tests.",
    ],
    stack: ["Kotlin", "Jetpack Compose", "Room", "SQLCipher", "Firebase", "WorkManager", "ML Kit", "Glance"],
    badges: [{ text: "In daily use since Jan 2026", win: true }, { text: "Solo" }, { text: "525+ tests" }],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Apex-Tracker" }],
    where: "Home, Santa Clara",
    when: "SINCE JAN 2026",
    pin: "home",
    stamp: "ridge:home",
    stampBg: "#F3E7C9",
    visual: { kind: "phone", src: "/projects/apextracker-dashboard.jpg", alt: "ApexTracker's graphite dashboard: daily goal score and a consistency chart" },
  },
  {
    id: "gazeboard",
    title: "GazeBoard",
    kicker: "On-device ML · Qualcomm × Google LiteRT Hackathon",
    hook: "Lets someone who can't speak or use their hands talk by looking at a phone.",
    summary:
      "The front camera finds the face, crops one eye, and Qualcomm's EyeGaze model estimates where the person is looking; a one-second look picks a phrase or a letter group, and the phone speaks. Nothing leaves the device: the app has no internet permission at all.",
    built: [
      "Owned the inference path: EyeGaze running **only on the Snapdragon's Hexagon NPU** through LiteRT, at **about 8 ms per inference and 15+ FPS** on a Galaxy S25 Ultra.",
      "Made failure loud: if the NPU can't load the model, the app says so instead of silently falling back to a slower accelerator.",
      "Built the debug overlay and the recalibration flow, and tuned spelling mode's word prediction to a **378-word dictionary**.",
    ],
    stack: ["Kotlin", "Jetpack Compose", "CameraX", "ML Kit", "LiteRT", "Hexagon NPU"],
    badges: [{ text: "NPU-only inference", win: true }, { text: "Camera permission only" }, { text: "Team of 3" }],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/GazeBoard" }],
    where: "Sunnyvale",
    when: "APR 30 2026",
    pin: "gazeboard",
    stamp: "ridge:sunnyvale",
    stampBg: "#DCE6F2",
    visual: { kind: "artifact", label: "Gaze picks a letter group, the dictionary predicts the word, and the phone speaks it." },
  },
  {
    id: "echo",
    title: "Echo",
    kicker: "Bluetooth · Offline-first · Hack for Humanity 2026",
    hook: "Emergency alerts that travel phone to phone over Bluetooth when the network goes down.",
    summary:
      "Weather alerts depend on networks that fail during the very disasters they warn about. Echo passes National Weather Service alerts between nearby phones over Bluetooth Low Energy, with every phone both listening and broadcasting.",
    built: [
      "Ported the app from native Android to **Flutter during the hackathon**, bridging native Kotlin and Swift GATT servers through platform channels.",
      "Built the Dart BLE scanner and client, the **chunked, gzipped transfer protocol**, SQLite storage, and the National Weather Service feed.",
      "Built a **Raspberry Pi relay** on BlueZ D-Bus with its own tests, and wrote the protocol spec.",
    ],
    stack: ["Flutter", "Dart", "Kotlin", "Swift", "BLE / GATT", "SQLite", "Raspberry Pi"],
    badges: [{ text: "Works with no internet", win: true }, { text: "Android and iOS" }, { text: "Team of 3" }],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Echo" }],
    where: "Santa Clara University",
    when: "FEB 28 2026",
    pin: "echo",
    stamp: "ridge:scu",
    stampBg: "#F6DCD3",
    visual: { kind: "phone", src: "/projects/echo-alert.jpg", alt: "Echo showing a severe weather alert received over Bluetooth" },
  },
  {
    id: "temper",
    title: "Temper",
    kicker: "AI evaluation · AI Engineer World's Fair Hackathon 2026",
    hook: "Finds where an AI agent's own prompts and tools make it worse, then patches them.",
    summary:
      "A model's system prompt, skills, and tools can quietly make it worse. Temper asks the same questions with and without that harness, has a judge score both across six dimensions, then rewrites whatever failed and re-tests just those parts.",
    built: [
      "Wrote the spec, API contract, and JSON Schemas, then built **both the local client and the FastAPI cloud service**, with Gemini judging against a **bare DeepSeek baseline**.",
      "Built the **patch loop** that rewrites failing files and re-evaluates only those dimensions, plus a pi extension that streams results to a live dashboard.",
      "Wrote a deliberately flawed \"villain\" agent with an answer key, so the full evaluate, patch, re-evaluate loop **runs offline with no API keys**.",
    ],
    stack: ["Python", "FastAPI", "JSON Schema", "SSE", "Gemini", "DeepSeek", "Rich"],
    badges: [{ text: "Evaluate · patch · re-test", win: true }, { text: "Team of 3" }],
    links: [{ label: "GitHub", href: "https://github.com/aadityad12/Temper" }],
    where: "Ferry Building, San Francisco",
    when: "JUN 27–28 2026",
    pin: "temper",
    stamp: "lm:ferryBuilding",
    stampBg: "#DCE6F2",
    visual: { kind: "image", frame: "plate", src: "/projects/temper-logo.jpg", alt: "The Temper logo" },
  },
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
    tag: "three.js · Next.js",
    text: "The Bay Area map up top is built from real elevation data and drawn as ink ridgelines, with hand-modelled landmarks, a running Caltrain, and Pathfinder, my robot, who rides it to whichever project you pick.",
    href: "https://github.com/aadityad12/aadityad.dev",
    link: "GitHub",
  },
];

export const OPEN_SOURCE = [
  {
    repo: "MakazhanAlpamys/Soup",
    stars: "9.8k★",
    what: "LLM fine-tuning toolkit",
    pr: "Strip bidi controls and invisible separators from terminal output, so a dataset row can't reorder or hide what's displayed.",
    href: "https://github.com/MakazhanAlpamys/Soup/pull/1953",
  },
  {
    repo: "manankharwar/fusioncore",
    stars: "380★",
    what: "ROS 2 localization for outdoor robots",
    pr: "Tests for the robot_localization config converter, and clear failures on empty or malformed input.",
    href: "https://github.com/manankharwar/fusioncore/pull/171",
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
      "Evaluated Infineon's 60 GHz radar, showed camera-radar fusion needed 3D localization beyond the project's scope, and delivered the findings to Infineon.",
      "Demoed the finished device to Infineon's sponsors.",
    ],
    link: { label: "VisionAssist", href: "#visionassist" },
  },
  {
    when: "Aug 2026 to now",
    where: "San José, CA",
    role: "Teaching Assistant, ENGR 10: Introduction to Engineering",
    org: "San José State University",
    points: [
      "Brought back to TA the course one semester after taking it, where I wrote the control code for the fastest robot run in my section.",
      "Run two weekly lab sections of 30 students who solder IR receiver boards and build and program VEX robots in C++ and RobotC.",
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

export const AWARDS = [
  { title: "Sponsor Track Winner", detail: "UC Berkeley AI Hackathon 2026 · Accordion", win: true },
  { title: "2nd Place", detail: "DA Hacks 3.5 · ClassPath AI", win: true },
  { title: "Top 10 at site", detail: "ICPC 2025 Regionals, Division 2" },
  { title: "Most Valuable Peer", detail: "HackStorm 2.0 · peer-nominated" },
  { title: "Fastest run in section", detail: "SJSU ENGR 10 robot challenge · 14.41 s" },
  { title: "Dean's Scholar", detail: "San José State University" },
];

export const CERTS = [
  "AWS Certified Cloud Practitioner",
  "Oracle Cloud Infrastructure Generative AI Professional",
  "Model Context Protocol: Advanced Topics (Anthropic)",
  "Claude Code in Action (Anthropic)",
];

export const SKILLS = [
  { area: "Languages", items: ["C++", "C", "Python", "Kotlin", "TypeScript", "JavaScript", "SQL", "ARM64 assembly", "x86 assembly", "Dart", "Swift"] },
  { area: "Systems and hardware", items: ["Linux", "Raspberry Pi", "ATmega328P", "PSoC 6", "BLE / GATT", "Hexagon NPU", "systemd", "Soldering", "CAD", "3D printing"] },
  { area: "AI and ML", items: ["PyTorch", "YOLOv8", "OpenCV", "Hugging Face Transformers", "LiteRT", "ML Kit", "Vertex AI", "Claude API", "Claude Code"] },
  { area: "Infrastructure and testing", items: ["GitHub Actions", "Docker", "CMake", "Cloudflare Workers", "Firebase", "ASan / UBSan / TSan", "libFuzzer", "pytest", "JUnit"] },
  { area: "Frameworks", items: ["FastAPI", "Flask", "React", "Next.js", "SvelteKit", "Jetpack Compose", "Flutter", "Room", "three.js"] },
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

export const ABOUT = [
  "I'm from India, and I got into engineering through VEX robotics, programming robots in RobotC. It came full circle at SJSU: I wrote the control code for my team's robot in ENGR 10, posted the fastest run in the section, and was brought back the next semester to teach the course. I started out headed for computer science and switched to computer engineering to get closer to the hardware.",
  "Most of what I build starts with something I need or want to understand. ApexTracker began as a way to make myself code every day and ended up running my life. Rung started because I wanted numbers, not claims, for how interpreters get fast. I like work where I can measure the result, and I like being the person who traces a bug all the way down to its cause.",
  "Outside engineering I follow F1, basketball, soccer, and cricket, and I go to Bay Area AI and ML meetups. Long term, I want to start a company.",
];
