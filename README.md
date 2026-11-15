# aadityad.dev

Aaditya Desai's portfolio: a front page and one page per project, built as a Next.js static export.

## Routes

- `/` is the front page.
- `/work/<id>/` is one page per project. The ids are listed in `NOTES` in `app/content.ts`.
- `/lab/` holds two development pages. They are unlinked and disallowed in `public/robots.txt`.

## Content

All copy, facts and numbers live in `app/content.ts`. Every fact on the site comes from there, so
edit the text there and nowhere else.

## Where things are

- `app/components/mascot/` is the flipbook engine for the hand-drawn robot, Pathfinder.
- `app/scenes/` holds the hand-drawn project stories.
- `app/figures/` holds the interactive technical figures used on project pages.
- `docs/fable3/DESIGN.md` is the design brief: tokens, writing rules and what the site does not do.
- `scripts/og/` renders the Open Graph images in `public/og/`. See its README.

## Local development

```bash
npm ci
npm run dev
```

## Checks

```bash
npm run check
```

This runs lint and a production build.

## Build

```bash
npm run build
```

The static site is written to `out/`.

## Deployment

Pushes to `main` are built and deployed to GitHub Pages by `.github/workflows/pages.yml`,
at https://aadityad.dev (CNAME in the repo root). Pull requests and other branches run lint and
build in `.github/workflows/ci.yml`.
