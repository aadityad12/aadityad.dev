# 18 · Ground and hero: the sheet, the quiet chip, one facts line

**Phase**: H · **Size**: M · **Depends on**: 17 · **Unblocks**: 19

## Goal

The front page floats on one beige plane, hairlines inside hairlines; the eye lands on the
chip's 28 labels and three lines of micro text before it finds the name; two lines of
capitals above the name read as a form; the facts strip is a fourth zone on the first
screen. This issue puts the page on one paper sheet over the darker background, makes the
hero the name, one sentence, three facts in one line and two buttons, and quiets the chip.
README round 3, decisions 3, 4 and 5.

## Source material

- `app/page.tsx`; `app/components/brief/Hero.tsx`; `app/components/brief/Facts.tsx`
  (deleted); `app/components/Chip.tsx` (three `className` additions, nothing else);
  `app/content.ts` (`Fact`, `FACTS`); `scripts/check-brief.mjs` (`REQUIRED`).
- `app/globals.css`: `.sheet` (lines 115 to 125; unchanged, it is what the page sits on);
  `.sh` (147 to 150, the datasheet's section rule this issue matches); the brief block from
  `/* ---- brief ---- */` through the `.pi-head` rules; `.brief-contact` and `.contact-in`.
- README: "Round 3", decisions 3 to 5; "The landmark read, round 3"; rules 16 to 18.

## Layout

1440 x 900, the first screen:

```
y 0    masthead (56)                                                         bg #e4e2da
y 80   ┌─ .sheet: paper #f7f6f1, 1 px hair border, shadow, 1280 wide ──────────────────┐
       │                                                                               │
       │  Computer Engineering · SJSU · Class of 2028          (sans 17/600, ink-2)    │
       │  Aaditya Desai                                        (h1 64)                 │
       │  I build from the metal up: an ARM64 JIT compiler,    (lead 24)               │
       │  bare-metal firmware, on-device vision, and tools                [chip, 420]  │
       │  for AI agents.                                                  no labels    │
       │  Infineon, research intern and software lead ·        (17, b 700 ink)         │
       │  Hackathon winner, UC Berkeley AI Hackathon 2026 ·                            │
       │  3.8 GPA, Dean's Scholar                                                      │
       │  [Résumé PDF ↓] [See the work ↓]                      (16 sans 600)           │
       │  ● Available for Summer 2027 internships · May to     (16 sans, ink-2)        │
       │    August 2027                                        28 skills, one per pin. │
       │                                                       Open the pin map →      │
y ~880 │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2 px ink rule            │
y 900  (fold)   Work (h2 40) appears on scroll
```

Under 900: one column; the facts line wraps with each fact intact; under 700 the chip
card; under 640 the sheet has no side borders (existing `.sheet` rule).

## Spec

### The sheet

`page.tsx`:

```tsx
<Masthead variant="brief" resume={RESUME} />
<div className="sheet brief-sheet">
  <main className="brief" id="main">
    <Hero />
    <Work />
    <Experience />
    <Credentials />
    <About />
  </main>
  <Contact />
</div>
```

(`Facts` import and element removed. `Credentials` and `About` stay until issue 20.)

```css
main.brief { max-width: none; margin: 0; padding: clamp(24px, 4vw, 52px) var(--pad) 0; }
.brief-contact { margin-top: clamp(48px, 6vw, 80px); border-top: 2px solid var(--ink); background: transparent; }
.brief-contact .contact-in { max-width: none; margin: 0; padding: clamp(32px, 5vw, 56px) var(--pad) 28px; }
```

`.sheet` itself is not touched (the datasheet uses it). The masthead stays on `--bg`; the
sheet is the only paper on the page.

### The hero

`Hero.tsx`:

```tsx
import { BRIEF, FACTS, RESUME } from "../../content";
import Chip from "../Chip";
import HeroChip from "./HeroChip";

export default function Hero() {
  return (
    <section className="brief-hero" aria-labelledby="brief-name">
      <div className="brief-copy">
        <p className="brief-eyebrow">{BRIEF.eyebrow}</p>
        <h1 id="brief-name">Aaditya Desai</h1>
        <p className="brief-lead">{BRIEF.lead}</p>
        <ul className="facts-line" aria-label="Three facts">
          {FACTS.map((f) => (
            <li key={f.big}><a href={f.href}><b>{f.big}</b>, {f.rest}</a></li>
          ))}
        </ul>
        <div className="actions">
          <a className="button primary" href={RESUME}>Résumé PDF ↓</a>
          <a className="button accent" href="#work">See the work ↓</a>
        </div>
        <p className="avail"><i aria-hidden="true" /> {BRIEF.avail}</p>
      </div>
      <div className="brief-chip">
        <HeroChip />
        <p className="brief-cap">
          {BRIEF.chip.line}
          <span className="brief-cap-hover">{BRIEF.chip.hover}</span>
          <a className="cta" href="/skills/">{BRIEF.chip.action} →</a>
        </p>
      </div>
      <a className="brief-chipcard" href="/skills/">
        <Chip compact />
        <span className="brief-chipcard-t">
          <b>{BRIEF.chip.line}</b>
          <span>{BRIEF.chip.action} →</span>
        </span>
      </a>
    </section>
  );
}
```

The Email · GitHub ↗ · LinkedIn ↗ line leaves the hero (its imports go with it): the
three are buttons in the contact footer, one masthead click away, and the hero keeps two
actions. The facts are a list, not a paragraph, so `<b>` is not inside a `<p>` (rule 11).

`content.ts`:

```ts
export type Fact = { big: string; rest: string; href: string };
// The hero's one line of facts. Each `rest` is a phrase from the round-1 `small` sentences; nothing new.
export const FACTS: Fact[] = [
  { big: "Infineon", rest: "research intern and software lead", href: "/work/visionassist/" },
  { big: "Hackathon winner", rest: "UC Berkeley AI Hackathon 2026", href: "/work/accordion/" },
  { big: "3.8 GPA", rest: "Dean's Scholar", href: "#education" },
];
```

Delete `Facts.tsx`. `#education` is `section#education` until issue 20 moves the id to the
Education label; the href does not change.

CSS: delete every `.facts` rule (the base rules, the two in `@media (max-width: 899px)`,
the two in the reduced-motion block) and the `.actions-links` rules. Replace the hero rules
with:

```css
main.brief .brief-hero { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); gap: clamp(20px, 4vw, 56px); align-items: center; padding-top: 0; }
main.brief .brief-copy { min-width: 0; }
main.brief .brief-eyebrow { margin: 0 0 14px; font-family: var(--sans); font-size: 17px; font-weight: 600; letter-spacing: 0; text-transform: none; color: var(--ink-2); }
main.brief h1 { margin: 0; font-weight: 800; font-stretch: 112%; font-size: clamp(44px, 6vw, 64px); line-height: 0.98; letter-spacing: -0.03em; }
main.brief .brief-lead { margin: 16px 0 0; font-size: clamp(20px, 2vw, 24px); line-height: 1.3; font-weight: 500; letter-spacing: -0.01em; max-width: 32ch; }
main.brief .facts-line { list-style: none; display: flex; flex-wrap: wrap; gap: 4px 0; margin: 22px 0 0; padding: 0; font-size: 17px; line-height: 1.5; color: var(--ink-2); }
main.brief .facts-line li { min-width: 0; }
main.brief .facts-line li:not(:last-child)::after { content: "·"; margin: 0 10px; color: var(--muted); }
main.brief .facts-line a { color: inherit; text-decoration: none; }
main.brief .facts-line b { color: var(--ink); font-weight: 700; }
main.brief .facts-line a:hover b, main.brief .facts-line a:focus-visible b { text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 4px; }
main.brief .actions { margin-top: 24px; gap: 12px; }
main.brief .avail { display: flex; align-items: center; gap: 9px; margin: 20px 0 0; padding: 0; border: 0; background: none; font-family: var(--sans); font-size: 16px; letter-spacing: 0; text-transform: none; line-height: 1.5; color: var(--ink-2); }
main.brief .avail i { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--ok); }
@media (min-width: 900px) {
  body:has(main.brief .brief-hero) { padding-top: calc(var(--mast-h) + 24px); }
  /* The sheet starts 24 px under the masthead and pads 52 px at this width; the hero fills the rest of the first screen so the Work rule sits at the fold. */
  main.brief .brief-hero { min-height: calc(100svh - var(--mast-h) - 24px - 52px - 100px); }
}
@media (min-width: 900px) and (max-height: 759px) {
  main.brief .brief-hero { min-height: 0; padding-top: 12px; }
}
```

The existing `@media (max-width: 899px)` rules for one column and the 320 px chip, and the
`@media (max-width: 699px)` chip-card swap, stay.

### The quiet chip

`Chip.tsx`: add `className="chip-fine"` to the three centre `<text>` lines with
`fill="#8f8f89"` and `fill="#5f5f5b"` (`SJSU · CMPE · CLASS OF 2028`, `2643 · SANTA CLARA,
CA`, `FROM THE METAL UP`). Nothing else in `Chip.tsx` changes; `/skills/` and the datasheet
show them as before.

```css
main.brief .brief-chip .chip-wrap, main.brief .brief-cap { max-width: 420px; }
/* The labels live on /skills/. On the front page the chip is the signature and shows them only to a pointer or the keyboard. */
main.brief .brief-chip .chip-svg .pin text, main.brief .brief-chip .chip-svg .chip-fine { opacity: 0; transition: opacity 0.15s; }
main.brief .brief-chip .chip-wrap:hover .chip-svg .pin text, main.brief .brief-chip .chip-wrap:focus-within .chip-svg .pin text,
main.brief .brief-chip .chip-wrap:hover .chip-svg .chip-fine, main.brief .brief-chip .chip-wrap:focus-within .chip-svg .chip-fine { opacity: 1; }
```

`.pin text` covers both the label and the pin number. The tooltip is HTML outside the SVG
and is unaffected; the `AADITYA DESAI` line, which shows the hovered pin's name, stays
visible. On touch (700 to 899 px) there is no hover, so the labels stay hidden and the
caption's "Open the pin map →" is the way to them. The global reduced-motion rule removes
the transition.

### Sections open with a rule

```css
main.brief .pi-head { padding: 12px 0; border-top: 2px solid var(--ink); border-bottom: 0; }
```

Everything else in `.pi-head` stays (flex, baseline, 40 px `h2`, 16 px sans intro).

### check-brief

`REQUIRED` begins:

```js
"Computer Engineering · SJSU · Class of 2028",
"Aaditya Desai",
"Infineon",
"Hackathon winner",
"3.8 GPA",
"Résumé PDF ↓",
"See the work ↓",
"Available for Summer 2027 internships · May to August 2027",
"Selected work",
```

and continues unchanged. `RE` does not change: `.brief-eyebrow` and `.avail` are still the
two kicker classes, and `<b>` inside the facts list is matched as before.

## Files

Delete: `app/components/brief/Facts.tsx`.
Modify: `app/page.tsx`, `app/components/brief/Hero.tsx`, `app/components/Chip.tsx`,
`app/content.ts` (`Fact` and `FACTS` only), `app/globals.css`, `scripts/check-brief.mjs`.

## Acceptance criteria

Measure on the served build; paste the numbers in the PR.

- [ ] At 1440 x 900 the page is one paper sheet (`.sheet`, `#f7f6f1`, 1280 px wide, 1 px border, shadow) on the `#e4e2da` background; the masthead is on the background. First-screen screenshot: eyebrow, name, lead, facts line, two buttons, availability line, chip caption; the chip SVG between 400 and 440 px wide with no pin labels or fine lines visible; the Work rule at or just under the fold (the Work `h2`'s top at 860 or lower).
- [ ] Hovering the chip shows the 28 labels, the numbers and the three fine lines; leaving hides them; Tab into a pin shows them; the tooltip appears on hover and on focus as before. On `/skills/` and `/datasheet/` the chip is unchanged (labels always visible).
- [ ] Computed at 1440: `.brief-eyebrow` 17 px Archivo 600, not uppercase; `.facts-line` 17 px, each `b` 700 in `--ink`; `.avail` 16 px Archivo, not uppercase, no border or background, green dot present; `h1` 64; `.brief-lead` 24; `.pi-head` has a 2 px top border and no bottom border.
- [ ] The facts line reads, on one line at 1440: "Infineon, research intern and software lead · Hackathon winner, UC Berkeley AI Hackathon 2026 · 3.8 GPA, Dean's Scholar"; the three link to `/work/visionassist/`, `/work/accordion/`, `#education`; hover underlines the bold word in accent; nothing is blue at rest (issue 16's accent audit returns `[]`).
- [ ] At 390: one column; the facts line wraps with each fact intact; the sheet has no side borders; the chip card as before; nothing scrolls sideways.
- [ ] The hero has no Email · GitHub ↗ · LinkedIn ↗ line; the three remain as buttons in the contact footer.
- [ ] `grep -rn "actions-links\|brief/Facts\|\.facts\b" app/` returns nothing.
- [ ] `npm run brief` passes with the new `REQUIRED`; the read begins `kicker Computer Engineering…`, `h1 Aaditya Desai`, `b Infineon`, `b Hackathon winner`, `b 3.8 GPA`, `button Résumé PDF ↓`, `button See the work ↓`, `kicker Available…`.
- [ ] Fine-print share (issue 16) on `/` at 1440: 15 % or less at 13 px or smaller. Height of `/`: 4,800 px or less at 1440 x 900, 5,800 or less at 390 x 844. Record all three.
- [ ] No-JS, reduced motion and keyboard passes as in 17. Lint, build, budget, brief pass.

## Out of scope

The work rows (19); Experience, Credentials, About and Contact markup (20); the lead's
wording (Aadi's call); `/skills/`, project pages and the datasheet (they stay as they are).
