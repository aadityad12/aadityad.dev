# 14 · Performance budget script and CI

**Phase**: D · **Size**: S · **Depends on**: 01 · **Should land before**: 16

## Goal

Make the budgets in `docs/plan/README.md` enforceable so the front page can never again
grow a megabyte of map. Build, lint and budget run on every pull request.

## Spec

### `scripts/check-budget.mjs` (Node ≥ 22, no dependencies)

For each route in a table:

```js
const BUDGETS = [
  { html: "out/index.html",               label: "/",            maxKB: 60  },
  { html: "out/work/rung/index.html",     label: "/work/rung/",  maxKB: 180 },
  { html: "out/datasheet/index.html",     label: "/datasheet/",  maxKB: 500 },
];
```

1. Read the HTML. Collect every `<script src="...">` and `<link rel="preload" as="script" href="...">`
   path under `/_next/`.
2. Resolve each to `out/_next/...`, sum file sizes in bytes.
3. Subtract the shared Next runtime: compute it once as the sum of chunks referenced by
   **all three** pages (the intersection), report it separately as "runtime", and compare
   each page's **page-specific** total against `maxKB`. Print a table:
   `route · page-specific KB · runtime KB · budget · PASS/FAIL`.
4. Also fail if any route other than `out/map/index.html` references a chunk whose
   contents include the string `three` followed by `.module` or `THREE.REVISION`
   (cheap three.js detection), or references `heightmap`.
5. Exit 1 on any FAIL. Print nothing else to stderr.

Add `"budget": "node scripts/check-budget.mjs"` and make `"check"` = `npm run lint && npm run build && npm run budget`.

### `.github/workflows/ci.yml`

```yaml
name: CI
on:
  pull_request:
  push:
    branches-ignore: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm run budget
```

Leave `pages.yml` unchanged (it deploys `main`).

### Documentation

Add a "Budgets" paragraph to `README.md` pointing at the script and the table in
`docs/plan/README.md`.

## Files

Create: `scripts/check-budget.mjs`, `.github/workflows/ci.yml`.
Modify: `package.json`, `README.md`.

## Acceptance criteria

- [ ] `npm run budget` passes on the current branch and prints the three-row table.
- [ ] Temporarily importing `app/figures/index.tsx` into `app/page.tsx` makes it fail (revert after testing; describe in PR).
- [ ] The workflow runs on the PR for this issue and is green.
