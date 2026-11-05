# 05 · Front page: experience, credentials, about, contact

**Phase**: B · **Size**: M · **Depends on**: 02, 03, 04 · **Unblocks**: 13, 15, 17

## Goal

Finish `/` so a recruiter can verify every line of the résumé without leaving the page:
Experience, Education, Awards and certifications, Open source, About, Contact. Compact,
tabular, in the datasheet voice but with plain-English headings.

## Source material

- `app/content.ts`: `EXPERIENCE`, `EDUCATION`, `AWARDS`, `CERTS`, `OPEN_SOURCE`, `SKILLS`,
  `ABOUT`, `EMAIL`, `RESUME`, `GITHUB`, `LINKEDIN`, `DEVPOST`, `OSS`.
- `git show Opus-Map:app/page.tsx` sections `#experience`, `#recognition`, `#education`,
  `#about`, footer: the structure to follow. Restyle in Factory tokens.
- `app/datasheet/page.tsx` "Revision history" table: the compact row style to echo.

## Spec

Order on the page after the project index:

### Experience (`#experience`)

`<ol className="xp">`, one `<li>` per `EXPERIENCE` entry, grid `180px 1fr`:
- Left: `when` and `where` in mono 12px, `--muted`.
- Right: `<h3>{role}</h3>` 17px weight 600; `<p className="org">{org}</p>`; `<ul>` of
  `points` 15px. If `link`, append "More on VisionAssist →" linking to `/work/visionassist/`
  (not the `#visionassist` anchor from Opus-Map).
At 390 px the grid collapses to one column.

### Credentials grid (`#education`, two columns at ≥ 900 px)

Left column:
- **Education**: two entries. `school` bold, `degree`, `when` and `note` mono, then
  "Coursework: …" 13px `--muted`.
- **Awards**: `AWARDS` as a two-column mini table (title, detail). Then **Certifications**:
  `CERTS` as a plain list, 13px.

Right column:
- **Open source**: for each `OPEN_SOURCE` entry a link block: mono line "Merged ·
  {repo} · {stars}", `<b>{name}</b>`, `what`. Then "Every contribution, tracked live ↗" to `OSS`.
- **Toolbox**: `SKILLS` as `<dl>`; `dt` mono (area), `dd` the items joined with " · ".

Headings for these four blocks: mono 12px uppercase with a hairline, like the datasheet's
`.ssh` style but without the section numbers.

### About (`#about`)

`ABOUT` paragraphs (three) in one column, max-width 62ch, 16px. Right of it at ≥ 900 px a
small definition list: Based / Santa Clara, CA; Studying / B.S. Computer Engineering,
minor in AI, SJSU; Graduating / May 2028; Available / Summer 2027 · Winter 2027 co-op.

### Contact (`<footer id="contact">`)

- Mono kicker "Summer 2027 internships · Winter 2027 co-ops".
- `<h2>Get in touch.</h2>` large (48px).
- One sentence: "I'm looking for roles in software, embedded systems, and AI/ML. Email is
  the fastest way to reach me."
- Buttons: `mailto:` (primary, shows the address), Résumé ↗, GitHub ↗, LinkedIn ↗, Devpost ↗.
- Footer line (mono 12px, three columns): "Aaditya Desai · Santa Clara, CA" · "Full
  datasheet ↗ · The map ↗ (coming)" · "Source ↗" (github.com/aadityad12/aadityad.dev).
  The map link renders only when `/map/` exists; until issue 16, omit it.

### Page scaffolding

`app/page.tsx` now composes: `<Hero />`, `<Proof />`, `<ProjectIndex />`, `<Experience />`,
`<Credentials />`, `<About />`, `<Contact />`. All server components except the two
already marked client. Add `id`s so the masthead (issue 13) can link to `#projects`,
`#experience`, `#education`, `#contact`.

## Files

Create: `app/components/brief/Experience.tsx`, `Credentials.tsx`, `About.tsx`, `Contact.tsx`.
Modify: `app/page.tsx`, `app/globals.css`.

## Acceptance criteria

- [ ] Total page height at 1440 px is under 5,500 px (measure `document.documentElement.scrollHeight`).
- [ ] Every résumé line (each Experience role, each degree, each award, each cert) appears once.
- [ ] No phone number anywhere; location reads "Santa Clara, CA".
- [ ] `grep -c "—" app/components/brief/*.tsx` is 0.
- [ ] At 390 px: no horizontal scroll; Contact buttons wrap cleanly.
- [ ] Lighthouse accessibility ≥ 95 on `/`.
- [ ] Build and lint pass.

## Out of scope

Masthead (13), metadata and OG (15), the map link target (16).
