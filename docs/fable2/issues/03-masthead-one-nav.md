# 03 · Masthead: one navigation on every route

**Phase**: B · **Size**: M · **Depends on**: 01 (for nothing but ordering), 02 (trigger contract) · **Unblocks**: 04, 05, 06, 07, 08

## Goal

A reader should learn the masthead once, and be able to read it. Today `/` shows five
items, `/work/<slug>/` shows a different five (previous, next, all projects, datasheet
entry) and `/datasheet/` a third set, all set in 11.5 px mono capitals; on a project page
the previous and next items shrink to bare arrows below 1000 px. Aadi's words: he did not
realise the bar was how you moved between projects, because it was not legible. In Fable2
the masthead shows the same four items on every route, plus the resume button, in type
the reader can read without leaning in. Route-specific wayfinding (previous/next, breadcrumbs) moves into the page
body (issue 08). The datasheet keeps its section label and J/K paging; project pages keep
J/K for previous/next even though the links leave the masthead.

## Source material

- `app/components/Masthead.tsx` (this branch): variants, progress bar, J/K handlers,
  the `<details>` mobile menu, section observer.
- `docs/plan/issues/13-masthead-and-nav.md`: the contract this replaces.
- `app/globals.css` lines 62 to 116: `.mast-*` rules.

## Spec

### Props

```ts
export type MastheadProps = { resume: string } & (
  | { variant: "brief" }                                             // /
  | { variant: "plain"; current?: "work" | "skills" }                 // /work/, /skills/, /404
  | { variant: "work"; id: string; title: string; prev: Ref; next: Ref } // /work/<slug>/
  | { variant: "datasheet" }
);
```

`prev` and `next` stay on the work variant for the J/K keys only; they are not rendered.

### Items, identical on every variant

```ts
const ITEMS: Item[] = [
  { href: "/work/", label: "Work", cur: "work" },
  { href: "/#experience", label: "Experience", cur: "experience" },
  { href: "/skills/", label: "Skills", cur: "skills", data: { "data-skills": "" } },
  { href: "/#contact", label: "Contact", cur: "contact" },
];
```

Then the resume button as today. Remove `BRIEF_ITEMS`, `DATASHEET_ITEMS` and the work
item list. The `Item` type gains `data?: Record<string, string>` spread onto the `<Link>`.
The Skills link carries `data-skills` so issue 02's dialog intercepts it; without
JavaScript it is a link to `/skills/`.

`aria-current`:
- `"page"` on Work when `variant === "work"` or `variant === "plain" && current === "work"`.
- `"page"` on Skills when `variant === "plain" && current === "skills"`.
- `"true"` on Experience or Contact on the brief variant when the section observer says
  so (existing behaviour; the observer now only needs to watch `#experience` and
  `#contact`, and `#work`, `#education`, `#about` should not light anything).

### Middle slot

- brief: "Available Summer 2027" (unchanged).
- work: crumb `Work / <b>{title}</b>` where "Work" is a `<Link href="/work/">`. The
  `title` attribute keeps the J/K hint. The crumb stays visible down to 560 px as today.
- datasheet: section label with `aria-live`, unchanged.
- plain: empty.

### Keys

- work: J and K navigate to `next.id` / `prev.id` as today.
- datasheet: J and K page the sheets as today.
- Escape closes the mobile menu as today.

### Mobile menu (< 760 px)

Same `<details>`; it lists the same four items. The Skills link inside the menu also
carries `data-skills`; closing the menu on click stays.

### Callers

- `app/page.tsx`: `variant="brief"` (unchanged).
- `app/work/[slug]/page.tsx`: unchanged props (it already passes `id`, `title`, `prev`,
  `next`).
- `app/datasheet/page.tsx`: unchanged.
- `app/not-found.tsx`: add `<Masthead variant="plain" resume={RESUME} />` above `<main>`
  (it has none today) and change its links to "Front page", "All work" (`/work/`), "Full
  datasheet".
- `app/skills/page.tsx` (from issue 02): `variant="plain" current="skills"`. If 02 has
  not merged yet, leave a note in the PR; whichever lands second makes the switch.

### Styles: make it legible

The masthead is the one piece of navigation on every page; it is set in the site's sans,
at a size a reader notices.

- `--mast-h` becomes 56 px.
- `.mast-nav a`: `font-family: var(--sans)`, 14.5 px, weight 600, no uppercase, letter
  spacing 0, padding 8 px 10 px. Keep the hover inversion and the accent underline for
  `aria-current`.
- `.mast-mark span` (the name): 15 px, weight 700, as today.
- `.mast-mid` (crumb and availability): 13 px mono, uppercase as today; on the work
  variant the crumb reads `Work / <b>Rung</b>` with "Work" underlined (it is a link) and
  the title in `--ink` weight 600.
- `.mast .pdf` (the Résumé button): 13 px mono as today, padding 7 px 11 px.
- `.mast-menu summary`: 14 px sans weight 600, label "Menu".
- `.mast-menu-list a`: 17 px sans weight 600, padding 16 px 4 px.
- The `.mast-step*` rules go. Check the masthead fits in one row at 1000 px with four
  items plus the resume button; if it does not, drop the "PDF" word earlier (the
  `.mast-pdf-x` rule already does this at 1000 px; move it to 1100 px).

## Files

Modify: `app/components/Masthead.tsx`, `app/not-found.tsx`, `app/globals.css`,
`app/skills/page.tsx` (if present).

## Acceptance criteria

- [ ] On `/`, `/work/`, `/work/rung/`, `/skills/`, `/datasheet/` and `/nope/` the masthead shows exactly: mark, (middle slot), Work, Experience, Skills, Contact, Résumé. Screenshot each at 1440.
- [ ] The four items are 14.5 px sans weight 600 (inspect computed style); no masthead text other than the crumb, the availability line and the Résumé button is mono or uppercase. The menu items at 390 are 17 px.
- [ ] On `/work/rung/`: the crumb reads "Work / Rung", "Work" links to `/work/`; J goes to `/work/visionassist/`, K to `/work/accordion/`; Work has `aria-current="page"`.
- [ ] On `/skills/`: Skills has `aria-current="page"` and clicking it does nothing new (plain link to the page you are on).
- [ ] On `/datasheet/`: section label updates on scroll; J/K page as before.
- [ ] At 390 px the menu opens and closes without JavaScript and lists the four items.
- [ ] `grep -n "mast-step" app/` returns nothing.
- [ ] No console errors on any route. Lint and build pass.

## Out of scope

Breadcrumbs and previous/next in the page body (08). The dialog itself (02).
