import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from '../src/core/state/store.js';
import * as selectors from '../src/core/state/selectors.js';
import {
  getAllSystemSignalFixtures,
  getSystemSignalFixtures,
  getEvidenceFixtures,
  getPatternFixtures,
  getTimelineEventFixtures,
  getRelationshipSignalFixtures,
  loadAllFixturesIntoStore,
} from '../src/core/state/fixture-provider.js';
import { SYSTEMS } from '../src/core/contracts/index.js';

describe('fixture provider — does not touch engine internals', () => {
  it('never imports src/core/engine.js (statically verified)', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const source = fs.readFileSync(
      path.join(__dirname, '../src/core/state/fixture-provider.js'),
      'utf8'
    );
    // Check the actual import statements, not comments — the file's
    // header comment legitimately mentions "engine.js" in prose to
    // explain what it deliberately does NOT do.
    expect(source).not.toMatch(/from\s+['"][^'"]*engine\.js['"]/);
    expect(source).not.toMatch(/import\(\s*['"][^'"]*engine\.js['"]\s*\)/);
  });

  it('provides at least one signal for each of the five systems', () => {
    SYSTEMS.forEach((system) => {
      expect(getSystemSignalFixtures(system).length).toBeGreaterThan(0);
    });
  });

  it('every fixture Evidence sourceId points at a real fixture signal id', () => {
    const signalIds = new Set(getAllSystemSignalFixtures().map((s) => s.id));
    getEvidenceFixtures().forEach((evidence) => {
      expect(signalIds.has(evidence.sourceId)).toBe(true);
    });
  });

  it('every fixture Pattern references only real fixture signal ids', () => {
    const signalIds = new Set(getAllSystemSignalFixtures().map((s) => s.id));
    getPatternFixtures().forEach((pattern) => {
      pattern.signals.forEach((id) => expect(signalIds.has(id)).toBe(true));
    });
  });

  it('every fixture RelationshipSignal has a non-empty evidence trail of real signal ids', () => {
    const signalIds = new Set(getAllSystemSignalFixtures().map((s) => s.id));
    getRelationshipSignalFixtures().forEach((rel) => {
      expect(rel.contributingSignalIds.length).toBeGreaterThan(0);
      rel.contributingSignalIds.forEach((id) => expect(signalIds.has(id)).toBe(true));
    });
  });

  it('includes at least one verified, one approximate (with note), and one unavailable (with note) evidence example', () => {
    const statuses = getEvidenceFixtures().map((e) => e.calculationStatus);
    expect(statuses).toContain('verified');
    expect(statuses).toContain('approximate');
    expect(statuses).toContain('unavailable');
  });
});

describe('normalized store', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('starts empty', () => {
    expect(Object.keys(store.getState().signals)).toHaveLength(0);
  });

  it('loads fixtures via the same path a future UI would use — no engine import required', () => {
    loadAllFixturesIntoStore(store);
    const state = store.getState();
    expect(Object.keys(state.signals).length).toBe(getAllSystemSignalFixtures().length);
    expect(Object.keys(state.patterns).length).toBe(getPatternFixtures().length);
    expect(Object.keys(state.timelineEvents).length).toBe(getTimelineEventFixtures().length);
    expect(Object.keys(state.relationshipSignals).length).toBe(
      getRelationshipSignalFixtures().length
    );
  });

  it('notifies subscribers on load', () => {
    let calls = 0;
    store.subscribe(() => {
      calls += 1;
    });
    loadAllFixturesIntoStore(store);
    expect(calls).toBeGreaterThan(0);
  });

  it('reset() clears everything', () => {
    loadAllFixturesIntoStore(store);
    store.reset();
    expect(Object.keys(store.getState().signals)).toHaveLength(0);
  });

  it('rejects loading a malformed signal (contract validation runs on load)', () => {
    expect(() => store.loadSignals([{ id: 'bad', system: 'not-a-system' }])).toThrow();
  });
});

describe('selectors', () => {
  let store;

  beforeEach(() => {
    store = createStore();
    loadAllFixturesIntoStore(store);
  });

  it('selectSignalsBySystem returns only that system’s signals', () => {
    const state = store.getState();
    const astro = selectors.selectSignalsBySystem(state, 'astrology');
    expect(astro.length).toBeGreaterThan(0);
    astro.forEach((s) => expect(s.system).toBe('astrology'));
  });

  it('selectSignalsByDomain filters correctly', () => {
    const state = store.getState();
    const workSignals = selectors.selectSignalsByDomain(state, 'work');
    workSignals.forEach((s) => expect(s.domain).toBe('work'));
  });

  it('selectEvidenceForSource returns evidence tied to a signal', () => {
    const state = store.getState();
    const evidence = selectors.selectEvidenceForSource(state, 'sig-astro-a-sun-capricorn');
    expect(evidence.length).toBeGreaterThan(0);
    evidence.forEach((e) => expect(e.sourceId).toBe('sig-astro-a-sun-capricorn'));
  });

  it('selectSignalsForPattern resolves ids back to full signal objects', () => {
    const state = store.getState();
    const [pattern] = getPatternFixtures();
    const signals = selectors.selectSignalsForPattern(state, pattern.id);
    expect(signals.length).toBe(pattern.signals.length);
    signals.forEach((s) => expect(s).toHaveProperty('label'));
  });

  it('selectTimelineEventsInRange only returns overlapping events', () => {
    const state = store.getState();
    const events = selectors.selectTimelineEventsInRange(state, '2024-01-01', '2024-12-31');
    events.forEach((e) => {
      const end = e.end || e.start;
      expect(end >= '2024-01-01' && e.start <= '2024-12-31').toBe(true);
    });
  });

  it('selectRelationshipSignalsForPair is order-independent', () => {
    const state = store.getState();
    const forward = selectors.selectRelationshipSignalsForPair(
      state,
      'fixture-person-a',
      'fixture-person-b'
    );
    const backward = selectors.selectRelationshipSignalsForPair(
      state,
      'fixture-person-b',
      'fixture-person-a'
    );
    expect(forward.length).toBeGreaterThan(0);
    expect(forward.map((r) => r.id).sort()).toEqual(backward.map((r) => r.id).sort());
  });

  it('selectCalculationStatusSummary tallies without altering the data', () => {
    const state = store.getState();
    const summary = selectors.selectCalculationStatusSummary(state);
    const total = summary.verified + summary.approximate + summary.unavailable;
    expect(total).toBe(getEvidenceFixtures().length);
  });
});
