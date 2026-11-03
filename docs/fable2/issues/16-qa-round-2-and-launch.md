# 16 · QA, round 2, and the pull request to main

**Phase**: G · **Size**: M · **Depends on**: 13, 14, 15 · **Run by the manager, not a subagent**

## Goal

Confirm that round 2 fixed what round 1 measured well but got wrong: the page read small
and the actions were invisible. Then do issue 12's launch step, which was held back for
round 2: open the `Fable2` → `main` pull request and stop. Fixes found here go in small
follow-up PRs against `Fable2`.

## The two snippets

Run both in the browser console on the served build (`npx serve out`), on `/` at
1440 x 900 unless stated. Issues 13 to 15 paste their results in their PRs; this issue
records the final numbers.

**Accent audit.** Returns every element in `main` or `footer` painted in the accent colour
that is not inside something clickable, a figure body or an SVG. Must return `[]` on `/`,
`/work/`, `/skills/` and `/work/rung/`. On the round-1 build it returns `["em.",
"p.contact-kicker"]` on `/` and `["span."]` on `/work/rung/`.

```js
(() => {
  const BLUE = new Set(["rgb(31, 69, 255)", "rgb(18, 51, 217)"]);
  const bad = [];
  for (const el of document.querySelectorAll("main *, footer *")) {
    if (el.closest("svg, .fig-body")) continue;
    const cs = getComputedStyle(el);
    if (![cs.color, cs.backgroundColor, cs.borderTopColor, cs.textDecorationColor].some((c) => BLUE.has(c))) continue;
    if (el.closest("a, button, summary, .fig-bar .live")) continue;
    bad.push(`${el.tagName.toLowerCase()}.${el.className}`);
  }
  return JSON.stringify(bad);
})()
```

(`text-decoration-color` is accent on every link by the global rule; links are excluded
above, so a hit there is a non-link with a blue underline.)

**Fine-print share.** Characters of rendered text by size, SVG excluded. Round 1 measured
32 % at 13 px or smaller (61 % at 14 to 19, 7 % at 20 or more); round 2 requires 15 % or
less at 13 px or smaller. The other two shares are recorded, not targeted.

```js
(() => {
  const roots = [document.querySelector("main"), document.querySelector("footer")].filter(Boolean);
  let small = 0, mid = 0, big = 0, total = 0; const smallEls = new Map();
  for (const root of roots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode, text = node.textContent.replace(/\s+/g, " ").trim();
      if (!text) continue;
      const el = node.parentElement;
      if (el.closest("svg") || el.getBoundingClientRect().width === 0) continue;
      const size = parseFloat(getComputedStyle(el).fontSize);
      total += text.length;
      if (size <= 13) { small += text.length; const k = `${el.tagName.toLowerCase()}.${el.className}`; smallEls.set(k, (smallEls.get(k) ?? 0) + text.length); }
      else if (size < 20) mid += text.length; else big += text.length;
    }
  }
  const pct = (n) => `${Math.round((100 * n) / total)}%`;
  return JSON.stringify({ total, le13: pct(small), from14to19: pct(mid), ge20: pct(big), smallest: [...smallEls].sort((a, b) => b[1] - a[1]).slice(0, 12) });
})()
```

**Landmarks per screen, 390 x 844.** At each scroll position `0, 844, 1688, …` to the end,
count landmarks whose midpoint is inside the viewport. (`behavior: "instant"` matters: the
page has `scroll-behavior: smooth`, and a plain `scrollTo` would measure before the scroll
lands.) Round 1: `[9, 4, 4, 10, 7, 6]`.

```js
(() => {
  const marks = [...document.querySelectorAll("main h1, main h2, main h3, main b, main .button, main .cta, main .avail, main .brief-eyebrow, footer h2, footer .button")];
  const H = innerHeight, out = [];
  for (let y = 0; y < document.documentElement.scrollHeight; y += H) {
    scrollTo({ top: y, behavior: "instant" });
    const n = marks.filter((m) => { const r = m.getBoundingClientRect(); return r.top + r.height / 2 >= 0 && r.top + r.height / 2 <= H; }).length;
    out.push(n);
  }
  scrollTo({ top: 0, behavior: "instant" });
  return JSON.stringify(out);
})()
```

Every entry must be 2 or more.

## The recruiter test, again

Issue 12's three passes, with round 2's questions added:

1. **The landmark read.** `npm run brief`. The read has the three `cta` stops where README
   "The landmark read, round 2" puts them and is otherwise identical to round 1.
2. **The squint test.** At 50 % zoom on `/` at 1440 and 390: the buttons and the three
   `.cta` links are legible and read as actions; the dates and venues are grey texture;
   the only blue things are things that can be clicked; the four cards read as pictures
   with titles. If a venue line is still legible at 50 %, it is too large; if a button is
   not, it is too small.
3. **The thirty-second test.** Fresh eyes, normal zoom, 1440 x 900 and then a phone. In
   30 seconds: the six questions; then, without being told, find the way to all the
   projects and the way to the skills. Record what the eyes went to first after the name.
   If "See the work ↓" or a card was not among the first three things, open an issue.
4. **The size test.** Ask: does any line on `/` look like fine print you would skip?
   List each. Anything other than the venue lines, the dates, the kickers, the card
   indices and the footer line is a finding.

## Checks (attach screenshots or output for each)

### Round 2
- [ ] Accent audit returns `[]` on `/`, `/work/`, `/skills/`, `/work/rung/`.
- [ ] Fine-print share on `/` at 1440 x 900: 15 % or less at 13 px or smaller. Paste the `smallest` list; every entry is a 13 px label class from issue 14's "Two mono sizes".
- [ ] Landmarks per screen at 390 x 844: every entry 2 or more.
- [ ] First screen at 1440 x 900: masthead, hero, facts strip fully visible, at most the Selected work heading below it. Screenshot. The same at 1280 x 720 and 1536 x 864 (common laptops): the facts strip is visible or starts within the first screen, nothing overlaps.
- [ ] Chip SVG at 1440 is at least 440 px wide and the hover tooltips still work; a pin click opens the panel on that pin.
- [ ] Every `.button` on `/`, `/work/rung/`, `/datasheet/`: 16 px Archivo 600, no capitals. Masthead items 15 px; the résumé button 15 px sans.
- [ ] No 12 px text on `/`; fact-bearing mono (availability, eyebrow, card venues, employers, dates, `.edu-meta`) is 14 px.
- [ ] The four card frames load (Network tab: four 200s under `/cards/`), each under 250 KB, lazy.
- [ ] `/` height at 1440 x 900 is 3,600 px or less; at 390 x 844, 6,500 px or less. Record both.
- [ ] Lighthouse on `/` (mobile): Performance 95 or more; LCP is the `h1` or the lead, not a card frame.

### Carried over from issue 12 (rerun; round 2 touched the files)
- [ ] `grep -rn "—" app/ docs/fable2/` returns nothing.
- [ ] `npm run lint`, `npm run build`, `npm run budget`, `npm run brief` pass.
- [ ] `grep -c 'class="tag' out/index.html out/work/index.html out/skills/index.html` is 0 for all three.
- [ ] Screenshots at 390, 768, 1440 of `/`, `/work/`, `/skills/`, `/work/rung/`, `/work/visionassist/`, `/datasheet/`.
- [ ] No horizontal scrollbar at 390 on any route.
- [ ] JavaScript disabled: `/` is fully readable, the four frames show, the Skills link and the chip card go to `/skills/`.
- [ ] Reduced motion: no arrow or frame moves on `/`.
- [ ] Keyboard only: Tab reaches both hero buttons, the three `.cta` links, every fact cell and every card, with visible focus; a focused card shows the hover state.
- [ ] Screen reader spot check: a card reads "title: one-liner" once (the frame is silent).
- [ ] Every `TODO(aadi)` in the repo is resolved or listed in the PR for Aadi to decide.

## Launch

1. Open a PR `Fable2` → `main` titled "Fable2: a shorter front page and one navigation".
   The description links `docs/fable2/README.md`, lists issues 01 to 16, pastes the final
   landmark read, the fine-print share, and the heights at 1440 and 390, and attaches the
   first-screen screenshots at 1440 and 390.
2. **Do not merge it.** Tell Aadi it is ready and where to look.
3. After Aadi merges, repeat the recruiter test and the metadata checks from issue 12
   against production.
4. **Aadi, by hand** (as in issue 12): the résumé PDF's site link, the Accordion README
   author line, Devpost entries, GitHub profile README, LinkedIn "Website".
5. Delete nothing. `Fable1` stays as the archived version, as do `Opus-Map`,
   `Opus-Factory`, `Sol`, `Argon`, `Grok`, `Kimi2`.
