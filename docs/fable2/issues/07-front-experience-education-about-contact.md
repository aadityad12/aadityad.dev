# 07 · Front page: experience, education, about, contact, compressed

**Phase**: C · **Size**: M · **Depends on**: 01 · **Unblocks**: 10

## Goal

Everything below the work cards becomes scannable: one line per job, two lines of
education, three awards, one line of certifications, one line of open source, one short
paragraph, and a contact block with the email first. The toolbox leaves the front page
(the skills panel is the toolbox now). Coursework, the full bullets with their headcounts
and hours, the in-progress certification and the open-source PR descriptions stay in the
datasheet, one click away from the section header.

## Source material

- `app/components/brief/Experience.tsx`, `Credentials.tsx`, `About.tsx`, `Contact.tsx`.
- `app/content.ts`: `EXPERIENCE[].summary`, `EDUCATION`, `AWARDS_BRIEF`, `CERTS_BRIEF`,
  `OPEN_SOURCE` (`name`, `what`, `href` only), `OSS`, `BRIEF.about`, `BRIEF.contactKicker`,
  `BRIEF.contactLine`.
- `docs/fable2/README.md`, "How a recruiter reads a page" and "The landmark read": this
  issue builds the second half of that list.
- `app/globals.css` lines 545 to 621 (`.xp`, `.cred-*`, `.about-*`, `.brief-contact`).

## Layout (1440 px)

```
Experience                                            Full record in the datasheet ↗
──────────────────────────────────────────────────────────────────────────────────────────
APR 2026 TO JUN 2026   Research Intern and Technical Lead, VisionAssist
CUPERTINO, CA          INFINEON TECHNOLOGIES, WITH DE ANZA COLLEGE
                       Led the software for an offline navigation aid for blind users
                       on a Raspberry Pi 5: ...                        VisionAssist →
──────────────────────────────────────────────────────────────────────────────────────────
AUG 2026 TO NOW        Teaching Assistant, ENGR 10: Introduction to Engineering
SAN JOSÉ, CA           SAN JOSÉ STATE UNIVERSITY
                       Run the ENGR 10 lab sections, where students solder ...
... (two more)

Education                                                  Degrees, awards, open source.
──────────────────────────────────────────────────────────────────────────────────────────
San José State University                      │ Awards
B.S. Computer Engineering, Minor in AI         │ Sponsor Track winner · UC Berkeley AI Hackathon 2026 · Accordion
Expected May 2028 · GPA 3.8 · Dean's Scholar   │ 2nd place · DA Hacks 3.5 · ClassPath AI
                                               │ Top 10 at site · ICPC 2025 Regionals, Division 2
De Anza College                                │
Certificate of Achievement, Programming in     │ Open source
C/C++, with Honors                             │ Merged upstream: Soup (9.8k★), fusioncore (380★). All contributions ↗
Mar 2026 · GPA 3.8 · Dean's List               │
                                               │
                                               │ Certifications
                                               │ AWS Certified Cloud Practitioner · Oracle Cloud Infrastructure Generative AI Professional · Anthropic: Model Context Protocol, Advanced Topics · ... (CERTS_BRIEF joined by " · ")

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

Keep the section id `experience` and the `.pi-head` header. Its mono sub-line becomes a
link: `<a href="/datasheet/#revisions">Full record in the datasheet ↗</a>`. This is the
"optional clickable" for the reader who wants the bullets; the front page shows one
sentence per job and offers the rest in one click. Each `<li>`: `.xp-when` (when, where) unchanged; `.xp-body` with
`<h3>{role}</h3>`, `<small className="org">{org}</small>`, `<p className="xp-sum">{summary}</p>`
(16 px, `--ink-2`, max 60ch). The organisation becomes a mono label (12 px, uppercase, `--ink-2`, letter-spacing 0.06em,
the same look as the `where` line on the work cards) so the eye stops on the employer's
name as well as the role; it was a plain sans line before. Remove the `<ul>` of `points`.

Landmarks in this section: the `h2`, each `h3` role, each `small` organisation, and the
mono date column. Body: the summaries. Nothing in a summary is bold. The first entry appends `<Link href="/work/visionassist/">
VisionAssist →</Link>` inside `.xp-sum` after the sentence (mono, 12 px). Reduce `.xp`
row padding to 14 px top and bottom.

### `Credentials.tsx`

Rename the heading to "Education" (keep `id="education"` and `aria-labelledby`); sub-line
"Degrees, awards, open source." Two columns as drawn:

- Left: `EDUCATION` entries, each `<h3>{school}</h3>`, `<p>{degree}</p>`, and the
  `when · note` line as mono. **Do not render `courses`.**
- Right: `<h3>` "Awards" with `AWARDS_BRIEF` as a `<ul>` of `<li><b>{t}</b> · {d}</li>`
  (drop the table). `<h3>` "Open source": one `<p>`: "Merged upstream: " then for each
  `OPEN_SOURCE` entry `<a href={o.href}>{o.name}</a> ({o.stars})` joined by ", ", then ". "
  and `<a href={OSS}>All contributions ↗</a>`. The star counts stay (a GitHub user reads
  "9.8k★" instantly: that is a serious project to have landed a PR in); the PR
  descriptions and the `Status` tag do not. `<h3>` "Certifications": one `<p>` with
  `CERTS_BRIEF` joined by " · ". Both lines 15 px `--ink-2`.
- Remove the Toolbox `<dl>` and the `SKILLS` import. Remove `Status` import.

Landmarks in this section: the `h2`, the two school `h3`s, the three sub-heading `h3`s,
and the three award `<b>`s. Body: degrees, the GPA line, the open-source line, the
certifications line. The GPA appears here and in the facts strip, which links to this
section; that is the one allowed repeat on the page.

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

- [ ] Experience shows four entries with one sentence each and no bullets; the first links to `/work/visionassist/`; the section header links to `/datasheet/#revisions` and that anchor lands on the revision history.
- [ ] Education shows two schools without coursework, three awards, one open-source line (Soup 9.8k★, fusioncore 380★, All contributions), one certifications line with five finished certifications, and no toolbox.
- [ ] About is one paragraph with no facts table.
- [ ] `grep -c 'class="tag' out/index.html` is 0.
- [ ] The landmark read of `/` (issue 10's script, or its regex by hand), with 04 and 05 merged, matches the target read in `docs/fable2/README.md` from `h2 Experience` to the end. Paste the whole read in the PR.
- [ ] `out/index.html` contains none of: "in progress", "team of", "-person", "solo", "30 students", "54 members", "6 contact hours" (case-insensitive). No `<b>` or `<strong>` sits inside a `<p>`. No body text on the page is under 16 px and no mono label under 12 px (inspect `.xp-sum`, `.facts span`, `.wk-card p`, `.oss-line`, `.certs-line`, `.about p`).
- [ ] Sanity check: height of `/` at 1440 x 900 is 2,400 px or less and at 390 x 844 is 4,400 px or less (`document.documentElement.scrollHeight`). Put both in the PR. If over, find the section whose landmarks sit furthest apart and say so; do not trim copy from issue 01's fields to pass.
- [ ] 390 px: date column above the role, nothing scrolls sideways. Screenshot 390 and 1440.
- [ ] No-JS identical. Lint, build, budget pass.

## Out of scope

Hero, facts (04). Work cards (05). Datasheet content (unchanged).
