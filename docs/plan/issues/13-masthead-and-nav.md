# 13 · Masthead and navigation across routes

**Phase**: D · **Size**: M · **Depends on**: 03, 06

## Goal

One masthead that knows which route it is on. On `/` it links to the front-page sections.
On `/work/<slug>/` it offers "All projects", prev/next, and "Datasheet entry". On
`/datasheet/` it keeps the section label and J/K paging it has today.

## Source material

- `app/components/Masthead.tsx` (this branch): mark, section label (`aria-live`), nav,
  progress bar, J/K keys.

## Spec

Rewrite `Masthead` to take a `variant` prop and read nothing from the DOM that a route
doesn't have.

```ts
type MastheadProps =
  | { variant: "brief" }
  | { variant: "work"; prev: { id: string; title: string }; next: { id: string; title: string }; id: string }
  | { variant: "datasheet" };
```

Common: `.mast-mark` links to `/` (icon + "Aaditya Desai"; drop the "AD2028" text outside
the datasheet variant, keep it inside it). Progress bar stays on all variants. Résumé
button stays on all variants. Height `--mast-h` unchanged.

- **brief**: nav = Projects (`#projects`), Experience (`#experience`), Education
  (`#education`), Contact (`#contact`), Datasheet (`/datasheet/`). The middle slot shows
  the availability text in mono: "Available Summer 2027" (so it is visible after the pill
  scrolls away). Section observer watches `section[id]` on the page and underlines the
  current nav item (`aria-current="true"`).
- **work**: left of the nav a mono crumb "Projects / {title}". Nav = ← {prev.title},
  {next.title} →, "All projects" (`/#projects`), "Datasheet entry" (`/datasheet/#${id}`).
  J/K keys move to prev/next project (navigate), announced in the crumb's `title`.
- **datasheet**: exactly today's behaviour (section label, J/K paging, four anchors).
  The "Projects" anchor becomes `/datasheet/#block-diagram` etc. (already absolute from 01).

Mobile (< 760 px): nav collapses to Résumé plus a "Menu" `<details>` disclosure listing
the same links. No JS needed for it to open.

The `useEffect` guards from issue 01 (no `[data-section]` → no listeners) remain.

## Files

Modify: `app/components/Masthead.tsx`, `app/page.tsx`, `app/work/[slug]/page.tsx`,
`app/datasheet/page.tsx`, `app/globals.css`.

## Acceptance criteria

- [ ] On `/`, scrolling updates `aria-current` on the matching nav item.
- [ ] On `/work/rung/`, K goes to the previous project page and J to the next; the links match the "Next" footer from issue 06.
- [ ] On `/datasheet/`, J/K page the sheets as before.
- [ ] At 390 px the menu opens and closes with no JavaScript.
- [ ] No console errors on any route.
- [ ] Build and lint pass.
