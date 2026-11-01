# Briefing a subagent on one issue

Copy this, fill the three blanks, and hand it to the implementer. Keep it to one issue.

---

You are implementing one issue of the Fable2 plan for aadityad.dev, a Next.js 16 static
export (output: "export", trailingSlash: true) deployed to GitHub Pages.

**Repository**: <absolute path to the Fable2 checkout>
**Issue**: read `docs/fable2/issues/<NN-slug>.md` in full before touching anything.
**Rules**: read the "Rules that apply to every issue" and "Definition of done" sections
of `docs/fable2/README.md`. They are not optional. Rule 1 (content visible without JS),
rule 3 (no status tags, benchmark numbers, team sizes or effort counts on the front page,
`/work/`, `/skills/` or a project page header), rule 4 (no invented facts or sentences) and
rule 11 (facts live in landmarks; body copy is one sentence with nothing bold in it) are
the ones most often broken.

Work only on a branch named `fable2/<NN-slug>` cut from `Fable2`. Do not modify any other
branch; `Fable1` in particular is an archive and must not change. Do not add dependencies.

Before you start, read the files listed under "Files" in the issue, and the "Source
material" files it points to (use `git show <branch>:<path>` for files on other
branches). Do not read the whole repository.

Build exactly what the issue specifies. Where the issue gives copy, use it verbatim; where
it does not, use a field from `app/content.ts` and never write a sentence of your own.
Where it gives a component contract (props, class names, data attributes, events), match
it exactly; other issues depend on those names. Where something is unspecified and you
must choose, choose the simplest option that meets the acceptance criteria and say what
you chose in the PR description.

When you need a fact that is not in `app/content.ts`, write `// TODO(aadi): <what is
missing>` and keep going. Never estimate a number.

When done:
1. `npm run lint`, `npm run build` and `npm run budget` must pass. Run `npm run brief` if
   it exists.
2. Serve `out/` (`npx serve out`) and check the route at 390, 768 and 1440 px wide.
   Check with JavaScript disabled. Check with reduced motion on.
3. Open a pull request against `Fable2` titled `<NN> <issue title>`. The description
   lists: what you built, every acceptance criterion with pass or fail, what you checked
   and how, anything skipped, every `TODO(aadi)` you left, and any file you touched that
   the issue did not list.

Do not start the next issue.
