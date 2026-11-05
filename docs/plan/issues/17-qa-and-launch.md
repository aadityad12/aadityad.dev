# 17 · QA and launch checklist

**Phase**: F · **Size**: M · **Depends on**: everything else

## Goal

Ship `Fable1` to `main` and update the links that point at the site. This issue is a
checklist with evidence, not new code (fixes found here go in small follow-up PRs).

## Checks (attach screenshots or output for each)

### Content
- [ ] Read every word on `/`, all ten `/work/` pages and `/datasheet/` once, out loud if it helps. Fix typos in `content.ts`.
- [ ] `grep -rn "—" app/ docs/plan/*.md` returns nothing (no em dashes).
- [ ] `grep -rni "passionate\|innovative\|awkward constraint\|Team of 3\b.*accordion\|attribution view\|478\|DigitalOcean\|Operating Systems\|\bJava\b" app/content.ts` returns nothing.
- [ ] Every `TODO(aadi)` in the repo is resolved or listed in the PR for Aadi to decide.
- [ ] Rung and Alta numbers match their repos today (re-check; repos move).

### Rendering
- [ ] Screenshots at 390, 768, 1440 of `/`, `/work/rung/`, `/work/visionassist/`, `/datasheet/`, `/map/` (if built), `/404`.
- [ ] No horizontal scrollbar at 390 on any route.
- [ ] Fonts load (Archivo and Plex Mono visible, no fallback flash longer than a frame).
- [ ] Dark-mode: the site is light-only by design; confirm nothing inverts under `prefers-color-scheme: dark`.

### Behaviour
- [ ] JavaScript disabled: `/`, one work page, `/datasheet/` all fully readable.
- [ ] Reduced motion: nothing moves on `/`, the Reel switches instantly, figures don't animate.
- [ ] Keyboard only: reach and operate the chip, the table, the Reel's button, a figure, the menu at 390 px.
- [ ] Screen reader spot check (VoiceOver): hero reads availability first; project rows read "title: one-liner".
- [ ] Every external link opens in a new tab with `rel="noreferrer"`; every internal link stays in the tab.
- [ ] 404 page works for `/work/nope/` (GitHub Pages serves `404.html`).

### Performance
- [ ] `npm run budget` passes.
- [ ] Lighthouse on `/` (mobile preset): Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] Lighthouse on `/work/rung/` (mobile): Performance ≥ 90.
- [ ] Largest Contentful Paint on `/` is the `h1` or the lead paragraph, not an image.

### Metadata
- [ ] Paste `https://aadityad.dev/`, `/work/accordion/`, `/datasheet/` into a Slack or LinkedIn preview (or opengraph.xyz): title, description and image correct.
- [ ] `sitemap.xml` and `robots.txt` reachable after deploy.

## Launch

1. Open a PR `Fable1` → `main` titled "Fable1: front page, project pages, datasheet". The
   description links `docs/plan/README.md` and lists the issues merged.
2. After merge, watch `pages.yml` deploy; open `https://aadityad.dev/` and repeat the
   metadata checks against production.
3. **Aadi, by hand** (the agent must not do these): update the résumé PDF's site link if
   it points at a section anchor; add `/work/accordion/` to the Accordion README author
   line; point Devpost entries at their `/work/` pages; update the GitHub profile README
   and LinkedIn "Website" to `aadityad.dev`.
4. Delete nothing. `Opus-Map`, `Opus-Factory`, `Sol`, `Argon`, `Grok`, `Kimi2` stay as
   archived branches.
