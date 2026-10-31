# 12 · Datasheet: corrections, cross-links, and its place in the site

**Phase**: D (glue) · **Size**: S · **Depends on**: 01, 06

## Goal

`/datasheet/` stays the long version, now clearly secondary and linked both ways with the
project pages. Content corrections already landed in issue 02 flow through automatically;
this issue handles structure and links only.

## Source material

- `app/datasheet/page.tsx`, `app/components/AppNote.tsx`, `app/components/parts.tsx`.

## Spec

1. **Banner** above page 1 (inside the first `Sheet`, before `.hero`): a one-line mono
   note, `--muted`: "This is the long version. The short version is at
   <a href="/">aadityad.dev</a>, and each project has its own page." Keep it inside the
   sheet so the paper metaphor holds.
2. **Per-note link**: in `AppNote.tsx`, add to `.an-links` a first button
   `<a className="button primary" href={`/work/${note.id}/`}>Project page →</a>`.
3. **Block diagram and pin table**: wherever a project id is linked as `#${id}`, keep the
   in-page anchor (the datasheet has the full entries), but add `title="Jump to the
   application note"` so hover explains it.
4. **Specs table "Source" column**: keep `AN-0x →` anchors.
5. **"Ordering information"**: add a row to `.contact-list`: "Short version ·
   aadityad.dev · →" linking to `/`.
6. **`TOTAL_PAGES`**: unchanged at 15 unless a sheet was added or removed; verify and fix.
7. **Print**: `@media print` already exists; check that the new banner and buttons are
   hidden in print (`.no-print` class on both).
8. **Description**: confirm `DESCRIPTION` renders the corrected "real constraints" text
   (issue 02); if not, that issue is incomplete, stop and report.

## Files

Modify: `app/datasheet/page.tsx`, `app/components/AppNote.tsx`, `app/globals.css` (print rule).

## Acceptance criteria

- [ ] Every application note has a "Project page →" button that resolves.
- [ ] Banner visible on screen, hidden in print preview.
- [ ] Page footers still read "Page N of 15" correctly.
- [ ] Build and lint pass.
