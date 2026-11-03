# 15 · A picture on each work card

**Phase**: G · **Size**: M · **Depends on**: 14 · **Unblocks**: 16

## Goal

The site's best material is the interactive figure on each project page, and nothing on
the landing page shows it. The four featured cards get a static frame of their figure at
the top, so the card reads as a thing with a picture, a title, one line and a venue, and
the picture is the invitation to the interactive one. The frames are rendered once from
the built site (as the Open Graph images are) and committed as PNGs. No copy changes; the
project pages do not change.

## Source material

- `app/components/brief/Work.tsx`; `app/globals.css` `.wk*` rules (as left by 13 and 14).
- `app/components/work/Reel.tsx`: `section.reel[data-active-beat]`, `.reel-figure .fig-body`.
- `scripts/og/README.md`: the render recipe this issue copies (Playwright kept outside the
  repo; Node 22; Chrome on the machine).
- `app/content.ts`: `FEATURED`, `NOTES[].figure` (not used on the card; it stays the
  figure's caption on the project page).
- README, "Round 2: pictures on the cards".

## Layout

1440, one card (two per row, about 570 px wide):

```
┌──────────────────────────────────────────────┐
│                                              │
│   [frame of the figure, 16:9, top-anchored]  │  ≈ 320 px
│                                              │
├──────────────────────────────────────────────┤
│ 01                                        →  │
│ VisionAssist                                 │  h3 26
│ Head-mounted Pi 5 that spots obstacles and   │  p 17
│ says how many steps away, fully offline.     │
│ INFINEON TECHNOLOGIES · SOFTWARE LEAD ·      │  small 13 mono
│ APR TO JUN 2026                              │
└──────────────────────────────────────────────┘
```

390: one column, the same card at full width (frame about 180 px tall). The frame shows
on every width; it is the proof the site has depth.

## Spec

### Rendering the frames

Create `scripts/cards/README.md` with the recipe below, and run it to produce
`public/cards/visionassist.png`, `accordion.png`, `rung.png`, `alta.png`. The script is not
committed (it needs Playwright, which the site does not depend on); save it as
`/tmp/cards-render.mjs` next to a `node_modules` with `playwright-core`, exactly as the OG
recipe does.

````md
# Regenerating the card frames

`public/cards/<slug>.png` is a frame of the figure on `/work/<slug>/`, for the four cards in
`FEATURED` (`app/content.ts`). Each is the figure body at 1440 px wide, device scale 2,
reduced motion on, showing the figure's last beat. Regenerate after changing a featured
figure or `FEATURED`.

1. `npm run build && npx serve out -l 4181 --no-clipboard` in one terminal.
2. In another, with Playwright available outside the repo:
   `node /tmp/cards-render.mjs http://localhost:4181 <repo-root>`

```js
// Renders a frame of each featured figure. Usage: node cards-render.mjs <base-url> <repo-root>
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright-core";

const [base, repo] = process.argv.slice(2);
const FEATURED = ["visionassist", "accordion", "rung", "alta"]; // keep equal to FEATURED in app/content.ts
await mkdir(join(repo, "public/cards"), { recursive: true });
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
for (const slug of FEATURED) {
  await page.goto(`${base}/work/${slug}/`, { waitUntil: "networkidle" });
  const beats = await page.locator(".beat").count();
  // Bring the last beat to the reading line so the figure shows its final state.
  await page.locator(".beat").nth(beats - 1).evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForFunction((n) => document.querySelector("section.reel")?.getAttribute("data-active-beat") === String(n), beats - 1);
  await page.waitForTimeout(400);
  await page.locator(".reel-figure .fig-body").screenshot({ path: join(repo, "public/cards", `${slug}.png`) });
  console.log("wrote", slug);
}
await browser.close();
```

Open every PNG before committing. Each must show the whole figure body in its final beat,
with no tooltip, no focus ring and no pointer state. Each must be under 250 KB; if one is
over, lower `deviceScaleFactor` to 1.5 for all four and rerun.
````

If the last beat of a figure is visibly emptier than an earlier beat (less drawn, not
more), render that figure at the fullest beat instead and say which in the PR; do not
change the recipe for the others.

### The card

`Work.tsx`:

```tsx
import Image from "next/image";

<a href={`/work/${id}/`} className="wk-card" aria-label={`${note.title}: ${note.oneLiner}`}>
  <div className="wk-fig" aria-hidden="true">
    <Image src={`/cards/${id}.png`} alt="" fill sizes="(max-width: 899px) 92vw, 570px" style={{ objectFit: "cover", objectPosition: "50% 0" }} />
  </div>
  <div className="wk-body">
    <span className="wk-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
    <span className="wk-a" aria-hidden="true">→</span>
    <h3>{note.title}</h3>
    <p>{note.oneLiner}</p>
    <small>{note.where}</small>
  </div>
</a>
```

The image is decorative inside a link that already carries `aria-label`, so `alt=""` and
the wrapper is `aria-hidden` (README rule 7: the alt is explicit, and the project page has
the real figure with its text equivalent). `next/image` is already used on the project
pages with `images.unoptimized`; `fill` needs the positioned wrapper below. Default lazy
loading stays: all four frames are below the fold at 1440 after issue 14, so the LCP
remains the `h1`.

Top-anchored (`50% 0`) because every featured figure carries its headline at the top: the
Rung ladder's fastest rungs, Accordion's budget bar, Alta's missing-wire callout,
VisionAssist's top view. If a frame's 16:9 top crop cuts something essential, the only
permitted change is `objectPosition: "50% 50%"` for that one slug via a small map in
`Work.tsx`; say so in the PR.

### Styles

```css
main.brief .wk-card { display: flex; flex-direction: column; padding: 0; }
main.brief .wk-fig { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: var(--paper); border-bottom: 1px solid var(--hair-strong); }
main.brief .wk-card:hover .wk-fig, main.brief .wk-card:focus-visible .wk-fig { border-bottom-color: var(--ink); }
main.brief .wk-body { position: relative; flex: 1; padding: 16px 20px 20px; }
main.brief .wk-a { top: 16px; right: 20px; }
```

The padding that 14 put on `.wk-card` moves to `.wk-body`; `.wk-n`, `h3`, `p`, `small`
keep 14's sizes. No zoom or fade on the image.

## Files

Create: `scripts/cards/README.md`, `public/cards/visionassist.png`, `public/cards/accordion.png`,
`public/cards/rung.png`, `public/cards/alta.png`.
Modify: `app/components/brief/Work.tsx`, `app/globals.css`.

## Acceptance criteria

- [ ] Four PNGs in `public/cards/`, each at least 1,000 px wide, each under 250 KB, each showing its figure's final beat with no tooltip or focus ring. Attach all four to the PR.
- [ ] At 1440 the cards show the frames at 16:9 above the text; at 390 the same, full width; nothing scrolls sideways.
- [ ] Each `<img>` has `alt=""`, `loading="lazy"`, and `src="/cards/<slug>.png"`; `grep -c 'cards/' out/index.html` is 4.
- [ ] Hovering or focusing a card changes the frame's bottom rule and the card border to ink, and underlines the title (from 13); nothing animates.
- [ ] Page height of `/` at 1440 x 900 is 3,600 px or less and at 390 x 844 6,500 px or less; record both.
- [ ] Lighthouse on `/` (mobile) still reports the `h1` or the lead as LCP; Performance 95 or more.
- [ ] `npm run brief` output is unchanged from the end of 14. `npm run budget` passes (the PNGs are not client JS and do not count).
- [ ] No-JS: the frames show (they are plain `<img>` in the HTML). Reduced motion: unchanged.
- [ ] Lint, build, budget, brief pass.

## Out of scope

Pictures for the six non-featured projects, the `/work/` index rows, and the OG images.
Any change to figures or project pages.
