# 11 · Metadata, Open Graph, sitemap, 404 for the new routes

**Phase**: E · **Size**: S · **Depends on**: 02, 06

## Goal

`/work/` and `/skills/` get proper titles, descriptions, canonical URLs, Open Graph images
and sitemap entries. The front page's description no longer mentions anything the page
dropped. The 404 page points at the new structure.

## Source material

- `app/page.tsx`, `app/work/[slug]/page.tsx` metadata blocks; `app/sitemap.ts`;
  `app/not-found.tsx`; `scripts/og/` (`home.html`, `work.html`, `notes.mjs`, `README.md`).
- `docs/plan/issues/15-metadata-og-sitemap.md` for the conventions.

## Spec

- `app/sitemap.ts`: add `/work/` and `/skills/` after `/` and before `/datasheet/`.
- `app/work/page.tsx` metadata (from 06): confirm title "Work", the description from 06,
  canonical `/work/`, OG and Twitter images `/og/work.png` (1200 x 630, alt "Ten projects
  by Aaditya Desai, one page each").
- `app/skills/page.tsx` metadata (from 02): title "Skills", description "28 skills, one
  per pin, and the projects that used each one.", canonical `/skills/`, images
  `/og/skills.png` (alt "Aaditya Desai's skills as the 28 pins of a chip").
- `scripts/og/`: add `index.html` (for `/work/`: the ten titles in a two-column mono list
  under "Work") and `skills.html` (the chip silhouette drawn in CSS or inline SVG with the
  five group names). Both read `notes.json`. Extend `notes.mjs` to emit `PIN_GROUPS` and
  the pins' `full` names. Update `scripts/og/README.md` with the two new outputs, and add
  them to the render snippet. Render the PNGs (the README explains how; it needs
  Playwright outside the repo) and commit `public/og/work.png` and `public/og/skills.png`.
  If you cannot render locally, commit the HTML and leave `TODO(aadi): render
  public/og/work.png and public/og/skills.png` in the PR; the pages must still point at
  those paths.
- `app/page.tsx` and `app/layout.tsx`: `description` stays `${HERO.lead} Available for
  Summer 2027 internships.`; confirm it contains nothing that left the page. The home OG
  image (`scripts/og/home.html`) reads `HERO.intro` for its small text; change it to read
  `FACTS` (the three `big` values joined by " · ") and re-render `public/og/home.png`.
- `app/not-found.tsx`: links read "Front page · All work · Skills · Full datasheet". The
  masthead (`variant="plain"`) was added in 03; confirm it is there.
- JSON-LD in `app/layout.tsx`: unchanged.

## Files

Modify: `app/sitemap.ts`, `app/work/page.tsx`, `app/skills/page.tsx`, `app/not-found.tsx`,
`scripts/og/home.html`, `scripts/og/notes.mjs`, `scripts/og/README.md`.
Create: `scripts/og/index.html`, `scripts/og/skills.html`, `public/og/work.png`,
`public/og/skills.png`; re-render `public/og/home.png`.

## Acceptance criteria

- [ ] `out/sitemap.xml` lists `/`, `/work/`, `/skills/`, `/datasheet/` and the ten project pages.
- [ ] `out/work/index.html` and `out/skills/index.html` have `<title>`, `<meta name="description">`, `<link rel="canonical">`, `og:image` and `twitter:image` pointing at the paths above.
- [ ] The three OG PNGs exist, are 1200 x 630, and look right when opened (attach them to the PR).
- [ ] `/nope/` shows the masthead and four links.
- [ ] Lint and build pass.

## Out of scope

Anything on the datasheet. Per-project OG images (unchanged).
