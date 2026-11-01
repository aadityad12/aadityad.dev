# 08 · Project pages: a way in and a way out

**Phase**: D · **Size**: M · **Depends on**: 03, 06

## Goal

A reader who lands on `/work/rung/` from a README should see at a glance where they are
(project 3 of 10, under Work) and, when they reach the bottom, be offered the next
project, the previous one, the list of all ten, and the front page, in type they can read.
Today the only exits are a 13 px mono line and the masthead. The header's meta line also
stops saying "team of 5" and "Solo": it is the first thing a recruiter arriving from a
Devpost or README link reads, and rule 3 applies to it.

## Source material

- `app/work/[slug]/page.tsx`: `.work-head`, `.work-links` (with the `work-all` link),
  `.work-next`.
- `app/globals.css` lines 622 to 655.
- `app/content.ts`: `NOTES[].oneLiner`, `.order`, `.title`, `.where` (issue 01), `.an`,
  `.domain`.
- `app/components/Masthead.tsx` after issue 03: J/K still navigate; the crumb reads
  "Work / {title}".

## Layout (1440 px)

Top of the page, above the mono meta line:

```
← All work                                                     Project 03 of 10
AN-02 · COMPILERS AND RUNTIMES · PERSONAL PROJECT · SEP TO OCT 2026
Rung
One small language, built five ways, ...
[GitHub ↗]
```

Bottom of the page, replacing `.work-next`:

```
──────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────┐  ┌───────────────────────────────────┐
│ ← PREVIOUS                        │  │ NEXT →                            │
│ Accordion                         │  │ Alta                              │
│ Context manager for AI coding     │  │ Voice lab TA that reads real      │
│ agents: folds what isn't ...      │  │ voltages off a breadboard ...     │
└───────────────────────────────────┘  └───────────────────────────────────┘
All work · Home · This project in the datasheet ↗            KEYBOARD: J NEXT · K PREVIOUS
```

Under 700 px the two cards stack (Next first, then Previous) and the keyboard hint is
hidden.

## Spec

### Header

Insert before `.work-meta`:

```tsx
<nav className="work-crumbs" aria-label="Breadcrumb">
  <Link href="/work/">← All work</Link>
  <span>Project {String(note.order).padStart(2, "0")} of {NOTES.length}</span>
</nav>
```

Mono 12 px uppercase, `--ink-2`, flex with `justify-content: space-between`, margin-bottom
18 px. Remove the `work-all` link from `.work-links` (and its CSS).

Then in `.work-meta`, replace the three spans `{note.context}`, `{note.role}` and
`{note.when}` with one `<span>{note.where}</span>`, so the line reads
`{an} · {domain} · {where}`. `context`, `role` and `when` stay in `content.ts` for the
datasheet; nothing else on the project page changes.

### Footer

Replace `.work-next` with:

```tsx
<nav className="work-foot" aria-label="More work">
  <div className="work-foot-cards">
    <a className="work-card prev" href={`/work/${prev.id}/`}>
      <span className="work-card-k">← Previous</span>
      <b>{prev.title}</b>
      <span className="work-card-d">{prev.oneLiner}</span>
    </a>
    <a className="work-card next" href={`/work/${next.id}/`}>
      <span className="work-card-k">Next →</span>
      <b>{next.title}</b>
      <span className="work-card-d">{next.oneLiner}</span>
    </a>
  </div>
  <p className="work-foot-links">
    <Link href="/work/">All work</Link> · <Link href="/">Home</Link> ·{" "}
    <a href={`/datasheet/#${note.id}`}>This project in the datasheet ↗</a>
    {note.id === "visionassist" && <> · <Link href="/#experience">Experience: Infineon →</Link></>}
    <span className="work-keys" aria-hidden="true">Keyboard: J next · K previous</span>
  </p>
</nav>
```

`prev` and `next` are the existing `BY_ORDER` neighbours. Cards: `var(--paper)`
background, 1 px `var(--hair)` border (ink on hover and focus-visible), padding 16 px 18 px,
`work-card-k` mono 11.5 px uppercase `--muted`, `<b>` 22 px weight 800 stretch 112%,
`work-card-d` 14.5 px `--ink-2`. The Next card's `work-card-k` and arrow are `--accent`.
Two columns at ≥ 700 px, gap 16 px; stacked under with `.next` first (`order: -1`).
`.work-foot-links` mono 12.5 px uppercase, margin-top 14 px, `work-keys` floated right
and hidden under 900 px. 2 px ink rule above the whole nav as `.work-next` had.

### The datasheet entry link in the masthead

Issue 03 removed it from the masthead; the footer link above is its replacement. Nothing
else to do.

## Files

Modify: `app/work/[slug]/page.tsx`, `app/globals.css`.

## Acceptance criteria

- [ ] `/work/rung/` shows "← All work" and "Project 03 of 10" above the meta line; the link goes to `/work/`.
- [ ] The meta line on `/work/visionassist/` reads `<an> · <domain> · Infineon Technologies · software lead · Apr to Jun 2026`, and on no project page does it contain "team of" or "Solo". Check all ten with:
  `node -e 'for (const f of process.argv.slice(1)) { const m = require("fs").readFileSync(f, "utf8").match(/<p class="work-meta">.*?<\/p>/); console.log(f, m ? m[0].replace(/<[^>]+>/g, " | ") : "NO META"); }' out/work/*/index.html`
  and paste the ten lines in the PR. `/datasheet/` still shows `role` (diff `out/datasheet/index.html` before and after: identical).
- [ ] The footer shows a Previous card (Accordion) and a Next card (Alta) with titles and one-liners, then All work, Home, the datasheet link.
- [ ] `/work/visionassist/` footer additionally shows "Experience: Infineon →".
- [ ] `/work/clear-dispatch/` Next is VisionAssist (wraps); `/work/visionassist/` Previous is Clear Dispatch.
- [ ] J and K still work and match the cards.
- [ ] 390 px: Next card above Previous, keyboard hint hidden, nothing scrolls sideways. Screenshot 390 and 1440.
- [ ] `grep -rn "work-next\|work-all\|#projects" app/` is empty.
- [ ] No `.tag` in the new nav. Lint, build, budget pass.

## Out of scope

The reel (09). Masthead (03).
