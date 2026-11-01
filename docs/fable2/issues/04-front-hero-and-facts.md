# 04 · Front page: hero and the three facts

**Phase**: C · **Size**: L · **Depends on**: 01, 02, 03 · **Unblocks**: 10

## Goal

The first screen says who, what, when, and gives two buttons. The chip stays, on every
screen size, as the visual signature and the door to the skills panel: full size with hover
tooltips on desktop, small and label-free on phones. The proof strip becomes three facts a
recruiter recognises in three seconds, with no status tags and no benchmark numbers. The
intro paragraph goes; the facts strip now carries what it said.

## Source material

- `app/components/brief/Hero.tsx`, `Proof.tsx`, `ChipIndex.tsx`, `pinStore.ts` (all to
  be replaced or removed).
- `app/components/Chip.tsx` with `compact` (issue 02).
- `app/content.ts`: `BRIEF`, `FACTS`, `EMAIL`, `GITHUB`, `LINKEDIN`, `RESUME`.
- `app/globals.css` lines 446 to 499: `.brief-hero`, `.avail`, `.brief-lead`, `.proof`.

## Layout

1440 px:

```
shell (max-width 1180px)
┌──────────────────────────────────────────────┬────────────────────────┐
│ ● AVAILABLE FOR SUMMER 2027 INTERNSHIPS ·    │                        │
│   MAY TO AUGUST 2027                         │                        │
│ COMPUTER ENGINEERING · SJSU · CLASS OF 2028  │         CHIP           │
│ Aaditya Desai                      (h1 76px) │   (index mode, hover   │
│ I build from the metal up: an ARM64 JIT      │    tooltips, click     │
│ compiler, bare-metal firmware, on-device     │    opens the panel)    │
│ vision, and tools for AI agents.   (lead)    │                        │
│ [Résumé PDF ↓] [Email]   GitHub ↗ · LinkedIn ↗│ 28 skills, one per pin.│
│                                              │ Hover a pin to see     │
│                                              │ where I used it.       │
│                                              │ Open the pin map →     │
├──────────────────────────────────────────────┴────────────────────────┤
│ Infineon                 │ Hackathon winner            │ 3.8 GPA       │
│ Research intern and      │ Sponsor Track, UC Berkeley  │ Dean's Scholar│
│ software lead, 2026. ... │ AI Hackathon 2026, with ... │ B.S. ...      │
└───────────────────────────────────────────────────────────────────────┘
```

Everything above, masthead included, fits in 900 px of height at 1440 wide.

768 px: one column. Copy, then the chip at 320 px centred with its caption (still index
mode: tap a pin opens the panel at that pin), then the facts as three stacked rows.

390 px:

```
● AVAILABLE FOR SUMMER 2027 INTERNSHIPS · MAY TO AUGUST 2027
COMPUTER ENGINEERING · SJSU · CLASS OF 2028
Aaditya Desai
I build from the metal up: an ARM64 JIT compiler,
bare-metal firmware, on-device vision, and tools
for AI agents.
[Résumé PDF ↓] [Email]  GitHub ↗ · LinkedIn ↗
┌──────────┬────────────────────────────────┐
│ compact  │ 28 skills, one per pin.        │   <- one <a data-skills>, whole card
│  chip    │ Open the pin map →             │
│ 120 px   │                                │
└──────────┴────────────────────────────────┘
Infineon
Research intern and software lead, 2026. ...
Hackathon winner
...
3.8 GPA
...
```

At 390 x 844 the availability line, the name, the lead, both buttons and the chip card are
visible without scrolling.

## Spec

### `Hero` (server, `app/components/brief/Hero.tsx`)

- Order inside `.brief-copy`: `.avail` pill (unchanged markup), `.brief-eyebrow`
  (`BRIEF.eyebrow`), `<h1>`, `.brief-lead` (`BRIEF.lead`, keep the `<em>` on "from the
  metal up"), then `.actions`.
- Remove `.brief-intro` and `HERO.intro` from the page.
- `.actions`: `<a class="button primary" href={RESUME}>Résumé PDF ↓</a>`,
  `<a class="button" href="mailto:...">Email</a>`, then a `<span class="actions-links">`
  with `GitHub ↗` and `LinkedIn ↗` as plain mono links separated by " · ". Four actions
  become two buttons and two links.
- Right column `.brief-chip`: `<HeroChip />` (below) and the caption:
  `<p class="brief-cap">` with `BRIEF.chip.line`, a `<span class="brief-cap-hover">` with
  `BRIEF.chip.hover` (hidden under 768 px), and `<a href="/skills/" data-skills>` with
  `BRIEF.chip.action + " →"`.
- Under 700 px the right column is replaced by the chip card (below). Render both and
  switch with CSS (`.brief-chip` hidden under 700, `.brief-chipcard` hidden at 700 and
  up). The card's chip is `<Chip compact />` and is static SVG; this is the one place a
  duplicate element is acceptable because the hidden one is a picture, not content.

### `HeroChip` (client, `app/components/brief/HeroChip.tsx`)

Replaces `ChipIndex.tsx`. Local state for `active`; no `selected` (there is no filter
any more). Props to `Chip`: `activePin={active}`, `selectedPin={null}`,
`onHoverPin={setActive}`, `onSelectPin={(name) => name && window.dispatchEvent(new
CustomEvent("skills:open", { detail: { pin: name } }))}`. Chip's index mode handles
hover, focus, arrow keys, Enter and the tooltip; Enter or click on a pin opens the panel
at that pin. Pins with no uses (x86) stay unselectable as today.

Remove the `#skill=` hash handling entirely. Delete `ChipIndex.tsx` and `pinStore.ts`
(issue 05 deletes `ProjectIndex.tsx`, the other reader of the store; if 05 has not merged,
leave `pinStore.ts` and note it).

### Chip card (phones)

```tsx
<a className="brief-chipcard" href="/skills/" data-skills>
  <Chip compact />
  <span className="brief-chipcard-t">
    <b>{BRIEF.chip.line}</b>
    <span>{BRIEF.chip.action} →</span>
  </span>
</a>
```

Hairline border, `var(--paper)` background, chip 120 px square on the left, text right,
whole card is the link. Focus ring on the card.

### `Facts` (server, `app/components/brief/Facts.tsx`)

Replaces `Proof.tsx`.

```tsx
<ul className="facts" aria-label="Three facts">
  {FACTS.map((f) => (
    <li key={f.big}><a href={f.href}><b>{f.big}</b><span>{f.small}</span></a></li>
  ))}
</ul>
```

Three equal columns at ≥ 700 px with hairline dividers and 1 px ink rules top and bottom
(reuse the `.proof` styling, renamed to `.facts`); stacked rows under 700. `big` at
`clamp(22px, 2.2vw, 28px)` weight 800; `small` 14 px `--ink-2`. No `.tag` anywhere.

### `app/page.tsx`

`<Hero /><Facts />` replace `<Hero /><Proof />`. Metadata `description` keeps using
`HERO.lead`. Nothing else changes here (05 and 07 edit the rest).

### Cleanup

Delete `Proof.tsx`. Remove `PROOF` from `content.ts` if `grep -rn PROOF app/` shows no
other reader. Remove the `.proof` CSS and the `.pi-filter` CSS if 05 has merged (else
leave for 05).

## Files

Create: `app/components/brief/HeroChip.tsx`, `app/components/brief/Facts.tsx`.
Modify: `app/components/brief/Hero.tsx`, `app/page.tsx`, `app/globals.css`,
`app/content.ts` (remove `PROOF` only).
Delete: `app/components/brief/Proof.tsx`, `app/components/brief/ChipIndex.tsx`,
`app/components/brief/pinStore.ts` (see note).

## Acceptance criteria

- [ ] 1440 x 900: masthead, hero and facts strip all visible without scrolling. Screenshot.
- [ ] 390 x 844: availability, name, lead, both buttons and the chip card visible without scrolling. Screenshot.
- [ ] 768: one column, chip 320 px centred with caption, facts stacked. Screenshot.
- [ ] Hovering the C++ pin at 1440 shows the tooltip with "Used in: Rung"; clicking it opens the skills panel with the C++ row selected; Escape returns focus to the pin.
- [ ] Tapping the chip card at 390 (or clicking with JS off) goes to `/skills/`; with JS it opens the panel.
- [ ] `grep -c 'class="tag' out/index.html` is 0. The string "38.84" does not appear in `out/index.html`.
- [ ] `HERO.intro` is not rendered on `/` (it may stay in `content.ts` for the OG image script).
- [ ] No-JS: hero text, chip SVG, caption and facts all visible; every link navigates.
- [ ] Reduced motion: chip does not tilt; nothing animates.
- [ ] Lighthouse accessibility ≥ 95 on `/`.
- [ ] Lint, build, budget pass.

## Out of scope

Selected work (05). Experience onward (07). The panel itself (02).
