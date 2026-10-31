# aadityad.dev

Aaditya Desai's personal portfolio. Next.js static export, deployed to GitHub Pages.

The plan for this version lives in `docs/plan/`.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Front page (placeholder until issue 03) |
| `/work/<slug>/` | One page per project (placeholder until issue 06) |
| `/datasheet/` | The full AD2028 datasheet |
| `/map/` | Planned |

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

## Budgets

`npm run budget` (`scripts/check-budget.mjs`) reads the built `out/` and fails if a
page loads more JavaScript than its budget. It counts every `/_next/` JS chunk a page
references, subtracts the Next runtime shared by all three budgeted pages, and compares
the rest to the page's limit. It also fails if any page except `/map/` loads three.js
or heightmap data. The budgets live in the table in `docs/plan/README.md`. CI runs
lint, build and budget on every pull request (`.github/workflows/ci.yml`).

## Design: the AD2028 datasheet

The site is written as the datasheet for a fictional part, the **AD2028**
(Aaditya Desai, class of 2028). Each section is a sheet of paper on a desk, with
a header (part number, title, revision) and a footer (page N of 15).

| Datasheet section | Portfolio content |
| --- | --- |
| 1 Overview, Fig. 0 pinout | Hero. The 28 pins of the chip are skills; hover for where each is used. |
| 4 Functional block diagram | All ten projects as blocks wired to shared buses. |
| 5 Pin descriptions, 6 Specifications | Skills table and measured numbers, each tagged Measured, Observed, Single run, or Repo. |
| 7.x Application notes | One sheet per project: overview, what I built, key specs, an interactive figure, and an errata box with honest limits. |
| 8 Revision history | Experience, education, awards, certifications, merged open-source PRs. |
| 9 About, 10 Ordering information | Bio, contact, and a part-number decoder. |

Keyboard: `J` / `K` page between sheets. The page also has a print stylesheet,
so printing it gives a real paper datasheet.

Code layout:

- `app/content.ts` holds every fact and number on the page. Edit copy there.
- `app/components/` holds the shell: masthead, chip, block diagram, sheet parts, app note layout.
- `app/figures/` holds one interactive figure per application note, registered in `app/figures/index.tsx`.
- Type: Archivo (variable width) and IBM Plex Mono. Accent `#1f45ff`.
