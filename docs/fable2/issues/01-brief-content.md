# 01 · Brief content: the short fields

**Phase**: A · **Size**: M · **Depends on**: nothing · **Unblocks**: everything

## Goal

Add to `app/content.ts` every piece of short copy the new front page, `/work/` and the
skills panel need, so that issues 02 to 08 render fields and never write sentences. Each
new field is a selection or rephrasing of a fact already in the file. Nothing new enters.
Nothing the datasheet uses is removed.

## Source material

- `app/content.ts` (this branch): `HERO`, `PROOF`, `PINS`, `NOTES`, `EXPERIENCE`,
  `EDUCATION`, `AWARDS`, `CERTS`, `OPEN_SOURCE`, `ABOUT`, `ALSO`, `SKILLS`.
- `docs/plan/CONTENT-CORRECTIONS.md`: the barred claims still apply.

## Spec

Add the following, in this order, immediately after the `PROOF` export. Use the copy
verbatim. Where a field is derived from an existing one, the derivation is noted so a
reviewer can trace it.

### `BRIEF`

```ts
// The front page. Everything here is a selection from HERO and NOTES; the long versions stay below.
export const BRIEF = {
  avail: HERO.avail,
  eyebrow: HERO.eyebrow,
  lead: HERO.lead,
  chip: { line: "28 skills, one per pin.", hover: "Hover a pin to see where I used it.", action: "Open the pin map" },
  workIntro: "Four of ten. Each has its own page.",
  moreWork: "Also with a page each:",
  about:
    "I'm from India, and I got into engineering through VEX robotics. It came full circle at SJSU: I wrote the control code for my team's robot in ENGR 10, posted the fastest run in the section, and was brought back the next semester to teach the course. Most of what I build starts with something I need or want to understand, and I like work where I can measure the result. Outside engineering I follow F1, basketball, soccer and cricket.",
  contactKicker: "Summer 2027 internships · Winter 2027 co-ops",
  contactLine: "I'm looking for roles in software, embedded systems, and AI/ML. Email is the fastest way to reach me.",
};
```

`about` is four sentences taken from `ABOUT[0]`, `ABOUT[1]` and `ABOUT[2]` with the
ApexTracker and Rung clauses and the meetups clause removed. Do not change `ABOUT`.

### `FACTS`

Replaces the role of `PROOF` on the front page. Three items, no status, no benchmark.

```ts
export type Fact = { big: string; small: string; href: string };
export const FACTS: Fact[] = [
  { big: "Infineon", small: "Research intern and software lead, 2026. Built an offline navigation aid for blind users.", href: "/work/visionassist/" },
  { big: "Hackathon winner", small: "Sponsor Track, UC Berkeley AI Hackathon 2026, with Accordion.", href: "/work/accordion/" },
  { big: "3.8 GPA", small: "Dean's Scholar. B.S. Computer Engineering, minor in AI, SJSU, May 2028.", href: "#education" },
];
```

Sources: `EXPERIENCE[0]`, `NOTES[accordion].context`, `EDUCATION[0]`. The Accordion star
count is not here: a recruiter cannot judge it (rule 3), and it stays on the Accordion
page in `specs` and `headline` with its `Repo` tag. The `big` values are landmarks; the
`small` lines are body (README, "How a recruiter reads a page").
Keep the `PROOF` export in place until issue 04 deletes `Proof.tsx`; then remove `PROOF`
in that issue if nothing else imports it.

### `FEATURED`

```ts
// Front-page cards, in this order. All four have highlight reels.
export const FEATURED = ["visionassist", "accordion", "rung", "alta"] as const;
```

### `AppNote.where`

Add a required field `where: string` to the `AppNote` type, after `when`: one line for
cards, index rows and the project page header (issue 08), replacing the `context`,
`role` and `when` trio there. It names the venue, the role where it is more than "built
it", and the date. **Never the team size or "solo"**: a recruiter cannot use that, and it
costs a stop. Values:

| id | where |
| --- | --- |
| accordion | `"UC Berkeley AI Hackathon 2026 · Sponsor Track winner"` |
| rung | `"Personal project · Sep to Oct 2026"` |
| visionassist | `"Infineon Technologies · software lead · Apr to Jun 2026"` |
| gazeboard | `"Qualcomm × Google LiteRT Hackathon · Apr 2026"` |
| alta | `"Cal Hacks 13.0 · hardware and firmware lead · Oct 2026"` |
| apextracker | `"Personal · in daily use since Jan 2026"` |
| echo | `"Hack for Humanity 2026 · Feb 2026"` |
| oss-scout | `"Personal project · Sep to Oct 2026"` |
| temper | `"AI Engineer World's Fair Hackathon 2026 · Jun 2026"` |
| clear-dispatch | `"HackDavis 2026 · backend · May 2026"` |

Each is `context`, `role` and `when` of the same note, shortened, with team sizes
dropped. `context`, `role` and `when` stay unchanged; the datasheet still uses them, and
the project page header does until issue 08 switches it to `where`.

### `EXPERIENCE[].summary`

Add `summary: string` to each entry, after `points`. One sentence of body copy under the
role and organisation (the landmarks): what was built, for whom, and what it led to. No
team sizes, no headcounts, no hours: "five-person team", "30 students", "54 members" and
"6 contact hours" stay in `points`, which the datasheet keeps.

| org | summary |
| --- | --- |
| Infineon Technologies, with De Anza College | `"Led the software for an offline navigation aid for blind users on a Raspberry Pi 5: the detection, distance and speech pipeline, the radar characterization delivered to Infineon, and the demo to the sponsors."` |
| San José State University | `"Run the ENGR 10 lab sections, where students solder IR receiver boards and build and program VEX robots in C++; invited back to TA the course one semester after taking it."` |
| De Anza College | `"TA for x86 assembly, computer architecture and both introductory C++ courses; tutored C++, assembly, Python and data structures in the CS lab."` |
| Applied Data Analytics Club, De Anza College | `"Started the campus's first applied-ML student group and built its workshop program on model evaluation and Python data pipelines from scratch."` |

### `Pin.full` and `PIN_GROUPS`

Add `full: string` to the `Pin` type (the plain name shown in the skills list; `name`
stays the silkscreen label on the chip). Fill it on every pin:

| name | full |
| --- | --- |
| C++ | C++ |
| C | C |
| ARM64 | ARM64 assembly |
| x86 | x86 assembly |
| PYTHON | Python |
| KOTLIN | Kotlin |
| TS | TypeScript |
| SWIFT | Swift |
| PYTORCH | PyTorch |
| LITERT | LiteRT |
| HF | Hugging Face Transformers |
| OPENCV | OpenCV |
| ML KIT | ML Kit |
| LLM API | LLM APIs: Claude, Gemini, DeepSeek |
| BLE | Bluetooth Low Energy |
| AVR | AVR microcontrollers |
| LINUX | Linux |
| SYSTEMD | systemd |
| CMAKE | CMake |
| GH ACT | GitHub Actions |
| FASTAPI | FastAPI |
| REACT | React |
| SVELTE | Svelte |
| COMPOSE | Jetpack Compose |
| FLUTTER | Flutter |
| SQL | SQL |
| TTS | Text to speech |
| FUZZ | Fuzzing and sanitizers |

Then, after `PINS`:

```ts
// The skills panel lists pins in these groups. Every pin appears in exactly one.
export type PinGroup = { name: string; pins: string[] };
export const PIN_GROUPS: PinGroup[] = [
  { name: "Languages", pins: ["C++", "C", "ARM64", "x86", "PYTHON", "KOTLIN", "TS", "SWIFT", "SQL"] },
  { name: "Machine learning on device", pins: ["PYTORCH", "LITERT", "HF", "OPENCV", "ML KIT", "LLM API", "TTS"] },
  { name: "Hardware and systems", pins: ["AVR", "BLE", "LINUX", "SYSTEMD"] },
  { name: "Build, test and ship", pins: ["CMAKE", "GH ACT", "FUZZ"] },
  { name: "Apps and services", pins: ["FASTAPI", "REACT", "SVELTE", "COMPOSE", "FLUTTER"] },
];
```

Add a build-time check next to the existing one at the bottom of the file: every pin
name appears in exactly one group, and every group entry is a pin. Throw otherwise.

### `AWARDS_BRIEF`

```ts
// The front page shows three. The datasheet shows all.
export const AWARDS_BRIEF = AWARDS.slice(0, 3);
```

(`AWARDS[0..2]` are Sponsor Track winner, 2nd place DA Hacks 3.5, Top 10 at site ICPC.)

### `CERTS_BRIEF`

```ts
// The front page lists finished certifications only. The datasheet shows all, including in progress.
export const CERTS_BRIEF = CERTS.filter((c) => !c.endsWith("(in progress)"));
```

(Five entries today. "(in progress)" is a status a recruiter cannot act on; it stays in
the datasheet.)

## Files

Modify: `app/content.ts` only.

## Acceptance criteria

- [ ] `npm run build` passes; `/datasheet/` renders exactly as before (diff the HTML of `out/datasheet/index.html` against a build of `Fable2` before this PR: identical).
- [ ] Every new string above appears in `app/content.ts` verbatim.
- [ ] `grep -c "where:" app/content.ts` is at least 10; every `NOTES` entry has `where`.
- [ ] Every `EXPERIENCE` entry has `summary`; every `PINS` entry has `full`; `CERTS_BRIEF` has five entries.
- [ ] None of the new strings (`BRIEF`, `FACTS`, `where`, `summary`) contains "team of", "-person", "solo", "★", or a number followed by "students", "members", "hours", "stars", "PRs" or "commits".
- [ ] The build-time group check throws if a pin is removed from `PIN_GROUPS` (test it, then restore).
- [ ] `grep -n "—" app/content.ts` returns nothing new.
- [ ] Lint passes.

## Out of scope

Rendering anything. Removing `PROOF`, `SKILLS`, `FEATURES`, `MORE` (the datasheet still
imports some; later issues remove only what becomes unused).
