# 15 · Metadata, Open Graph images, sitemap, robots, JSON-LD

**Phase**: D · **Size**: M · **Depends on**: 03, 06

## Goal

Every route previews well when pasted into Slack, LinkedIn or a recruiter's email, and
search engines see one canonical page per project.

## Source material

- `app/layout.tsx` (this branch): current metadata, fonts.
- `git show Opus-Map:app/layout.tsx`: the JSON-LD `Person` block to port.
- `public/og.png`: the current OG image (datasheet-era). Replace.

## Spec

1. **Root metadata** (`app/layout.tsx`): `title.default` "Aaditya Desai · Computer
   Engineering @ SJSU", `title.template` "%s · Aaditya Desai", description =
   `HERO.lead` + " Available for Summer 2027 internships." Port the JSON-LD `Person`
   block (name, alternateName "Aadi Desai", url, email, jobTitle "Computer Engineering
   Student", affiliation SJSU, address Santa Clara CA, sameAs GitHub and LinkedIn) into a
   `<script type="application/ld+json">`.
2. **Route metadata**: `/` canonical `/`; `/work/<slug>/` canonical and OG url
   `/work/<slug>/`, title `note.title`, description `note.hook`; `/datasheet/` title
   "AD2028 Datasheet", description "The long version: every project, number and
   limitation on one printable page."
3. **OG images**, static PNGs at 1200×630 in `public/og/`:
   - `home.png`: paper background, "Aaditya Desai" large, the lead sentence, the four
     proof items as a row, the chip silhouette on the right. Build it as an HTML file at
     `scripts/og/home.html` using the site's tokens and fonts, then render it with
     `agent-browser` or Playwright (`npx playwright screenshot --viewport-size=1200,630`)
     and commit the PNG. Commit the HTML too so it can be regenerated.
   - `work/<slug>.png` for each of the ten: title, hook, `headline.value + unit` with its
     status word, the AN number. Same method, one template `scripts/og/work.html` that
     takes the slug via a query string and reads a generated JSON of notes
     (`scripts/og/notes.json`, written by a tiny Node script that imports `content.ts`
     via `tsx` if available or a hand-maintained copy if not; say which in the PR).
   - `datasheet.png`: the existing `public/og.png` moved.
   Reference the right image in each route's `openGraph.images` and `twitter.images`.
4. **`public/robots.txt`**: `User-agent: *` / `Allow: /` / `Sitemap: https://aadityad.dev/sitemap.xml`.
5. **`app/sitemap.ts`**: Next's metadata route returning `/`, `/datasheet/`, and the ten
   work pages with `lastModified` = build time. Confirm it is emitted in `out/sitemap.xml`
   with `output: "export"` (it is, as a static route). If `/map/` exists (issue 16), include it.
6. **Favicon**: unchanged.

## Files

Create: `public/og/*.png`, `scripts/og/home.html`, `scripts/og/work.html`,
`scripts/og/README.md` (how to regenerate), `public/robots.txt`, `app/sitemap.ts`.
Modify: `app/layout.tsx`, `app/page.tsx`, `app/work/[slug]/page.tsx`, `app/datasheet/page.tsx`.

## Acceptance criteria

- [ ] `out/sitemap.xml` lists 12 URLs (13 with `/map/`).
- [ ] Each route's HTML has exactly one `<link rel="canonical">` and one `og:image` pointing at an existing file.
- [ ] OG images render the right text for `/`, `/work/rung/`, `/datasheet/` (open them).
- [ ] JSON-LD validates at `https://validator.schema.org/` (paste the block).
- [ ] No em dashes in any generated text.
- [ ] Build, lint and budget pass (OG images are not JS; they don't count).
