# 04 · Front page: project index table

**Phase**: B · **Size**: M · **Depends on**: 02 (and 03 for the pin filter) · **Unblocks**: 05

## Goal

Ten projects, one row each, on one screen at 1440 px. The row answers "what is it, what's
the number, what's it built in, where do I click" and nothing else. It is the fix for
"too much content to find anything".

## Source material

- `app/content.ts`: `NOTES[]` sorted by `order`, using `oneLiner`, `headline`, `skills`,
  `stack`, `context`, `role`, `id`, `title`.
- `app/components/brief/pinStore.ts` (issue 03) for the filter.
- `app/components/Status.tsx`.
- The datasheet's `.dt` table styles in `globals.css` for the look (hairlines, mono
  numerics). Reuse the tokens; write new rules.

## Layout (1440 px)

```
Projects                                    Ten things I built. One page each.
──────────────────────────────────────────────────────────────────────────────
#   Project         What it is                              Number            Stack              
01  VisionAssist    Head-mounted Pi 5 that spots obstacles… ≈200 ms / frame   Python · PyTorch · …  →
    Infineon · software lead · team of 5                     [Measured]
02  Accordion       Context manager for AI coding agents…   240+ ★            TypeScript · HF · …   →
    Berkeley AI Hackathon · Sponsor Track winner · team of 4 [Repo]
…
```

Each row is one `<a href="/work/<id>/">` wrapping a CSS grid (`grid-template-columns:
40px 160px 1fr 180px 220px 32px`). Second line (context · role) under the title in mono
`--muted` 12px. Stack shows the first four `stack` items then "+N".

At 768 px: columns `40px 1fr 160px 32px`; stack hidden; one-liner wraps.
At 390 px: each row stacks: title line, one-liner, number with tag. No horizontal scroll.

## Spec

### `app/components/brief/ProjectIndex.tsx` (client, for the filter only)

- Server-render all ten rows; the filter only toggles a class. Rows are never removed
  from the DOM, so no-JS shows all ten.
- Read `usePins()`. For each row compute `hit = !pin || note.skills.includes(pin)` where
  `pin = selected ?? active`. Non-hits get `className="row dim"` (opacity .35, no
  pointer change); hits get `.row.lit` when a pin is active (left border `--accent`).
- Above the table, a filter bar that only renders when `selected` is set:
  `Showing <b>{n}</b> projects using <b>{pin}</b> · <button>Clear</button>`. Clear calls
  `pinStore.set({ selected: null, active: null })`.
- Row order: `NOTES` sorted by `order`. Number column: `String(order).padStart(2, "0")`.
- Headline cell: `<b className="num">{value}{unit ? " " + unit : ""}</b>` then
  `<small>{label}</small>` then `<Status s />` if present.
- Arrow cell: "→" in `--accent`, translateX(4px) on row hover (not under reduced motion).
- `aria-label` on each row link: `"${title}: ${oneLiner}"`.

### Section header

`<section id="projects" className="brief-projects">` with `<h2>Projects</h2>` and the
aside "Ten things I built. One page each. The long version is in the <a
href="/datasheet/">datasheet</a>." Mono 13px.

### Below the table

`ALSO` (ClassPath AI, Beacon robot) as one line: "Also: ClassPath AI (2nd place, DA Hacks
3.5) · Beacon robot (fastest run in section, 14.41 s) ↗". Each a link from `ALSO[].href`.

## Files

Create: `app/components/brief/ProjectIndex.tsx`.
Modify: `app/page.tsx` (render after `<Proof />`), `app/globals.css`.

## Acceptance criteria

- [ ] At 1440 × 900 the full table (all ten rows) fits in one viewport height when scrolled to the section header.
- [ ] Each row links to the right `/work/<id>/` and the link is the whole row.
- [ ] Every headline number shows a status tag; none is missing.
- [ ] Hovering the PYTHON pin on the chip lights six rows (visionassist, oss-scout, temper, clear-dispatch, alta, plus accordion only if its `skills` includes PYTHON, which it must not after corrections: so five rows).
- [ ] Selecting the C pin shows "Showing 1 project using C" and only Alta is lit.
- [ ] At 390 px no horizontal scrollbar on the page.
- [ ] No-JS: all ten rows visible, no filter bar.
- [ ] Build and lint pass.

## Out of scope

Project pages themselves (06). Any animation beyond the arrow nudge.
