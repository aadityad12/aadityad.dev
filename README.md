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

This branch (`Kimi2`) renders the portfolio as a **preliminary engineering
datasheet** — document AD-2027, Rev A. The direction, content provenance, and
claim-status notes live in [`docs/kimi2-design.md`](docs/kimi2-design.md).
