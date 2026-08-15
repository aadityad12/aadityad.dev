# aadityad.dev — Design Brief

_Agreed with Aaditya on 2026-08-14. This is the source of truth for the redesign; every
implementation issue references it. If an issue and this brief conflict, the issue wins
(it's newer and more specific)._

## Who this site is for

One visitor: a **Summer 2027 internship recruiter or hiring engineer** who will give the
page 30 seconds. Secondary: engineers arriving from Accordion's GitHub. Everything on the
page either builds credibility with that person or gets cut.

## The takeaway

After closing the tab they should remember: **"the student who builds strange, useful
machines — and ships them."** Personality first, proof immediately behind it. Not a slogan
site, not a resume site: a person with taste, backed by verifiable numbers.

## Identity: playful crafted

- **Canvas:** warm light. Cream/paper background, ink text. A sketchbook, not a terminal.
  This is a deliberate full break from the current dark phosphor-green look.
- **Signature element:** a small hand-drawn **mascot — a machine critter** (robot-ish,
  friendly, slightly odd) that draws itself in on load (SVG stroke-dash), reacts to
  scroll/hover, and appears in a different pose beside each project. It is the thread
  that ties "strange, useful machines" together.
- **Voice:** first person, honest, specific. The reference register is the ApexTracker
  README ("I started this to build a habit — the habit of building"). Numbers over
  adjectives. Never "passionate", never "innovative".

## Type

- **Display / headlines:** Fraunces (Google Fonts) — soft, characterful serif, used big
  and light.
- **Body:** Instrument Sans (Google Fonts).
- **Labels / proof chips / tech lines:** Martian Mono (already in the repo) — kept as a
  small continuity thread and the "engineer voice".
- **Hand annotations (sparingly):** Caveat — only for mascot speech and margin notes,
  never for real content.

## Color tokens (starting values, tune in review)

- `--paper: #FAF5EC` (background)
- `--ink: #221F1A` (text)
- `--accent: #E4572E` (one warm red-orange; links, proof highlights, mascot details)
- `--muted: #8A8377` (secondary text)
- `--good: #3E7C4F` (used only when a number means "win/pass")
- Rule: accent means "look here", never decoration. Two colors on screen at once, max.

## Page structure (single page, in order)

1. **Hero** — name as the biggest thing on the page, headline "I build strange, useful
   machines.", school/location/"seeking Summer 2027 internships" line, proof strip
   (hackathon win · ★225 OSS · 8 ms on-NPU ML), mascot drawing itself in.
2. **Machines** — five project cards: Accordion (flagship, biggest), ApexTracker,
   GazeBoard, Echo, Temper.
3. **Also built** — a single compact line for ClearDispatch (no card).
4. **About** — 3–4 sentences, ApexTracker-README voice.
5. **Contact** — email, GitHub, LinkedIn, resume PDF. Recruiter plumbing, zero friction.

Explicitly excluded: SimplyApply (not Aaditya's project — clone of a fork), desktop-mascot
(ownership unclear), TuyaOpen (vendor SDK fork), cura, World Cup Lab (both cut by Aaditya,
2026-08-14), the old "SYSTEMS inventory" section (folded into About), the old system-map
hero panel.

## Motion rules (hard requirements — the old site died by breaking these)

1. **Content is visible by default.** No element may ship hidden waiting for JS to reveal
   it. Motion is added on top of visible content (`.js-ready` class pattern), never the
   other way around.
2. Never hide content with `clip-path`/`opacity:0` and then rely on an
   IntersectionObserver with a ratio threshold to un-hide it — a fully clipped element
   reports zero intersection area and the observer never fires. (This is the exact root
   cause of the current blank-site bug.)
3. `prefers-reduced-motion: reduce` disables all of it and the site is still complete.
4. Go big within those rules: mascot self-draw, scramble-decode on mono labels,
   staggered entrances, hover toys. Memorable is the goal; fragile is the enemy.

## Hosting

GitHub Pages, unchanged (static export via `next build`, existing `pages.yml` workflow,
CNAME `aadityad.dev`). The render bug was never a hosting problem.
