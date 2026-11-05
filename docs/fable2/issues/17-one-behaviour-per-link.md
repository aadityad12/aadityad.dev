# 17 · One behaviour per link: no dialog, no index page

**Phase**: H · **Size**: M · **Depends on**: 16 (merged) · **Unblocks**: 18

## Goal

A reader cannot predict what a masthead item does: Work opens a list page that repeats the
front page, Skills opens a panel over whatever page they are on, Experience and Contact
scroll. After this issue every link goes to a place and does the same thing on every route
(README rule 17). The skills dialog goes; `/skills/` is the only skills surface and the
chip's pins link into it. `/work/` goes; the front page is the index of the work (issue 19
makes it a complete one). No copy changes; only link targets and the code that served the
dialog and the index page.

## Source material

- `app/layout.tsx` (mounts `SkillsDialog`); `app/components/skills/SkillsDialog.tsx`
  (deleted); `app/components/skills/SkillsMap.tsx`; `app/components/brief/HeroChip.tsx`;
  `app/components/brief/Hero.tsx`; `app/components/brief/Work.tsx`;
  `app/components/Masthead.tsx`; `app/work/page.tsx` (deleted); `app/work/[slug]/page.tsx`;
  `app/not-found.tsx`; `app/skills/page.tsx`; `app/sitemap.ts`.
- `scripts/check-brief.mjs` (`FILES`), `scripts/check-budget.mjs` (`BUDGETS`),
  `scripts/og/README.md`, `scripts/og/index.html` (deleted), `public/og/work.png` (deleted).
- `app/globals.css`: the masthead availability item (`.mast-avail`, lines 77 and 102 to
  104), `.skills-dialog*` (711 to 716, 722 to 723, 725 to 728), `/* ---- work index ---- */`
  (730 to 749).
- `app/content.ts`: `PINS[].n` (1 to 28) and `PINS[].name`.
- README: "Round 3", decisions 1 and 2; rule 17.

## Spec

### 1. The dialog goes

- `app/layout.tsx`: remove the `SkillsDialog` import and `<SkillsDialog />`. The body is
  `<body>{children}</body>`.
- Delete `app/components/skills/SkillsDialog.tsx`.
- `app/globals.css`: delete `.skills-dialog`, `.skills-dialog::backdrop`,
  `.skills-dialog-in`, `.skills-close`, `.skills-close:hover`,
  `html:has(.skills-dialog[open])`, the two `.skills-dialog` rules inside the skills
  `@media (min-width: 900px)` block, and the whole
  `@media (prefers-reduced-motion: no-preference)` block with `skills-enter`.
- `Hero.tsx`: remove `data-skills` from the `.cta` link and from the `.brief-chipcard`.
  Both keep `href="/skills/"`.
- `Masthead.tsx`: remove the `data` field from the `Item` type and from the Skills item;
  remove `{...it.data}` from `link()`; in `inField`, drop `dialog` from the selector.

### 2. The pin map reads the hash

`SkillsMap.tsx` loses its props (`initialPin` and `heading`; the dialog was the only
caller that passed them) and selects a pin from the URL on arrival:

```tsx
"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Chip from "../Chip";
import { BRIEF, NOTES, PINS, PIN_GROUPS } from "../../content";
import { useReducedMotion } from "../../figures/hooks";

// /skills/#pin-N selects pin N on arrival, so a pin on the front-page chip can link straight to its row.
const pinFromHash = () => {
  const m = /^#pin-(\d+)$/.exec(window.location.hash);
  const pin = m && PINS.find((p) => p.n === Number(m[1]));
  return pin ? pin.name : null;
};

export default function SkillsMap() {
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const rows = useRef(new Map<string, HTMLLIElement>());
  const reduced = useReducedMotion();

  useEffect(() => {
    const name = pinFromHash();
    if (!name) return;
    setSelected(name);
    setActive(name);
    rows.current.get(name)?.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, []);

  const select = (name: string | null) => { /* unchanged */ };

  return (
    <div className="skills-map">
      <header className="sk-head">
        <h1 id="skills-h">Pin map</h1>
        ...
```

Everything below the header is unchanged. `app/skills/page.tsx` renders `<SkillsMap />`.

### 3. The chip's pins link to the pin map

`HeroChip.tsx`:

```tsx
"use client";

import { useState } from "react";
import Chip from "../Chip";
import { PINS } from "../../content";

export default function HeroChip() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Chip
      activePin={active}
      selectedPin={null}
      onHoverPin={setActive}
      onSelectPin={(name) => {
        const pin = PINS.find((p) => p.name === name);
        if (pin) window.location.assign(`/skills/#pin-${pin.n}`);
      }}
    />
  );
}
```

`Chip` is unchanged: in index mode it already ignores pins with no uses, so those still do
nothing, and a pin with uses navigates on click, Enter or Space. `window.location.assign`
rather than the router: it is what a plain link does, and the chip has no `<a>` to give the
browser.

### 4. The masthead goes to places

`Masthead.tsx`:

```ts
const ITEMS: Item[] = [
  { href: "/#work", label: "Work", cur: "work" },
  { href: "/#experience", label: "Experience", cur: "experience" },
  { href: "/skills/", label: "Skills", cur: "skills" },
  { href: "/#contact", label: "Contact", cur: "contact" },
];
```

- Remove the `mast-avail` element (`{props.variant === "brief" && <div className="mast-mid
  mast-avail">Available Summer 2027</div>}`). CSS: `.mast-sec, .mast-avail { … }` becomes
  `.mast-sec { … }`; delete the `@media (max-width: 1180px)` block that hid `.mast-avail`.
- `MastheadProps`: the `plain` variant's `current` is `"skills"` only.
- Brief variant: `targets` is `document.querySelectorAll("#work, #experience, #contact")`.
- `ariaCurrent`:

```ts
const ariaCurrent = (it: Item): "page" | "true" | undefined => {
  if (it.cur === "skills" && props.variant === "plain" && props.current === "skills") return "page";
  if (it.cur === "work" && props.variant === "work") return "true";
  if (props.variant === "brief" && it.cur === current) return "true";
  return undefined;
};
```

- Work variant crumb: `<Link href="/#work" prefetch={false}>Work</Link> / <b>{props.title}</b>`.

### 5. `/work/` goes

- Delete `app/work/page.tsx`, `public/og/work.png`, `scripts/og/index.html`.
- `scripts/og/README.md`: remove `public/og/work.png` and `index.html` from the first
  paragraph and the line `await shoot(`${base}/index.html`, "work.png");` from the recipe.
- `app/sitemap.ts`: the list is `["/", "/skills/", "/datasheet/", ...NOTES.map(…)]`.
- `scripts/check-budget.mjs`: remove the `/work/` row from `BUDGETS`.
- `scripts/check-brief.mjs`: `const FILES = ["out/index.html", "out/skills/index.html"];`.
- `app/not-found.tsx`: `<Link href="/#work" prefetch={false}>Work</Link>` replaces the
  "All work" link.
- `app/work/[slug]/page.tsx`: the crumb is `<Link href="/#work">← All work</Link>`; the
  footer's `<Link href="/#work">All work</Link>`.
- `Work.tsx`: remove the `All ten projects →` link and the now-unused `Link` import. The
  `.wk-more` paragraph ends with the six titles and the full stop. Issue 19 replaces this
  component; this is the minimum so that nothing on the site points at a deleted route.
- `app/globals.css`: delete the `/* ---- work index ---- */` block (`main.work-index …`
  through the `.wi-row` media rule).
- `ALSO` stays in `content.ts`; the datasheet uses it.

No redirect: a static export cannot issue one, and the 404 page links to the front page and
to `/#work`.

## Files

Delete: `app/components/skills/SkillsDialog.tsx`, `app/work/page.tsx`, `public/og/work.png`,
`scripts/og/index.html`.
Modify: `app/layout.tsx`, `app/components/skills/SkillsMap.tsx`,
`app/components/brief/HeroChip.tsx`, `app/components/brief/Hero.tsx`,
`app/components/brief/Work.tsx`, `app/components/Masthead.tsx`, `app/work/[slug]/page.tsx`,
`app/not-found.tsx`, `app/skills/page.tsx`, `app/sitemap.ts`, `app/globals.css`,
`scripts/check-brief.mjs`, `scripts/check-budget.mjs`, `scripts/og/README.md`.

## Acceptance criteria

- [ ] `grep -rn "data-skills\|skills:open\|SkillsDialog\|skills-dialog\|mast-avail\|work-index\|initialPin" app/ scripts/` returns nothing.
- [ ] Every remaining `/work/` in `app/` and `scripts/` is followed by a slug or a template expression (`grep -rn "/work/" app/ scripts/` and read the list); `grep -rn '"/work/"' app/ scripts/` returns nothing.
- [ ] After `npm run build`: `out/work/index.html` does not exist; `out/work/rung/index.html` and `out/skills/index.html` do; `out/sitemap.xml` has no `<loc>https://aadityad.dev/work/</loc>`; `grep -c "<dialog" out/index.html out/skills/index.html out/work/rung/index.html` is 0 for each.
- [ ] On the served build, from each of `/`, `/skills/`, `/work/rung/` and `/datasheet/`: the four masthead items go to `/#work`, `/#experience`, `/skills/`, `/#contact`; nothing opens over the page; the browser's back button returns to the previous page each time. On `/`, Work and Experience land on their section heading under the masthead.
- [ ] On `/` at 1440: clicking a pin with uses (the ARM64 lead, pin 3) loads `/skills/#pin-3`; the ARM64 row is highlighted (`li.sel`) and in view; the chip on `/skills/` shows that pin selected. Enter on a focused pin does the same. A pin with no uses does nothing, as before.
- [ ] Opening `/skills/#pin-17` directly selects and scrolls to the LINUX row. Opening `/skills/` selects nothing. Clicking pins on `/skills/` still filters in place and does not change the URL.
- [ ] `aria-current`: on `/`, Work, Experience and Contact take `aria-current="true"` as their section crosses the reading line; on `/skills/`, Skills is `aria-current="page"`; on `/work/rung/`, Work is `aria-current="true"`.
- [ ] The masthead on `/` shows no "Available Summer 2027" text at any width (the availability stays in the hero pill until 18 moves it).
- [ ] `/work/rung/`: the crumb "← All work", the masthead crumb "Work" and the footer "All work" all go to `/#work`.
- [ ] `npm run brief` passes; the landmark read is unchanged except that the `cta All ten projects →` stop is gone. `npm run budget` passes; record the `/` page-specific size before and after (the dialog shell was client code on every route).
- [ ] No-JS: `/` renders fully; the chip caption link and the phone chip card go to `/skills/`; `/skills/` renders its list and chip. Reduced motion: unchanged. Keyboard: Tab reaches the hero chip's pins, arrow keys move between them, Enter navigates.
- [ ] Lint, build, budget, brief pass. No console errors or hydration warnings on `/`, `/skills/`, `/skills/#pin-3`, `/work/rung/`.

## Out of scope

The hero and the sheet (18); the work rows (19); experience and the sign-off (20). Copy.
The datasheet, beyond what the shared masthead changes.
