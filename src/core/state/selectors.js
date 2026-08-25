/*
 * OMC 2.0 — Selectors / derived state (Phase 03)
 *
 * Every function here is a pure projection over a state object returned
 * by store.js's getState() — filtering, indexing, and re-shaping data
 * that's already in the store. None of them synthesize a NEW claim,
 * combine multiple systems into a new interpretation, or compute a
 * pattern/insight that wasn't already loaded. That line matters: this
 * phase's Definition of Done is "new UI can consume fixture contracts",
 * not "new UI gets new intelligence" — cross-system synthesis is
 * explicitly out of scope until Phase 09.
 */

export function selectSignalById(state, id) {
  return state.signals[id] || null;
}

export function selectSignalsBySystem(state, system) {
  return Object.values(state.signals).filter((s) => s.system === system);
}

export function selectSignalsByDomain(state, domain) {
  return Object.values(state.signals).filter((s) => s.domain === domain);
}

export function selectEvidenceForSource(state, sourceId) {
  return state.evidenceBySource[sourceId] || [];
}

/** Evidence with calculationStatus 'verified' for a source (§5: separate supporting/conflicting is a UI concern layered on top of strength, not modeled here). */
export function selectVerifiedEvidenceForSource(state, sourceId) {
  return selectEvidenceForSource(state, sourceId).filter(
    (e) => e.calculationStatus === 'verified'
  );
}

export function selectPatternById(state, id) {
  return state.patterns[id] || null;
}

export function selectPatternsByDomain(state, domain) {
  return Object.values(state.patterns).filter((p) => p.domain === domain);
}

export function selectPatternsByType(state, type) {
  return Object.values(state.patterns).filter((p) => p.type === type);
}

/** Resolves a Pattern's `signals` id list back to the full SystemSignal objects. */
export function selectSignalsForPattern(state, patternId) {
  const pattern = selectPatternById(state, patternId);
  if (!pattern) return [];
  return pattern.signals.map((id) => selectSignalById(state, id)).filter(Boolean);
}

export function selectTimelineEventById(state, id) {
  return state.timelineEvents[id] || null;
}

export function selectTimelineEventsBySystem(state, sourceSystem) {
  return Object.values(state.timelineEvents).filter((e) => e.sourceSystem === sourceSystem);
}

/** ISO 8601 date strings sort lexicographically, so plain string comparison is enough here. */
export function selectTimelineEventsInRange(state, startISO, endISO) {
  return Object.values(state.timelineEvents).filter((e) => {
    const eventEnd = e.end || e.start;
    return eventEnd >= startISO && e.start <= endISO;
  });
}

export function selectRelationshipSignalById(state, id) {
  return state.relationshipSignals[id] || null;
}

/** Order-independent lookup of every RelationshipSignal between two people. */
export function selectRelationshipSignalsForPair(state, personAId, personBId) {
  return Object.values(state.relationshipSignals).filter(
    (r) =>
      (r.personAId === personAId && r.personBId === personBId) ||
      (r.personAId === personBId && r.personBId === personAId)
  );
}

export function selectRelationshipSignalsByDimension(state, dimension) {
  return Object.values(state.relationshipSignals).filter((r) => r.dimension === dimension);
}

/**
 * Tally of calculation statuses across all loaded evidence. A count is
 * not an interpretation — it's the same kind of aggregate a UI list
 * filter/badge count would need, not a new claim about the person.
 */
export function selectCalculationStatusSummary(state) {
  const summary = { verified: 0, approximate: 0, unavailable: 0 };
  Object.values(state.evidenceBySource).forEach((list) => {
    list.forEach((evidence) => {
      summary[evidence.calculationStatus] += 1;
    });
  });
  return summary;
}
