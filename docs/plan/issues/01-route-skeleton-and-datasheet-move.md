# 01 · Route skeleton and datasheet move

**Phase**: A (foundation) · **Size**: S · **Depends on**: nothing · **Unblocks**: 02, 14

## Goal

Turn the single-page Opus-Factory site into a multi-route site without changing what it
looks like yet. After this issue: `/datasheet/` shows exactly what `/` shows today;
`/` and `/work/<slug>/` exist as placeholders; the build produces all routes.

## Source material

- `app/page.tsx` (this branch): the current datasheet page. It moves.
- `app/components/Masthead.tsx`: links to `#block-diagram`, `#specs`, `#revisions`,
  `#ordering`. These anchors must keep working on `/datasheet/`.
- `app/components/parts.tsx`: `Sheet`, `TOTAL_PAGES = 15`.
- `next.config.ts`: already `output: "export"`, `trailingSlash: true`.

## Spec

1. Move `app/page.tsx` to `app/datasheet/page.tsx`. Fix relative imports
   (`./components/...` becomes `../components/...`, `./content` becomes `../content`,
   `./figures` becomes `../figures`).
2. In `app/datasheet/page.tsx`, export `metadata` with
   `title: "AD2028 Datasheet · Aaditya Desai"` and the existing description from
   `app/layout.tsx`. Keep everything else identical.
3. Create `app/page.tsx` as a server component rendering a placeholder:
   `<main className="brief"><h1>Aaditya Desai</h1><p>Front page: issue 03.</p>
   <p><a href="/datasheet/">Full datasheet</a></p></main>`.
4. Create `app/work/[slug]/page.tsx`:
   - `export const dynamicParams = false;`
   - `export function generateStaticParams()` returning `NOTES.map((n) => ({ slug: n.id }))`.
   - `generateMetadata` returning `{ title: \`${note.title} · Aaditya Desai\`, description: note.hook }`.
   - Default export renders a placeholder `<main className="work"><h1>{note.title}</h1>
     <p>{note.hook}</p><p>Project page: issue 06.</p><a href="/datasheet/#{note.id}">
     Datasheet entry</a></main>`. Call `notFound()` for an unknown slug.
   - `params` is a `Promise<{ slug: string }>` in Next 16; `await` it.
5. Create `app/not-found.tsx`: name, "Not found.", links to `/`, `/datasheet/`.
6. In `app/components/Masthead.tsx`, change the four anchor hrefs to absolute:
   `/datasheet/#block-diagram`, `/datasheet/#specs`, `/datasheet/#revisions`,
   `/datasheet/#ordering`. The mast-mark goes to `/`. (Issue 13 redesigns this; here we
   only keep the links from breaking.)
7. In `app/components/Masthead.tsx`, the section-label observer and J/K paging must not
   throw on pages that have no `[data-section]` elements. Guard: if `sheets.length === 0`
   return early from the effect without registering listeners.
8. Add to `package.json` scripts: `"check": "npm run lint && npm run build"`.
9. Update `README.md`: a "Routes" table (`/`, `/work/<slug>/`, `/datasheet/`, `/map/`
   planned) and a line "The plan for this version lives in `docs/plan/`."

## Files

Create: `app/datasheet/page.tsx`, `app/work/[slug]/page.tsx`, `app/not-found.tsx`.
Modify: `app/page.tsx` (replace), `app/components/Masthead.tsx`, `package.json`, `README.md`.

## Acceptance criteria

- [ ] `npm run build` emits `out/index.html`, `out/datasheet/index.html`, ten
      `out/work/<slug>/index.html` files (accordion, rung, visionassist, gazeboard, alta,
      apextracker, echo, oss-scout, temper, clear-dispatch), and `out/404.html`.
- [ ] `/datasheet/` is pixel-identical to the previous `/` at 1440 px (compare screenshots).
- [ ] Masthead links on `/datasheet/` still scroll to the right sheets; J and K still page.
- [ ] Visiting `/` or `/work/rung/` logs no console errors.
- [ ] `npm run lint` clean.

## Out of scope

Any visual change. Any content change. Deleting the `Sheet` page numbering.
