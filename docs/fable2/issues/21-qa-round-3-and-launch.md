# 21 · QA, round 3, and the pull request to main

**Phase**: H · **Size**: M · **Depends on**: 17, 18, 19, 20 · **Run by the manager, not a subagent**

## Goal

Confirm that round 3 fixed what rounds 1 and 2 could not measure: the page now has one
reason to exist (showing the work), one ground to stand on, one behaviour per link, and
at most five kinds of block. Then open the `Fable2` → `main` pull request and stop. Fixes
found here go in small follow-up PRs against `Fable2`.

## The snippets

Run in the browser console on the served build (`npx serve out`), on `/` at 1440 x 900
unless stated. Issues 17 to 20 paste their results in their PRs; this issue records the
final numbers.

**Accent audit** (issue 16, unchanged). Must return `[]` on `/`, `/skills/` and
`/work/rung/`.

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

**Fine-print share** (issue 16, unchanged). 15 % or less at 13 px or smaller.

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

**Landmarks per screen, 390 x 844.** Round 3 adds `.xp-k` (the mono column) to the marks
and reports whether each screen holds a figure frame. Every entry's count must be 1 or
more; an entry with exactly 1 must have `frame: true`. (Round 2 required 2 everywhere; a
frame at natural aspect can fill most of a phone screen, and a screen that is a picture of
the work is not an empty screen.)

```js
(() => {
  const marks = [...document.querySelectorAll("main h1, main h2, main h3, main b, main .button, main .cta, main .avail, main .brief-eyebrow, main .xp-k, footer h2, footer .button")];
  const frames = [...document.querySelectorAll("main .wr-fig")];
  const H = innerHeight, out = [];
  const inView = (el) => { const r = el.getBoundingClientRect(); const mid = r.top + r.height / 2; return (mid >= 0 && mid <= H) || (r.top < 0 && r.bottom > H); };
  for (let y = 0; y < document.documentElement.scrollHeight; y += H) {
    scrollTo({ top: y, behavior: "instant" });
    out.push({ n: marks.filter(inView).length, frame: frames.some(inView) });
  }
  scrollTo({ top: 0, behavior: "instant" });
  return JSON.stringify(out);
})()
```

**Heights.** `document.documentElement.scrollHeight` at 1440 x 900 (4,800 or less) and at
390 x 844 (5,800 or less). Round 2: 4,091 and 5,930.

**Repeat count.** How often the page says the same proper noun. Round 2 (HTML text, all
widths): Infineon 4, SJSU or San José State 4, Summer 2027 3, UC Berkeley AI Hackathon 3,
winner 3. Round 3 targets: 3, 3, 2, 2, 2 or fewer. Each remaining repeat has a reason
(Infineon: the fact, the project, the job; SJSU: the eyebrow, the TA job, the degree).

```js
(() => {
  const t = document.body.innerText;
  const c = (re) => (t.match(re) ?? []).length;
  return JSON.stringify({ infineon: c(/Infineon/g), sjsu: c(/SJSU|San José State/g), summer2027: c(/Summer 2027/g), berkeley: c(/UC Berkeley AI Hackathon/g), winner: c(/winner/gi) });
})()
```

**Shape count.** Not a script. Scroll `/` at 1440 and list every distinct kind of block
you see, where a block is a repeated visual unit. Expected, and no others: the hero; a
project row (frame, number, title, line, venue, thumbnails); a compact row (number, title,
line, arrow); an experience line (mono column, bold, grey); the contact footer. A sixth
kind is a finding against rule 18.

## The recruiter test, round 3

1. **First glance.** Fresh eyes, 1440 x 900, normal zoom. Where does the eye go first?
   The answer must be the name or the eyebrow, not the chip. If the chip still wins the
   first glance, open an issue to lighten it further (smaller, or lighter body) before the
   PR to main.
2. **Predictability.** From each of `/`, `/skills/`, `/work/rung/` and `/datasheet/`, click
   each masthead item and the résumé button. Each must do the same thing from every
   route, and nothing may open over the page. Then from `/` click a chip pin, a facts-line
   fact, a project title, a frame, a thumbnail, a compact row, the Experience cta, each
   footer button and each foot link: each goes to a place, and the back button returns.
3. **The thirty-second test.** As in issue 12: the six questions, then find the way to all
   the projects and the way to the skills, without being told. Record the first three
   things the eye went to after the name. "See the work ↓" or a project row must be among
   them.
4. **The squint test.** At 50 % zoom on `/` at 1440 and 390: the name, the section titles,
   the project titles, the bold column and the buttons are legible; the venue lines, the
   grey column and the dates are texture; the frames read as pictures; the only blue
   things are things that can be clicked. A venue line legible at 50 % is too loud.
5. **The repeat test.** Read `/` top to bottom and note every time you learn something you
   already learned higher up. Each one is either on the repeat-count list above with its
   reason, or a finding.
6. **The person test.** Write two sentences on who built this site, as a stranger would.
   Round 2's answer was "deep and careful, and has not picked one story". If the second
   half is still true, say why in the status note; it is Aadi's call what to do about it.

## Checks (attach screenshots or output for each)

### Round 3
- [ ] Accent audit `[]` on `/`, `/skills/`, `/work/rung/`.
- [ ] Fine-print share on `/` at 1440: 15 % or less; paste `smallest`. Expected entries: `.wr-n`, `.wc-n`, `.brief-cap`, `.contact-foot` (13 px by design). Anything else is a finding.
- [ ] Landmarks per screen at 390: every entry 1 or more; every 1 has `frame: true`.
- [ ] Heights at 1440 x 900 and 390 x 844 within the ceilings. Record.
- [ ] Repeat count within targets. Record.
- [ ] Shape count: five.
- [ ] First screen at 1440 x 900, 1280 x 720, 1536 x 864: the sheet, the hero, the quiet chip, the Work rule at or near the fold; nothing overlaps. Screenshots.
- [ ] The chip: no labels at rest; labels and fine lines on hover and on focus; tooltip works; a pin click lands on `/skills/#pin-N` with that row selected and in view; `/skills/#pin-17` direct also works.
- [ ] `out/work/index.html` does not exist; `/work/` on the served build shows the 404 page with a Work link to `/#work`; `out/sitemap.xml` lists `/`, `/skills/`, `/datasheet/` and the ten project pages only; `public/og/work.png` is gone and `public/og/home.png`, `skills.png`, `datasheet.png`, `work/*.png` are present.
- [ ] `grep -rn "data-skills\|skills:open\|SkillsDialog\|<dialog\|wk-\|cred-\|about-text\|mast-avail" app/ scripts/` returns nothing.
- [ ] Every frame `img` on `/` has `width` and `height` equal to its PNG (`sips -g pixelWidth -g pixelHeight public/cards/*.png`), and the rendered box has the same ratio. Thumbnails are 128 × 96 and link to `#photos`.
- [ ] Masthead `aria-current` as issue 17 specifies, on all four route types.
- [ ] Lighthouse mobile on `/`: Performance 95 or more; LCP the `h1` or lead; no CLS from the frames (they have dimensions).
- [ ] Screen reader spot check: a project row reads number-free as "VisionAssist, link", then the one-liner, venue, then "Photos of VisionAssist, list" with the photo alts as links; the frame is silent. A job line reads dates, role, employer.
- [ ] Browser console clean on `/`, `/skills/`, `/skills/#pin-3`, `/work/rung/`, `/datasheet/`, `/404`.

### Carried over from issues 12 and 16 (rerun; round 3 touched the files)
- [ ] `grep -rn "—" app/ docs/fable2/ scripts/` returns nothing.
- [ ] `npm run lint`, `npm run build`, `npm run budget`, `npm run brief` pass. Paste the landmark read; it must match README "The landmark read, round 3" (starred stops present and in order; no stop a recruiter cannot use).
- [ ] `grep -c 'class="tag' out/index.html out/skills/index.html` is 0 for both.
- [ ] Screenshots at 390, 768, 1440 of `/`, `/skills/`, `/work/rung/`, `/work/visionassist/`, `/datasheet/`.
- [ ] No horizontal scrollbar at 390 on any route.
- [ ] JavaScript disabled: `/` is fully readable, every image shows, the chip caption and the phone chip card go to `/skills/`, every link goes somewhere real.
- [ ] Reduced motion: no arrow, label or frame moves on `/`; the chip's label fade is instant.
- [ ] Keyboard only: Tab reaches the three facts, both hero buttons, the chip pins (arrows between them, Enter navigates), the chip caption's cta, every project title, every thumbnail, every compact row, the Experience cta, both "Merged upstream ↗" links, the footer buttons and foot links, all with visible focus.
- [ ] Every `TODO(aadi)` in the repo is resolved or listed in the PR for Aadi to decide.

## Launch

1. Open a PR `Fable2` → `main` titled "Fable2: a portfolio on one page". The description
   links `docs/fable2/README.md`, lists issues 01 to 21, pastes the final landmark read,
   the fine-print share, the repeat count and the heights at 1440 and 390, and attaches
   the first-screen screenshots at 1440 and 390. If a `Fable2` → `main` PR from issue 16 is
   still open, update that one instead of opening a second.
2. **Do not merge it.** Tell Aadi it is ready and where to look.
3. After Aadi merges, repeat the recruiter test and the metadata checks from issue 12
   against production, and check that `https://aadityad.dev/work/` shows the site's 404.
4. **Aadi, by hand** (as in issue 12): the résumé PDF's site link, the Accordion README
   author line, Devpost entries, GitHub profile README, LinkedIn "Website". Any link
   anywhere that pointed at `/work/` should point at `/#work`.
5. Delete nothing. `Fable1` stays as the archived version, as do `Opus-Map`,
   `Opus-Factory`, `Sol`, `Argon`, `Grok`, `Kimi2`.
