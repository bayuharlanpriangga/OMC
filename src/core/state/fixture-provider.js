/*
 * OMC 2.0 — Fixture provider (Phase 03)
 *
 * Roadmap task: "Create fixture provider for all five systems." This is
 * static, hand-authored, deterministic example data shaped to the
 * Phase 03 contracts — it does NOT import or call src/core/engine.js.
 * That is the point: it is what proves the Definition of Done ("New UI
 * can consume fixture contracts without touching engine internals").
 *
 * None of this data is a real calculated chart. It exists so:
 *   (a) the contract factories in ../contracts/ have realistic data to
 *       validate against in tests, and
 *   (b) a future lens phase (04–08) has a concrete shape to replace
 *       with real computed signals, one system at a time, without the
 *       state layer or UI needing to change.
 *
 * The Pattern and RelationshipSignal examples below are illustrative
 * only — they are NOT produced by any synthesis engine (that's Phase 09
 * / Phase 11's job, explicitly out of scope here). They exist purely so
 * those two contracts have something real to validate against too.
 */

import {
  createSystemSignal,
  createEvidence,
  createPattern,
  createTimelineEvent,
  createRelationshipSignal,
  CURRENT_ENGINE_VERSION,
} from '../contracts/index.js';

// ---------------------------------------------------------------------
// Person A — the primary fixture person, one SystemSignal per system
// touching a different Living Self Model domain so selectors have
// varied data to filter on.
// ---------------------------------------------------------------------

const SYSTEM_SIGNAL_FIXTURES = [
  createSystemSignal({
    id: 'sig-astro-a-sun-capricorn',
    system: 'astrology',
    domain: 'work',
    label: 'Sun in Capricorn',
    value: 'Capricorn',
    strength: 0.82,
    confidence: 'HIGH',
    temporalScope: 'natal',
    sources: ['entity-person-a-natal-chart'],
  }),
  createSystemSignal({
    id: 'sig-hd-a-sacral-defined',
    system: 'human-design',
    domain: 'energy',
    label: 'Sacral center defined',
    value: 'defined',
    strength: 0.9,
    confidence: 'HIGH',
    temporalScope: 'natal',
    sources: ['entity-person-a-bodygraph'],
  }),
  createSystemSignal({
    id: 'sig-bazi-a-day-master-yang-wood',
    system: 'bazi',
    domain: 'identity',
    label: 'Day Master: Yang Wood',
    value: 'Yang Wood',
    strength: 0.75,
    confidence: 'MEDIUM',
    temporalScope: 'natal',
    sources: ['entity-person-a-four-pillars'],
  }),
  createSystemSignal({
    id: 'sig-ziwei-a-life-palace-purple-star',
    system: 'ziwei',
    domain: 'identity',
    label: 'Life Palace: Purple Star (Zi Wei)',
    value: 'Zi Wei',
    strength: 0.68,
    confidence: 'MEDIUM',
    temporalScope: 'natal',
    sources: ['entity-person-a-ziwei-chart'],
  }),
  createSystemSignal({
    id: 'sig-num-a-life-path-7',
    system: 'numerology',
    domain: 'mind',
    label: 'Life Path Number 7',
    value: 7,
    strength: 0.7,
    confidence: 'MEDIUM',
    temporalScope: 'natal',
    sources: ['entity-person-a-name-birthdate'],
  }),
];

// ---------------------------------------------------------------------
// Person B — a second, much smaller fixture person, only deep enough to
// give the RelationshipSignal example a real evidence trail from both
// sides. Not part of "all five systems" coverage for Person A above.
// ---------------------------------------------------------------------

const PERSON_B_SIGNAL_FIXTURES = [
  createSystemSignal({
    id: 'sig-astro-b-moon-cancer',
    system: 'astrology',
    domain: 'emotion',
    label: 'Moon in Cancer',
    value: 'Cancer',
    strength: 0.77,
    confidence: 'HIGH',
    temporalScope: 'natal',
    sources: ['entity-person-b-natal-chart'],
  }),
  createSystemSignal({
    id: 'sig-hd-b-emotional-authority',
    system: 'human-design',
    domain: 'emotion',
    label: 'Emotional (Solar Plexus) authority',
    value: 'emotional-authority',
    strength: 0.85,
    confidence: 'HIGH',
    temporalScope: 'natal',
    sources: ['entity-person-b-bodygraph'],
  }),
];

const EVIDENCE_FIXTURES = [
  createEvidence({
    system: 'astrology',
    sourceId: 'sig-astro-a-sun-capricorn',
    claim: 'Sun longitude places it within Capricorn (270°–300°) at time of birth.',
    strength: 0.95,
    calculationStatus: 'verified',
    engineVersion: CURRENT_ENGINE_VERSION,
  }),
  createEvidence({
    system: 'human-design',
    sourceId: 'sig-hd-a-sacral-defined',
    claim: 'Sacral center gates activated by both personality and design charts.',
    strength: 0.9,
    calculationStatus: 'verified',
    engineVersion: CURRENT_ENGINE_VERSION,
  }),
  createEvidence({
    system: 'bazi',
    sourceId: 'sig-bazi-a-day-master-yang-wood',
    claim: 'Day pillar heavenly stem resolved to Yang Wood from solar calendar conversion.',
    strength: 0.75,
    calculationStatus: 'verified',
    engineVersion: CURRENT_ENGINE_VERSION,
  }),
  createEvidence({
    system: 'ziwei',
    sourceId: 'sig-ziwei-a-life-palace-purple-star',
    claim: 'Life Palace star placement uses an approximate lunar-month conversion for this date range.',
    strength: 0.6,
    calculationStatus: 'approximate',
    engineVersion: CURRENT_ENGINE_VERSION,
    note: 'Lunar calendar conversion for this birth date falls in a known low-precision window — see docs/KNOWN_APPROXIMATIONS.md.',
  }),
  createEvidence({
    system: 'numerology',
    sourceId: 'sig-num-a-life-path-7',
    claim: 'Life Path derived from full birthdate reduction.',
    strength: 0.7,
    calculationStatus: 'verified',
    engineVersion: CURRENT_ENGINE_VERSION,
  }),
  createEvidence({
    system: 'ziwei',
    sourceId: 'sig-ziwei-a-life-palace-purple-star',
    claim: 'Minor star set for this palace could not be resolved from the current fixture data set.',
    strength: 0,
    calculationStatus: 'unavailable',
    engineVersion: CURRENT_ENGINE_VERSION,
    note: 'Illustrative "unavailable" example only — no minor-star fixture data has been authored yet.',
  }),
];

const TIMELINE_EVENT_FIXTURES = [
  createTimelineEvent({
    id: 'tl-astro-a-saturn-return',
    sourceSystem: 'astrology',
    start: '2024-01-01',
    end: '2024-11-30',
    signalIds: ['sig-astro-a-sun-capricorn'],
    intensity: 0.8,
    interpretation: 'A Saturn Return period — symbolic context for restructuring, not a guaranteed event.',
  }),
  createTimelineEvent({
    id: 'tl-bazi-a-luck-pillar-2020-2030',
    sourceSystem: 'bazi',
    start: '2020-01-01',
    end: '2030-01-01',
    signalIds: ['sig-bazi-a-day-master-yang-wood'],
    intensity: 0.6,
    interpretation: 'Current ten-year Luck Pillar period.',
  }),
  createTimelineEvent({
    id: 'tl-personal-a-career-change',
    sourceSystem: 'personal',
    start: '2023-06-01',
    signalIds: [],
    intensity: 0.5,
    interpretation: 'User-added note: changed careers. Not treated as proof of any system prediction.',
  }),
];

// Illustrative only — see file header. Domain 'work' chosen because both
// contributing signals (Sun in Capricorn, Sacral defined) plausibly
// speak to that domain; this is a fixture author's judgment call, not
// synthesis logic.
const PATTERN_FIXTURES = [
  createPattern({
    id: 'pat-a-grounded-drive',
    domain: 'work',
    type: 'Convergence',
    signals: ['sig-astro-a-sun-capricorn', 'sig-hd-a-sacral-defined'],
    synthesis:
      'Astrology and Human Design both point toward a steady, self-generated drive toward long-term goals — read as a theme worth noticing, not a certainty.',
    confidence: 'MEDIUM',
    tensions: [],
    temporalContext: 'natal',
  }),
];

const RELATIONSHIP_SIGNAL_FIXTURES = [
  createRelationshipSignal({
    id: 'rel-a-b-emotional-attunement',
    dimension: 'emotional',
    personAId: 'fixture-person-a',
    personBId: 'fixture-person-b',
    synthesis:
      'One person leads with feeling-based authority and the other carries strong emotional-water placements — a dynamic worth naming, not a compatibility score.',
    strength: 0.65,
    confidence: 'MEDIUM',
    contributingSignalIds: ['sig-hd-b-emotional-authority', 'sig-astro-b-moon-cancer'],
    tensions: [],
    temporalScope: 'natal',
  }),
];

export function getSystemSignalFixtures(system) {
  if (!system) return SYSTEM_SIGNAL_FIXTURES.slice();
  return SYSTEM_SIGNAL_FIXTURES.filter((s) => s.system === system);
}

export function getAllSystemSignalFixtures() {
  return [...SYSTEM_SIGNAL_FIXTURES, ...PERSON_B_SIGNAL_FIXTURES];
}

export function getEvidenceFixtures() {
  return EVIDENCE_FIXTURES.slice();
}

export function getPatternFixtures() {
  return PATTERN_FIXTURES.slice();
}

export function getTimelineEventFixtures() {
  return TIMELINE_EVENT_FIXTURES.slice();
}

export function getRelationshipSignalFixtures() {
  return RELATIONSHIP_SIGNAL_FIXTURES.slice();
}

/**
 * Convenience loader: populates a store.js store with every fixture in
 * one call. This is the concrete demonstration of the Phase 03
 * Definition of Done — a caller that only imports fixture-provider.js
 * and store.js, never src/core/engine.js, can still get a fully
 * populated, contract-valid state.
 */
export function loadAllFixturesIntoStore(store) {
  store.loadSignals(getAllSystemSignalFixtures());
  store.loadEvidence(getEvidenceFixtures());
  store.loadPatterns(getPatternFixtures());
  store.loadTimelineEvents(getTimelineEventFixtures());
  store.loadRelationshipSignals(getRelationshipSignalFixtures());
}
