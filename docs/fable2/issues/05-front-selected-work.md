# 05 · Front page: selected work

**Phase**: C · **Size**: M · **Depends on**: 01, 03 (and 06 must be merged before launch, for the `/work/` link target) · **Unblocks**: 10

## Goal

Four cards instead of a ten-row, six-column table. Each card says what the thing is in one
plain sentence and where it was built. No headline number, no status tag, no stack. The
other six projects are named in one line, each linked, with a link to `/work/` for all ten.

## Source material

- `app/components/brief/ProjectIndex.tsx` (to be replaced), `app/globals.css` lines
  501 to 543 (`.pi-*`, to be replaced).
- `app/content.ts`: `FEATURED`, `NOTES[].oneLiner`, `NOTES[].where`, `BRIEF.workIntro`,
  `BRIEF.moreWork`.

## Layout

1440 px:

```
Selected work                                  Four of ten. Each has its own page.
───────────────────────────────────────────────────────────────────────────────
┌────────────────────────────────────┐ ┌────────────────────────────────────┐
│ 01                               → │ │ 02                               → │
│ VisionAssist                       │ │ Accordion                          │
│ Head-mounted Pi 5 that spots       │ │ Context manager for AI coding      │
│ obstacles and says how many steps  │ │ agents: folds what isn't carrying  │
│ away, fully offline.               │ │ weight, reversibly.                │
│ INFINEON TECHNOLOGIES · SOFTWARE   │ │ UC BERKELEY AI HACKATHON 2026 ·    │
│ LEAD, TEAM OF 5 · APR TO JUN 2026  │ │ SPONSOR TRACK WINNER · TEAM OF 4   │
└────────────────────────────────────┘ └────────────────────────────────────┘
┌────────────────────────────────────┐ ┌────────────────────────────────────┐
│ 03  Rung ...                       │ │ 04  Alta ...                       │
└────────────────────────────────────┘ └────────────────────────────────────┘
Also with a page each: GazeBoard, OSS Scout, ApexTracker, Echo, Temper, Clear Dispatch.
All ten projects →
```

Under 900 px: one column of cards. The "also" line wraps.

## Spec

### `Work` (server, `app/components/brief/Work.tsx`)

Replaces `ProjectIndex.tsx`. No client code: the filter is gone.

```tsx
<section id="work" className="brief-work" aria-labelledby="work-h">
  <header className="pi-head">
    <h2 id="work-h">Selected work</h2>
    <p>{BRIEF.workIntro}</p>
  </header>
  <ol className="wk">
    {FEATURED.map((id, i) => { const n = byId(id); return (
      <li key={id}>
        <a href={`/work/${id}/`} className="wk-card" aria-label={`${n.title}: ${n.oneLiner}`}>
          <span className="wk-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <span className="wk-a" aria-hidden="true">→</span>
          <h3>{n.title}</h3>
          <p>{n.oneLiner}</p>
          <small>{n.where}</small>
        </a>
      </li>
    ); })}
  </ol>
  <p className="wk-more">
    {BRIEF.moreWork}{" "}
    {REST.map((n, i) => <>{i > 0 && ", "}<a href={`/work/${n.id}/`}>{n.title}</a></>)}.{" "}
    <a className="wk-all" href="/work/">All ten projects →</a>
  </p>
</section>
```

`REST` is `NOTES` sorted by `order`, minus `FEATURED`, so today: GazeBoard, OSS Scout,
ApexTracker, Echo, Temper, Clear Dispatch. The old `pi-also` line (ClassPath AI, Beacon
robot) moves to `/work/` (issue 06) and leaves the front page.

Keep the existing `.pi-head` header style (title left, mono line right); it is reused by
07. Section id changes from `projects` to `work`; `grep -rn "#projects" app/` must be
empty after this PR (the masthead no longer links to it after 03; the work page's
"All projects" link is replaced in 08; fix any that remain and say so).

### Styles

`.wk`: `grid-template-columns: repeat(2, minmax(0, 1fr))`, gap 16 px, one column under
900 px. `.wk-card`: block link, `var(--paper)` background, 1 px `var(--hair)` border,
padding 18 px 20 px, `text-decoration: none`, `h3` at 22 px weight 800 stretch 112%, `p`
15.5 px `--ink-2` max 44ch, `small` mono 11.5 px uppercase `--muted` letter-spacing 0.06em.
Hover and focus-visible: border colour `var(--ink)`, arrow translates 4 px (not under
reduced motion). `.wk-n` and `.wk-a` mono, top corners. `.wk-more` mono 13 px, margin-top
16 px; `.wk-all` weight 600.

Delete `.pi-cols`, `.pi .row`, `.pi-*` rules except `.pi-head`, and `.pi-filter`.

## Files

Create: `app/components/brief/Work.tsx`.
Modify: `app/page.tsx` (`<Work />` replaces `<ProjectIndex />`), `app/globals.css`.
Delete: `app/components/brief/ProjectIndex.tsx`, and `app/components/brief/pinStore.ts`
if 04 left it.

## Acceptance criteria

- [ ] Four cards in the order VisionAssist, Accordion, Rung, Alta; each links to its page; the whole card is the link.
- [ ] No number other than the card index appears in the section; no `.tag`; no stack names.
- [ ] The "also" line names six projects, each linked, then "All ten projects →" to `/work/`.
- [ ] At 390 px the cards stack, nothing scrolls sideways, the "also" line wraps cleanly.
- [ ] `grep -rn "#projects" app/` is empty (or every remaining hit is explained in the PR).
- [ ] The section adds at most 170 words to `<main>` (count `out/index.html` before and after; put both numbers in the PR).
- [ ] No-JS: identical. Reduced motion: no arrow movement.
- [ ] Lint, build, budget pass.

## Out of scope

The `/work/` page (06). Experience onward (07).
