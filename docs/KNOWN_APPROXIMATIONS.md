# Known Approximations & Calculation Assumptions

Phase 01 requirement: "Document known approximations and calculation
assumptions." Everything below is inherited as-is from the legacy engine
(now `src/core/engine.js`) — nothing here has been changed by extraction.
These are candidates for later phases to address, not defects introduced
by this phase.

Most of this is already self-documented in the engine's own output: every
`computeChart()` result includes a `confidence` object and an
`errorTolerance` object describing exactly these caveats to the end user
at runtime. This file collects them in one place plus a few that aren't
surfaced in the UI yet.

## Surfaced to the user today (via `D.confidence` / `D.errorTolerance`)

- **Planetary longitude accuracy: ~1–3°.** The engine uses a truncated
  VSOP87 series (`EARTH_L0/L1/R0/R1` + per-planet term tables), not a full
  ephemeris. Good enough for sign placement in the vast majority of cases,
  but placements within ~1–3° of a sign boundary carry real risk of being
  wrong.
- **Ascendant/Houses require a birth time.** Without `timeStr`, the engine
  falls back to using the **Sun's position as a stand-in for the
  Ascendant** (`const ascLon = timeStr ? calcAscendant(...) : sunLon`).
  This is a real approximation, not a null — downstream code must not
  treat `planets.Ascendant` as meaningful when `timeStr` is empty.
- **House system: Whole Sign.** Chosen for simplicity/stability rather
  than Placidus or another quadrant system. Midheaven (MC) is computed
  separately from the Whole Sign houses specifically to preserve a usable
  career axis.
- **BaZi Hour Pillar needs a time.** Without one, `baziHour` returns a
  placeholder object (`stem:'—', branch:'—', el:'—'`) rather than a
  computed value.
- **Human Design Type/Authority: "88° solar arc" approximation.** The
  engine's own comment states this needs Swiss Ephemeris for true gate
  precision; the current approach is an approximation acceptable for
  Type/Authority but weaker for exact gate/line edges.
- **HD confidence explicitly downgraded even with a time** (`hd:
  timeStr ? 'medium' : 'low'`) — HD is treated as more time-sensitive than
  Astrology or BaZi, which get `'high'`.
- **Sensitivity note is date-dependent, not just time-dependent.** The
  engine flags `medium` sensitivity even when a birth time *is* given, if
  the birth falls near a day boundary (midnight) or near a BaZi solar-term
  boundary (the month pillar would flip with a small time shift). This is
  computed per-chart (`birthTimeSensitivity`), not a static disclaimer.

## Not yet surfaced to the user (found during Phase 01 code reading)

- **Timezone is a coordinate-derived approximation when not explicitly
  confirmed.** `tzFromLon(lon) = Math.round(lon/15)` — a naive 15°-per-hour
  estimate, not real UTC-offset/DST data. This only applies when the
  caller doesn't pass a confirmed `tz` (the UI's city-autocomplete flow
  does ask the user to confirm coordinates/tz, but any future caller of
  `computeChart` that skips that step inherits this approximation
  silently).
- **`getLatLon()` fallback table (`CITY_LL`) covers ~26 cities** with a
  single hardcoded `default` (Jakarta) for anything unmatched. This is
  distinct from the UI's larger `CITY_DB` autocomplete list (see
  ARCHITECTURE.md §5) — a city the UI can autocomplete may still fall back
  to the wrong coordinates if `computeChart` is ever called without
  confirmed lat/lon for it.
- **Solar-term-based BaZi year boundary uses actual Sun longitude**
  (`baziYearFromSun`), which is more accurate than the common "Chinese New
  Year date" shortcut — this is actually a strength, documented here so
  it isn't accidentally "corrected" to the less-accurate popular method in
  a later phase.
- **BaZi hidden-stem element weighting is a fixed heuristic**
  (primary hidden stem = 0.5, secondary = 0.3, tertiary = 0.2), not a
  cited traditional weighting scheme. Worth sourcing/citing before Phase
  06 treats these numbers as authoritative.
- **Retrograde detection excludes Sun and Moon by definition**
  (geocentric — correct astronomically, but worth stating explicitly since
  it's implicit in the code rather than commented).
- **Pluto has two longitude implementations** (`plutoLongitude` and
  `plutoLongitude_h`, both exported) — only `plutoLongitude` is called
  from `computeChart`. `plutoLongitude_h` is currently dead code from
  the engine's perspective (kept verbatim per Phase 01 rules; not removed
  — see ARCHITECTURE.md §8 rule 5, dead-code removal is Phase 14's job).
