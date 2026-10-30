# 02 · Content model and corrections

**Phase**: A · **Size**: M · **Depends on**: 01 · **Unblocks**: 03, 04, 05, 06

## Goal

Make `app/content.ts` the complete, corrected, single source of truth for every route.
Add the fields the front page and project pages need. Apply every item in
`docs/plan/CONTENT-CORRECTIONS.md`. Add a `Status` component so numbers can carry tags.

## Source material

- `app/content.ts` (this branch): `NOTES`, `PINS`, `SPECS`, `FEATURES`, `REVISIONS`,
  `EDUCATION`, `COURSEWORK`, `AWARDS`, `CERTS`, `OPEN_SOURCE`, `ABOUT`, `ALSO`, `PHOTOS`.
- `git show Opus-Map:app/content.ts`: `HERO`, `PROOF`, `EXPERIENCE`, `SKILLS`,
  `EDUCATION` (with `courses`), `MORE`, `AWARDS`, `OPEN_SOURCE` (with `repo`).
- `docs/plan/CONTENT-CORRECTIONS.md`: every edit, with before and after.

## Spec

### 1. Apply corrections

Work through `CONTENT-CORRECTIONS.md` top to bottom. For Rung and Alta, do the repo
verification it asks for and record what you found in the PR description.

### 2. Status type and component

```ts
// app/content.ts
export type Status = "Measured" | "Observed" | "Single run" | "Repo" | "Stated";
```

```tsx
// app/components/Status.tsx (server component, no "use client")
export default function Status({ s }: { s: Status }) {
  const cls = { Measured: "measured", Observed: "observed", "Single run": "single", Repo: "repo", Stated: "stated" }[s];
  return <span className={`tag ${cls}`} title={STATUS_HELP[s]}>{s}</span>;
}
```

`STATUS_HELP` (export from `content.ts`):
- Measured: "A recorded result in the project repository."
- Observed: "Read live during the event, not logged."
- Single run: "One benchmark run at hackathon scale."
- Repo: "A count you can check in the code."
- Stated: "My account; nothing public behind it."

Add `.tag.stated` to `globals.css` beside the existing `.tag.*` rules, using `--muted`
for text and a dashed hairline border so it reads as the weakest tag.

### 3. New fields on `AppNote`

```ts
export type Headline = { value: string; unit?: string; label: string; status?: Status };
export type Beat = { title: string; body: string };

export type AppNote = {
  // existing fields stay
  oneLiner: string;        // <= 90 chars, plain, for the front-page table
  headline: Headline;      // the single number for the front-page table
  skills: string[];        // PIN names (exact strings from PINS[].name) used by this project
  beats?: Beat[];          // 3 to 5 beats for the project page Reel (issues 07 to 11)
  order: number;           // front-page sort order, 1 = first
};
```

Also give `AppNote.specs[]` entries an optional `status?: Status` and set it on every row
(use the status already implied by the note text; e.g. GazeBoard 8 ms is `Observed`,
Rung ratios `Measured`, test counts `Repo`, Alta rows per the verification).

### 4. Values per project

| id | order | oneLiner | headline | skills |
| --- | --- | --- | --- | --- |
| visionassist | 1 | "Head-mounted Pi 5 that spots obstacles and says how many steps away, fully offline." | `{ value: "≈200", unit: "ms / frame", label: "YOLOv8n on the Pi 5 CPU", status: "Measured" }` | PYTHON, PYTORCH, OPENCV, LINUX, SYSTEMD, TTS |
| accordion | 2 | "Context manager for AI coding agents: folds what isn't carrying weight, reversibly." | `{ value: "240+", unit: "★", label: "team repo, Oct 2026", status: "Repo" }` | TS, HF, SVELTE |
| rung | 3 | "One tiny language built five ways, down to a hand-written ARM64 JIT, to measure each speed-up." | from the Rung verification: `{ value: "<ratio>×", label: "JIT vs. tree-walker, <benchmark>", status: "Measured" }` | C++, ARM64, CMAKE, GH ACT, FUZZ |
| alta | 4 | "Voice lab TA that reads real voltages off a breadboard and walks you to the fault." | `{ value: "≈1,200", unit: "Hz", label: "per probe, bare-metal ADC", status: <per verification> }` | C, AVR, OPENCV, PYTHON |
| gazeboard | 5 | "Talk by looking at tiles on a phone. Gaze model on the NPU, no network permission." | `{ value: "≈8", unit: "ms", label: "per inference, Hexagon NPU", status: "Observed" }` | KOTLIN, LITERT, ML KIT, COMPOSE, TTS |
| oss-scout | 6 | "Nightly agent that finds open-source work and can't post anything without my tap." | `{ value: "2", label: "PRs merged upstream (9.8k★ and 380★ repos)", status: "Repo" }` | PYTHON, GH ACT, LLM API |
| apextracker | 7 | "The offline Android app that replaced my sticky notes, reminders, calendar and budget sheet." | `{ value: "≈525", label: "unit tests, in daily use since Jan 2026", status: "Repo" }` | KOTLIN, COMPOSE, SQL, ML KIT |
| echo | 8 | "Emergency alerts hop phone to phone over Bluetooth LE when the network is down." | `{ value: "0", label: "internet needed after the first phone has the alert", status: "Repo" }` | KOTLIN, SWIFT, FLUTTER, BLE, SQL, LINUX |
| temper | 9 | "Finds where an agent's own prompt, skills and tools make it worse, then patches them." | `{ value: "6", label: "judged dimensions, offline-reproducible loop", status: "Repo" }` | PYTHON, FASTAPI, REACT, LLM API |
| clear-dispatch | 10 | "911 surge simulation: automation handles volume, a human keeps authority." | `{ value: "60", unit: "s", label: "human hold before any heavy asset moves", status: "Repo" }` | PYTHON, FASTAPI, REACT, TS, LLM API |

`skills` must match `PINS[].name` exactly; add a build-time assertion at the bottom of
`content.ts`:

```ts
for (const n of NOTES) for (const s of n.skills) if (!PINS.some((p) => p.name === s)) throw new Error(`Unknown skill ${s} on ${n.id}`);
```

Then make `PINS[].uses` derived instead of hand-maintained:
`export const PIN_USES = (name: string) => NOTES.filter((n) => n.skills.includes(name)).map((n) => n.id);`
Keep `PINS[].uses` for now (the datasheet reads it) but set each from `PIN_USES` at the
bottom of the file so the two never disagree.

### 5. Beats (copy for issues 08 to 11; add to the four notes now)

**rung**
1. "One language, five engines." / "32-bit ints, floats, strings, arrays, closures. Small enough to build five times: tree-walker, stack VM, register VM, baseline ARM64 JIT, background JIT. All five must print byte-identical output."
2. "Bytecode beats walking the tree." / "The stack VM runs 1.30× to 4.99× faster than the tree-walker across six benchmarks. Computed-goto dispatch adds a little more."
3. "Fewer instructions, same work." / "The register VM does sieve's work in a third of the stack VM's instructions. Superinstructions cut strcat's dispatch count by 36.5% with almost no time change: the string runtime dominates."
4. "A speed-up that wasn't." / "NaN-boxing halved value size and heap use, and made every benchmark slower; sieve ran at 0.63× the rung below. It stays in the table. The cause is still unexplained."
5. "Native code, with an exit." / "The JIT hand-encodes ARM64, checked byte for byte against LLVM's assembler. When a type guard fails mid-function it bails out and resumes in the VM. <JIT ratio from verification> on <benchmark>."

**visionassist**
1. "See." / "An Arducam on a head mount feeds 1280×720 frames to one Python process on the Raspberry Pi 5, about five frames a second. Nothing leaves the device."
2. "Detect." / "YOLOv8n runs on the Pi's CPU at about 200 ms per frame, with a 0.45 confidence floor and a blocklist for classes that don't matter on a sidewalk."
3. "Measure." / "Distance comes from box height: real height × focal length ÷ pixels. 27 hand-set class heights, focal length tuned from a theoretical 1435 px to 900 px. Ground-plane projection was rejected because head tilt varies by about ±15°."
4. "Choose one thing to say." / "Objects are ranked by risk tier, then distance. Only the single riskiest, closest one is announced, in feet and steps, and only when it changes or after a 3 s cooldown."
5. "Speak." / "Piper TTS on-device, through Bluetooth earbuds, as a systemd service that boots headless. The radar was cut after weeks of phantom readings; the write-up went to Infineon."

**accordion**
1. "A session fills up." / "A long coding-agent session is a stream of blocks: user turns, replies, thinking, tool calls, tool results. The window has a budget. The usual fix flattens it into one lossy summary."
2. "Fold, don't delete." / "Accordion hides blocks that aren't carrying weight. Folding changes only what the agent sees, never what is stored, so anything can come back. A protected tail is never folded."
3. "Decide what to bring back." / "When the agent needs something folded, a shortlist is reranked by a cross-encoder (MS MARCO MiniLM). I built that stage, plus a fact ledger and a relevance table of contents."
4. "Measure whether it helped." / "I built the health layer: metrics, a folding evaluator, a session evaluator, and a harness that compares a session against naive compaction. The dashboard shows every decision the conductor made."

**alta**
1. "Probe the row." / "Alta asks the student to put a probe in a row. It doesn't guess from a photo; it reads the real voltage."
2. "Sample fast, on the metal." / "The probe pod is bare-metal C on an ATmega328P: interrupt-driven ADC, UART and timer, no Arduino libraries. About 1,200 reads a second per probe, corrected against the measured supply voltage."
3. "One line every 50 ms." / "The pod streams a JSON line with mean, min and max per probe. In a 60 s soak it sent 1,199 samples with zero bad lines."
4. "Teach, don't tell." / "Alta talks the student toward the fault without handing over the answer, and the probe monitor confirms the fix on its own. 3 of 3 timed trials on the real board."

Any number in these beats that the repo verification contradicts must be changed to
match the repo. Any number not found in the repo gets `TODO(aadi): verify` beside it.

### 6. Imports from Opus-Map

Add these exports, copied from `git show Opus-Map:app/content.ts` and then edited per
`CONTENT-CORRECTIONS.md`: `HERO`, `PROOF`, `EXPERIENCE`, `SKILLS`, `MORE` (rename the
"This site" entry's text to describe this version: "A static Next.js export with a front
page, one page per project, and the full datasheet. Every figure is hand-built SVG."),
and replace `EDUCATION` with the Opus-Map version (has `courses`). Delete `REVISIONS` and
`COURSEWORK` after updating `app/datasheet/page.tsx` to read `EXPERIENCE` and
`EDUCATION[].courses` instead (keep the datasheet's rendering; map `EXPERIENCE` entries to
Rev letters D, C, B, A in order).

`HERO.lead` (final copy): "I build from the metal up: an ARM64 JIT compiler, bare-metal
firmware, on-device vision, and tools for AI agents."
`HERO.intro`: "I led the software for VisionAssist, a wearable obstacle detector built
with Infineon Technologies, and co-built Accordion, a context manager for AI coding
agents that won the Sponsor Track at the UC Berkeley AI Hackathon 2026 and has 240+
stars on GitHub."
`HERO.avail`: "Available for Summer 2027 internships · May to August 2027"
`HERO.eyebrow`: "Computer Engineering · SJSU · Class of 2028"

`PROOF` (four items; `href` values point at front-page or work routes):
1. `{ big: "Infineon", small: "Research intern and technical lead", href: "#experience" }`
2. `{ big: "Winner", small: "Sponsor Track, UC Berkeley AI Hackathon 2026", href: "/work/accordion/" }`
3. `{ big: "<Rung ratio>×", small: "my ARM64 JIT vs. the interpreter", href: "/work/rung/", status: "Measured" }`
4. `{ big: "3.8 GPA", small: "Dean's Scholar, SJSU", href: "#education" }`

## Files

Modify: `app/content.ts`, `app/globals.css` (one rule), `app/datasheet/page.tsx`
(read the renamed exports), `app/figures/RungLadder.tsx` (only if the Rung verification
changes numbers).
Create: `app/components/Status.tsx`.

## Acceptance criteria

- [ ] Every item in `CONTENT-CORRECTIONS.md` is applied; the PR lists each with a checkmark.
- [ ] Rung and Alta verification results are in the PR description with the repo URLs you read.
- [ ] `grep -n "awkward\|Team of 3\"[^,]*accordion\|attribution view\|bi-encoder\|self-calibrating" app/content.ts` returns nothing for Accordion.
- [ ] `grep -c "TODO(aadi)" app/content.ts` is reported in the PR.
- [ ] The `skills` assertion passes at build time; `/datasheet/` pin table still shows the same "Used in" links (or more).
- [ ] `/datasheet/` renders Experience from `EXPERIENCE` with the four entries and their bullets.
- [ ] No em dash (U+2014) anywhere in `content.ts`: `grep -c "—" app/content.ts` is 0.
- [ ] Build and lint pass.

## Out of scope

Any new page or layout. Figures other than Rung's numbers.
