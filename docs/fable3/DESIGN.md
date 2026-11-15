# aadityad.dev, third design: the working brief

Read this before touching anything. It is short on purpose.

## Who it is for

A recruiter or hiring engineer who followed a link from a résumé, often on a phone, and will give the
page well under a minute. The page has to say who Aadi is, what he is looking for and what he has
built, and it has to look like a person made it with care.

## The idea

A clean, quiet page with one living thing on it: **Pathfinder**, a small hand-drawn robot (Aadi got
into engineering through VEX robotics). Pathfinder stands at a signpost in the hero. A visitor picks
the kind of role they hire for (Software, Embedded, AI and ML) and the work below is sorted for them.
The work itself plays on a stage: each flagship project shows its real, working figure.

Everything else stays out of the way. Boldness is spent in two places only: Pathfinder, and the
project figures.

## Tokens (all defined in `app/globals.css`; never hard-code a colour or a font)

- Ground `--paper`, cards `--card`, text `--ink`, secondary text `--ink-2`, quiet text `--muted`
  (never lighter than `--muted` for text), rules `--hair` and `--hair-strong`.
- One accent, `--red`. It is Pathfinder's eye. Use it for Pathfinder, the dotted trail, the progress
  rule on the stage, link underlines on hover, and the single bar or number a figure wants looked at.
  Never as a background wash for a whole section, never on body text (`--red-ink` exists for the rare
  small red word and passes contrast).
- Figures may also use `--accent` (blue), `--ok` (green) and `--amber` for data only.
- Dark surfaces: `--night`, `--night-ink`, `--night-muted`.
- Radius: `--r` (10px) for small things, `--r-lg` (18px) for cards and the stage. Buttons are pills.
- Pathfinder's world is hand-drawn: 3.4px round ink strokes that shimmer (see `boil()` in
  `app/components/home/HeroScene.tsx` and the `.boil-g` classes) and lettered in his handwriting
  (`--hand`, class `.hand`). The handwriting font is used only inside his drawings, never for page text.
- Type: Schibsted Grotesk (`--sans`) for everything. IBM Plex Mono (`--mono`) only for code and for
  numbers and labels inside figures. Never for section labels, dates, tags or decoration.
- Sizes: body 17px/1.55 weight 450. Small text 15px. Section titles use `.section-head h2`.
  Headings are weight 800 with tight tracking (already set on h1 to h3). Numbers that line up use
  `font-variant-numeric: tabular-nums` (class `.num`).
- Layout: wrap content in `.wrap`. Sections use `.section` (it sets the space above). Measure for
  running text is 30 to 38em.
- Shared classes: `.btn`, `.btn.quiet`, `.btn.small`, `.arrow-link` (wrap its arrow in a span),
  `.section`, `.section-head`, `.visually-hidden`, `.num`, `.mono`.

## Things this site does not do (each one is a known "made by a template" tell)

- No uppercase letter-spaced label above headings. No "01 / 02 / 03". No "Figure 1" bars.
- No grid of identical cards. No icon in a tinted rounded square. No pill above a headline.
- No gradients, glows, blurs, glass, dot grids, drop shadows deeper than `0 1px 2px rgba(0,0,0,.06)`.
- No fade-up-on-scroll. Content is visible by default, with or without scripts. Motion is added on
  top (the `<html>` element gets class `js` when scripts run) and all of it stops under
  `prefers-reduced-motion: reduce`.
- Nothing a first-time, non-technical visitor cannot follow on the front page. Jargon, tables and
  dense diagrams belong on the project pages.
- No emoji, no icon library. If a mark is needed, draw it as inline SVG in the hand-drawn ink style
  (3px round strokes in `--ink`) or use a plain arrow character.
- No skill bars, tech-logo walls or tag clouds. Tools are written as plain text lists.
- No monospace for decoration. No serif.
- No new colours and no second accent.

## Words

First person, plain, specific. Name the thing built, the tool and the result. Sentence case
everywhere. No em dashes. No buzzwords (passionate, seamless, cutting-edge, leverage, robust,
innovative, crafting, unlock). No limitations, caveats or hedges. All facts come from
`app/content.ts`; never write a fact, number or date into a component by hand, and never invent one.
Nothing anywhere says or implies the site was made with AI.

## Quality floor

- Works from 360px to 1600px wide with no horizontal scroll. Tap targets at least 44px.
- Everything reachable and usable by keyboard, with the visible focus ring from `globals.css`.
- Real elements: buttons are `<button>`, navigation is `<a>`, lists are lists, one `<h1>` per page.
- Images have real alt text and explicit width and height.
- Server components by default; `"use client"` only where there is state or an effect.
  Client components must not import `app/content.ts` wholesale into the bundle: pass what they need
  as props from a server component.

## How to check your work

A dev server is already running at http://localhost:3131 (hot reload). Do not start another one and
do not run `npm run build` or `next build` (it would fight the dev server for `.next`).

Screenshot tool (drives the installed Chrome):
`node "$TOOLS/shoot.mjs" <url> <out.png> [width=1440] [height=900] [full=1|0] [waitMs=1500]`
where `TOOLS=/private/tmp/claude-501/-Users-aadityad-Desktop-ExtraCuricular-portfolio-fable2/50ed5d16-247a-47cf-8667-0f480965be4f/scratchpad/tools`.
Take shots at 1440 and at 390 wide, look at them, and fix what looks wrong before you report.
Then run `npx tsc --noEmit` and `npm run lint`; both must be clean for the files you own.

Do not run git commands that change anything (no commit, checkout, stash, reset). Edit only the files
your task names. Other people are editing other files in this checkout at the same time.
