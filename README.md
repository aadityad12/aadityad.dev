# aadityad.dev

Aaditya Desai's personal portfolio. Next.js static export, deployed to GitHub Pages.

## Local development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

The static site is written to `out/`.

## Deploy

Pushes to `main` are built and deployed automatically by
`.github/workflows/pages.yml` to https://aadityad.dev (CNAME in repo root).

## How it's put together

- `app/content.ts` holds every word on the page; `app/page.tsx` renders it as static HTML.
- `app/components/site-interactions.js` layers on the 3D Bay map, the map explorer, the project
  reels, the stamps and the footer Pathfinder after the page has loaded. The page is complete
  without it.
- The map engine and the project artifacts live in `lab/` (see `lab/README.md`), where they are
  prototyped before they appear on the site. three.js comes from npm.
