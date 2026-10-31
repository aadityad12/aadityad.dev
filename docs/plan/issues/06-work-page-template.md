# 06 · Project page template `/work/<slug>/`

**Phase**: C (project pages) · **Size**: L · **Depends on**: 02 · **Unblocks**: 07, 12, 13, 15

## Goal

One page per project for a hiring engineer. It reads top to bottom as: what this is, the
figure you can operate, what I built, the numbers with their status, what doesn't work,
photos, where to go next. The Reel (issue 07) slots in above the figure later; build this
issue so that the figure block can be swapped for the Reel without touching anything else.

## Source material

- `app/components/AppNote.tsx` (this branch): the content blocks to port (meta list,
  built list, key characteristics table, stack, errata, photos). Reuse `Rich` and `Fig`
  from `app/components/parts.tsx`.
- `app/figures/index.tsx`: `FIGURES[id]`.
- `app/content.ts`: `NOTES`, `PHOTOS`, `EXPERIENCE` (for the VisionAssist cross-link).
- `git show Sol:app/work/[slug]/page.tsx` (branch `Sol`): an earlier per-project page.
  Read it for the "next project" footer idea only; do not port its content model.

## Layout (1440 px)

```
[masthead: issue 13]
shell 1080px
AN-02 · COMPILERS AND RUNTIMES · PERSONAL PROJECT · SOLO · SEP–OCT 2026       (mono meta row)
Rung                                                                            (h1 72px)
One small language, built five ways, down to hand-written ARM64 machine code.   (hook 26px)
[GitHub ↗] [other links]                                           [← All projects]

┌─ Figure 1 · Rung ─────────────────────────────────────── Interactive ─┐
│                                                                        │
│   <FIGURES[id] />  (full width, max-height 560px)                      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
Figure 1. <note.figure>                                        (caption)

── Overview ────────────────────────────────────────────────────────────
<note.problem>                                                 (18px, 64ch)

── What I built ─────────────────────── Key characteristics ────────────
1. …                                   fib, JIT vs. tree-walker   38.84× [Measured]
2. …                                   …
3. …                                   Stack: C++20 · ARM64 · …

── Known limitations ───────────────────────────────────────────────────
┃ 1. …            (the errata box, `--hot` left rule, as on the datasheet)
┃ 2. …

── From the build ──────────────────────────────────────────────────────
[photo] [photo]

Next: VisionAssist →                      Full entry in the datasheet ↗
```

At 768 px: two-column blocks go single column. At 390 px: meta row wraps; figure keeps
its aspect; tables stack.

## Spec

### `app/work/[slug]/page.tsx`

Replace the placeholder. Server component. Sections in order, each a `<section>` with an
`id` (`overview`, `built`, `specs`, `limits`, `photos`):

1. **Header** (`<header className="work-head">`): meta row = `note.an` · `note.domain` ·
   `note.context` · `note.role` · `note.when`, each a `<span>`, mono 12px uppercase,
   separated by " · ". `<h1>{note.title}</h1>`. `<p className="hook">{note.hook}</p>`.
   Links row: `note.links` as `.button`s (external, `target="_blank" rel="noreferrer"`).
   Right-aligned `<a href="/#projects">← All projects</a>`.
2. **Figure block** (`<div className="work-figure" data-slot="reel">`): render
   `<Fig num="1" label={note.title} caption={note.figure}><F /></Fig>` where
   `F = FIGURES[note.id]`. If no figure exists, render the first `PHOTOS[note.id]` image
   in the frame with `live={false}`. The `data-slot="reel"` wrapper is where issue 07
   mounts the Reel; keep it a single element.
3. **Overview**: `<h2>Overview</h2><p>{note.problem}</p>`.
4. **What I built / Key characteristics** (two columns ≥ 900 px): left `<ol className="built">`
   with `<Rich text />`; right a `<table className="kspec">` with rows `param`
   (+ `small` note), `value`, and `<Status s={row.status} />` in a third cell. Under the
   table, "Stack" as `.stack` chips (existing style).
5. **Known limitations**: the datasheet's `.errata` block, heading "Known limitations"
   instead of "Errata" (keep the `--hot` rule). Numbered list of `note.errata`.
6. **From the build**: only if `PHOTOS[note.id]` exists. `next/image` with the stored
   `w`/`h`, captions "Plate A." etc. as on the datasheet.
7. **Footer nav** (`<nav className="work-next">`): "Next: {next.title} →" where `next` is
   the note with `order + 1` (wrap to 1), and "Full entry in the datasheet ↗" to
   `/datasheet/#${note.id}`. For VisionAssist also "Experience: Infineon →" to `/#experience`.

### Metadata

`generateMetadata`: `title: \`${note.title} · Aaditya Desai\``, `description: note.hook`,
`alternates.canonical: \`/work/${note.id}/\``, `openGraph.url` same. OG image comes in 15.

### Styles

`/* ---- work ---- */` block in `globals.css`, classes prefixed `.work-` or scoped under
`main.work`. Reuse `.fig`, `.built`, `.kspec`, `.stack`, `.errata`, `.an-photo-row` where
they fit; override spacing with scoped rules rather than editing the datasheet rules.

### Figures that need a width

Some figures assume the datasheet's two-column width (about 560 px). In the single-column
figure block they get up to 1080 px. Wrap the figure in a centred container with
`max-width: 720px` unless the figure is `AccordionMap`, `VisionScene`, `RungLadder` or
`DispatchTiming`, which may use the full width. Check each of the ten pages visually.

## Files

Modify: `app/work/[slug]/page.tsx`, `app/globals.css`.
Possibly modify (only if a figure breaks at the new width; note it in the PR):
individual files in `app/figures/`.

## Acceptance criteria

- [ ] All ten `/work/<slug>/` pages render with the right figure, text, specs, limitations and photos.
- [ ] Every `specs` row shows a status tag.
- [ ] Each figure is operable by keyboard where it was on the datasheet (spot-check Rung, GazeBoard, VisionAssist).
- [ ] "Next" links walk 1 → 2 → … → 10 → 1 in `order`.
- [ ] `/work/accordion/` says "Team of 4" and does not contain "attribution view".
- [ ] At 390 px no horizontal scroll on any of the ten pages.
- [ ] No-JS: all text visible; the figure frame shows its static first state or the fallback photo.
- [ ] Build and lint pass; the build still emits all ten pages.

## Out of scope

The Reel (07). Beat wiring (08 to 11). Masthead (13). OG images (15).
