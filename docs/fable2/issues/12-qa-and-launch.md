# 12 · QA and launch checklist

**Phase**: F · **Size**: M · **Depends on**: everything else · **Run by the manager, not a subagent**

## Goal

Ship `Fable2` to `main`. This is a checklist with evidence, not new code; fixes go in
small follow-up PRs against `Fable2`.

## The recruiter test (do this first)

Three passes, in this order. The model behind them is "How a recruiter reads a page" in
`docs/fable2/README.md`.

1. **The landmark read.** Run `npm run brief` and read the printed list top to bottom as a
   stranger, without looking at the page. Can you answer the six questions (name, school
   and year, availability, company, award, GPA) from the list alone? Is there any stop
   you do not understand, or that tells you nothing? Does anything repeat? Compare with
   the target read in the README; every difference is a finding.
2. **The squint test.** Open `/` at 1440 x 900 and at 390 x 844, zoom the browser to 50 %
   (or blur the screenshot) so body copy becomes grey texture and only large, bold and
   mono-capital type stays legible. Scroll at reading speed. What is legible should be the
   landmark read and nothing else; if a line of body copy is still legible, it is styled
   as a landmark and should not be. If a whole screen goes by at 390 with nothing legible
   on it, that section's landmarks are too far apart.
3. **The thirty-second test.** Fresh eyes, normal zoom, start a timer. In 30 seconds, can
   you answer all six without clicking? Then click once and find all ten projects. Then
   from any project page, get to the next project, to all projects, and home. If any step
   needs thought, open an issue against `Fable2` with a screenshot and what you expected.

## Checks (attach screenshots or output for each)

### Content
- [ ] Read every word on `/`, `/work/`, `/skills/`, all ten `/work/` pages and `/datasheet/` once. Fix typos in `content.ts`.
- [ ] `grep -rn "—" app/ docs/fable2/` returns nothing.
- [ ] `grep -rni "passionate\|innovative\|awkward constraint" app/content.ts` returns nothing.
- [ ] `npm run brief` passes; paste the landmark read in the PR.
- [ ] Nothing on `/`, `/work/`, `/skills/` or any project page's header line says "team of", "Solo", or gives a count of students, members, hours, stars, PRs or commits (the script covers the first three pages; check the ten header lines with the one-liner in issue 08).
- [ ] `grep -c 'class="tag' out/index.html out/work/index.html out/skills/index.html` is 0 for all three; `out/work/rung/index.html` and `out/datasheet/index.html` still have tags.
- [ ] Every `TODO(aadi)` in the repo is resolved or listed in the PR for Aadi to decide.

### Rendering
- [ ] Screenshots at 390, 768, 1440 of `/`, `/work/`, `/skills/`, `/work/rung/`, `/work/visionassist/`, `/datasheet/`, `/nope/`, and the skills panel open over `/` and over `/work/rung/`.
- [ ] `/` height at 1440 x 900 ≤ 2,400 px and at 390 x 844 ≤ 4,400 px. Record both.
- [ ] `/work/rung/` height at 1440 x 900 is at least 1,200 px less than Fable1's 4,360 px.
- [ ] No horizontal scrollbar at 390 on any route.
- [ ] Fonts load; nothing inverts under `prefers-color-scheme: dark`.

### Behaviour
- [ ] JavaScript disabled: `/`, `/work/`, `/skills/`, one project page and `/datasheet/` are fully readable; the Skills link and the chip card go to `/skills/`.
- [ ] Reduced motion: nothing moves on `/`; the panel appears without sliding; the reel switches instantly.
- [ ] Keyboard only: Tab to the hero chip, arrow to a pin, Enter opens the panel on that pin, Escape closes it and focus is back on the pin. Tab through the masthead, the cards, the footer cards on a project page, the menu at 390.
- [ ] Screen reader spot check (VoiceOver): hero reads availability first; the facts list reads three items; the work cards read "title: one-liner"; the dialog announces "Pin map".
- [ ] The masthead shows the same four items on every route; `aria-current` is right on each.
- [ ] J/K on a project page match the footer cards; J/K on the datasheet page the sheets.
- [ ] `/#skills` and `/work/rung/#skills` open the panel on load; Back closes it.
- [ ] Every external link opens in a new tab with `rel="noreferrer"`; every internal link stays in the tab.
- [ ] `/work/nope/` serves the 404 page.

### Performance
- [ ] `npm run budget` passes for all five routes.
- [ ] Lighthouse on `/` (mobile): Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] Lighthouse on `/work/rung/` and `/skills/` (mobile): Performance ≥ 90.
- [ ] LCP on `/` is the `h1` or the lead, not an image.

### Metadata
- [ ] Preview `https://aadityad.dev/`, `/work/`, `/skills/`, `/work/accordion/` in a Slack or LinkedIn preview (or opengraph.xyz): title, description, image correct.
- [ ] `sitemap.xml` lists 14 URLs; `robots.txt` reachable.

## Launch

1. Open a PR `Fable2` → `main` titled "Fable2: a shorter front page and one navigation".
   The description links `docs/fable2/README.md` and lists the issues merged.
2. After merge, watch `pages.yml` deploy; open `https://aadityad.dev/` and repeat the
   recruiter test and the metadata checks against production.
3. **Aadi, by hand** (the agent must not do these): confirm the résumé PDF's site link;
   point the Accordion README author line at `/work/accordion/`; Devpost entries at their
   `/work/` pages; GitHub profile README and LinkedIn "Website" at `aadityad.dev`.
4. Delete nothing. `Fable1` stays as the archived version, as do `Opus-Map`,
   `Opus-Factory`, `Sol`, `Argon`, `Grok`, `Kimi2`.
