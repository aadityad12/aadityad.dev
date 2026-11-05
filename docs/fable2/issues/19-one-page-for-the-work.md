# 19 · One page for the work: rows, galleries, compact rows

**Phase**: H · **Size**: L · **Depends on**: 18 · **Unblocks**: 20

## Goal

The front page shows four cards whose cropped 16:9 frames leak 8 px benchmark labels back
onto the page, and sent the reader to `/work/` for the other six. After this issue the
front page is the index of the work: the four featured projects as rows, each with its
figure frame at natural aspect, the title, the one-liner, the venue in plain sans and a
small gallery of real photos where the project has them; then the six others as compact
one-line rows. README round 3, decisions 1 and 6; rules 17 to 19.

## Source material

- `app/components/brief/Work.tsx`; `app/globals.css`: `/* ---- selected work ---- */`
  (`.wk*`, `.wk-more`, and the `.wk-a` rules in the reduced-motion block).
- `app/content.ts`: `FEATURED`, `NOTES[].{order, title, oneLiner, where}`, `PHOTOS`
  (keys `accordion`, `visionassist`, `alta`, `echo`), `BRIEF.workIntro`, `BRIEF.moreWork`.
- `public/cards/*.png`, natural sizes: `visionassist` 1000 × 1064, `accordion` 1000 × 774,
  `rung` 1000 × 828, `alta` 1000 × 818 (check with `sips -g pixelWidth -g pixelHeight`).
  `scripts/cards/README.md`.
- `app/work/[slug]/page.tsx`: `section#photos` ("From the build"), the gallery's target.
- `scripts/check-brief.mjs` (`REQUIRED`).
- README: round 3, decision 6; rules 18 and 19; "The landmark read, round 3".

## Layout

1440, one featured row (two equal columns; the frame column is about 560 px):

```
┌────────────────────────────┐   01                                                 →
│                            │   VisionAssist                              (h3 30)
│  [figure frame, natural    │   Head-mounted Pi 5 that spots obstacles and says
│   aspect, 1 px border,     │   how many steps away, fully offline.       (18)
│   never cropped]           │   Infineon Technologies · software lead · Apr to Jun 2026   (16 sans, ink-2)
│                            │   ┌──────┐ ┌──────┐
│                            │   │photo │ │photo │   128 × 96 thumbnails → /work/visionassist/#photos
└────────────────────────────┘   └──────┘ └──────┘
──────────────────────────────────────────────────────────────────────────── hair
```

Four rows (VisionAssist, Accordion, Rung, Alta), then six compact rows:

```
05   GazeBoard        Talk by looking at tiles on a phone. Gaze model on the NPU, no network permission.   →
06   OSS Scout        Nightly agent that finds open-source work and can't post anything without my tap.    →
07   ApexTracker      …                                                                                      →
08   Echo             …                                                                                      →
09   Temper           …                                                                                      →
10   Clear Dispatch   911 surge simulation: automation handles volume, a human keeps authority.            →
──────────────────────────────────────────────────────────────────────────── ink
```

390: the frame at full width above the text; number, title, one-liner, venue, thumbnails
(two per line, the third wraps); compact rows stack number and title, then the one-liner.

## Spec

### Work.tsx

```tsx
import Image from "next/image";
import { BRIEF, FEATURED, NOTES, PHOTOS } from "../../content";

// Natural size of each frame in public/cards/, so a row shows the whole figure. Update alongside the PNGs (scripts/cards/README.md).
const FRAMES: Record<(typeof FEATURED)[number], { w: number; h: number }> = {
  visionassist: { w: 1000, h: 1064 },
  accordion: { w: 1000, h: 774 },
  rung: { w: 1000, h: 828 },
  alta: { w: 1000, h: 818 },
};

const byId = (id: (typeof FEATURED)[number]) => NOTES.find((note) => note.id === id)!;
const REST = [...NOTES].sort((a, b) => a.order - b.order).filter((note) => !FEATURED.some((id) => id === note.id));
const num = (n: number) => String(n).padStart(2, "0");

export default function Work() {
  return (
    <section id="work" className="brief-work" aria-labelledby="work-h">
      <header className="pi-head">
        <h2 id="work-h">Work</h2>
        <p>{BRIEF.workIntro}</p>
      </header>
      <ol className="wr">
        {FEATURED.map((id) => {
          const note = byId(id);
          const frame = FRAMES[id];
          const photos = (PHOTOS[id] ?? []).slice(0, 3);
          return (
            <li key={id} className="wr-row">
              {/* The frame repeats the title's link; it leaves the accessibility tree and the tab order so the row reads once. */}
              <a className="wr-fig" href={`/work/${id}/`} tabIndex={-1} aria-hidden="true">
                <Image src={`/cards/${id}.png`} alt="" width={frame.w} height={frame.h} />
              </a>
              <div className="wr-body">
                <span className="wr-n" aria-hidden="true">{num(note.order)}</span>
                <span className="wr-a" aria-hidden="true">→</span>
                <h3><a href={`/work/${id}/`}>{note.title}</a></h3>
                <p className="wr-line">{note.oneLiner}</p>
                <p className="wr-where">{note.where}</p>
                {photos.length > 0 && (
                  <ul className="wr-gallery" aria-label={`Photos of ${note.title}`}>
                    {photos.map((p) => (
                      <li key={p.src}>
                        <a href={`/work/${id}/#photos`}>
                          <Image src={p.src} alt={p.alt} width={p.w} height={p.h} />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <ol className="wc">
        {REST.map((note) => (
          <li key={note.id}>
            <a href={`/work/${note.id}/`} className="wc-row">
              <span className="wc-n" aria-hidden="true">{num(note.order)}</span>
              <b className="wc-t">{note.title}</b>
              <span className="wc-d">{note.oneLiner}</span>
              <span className="wc-a" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

Numbers come from `NOTES[].order`, the project's index across the site (its page says
"Project 03 of 10"), not from position in `FEATURED`. Today the two agree: 01 to 04
featured, 05 to 10 compact.

`next/image` with `width` and `height` and `images.unoptimized` renders a plain lazy
`<img>` with intrinsic dimensions; the CSS below makes it fill its column at natural
aspect. No `sizes` (there is no `srcset` to pick from). The frame's `alt` is empty inside
an `aria-hidden` link; the thumbnails carry the photo's own `alt`, which is their link text.

`content.ts`: `BRIEF.workIntro` becomes `"Ten things I built, one page each."` (the sentence
from the deleted `/work/` page). Delete `BRIEF.moreWork`.

### CSS

Delete every `.wk*` rule and `.wk-more`, including the two `.wk-a` rules in the
reduced-motion block. Add, in place of the selected-work block:

```css
/* ---- work ---- */
main.brief .brief-work { margin-top: clamp(48px, 6vw, 80px); }
main.brief .wr { list-style: none; margin: 0; padding: 0; }
main.brief .wr-row { display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px clamp(24px, 3vw, 44px); padding: clamp(24px, 3vw, 36px) 0; border-bottom: 1px solid var(--hair); }
main.brief .wr-fig { display: block; border: 1px solid var(--hair-strong); background: var(--paper); line-height: 0; }
main.brief .wr-fig:hover { border-color: var(--ink); }
main.brief .wr-fig img { display: block; width: 100%; height: auto; }
main.brief .wr-body { position: relative; min-width: 0; padding-right: 36px; }
main.brief .wr-n { display: block; margin-bottom: 8px; font-family: var(--mono); font-size: 13px; line-height: 1.4; color: var(--ink-2); }
main.brief .wr-a { position: absolute; top: 0; right: 0; font-family: var(--mono); font-size: 18px; line-height: 1; color: var(--accent); transition: transform 0.15s; }
main.brief .wr-body:has(h3 a:hover) .wr-a, main.brief .wr-body:has(h3 a:focus-visible) .wr-a { transform: translateX(4px); }
main.brief .wr-body h3 { margin: 0; font-size: clamp(24px, 2.2vw, 30px); font-weight: 800; font-stretch: 112%; letter-spacing: -0.015em; line-height: 1.15; }
main.brief .wr-body h3 a { color: inherit; text-decoration: none; }
main.brief .wr-body h3 a:hover, main.brief .wr-body h3 a:focus-visible { text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 4px; }
main.brief .wr-line { margin: 10px 0 0; max-width: 44ch; font-size: 18px; line-height: 1.45; color: var(--ink); }
main.brief .wr-where { margin: 8px 0 0; font-size: 16px; line-height: 1.45; color: var(--ink-2); }
main.brief .wr-gallery { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0 0; padding: 0; }
main.brief .wr-gallery a { display: block; width: 128px; height: 96px; overflow: hidden; border: 1px solid var(--hair-strong); background: var(--paper-2); }
main.brief .wr-gallery a:hover, main.brief .wr-gallery a:focus-visible { border-color: var(--ink); }
main.brief .wr-gallery img { display: block; width: 100%; height: 100%; object-fit: cover; }
main.brief .wc { list-style: none; margin: 0; padding: 0; }
main.brief .wc li + li { border-top: 1px solid var(--hair); }
main.brief .wc li:last-child { border-bottom: 1px solid var(--ink); }
main.brief .wc-row { display: grid; grid-template-columns: 32px minmax(0, 1fr) 24px; grid-template-areas: "n t a" "n d a"; column-gap: 12px; padding: 14px 0; color: var(--ink); text-decoration: none; }
main.brief .wc-row:hover, main.brief .wc-row:focus-visible { background: var(--paper-2); }
main.brief .wc-row:hover .wc-t, main.brief .wc-row:focus-visible .wc-t { text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 4px; }
main.brief .wc-n { grid-area: n; font-family: var(--mono); font-size: 13px; line-height: 1.6; color: var(--ink-2); }
main.brief .wc-t { grid-area: t; font-size: 18px; font-weight: 700; line-height: 1.3; }
main.brief .wc-d { grid-area: d; margin-top: 2px; font-size: 16px; line-height: 1.45; color: var(--ink-2); }
main.brief .wc-a { grid-area: a; justify-self: end; font-family: var(--mono); font-size: 18px; line-height: 1.3; color: var(--accent); transition: transform 0.15s; }
main.brief .wc-row:hover .wc-a, main.brief .wc-row:focus-visible .wc-a { transform: translateX(4px); }
@media (min-width: 900px) {
  main.brief .wr-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: start; }
  main.brief .wc-row { grid-template-columns: 40px 180px minmax(0, 1fr) 28px; grid-template-areas: "n t d a"; column-gap: 16px; }
  main.brief .wc-d { margin-top: 0; }
}
@media (prefers-reduced-motion: reduce) {
  main.brief .wr-a, main.brief .wc-a { transition: none; }
  main.brief .wr-body:has(h3 a:hover) .wr-a, main.brief .wc-row:hover .wc-a { transform: none; }
}
```

The thumbnails are the one place a picture is cropped: a 128 × 96 window onto the photo,
with the whole photo one click away. The frames are never cropped (rule 19).

### check-brief

`REQUIRED`: `"Selected work"` becomes `"Work"`. The six compact titles are `<b>` and appear
in the read as six stops; they are not required.

## Files

Modify: `app/components/brief/Work.tsx`, `app/content.ts` (`BRIEF.workIntro`, delete
`BRIEF.moreWork`), `app/globals.css`, `scripts/check-brief.mjs`.

## Acceptance criteria

- [ ] At 1440: four rows; each frame shows the whole PNG at its own aspect (VisionAssist taller than it is wide; the rendered width/height ratio equals the PNG's), with a 1 px border and no `object-fit`; the `img` has `width` and `height` attributes matching `FRAMES`. The text column has the number, the title with the accent arrow at the right, the 18 px one-liner, the 16 px sans venue (not uppercase, not mono), then thumbnails: VisionAssist 2, Accordion 1, Alta 3, Rung none. Screenshot of the VisionAssist row.
- [ ] Each thumbnail is 128 × 96, links to `/work/<id>/#photos`, carries the photo's `alt`, is lazy; clicking lands on "From the build" under the masthead.
- [ ] Six compact rows 05 to 10 in `order`: number, bold title, one-liner, accent arrow; each links to its page; hover underlines the title in accent and nudges the arrow; the list closes with an ink rule.
- [ ] A row reads once to a screen reader: the frame link is `aria-hidden="true"` with `tabindex="-1"`; Tab order within a row is title, then thumbnails. `npm run lint` passes. (If `jsx-a11y/no-aria-hidden-on-focusable` objects to the frame link, keep `tabIndex={-1}`, drop `aria-hidden`, give the link `aria-label={`${note.title}, figure`}`, and say so in the PR.)
- [ ] `grep -c 'src="/cards/' out/index.html` is 4; `grep -c 'src="/projects/' out/index.html` is 6. `npm run brief` banned patterns PASS: no benchmark number or status tag in the page text (the frames are images; README decision 6 accepts what they show).
- [ ] Height of `/`: 4,800 px or less at 1440 x 900, 5,800 or less at 390 x 844. Record both. Landmarks per screen at 390 (issue 21's snippet): every entry 1 or more, and every screen with exactly 1 contains a frame.
- [ ] Lighthouse mobile on `/`: Performance 95 or more; LCP is the `h1` or the lead, not a frame.
- [ ] `npm run brief` read: `h2 Work`, `h3 VisionAssist`, `h3 Accordion`, `h3 Rung`, `h3 Alta`, then `b GazeBoard`, `b OSS Scout`, `b ApexTracker`, `b Echo`, `b Temper`, `b Clear Dispatch`, then `h2 Experience`. All rows PASS.
- [ ] `grep -rn "wk-\|moreWork\|All ten projects\|Selected work" app/ scripts/` returns nothing.
- [ ] No-JS: every image shows and every link works. Reduced motion: arrows do not move. At 390 nothing scrolls sideways and the thumbnails wrap. Lint, build, budget, brief pass.

## Out of scope

Experience, credentials, about and contact (20). Re-rendering the frames. Pictures for the
six compact rows. Project pages.
