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
| 02 | Design Language & App Shell | ⬜ NOT STARTED | — |
| 03 | Core Contracts & State | ⬜ NOT STARTED | — |
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

**Current phase: 01 is complete. Phase 02 has not been started — that is
the next phase to pick up.**

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

## Repo state (as of Phase 01)

- `src/core/engine.js` — calculation engine, extracted and regression-tested.
- `src/legacy/index.html` — frozen reference copy of the original monolith.
- Everything else (shell, pages, rendering, input widgets) still only
  exists inside `src/legacy/index.html`, waiting on Phase 02+.
- Test/lint baseline exists (`npm test`, `npm run lint`) — extend it,
  don't replace it, unless a phase's own Definition of Done requires
  otherwise.
