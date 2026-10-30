# Content corrections

Apply these to `app/content.ts` in issue 02 before any page is built on it. Each line
is a fact drift between this branch's content and Aadi's master reference (a private
HTML document revised October 16, 2026, kept outside this repo; Aadi supplies it). The
reference wins.

## Accordion (`NOTES[id="accordion"]`)

| Field | Now | Change to | Why |
| --- | --- | --- | --- |
| `role` | `"Team of 3"` | `"Team of 4"` | Tyler Darisme, Aaditya Desai, Sheel Shah, Thy Tang |
| `context` | `"UC Berkeley AI Hackathon 2026 · Sponsor Track winner"` | `"UC Berkeley AI Hackathon 2026 · Sponsor Track winner (The Token Company)"` | name the sponsor |
| `when` | `"Jun 2026"` | `"Jun 2026"` (keep) and add to `problem` or `errata`: "Developed through June 2026; my active contribution ended June 25, 2026." | he is not currently working on it; do not imply he is |
| `built[0]` | "Built the hackathon **relevance pipeline**: keyword scoring, bi-encoder retrieval, then a **cross-encoder reranker** ... behind a self-calibrating fold target." | "Added a **cross-encoder rerank stage** (MS MARCO MiniLM) on the unfold shortlist, with retention telemetry, a query-aware extractive trim, a fact ledger and a relevance TOC." | bi-encoder stage and self-calibrating fold target are Sheel's |
| `built[1]` | (keep) | "Built the **health and evaluation layer**: health metrics with tests, a folding evaluator, a session evaluator, and a harness that compares a session against naive compaction." | more precise |
| `built[2]` | "Built the **live attribution view** that shows who made each fold ..." | "Built the **conductor activity dashboard**: health verdict, needed-fold rate, calibration events, fact ledger, relevance TOC and a per-decision view. Ported the conductor onto Accordion's fold, replace and group command contract (PR #68) and built the-conductor-v2 (PR #71)." | "attribution view" is a name from old résumés; describe the dashboard |
| `specs[2]` | `Fold target 0.60–0.92 ... self-calibrating` | remove this row | Sheel's work |
| `specs` add | | `{ param: "Site visits, get-accordion.dev", value: "10,000+", note: "Oct 2026", status: "Stated" }` | from the reference |
| `errata[1]` | "The team has since shipped stronger conductors (Thermocline). My part is the hackathon relevance pipeline, the eval harness and the attribution view." | "The SlopCodeBench result is credited to the team's Thermocline conductor, not to my work. My conductor and dashboard were removed from main in the August 2026 cleanup and survive in history (PRs #68 and #71)." | credit correctly |
| `stack` | `["Python", "Hugging Face Transformers", "TypeScript", "SvelteKit", "Tauri"]` | `["TypeScript", "Hugging Face Transformers", "SvelteKit", "Tauri", "Node.js", "WebSockets"]` | Python is not in his Accordion stack |

## Description (`DESCRIPTION`)

Replace "who builds software for awkward constraints: no network, a fixed compute
budget, a latency target, or an agent that has run out of context" with "who builds
software for real constraints: no network, a fixed compute budget, a latency target, or
an agent that has run out of context". The "awkward constraint" framing is explicitly not
Aadi's view.

## VisionAssist (`NOTES[id="visionassist"]`)

| Field | Now | Change to |
| --- | --- | --- |
| `built[0]` | "... risk-ranked speech in steps, not feet." | "... risk-ranked speech **in feet and steps** (2.5 ft per step)." |
| `role` | `"Technical lead · team of 5"` | `"Software lead · team of 5"` and keep the title "Research Intern and Technical Lead" in experience |
| `context` | (keep) | add `"Prof. Saied Rafati, De Anza ENGR 77"` to the datasheet meta only if there is room; otherwise leave |

## Rung (`NOTES[id="rung"]`, `SPECS.electrical`, `FEATURES[0]`)

The master reference (Oct 16) records the JIT at **22.64× the tree-walker on loop_sum**
and a background-compile p99 of 0.82 ms to 0.32 ms. This branch says **38.84× on fib**
and 0.89 ms to 0.28 ms. The repo may have been re-run after the reference was written.

**Action**: open `https://github.com/aadityad12/rung` and read the committed results
tables (the README and the `results/` or `bench/` directory). Use exactly the numbers
there, with the benchmark name they belong to. If the repo shows 38.84× on fib, keep the
branch's numbers and leave `// TODO(aadi): refresh master reference Rung numbers` in
`content.ts` so Aadi updates the reference. If the repo shows
22.64× on loop_sum, change every occurrence: `FEATURES[0]`, `PROOF`/hero, `SPECS.electrical`
rows 1 and 2, `NOTES.rung.built[0]`, `NOTES.rung.specs`, `NOTES.rung.errata[0]`, and the
`RungLadder` figure's data. Do not guess.

## Alta (`NOTES[id="alta"]`)

Alta is not in the master reference (it is the missing project). Every Alta number
(1,200 Hz, 50 ms, 4.6 KB flash, 1,199 samples in 60 s, 3 of 3 trials, 2.57 s time to
first word) must be verified against `https://github.com/aadityad12/Alta` (README and
docs) before shipping. Mark each as `Measured` only if a recorded result is in the repo;
otherwise `Stated`. Team: four, Aadi hardware and firmware lead. Cal Hacks 13.0, October
2026, 36 hours. Leave `TODO(aadi): verify` beside any number you cannot find.

## GazeBoard (`NOTES[id="gazeboard"]`)

Correct as written. Keep "Team of 3". The 8 ms figure stays `Observed`. Do not write
"478-point face mesh" anywhere; it crops one eye and runs Qualcomm's EyeGaze model.

## Echo (`NOTES[id="echo"]`)

Correct as written. The 22-language translation and the multi-hop relay are Sheel's;
they may appear as project specs (they do) but never in Aadi's "built" bullets (they
don't). Do not list BeConnect3 as a separate project; it is Echo's old name.

## Temper (`NOTES[id="temper"]`)

Correct as written. Never mention DigitalOcean. Never quote the fixture scores
(31→79, 44→82) as results. The test suite is 12 scripted questions, not 100.

## Clear Dispatch (`NOTES[id="clear-dispatch"]`)

Correct as written. "Four-stage pipeline" (sequential), never "four concurrent workers".

## Experience (`REVISIONS`, to be replaced by `EXPERIENCE` in issue 02)

Use `Opus-Map`'s `EXPERIENCE` array verbatim (four entries with bullet points). It is
more complete than this branch's `REVISIONS`. Note for the SJSU TA entry: "two weekly lab
sections of 30 students each, 6 contact hours a week"; "C++ and RobotC depending on the
section".

## Education (`EDUCATION`, `COURSEWORK`)

Use `Opus-Map`'s `EDUCATION` (it includes `courses` per school). Never list Operating
Systems. Never list Java. Discrete Math, Linear Algebra and DSA were completed at De Anza;
DSA is also in progress at SJSU (CMPE 126). Write AWS as plain "AWS", never specific
services.

## Awards (`AWARDS`)

Keep this branch's four rows (Sponsor Track winner, 2nd place, Top 10 at site, Most
Valuable Peer). Add `Dean's Scholar, SJSU` as in `Opus-Map`. Leave ICPC and HackStorm
dates blank where the reference leaves them blank.

## Skills

Add a `SKILLS` export, taken from `Opus-Map` with these edits: remove nothing; add
`"Linux (Ubuntu)"`, `"Tailscale"` to Systems; keep `"ARM64 assembly"` and
`"x86 assembly"`. Java and DigitalOcean never appear.

## Open source (`OPEN_SOURCE`)

Keep the two merged PRs (Soup, fusioncore) with the repo paths from `Opus-Map`
(`MakazhanAlpamys/Soup`, `manankharwar/fusioncore`). The live count lives at
oss.aadityad.dev; link to it.

## Identity

Location is always "Santa Clara, CA". No phone number anywhere. Email
aaditya.d.desai@gmail.com. Links: aadityad.dev, github.com/aadityad12,
linkedin.com/in/aaditya-desai-12d, devpost.com/aadityad12, oss.aadityad.dev.
Availability: "Summer 2027 (May to August 2027)"; Winter 2027 co-ops also in scope.
Graduation: May 2028. GPA 3.8, Dean's Scholar.
