# Open Graph images

`scripts/og/render.mjs` renders `public/og/home.png` and one `public/og/work/<id>.png` per project (1200 x 630), reading titles and hooks from `app/content.ts` as text.
It needs `playwright-core` in a folder outside the repo, and the installed Google Chrome, because it launches `channel: "chrome"`.
Run it from the repo root with `OG_PLAYWRIGHT=/path/to/folder/with/node_modules node scripts/og/render.mjs`.
Google Fonts is loaded over the network, so run it online.
After a new project is added to `NOTES`, run it again and commit the new PNG; delete PNGs for removed projects by hand.
