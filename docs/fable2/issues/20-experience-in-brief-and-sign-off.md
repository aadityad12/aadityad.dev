# 20 · Experience in brief, and the sign-off

**Phase**: H · **Size**: M · **Depends on**: 19 · **Unblocks**: 21

## Goal

After Work, the round-2 page runs Experience, Education, Awards, Open source,
Certifications, About and Contact, each as [bold line / grey sentence / capitals]: fifteen
instances of one shape. After this issue there is one Experience section of one-line
items, each line a mono column (the dates, or a group label), the bold thing and the grey
rest: four jobs, two schools, three awards, two merged pull requests. Certifications leave
the front page (they are in the datasheet and the PDF). About loses its heading and
becomes the sign-off paragraph in the contact footer. README round 3, decisions 7 and 8;
rule 18.

## Source material

- `app/components/brief/Experience.tsx`; `Credentials.tsx` and `About.tsx` (deleted);
  `Contact.tsx`; `app/page.tsx`.
- `app/globals.css`: `/* ---- experience ---- */`, `/* ---- credentials ---- */`,
  `/* ---- about ---- */`, `/* ---- contact ---- */`, the `.cred-cols` rule in
  `@media (min-width: 900px)`, the `.xp > li` and `.xp-when` rules in
  `@media (max-width: 700px)`.
- `app/content.ts`: `EXPERIENCE` (`when`, `role`, `org`; `summary` is deleted here),
  `EDUCATION` (`school`, `degree`, `when`), `AWARDS`, `AWARDS_BRIEF`, `CERTS_BRIEF`
  (deleted), `OPEN_SOURCE` (`name`, `stars`, `what`, `href`), `OSS`, `BRIEF.about`,
  `BRIEF.contactKicker`, `BRIEF.contactLine`.
- `scripts/check-brief.mjs` (`REQUIRED`).
- README: round 3, decisions 7 and 8; rule 18; "The landmark read, round 3".

## Layout

1440:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2 px
Experience (h2 40)                                              Full record in the datasheet ↗

APR 2026 TO JUN 2026   Research Intern and Technical Lead, VisionAssist     Infineon Technologies, with De Anza College
AUG 2026 TO NOW        Teaching Assistant, ENGR 10: Introduction to Eng…    San José State University
JAN 2025 TO DEC 2025   Teaching Assistant and Computer Science Tutor        De Anza College
APR 2025 TO DEC 2025   Co-Founder and Co-President                          Applied Data Analytics Club, De Anza College
─────────────────────────────────────────────────────────────────────────────────────── ink
EDUCATION              San José State University                            B.S. Computer Engineering, Minor in Artificial Intelligence · Expected May 2028
                       De Anza College                                      Certificate of Achievement, Programming in C/C++, with Honors · Mar 2026
AWARDS                 2nd place                                            DA Hacks 3.5 · ClassPath AI
                       Top 10 at site                                       ICPC 2025 Regionals, Division 2
                       Most Valuable Peer                                   HackStorm 2.0, May 2026
OPEN SOURCE            Soup                                                 9.8k★ · LLM fine-tuning toolkit · Merged upstream ↗
                       fusioncore                                           380★ · ROS 2 localization for outdoor robots · Merged upstream ↗
─────────────────────────────────────────────────────────────────────────────────────── ink
```

Three columns: 180 px mono, the bold thing (1.1fr), the grey rest (1fr), 24 px gaps, a
hairline under each job and each group. Under 900 a line stacks (mono, bold, grey) and a
group shows its label once above its lines.

The contact footer:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2 px
Summer 2027 internships · Winter 2027 co-ops                               (sans 16/600, ink-2)
Get in touch.                                                              (h2 48)
I'm looking for roles in software, embedded systems, and AI/ML. Email is the fastest way to reach me.
[aaditya.d.desai@gmail.com] [Résumé ↗] [GitHub ↗] [LinkedIn ↗]
I'm from India, and I got into engineering through VEX robotics. Most of what I build …   (17, ink-2, 64ch: the sign-off)
Aaditya Desai · Santa Clara, CA        Full datasheet ↗ · Devpost ↗ · Open source ↗        Source ↗
```

## Spec

### Experience.tsx

```tsx
import Link from "next/link";
import { AWARDS_BRIEF, EDUCATION, EXPERIENCE, OPEN_SOURCE } from "../../content";

const EXT = { target: "_blank", rel: "noreferrer" } as const;

export default function Experience() {
  return (
    <section id="experience" className="brief-xp" aria-labelledby="experience-h">
      <header className="pi-head">
        <h2 id="experience-h">Experience</h2>
        <p><Link className="cta" href="/datasheet/#revisions">Full record in the datasheet ↗</Link></p>
      </header>
      <ol className="xp">
        {EXPERIENCE.map((job) => (
          <li key={job.role}>
            <span className="xp-k">{job.when}</span>
            <h3>{job.role}</h3>
            <span className="xp-d">{job.org}</span>
          </li>
        ))}
      </ol>
      <div className="xp-group">
        <h3 className="xp-k" id="education">Education</h3>
        <ul className="xp-list">
          {EDUCATION.map((e) => (
            <li key={e.school}><b>{e.school}</b><span className="xp-d">{e.degree} · {e.when}</span></li>
          ))}
        </ul>
      </div>
      <div className="xp-group">
        <h3 className="xp-k" id="awards">Awards</h3>
        <ul className="xp-list">
          {AWARDS_BRIEF.map((a) => (
            <li key={a.t}><b>{a.t}</b><span className="xp-d">{a.d}</span></li>
          ))}
        </ul>
      </div>
      <div className="xp-group">
        <h3 className="xp-k" id="open-source">Open source</h3>
        <ul className="xp-list">
          {OPEN_SOURCE.map((o) => (
            <li key={o.href}>
              <b>{o.name}</b>
              <span className="xp-d">{o.stars} · {o.what} · <a href={o.href} {...EXT}>Merged upstream ↗</a></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

No city (`job.where`), no summary, no VisionAssist link (the VisionAssist row is on the
same page, two sections up). "Merged upstream" is the phrase the round-2 Credentials used.

`content.ts`:

- Delete the `summary` field from every `EXPERIENCE` entry (issue 01 added it for the
  brief; nothing else reads it). `where`, `points` and `link` stay for the datasheet.
- `AWARDS_BRIEF`:

```ts
// The front page shows three. The Sponsor Track win is already the hero's second fact, so the list starts at the second award. The datasheet shows all.
export const AWARDS_BRIEF = AWARDS.slice(1, 4);
```

- Delete `CERTS_BRIEF` and its comment (the datasheet uses `CERTS`).

### Contact.tsx

```tsx
import Link from "next/link";
import { BRIEF, DEVPOST, EMAIL, GITHUB, LINKEDIN, OSS, RESUME } from "../../content";

const SOURCE = "https://github.com/aadityad12/aadityad.dev";
const EXT = { target: "_blank", rel: "noreferrer" } as const;

export default function Contact() {
  return (
    <footer id="contact" className="brief-contact">
      <div className="contact-in">
        <p className="contact-kicker">{BRIEF.contactKicker}</p>
        <h2>Get in touch.</h2>
        <p className="contact-line">{BRIEF.contactLine}</p>
        <div className="contact-actions">
          <a className="button primary" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a className="button" href={RESUME} {...EXT}>Résumé ↗</a>
          <a className="button" href={GITHUB} {...EXT}>GitHub ↗</a>
          <a className="button" href={LINKEDIN} {...EXT}>LinkedIn ↗</a>
        </div>
        <p className="contact-about">{BRIEF.about}</p>
        <div className="contact-foot">
          <span>Aaditya Desai · Santa Clara, CA</span>
          <span>
            <Link href="/datasheet/">Full datasheet</Link> ↗ · <a href={DEVPOST} {...EXT}>Devpost ↗</a> · <a href={OSS} {...EXT}>Open source ↗</a>
          </span>
          <span>
            <a href={SOURCE} {...EXT}>Source ↗</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
```

### page.tsx

Remove the `Credentials` and `About` imports and elements; `main` holds `<Hero />`,
`<Work />`, `<Experience />`. Delete `Credentials.tsx` and `About.tsx`.

### CSS

Delete the `/* ---- experience ---- */` rules (`.brief-xp, .brief-cred, .brief-about`
margin; `.xp`, `.xp > li`, `.xp-when`, `.xp-body`, `.xp h3`, `.xp .org`, `.xp-sum`), the
whole `/* ---- credentials ---- */` block, `/* ---- about ---- */`, the `.cred-cols` rule in
`@media (min-width: 900px)`, and the `.xp > li` and `.xp-when` rules in
`@media (max-width: 700px)`. Add:

```css
/* ---- experience ---- */
main.brief .brief-xp { margin-top: clamp(48px, 6vw, 80px); }
main.brief .xp, main.brief .xp-list { list-style: none; margin: 0; padding: 0; }
main.brief .xp > li, main.brief .xp-group { padding: 12px 0; border-bottom: 1px solid var(--hair); }
main.brief .xp > li:last-child, main.brief .xp-group:last-child { border-bottom: 1px solid var(--ink); }
main.brief .xp-k { display: block; margin: 0 0 6px; font-family: var(--mono); font-size: 14px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.6; color: var(--ink-2); }
main.brief .xp h3, main.brief .xp-list b { display: block; margin: 0; font-size: 17px; font-weight: 700; line-height: 1.4; color: var(--ink); }
main.brief .xp-d { display: block; margin-top: 2px; font-size: 16px; line-height: 1.45; color: var(--ink-2); }
main.brief .xp-list li + li { margin-top: 10px; }
@media (min-width: 900px) {
  main.brief .xp > li { display: grid; grid-template-columns: 180px minmax(0, 1.1fr) minmax(0, 1fr); column-gap: 24px; align-items: baseline; }
  main.brief .xp-group { display: grid; grid-template-columns: 180px minmax(0, 1fr); column-gap: 24px; align-items: baseline; }
  main.brief .xp-list li { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); column-gap: 24px; align-items: baseline; }
  main.brief .xp-list li + li { margin-top: 8px; }
  main.brief .xp-k { margin-bottom: 0; }
  main.brief .xp-d { margin-top: 0; }
}
.brief-contact .contact-kicker { margin: 0 0 12px; font-family: var(--sans); font-size: 16px; font-weight: 600; letter-spacing: 0; text-transform: none; color: var(--ink-2); }
.brief-contact .contact-about { margin: 28px 0 0; max-width: 64ch; font-size: 17px; line-height: 1.55; color: var(--ink-2); }
```

(The `.contact-kicker` rule replaces the mono one.) The group's second column is the width
of the jobs' second and third columns plus their gap, and its list splits it the same way,
so the bold and grey columns align across the whole section. The mono column is 14 px for
dates and labels alike: one column, one size.

### check-brief

`REQUIRED` after `"Alta"`:

```js
"Experience",
"Research Intern and Technical Lead, VisionAssist",
"Education",
"San José State University",
"Get in touch.",
"aaditya.d.desai@gmail.com",
```

`"Infineon Technologies, with De Anza College"` leaves the list: it is no longer a `small`,
and the Infineon question is answered by the hero's `b Infineon`. `RE` is unchanged.

## Files

Delete: `app/components/brief/Credentials.tsx`, `app/components/brief/About.tsx`.
Modify: `app/components/brief/Experience.tsx`, `app/components/brief/Contact.tsx`,
`app/page.tsx`, `app/content.ts` (`EXPERIENCE[].summary`, `AWARDS_BRIEF`, `CERTS_BRIEF`),
`app/globals.css`, `scripts/check-brief.mjs`.

## Acceptance criteria

- [ ] At 1440: Experience is one list: four job lines (mono dates | role | employer), then Education (2 lines), Awards (3: 2nd place, Top 10 at site, Most Valuable Peer), Open source (2), each group's label once in the mono column; the bold column's left edge is at the same x on every line. Screenshot.
- [ ] `grep -c "Certif" out/index.html` is 0; `grep -c "Sponsor Track" out/index.html` is 1 (the Accordion row's venue line); no city names, summaries or About heading on `/`.
- [ ] Contact footer: kicker in 16 px Archivo 600, not uppercase; "Get in touch."; the contact line; four buttons; the About paragraph (`p.contact-about`, 17 px, 64ch) after the buttons; the foot line with "Open source ↗". Accent audit `[]`.
- [ ] Computed at 1440: `.xp-k` 14 px IBM Plex Mono, uppercase; `.xp h3` and `.xp-list b` 17 px, weight 700; `.xp-d` 16 px Archivo in `--ink-2`, not uppercase. Nothing on `/` is 12 px; fine-print share 15 % or less.
- [ ] `#education`, `#awards` and `#open-source` resolve; the hero's "3.8 GPA" lands on the Education label under the masthead.
- [ ] Repeat count (issue 21's snippet) on `/` at 1440: Infineon 3 or fewer, SJSU or San José State 3 or fewer, Summer 2027 2 or fewer, UC Berkeley AI Hackathon 2 or fewer, winner 2 or fewer.
- [ ] `npm run brief` read ends: `h2 Experience`, `cta Full record in the datasheet ↗`, four `h3` roles, `h3 Education`, `b San José State University`, `b De Anza College`, `h3 Awards`, `b 2nd place`, `b Top 10 at site`, `b Most Valuable Peer`, `h3 Open source`, `b Soup`, `b fusioncore`, `h2 Get in touch.`, four buttons. All rows PASS.
- [ ] Heights: 4,800 px or less at 1440 x 900; 5,800 or less at 390 x 844. At 390 a line stacks (label, bold, grey), a group shows its label once; nothing scrolls sideways.
- [ ] `grep -rn "cred-\|about-text\|brief-about\|xp-sum\|xp-when\|xp-body\|CERTS_BRIEF\|summary:" app/components app/content.ts app/globals.css app/page.tsx` returns nothing.
- [ ] Lint, build, budget, brief pass. No-JS: complete. Reduced motion: nothing moves. Keyboard: Tab reaches the cta, both "Merged upstream ↗" links, the four footer buttons and the three foot links, with visible focus.

## Out of scope

The datasheet. Any copy beyond the fields named. `job.where`, `job.points`, `job.link`,
`CERTS`, `AWARDS`, `OSS` stay in `content.ts`.
