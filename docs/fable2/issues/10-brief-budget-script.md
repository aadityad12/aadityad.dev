# 10 · The brief check: the landmark read, tags, banned numbers, routes, in CI

**Phase**: E · **Size**: S · **Depends on**: 04, 05, 07

## Goal

Make the front page's scannability a test, so it cannot creep back. A script reads the
built pages, prints the landmark read of `/` (the list of things a scanning eye stops on,
in order), and fails if a required stop is missing or out of order, if a status tag is
present, if an effort or benchmark number appears anywhere in the text, or if something is
bold inside body copy. It runs in CI next to the JS budget. Also extend the JS budget to
the new routes.

There is no word count. The README explains why ("How a recruiter reads a page"): the
instrument is the read, not the length.

## Source material

- `scripts/check-budget.mjs`, `package.json` scripts, `.github/workflows/ci.yml`.
- `docs/fable2/README.md`, "How a recruiter reads a page" and "The landmark read" (the
  target list; the starred lines are the required stops).

## Spec

### `scripts/check-brief.mjs`

Plain Node, no dependencies. Reads `out/index.html`, `out/work/index.html` and
`out/skills/index.html`; fail with a clear message if any is missing.

Per file, take the `<main ...>...</main>` block and the `<footer ...>...</footer>` block
(concatenated; `/work/` and `/skills/` may have no footer), remove `<svg>` subtrees, and
define `strip(s)`: remove tags, decode `&amp;` `&lt;` `&gt;` `&quot;` `&#x27;` `&nbsp;`,
collapse whitespace, trim.

**The landmark read** of `out/index.html`: scan `<main>` + `<footer>` in document order
for these elements and collect `strip(inner)` of each, labelled by kind:

| kind | element |
| --- | --- |
| `h1`, `h2`, `h3`, `b`, `strong`, `small` | the tag of that name |
| `button` | `<a ... class="button...">` |
| `kicker` | any `<p>`, `<span>` or `<div>` whose class list starts with `avail` or `brief-eyebrow` |
| `tag` | `<span class="tag ...">` |

One regex does it, alternation in that order:

```js
const RE = /<(h1|h2|h3|b|strong|small)\b[^>]*>([\s\S]*?)<\/\1>|<a\b[^>]*class="button[^"]*"[^>]*>([\s\S]*?)<\/a>|<(?:p|span|div)\b[^>]*class="(?:avail|brief-eyebrow)[^"]*"[^>]*>([\s\S]*?)<\/(?:p|span|div)>|<span class="tag[^"]*"[^>]*>([\s\S]*?)<\/span>/g;
```

Print it first, under the heading `landmark read, /`, one line per stop as
`kind<TAB>text`, then a line `N stops, T tags`. This is the artefact reviewers paste into
PRs; make it readable.

**Checks**, each printed as a `PASS`/`FAIL` row like `check-budget.mjs` does:

1. `landmarks in order`: the following texts appear in the read, as landmarks, in this
   order (other stops may sit between them). On failure, name the first one that is
   missing or out of order and the stop found in its place.
   ```
   Available for Summer 2027 internships · May to August 2027
   Computer Engineering · SJSU · Class of 2028
   Aaditya Desai
   Résumé PDF ↓
   See the work ↓
   Infineon
   Hackathon winner
   3.8 GPA
   Selected work
   VisionAssist
   Accordion
   Rung
   Alta
   Experience
   Infineon Technologies, with De Anza College
   Education
   San José State University
   Get in touch.
   aaditya.d.desai@gmail.com
   ```
   Compare after `strip` and case-sensitively; these are the recruiter's six answers and
   two actions, and the section names between them.
2. `status tags`: count of `class="tag ` is 0 in each of the three files.
3. `banned patterns`: in the stripped text of `<main>` + `<footer>` of each of the three
   files, none of these match. Benchmark leaks: `38.84`, `200 ms`, `1,200`, `≈`, `525`,
   `4.54`, `0.63`, `14.41`. Effort and scale (case-insensitive): `/team of/`, `/-person/`,
   `/\bsolo\b/`, `/\(in progress\)/`, and
   `/\d[\d,.]*\+?\s*k?\s*(students?|members?|hours?|PRs?|pull requests?|commits?|lines?|tests?|contact hours)\b/`.
   Star counts are not banned: "240+ stars" and "9.8k★" are numbers a GitHub user reads
   at once (rule 3).
   On failure, print the file, the pattern, and 40 characters either side of the match.
   Extend the list when a new leak appears; the list is the rule made executable, not the
   rule.
4. `bold in body`: in `<main>` of `out/index.html`, no `<b>` or `<strong>` opens inside a
   `<p>`: `/<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?<(?:b|strong)\b/` must not match. (The facts, the
   chip card and the awards use `<b>` inside `<a>`, `<span>` or `<li>`, not `<p>`.)
5. `team sizes, site-wide`: `/team of|-person|\bsolo\b/i` matches nothing in the stripped
   text of any `out/**/index.html`, the datasheet and the ten project pages included.
6. `routes present`: `out/work/index.html` and `out/skills/index.html` exist.

Exit 1 if any check fails. Do not count words anywhere in the output.

### `scripts/check-budget.mjs`

Add rows: `{ html: "out/work/index.html", label: "/work/", maxKB: 60 }` (if 06 has not
already) and `{ html: "out/skills/index.html", label: "/skills/", maxKB: 120 }`. Raise
`/` to `maxKB: 80` (the dialog shell and the hero chip). Keep the rest.

### `package.json`

Add `"brief": "node scripts/check-brief.mjs"` and extend `check` to
`npm run lint && npm run build && npm run budget && npm run brief`.

### CI

Add `- run: npm run brief` after the budget step in `.github/workflows/ci.yml`.

### README

In `docs/fable2/README.md`, "Definition of done": no change needed (it already names
`npm run brief` from this issue onward). In the repo `README.md`, if it lists the
scripts, add the new one in one line.

## Files

Create: `scripts/check-brief.mjs`.
Modify: `scripts/check-budget.mjs`, `package.json`, `.github/workflows/ci.yml`,
`README.md` (one line, if applicable).

## Acceptance criteria

- [ ] `npm run build && npm run brief` passes on `Fable2` with 04, 05 and 07 merged, and prints the landmark read first. Paste the read in the PR; it should match the target list in `docs/fable2/README.md`, "The landmark read" (differences are a finding against 04, 05 or 07, not against this issue; list them).
- [ ] Each check fails when it should, then revert each change:
  - adding `<span className="tag measured">x</span>` to `Facts.tsx` fails `status tags`;
  - appending " on a team of 5" to `FACTS[0].small` fails `banned patterns` and names the file and the match;
  - wrapping one word of `BRIEF.about` in `<b>` (in `About.tsx`) fails `bold in body`;
  - changing the Education `<h2>` text to "Credentials" fails `landmarks in order` and names "Education".
- [ ] `npm run budget` shows five routes, all PASS.
- [ ] CI workflow runs the new step (check the file; a dry run is not required).
- [ ] Lint passes. The script has no dependencies and runs under the Node version in `.nvmrc` or `package.json` `engines`.

## Out of scope

Changing any page to pass; if `brief` fails, the owning issue fixes it.
