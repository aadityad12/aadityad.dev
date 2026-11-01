# 03 · Masthead: one navigation on every route

**Phase**: B · **Size**: M · **Depends on**: 01 (for nothing but ordering), 02 (trigger contract) · **Unblocks**: 04, 05, 06, 07, 08

## Goal

A reader should learn the masthead once. Today `/` shows five items, `/work/<slug>/`
shows a different five (previous, next, all projects, datasheet entry) and `/datasheet/`
a third set. In Fable2 the masthead shows the same four items on every route, plus the
resume button. Route-specific wayfinding (previous/next, breadcrumbs) moves into the page
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

### Styles

Nothing new beyond what the removed items free up. The `.mast-step*` rules can go. Check
the masthead still fits in one row at 1000 px with four items plus the resume button.

## Files

Modify: `app/components/Masthead.tsx`, `app/not-found.tsx`, `app/globals.css`,
`app/skills/page.tsx` (if present).

## Acceptance criteria

- [ ] On `/`, `/work/`, `/work/rung/`, `/skills/`, `/datasheet/` and `/nope/` the masthead shows exactly: mark, (middle slot), Work, Experience, Skills, Contact, Résumé. Screenshot each at 1440.
- [ ] On `/work/rung/`: the crumb reads "Work / Rung", "Work" links to `/work/`; J goes to `/work/visionassist/`, K to `/work/accordion/`; Work has `aria-current="page"`.
- [ ] On `/skills/`: Skills has `aria-current="page"` and clicking it does nothing new (plain link to the page you are on).
- [ ] On `/datasheet/`: section label updates on scroll; J/K page as before.
- [ ] At 390 px the menu opens and closes without JavaScript and lists the four items.
- [ ] `grep -n "mast-step" app/` returns nothing.
- [ ] No console errors on any route. Lint and build pass.

## Out of scope

Breadcrumbs and previous/next in the page body (08). The dialog itself (02).
