# Fable2: the plan

Fable2 is Fable1 with a quieter front page and a clear way around the site. The theme
stays: paper and ink, Archivo and IBM Plex Mono, the datasheet voice, the chip, the ten
project pages and their figures. What changes is how much a reader is asked to take in at
once, and how they get from one place to the next.

Every task is an issue file in `docs/fable2/issues/`, written so that a well-scoped
implementer (a Sonnet subagent) can complete it without making design or content decisions.
The thinking is done here; the issues are the instructions. The Fable1 plan in `docs/plan/`
is history: read it for the component contracts it set up, not for what to build next.

Branch base: `Fable1` (commit 8b18124), which is the finished Fable1 site.

## What is wrong with Fable1, in numbers

Measured on the Fable1 build, 31 Oct 2026:

| | Fable1 | Fable2 target |
| --- | --- | --- |
| Words inside `<main>` on `/` | 1,468 | **600 or fewer** (enforced by `scripts/check-brief.mjs`) |
| Status tags (`Measured`, `Repo`, ...) on `/` | 13 | **0** |
| Height of `/` at 1440 x 900 | 4,314 px (4.8 screens) | 2,400 px or less (2.7 screens) |
| Height of `/` at 390 x 844 | 7,795 px (9.2 screens) | 4,400 px or less (5.2 screens) |
| Links in the masthead on a project page | 5, different from every other route | 4, the same on every route |
| Way off a project page, apart from the masthead | one mono line "Next: Alta" | previous and next cards, "All work", "Home" |

What a recruiter sees today, and why it fails them:

- The hero has an intro paragraph that repeats the proof strip, which repeats the
  experience section. The same three facts are read three times.
- The proof strip says "38.84x [Measured]". A recruiter does not know what is 38 times
  faster than what, and the tag is jargon from the datasheet. The number belongs on the
  Rung page, with its tag, where an engineer can see the conditions.
- The project table has six columns of information per row times ten rows: number,
  title, context, role, one-liner, headline number, status tag, stack. Nobody can find
  anything, and the first four rows are the only ones that matter to a first-time reader.
- On a phone the chip sits below the fold with 28 labels, and the recruiter scrolls past
  a wall of small mono text they have no reason to understand.
- Credentials lists coursework, six certifications, two open-source PRs with full
  descriptions and a 50-item toolbox. About is three paragraphs plus a facts table.
- A project page ends in a 13 px mono line. The masthead on that page shows five links
  (previous, next, all projects, datasheet entry, resume) that no other route has, so the
  reader has to relearn the navigation on every page type.

## The one-paragraph version

The front page becomes a brief a recruiter can finish: availability, name, one sentence,
two buttons, the chip, three facts in plain words (Infineon, hackathon winner, 3.8 GPA),
four featured projects as cards, one line per job, two lines of education, three awards,
one short paragraph, contact. No status tags, no benchmark numbers, no stack lists. The
chip stays in the hero on every screen size, small and label-free on phones, and becomes
the door to a **skills panel**: a pop-up (native `<dialog>`) with the full interactive
chip beside a plain, grouped list of the 28 skills, each naming the projects that used it.
The panel opens from a "Skills" item in the masthead on every route and from the chip
itself; `/skills/` is the same content as a page, for links and for readers without
JavaScript. A new `/work/` page lists all ten projects, so "Work" has a real destination
and project pages have a parent. The masthead shows the same four items everywhere: Work,
Experience, Skills, Contact, plus the resume. Project pages gain a breadcrumb row at the
top and previous/next cards at the bottom. The highlights reel on project pages is
tightened so beats sit closer together, and on desktop the reel figure becomes free to
play with after the last beat instead of being repeated below. Everything with a status
tag, a benchmark number or a long list still exists: on the project pages and in the
datasheet, where the reader who wants it goes on purpose.

## The reader model

| Reader | Time | Needs | Where they land |
| --- | --- | --- | --- |
| Recruiter or screener | 30 s | Company name, award, GPA, availability, contact, and a sense that the projects are real | `/` from the resume PDF, LinkedIn, GitHub profile |
| Hiring engineer or interviewer | 5 to 10 min | Depth on one project: what he built, what he measured, what doesn't work; then the next project | `/work/<slug>/` from a README, Devpost, a cover letter, or `/work/` |
| Someone who wants all of it | 20 min | Everything, printable, cross-referenced | `/datasheet/` from footers and project pages |

Each layer links down to the next and back up to the one above. No layer repeats the one
below it.

## Routes

| Route | Content | Client JS budget (uncompressed, excluding Next runtime) | Issue |
| --- | --- | --- | --- |
| `/` | Hiring brief | 80 KB. `Chip` in the hero and the skills dialog shell are the only client code; the skills list loads on first open. | 04, 05, 07 |
| `/work/` | All ten projects, one row each | 60 KB. | 06 |
| `/work/<slug>/` | One project, 10 pages | 180 KB. One figure plus the `Reel`. | 08, 09 |
| `/skills/` | The pin map: chip plus grouped list | 120 KB. | 02 |
| `/datasheet/` | Full AD2028 datasheet, unchanged | 500 KB. | 03 (masthead only) |
| `/404` | Not found | | 11 |

`scripts/check-budget.mjs` (extended in issue 10) enforces the first five rows in CI.

## Rules that apply to every issue

Fable1's ten rules still apply. They are repeated here with the Fable2 changes marked.

1. **Content is visible without JavaScript.** Nothing ships hidden waiting for a script to
   reveal it. Motion is layered on top of visible content. No `opacity: 0` plus
   IntersectionObserver reveals. No scroll-position-driven interpolation. No scroll-jacking.
   **Fable2 addition**: an overlay (the skills `<dialog>`) is allowed only when the same
   content has its own URL that renders it statically (`/skills/`), and every control that
   opens the overlay is a real link to that URL. Without JavaScript the link just navigates.
2. **`prefers-reduced-motion: reduce` turns off every transition and animation**, and the
   page is still complete. Use `useReducedMotion()` from `app/figures/hooks.ts`.
3. **Status tags stay on `/work/<slug>/` and `/datasheet/`, and leave the front page.**
   Every measured or benchmarked number on a project page or the datasheet still carries
   `Measured`, `Observed`, `Single run`, `Repo` or `Stated`. The front page (`/`) and the
   index pages (`/work/`, `/skills/`) carry **no benchmark numbers at all**: no ratios, no
   latencies, no sample rates. Numbers a recruiter recognises without context are fine
   there: a GPA, a date, a team size, a star count, a place in a competition.
4. **Facts come only from `app/content.ts`.** New fields added in issue 01 are rephrasings
   and selections of facts already in that file; they introduce nothing. If an issue needs
   a fact that isn't there, write `TODO(aadi): <what is missing>` in the code and stop; do
   not estimate or invent.
5. **Voice**: first person, specific, no em dashes anywhere (use a comma, a colon, or a
   new sentence), never "passionate", never "innovative", never "awkward constraints".
   Numbers describe what was built or measured, never effort.
6. **Design system stays**: Archivo (variable width) for text, IBM Plex Mono for labels,
   the tokens in `app/globals.css` (`--paper`, `--ink`, `--accent` `#1f45ff`, `--hot`,
   `--ok`, `--amber`). Accent means "look here", never decoration.
7. **Accessibility**: every interactive element reachable by keyboard with visible focus,
   every image has alt text, every figure has a text equivalent, colour never carries
   meaning alone.
8. **Mobile first**: design at 390 px, then 768, then 1440. Nothing scrolls sideways.
9. **One pull request per issue**, branched from `Fable2` as `fable2/NN-slug`, targeting
   `Fable2`. Don't touch files outside the issue's "Files" list without saying so in the
   PR description. Never modify `Fable1`, `main`, or any other branch. `Fable1` is the
   archived version the plan starts from; it must stay exactly as it is.
10. **Do not add dependencies.** Nothing in this plan needs one.
11. **Fable2 addition: the front page has a word budget.** `<main>` plus `<footer>` on `/`
    is at most 600 words and contains zero `.tag` elements. `scripts/check-brief.mjs`
    (issue 10) enforces it. If your issue would push the page over, cut words from what
    you are adding, not from another issue's section.
12. **Fable2 addition: one navigation.** The masthead shows the same items on every route
    (issue 03). No route adds its own items to it. Route-specific wayfinding (breadcrumbs,
    previous/next) lives in the page body, never in the masthead.

## Where things come from

| Need | Source | Notes |
| --- | --- | --- |
| Everything | this branch, as merged from `Fable1` | `app/`, `scripts/`, `public/` |
| Project facts, specs, errata, photos, pins | `app/content.ts` | issue 01 adds fields; nothing is removed that the datasheet uses |
| Fable1's component contracts | `docs/plan/issues/` | `Reel` (07), `Masthead` (13), `Chip` props (03), `check-budget.mjs` (14) |
| Aadi's full record | `aaditya-master-reference.html`, kept **outside this repo** (private; on Aadi's machine at `~/Desktop/ExtraCuricular/portfolio/`) | the source of truth for any fact dispute; never commit it, the repo is public |

## Order of work

```
Phase A  content            01 brief content fields
Phase B  structure          02 skills map, /skills/ and the dialog      03 masthead: one nav       (parallel, both need 01)
Phase C  front page         04 hero and facts   05 selected work   07 experience, education, about, contact   (parallel; need 01, 02, 03)
         index              06 /work/ page                                                                      (needs 01, 03)
Phase D  project pages      08 wayfinding (needs 03, 06)        09 reel: tighten and free (needs nothing)      (parallel)
Phase E  enforcement        10 brief budget script and CI (needs 04, 05, 07)    11 metadata, OG, sitemap (needs 02, 06)
Phase F  launch             12 QA and launch (needs everything)
```

Dependencies: 02 and 03 need 01. 04 needs 01, 02, 03. 05 needs 01, 03 (and links to `/work/`
from 06, which must be merged before 12). 06 needs 01, 03. 07 needs 01. 08 needs 03 and 06.
09 needs nothing and can start on day one. 10 needs 04, 05, 07. 11 needs 02 and 06. 12
needs everything else.

Parallel-safe sets: {02, 03, 09} after 01; {04, 05, 06, 07} after 02 and 03; {08, 10, 11}
after their dependencies.

## Definition of done, every issue

- `npm run lint`, `npm run build` and `npm run budget` are clean. From issue 10 onward,
  `npm run brief` too.
- Checked at 390, 768 and 1440 px: `npm run build && npx serve out` and open the route.
  If `agent-browser` is available, take screenshots at those widths and attach them.
- Keyboard pass: Tab through the page; every control reachable, focus visible.
- Reduced-motion pass: with the OS setting on, nothing moves and nothing is missing.
- No-JS pass: with JavaScript disabled, every word of content is readable and every link
  goes somewhere real.
- No new facts. Any `TODO(aadi):` comments are listed in the PR description.
- The PR description states what was built, what was checked, and what was skipped.

## Working on an issue with a subagent

To run the whole plan, give an Opus session `docs/fable2/MANAGER-PROMPT.md`; it manages
and reviews, and dispatches one Sonnet subagent per issue. For a single issue by hand, use
`docs/fable2/PROMPT-TEMPLATE.md`. Give the subagent exactly one issue file, the rules
section above, and the paths it will touch. Ask for a PR, not a direct commit to `Fable2`.
