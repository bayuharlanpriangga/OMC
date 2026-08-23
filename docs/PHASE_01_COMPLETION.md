# Phase 01 — Baseline & Extraction: Completion Report

Following the roadmap's Phase Completion Template (§3).

PHASE STATUS
- Build: PASS (`node --check src/core/engine.js`; module imports cleanly under Node ESM)
- Tests: PASS (15/15 — `npm test`)
- Regression: PASS (4 legacy `VALIDATION_CASES` re-verified verbatim + 8 full-object snapshot fixtures, 0 diffs)
- Responsive: N/A — no UI touched this phase (explicitly out of scope)
- Accessibility: N/A — no UI touched this phase (explicitly out of scope)
- Scope violations: NONE
- Changed contracts: NONE — `computeChart()` signature and return shape
  are byte-identical to legacy. One dead no-op removed (duplicate
  `lonToLine`, identical body) — does not change any output.
- Known limitations:
  - Only the DOM-free calculation core was extracted (legacy lines
    1813–3671). Rendering, page orchestration, navigation, and input
    widgets remain in `src/legacy/index.html`, deferred to Phase 02+ per
    roadmap boundaries.
  - `computeChart()` still does five systems' worth of work in one
    function, including cross-system fusion logic that overlaps with
    Phase 09's scope. Documented in `ARCHITECTURE.md` §5 for Phase 03/09
    to pick up — not resolved here (would be a scope violation).
  - Lint is clean of errors but carries 11 pre-existing warnings
    (unused variables/dead stores in the legacy code) — left as-is per
    the "dead code removal is Phase 14's job" rule.
- Next phase dependency: Phase 02 (Design Language & App Shell) can begin
  independently — it does not need `src/core/engine.js` internals, only
  needs to know pages will eventually consume it via the contracts Phase
  03 will define. Phase 02 should read `ARCHITECTURE.md` §3 (screen/state
  inventory) before building the shell so sidebar/nav/picker primitives
  cover what the legacy UI actually does.

## Deliverables

| Task (from roadmap Phase 01) | Status | Where |
|---|---|---|
| Inventory all screens, tabs, calculations, visualizers, forms, modals, state transitions | Done | `docs/ARCHITECTURE.md` §2–3 |
| Map dependencies inside the monolithic index.html | Done | `docs/ARCHITECTURE.md` §4 |
| Extract calculation utilities without changing their behavior | Done | `src/core/engine.js` |
| Create test fixtures from representative existing outputs | Done | `tests/fixtures/engine-snapshots.json` (8 cases) |
| Create build/test/lint baseline | Done | `package.json`, `eslint.config.js`, vitest |
| Create target src structure and migration rules | Done | `docs/ARCHITECTURE.md` §7–8 |
| Document known approximations and calculation assumptions | Done | `docs/KNOWN_APPROXIMATIONS.md` |

## Definition of Done check

> Baseline reproduces known current outputs; tests run; architecture map exists.

- Reproduces known outputs: yes — all 4 legacy validation cases pass with
  the exact same expected values (Sun/Moon/Ascendant signs, BaZi day
  master and pillar elements).
- Tests run: yes — `npm test` → 15 passed.
- Architecture map exists: yes — `docs/ARCHITECTURE.md`.

Phase 01 is complete. Per the AI Agent Handoff Protocol (roadmap §2, step
8: "Stop — do not continue into the next phase"), Phase 02 work has not
been started.
