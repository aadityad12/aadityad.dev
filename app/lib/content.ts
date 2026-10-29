export const person = {
  name: "Aaditya Desai",
  email: "aaditya.d.desai@gmail.com",
  github: "https://github.com/aadityad12",
  linkedin: "https://www.linkedin.com/in/aaditya-desai-12d",
  resume: "/Aaditya_Desai_Portfolio_Resume.pdf",
  location: "Santa Clara, California",
};

export type Layer = {
  id: string;
  kicker: string;
  name: string;
  line: string;
  proof: string;
  proofLabel: string;
};

export const layers: Layer[] = [
  {
    id: "apextracker",
    kicker: "Day",
    name: "ApexTracker",
    line: "The app I open instead of a pile of post-its.",
    proof: "5",
    proofLabel: "home-screen widgets, from local data",
  },
  {
    id: "gazeboard",
    kicker: "Glance",
    name: "GazeBoard",
    line: "Four targets. The camera frame stays on the phone.",
    proof: "~8 ms",
    proofLabel: "inference on a Galaxy S25 Ultra",
  },
  {
    id: "accordion",
    kicker: "Memory",
    name: "Accordion",
    line: "Fold stale context. The original block stays.",
    proof: "200+",
    proofLabel: "stars on the team repository",
  },
  {
    id: "visionassist",
    kicker: "Sight",
    name: "VisionAssist",
    line: "One spoken warning. The radar stayed on the bench.",
    proof: "~200 ms",
    proofLabel: "per frame on a Raspberry Pi 5",
  },
  {
    id: "rung",
    kicker: "Metal",
    name: "Rung",
    line: "Five engines, one language. The slow rung stays on the chart.",
    proof: "4.54×",
    proofLabel: "fib, native code versus the register VM",
  },
];

export const proofs = [
  { kicker: "Berkeley, 2026", value: "Sponsor track", detail: "Accordion, with a team of four" },
  { kicker: "Rung, one M1 Pro", value: "4.54× and 0.63×", detail: "The fast fib, and the sieve row I kept" },
  { kicker: "GazeBoard", value: "No network", detail: "~8 ms on-device, zero network permissions" },
  { kicker: "Infineon × De Anza", value: "Radar cut", detail: "VisionAssist shipped the camera estimate" },
];

export type Fact = { label: string; text: string };
export type Link = { href: string; label: string; primary?: boolean };

export type Project = {
  id: string;
  exhibit: "fold" | "ladder" | "dwell" | "sight" | "local" | "scout" | "echo" | "protocol";
  index: string;
  kicker: string;
  title: string;
  headline: string;
  lede: string;
  caption: string;
  facts: Fact[];
  stack: string;
  links: Link[];
};

export const projects: Project[] = [
  {
    id: "accordion",
    exhibit: "fold",
    index: "01",
    kicker: "Agents · UC Berkeley, 2026",
    title: "Accordion",
    headline: "Hide it. Keep it.",
    lede: "Coding agents run out of context. The usual fix is to crush the session into one summary and hope the next step didn’t need the detail you just deleted. Accordion keeps the whole session, and shows a smaller view to the model.",
    caption: "Fig. 2 — Folding changes what the model sees. It does not delete the block. Compaction does. The recording is the real context map. The blocks above it are a model, not a live session.",
    facts: [
      {
        label: "The constraint",
        text: "A long session has to get smaller or the model stops. A summary makes room by destroying the original. If the summary was wrong, there is nothing to unfold.",
      },
      {
        label: "What I built",
        text: "Through June 2026 I worked on the conductor, the part that decides what to fold. I built health metrics, evaluators, and a harness that compares a session with naive compaction. I added a cross-encoder rerank (MiniLM) for what to unfold, ported the conductor onto Accordion’s fold, replace, and group contract, and built a dashboard of each decision. With Tyler Darisme, Sheel Shah, and Thy Tang.",
      },
      {
        label: "What I won’t claim",
        text: "The 5-of-6 SlopCodeBench result is the team’s Thermocline conductor, on one hackathon-scale run. It is not a number for my work. The repository has over 200 stars. We won The Token Company sponsor track at the 2026 UC Berkeley AI Hackathon.",
      },
    ],
    stack: "TypeScript · SvelteKit · Hugging Face Transformers",
    links: [
      { href: "https://get-accordion.dev", label: "get-accordion.dev", primary: true },
      { href: "https://github.com/a-Fig/accordion", label: "Team repository" },
    ],
  },
  {
    id: "rung",
    exhibit: "ladder",
    index: "02",
    kicker: "Languages · solo · 2026",
    title: "Rung",
    headline: "Every speedup earned.",
    lede: "A small language in C++20, built five ways from a tree-walker to handwritten ARM64. Same programs, same answers. The ladder measures what each classic optimization actually buys, including the steps that lose.",
    caption: "Fig. 3 — One M1 Pro. The chart can show the step versus the previous rung, or the running total versus the tree-walker. A red bar lost ground. An outline means the JIT compiled nothing and the VM ran it. Published results, not a live run in the browser.",
    facts: [
      {
        label: "The constraint",
        text: "Interpreter optimizations sound inevitable in a textbook. I wanted the number for each one, without changing what a program prints. The foundations follow Crafting Interpreters and Lua 5.0. The ladder, the JIT, and the measurement are mine.",
      },
      {
        label: "What I built",
        text: "A shared frontend and runtime, then a tree-walker, stack VM, register VM, synchronous ARM64 JIT, and a background compiler. The encoder is checked against LLVM’s assembler. A failed type guard returns to the exact bytecode instruction, even several calls deep. On fib, native code was 4.54× the optimized register VM in one session: 13.37 ms to 2.94 ms. A hot loop, loop_sum, ran 22.4× the tree-walker.",
      },
      {
        label: "What I won’t claim",
        text: "One M1 Pro. The JIT is ARM64-only and compiles two of the six main benchmarks; the other four fall back to the VM. NaN-boxing slowed all six. The worst step was 0.63× on sieve, and it stays in the table. About 5% of Linux ARM64 runs crashed because UBSan read 8 bytes before the call target. Earlier rungs were not all measured in one sitting.",
      },
    ],
    stack: "C++20 · ARM64 · CMake · ASan / UBSan / TSan",
    links: [
      { href: "https://github.com/aadityad12/rung", label: "Source and results", primary: true },
    ],
  },
  {
    id: "gazeboard",
    exhibit: "dwell",
    index: "03",
    kicker: "On-device · Qualcomm × Google, 2026",
    title: "GazeBoard",
    headline: "A glance, then a voice.",
    lede: "A communication board for someone who can’t reliably speak or use their hands. Four large targets, a one-second dwell, speech on the phone. The camera is pointed at a face, so a frame that leaves the device is a broken product.",
    caption: "Fig. 4 — Hold a target for one second. A pointer or the keyboard stands in for a gaze. This page never opens a camera.",
    facts: [
      {
        label: "The constraint",
        text: "The interface has to be usable without touch, and the frames have to stay on the phone. A quiet fallback to another chip would hide the hardware the demo was about.",
      },
      {
        label: "What I built",
        text: "The Kotlin path from CameraX and ML Kit face detection through LiteRT on the Hexagon NPU, four-point calibration, dwell selection, and speech. On the Galaxy S25 Ultra at the hackathon, inference measured about 8 ms, above 15 frames per second. The app declares no network permission. Team project at the Qualcomm × Google LiteRT hackathon.",
      },
      {
        label: "What I won’t claim",
        text: "A research prototype, not a validated assistive device. The 8 ms figure is that hackathon device, not a number I have turned into a general claim. Four targets are easier to hit than a keyboard, and slower to say something with.",
      },
    ],
    stack: "Kotlin · Jetpack Compose · CameraX · ML Kit · LiteRT",
    links: [
      { href: "https://github.com/aadityad12/GazeBoard", label: "Source", primary: true },
    ],
  },
  {
    id: "visionassist",
    exhibit: "sight",
    index: "04",
    kicker: "Embedded · Infineon × De Anza, 2026",
    title: "VisionAssist",
    headline: "One warning. The radar stayed.",
    lede: "A head-mounted Raspberry Pi that sees an obstacle, estimates how far it is, and says so. No phone and no cloud. I led the software on a five-person team and cut the sensor that could not be honest.",
    caption: "Fig. 5 — The project’s rules, on an example scene. The radar readout is the failure mode, not a logged measurement. Not a live camera, and not a safety device.",
    facts: [
      {
        label: "The constraint",
        text: "A Pi 5 cannot announce every detection, and a spoken warning has to be about the object in front of the person. The sponsor’s 60 GHz radar could range a reflection. It could not say which object that reflection was.",
      },
      {
        label: "What I built",
        text: "The on-device loop: camera, YOLOv8n at about 200 ms a frame on CPU, distance from bounding-box height, risk and zone rules, one subject, Piper speech, and a headless systemd service. Software lead, with Oak, Michael, Cara, and Ziyi. Advisor Saied Rafati. April–June 2026.",
      },
      {
        label: "What I won’t claim",
        text: "Distance overestimates inside about four feet, because a cropped object looks shorter and the formula reads that as farther. It does not see stairs or drop-offs. There is no measured error bar. I traced the radar’s phantom close readings to antenna leakage and floor reflections, told Infineon, and shipped the camera estimate instead.",
      },
    ],
    stack: "Python · YOLOv8n · OpenCV · Raspberry Pi 5 · Piper",
    links: [
      { href: "https://github.com/aadityad12/Vision-Assist", label: "Source and the radar write-up", primary: true },
    ],
  },
  {
    id: "apextracker",
    exhibit: "local",
    index: "05",
    kicker: "Android · solo · 2026",
    title: "ApexTracker",
    headline: "Built for a user I can’t ignore.",
    lede: "Budget, study, reminders, notes, papers, and a score for the day, in one app I actually open. It started as a reason to write code every day. It replaced the post-its and spreadsheets.",
    caption: "Fig. 6 — The real dashboard, and a model of what still works with no account. Sample architecture, not a second copy of the app.",
    facts: [
      {
        label: "The constraint",
        text: "A daily tool that waits for a login, a network, or a reboot is a tool I will stop using. Room had to be the source of truth. An account could only add something.",
      },
      {
        label: "What I built",
        text: "The app, end to end. Encrypted Room storage, biometrics where it matters, five Glance widgets, reboot-safe alarms, handwritten migrations, on-device receipt parsing, JUnit tests, lint, and Compose screenshot tests. Firestore sync is optional.",
      },
      {
        label: "What I won’t claim",
        text: "I am the user. This is not adoption, and it is not a shipped product with a store listing to hide behind. The useful result is that I still run it.",
      },
    ],
    stack: "Kotlin · Jetpack Compose · Room · SQLCipher · Glance",
    links: [
      { href: "https://github.com/aadityad12/Apex-Tracker", label: "Source", primary: true },
    ],
  },
  {
    id: "ossscout",
    exhibit: "scout",
    index: "06",
    kicker: "Agents · solo · 2026",
    title: "OSS Scout",
    headline: "The agent drafts. A person publishes.",
    lede: "A nightly scan for open bugs and beginner issues, scored by how a project treats outside contributors. An agent may prepare one tested draft. It cannot be the thing that writes to GitHub.",
    caption: "Fig. 7 — A model of one night. The draft is sample text. Nothing on this page touches GitHub.",
    facts: [
      {
        label: "The constraint",
        text: "An unattended agent with a write token will eventually use it. The useful version of this tool is the one that still needs a person at the only step that is public.",
      },
      {
        label: "What I built",
        text: "A Python scan that scores merge rate, time to merge, and time to a first maintainer reply. A Claude agent prepares at most one tested draft a night for a private dashboard behind Cloudflare Access. A tested hook blocks the agent’s writes. The only write token lives in a separate private repo. About 280 pytest tests cover the pipeline.",
      },
      {
        label: "What I won’t claim",
        text: "I am not claiming merged pull requests from the unattended run. The agent prepares a draft. Publication is a separate, human step.",
      },
    ],
    stack: "Python · GitHub Actions · pytest · Cloudflare Workers",
    links: [
      { href: "https://github.com/aadityad12/oss-scout", label: "Source", primary: true },
    ],
  },
  {
    id: "echo",
    exhibit: "echo",
    index: "07",
    kicker: "Offline · Hack for Humanity",
    title: "Echo",
    headline: "The alert still arrives.",
    lede: "A prototype for carrying National Weather Service alerts between nearby phones when the cellular network is gone. Native Bluetooth on Android and iOS, then speech, including on-device translation.",
    caption: "Fig. 8 — The cloud path is the one that failed. The alert in the screenshot arrived from a relay over Bluetooth, with zero further echoes.",
    facts: [
      {
        label: "The constraint",
        text: "An emergency alert that requires the internet is missing on the day it matters. The phone already has a radio that doesn’t.",
      },
      {
        label: "What I built",
        text: "The native Kotlin and Swift protocol layers: BLE discovery and a chunked GATT transfer, bridged into Flutter, plus compact alert IDs so the same warning is not shown twice. Once an alert is on the phone, it can be translated on-device into 22 languages and read aloud. Hack for Humanity at Santa Clara University.",
      },
      {
        label: "What I won’t claim",
        text: "The build receives an alert from a relay. I am not claiming a measured multi-hop mesh, or a system anyone should depend on in a real warning.",
      },
    ],
    stack: "Flutter · Kotlin · Swift · BLE / GATT",
    links: [
      { href: "https://github.com/aadityad12/Echo", label: "Source", primary: true },
    ],
  },
  {
    id: "temper",
    exhibit: "protocol",
    index: "08",
    kicker: "Evaluation · AI Engineer World’s Fair, 2026",
    title: "Temper",
    headline: "Test the harness, not just the model.",
    lede: "An agent is the model plus the prompts, tools, and skills around it. Those extras can help, or they can make the same model worse. Temper looks for the second case, patches the artifact, and reruns the check it actually failed.",
    caption: "Fig. 9 — The protocol, in order. The offline fixture walks these steps. There is no live-model score on this page.",
    facts: [
      {
        label: "The constraint",
        text: "A benchmark of the base model misses the thing a team can actually change this week. Re-running every dimension after a one-line prompt edit wastes the only signal that moved.",
      },
      {
        label: "What I built",
        text: "The local evaluator, FastAPI service, schemas and contracts, patch loop, deterministic integration path, and a streaming dashboard. The harness is compared with a bare-model baseline. A regression points at a prompt, tool, or skill, and only the affected checks run again.",
      },
      {
        label: "What I won’t claim",
        text: "The strongest evidence is a reproducible offline fixture that checks the protocol. Live-model evaluation is still prototype work. I won’t dress a fixture up as a leaderboard.",
      },
    ],
    stack: "Python · FastAPI · React · JSON Schema",
    links: [
      { href: "https://github.com/aadityad12/Temper", label: "Source", primary: true },
    ],
  },
];

export const also = {
  name: "Clear Dispatch",
  href: "https://github.com/aadityad12/Clear-Dispatch",
  text: "A HackDavis 2026 dispatch simulation. A four-stage FastAPI pipeline, a live WebSocket dashboard, and Haversine assignment. A heavy asset does not move until a person approves it, and the approval expires. Synthetic calls, in-memory state, a three-person team. Not a production emergency system.",
};

export const experience = [
  {
    when: "Aug 2026 — present",
    place: "San José State University",
    role: "Teaching assistant, ENGR 10",
    text: "Two weekly labs of about 30 students. They solder IR boards and program VEX robots in C++ or RobotC. I wrote the control code for my own team’s robot in the course, then came back to teach it.",
  },
  {
    when: "Apr — Jun 2026",
    place: "Infineon Technologies",
    role: "Research intern and technical lead",
    text: "With De Anza College, on VisionAssist. Led the software for a five-person group, from the camera to spoken warnings, and wrote up why the 60 GHz radar did not ship.",
    href: "#visionassist",
    hrefLabel: "The device",
  },
  {
    when: "Jan — Dec 2025",
    place: "De Anza College",
    role: "Teaching assistant and CS tutor",
    text: "C++, x86 assembly, and data structures, across three courses and the lab. The job was to trace a bug from the symptom back to the cause, with someone writing some of their first programs.",
  },
];
