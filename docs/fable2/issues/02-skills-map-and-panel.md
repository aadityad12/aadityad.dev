# 02 · The skills map: `/skills/`, the panel, and the compact chip

**Phase**: B · **Size**: L · **Depends on**: 01 · **Unblocks**: 03, 04, 11

## Goal

Give the chip a home where it can be as detailed as it likes, and take that detail off
the front page. The skills map is the interactive chip beside a plain, grouped list of
the 28 skills, each naming the projects that used it. It exists twice from one component:
as the page `/skills/` (the no-JavaScript and linkable version), and as a pop-up panel
(a native `<dialog>`) that opens over any page from a "Skills" link in the masthead or
from the chip in the hero. Also add a `compact` mode to `Chip` so the hero can show a
small, label-free chip on phones (issue 04 uses it).

## Source material

- `app/components/Chip.tsx`: index mode (`onSelectPin` set) gives pins `role="button"`,
  roving tabindex, arrow keys, tooltip, the "lit" state that writes the pin name on the
  chip body. Keep all of it. `app/components/brief/ChipIndex.tsx` and `pinStore.ts` show
  how it was driven; do not reuse the store (issue 04 deletes it).
- `app/content.ts`: `PINS` (with `full` and `uses` from issue 01), `PIN_GROUPS`, `NOTES`.
- `app/components/Masthead.tsx`: where the "Skills" link will live (issue 03 adds it; this
  issue defines the trigger contract).
- `app/globals.css`: `.chip-*` rules, `.sheet`, the brief tokens.

## Spec

### `SkillsMap` (client, `app/components/skills/SkillsMap.tsx`)

```ts
type SkillsMapProps = { initialPin?: string | null; heading?: "h1" | "h2" };
```

Layout at ≥ 900 px: two columns, chip left (max 460 px), list right. Under 900 px: chip
on top (max 320 px, centred), list below.

- Renders `<Chip activePin selectedPin onHoverPin onSelectPin />` with local `useState`
  for `active` and `selected`. No global store.
- The list: one `<section>` per `PIN_GROUPS` entry with an `<h3>` (mono, uppercase) and a
  `<ul>`. Each `<li id={"pin-" + pin.n} data-pin={pin.name}>`:
  - `<b>{pin.full}</b>` then `<span className="sk-desc">{pin.desc}</span>`
  - `<span className="sk-uses">` "Used in " followed by one `<Link href={`/work/${id}/`}>`
    per entry of `pin.uses`, joined by ", "; or the text "Teaching and coursework" when
    `uses` is empty (x86 is the only such pin today).
- Two-way highlight: hovering or focusing a row (`onPointerEnter`, `onFocus` on the row's
  first link, via the `<li>`) sets `active` to that pin, so the chip lights it; leaving
  clears to `selected ?? null`. Selecting a pin on the chip sets `selected`, adds class
  `sel` to the matching `<li>`, and scrolls it into view (`scrollIntoView({ block:
  "nearest", behavior: reduced ? "auto" : "smooth" })`). Hovering a pin sets `active`
  and adds class `on` to the row.
- `initialPin`: if set and valid, start with it selected and scrolled to (used when the
  panel opens from a specific pin).
- `heading`: `/skills/` passes `"h1"` and the panel passes `"h2"`. The heading text is
  "Pin map" and the line under it is `BRIEF.chip.line` followed by `BRIEF.chip.hover` at
  ≥ 768 px (hide the hover sentence under 768 px with the existing
  `.brief-cap-hover` / `.brief-cap-touch` pattern, or an equivalent).
- A closing line under the list: "The pin table in the datasheet has the same
  information as text. " with a link "Pin table ↗" to `/datasheet/#specs`.

### `/skills/` (server, `app/skills/page.tsx`)

- `<Masthead variant="plain" resume={RESUME} />` (variant from issue 03; until 03 lands,
  use `variant="brief"` and note it in the PR; 03 will switch it).
- `<main className="skills" id="main"><SkillsMap heading="h1" /></main>`.
- Metadata: title "Skills", description "28 skills, one per pin, and the projects that
  used each one." Open Graph image `/og/home.png` for now (issue 11 makes one).
- Static route. `trailingSlash` is on, so the URL is `/skills/`.

### `SkillsDialog` (client, `app/components/skills/SkillsDialog.tsx`)

Mounted once in `app/layout.tsx`, after `{children}`. Renders:

```tsx
<dialog className="skills-dialog" ref={dlg} aria-labelledby="skills-dialog-h">
  <div className="skills-dialog-in">
    <button type="button" className="skills-close" onClick={close} aria-label="Close">Close ✕</button>
    {open && <SkillsMap heading="h2" initialPin={pin} />}
  </div>
</dialog>
```

`SkillsMap` is imported with `next/dynamic` and `{ ssr: false }` so its chunk (and the
chip) is fetched on first open, not on every page load. The dialog itself is tiny.

Opening:
- Document-level `click` listener. If the click's target is inside an element matching
  `a[data-skills]`, no modifier key is held, it is a plain left click, and
  `location.pathname !== "/skills/"`: `preventDefault()`, read `data-skills-pin` (optional
  pin name) and open.
- Window `skills:open` `CustomEvent` with `detail: { pin?: string }`: open. The hero chip
  (issue 04) dispatches this when a pin is clicked.
- On mount, if `location.hash === "#skills"`: open.
- Open means: remember `document.activeElement` as the return target, `showModal()`,
  `history.pushState(null, "", "#skills")` (only if the hash isn't already `#skills`), set
  `open` state so `SkillsMap` mounts.

Closing:
- The Close button, Escape (native `cancel` event: let it close and handle `close`), and a
  click on the backdrop (a `click` on the `<dialog>` element itself whose target is the
  dialog, not its child) all call `dlg.close()`.
- On the dialog's `close` event: if the hash is `#skills`, `history.back()`; otherwise do
  nothing to history. Return focus to the remembered element. Set `open` to false after
  the close transition (or immediately under reduced motion).
- `popstate`: if the dialog is open and the hash is no longer `#skills`, `dlg.close()`
  without touching history again.

Behaviour on `/skills/` itself: `data-skills` links are plain links there (the condition
above), and `#skills` on that page does nothing.

Styles (`app/globals.css`, under a `/* ---- skills ---- */` banner):
- ≥ 900 px: a side sheet pinned to the right, `width: min(960px, 92vw)`, full height,
  `border-left: 1px solid var(--ink)`, background `var(--bg)`, no border radius. Under
  900 px: full screen. Inner padding `var(--pad)`, content scrolls inside the dialog.
- `::backdrop { background: rgba(18, 18, 17, 0.42) }`.
- Entry: `transform: translateX(16px); opacity: 0` to rest, 180 ms, only when
  `prefers-reduced-motion` is not `reduce`. Nothing animates otherwise.
- `html:has(.skills-dialog[open]) { overflow: hidden }` so the page does not scroll behind.
- Close button: top right, mono, `.button` look.

### Trigger contract (used by issues 03 and 04)

Any element `<a href="/skills/" data-skills>` opens the panel when JavaScript runs and
navigates to `/skills/` when it does not. `data-skills-pin="C++"` opens to that pin.
`window.dispatchEvent(new CustomEvent("skills:open", { detail: { pin: "C++" } }))` does
the same from code. Nothing else may open it.

### `Chip` compact mode

Add `compact?: boolean` to `ChipProps`. When true:
- Render the same SVG with the body text, leads and the dot, but no `.lbl` and no `.num`
  text elements, no pin groups with handlers, no tooltip, no tilt (`onPointerMove` not
  attached), no `booting` animation class.
- `role="img"` and `aria-label="A 28-pin chip marked AD2028. Each pin is a skill; the pin
  map lists them."`.
- No `chip-legend`.
The default (non-compact) behaviour is byte-for-byte unchanged for the datasheet.

## Files

Create: `app/components/skills/SkillsMap.tsx`, `app/components/skills/SkillsDialog.tsx`,
`app/skills/page.tsx`.
Modify: `app/components/Chip.tsx` (compact prop only), `app/layout.tsx` (mount the
dialog), `app/globals.css`.

## Acceptance criteria

- [ ] `/skills/` renders with JavaScript disabled: chip as static SVG, all 28 rows with their project links, five group headings.
- [ ] With JS, on `/skills/`: hovering the C++ pin lights the "C++" row; clicking it selects and scrolls to it; hovering the "Kotlin" row lights pin 6 on the chip.
- [ ] On `/` (once issue 03 or 04 adds a trigger; until then, test with a temporary `<a href="/skills/" data-skills>` that you remove): clicking the trigger opens the panel without navigation, URL becomes `/#skills`, Escape closes it and the hash is gone, focus is back on the trigger.
- [ ] Opening `/work/rung/#skills` directly shows the panel over the page; Back closes it.
- [ ] Backdrop click closes. The page behind does not scroll while open.
- [ ] `dispatchEvent(new CustomEvent("skills:open", { detail: { pin: "AVR" } }))` opens with the "AVR microcontrollers" row selected and visible.
- [ ] Reduced motion: no slide, no smooth scroll. Keyboard: Tab stays inside the dialog (native `showModal`), first Tab lands on Close.
- [ ] `<Chip compact />` renders without labels, numbers, handlers or tooltip; `/datasheet/` chip unchanged.
- [ ] Budget: `/` grows by no more than 12 KB of page-specific JS from the dialog shell (the map chunk must not be in the initial HTML's chunk list). Check with `npm run budget`; note sizes in the PR.
- [ ] Lint and build pass. No console errors on `/`, `/skills/`, `/work/rung/`.

## Out of scope

Adding the masthead item (03). Replacing the hero chip (04). OG image for `/skills/` (11).
