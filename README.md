# OMC 2.0

Redesign of [bayuharlanpriangga/OMC](https://github.com/bayuharlanpriangga/OMC)
following the 15-phase AI-driven roadmap in the design spec.

**👉 Start with [`STATUS.md`](./STATUS.md)** — tracks which phase is done,
which is next, and what any AI agent (or you) needs to read before
continuing work. This repo currently holds **Phase 01 — Baseline &
Extraction** only. See `docs/ARCHITECTURE.md` for the architecture map /
target structure / migration rules that later phases must follow.

## Quick start

```bash
npm install
npm test           # run regression suite (vitest)
npm run lint        # lint src/core + tests + scripts
npm run fixtures:gen  # regenerate tests/fixtures/engine-snapshots.json
```

## What's here

- `src/core/engine.js` — the calculation engine (astrology, BaZi, Human
  Design, Zi Wei, numerology, cross-system fusion), extracted verbatim
  from the legacy monolith. Pure functions, no DOM.
- `src/legacy/index.html` — frozen, unmodified copy of the original repo's
  `index.html`, kept for reference/parity checks. Not imported by anything.
- `tests/regression.test.js` + `tests/fixtures/engine-snapshots.json` —
  proof the extraction didn't change behavior.
- `docs/ARCHITECTURE.md` — screen inventory, dependency map, target `src/`
  layout, and migration rules for phases 02–15.
- `docs/KNOWN_APPROXIMATIONS.md` — calculation assumptions inherited from
  the legacy engine.

## What's NOT here yet

Everything UI/rendering-related (design tokens, shell, pages, canvas
renderers, input widgets) — still lives only in `src/legacy/index.html`,
to be migrated starting Phase 02 per the roadmap. Phase 01's explicit
boundary is "do not redesign UI or implement new intelligence."
