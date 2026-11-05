# Fable2: the plan

Fable2 is Fable1 with a quieter front page and a clear way around the site. The theme
stays: paper and ink, Archivo and IBM Plex Mono, the datasheet voice, the chip, the ten
project pages and their figures. What changes is how much a reader is asked to take in at
once, and how they get from one place to the next.

Every task is an issue file in `docs/fable2/issues/`, written so that a well-scoped
implementer (a Sonnet subagent) can complete it without making design or content decisions.
The thinking is done here; the issues are the instructions. The Fable1 plan in `docs/plan/`
is history: read it for the component contracts it set up, not for what to build next.

Branch base: `Fable1` (commit 8b18124), which is the finished Fable1 site.

## What is wrong with Fable1, in numbers

Measured on the Fable1 build, 31 Oct 2026:

| | Fable1 | Fable2 target |
| --- | --- | --- |
| Stops for a scanning eye on `/` (the landmark read, below) | 87, of which 13 are status tags and 10 are bold numbers a recruiter cannot judge | Every stop answers one of the recruiter's six questions or names a section; **no tags, no benchmark or effort numbers** (checked by `scripts/check-brief.mjs`) |
| Status tags (`Measured`, `Repo`, ...) on `/` | 13 | **0** |
| Height of `/` at 1440 x 900 | 4,314 px (4.8 screens) | 4,800 px or less (round 3; one uncropped project per screen; see "Round 2" and "Round 3" below for why the ceiling moved from 2,400) |
| Height of `/` at 390 x 844 | 7,795 px (9.2 screens) | 5,800 px or less (round 3) |
| Links in the masthead on a project page | 5, different from every other route, in 11.5 px mono capitals; previous/next shrink to bare arrows under 1000 px | 4, the same on every route, 14.5 px sans |
| Way off a project page, apart from the masthead | one mono line "Next: Alta" | previous and next cards, "All work", "Home" |

What a recruiter sees today, and why it fails them:

- The hero has an intro paragraph that repeats the proof strip, which repeats the
  experience section. The same three facts are read three times.
- The proof strip says "38.84x [Measured]". A recruiter does not know what is 38 times
  faster than what, and the tag is jargon from the datasheet. The number belongs on the
  Rung page, with its tag, where an engineer can see the conditions.
- The project table has six columns of information per row times ten rows: number,
  title, context, role, one-liner, headline number, status tag, stack. Nobody can find
  anything, and the first four rows are the only ones that matter to a first-time reader.
- On a phone the chip sits below the fold with 28 labels, and the recruiter scrolls past
  a wall of small mono text they have no reason to understand.
- Credentials lists coursework, six certifications, two open-source PRs with full
  descriptions and a 50-item toolbox. About is three paragraphs plus a facts table.
- A project page ends in a 13 px mono line. The masthead on that page shows five links
  (previous, next, all projects, datasheet entry, resume) that no other route has, so the
  reader has to relearn the navigation on every page type. Aadi's own account of using
  it: he landed on the front page and did not know where to go; he did not see how to get
  to all the projects except by clicking each one; once on a project page he did not know
  how to get out, and did not realise the small items in the bar were the way between
  projects, because they were not legible.

## How a recruiter reads a page

A word count was the wrong instrument: it measures the page, not the reader. A recruiter
does not read the front page, they scan it, and the scan has a shape. Fable2 is designed
for that shape and tested against it.

What the eye does on a page it has never seen, in the first thirty seconds:

1. **It lands top left** and reads the first two or three lines in full: the kicker, the
   name, the first sentence. This is the only place on the page where a whole sentence is
   reliably read.
2. **It drops down the left edge.** Each stop is something that stands out from body text:
   a heading, a bold line, a button, a mono label in capitals, a large number. The eye
   reads the stop, takes in a few words to its right, and drops to the next one.
3. **It reads body copy only when a stop pulled it in.** A paragraph under a heading the
   reader did not care about is skipped whole. A paragraph with no heading is skipped
   whole.
4. **It recognises before it reads.** A company or school name (Infineon, UC Berkeley,
   SJSU), a GPA, a date, "winner", "2nd place", "240+ stars on GitHub": understood in one
   glance. A number with a unit from outside the reader's world ("38.84×", "≈200 ms /
   frame", "team of 5", "54 members") is not understood at all. The eye stops, gets
   nothing, and the stop is wasted; enough wasted stops and the reader leaves.
5. **On a phone there is only the left edge.** The thumb scrolls about one screen a
   second; anything that is not bold or large is a grey blur going past. A screen with no
   stop on it is a screen where the reader learns nothing.

Call the things the eye stops on **landmarks** and everything else **body**. The front
page then has one design rule: **every fact a recruiter needs is carried by a landmark,
in the order the eye will meet them, and nothing a recruiter cannot use is a landmark.**
Body copy exists for the reader who stopped, one sentence at a time, and the page must
still work if every line of it is skipped.

The recruiter's six questions, in the order the page should answer them: who is this,
where do they study and when do they graduate, when are they available, where have they
worked, what have they won, what is the GPA. Then two actions: get the résumé, see the
projects.

Depth is one click away, never on the page. The front page is the brief; every section
that has more to say offers exactly one link to where it lives: the work cards to their
project pages, "All ten projects" to `/work/`, the chip to the skills panel, Experience
to the datasheet's revision history, the footer to the whole datasheet. The project pages
are the optional depth Aadi likes; they stay as they are apart from their wayfinding and
the reel.

Body copy has three rules of its own:

- One sentence under a landmark (a fact's small line, a card's one-liner, a job's summary,
  the contact line), or one short paragraph where the section is the paragraph (the lead,
  About). It adds detail for the reader who stopped; it never holds a fact the landmarks
  do not already carry.
- Numbers in body copy obey rule 3 exactly as landmarks do. A skimmed sentence with "30
  students" or "54 members" in it is still an effort number the reader cannot judge.
- Nothing is bold inside body copy. If a word needs emphasis it is a landmark and belongs
  in the read below, or it does not need emphasis.

Heights stay in the table above as a sanity check: they are what the reader feels as
scrolling. If a page is over, find the section whose landmarks are too far apart and fix
that; do not shave words at random.

## The landmark read

The test is to read only the landmarks, top to bottom, as a stranger, and see what you
know. Issue 10 makes a script print this list from the built page; until it lands, the
regex in that issue does the same by hand.

**Fable1**, front page, build of 31 Oct 2026: **87 stops**, 13 of them status tags and 10
of them bold numbers. The run of bold items down the project table, which is what the eye
actually meets there, is: `VisionAssist · ≈200 ms / frame · Measured · Accordion · 240+ ★
· Repo · Rung · 38.84× · Measured · Alta · ≈1,200 Hz · Stated · GazeBoard · ≈8 ms ·
Observed · OSS Scout · 2 · Repo · ApexTracker · ≈525 · Repo · Echo · 0 · Repo · Temper · 6
· Repo · Clear Dispatch · 60 s · Repo`. The mono label lines under those rows say, among
other things:

```
Infineon Technologies, with De Anza College · Software lead · team of 5
UC Berkeley AI Hackathon 2026 · Sponsor Track winner (The Token Company) · Team of 4
Personal project · Solo
Cal Hacks 13.0 · 36 hours · Hardware and firmware lead · team of 4
PRs merged upstream (9.8k★ and 380★ repos)
unit tests, in daily use since Jan 2026
```

The eye stops on "0", "6" and "2" and learns nothing. The three facts that matter
(Infineon, Winner, 3.8 GPA) are there, but they are three stops out of eighty-seven, and
"Winner" sits beside "38.84× Measured".

**Fable2**, front page, the target read. The starred lines are what issue 10 checks for,
in this order; the others follow from issues 04, 05 and 07 as written:

```
kicker  Available for Summer 2027 internships · May to August 2027     *
kicker  Computer Engineering · SJSU · Class of 2028                    *
h1      Aaditya Desai                                                  *
button  Résumé PDF ↓                                                   *
button  See the work ↓                                                 *
b       28 skills, one per pin.                     (the chip card, phones only)
b       Infineon                                                       *
b       Hackathon winner                                               *
b       3.8 GPA                                                        *
h2      Selected work                                                  *
h3      VisionAssist                                                   *
small   Infineon Technologies · software lead · Apr to Jun 2026
h3      Accordion                                                      *
small   UC Berkeley AI Hackathon 2026 · Sponsor Track winner
h3      Rung                                                           *
small   Personal project · Sep to Oct 2026
h3      Alta                                                           *
small   Cal Hacks 13.0 · hardware and firmware lead · Oct 2026
h2      Experience                                                     *
h3      Research Intern and Technical Lead, VisionAssist
small   Infineon Technologies, with De Anza College                    *
h3      Teaching Assistant, ENGR 10: Introduction to Engineering
small   San José State University
h3      Teaching Assistant and Computer Science Tutor
small   De Anza College
h3      Co-Founder and Co-President
small   Applied Data Analytics Club, De Anza College
h2      Education                                                      *
h3      San José State University                                      *
h3      De Anza College
h3      Awards
b       Sponsor Track winner
b       2nd place
b       Top 10 at site
h3      Open source
h3      Certifications
h2      About
h2      Get in touch.                                                  *
button  aaditya.d.desai@gmail.com                                      *
button  Résumé ↗
button  GitHub ↗
button  LinkedIn ↗
```

Read that cold: the six questions are answered by the ninth stop, the first action (the
résumé) is the fourth, and the fifth tells the reader where to go next. Nothing in it
needs context. Nothing in it is an effort number. The only names
that recur are VisionAssist (a project, then a job) and San José State University (an
employer, then a school), which is the truth. The experience section's date column
(mono, left edge) is a landmark the eye also uses; the script does not list it because it
is a column, not a line.

What left, and where it went: every status tag and benchmark number, to the project
pages and the datasheet, where it keeps its tag; every team size, nowhere (Aadi's call:
they say nothing about what he did, on any page, so they leave the datasheet too);
"two weekly lab sections of 30 students" and "54 members", to the datasheet's `points`;
the toolbox, to the skills panel; coursework and the sixth, in-progress certification, to
the datasheet. What stayed, also Aadi's call: GitHub star counts ("240+ stars" in the
facts strip, "9.8k★" and "380★" in the open-source line), because anyone who has used
GitHub reads them instantly.

## Round 2: why the brief read small

Issues 01 to 12 were implemented as written and merged on 2 Nov 2026. The landmark read
matches the target list above exactly, every check passes, and the page is still wrong in
a way the plan did not measure: Aadi's reaction was that the landing page is "too small
now" and that the links and buttons are easy to miss. Both are faults of the spec, not of
the implementation, and this section is the fix. Measured on the round-1 build at
1440 x 900:

| | Round 1 | Round 2 target |
| --- | --- | --- |
| Share of text on `/` set at 13 px or smaller (characters, `main` and `footer`, SVG excluded) | 32 % | **15 % or less** |
| Sizes between the lead and the fine print | 76 → 26 → 13: nothing between 26 and 13 on the first screen | a scale with a step at every level (table below) |
| Buttons and inline actions | 13 px IBM Plex Mono, capitals: the same voice as the dates and venues | 16 px Archivo, weight 600, no capitals |
| Links on the first screen in the accent colour | 0 of 13; the only blue on the screen was the non-clickable "from the metal up" | one accent action per section, and nothing static in blue |
| Chip width | 360 px (Fable1: 460) | 460 px |
| Zones on the first screen | five: masthead, hero copy, chip, facts, the top of Selected work | two: the hero and the facts strip at the fold |
| Pictures of the work on `/` | none; four text cards | a frame of each featured project's figure |

Why it reads small, in order of weight:

1. **A third of the page is fine print.** Everything that is not a heading or a sentence
   is 12 or 13 px mono capitals: the availability pill, the eyebrow, both buttons, the
   Email · GitHub · LinkedIn line, the chip caption, the section intro lines, the venue
   lines on the cards, the dates and employers in Experience, the awards and
   certifications headers, the contact kicker, the footer. 32 % of the characters on the
   page are 13 px or smaller. The type floor (rule 13) was met and the page still reads
   as fine print because the floor was treated as the target.
2. **The scale drops too fast.** 76 px name, 26 px lead, then 13 px for everything a
   reader might click. Reference sites that feel comfortable (brittanychiang.com,
   leerob.com, joshwcomeau.com, rauno.me, emilkowalski.com) set their name between 32 and
   48 px and their links and buttons at 16 or 17 px, the same size as body copy or larger.
   Ours set the name twice as large and the actions half as large.
3. **Five zones on the first screen.** The compression block added to meet the 2,400 px
   ceiling pulled Selected work above the fold and shrank the chip to 360 px. Every
   reference site puts one thing on the first screen. The height ceiling was the wrong
   instrument for the same reason the word count was: it measures the page, not the
   reader. It becomes a sanity ceiling only (below).
4. **The site's best material is invisible from the landing page.** The project pages
   have interactive figures Aadi likes and recruiters respond to; the front page has four
   text cards that look like paragraphs with a border.

Why the links are missed:

1. **Labels and actions share one voice.** Mono capitals mean "metadata" everywhere on the
   site (dates, venues, figure labels), so the eye learns to skip them, and the buttons are
   set in the same voice.
2. **The accent is spent on decoration.** The one blue thing on the first screen is a
   phrase in the lead that does nothing when clicked. "See the work", the page's answer to
   "where do I go", is an outlined button in the same style as Email.
3. **The cards do not look clickable at rest.** A hairline border on paper, a 13 px arrow,
   and no picture.

### The type scale

Sizes at 1440; the `clamp()` in the issue gives the phone size. Mono is IBM Plex Mono,
sans is Archivo.

| Element | Round 1 | Round 2 |
| --- | --- | --- |
| Name (h1) | 76 | 64 |
| Lead | 26 / 500 | 24 / 500, max 32ch |
| Buttons (`.button`, every route) | 13 mono caps | 16 sans 600, no caps, 12 x 18 padding |
| Inline actions (Email · GitHub ↗ · LinkedIn ↗) | 13 mono | 16 sans 600 |
| Section call to action (`.cta`: Open the pin map, All ten projects, Full record in the datasheet) | 13 mono | 16 sans 600, accent |
| Availability pill, eyebrow (they answer three of the six questions) | 12 mono caps | 14 mono caps |
| Chip caption | 12 mono | 13 mono |
| Facts, big | 28 | 32 |
| Facts, small | 16 | 17 |
| Section heading (h2) | 34 | 40 |
| Section intro line | 13 mono | 16 sans, `--ink-2` |
| Card title (h3) | 22 | 26 |
| Card one-liner | 16 | 17 |
| Card venue line | 12 mono caps | 14 mono caps |
| Card index / arrow | 13 / 13 | 13 mono / 18 accent |
| Experience role (h3) | 17 / 600 | 18 / 700 |
| Experience employer, dates | 12 mono | 14 mono |
| Experience summary | 16 | 17 |
| School (h3) | 18 | 20 |
| Degree line, awards, open source, certifications | 16 | 17 |
| School place and dates (`.edu-meta`) | 12 mono | 14 mono |
| Awards / Open source / Certifications headers | 12 mono caps | 13 mono caps |
| About | 16 | 17 |
| Contact kicker | 12 mono caps, accent | 13 mono caps, `--ink-2` |
| Contact line | 17 | 18 |
| Footer line | 13 mono | 13 mono (fine print, allowed) |
| Masthead items | 14.5 sans 600 | 15 sans 600 |
| Masthead résumé button | 13 mono caps | 15 sans 600, outlined |

Mono has two sizes on purpose: metadata that carries a fact (availability, school and
year, a card's venue and date, an employer, a job's dates, a school's place and dates) is
14 px; labels that carry none (the chip caption, the Awards / Open source / Certifications
headers, the contact kicker, card indices, the footer line) are 13 px. Nothing is 12 px.
Rule 13's floors still hold; this table is the target for `/`, and `/work/` and `/skills/`
follow it for the elements they share (buttons, `.cta`, headings, mono labels).

### Two voices

Sans is for content and actions: headings, sentences, buttons, and any link a reader is
meant to click. Mono capitals are for metadata only: dates, venues, kickers, indices,
figure labels. On `/`, `/work/`, `/skills/` and a project page, nothing clickable is set
in mono capitals, apart from the controls inside a figure body (they are the instrument's
own buttons) and the footer's last line (fine print by design).

### Accent means clickable

`--accent` appears only on things a reader can click, with two exceptions: the live
indicator in a figure bar, which marks an interactive region, and the inside of a figure
body, where the figure uses it as a data colour. Nothing static is blue on a
recruiter-facing surface: not a phrase in the lead, not the contact kicker, not the
application-note number on a project page. Each section has exactly one accent call to
action, a `.cta` link in 16 px sans: the hero's "See the work ↓" (an accent-filled
button), the chip's "Open the pin map →", Selected work's "All ten projects →",
Experience's "Full record in the datasheet ↗", and the contact footer's email button. A
clickable card or row shows an 18 px accent arrow at rest. The datasheet keeps its section
numbers and kickers in accent; it is the long version and has its own conventions.

### The first screen belongs to the hero

At 1440 x 900 the first screen holds the masthead, the hero (copy on the left, the chip at
460 px on the right) and the facts strip at the fold, fully visible, and nothing of
Selected work beyond, at most, its heading. After that, one thing per screen: the cards,
then Experience, then Education and About, then Contact. Heights are a sanity ceiling, not
a target: `/` at 1440 x 900 is **3,600 px or less** (four screens; pictures on the cards
account for about 650 px of it) and at 390 x 844 **6,500 px or less**. Within those, the
instruments are the ones that measure the reader: every screen at 390 has at least two
landmarks on it, fine print is under 15 % of the text, and the squint test shows only
landmarks.

### Pictures on the cards

Each of the four featured cards gets a static frame of its project page's figure, rendered
once from the built site (the same way the Open Graph images are rendered, with a script
kept outside the repo because it needs Playwright) and saved as `public/cards/<slug>.png`.
The frame sits at the top of the card at 16:9, top-anchored, so the card reads as a thing
with a picture, a title, one line and a venue. The image is decorative inside a link that
already carries `aria-label`, so its `alt` is empty. The project pages are unchanged; the
figure on the card is the invitation to the interactive one.

### The landmark read, round 2

The `.cta` links are stops the eye uses, so `scripts/check-brief.mjs` prints them (issue
13). The required stops and their order do not change. The read gains three lines:

```
button  See the work ↓
cta     Open the pin map →                 (new, after the buttons)
b       28 skills, one per pin.
...
small   Cal Hacks 13.0 · hardware and firmware lead · Oct 2026
cta     All ten projects →                 (new, closes Selected work)
h2      Experience
cta     Full record in the datasheet ↗     (new, the section's one way down)
h3      Research Intern and Technical Lead, VisionAssist
```

### What round 2 does not change

The content, the order of sections, the landmark list, the masthead's items, the skills
panel, `/work/`, the project pages apart from the shared `.button` style and the
application-note number losing its blue, and the datasheet apart from the shared `.button`
style.

## Round 3: a portfolio on one page

Round 2 was implemented as specified (merged 4 Nov 2026, `f22da91`). Every number in the
round-2 table landed, and Aadi's reaction was that it is better and still not right:
"there is something about it that when I look at it I feel like it's not right", the
balance between density and readability is off, and the flow between places is confusing.
He asked for a fresh look as a recruiter. This is that look, and the plan that follows
from it. The project pages are not the problem; `/work/rung/` is the best page on the
site and knows exactly what it is. The front page does not.

### The recruiter's fifteen seconds, round-2 build, 1440 x 900

- **0 to 2 s.** The eye goes to the chip: the darkest, largest object on the screen, with a
  name on it, "AD2028". For a beat it reads as the person's handle. The name is found
  second, to the left. The name lost the first glance to a decoration.
- **2 to 5 s.** Top left, two lines of capitals before the name (availability, school).
  They read as a form. The lead, "I build from the metal up: an ARM64 JIT compiler,
  bare-metal firmware, on-device vision, and tools for AI agents", is four unrelated
  things, two of which a recruiter cannot place. The blue "See the work ↓" is the one
  element that says what to do, and it works.
- **5 to 10 s.** Facts strip: Infineon, Hackathon winner, 3.8 GPA: understood. Then four
  cards whose pictures are dense diagrams with 8 px labels, each cropped mid-row. Squinting
  at them yields "74,257 / 100,000 budget", a `STATED` tag, "38.84×": the status tags and
  benchmark numbers round 1 removed from the front page, back as pixels. The pictures read
  as busy dashboards, not as products.
- **10 to 15 s.** Experience, Education, Awards, Open source, Certifications, About,
  Contact, each the same shape: bold line, grey sentence, capitals. "Infineon" has now
  been read three times, "SJSU" four, "Summer 2027" four (masthead, pill, contact kicker,
  contact line), "hackathon winner" three. It is the résumé, which the reader already has,
  laid out wider. They stop.
- **The person this suggests.** Technically serious and unusually deep for a student;
  methodical; cares about craft (the chip, the figures, the datasheet conceit are all made
  with care). Also: has not decided what the one story is, and is anxious to show
  everything at once. Honest and thorough, and a résumé with a theme rather than a
  website.

### Why it still feels wrong, and why rounds 1 and 2 could not fix it

1. **One rhythm, repeated fifteen times.** Three facts, four cards, four jobs, two schools,
   awards, open source, certifications: fifteen instances of [bold line / grey sentence /
   mono capitals] at the same weight. When everything is medium emphasis nothing is
   emphasised, so the page is dense and unreadable at once. Round 2 made the small type
   larger, which turned fine print into medium print and made the sameness worse: the
   14 px capitals under each card wrap to two lines and shout as loud as the titles.
2. **No figure and ground.** Fable1 had the sheet, a paper card on a darker background,
   which gave the page an object to be. The brief removed it, so everything floats on one
   beige plane separated by hairlines: hairline cards holding hairline frames holding
   hairline grids.
3. **The page has no reason to exist.** Its sections are the résumé's sections in the
   résumé's order, and everything on it is in the PDF one click away. A personal site is
   for the thing the PDF cannot do: show the work.
4. **The two loudest things are the two densest.** The chip carries 28 pin labels and
   three lines of micro text where the eye lands first; the card frames are figures built
   to be read interactively at 600 px, shrunk to thumbnails. Both put dozens of
   unreadable fragments on the first screens.
5. **The flow is confusing because the first screen asks a question the page never
   answers.** "I build from the metal up: four things" raises "show me"; what follows is
   three résumé facts, pictures that cannot be read, then the résumé. Across routes, the
   four masthead items do three different things: Work opens a list page that repeats the
   front page, Skills opens a panel over the current page, Experience and Contact scroll.
   A reader cannot predict what a click will do.

Rounds 1 and 2 measured landmarks and type sizes. Both were real and both were fixed, and
the feeling did not change, because the fault is editorial and structural: what the page
is for, how many kinds of thing are on it, and whether it has a ground to stand on.

### Decisions

Aadi's constraints: keep the figure frames, add real photos and screenshots where a
project has them, keep clicking around to a minimum; the rest is the plan's call.

1. **One page for the recruiter.** Everything a recruiter needs is on `/`, in this order:
   hero, Work (all ten projects: four in full, six in brief), Experience (jobs, education,
   awards, open source, one line each), Contact with the About paragraph as the sign-off.
   `/work/` is deleted; the front page is the index. Depth stays one click away on
   `/work/<slug>/`, `/skills/` and `/datasheet/`.
2. **One behaviour per link.** Every masthead item goes to a place: Work → `/#work`,
   Experience → `/#experience`, Skills → `/skills/`, Contact → `/#contact`, Résumé → the
   PDF. The skills dialog is removed; the chip's pins link to `/skills/#pin-N`. No
   overlays anywhere.
3. **The ground comes back.** The front page sits on one paper sheet (the Fable1 `.sheet`)
   over the darker background. Sections open with a 2 px ink rule and a 40 px title, the
   datasheet's own device.
4. **The hero is the name, one sentence, three facts in one line, two buttons.** The two
   capitals lines become one sans line above the name (school, year) and one quiet sans
   line below the buttons (availability, with the green dot). The facts strip becomes a
   single line: **Infineon**, research intern and software lead · **Hackathon winner**, UC
   Berkeley AI Hackathon 2026 · **3.8 GPA**, Dean's Scholar. The hero's Email · GitHub ·
   LinkedIn line goes (they are the footer's buttons), and so does the masthead's own
   "Available Summer 2027" item; it was the fourth copy. The lead's wording does not
   change: it is the one sentence on the page that is Aadi's own, and rewriting it is his
   call, not the plan's.
5. **The chip goes quiet.** It stays in the hero at 420 px as the signature, with its pin
   labels, pin numbers and three fine centre lines hidden until the pointer is over it (or
   it has focus). The labels live on `/skills/`. The tooltips still work.
6. **Projects are rows, not cards.** Each of the four featured projects is one row: the
   figure frame at its natural aspect (never cropped) on the left at about half the width,
   and on the right the title with an accent arrow, the one-liner at 18 px, the venue line
   in sans (not capitals), and a small gallery of up to three real photos or screenshots
   from `PHOTOS`, each a link to the project page's "From the build". The six other
   projects follow as compact one-line rows. The frames keep their figure numbers; at this
   size they are a chart, not a claim, and the project page is one click away.
7. **Experience is one line per item, no summaries.** Dates, role, employer, as one
   three-column list; education, awards and open source follow in the same columns with
   their label in the mono column. Awards start at the second one: the hero already states
   the Sponsor Track win. Certifications leave the front page (they are in the datasheet
   and the PDF). About loses its heading and becomes the sign-off paragraph in the contact
   footer.
8. **Mono capitals shrink to their job**: dates, indices, figure bars, and the three
   sub-labels in Experience (Education, Awards, Open source). Venue lines, employers and
   section intros are sans.

### The landmark read, round 3

```
kicker  Computer Engineering · SJSU · Class of 2028                        *
h1      Aaditya Desai                                                      *
b       Infineon                                                           *
b       Hackathon winner                                                   *
b       3.8 GPA                                                            *
button  Résumé PDF ↓                                                       *
button  See the work ↓                                                     *
kicker  Available for Summer 2027 internships · May to August 2027         *
b       28 skills, one per pin.                        (the chip card, phones only)
cta     Open the pin map →
h2      Work                                                               *
h3      VisionAssist                                                       *
h3      Accordion                                                          *
h3      Rung                                                               *
h3      Alta                                                               *
b       GazeBoard · OSS Scout · ApexTracker · Echo · Temper · Clear Dispatch (six stops)
h2      Experience                                                         *
cta     Full record in the datasheet ↗
h3      Research Intern and Technical Lead, VisionAssist
h3      Teaching Assistant, ENGR 10: Introduction to Engineering
h3      Teaching Assistant and Computer Science Tutor
h3      Co-Founder and Co-President
h3      Education                                                          *
b       San José State University                                          *
b       De Anza College
h3      Awards
b       2nd place · Top 10 at site · Most Valuable Peer                    (three stops)
h3      Open source
b       Soup · fusioncore                                                  (two stops)
h2      Get in touch.                                                      *
button  aaditya.d.desai@gmail.com                                          *
button  Résumé ↗ · GitHub ↗ · LinkedIn ↗
```

About 45 stops; the venue lines and employers are no longer stops because they are no
longer capitals, and the Experience dates and the three labels are a mono column the eye
uses but the script does not list. The six questions are answered by the eighth stop, as
before.

### Ceilings and instruments, round 3

The rows are tall because the frames are not cropped, so the height ceilings move: `/` at
1440 x 900 is **4,800 px or less** (about five screens, one project per screen) and at
390 x 844 **5,800 px or less** (round 2 measured 5,930). Fine print stays at 15 % or less
of the text. The accent audit still returns `[]`. Landmarks per screen at 390 becomes "1
or more, and a screen with only one holds a figure frame" (a frame at natural aspect can
fill most of a phone screen). Two new instruments, in issue 21: the **repeat count** (how
many times "Infineon", "SJSU or San José State", "Summer 2027", "UC Berkeley AI
Hackathon" and "winner" appear in the text of `/`; round 2: 4, 4, 3, 3, 3; target: 3, 3, 2,
2, 2 or fewer, each remaining repeat with a reason) and the **shape count** (how many
visually distinct kinds of block the page has; target: hero, project row, compact row,
experience line, contact, and no others).

### What round 3 removes

`/work/` and its OG image; the skills dialog, `data-skills` and `skills:open`; the facts
strip; the masthead availability item; the section intro lines in capitals; the card venue
lines in capitals; Experience summaries; Certifications on `/`; the About heading; the
hero's Email · GitHub ↗ · LinkedIn ↗ line (the three are buttons in the footer); the
Sponsor Track line in Awards (the hero states the win); the city column and summaries in
Experience; and the fields that only served them (`FACTS[].small`, `BRIEF.moreWork`,
`EXPERIENCE[].summary`, `CERTS_BRIEF`).

## The one-paragraph version

The front page becomes a brief a recruiter can finish: availability, name, one sentence,
two buttons, the chip, three facts in plain words (Infineon, hackathon winner, 3.8 GPA),
four featured projects as cards, one line per job, two lines of education, three awards,
one short paragraph, contact. No status tags, no benchmark numbers, no team sizes or
effort counts, no stack lists. The
chip stays in the hero on every screen size, small and label-free on phones, and becomes
the door to a **skills panel**: a pop-up (native `<dialog>`) with the full interactive
chip beside a plain, grouped list of the 28 skills, each naming the projects that used it.
The panel opens from a "Skills" item in the masthead on every route and from the chip
itself; `/skills/` is the same content as a page, for links and for readers without
JavaScript. The hero's second button is "See the work ↓", so the first screen says where
to go. A new `/work/` page lists all ten projects, so "Work" has a real destination and
project pages have a parent. The masthead shows the same four items everywhere: Work,
Experience, Skills, Contact, plus the resume, set in 14.5 px sans instead of 11.5 px mono
capitals so it reads as navigation. Project pages gain a breadcrumb row at the
top and previous/next cards at the bottom, and their header line names the venue and date
instead of the role and team size. The highlights reel on project pages is
tightened so beats sit closer together, and on desktop the reel figure becomes free to
play with after the last beat instead of being repeated below. Everything with a status
tag, a benchmark number or a long list still exists: on the project pages and in the
datasheet, where the reader who wants it goes on purpose.

## The reader model

| Reader | Time | Needs | Where they land |
| --- | --- | --- | --- |
| Recruiter or screener | 30 s | Name, school and year, availability, company name, award, GPA, contact, and a sense that the projects are real | `/` from the resume PDF, LinkedIn, GitHub profile |
| Hiring engineer or interviewer | 5 to 10 min | Depth on one project: what he built, what he measured, what doesn't work; then the next project | `/work/<slug>/` from a README, Devpost, a cover letter, or `/work/` |
| Someone who wants all of it | 20 min | Everything, printable, cross-referenced | `/datasheet/` from footers and project pages |

Each layer links down to the next and back up to the one above. No layer repeats the one
below it.

## Routes

| Route | Content | Client JS budget (uncompressed, excluding Next runtime) | Issue |
| --- | --- | --- | --- |
| `/` | Hiring brief | 80 KB. `Chip` in the hero and the skills dialog shell are the only client code; the skills list loads on first open. | 04, 05, 07 |
| `/work/` | Removed in round 3 (issue 17); `/` lists all ten projects | | 06, 17 |
| `/work/<slug>/` | One project, 10 pages | 180 KB. One figure plus the `Reel`. | 08, 09 |
| `/skills/` | The pin map: chip plus grouped list | 120 KB. | 02 |
| `/datasheet/` | Full AD2028 datasheet, unchanged | 500 KB. | 03 (masthead only) |
| `/404` | Not found | | 11 |

`scripts/check-budget.mjs` (extended in issue 10) enforces the budgeted rows in CI.

## Rules that apply to every issue

Fable1's ten rules still apply. They are repeated here with the Fable2 changes marked.
Where a rule names `/work/`, that route was removed in round 3 (issue 17): `/` is the
index, and the rule applies to `/`.

1. **Content is visible without JavaScript.** Nothing ships hidden waiting for a script to
   reveal it. Motion is layered on top of visible content. No `opacity: 0` plus
   IntersectionObserver reveals. No scroll-position-driven interpolation. No scroll-jacking.
   **Fable2 addition**: no overlays. Rounds 1 and 2 allowed one (the skills `<dialog>`,
   with `/skills/` as its static twin); round 3 removed it (rule 17), and `/skills/` is the
   only skills surface.
2. **`prefers-reduced-motion: reduce` turns off every transition and animation**, and the
   page is still complete. Use `useReducedMotion()` from `app/figures/hooks.ts`.
3. **Status tags and benchmark numbers stay on `/work/<slug>/` and `/datasheet/`, and
   leave the front page.** Every measured or benchmarked number on a project page or the
   datasheet still carries `Measured`, `Observed`, `Single run`, `Repo` or `Stated`. The
   front page (`/`) and the index pages (`/work/`, `/skills/`) carry **no benchmark
   numbers at all**: no ratios, no latencies, no sample rates. **Effort and scale numbers
   appear on no recruiter-facing surface**, which means `/`, `/work/`, `/skills/` and the
   header line of `/work/<slug>/`: no member, student, hour, PR, commit, line or test
   counts. They say nothing about what he did and they cost the reader a stop. **Team
   sizes ("team of 4", "five-person", "solo") appear nowhere on the site**, the datasheet
   included (issue 01 removes them). A number is allowed on recruiter-facing surfaces only
   when a recruiter can judge it without context: a GPA, a date, a place in a
   competition, a GitHub star count, the count of things on this site (ten projects, 28
   skills). The datasheet is the long version and keeps `points` as they are; project
   pages keep their tagged headline numbers below the header.
4. **Facts come only from `app/content.ts`.** New fields added in issue 01 are rephrasings
   and selections of facts already in that file; they introduce nothing. If an issue needs
   a fact that isn't there, write `TODO(aadi): <what is missing>` in the code and stop; do
   not estimate or invent.
5. **Voice**: first person, specific, no em dashes anywhere (use a comma, a colon, or a
   new sentence), never "passionate", never "innovative", never "awkward constraints".
   Numbers describe what was built or measured, never effort.
6. **Design system stays**: Archivo (variable width) for text, IBM Plex Mono for labels,
   the tokens in `app/globals.css` (`--paper`, `--ink`, `--accent` `#1f45ff`, `--hot`,
   `--ok`, `--amber`). Accent means "look here", never decoration.
7. **Accessibility**: every interactive element reachable by keyboard with visible focus,
   every image has alt text, every figure has a text equivalent, colour never carries
   meaning alone.
8. **Mobile first**: design at 390 px, then 768, then 1440. Nothing scrolls sideways.
9. **One pull request per issue**, branched from `Fable2` as `fable2/NN-slug`, targeting
   `Fable2`. Don't touch files outside the issue's "Files" list without saying so in the
   PR description. Never modify `Fable1`, `main`, or any other branch. `Fable1` is the
   archived version the plan starts from; it must stay exactly as it is.
10. **Do not add dependencies.** Nothing in this plan needs one.
11. **Fable2 addition: the front page is built for a scan, not a read.** "How a recruiter
    reads a page" above is the model. Every fact in the recruiter's six questions is
    carried by a landmark (a heading, a bold line, a button, a kicker, a mono label) in
    the order given in "The landmark read". Body copy under a landmark is one sentence,
    carries no fact the landmarks do not, and the page still works if all of it is
    skipped. Nothing is bold inside body copy. `scripts/check-brief.mjs` (issue 10) prints
    the landmark read of the built page and checks that the starred stops are present in
    order, that there are no status tags, that no banned number pattern appears anywhere
    in `<main>` or `<footer>`, and that no `<b>` sits inside a `<p>`. If your issue adds
    a landmark, it must answer one of the six questions or name a section; otherwise it
    is body and is not bold.
12. **Fable2 addition: one navigation.** The masthead shows the same items on every route
    (issue 03). No route adds its own items to it. Route-specific wayfinding (breadcrumbs,
    previous/next) lives in the page body, never in the masthead.
13. **Fable2 addition: a type floor.** On `/`, `/work/`, `/skills/` and `/work/<slug>/`:
    body copy is 16 px or larger, secondary lines 15 px or larger, mono labels 12 px or
    larger, navigation text (masthead items, breadcrumbs, footer links) 13 px or larger
    and the masthead items 14.5 px sans. Nothing that carries a fact is set in `--muted`;
    `--muted` is for decoration and hints only. The datasheet keeps its own smaller
    table type; it is the long version and says so. These are floors; "Round 2: the type
    scale" is the target.
14. **Round 2: two voices.** Sans (Archivo) is for content and actions: headings, body,
    buttons, and every link a reader is meant to click. Mono capitals are for metadata
    only: dates, venues, kickers, indices, figure labels. On `/`, `/work/`, `/skills/` and
    `/work/<slug>/`, nothing clickable is set in mono capitals, apart from controls inside
    a figure body and the footer's last line. Buttons are 16 px sans weight 600 on every
    route (`.button` is shared, the datasheet included).
15. **Round 2: accent means clickable.** `--accent` and `--accent-ink` appear only on
    things a reader can click, plus the live indicator in a figure bar and the inside of
    a figure body. Nothing static is
    blue on a recruiter-facing surface. Each section has one accent call to action
    (`.cta`, 16 px sans 600); every clickable card or row shows an 18 px accent arrow at
    rest. The audit in issue 16 returns an empty list on `/`, `/work/`, `/skills/` and
    `/work/rung/`. The datasheet keeps its own accent conventions.
16. **Round 2: the first screen belongs to the hero.** At 1440 x 900 the first screen is
    the masthead, the hero with the chip at 460 px, and the facts strip at the fold; the
    type scale in "Round 2" is the target for `/`; fine print (13 px or smaller) is 15 %
    or less of the text on `/`; `/` is 3,600 px or less at 1440 x 900 and 6,500 px or less
    at 390 x 844; every screen at 390 has at least two landmarks on it. **Round 3 moves
    the height ceilings to 4,800 and 5,800 px and asks for one or more landmarks per
    screen at 390, where a screen with only one holds a figure frame**; the other
    instruments stand.
17. **Round 3: one page, one behaviour.** Everything a recruiter needs is on `/`. There
    are no index pages besides `/` and no overlays; a masthead item or a link goes to a
    place and does the same thing on every route. The destinations are `/`, `/skills/`,
    `/datasheet/` and `/work/<slug>/`.
18. **Round 3: one rhythm per section, not per item.** A section may repeat one block
    shape (a project row, an experience line), and the page has at most five block shapes
    in total. Venue lines, employers and intros are sans body text. Mono capitals are for
    dates, indices, figure bars and the three sub-labels in Experience.
19. **Round 3: pictures are pictures.** A figure frame is shown at its natural aspect,
    never cropped. Real photos and screenshots appear as thumbnails that link to the
    project page's photos. No picture is smaller than 96 px on its short side.

## Where things come from

| Need | Source | Notes |
| --- | --- | --- |
| Everything | this branch, as merged from `Fable1` | `app/`, `scripts/`, `public/` |
| Project facts, specs, errata, photos, pins | `app/content.ts` | issue 01 adds fields; nothing is removed that the datasheet uses |
| Fable1's component contracts | `docs/plan/issues/` | `Reel` (07), `Masthead` (13), `Chip` props (03), `check-budget.mjs` (14) |
| Aadi's full record | `aaditya-master-reference.html`, kept **outside this repo** (private; on Aadi's machine at `~/Desktop/ExtraCuricular/portfolio/`) | the source of truth for any fact dispute; never commit it, the repo is public |

## Order of work

```
Phase A  content            01 brief content fields
Phase B  structure          02 skills map, /skills/ and the dialog      03 masthead: one nav       (parallel, both need 01)
Phase C  front page         04 hero and facts   05 selected work   07 experience, education, about, contact   (parallel; need 01, 02, 03)
         index              06 /work/ page                                                                      (needs 01, 03)
Phase D  project pages      08 wayfinding (needs 03, 06)        09 reel: tighten and free (needs nothing)      (parallel)
Phase E  enforcement        10 brief check and CI (needs 04, 05, 07)            11 metadata, OG, sitemap (needs 02, 06)
Phase F  launch             12 QA and launch (needs everything)
Phase G  round 2            13 voice: sans actions, accent means clickable    (needs 12 merged)
                            14 first screen and scale                         (needs 13)
                            15 a picture on each work card                    (needs 14)
                            16 QA, round 2, then the pull request to main      (needs 13, 14, 15; the manager runs it)
Phase H  round 3            17 one behaviour per link: no dialog, no index page (needs 16 merged)
                            18 ground and hero: the sheet, the quiet chip, one facts line (needs 17)
                            19 one page for the work: rows, galleries, compact rows; /work/ deleted (needs 18)
                            20 experience in brief, and the sign-off (needs 19)
                            21 QA, round 3, then the pull request to main (needs 17 to 20; the manager runs it)
```

Dependencies: 02 and 03 need 01. 04 needs 01, 02, 03. 05 needs 01, 03 (and links to `/work/`
from 06, which must be merged before 12). 06 needs 01, 03. 07 needs 01. 08 needs 03 and 06.
09 needs nothing and can start on day one. 10 needs 04, 05, 07. 11 needs 02 and 06. 12
needs everything else.

Parallel-safe sets: {02, 03, 09} after 01; {04, 05, 06, 07} after 02 and 03; {08, 10, 11}
after their dependencies.

Round 2 is sequential: 13, then 14, then 15, then 16. All three touch `app/globals.css`
in the same sections and 14 and 15 both touch the card styles; running them in parallel
would mean resolving conflicts in CSS by hand. Round 3 is sequential for the same reason:
17, 18, 19, 20, then 21. The pull request to `main` is opened at the end of 21.

## Definition of done, every issue

- `npm run lint`, `npm run build` and `npm run budget` are clean. From issue 10 onward,
  `npm run brief` too. From issue 13 onward, the accent audit and the fine-print share
  snippets in issue 16, run on `/` at 1440 x 900, with the results pasted in the PR. From
  issue 17 onward, the heights and the repeat count from issue 21 too. For issues 04, 05 and 07, paste the landmark read of `/` into the
  PR (the script prints it; before issue 10, the regex in that issue's spec does).
- Checked at 390, 768 and 1440 px: `npm run build && npx serve out` and open the route.
  If `agent-browser` is available, take screenshots at those widths and attach them.
- Keyboard pass: Tab through the page; every control reachable, focus visible.
- Reduced-motion pass: with the OS setting on, nothing moves and nothing is missing.
- No-JS pass: with JavaScript disabled, every word of content is readable and every link
  goes somewhere real.
- No new facts. Any `TODO(aadi):` comments are listed in the PR description.
- The PR description states what was built, what was checked, and what was skipped.

## Working on an issue with a subagent

To run the whole plan, give an Opus session `docs/fable2/MANAGER-PROMPT.md`; it manages
and reviews, and dispatches one Sonnet subagent per issue. For a single issue by hand, use
`docs/fable2/PROMPT-TEMPLATE.md`. Give the subagent exactly one issue file, the rules
section above, and the paths it will touch. Ask for a PR, not a direct commit to `Fable2`.
