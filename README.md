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

This branch implements **Sol: the constraint lab**, with five interactive engineering
exhibits and five statically exported case studies. The direction, content provenance,
and research references live in [`docs/sol-design.md`](docs/sol-design.md).
The earlier direction is preserved in [`docs/design-brief.md`](docs/design-brief.md).
