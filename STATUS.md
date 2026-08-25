# OMC 2.0 — ROADMAP STATUS

**Read this file first.** This is the single source of truth for "where
are we" across the 15-phase roadmap. Update it as the last step of every
phase (Handoff Protocol step 7: "Record"), before stopping (step 8).

Full phase definitions (tasks / out-of-scope / Definition of Done) live in
the roadmap document, not here — this file only tracks status + pointers.

---

## Progress at a glance

| Phase | Mission | Status | Notes / doc |
|---|---|---|---|
| 01 | Baseline & Extraction | ✅ DONE | `docs/PHASE_01_COMPLETION.md` |
| 02 | Design Language & App Shell | ✅ DONE | `docs/PHASE_02_COMPLETION.md` |
| 03 | Core Contracts & State | ✅ DONE | `docs/PHASE_03_COMPLETION.md` |
| 04 | Astrology Lens | ⬜ NOT STARTED | — |
| 05 | Human Design Lens | ⬜ NOT STARTED | — |
| 06 | BaZi Lens | ⬜ NOT STARTED | — |
| 07 | Zi Wei Lens | ⬜ NOT STARTED | — |
| 08 | Numerology Lens | ⬜ NOT STARTED | — |
| 09 | Pattern Intelligence | ⬜ NOT STARTED | — |
| 10 | Life Replay / Temporal Intelligence | ⬜ NOT STARTED | — |
| 11 | Relationship Dynamics | ⬜ NOT STARTED | — |
| 12 | Explorer | ⬜ NOT STARTED | — |
| 13 | Personal OS | ⬜ NOT STARTED | — |
| 14 | Hardening | ⬜ NOT STARTED | — |
| 15 | Release | ⬜ NOT STARTED | — |

**Current phase: 03 is complete. Phase 04 (Astrology Lens) has not been
started — that is the next phase to pick up.**

---

## For an AI agent picking this up cold

1. Read this file (you're doing it).
2. Read `docs/ARCHITECTURE.md` — screen inventory, dependency map, target
   `src/` structure, and the migration rules every phase must follow
   (§8 — e.g. never edit `src/legacy/index.html`, never touch
   `src/core/engine.js` calculation logic outside its designated phase).
3. Read `docs/KNOWN_APPROXIMATIONS.md` if your phase touches any
   calculation output.
4. Read the completion doc for the most recently DONE phase (table above)
   to see what it left behind and what the next phase depends on.
5. Follow the Handoff Protocol from the roadmap: Read → Plan → Inspect →
   Implement → Validate → Repair → Record → Stop. Work only inside your
   phase's boundary — do not pull forward tasks from later phases even if
   they look easy, and do not continue to the next phase after finishing
   yours.
6. When your phase is done: write `docs/PHASE_<NN>_COMPLETION.md` using
   the roadmap's Phase Completion Template (PHASE STATUS / Build / Tests /
   Regression / Responsive / Accessibility / Scope violations / Changed
   contracts / Known limitations / Next phase dependency), then come back
   to **this file** and flip your row to ✅ DONE with a link to that doc.
   Never mark a phase DONE here without a completion doc backing it up.

## Note (2026-08-23)

Two undocumented commits ("Add files via upload") landed on `main` outside
this tracking file — origin unknown, likely a stray agent/experiment run
that skipped the Handoff Protocol's "Record" step. They split the legacy
monolith into `src/ui/*` / `src/engines/*` / `styles/*` and shrank root
`index.html` to a shell, but did **not** follow the Design Specification
(still five disconnected system pages, no design tokens, no Living Self
Model/Pattern Graph/Explorer, a second untracked calculation engine
diverging from `src/core/engine.js`). Reverted manually via GitHub web UI:
those files were removed and `index.html` restored to the Phase 01
baseline (byte-identical to `src/legacy/index.html`). **Lesson for future
agents: always update this file (step 7 of the Handoff Protocol) before
stopping — an unrecorded commit is indistinguishable from an unauthorized
one.**

## Repo state (as of Phase 03)

- `src/core/engine.js` — calculation engine, extracted and regression-tested (Phase 01). Untouched since.
- `src/legacy/index.html` — frozen reference copy of the original monolith. Still untouched.
- `index.html` (root), `src/styles/`, `src/shell/` — Phase 02 app shell. Untouched in Phase 03; every route besides Home still renders its "not yet migrated, lands in Phase NN" placeholder.
- `src/core/contracts/` — Phase 03: `SystemSignal`, `Evidence`, `Pattern`, `TimelineEvent`, `RelationshipSignal`, `CalculationMetadata` contract factories + shared enums. `RelationshipSignal` is a Phase 03 extrapolation (not verbatim in the Design Spec) — see `docs/PHASE_03_COMPLETION.md`.
- `src/core/state/` — Phase 03: normalized store (`store.js`), pure-projection `selectors.js`, and `fixture-provider.js` with static example data for all five systems. `fixture-provider.js` never imports `engine.js` — enforced by a test, not just documented.
- The five metaphysical systems, Pattern Intelligence, Timeline, Relationships, Explorer, and Personal OS still do not exist as real features — Phase 03 only defined the data shapes and a fixture-backed state layer for them to eventually use. The Phase 02 shell placeholders are not yet wired to any of this; that's an open first step for Phase 04+ (see `docs/PHASE_03_COMPLETION.md` "Next phase dependency").
- Test/lint baseline: `npm test` now also runs `tests/contracts.test.js` and `tests/state.test.js` (26 new tests, all passing) alongside Phase 01's `tests/regression.test.js` and Phase 02's `tests/shell.test.js`. `npm run lint` — extend, don't replace.
- Known pre-existing issue (still not fixed, not this phase's job): `tests/regression.test.js` has 8 failing transit-longitude assertions due to live "now" vs fixed-fixture drift. Unchanged since Phase 01/02.
