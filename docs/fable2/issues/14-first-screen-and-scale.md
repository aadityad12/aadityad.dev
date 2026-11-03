# 14 · First screen and scale: the hero owns the fold

**Phase**: G · **Size**: M · **Depends on**: 13 · **Unblocks**: 15

## Goal

The front page reads small because a third of it is 12 and 13 px fine print, because the
scale jumps from a 76 px name to 13 px actions with nothing in between, and because the
compression added to meet the old 2,400 px ceiling squeezed five zones onto the first
screen and shrank the chip to 360 px. This issue sets the type scale from README, "Round 2:
the type scale", gives the first screen back to the hero with the facts strip at the fold,
restores the chip to 460 px, and puts air between sections. CSS only; no markup or copy
changes.

## Source material

- `app/globals.css`: the brief block (lines 442 to 615), in particular the "desktop brief
  spacing" block at 578 to 615, which this issue deletes whole.
- README, "Round 2: why the brief read small": "The type scale", "The first screen belongs
  to the hero".
- Measurements of the round-1 build at 1440 x 900, for before/after: masthead 56 px; hero
  box 1060 x 438 at y 74; chip SVG 360 px; buttons at y 429; facts strip at y 536, 111 px
  tall; Selected work heading at y 667; page height 2,397 px; fine print 35 % of characters.

## Layout

1440 x 900, the first screen:

```
y 0     masthead (56)
y 80    ┌──────────────────────────────────────────┬──────────────────────────┐
        │ ● AVAILABLE FOR SUMMER 2027 … (14 mono)  │                          │
        │ COMPUTER ENGINEERING · SJSU · … (14 mono)│                          │
        │ Aaditya Desai                   (h1 64)  │        CHIP 460          │
        │ I build from the metal up: …   (lead 24) │                          │
        │ [Résumé PDF ↓] [See the work ↓] (16 sans)│                          │
        │ Email · GitHub ↗ · LinkedIn ↗   (16 sans)│ 28 skills, one per pin.  │
        │                                          │ Hover a pin to see …     │
        │                                          │ Open the pin map →  (cta)│
y ~720  └──────────────────────────────────────────┴──────────────────────────┘
y ~752  ┌─────────────────┬───────────────────────────┬─────────────────────┐
        │ Infineon  (32)→ │ Hackathon winner       →  │ 3.8 GPA           → │
        │ Research intern │ Sponsor Track, UC Berkeley│ Dean's Scholar. …   │
        │ and software …  │ AI Hackathon 2026, with … │ (17)                │
y ~880  └─────────────────┴───────────────────────────┴─────────────────────┘
y 900   (fold) ─────────────────────────────────────────────────────────────
        Selected work (h2 40) appears on scroll
```

The hero is vertically centred in the space above the facts strip; the facts strip is
fully visible above the fold with its bottom rule, and nothing of Selected work shows
except, on short screens, its heading. On viewports under 760 px tall (laptops at
1280 x 720), the hero takes its natural height and the facts strip follows; nothing is
forced.

Under 900 px wide: one column, chip card on phones as today, facts stacked, all sizes from
the phone end of the `clamp()`s below.

## Spec

All rules below live in the brief block of `app/globals.css`. Delete the whole
`/* ---- desktop brief spacing ---- */` block (`@media (min-width: 900px) { body:has(main.brief
.brief-hero) … }`, lines 578 to 615) and replace the values it was overriding with the ones
here, so there is one set of rules per element rather than a base and a compressed
override. Where an element is not named here, leave it.

### Hero

```css
main.brief .brief-hero { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); gap: clamp(20px, 4vw, 56px); align-items: center; padding-top: clamp(8px, 2vw, 24px); }
main.brief .avail { font-size: 14px; margin-bottom: 18px; }
main.brief .brief-eyebrow { font-size: 14px; margin-bottom: 12px; }
main.brief h1 { font-size: clamp(44px, 6vw, 64px); line-height: 0.98; letter-spacing: -0.03em; }
main.brief .brief-lead { margin-top: 16px; font-size: clamp(20px, 2vw, 24px); line-height: 1.3; max-width: 32ch; }
main.brief .actions { margin-top: 24px; gap: 12px; }
main.brief .actions-links { margin-top: 4px; }
main.brief .brief-chip .chip-wrap, main.brief .brief-cap { max-width: 460px; }
main.brief .brief-cap { margin-top: 10px; gap: 6px; font-size: 13px; }
@media (min-width: 900px) {
  body:has(main.brief .brief-hero) { padding-top: calc(var(--mast-h) + 24px); }
  /* The strip below is about 128 px tall plus a 32 px margin; the hero fills what is left so the strip lands at the fold. */
  main.brief .brief-hero { min-height: calc(100svh - var(--mast-h) - 24px - 176px); padding-top: 0; }
}
@media (min-width: 900px) and (max-height: 759px) {
  main.brief .brief-hero { min-height: 0; padding-top: 12px; }
}
```

The `max-width: 320px` for the chip under 900 px and the chip card under 700 px stay.

### Facts

```css
main.brief .facts { margin-top: 32px; }
main.brief .facts a { padding: 18px 44px 18px 20px; }
main.brief .facts b { font-size: clamp(26px, 2.4vw, 32px); }
main.brief .facts span { margin-top: 6px; font-size: 17px; }
```

(`padding-right: 44px` and the arrow are from issue 13; keep them.)

### Sections

```css
main.brief .brief-work, main.brief .brief-xp, main.brief .brief-cred, main.brief .brief-about { margin-top: clamp(48px, 6vw, 80px); }
main.brief .pi-head { padding-bottom: 12px; gap: 8px 24px; }
main.brief .pi-head h2 { font-size: clamp(30px, 3.2vw, 40px); }
```

### Selected work

```css
main.brief .wk { gap: 20px; margin-top: 20px; }
main.brief .wk-card { padding: 18px 20px 20px; }
main.brief .wk-n { font-size: 13px; margin-bottom: 10px; }
main.brief .wk-a { top: 18px; right: 20px; }
main.brief .wk-card h3 { font-size: clamp(22px, 2vw, 26px); }
main.brief .wk-card p { margin-top: 10px; font-size: 17px; max-width: 46ch; }
main.brief .wk-card small { margin-top: 12px; font-size: 14px; }
main.brief .wk-more { margin-top: 18px; }
```

### Experience

```css
main.brief .xp > li { grid-template-columns: 190px minmax(0, 1fr); padding: 16px 0; }
main.brief .xp-when { font-size: 14px; }
main.brief .xp h3 { font-size: 18px; font-weight: 700; }
main.brief .xp .org { font-size: 14px; margin-top: 3px; }
main.brief .xp-sum { margin-top: 6px; font-size: 17px; max-width: 64ch; }
```

### Education, awards, open source, certifications

```css
main.brief .cred-cols { padding-top: 16px; }
main.brief .cred-h { font-size: 13px; margin: 22px 0 8px; }
main.brief .edu li { gap: 4px; padding-bottom: 18px; }
main.brief .edu h3 { font-size: 20px; }
main.brief .edu-deg { font-size: 17px; }
main.brief .edu-meta { font-size: 14px; }
main.brief .awards-list, main.brief .oss-line, main.brief .certs-line { font-size: 17px; }
main.brief .awards-list li + li { margin-top: 6px; }
```

### About and contact

```css
main.brief .about-text { margin-top: 14px; font-size: 17px; max-width: 64ch; }
.brief-contact { margin-top: clamp(48px, 6vw, 80px); }
.brief-contact .contact-in { padding: clamp(32px, 5vw, 56px) var(--pad) 28px; }
.brief-contact .contact-kicker { font-size: 13px; margin-bottom: 12px; }
.brief-contact .contact-line { margin-top: 16px; font-size: 18px; }
.brief-contact .contact-actions { margin-top: 24px; }
.brief-contact .contact-foot { margin-top: 36px; padding-top: 14px; }
```

### Two mono sizes

Mono metadata that carries a fact is 14 px: `.avail`, `.brief-eyebrow`, `.wk-card small`,
`.xp-when`, `.xp .org`, `.edu-meta`. Mono labels that carry none stay 13 px: `.brief-cap`,
`.cred-h`, `.contact-kicker`, `.wk-n`, `.contact-foot`. Nothing on `/` is 12 px after
this issue.

### Not in this issue

Masthead sizes (13 did them). Card pictures (15). `/work/` and `/skills/`: their shared
elements (`.button`, `.cta`, `.pi-head h2`) pick the new sizes up through the shared rules;
touch nothing else there.

## Files

Modify: `app/globals.css` only.

## Acceptance criteria

Measure at 1440 x 900 and 390 x 844 on the served build; paste the numbers in the PR.

- [ ] At 1440 x 900: the chip SVG is at least 440 px wide; the facts strip's top edge is between 700 and 800 px from the top of the page and its bottom rule is above 900; the Selected work `h2`'s top is at or below 880. Screenshot of the first screen attached.
- [ ] At 1280 x 720: no forced hero height (the facts strip starts where the hero ends); nothing overlaps.
- [ ] Computed sizes at 1440: `h1` 64; `.brief-lead` 24; `.facts b` 32; `.facts span` 17; `.pi-head h2` 40; `.wk-card h3` 26; `.wk-card p` 17; `.xp h3` 18/700; `.xp-sum` 17; `.edu h3` 20; `.about-text` 17; `.contact-line` 18; `.avail`, `.brief-eyebrow`, `.wk-card small`, `.xp-when`, `.xp .org`, `.edu-meta` 14; `.brief-cap`, `.cred-h`, `.contact-kicker`, `.wk-n` 13. No 12 px text remains on `/`.
- [ ] The fine-print share snippet from issue 16 reports 15 % or less at 13 px or smaller on `/` at 1440 x 900 (round 1: 32 %). Paste its `smallest` list; every entry is one of the 13 px classes above.
- [ ] Page height at 1440 x 900 is 3,000 px or less before issue 15 (3,600 or less after it); at 390 x 844, 5,600 px or less before 15 (6,500 after).
- [ ] At 390 x 844: scroll one screen at a time; every screen has at least two landmarks (a heading, a bold line, a button or a `.cta`) on it; nothing scrolls sideways; both hero buttons fit on one row.
- [ ] `npm run brief` output is unchanged from the end of issue 13 (this issue adds no landmark).
- [ ] Lint, build, budget, brief pass. No-JS and reduced-motion passes unchanged.

## Out of scope

Markup, copy, the check script, pictures (15).
