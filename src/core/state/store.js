/*
 * OMC 2.0 — Normalized state layer (Phase 03)
 *
 * Roadmap task: "Implement normalized state layer." This holds every
 * contract type (SystemSignal, Evidence, Pattern, TimelineEvent,
 * RelationshipSignal) indexed by id in flat dictionaries — the
 * "normalized" part — rather than as nested objects, so any later
 * feature (04–13) can look an entity up in O(1) without walking a tree.
 *
 * This layer does NOT compute anything. It is a plain container plus a
 * minimal pub/sub so a future UI layer can re-render on load(). No
 * cross-system synthesis happens here — that is Phase 09's job and is
 * explicitly out of scope for Phase 03.
 *
 * Framework-agnostic on purpose: works the same whether the caller is a
 * vitest test, a future ESM-based feature module, or (via a small
 * bridge script, see docs/PHASE_03_COMPLETION.md) the classic-script
 * Phase 02 shell.
 */

import {
  createSystemSignal,
  createEvidence,
  createPattern,
  createTimelineEvent,
  createRelationshipSignal,
} from '../contracts/index.js';

function emptyState() {
  return {
    signals: {},
    // Evidence has no id of its own in the Design Spec §18 shape — only
    // `sourceId` — and a single source can have multiple evidence
    // entries (supporting AND conflicting, §5), so this is keyed by
    // sourceId -> Evidence[] rather than a flat id -> Evidence map.
    evidenceBySource: {},
    patterns: {},
    timelineEvents: {},
    relationshipSignals: {},
    meta: {
      loadedAt: null,
    },
  };
}

export function createStore() {
  let state = emptyState();
  const listeners = new Set();

  function notify() {
    listeners.forEach((fn) => fn(state));
  }

  function loadSignals(rawSignals) {
    const next = { ...state.signals };
    rawSignals.forEach((raw) => {
      const signal = createSystemSignal(raw);
      next[signal.id] = signal;
    });
    state = { ...state, signals: next, meta: { ...state.meta, loadedAt: new Date().toISOString() } };
    notify();
  }

  function loadEvidence(rawEvidenceList) {
    const next = { ...state.evidenceBySource };
    rawEvidenceList.forEach((raw) => {
      const evidence = createEvidence(raw);
      const bucket = next[evidence.sourceId] ? next[evidence.sourceId].slice() : [];
      bucket.push(evidence);
      next[evidence.sourceId] = bucket;
    });
    state = { ...state, evidenceBySource: next };
    notify();
  }

  function loadPatterns(rawPatterns) {
    const next = { ...state.patterns };
    rawPatterns.forEach((raw) => {
      const pattern = createPattern(raw);
      next[pattern.id] = pattern;
    });
    state = { ...state, patterns: next };
    notify();
  }

  function loadTimelineEvents(rawEvents) {
    const next = { ...state.timelineEvents };
    rawEvents.forEach((raw) => {
      const event = createTimelineEvent(raw);
      next[event.id] = event;
    });
    state = { ...state, timelineEvents: next };
    notify();
  }

  function loadRelationshipSignals(rawSignals) {
    const next = { ...state.relationshipSignals };
    rawSignals.forEach((raw) => {
      const signal = createRelationshipSignal(raw);
      next[signal.id] = signal;
    });
    state = { ...state, relationshipSignals: next };
    notify();
  }

  function getState() {
    return state;
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function reset() {
    state = emptyState();
    notify();
  }

  return {
    getState,
    loadSignals,
    loadEvidence,
    loadPatterns,
    loadTimelineEvents,
    loadRelationshipSignals,
    subscribe,
    reset,
  };
}
