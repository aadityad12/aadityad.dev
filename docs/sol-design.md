# Sol: the constraint lab

A standalone portfolio direction on `Sol`. The existing deployment still targets `main`.

## Design

Warm white, precise cobalt, an expressive serif, and quiet technical labels. The signature is an exploded system illustration that changes between memory, runtime, and hardware constraints. The project work is the spectacle, not something a visitor has to navigate around.

Five working exhibits lead to five statically exported case studies:

- **Accordion:** fold and restore a sample session without deleting stored context.
- **Rung:** explore committed, same-session benchmark results.
- **GazeBoard:** try dwell selection, with accessible click and keyboard alternatives. No camera or eye-tracking claim.
- **VisionAssist:** inspect the actual prototype and its local processing pipeline.
- **ApexTracker:** interact with a small, local-only habit interface.

Each case study covers the problem, architecture, personal contribution, engineering decisions, result, and limitations. Additional projects use native disclosure elements. A native dialog provides a 30-second recruiter overview via the header or `Cmd/Ctrl+K`.

## Content provenance

The master reference is authoritative for older claims. Newer Rung figures were checked against the public README on October 29, 2026: `fib` is 4.54× faster than the optimized register VM in the same interleaved session. Neither the older 22.64× figure nor an unqualified language-wide speedup is used.

GazeBoard’s README explicitly does not substantiate 8 ms inference, 15+ FPS, or a 478-point face mesh. These claims are intentionally absent. All interactive exhibits identify their illustrative or recorded nature.

## Reference research

These informed principles, not copied layouts or code:

- [Rauno Freiberg](https://rauno.me/): deliberate details and interaction as evidence.
- [Emil Kowalski](https://emilkowal.ski/): restrained motion and direct product presentation.
- [Paco Coursey](https://paco.me/): make the shipped work easy to reach.
- [Josh W. Comeau](https://www.joshwcomeau.com/): explain technical ideas through interaction.
- [Lynn Fisher](https://lynnandtonic.com/): a coherent personal visual language.

## Local use

```sh
npm run dev
npm run lint
npm run build
```

The output is a normal GitHub Pages-compatible Next.js static export. No new runtime dependency, backend, analytics, external API key, or camera access is required. Content remains visible without JavaScript; reduced-motion preferences disable nonessential motion.

## Validation

- Clean-install ESLint, TypeScript, and production static export passed.
- 63 browser assertions passed, covering all six pages at 320, 390, 768, 1024, and 1440 pixels, internal links and assets, project interactions, keyboard controls, the mobile menu, the overview dialog, and actual screenshot loading.
- Automated WCAG 2 A/AA checks reported zero violations on the home page and all five case studies. SVG overlap and decorative-glyph checks still require visual judgment and were reviewed; this is not a claim of formal accessibility certification.
- Reduced-motion behavior and server-rendered primary content were checked.

Clean-install builds passed both in an isolated copy and in the working checkout. Shared dependencies changed during validation; `npm ci` restored the checkout, and its lint and production build then passed again. The source and lockfile were unchanged by that environmental issue.
