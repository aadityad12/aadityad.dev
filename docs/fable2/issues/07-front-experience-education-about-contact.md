# 07 · Front page: experience, education, about, contact, compressed

**Phase**: C · **Size**: M · **Depends on**: 01 · **Unblocks**: 10

## Goal

Everything below the work cards becomes scannable: one line per job, two lines of
education, three awards, one line of certifications, one line of open source, one short
paragraph, and a contact block with the email first. The toolbox leaves the front page
(the skills panel is the toolbox now). Coursework, the full bullets, all six certifications
and the open-source PR descriptions stay in the datasheet.

## Source material

- `app/components/brief/Experience.tsx`, `Credentials.tsx`, `About.tsx`, `Contact.tsx`.
- `app/content.ts`: `EXPERIENCE[].summary`, `EDUCATION`, `AWARDS_BRIEF`, `CERTS`,
  `OPEN_SOURCE`, `OSS`, `BRIEF.about`, `BRIEF.contactKicker`, `BRIEF.contactLine`.
- `app/globals.css` lines 545 to 621 (`.xp`, `.cred-*`, `.about-*`, `.brief-contact`).

## Layout (1440 px)

```
Experience                                          Industry research, teaching, leadership.
──────────────────────────────────────────────────────────────────────────────────────────
APR 2026 TO JUN 2026   Research Intern and Technical Lead, VisionAssist
CUPERTINO, CA          Infineon Technologies, with De Anza College
                       Led software on a five-person team building an offline navigation
                       aid for blind users on a Raspberry Pi 5: ...   VisionAssist →
──────────────────────────────────────────────────────────────────────────────────────────
AUG 2026 TO NOW        Teaching Assistant, ENGR 10: Introduction to Engineering
SAN JOSÉ, CA           San José State University
                       Run two weekly lab sections of 30 students ...
... (two more)

Education                                                  Degrees, awards, open source.
──────────────────────────────────────────────────────────────────────────────────────────
San José State University                      │ Awards
B.S. Computer Engineering, Minor in AI         │ Sponsor Track winner · UC Berkeley AI Hackathon 2026 · Accordion
Expected May 2028 · GPA 3.8 · Dean's Scholar   │ 2nd place · DA Hacks 3.5 · ClassPath AI
                                               │ Top 10 at site · ICPC 2025 Regionals, Division 2
De Anza College                                │
Certificate of Achievement, Programming in     │ Open source
C/C++, with Honors                             │ Merged upstream: Soup (9.8k★), fusioncore (380★). Every contribution, tracked live ↗
Mar 2026 · GPA 3.8 · Dean's List               │
                                               │ Certifications
                                               │ AWS Certified Cloud Practitioner · Oracle Cloud Infrastructure Generative AI Professional · Anthropic: Model Context Protocol, Advanced Topics · ... (CERTS joined by " · ")

About
──────────────────────────────────────────────────────────────────────────────────────────
I'm from India, and I got into engineering through VEX robotics. It came full circle ...

[footer] SUMMER 2027 INTERNSHIPS · WINTER 2027 CO-OPS
         Get in touch.
         I'm looking for roles in software, embedded systems, and AI/ML. Email is the fastest way to reach me.
         [aaditya.d.desai@gmail.com] [Résumé ↗] [GitHub ↗] [LinkedIn ↗]
         Aaditya Desai · Santa Clara, CA        Full datasheet ↗ · Devpost ↗ · Source ↗
```

Under 900 px the education columns stack. Under 700 px the experience date column moves
above the role.

## Spec

### `Experience.tsx`

Keep the section id `experience` and the `.pi-head` header (sub-line: "Industry research,
teaching, leadership."). Each `<li>`: `.xp-when` (when, where) unchanged; `.xp-body` with
`<h3>{role}</h3>`, `<p className="org">{org}</p>`, `<p className="xp-sum">{summary}</p>`.
Remove the `<ul>` of `points`. The first entry appends `<Link href="/work/visionassist/">
VisionAssist →</Link>` inside `.xp-sum` after the sentence (mono, 12 px). Reduce `.xp`
row padding to 14 px top and bottom.

### `Credentials.tsx`

Rename the heading to "Education" (keep `id="education"` and `aria-labelledby`); sub-line
"Degrees, awards, open source." Two columns as drawn:

- Left: `EDUCATION` entries with `school`, `degree`, and the `when · note` line. **Do not
  render `courses`.**
- Right: `<h3>` "Awards" with `AWARDS_BRIEF` as a `<ul>` of `{t} · {d}` lines (drop the
  table). `<h3>` "Open source": one `<p>`: "Merged upstream: " then for each `OPEN_SOURCE`
  entry `<a href={o.href}>{o.name}</a> ({o.stars})` joined by ", ", then ". " and
  `<a href={OSS}>Every contribution, tracked live ↗</a>`. No `Status` tag. `<h3>`
  "Certifications": one `<p>` with `CERTS` joined by " · ".
- Remove the Toolbox `<dl>` and the `SKILLS` import. Remove `Status` import.

### `About.tsx`

One `<p>` with `BRIEF.about`. Remove the `FACTS` constant in this file and the `<dl>`; its
four rows (Based, Studying, Graduating, Available) are already in the hero, the facts
strip and the education block.

### `Contact.tsx`

Kicker `BRIEF.contactKicker`, `<h2>Get in touch.</h2>`, line `BRIEF.contactLine`. Buttons:
email (primary, shows the address), Résumé ↗, GitHub ↗, LinkedIn ↗. Devpost moves to the
`.contact-foot` row as "Devpost ↗" between "Full datasheet" and "Source". Otherwise
unchanged.

### `app/page.tsx`

Section order: `<Hero /><Facts /><Work /><Experience /><Credentials /><About />` then
`<Contact />`. (04 and 05 supply the first three; if either is unmerged, keep the old
component in its slot and note it.)

### Styles

Delete `.edu-courses`, `.toolbox`, `.about-facts`, `.about-cols`, the `.awards` table
rules. Add `.xp-sum`, `.awards-list`, `.oss-line` (one line), `.certs-line` as needed.
Trim section top margins: `clamp(28px, 4vw, 48px)` for `.brief-xp`, `.brief-cred`,
`.brief-about`.

## Files

Modify: `app/components/brief/Experience.tsx`, `Credentials.tsx`, `About.tsx`,
`Contact.tsx`, `app/page.tsx`, `app/globals.css`.

## Acceptance criteria

- [ ] Experience shows four entries with one sentence each and no bullets; the first links to `/work/visionassist/`.
- [ ] Education shows two schools without coursework, three awards, one open-source line, one certifications line, and no toolbox.
- [ ] About is one paragraph with no facts table.
- [ ] `grep -c 'class="tag' out/index.html` is 0.
- [ ] Words in `<main>` plus `<footer>` of `out/index.html`, with 04 and 05 merged, are 600 or fewer. Put the count in the PR (use the counting method from issue 10, or `scripts/check-brief.mjs` if it exists).
- [ ] Height of `/` at 1440 x 900 is 2,400 px or less and at 390 x 844 is 4,400 px or less (`document.documentElement.scrollHeight`). Put both in the PR.
- [ ] 390 px: date column above the role, nothing scrolls sideways. Screenshot 390 and 1440.
- [ ] No-JS identical. Lint, build, budget pass.

## Out of scope

Hero, facts (04). Work cards (05). Datasheet content (unchanged).
