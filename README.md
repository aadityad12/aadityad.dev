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

## Design

The redesign direction lives in [`docs/design-brief.md`](docs/design-brief.md);
implementation is tracked in the repo issues.
