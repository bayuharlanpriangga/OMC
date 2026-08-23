# OMC 2.0 — Architecture Baseline (Phase 01: Baseline & Extraction)

Status: Phase 01 in progress. This document is the inventory + dependency
map + migration plan required by roadmap Phase 01. It describes the
**legacy** system as it exists in `src/legacy/index.html` (copied verbatim
from `bayuharlanpriangga/OMC@main`, 7,676 lines) and the **target**
structure this repo is migrating toward.

Per the roadmap's Execution Law, this phase does **not** redesign UI or
implement new intelligence — it only inventories, extracts, and documents.

---

## 1. Legacy repo shape

One file: `index.html`.

| Section | Lines (legacy) | Content |
|---|---|---|
| `<style>` | 8–1273 (~1,265 lines) | Design tokens (CSS vars), all component styles, responsive rules |
| HTML shell | 1274–1812 (~538 lines) | Sidebar, mobile nav, 12 page containers, canvas/svg mount points |
| `<script>` | 1813–7676 (~5,863 lines) | Calculation engine + rendering + interaction + state, all in one scope |

No build step, no bundler, no framework. No test runner (there is a
hand-rolled `runValidation()` reachable via `#test` hash — see §6).

## 2. Screen inventory

Navigation is a single-page-app pattern driven by `goPage(id)` (legacy line
~6300), which toggles `.active` on `#page-<id>` containers and pushes
`location.hash`. No router library; hash is read on load to restore a page.

`PAGE_IDS = ['home','astro','hd','bazi','ziwei','num','overview','depth','tl','transit','daily','compat']`

| Page id | Role |
|---|---|
| `home` | Landing — galaxy canvas bg, sacred-geometry decoration, 5 system cards (entry points into astro/hd/bazi/ziwei/num) |
| `astro` | Astrology: birth-data form (left) + natal chart/result (right) |
| `hd` | Human Design: same form pattern, bodygraph result |
| `bazi` | BaZi (Four Pillars): same form pattern |
| `ziwei` | Zi Wei Dou Shu: same form pattern |
| `num` | Numerology: name/birthdate form |
| `overview` | Cross-system summary — requires prior computed chart |
| `depth` | "Shadow" page — deeper trait/shadow analysis |
| `tl` | Timeline — life periods / phases |
| `transit` | Current transits vs natal |
| `daily` | Daily pull / today's reading |
| `compat` | Compatibility between two charts |

The five system pages (`astro/hd/bazi/ziwei/num`) share one template:
left panel = input form, right panel = result. The six analysis pages all
depend on `_globalD` / `_globalRaw` (state populated after any system
computes a chart) rather than owning their own input.

## 3. Interactive/state inventory (non-exhaustive, representative)

Custom input widgets (no native `<form>`/`<input type=date>` — everything
hand-built):
- Two independent date-wheel pickers (`initDatePicker` / `initDatePicker2`, drag-drum year/month/day selectors)
- Two time-wheel pickers (`initWheels` / `initWheels2`)
- City autocomplete with a ~26-entry `CITY_DB` (separate from the smaller
  `CITY_LL` used as an engine fallback — see §5) and manual lat/lon/tz confirm step
- Compatibility flow (`doCompat`, `toStep2`) — a 2-person wizard reusing the
  second set of pickers (`*2` suffixed functions/state)

Key mutable global state (module-scope `let`/`const` objects, not a formal
store):
- `natalData`, `_D`, `_raw`, `_globalD`, `_globalRaw` — last computed chart(s)
- `_rendered` — memoization guard so expensive canvas redraws don't repeat
- `_currentPage` — active page id
- `_cdYear/_cdMonth/_cdDay`, `_c2Year/_c2Month/_c2Day` — picker 1 & 2 date state
- `_twH/_twM` — time-wheel state
- `_cityConfirmed`, `_c2CityConfirmed` — whether autocomplete resolved to real coords
- `_shareType` — which "share card" variant is being rendered

Modals/drawers use a shared `.open` class toggle convention (`classList.add/remove('open')`)
rather than a single modal primitive — each picker/dropdown manages its own
`open` state independently (~24 call sites). There is no shared
Modal/Drawer/DetailPanel component; Design Language phase (02) is where
this gets unified per the roadmap.

## 4. Dependency map

```
index.html
├── <style>            — self-contained, no JS dependency
├── HTML shell          — depends on CSS classes; JS attaches behavior via getElementById
└── <script>
    ├── Calculation engine (pure, no DOM) ── EXTRACTED in this phase ──▶ src/core/engine.js
    │     toJD, obliquity, normalizeAngle, sun/moon/mercury/venus/mars/
    │     jupiter/saturn/uranus/neptune/pluto Longitude, evalVSOP,
    │     vsop87Planet, calcAscendant, calcHouses, calcMC, isRetrograde,
    │     getOrb, aspectType, isApplying, aspectWithOrb, getPlanetDignity,
    │     lonToSign, houseOf, getBaziMonthIdx, baziYearFromSun, baziMonth,
    │     baziDay, baziHour, lonToGate, lonToLine, jdWhenSunAt, getDesignJD,
    │     getDefinedCenters, centersConnected, determineHDType,
    │     determineAuthority, getDefinedCentersList, zwPalace,
    │     approxLunarMonth, getLatLon, tzFromLon, computeChart
    │     (+ nested numerology/10-god/hidden-stem helpers defined inside
    │     computeChart's closure — see §5)
    │
    ├── Canvas/SVG renderers (DOM-coupled)      — NOT yet extracted
    │     drawSoulRing, drawRadar, drawNatal, _renderNatal, setupNatalHover,
    │     drawElemPie, drawBaziElem, renderHDBodygraph, drawZiWei
    │     → target: src/systems/*/render.js in phases 04–08
    │
    ├── Page render/orchestration (DOM-coupled) — NOT yet extracted
    │     render(), renderPlanetTable, buildNameCalcHTML, renderDaily,
    │     renderShareCard, buildInputForm
    │     → target: split per-system in phases 04–08, shell in phase 02
    │
    ├── Navigation & shell interaction          — NOT yet extracted
    │     goPage, toggleSidebar, open/closeMobileSidebar
    │     → target: src/shell/ in phase 02
    │
    └── Input widgets (date/time pickers, city autocomplete, compatibility
        wizard) — NOT yet extracted, DOM-coupled
        → target: src/shell/inputs/ in phase 02 (shared primitives),
          consumed by each system page
```

**Extraction boundary used for this phase:** legacy lines 1813–3671 form one
contiguous block that is provably DOM-free (`grep`-verified: zero
`document.`/`getElementById`/`innerHTML`/`window.` references in that
range) and ends exactly where `computeChart()` returns, right before the
first canvas renderer (`drawSoulRing`) begins. That made this an unusually
clean cut — the product's calculation core was already de facto isolated
from rendering, just not physically separated into a module.

## 5. Known coupling / debt to carry into later phases

- **`computeChart()` is doing five jobs at once** (~1,090 lines): it is the
  calculation core for all five systems *and* already contains
  cross-system fusion logic (`fusion.convergences`, `contradictions`,
  `giftWound`, etc. — see the return object). This overlaps with what the
  roadmap assigns to Phase 09 (Pattern Intelligence). Phase 03 (Core
  Contracts) should decide whether to keep fusion logic inline or split it
  into its own module once SystemSignal/Pattern contracts exist — noted
  here so Phase 03 doesn't rediscover this from scratch.
- **Two separate city datasets**: `CITY_LL` (~26 cities, engine-level
  fallback used only when the caller doesn't pass confirmed lat/lon) vs.
  `CITY_DB` (UI autocomplete list, larger, DOM-coupled). They can drift out
  of sync. Left as-is for Phase 01; Phase 02/03 should decide on one source
  of truth.
- **Duplicate `lonToLine` function** (legacy lines ~2321 and ~2522,
  byte-identical bodies) — removed as a no-op dedupe during extraction
  (see `src/core/engine.js` header comment). Flagged here for visibility,
  not treated as a "fix" since behavior is unchanged either way.
- **Nested nested/local functions inside `computeChart`** (e.g.
  `getHiddenStems`, `get10God`, `lonToColumn`, `numReduce`,
  `numReduceCycle`, `isYVowel`, `nameToNums`, `splitName`,
  `calcNameNumber`, `buildNameCalcHTML`'s `renderPart`, `transAspect`) are
  closures over `computeChart`'s local scope, not top-level exports. They
  were extracted as part of the block but are **not individually
  importable** — only reachable via `computeChart()`'s return value. Lens
  phases 04–08 will need to decide whether to lift them to top-level when
  they build each system's dedicated module.
- **No shared Modal/Drawer primitive** (§3) — Design Language phase (02)
  work item.
- **No router library, no bundler, no formal state store** — by design for
  this phase; Phase 02/03 introduce the shell and normalized state layer.

## 6. Existing self-tests (inherited)

Legacy `index.html` already contains a hand-rolled validation suite
(`VALIDATION_CASES` + `runValidation()`, ~line 6038), reachable by loading
the page with `#test` in the URL. It checks 4 cases against expected
zodiac signs / BaZi elements. This phase's `tests/regression.test.js`
**supersedes** it: all 4 legacy cases are re-asserted verbatim (see
"legacy VALIDATION_CASES parity" describe block) plus full-object snapshot
regression across 8 fixtures (4 legacy + 4 new edge cases). The legacy
in-browser panel can be retired once the new UI no longer needs a
same-page smoke test — that's a Phase 02/15 call, not this phase's.

## 7. Target `src/` structure

```
src/
  core/
    engine.js          ← DONE (Phase 01): verbatim calculation engine
    contracts/         ← Phase 03: SystemSignal, Evidence, Pattern,
                          TimelineEvent, RelationshipSignal, etc.
    state/             ← Phase 03: normalized state layer + selectors
  shell/               ← Phase 02: design tokens, layout grid, sidebar,
                          mobile nav, command palette, modal/drawer/
                          detail-panel primitives, motion rules
    inputs/             ← Phase 02: shared date/time picker, city
                          autocomplete (reconciled CITY_LL/CITY_DB)
  systems/
    astrology/          ← Phase 04
    human-design/        ← Phase 05
    bazi/                ← Phase 06
    zi-wei/               ← Phase 07
    numerology/          ← Phase 08
  intelligence/
    pattern/             ← Phase 09 (may absorb computeChart's fusion.*)
    timeline/            ← Phase 10
    relationship/         ← Phase 11
  explorer/             ← Phase 12
  personal-os/          ← Phase 13
  legacy/
    index.html          ← DONE (Phase 01): frozen reference copy, not
                          imported by anything, kept for diffing/parity
                          checks until Phase 15 sign-off
tests/
  fixtures/
    engine-snapshots.json  ← DONE (Phase 01)
  regression.test.js       ← DONE (Phase 01)
docs/
  ARCHITECTURE.md           ← this file
  KNOWN_APPROXIMATIONS.md   ← calculation caveats, carried as-is
scripts/
  generate-fixtures.js      ← DONE (Phase 01)
```

## 8. Migration rules for later phases

1. **Never edit `src/legacy/index.html`.** It's the frozen baseline for
   parity checks, not a working file.
2. **Never edit `src/core/engine.js`'s calculation logic during a lens
   phase's UI work.** If a lens phase (04–08) finds a genuine bug in its
   system's calculation, it may fix it *inside that phase's scope only*,
   update the affected fixture(s) in `tests/fixtures/engine-snapshots.json`,
   and record the change under "Changed contracts" in that phase's
   completion notes. Silent drift is not allowed — a snapshot diff without
   an explanation in the phase's completion notes is a scope violation.
2b. Renaming/regrouping engine exports (e.b. splitting `computeChart` per
   system) is Phase 03+ work, not Phase 01 — this phase intentionally kept
   the single `computeChart()` entry point to minimize risk.
3. **New pages/components consume `src/shell/` primitives once Phase 02
   lands.** Nothing after Phase 02 should hand-roll its own modal, its own
   design tokens, or its own picker.
4. **Fixtures are the regression gate.** Any change to
   `src/core/engine.js` output must be accompanied by regenerating
   `tests/fixtures/engine-snapshots.json` (`npm run fixtures:gen`) and
   explaining the diff — never regenerate silently to make a red test green.
5. **Dead code removal is Phase 14's job**, not incidental cleanup in
   earlier phases — see roadmap §4 Context-Limit Protection.
