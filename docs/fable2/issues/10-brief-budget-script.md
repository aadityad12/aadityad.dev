# 10 · The brief budget: words, tags, routes, in CI

**Phase**: E · **Size**: S · **Depends on**: 04, 05, 07

## Goal

Make the front page's quietness a test, so it cannot creep back. A script checks the built
`out/index.html` for a word count and a status-tag count, checks the new routes exist, and
runs in CI next to the JS budget. Also extend the JS budget to the new routes.

## Source material

- `scripts/check-budget.mjs`, `package.json` scripts, `.github/workflows/ci.yml`.
- `docs/fable2/README.md`, "What is wrong with Fable1, in numbers".

## Spec

### `scripts/check-brief.mjs`

Plain Node, no dependencies. Reads `out/index.html` (fail with a clear message if missing).

- Text extraction: take the `<main ...>...</main>` and `<footer ...>...</footer>` blocks,
  remove `<script>`, `<style>` and `<svg>` subtrees, strip tags, decode `&amp;` `&lt;`
  `&gt;` `&quot;` `&#x27;` `&nbsp;`, collapse whitespace, split on spaces.
- Checks, each printed as a `PASS`/`FAIL` row like `check-budget.mjs` does:
  1. `words` ≤ 600.
  2. `status tags` = 0 (count of `class="tag ` in the whole file).
  3. `banned strings` = 0: none of `38.84`, `200 ms`, `1,200`, `≈8`, `525`, `4.54`,
     `0.63`, `team of`, `-person team`, `solo` appear in `<main>` text, case-insensitive
     (benchmark numbers and team sizes that must not leak back onto the front page;
     extend the list if a new one appears). Run the same check on `out/work/index.html`
     and `out/skills/index.html`.
  4. `routes present`: `out/work/index.html` and `out/skills/index.html` exist.
- Exit 1 if any fails.

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

- [ ] `npm run build && npm run brief` passes on `Fable2` with 04, 05 and 07 merged, and prints the word count.
- [ ] Temporarily adding `<span className="tag measured">x</span>` to `Facts.tsx` makes it fail with a message naming the check; revert.
- [ ] `npm run budget` shows five routes, all PASS.
- [ ] CI workflow runs the new step (check the file; a dry run is not required).
- [ ] Lint passes.

## Out of scope

Changing any page to pass; if `brief` fails, the owning issue fixes it.
