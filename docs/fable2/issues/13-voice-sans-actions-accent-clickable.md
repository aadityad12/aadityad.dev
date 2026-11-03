# 13 · Voice: actions in sans, accent for clickable things, cards that look clickable

**Phase**: G · **Size**: M · **Depends on**: 12 (round 1 merged) · **Unblocks**: 14

## Goal

A reader cannot tell what to click. Every action on the page (both hero buttons, Email ·
GitHub · LinkedIn, the chip's "Open the pin map", "All ten projects", the datasheet link
under Experience, the masthead's résumé button) is set in 13 px IBM Plex Mono capitals,
which is the voice the site uses for dates and venues, so the eye skips it. The one blue
thing on the first screen is a phrase in the lead that does nothing when clicked. This
issue gives the page two voices (README, "Round 2: two voices") and one meaning for the
accent colour (README, "Accent means clickable"): sans for content and actions, mono
capitals for metadata, blue only on things that respond to a click.

No copy changes. No layout changes beyond what the new type sizes cause; sizes other than
the ones named here are issue 14's.

## Source material

- `app/globals.css`: `.button` (lines 171 to 178), `.mast-nav a` and `.mast .pdf` (83 to
  87), `.mast-menu summary` (89), `main.brief .brief-lead em` (452), `main.brief .actions
  .button` and `.actions-links` (454 to 455), `.brief-cap a` (460), `.facts a` (479 to 481),
  `.wk-card`, `.wk-n`, `.wk-a`, `.wk-more`, `.wk-all` (506 to 516), `.pi-head p` (504),
  `.xp-sum a` (533), `.contact-kicker` (558), `.contact-actions .button` and `.button.primary`
  (562 to 563), `.work-links .button` (628), `.work-meta span:first-child` (623), `.work-card`
  (658 to 663).
- `app/components/brief/Hero.tsx`, `Work.tsx`, `Experience.tsx`.
- `scripts/check-brief.mjs` line 27 (`RE`) and 46 to 48 (kinds).
- README, "Round 2: why the brief read small", the three subsections "The type scale",
  "Two voices", "Accent means clickable".

## Spec

### Tokens

Add one token to `:root`, after `--hair-2`:

```css
--hair-strong: rgba(18, 18, 17, 0.34); /* resting border of a clickable card */
```

### Buttons, every route

Replace the `.button` block:

```css
.button {
  display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
  font-family: var(--sans); font-size: 16px; font-weight: 600; line-height: 1.2; letter-spacing: -0.005em;
  padding: 12px 18px; border: 1px solid var(--ink); background: var(--paper); color: var(--ink);
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.button:hover { background: var(--ink); color: var(--paper); }
.button.primary { background: var(--ink); color: var(--paper); }
.button.primary:hover { background: var(--accent); border-color: var(--accent); color: #fff; }
.button.accent { background: var(--accent); border-color: var(--accent); color: #fff; }
.button.accent:hover { background: var(--accent-ink); border-color: var(--accent-ink); }
```

Delete the per-route overrides that shrank buttons back to 13 px: `main.brief .actions
.button { font-size: 13px; }`, `.brief-contact .contact-actions .button { font-size: 13px; }`,
`.work-links .button { font-size: 13px; }`. Reduce `.brief-contact .button.primary` to
`overflow-wrap: anywhere;` (the other two declarations are now the default). The datasheet
hero and `AppNote` use `.button` too and get the new style; that is intended (rule 14).

In `Hero.tsx`, the second button becomes the section's accent action:

```tsx
<a className="button primary" href={RESUME}>Résumé PDF ↓</a>
<a className="button accent" href="#work">See the work ↓</a>
```

The class attribute must begin with `button` (the brief check matches `class="button`).

### `.cta`: one accent call to action per section

```css
.cta { font-family: var(--sans); font-size: 16px; font-weight: 600; letter-spacing: -0.005em; color: var(--accent); text-decoration: none; white-space: nowrap; }
.cta:hover, .cta:focus-visible { color: var(--accent-ink); text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }
```

Apply it to exactly three links, with the class attribute beginning `cta`:

- `Hero.tsx`: `<a className="cta" href="/skills/" data-skills>{BRIEF.chip.action} →</a>`
  (replaces the plain `<a>` in `.brief-cap`). Delete `main.brief .brief-cap a` from the CSS.
- `Work.tsx`: `<Link className="cta" href="/work/" prefetch={false}>All ten projects →</Link>`
  (replaces `className="wk-all"`). Delete `.wk-all`.
- `Experience.tsx`: `<Link className="cta" href="/datasheet/#revisions">Full record in the datasheet ↗</Link>`.

The contact footer's accent action is its email button, which stays `button primary`
(ink). Do not add a `.cta` anywhere else.

### Inline links in sans

- `.actions-links`: `font-family: var(--sans); font-size: 16px; font-weight: 600;
  line-height: 1.5;` (drop the mono). The links keep the global `a` style: ink text, accent
  underline on hover only; add `main.brief .actions-links a { text-decoration: none; }
  main.brief .actions-links a:hover { text-decoration: underline; }`.
- `.pi-head p`: `font-family: var(--sans); font-size: 16px; line-height: 1.45; color:
  var(--ink-2);` (the line "Four of ten. Each has its own page." is a sentence, not a label).
- `.wk-more`: `font-family: var(--sans); font-size: 16px; color: var(--ink-2);`. Its
  project links inherit (ink, accent underline).
- `.xp-sum a` ("VisionAssist →"): delete the rule; the link inherits 17 px sans from the
  summary (16 until issue 14).
- Masthead: `.mast-nav a { font-size: 15px; }`, `.mast-menu summary { font-size: 15px; }`,
  and `.mast .pdf { font-family: var(--sans); font-size: 15px; font-weight: 600;
  text-transform: none; letter-spacing: 0; padding: 7px 12px; }`. `.mast-end` keeps its mono
  declaration for nothing else now; leave it.

### Accent removed from static things

- Delete `main.brief .brief-lead em { ... }`. In `Hero.tsx` delete the `EM` constant and the
  `Lead` helper; render `<p className="brief-lead">{BRIEF.lead}</p>`. The sentence is
  unchanged.
- `.brief-contact .contact-kicker`: `color: var(--ink-2);`.
- `.work-meta span:first-child`: `color: var(--ink);` (keep `font-weight: 600`).

Leave as they are: `.fig-bar .live` (the allowed exception), `.wk-a`, `.wi-a`,
`.work-card.next .work-card-k` (inside a link), the chip's hover and focus states, the
masthead's `aria-current` underline, and everything under `.sheet` (the datasheet's
`.sh-num`, `.ssh span`, `.an-kicker b`, `.rev-tbl td:first-child`, `.bd-blk .bk b`,
`.front h2 span`, `.tagline em`).

### Cards and rows that look clickable at rest

```css
main.brief .wk-card { border: 1px solid var(--hair-strong); }
main.brief .wk-card:hover, main.brief .wk-card:focus-visible { border-color: var(--ink); }
main.brief .wk-card:hover h3, main.brief .wk-card:focus-visible h3 { text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 4px; }
main.brief .wk-a { font-size: 18px; line-height: 1; }
main.brief .facts a { position: relative; padding-right: 44px; }
main.brief .facts a::after { content: "→"; position: absolute; right: 16px; top: 14px; font-family: var(--mono); font-size: 18px; line-height: 1; color: var(--accent); transition: transform 0.15s; }
main.brief .facts a:hover::after, main.brief .facts a:focus-visible::after { transform: translateX(4px); }
.work-card { border: 1px solid var(--hair-strong); }
```

Add the two `::after` transforms to the existing `prefers-reduced-motion` block for
`.wk-a` so they do not move under reduced motion. `.wk-n` stays 13 px mono.

### The brief check prints the new stops

In `scripts/check-brief.mjs`, `.cta` links are landmarks. Change `RE` so the anchor
alternative accepts both classes and remembers which:

```js
const RE = /<(h1|h2|h3|b|strong|small)\b[^>]*>([\s\S]*?)<\/\1>|<a\b[^>]*class="(button|cta)[^"]*"[^>]*>([\s\S]*?)<\/a>|<(?:p|span|div)\b[^>]*class="(?:avail|brief-eyebrow)[^"]*"[^>]*>([\s\S]*?)<\/(?:p|span|div)>|<span class="tag[^"]*"[^>]*>([\s\S]*?)<\/span>/g;
```

and the two lines that build each stop:

```js
kind: m[1] ?? (m[3] !== undefined ? m[3] : m[5] !== undefined ? "kicker" : "tag"),
text: strip(m[2] ?? m[4] ?? m[5] ?? m[6]),
```

`REQUIRED` does not change. The printed read gains `cta Open the pin map →` after the
two buttons, `cta All ten projects →` after Alta's venue line, and `cta Full record in
the datasheet ↗` right after `h2 Experience` (README, "The landmark read, round 2").

## Files

Modify: `app/globals.css`, `app/components/brief/Hero.tsx`, `app/components/brief/Work.tsx`,
`app/components/brief/Experience.tsx`, `scripts/check-brief.mjs`.

## Acceptance criteria

Measure with the browser at 1440 x 900 on the served build (`npx serve out`); paste the
numbers in the PR.

- [ ] Every `.button` on `/`, `/work/rung/`, `/datasheet/` computes to 16 px Archivo weight 600 with `text-transform: none`. "See the work ↓" has an accent background and white text; "Résumé PDF ↓" is ink on the left of it.
- [ ] The three `.cta` links compute to 16 px Archivo 600 in `rgb(31, 69, 255)`; no fourth element has the class.
- [ ] `.actions-links`, `.pi-head p`, `.wk-more` compute to Archivo (not IBM Plex Mono). The masthead résumé button computes to 15 px Archivo 600, no capitals; the nav items to 15 px.
- [ ] The lead has no `<em>` and no blue; `grep -n "Lead\|EM =" app/components/brief/Hero.tsx` is empty.
- [ ] The accent audit from issue 16 (static elements in `rgb(31, 69, 255)` or `rgb(18, 51, 217)` outside a link, button, `.fig-bar .live` or a figure body) returns `[]` on `/`, `/work/`, `/skills/` and `/work/rung/`. On the round-1 build it returns `["em.", "p.contact-kicker"]` on `/` and `["span."]` (the application-note number) on `/work/rung/`.
- [ ] Cards: resting border is `--hair-strong`, arrow is 18 px accent; hovering a card underlines its title in accent. Each fact cell shows an 18 px accent arrow at rest.
- [ ] `npm run brief` passes and its printed read contains the three `cta` lines at the positions above; the stop count is 45 (42 plus the three).
- [ ] Reduced motion: no arrow moves. No-JS: identical. Keyboard: focus on a card or fact shows the same state as hover.
- [ ] The text of every button and link is unchanged (`git diff` shows no string literal changes other than class names).
- [ ] Lint, build, budget, brief pass.

## Out of scope

Sizes of headings, body and labels, chip width, spacing, the first screen (14). Pictures on
the cards (15).
