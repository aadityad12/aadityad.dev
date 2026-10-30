# Fable1: the plan

This branch holds the plan for the next version of aadityad.dev. Every task is an issue
file in `docs/plan/issues/`, written so that a well-scoped implementer (a Sonnet subagent)
can complete it without making design or content decisions. The thinking is done here;
the issues are the instructions.

Branch base: `Opus-Factory` (commit fd5b38a). That branch has the most reusable code:
the chip, the ten interactive figures, and a `content.ts` that already holds most facts.

## The one-paragraph version

One site, three layers, each for a different reader. The front page (`/`) is a hiring
brief a recruiter can scan in 30 seconds: name, one sentence, availability, a chip whose
pins are skills and double as the site's index, a one-row-per-project table, experience,
education, contact. Each project gets its own page (`/work/<slug>/`) with a restrained
Apple-style "highlights reel" (a figure that holds in place while three to five short
text beats scroll past and change its state), then the facts: what I built, measured
numbers with status tags, known limitations, photos. The full AD2028 datasheet moves to
`/datasheet/` as the long version for engineers who want all of it. The 3D Bay map
becomes an optional toy at `/map/`, linked from the footer, loading three.js only there.

## The reader model

| Reader | Time | Needs | Where they land |
| --- | --- | --- | --- |
| Recruiter or screener | 30 s | Verify the résumé: company name, award, a hard number, GPA, availability, contact | `/` from the résumé PDF, LinkedIn, GitHub profile |
| Hiring engineer or interviewer | 5 to 10 min | Depth on one project: what he built, what he measured, what doesn't work | `/work/<slug>/` from a README, Devpost, or a cover letter |
| Someone who wants all of it | 20 min | Everything, printable, cross-referenced | `/datasheet/` from footers and project pages |

Entry links are chosen by reader intent, not by referrer. The Accordion README should
link to `/work/accordion/`, not to the datasheet.

## Routes

| Route | Content | Client JS budget (uncompressed, excluding Next runtime) | Issue |
| --- | --- | --- | --- |
| `/` | Hiring brief | 60 KB. Only `Chip` and the index-table filter are client components. No figures, no three.js. | 03, 04, 05 |
| `/work/<slug>/` | One project, 10 pages | 180 KB. One figure plus the `Reel` component. | 06 to 11 |
| `/datasheet/` | Full AD2028 datasheet (current Opus-Factory page) | 500 KB. All ten figures. | 01, 12 |
| `/map/` | Bay Area map toy | No budget, but three.js and the heightmap must load only on this route. | 16 |
| `/404` | Not found | | 01 |

`scripts/check-budget.mjs` (issue 14) enforces the first three rows in CI.

## Rules that apply to every issue

1. **Content is visible without JavaScript.** Nothing ships hidden waiting for a script
   to reveal it. Motion is layered on top of visible content. This is the rule the old
   site broke and went blank. No `opacity: 0` plus IntersectionObserver reveals. No
   scroll-position-driven interpolation. No scroll-jacking.
2. **`prefers-reduced-motion: reduce` turns off every transition and animation**, and the
   page is still complete. Use `useReducedMotion()` from `app/figures/hooks.ts`.
3. **Every number carries a status tag**: `Measured` (a recorded result in a repo),
   `Observed` (read live, not logged), `Single run` (one benchmark run), `Repo` (a count
   you can check in the code), `Stated` (Aadi's account, nothing public behind it).
   Rendering: `app/components/Status.tsx` (issue 02). A number without a tag is a bug.
4. **Facts come only from `app/content.ts`.** `content.ts` facts come only from
   `docs/plan/CONTENT-CORRECTIONS.md` and the two existing content files (this branch's
   and `Opus-Map`'s). If an issue needs a fact that isn't in those places, write
   `TODO(aadi): <what is missing>` in the code and stop; do not estimate or invent.
5. **Voice**: first person, specific, no em dashes anywhere (use a comma, a colon, or a
   new sentence), never "passionate", never "innovative", never "awkward constraints".
   Numbers describe what was built or measured, never effort (no commit counts, no lines
   of code).
6. **Design system stays Opus-Factory's**: Archivo (variable width) for text, IBM Plex
   Mono for labels, the tokens in `app/globals.css` (`--paper`, `--ink`, `--accent`
   `#1f45ff`, `--hot`, `--ok`, `--amber`). Accent means "look here", never decoration.
7. **Accessibility**: every interactive element reachable by keyboard with visible focus,
   every image has alt text, every figure has a text equivalent, colour never carries
   meaning alone (status tags have words, not just colour).
8. **Mobile first**: design at 390 px, then 768, then 1440. Tables that can't fit at
   390 px collapse to stacked rows, they do not scroll sideways on the front page.
9. **One pull request per issue**, branched from `Fable1` as `fable1/NN-slug`, targeting
   `Fable1`. Don't touch files outside the issue's "Files" list without saying so in the
   PR description. Never modify `main`, `Opus-Map`, `Opus-Factory`, or any other branch.
10. **Do not add dependencies** unless the issue says so. three.js enters only in issue 16.

## Where things come from

| Need | Source | Notes |
| --- | --- | --- |
| Chip, figures, datasheet layout, tokens, fonts | this branch (`Opus-Factory`) | `app/components/`, `app/figures/`, `app/globals.css`, `app/layout.tsx` |
| Project facts, specs, errata, photos | this branch, `app/content.ts` | apply `CONTENT-CORRECTIONS.md` first |
| Experience (4 entries with bullets), Skills groups, Education coursework, Hero copy, "More builds" | branch `Opus-Map`, `app/content.ts` | read with `git show Opus-Map:app/content.ts` |
| JSON-LD Person block, preconnect pattern | branch `Opus-Map`, `app/layout.tsx` | |
| 3D map, landmarks, heightmap, Pathfinder robot | branch `Opus-Map`, `lab/` and `app/components/site-interactions.js` | issue 16 only |
| Résumé PDF, project images | this branch, `public/` | |
| Aadi's full record | `aaditya-master-reference.html`, kept **outside this repo** (private; on Aadi's machine at `~/Desktop/ExtraCuricular/portfolio/`). Ask Aadi for it when briefing a subagent. | the source of truth for any fact dispute; never commit it, the repo is public |

## Order of work

```
Phase A  foundation         01 routes and datasheet move  ->  02 content model and corrections
Phase B  front page         03 hero and chip index  ->  04 project index table  ->  05 rest of front page
Phase C  project pages      06 page template  ->  07 Reel component  ->  08 Rung beats, 09 VisionAssist beats,
                                                                       10 Accordion beats, 11 Alta beats
Phase D  glue and infra     12 datasheet cross-links  ->  13 masthead and nav  ->  14 budget and CI  ->  15 metadata, OG, sitemap
Phase E  optional           16 /map toy
Phase F  launch             17 QA and launch checklist
```

Dependencies: 02 needs 01. 03, 04, 05 need 02. 06 needs 02. 07 needs 06. 08 to 11 need 07
and can run in parallel. 12 needs 01 and 06. 13 needs 03 and 06. 14 needs 01. 15 needs
03 and 06. 16 needs 13 and 14. 17 needs everything else.

Parallel-safe sets: {03, 04, 06, 14} after 02; {08, 09, 10, 11} after 07; {12, 13, 15}
after 06.

## Definition of done, every issue

- `npm run lint` is clean and `npm run build` succeeds.
- `node scripts/check-budget.mjs` passes (from issue 14 onward; before that, note the
  size of new client chunks in the PR).
- Checked at 390, 768 and 1440 px: `npm run build && npx serve out` and open the route.
  If `agent-browser` is available, take screenshots at those widths and attach them.
- Keyboard pass: Tab through the page; every control reachable, focus visible.
- Reduced-motion pass: with the OS setting on, nothing moves and nothing is missing.
- No-JS pass: with JavaScript disabled, every word of content is readable.
- No new facts. Any `TODO(aadi):` comments are listed in the PR description.
- The PR description states what was built, what was checked, and what was skipped.

## Working on an issue with a subagent

Use `docs/plan/PROMPT-TEMPLATE.md`. Give the subagent exactly one issue file, the rules
section above, and the paths it will touch. Ask for a PR, not a direct commit to `Fable1`.
