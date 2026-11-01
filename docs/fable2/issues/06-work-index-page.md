# 06 · `/work/`: every project on one page

**Phase**: C · **Size**: M · **Depends on**: 01, 03 · **Unblocks**: 08, 11

## Goal

"Work" in the masthead needs a destination, project pages need a parent, and the six
projects that are not on the front page need a place where they are listed with the same
weight as the four that are. `/work/` is that page: ten rows, one line each, plus the two
smaller things that used to sit under the front-page table.

## Source material

- `app/components/brief/ProjectIndex.tsx` on `Fable1` (`git show Fable1:app/components/brief/ProjectIndex.tsx`) for the row structure; simplify it.
- `app/content.ts`: `NOTES` (`order`, `title`, `oneLiner`, `where`, `id`), `ALSO`.
- `app/work/[slug]/page.tsx` for `BY_ORDER` and the metadata pattern.

## Layout

```
Work
Ten things I built, one page each.
──────────────────────────────────────────────────────────────────────────
01  VisionAssist   Head-mounted Pi 5 that spots obstacles and says how    →
                   many steps away, fully offline.
                   INFINEON TECHNOLOGIES · SOFTWARE LEAD, TEAM OF 5 · APR TO JUN 2026
──────────────────────────────────────────────────────────────────────────
02  Accordion      ...
...
10  Clear Dispatch ...
──────────────────────────────────────────────────────────────────────────
Also: ClassPath AI (2nd place, DA Hacks 3.5) ↗ · Beacon robot (fastest run in section) ↗
The long version of all of this is the datasheet ↗
```

## Spec

### `app/work/page.tsx` (server)

- `<Masthead variant="plain" current="work" resume={RESUME} />`.
- `<main className="brief work-index" id="main">` so the brief's shell width and heading
  styles apply.
- `<h1>Work</h1>` at the `.pi-head h2` size, with the mono line "Ten things I built, one
  page each." beside it (reuse `.pi-head`).
- `<ol className="wi">`, one `<li id={n.id}>` per note in `order`, each an
  `<a href={`/work/${n.id}/`} className="wi-row">` containing: `<span className="wi-n">`
  two-digit order, `<b className="wi-t">{n.title}</b>`, `<span className="wi-d">{n.oneLiner}</span>`,
  `<small className="wi-w">{n.where}</small>`, `<span className="wi-a" aria-hidden>→</span>`.
  `id` on the `<li>` so `/work/#rung` lands on the row (the row gets
  `scroll-margin-top: calc(var(--mast-h) + 12px)`).
- After the list, `<p className="wi-also">`: "Also: " then `ALSO[0].title` linked to its
  href with " (2nd place, DA Hacks 3.5)", " · ", `ALSO[1].title` linked with " (fastest run
  in section)". External links `target="_blank" rel="noreferrer"` with ↗. Note: the
  "14.41 s" time is not shown; it is a benchmark-style number (rule 3).
- `<p className="wi-long">`: "The long version of all of this is the " + link "datasheet ↗"
  to `/datasheet/`.
- Metadata: title "Work", description "Ten things I built, one page each: an ARM64 JIT,
  an offline vision wearable, a context manager for AI coding agents, bare-metal probe
  firmware, and more." Canonical `/work/`. OG image `/og/home.png` until issue 11.

### Styles

`.wi-row`: grid `40px 170px minmax(0, 1fr) 28px` at ≥ 900 px with `wi-d` and `wi-w`
stacked in the third column; under 900 px, `26px minmax(0, 1fr) 24px` with title, line and
where stacked. Hairline between rows, 1 px ink rule under the last. Row hover: `var(--paper)`
background. No status tags, no stack, no headline numbers.

## Files

Create: `app/work/page.tsx`.
Modify: `app/globals.css`.

## Acceptance criteria

- [ ] `/work/` lists ten rows in `order` with title, one-liner and `where`; each row links to its page.
- [ ] `/work/#alta` scrolls to the Alta row under the masthead.
- [ ] The page contains no `.tag` and none of: "38.84", "200 ms", "1,200", "8 ms", "525" (check `out/work/index.html`).
- [ ] At 390 px nothing scrolls sideways. Screenshot at 390 and 1440.
- [ ] No-JS: identical. Masthead shows Work as current.
- [ ] `npm run budget` shows `/work/` under 60 KB page-specific JS (add the row to `BUDGETS` in `scripts/check-budget.mjs` with `maxKB: 60`; 10 also touches this file, so keep the change to that one line).
- [ ] Lint and build pass.

## Out of scope

Breadcrumbs on project pages (08). The OG image (11).
