/*
 * OMC 2.0 — RelationshipSignal contract (Phase 03)
 *
 * IMPORTANT — provenance note: unlike SystemSignal/Evidence/Pattern/
 * TimelineEvent, this shape is NOT given verbatim in Design Spec §18
 * (which only lists those four). The roadmap's Phase 03 task list
 * explicitly says "Define RelationshipSignal" anyway, so this is Phase
 * 03's own extrapolation — modeled after SystemSignal's shape for
 * consistency, with `dimension` drawn from §10 Relationship Dynamics'
 * prose list (communication, emotional, energy/pace, values, conflict,
 * closeness vs autonomy, complementary differences, growth) instead of
 * a `domain`, and `personAId`/`personBId` instead of a single owner.
 * Flagging this clearly so a later phase doesn't mistake it for a
 * literal spec quote — see docs/PHASE_03_COMPLETION.md.
 *
 * Design Spec §10 requirements this shape must satisfy:
 * - "Two-person model instead of one compatibility percentage" → no
 *   single scalar score field; strength/confidence describe the
 *   dimension's evidence, not a compatibility verdict.
 * - "Evidence trail for every relational conclusion" → contributingSignalIds
 *   ties back to each person's own SystemSignals.
 * - A compatibility percentage may exist only as a secondary,
 *   transparent visualization — deliberately not modeled as a contract
 *   field so no future UI can make it the headline by default.
 *
 * @typedef {Object} RelationshipSignal
 * @property {string} id
 * @property {'communication'|'emotional'|'energy-pace'|'values'|'conflict'|'closeness-autonomy'|'complementary'|'growth'} dimension
 * @property {string} personAId
 * @property {string} personBId
 * @property {string} synthesis - human-readable interpretive statement of the dynamic
 * @property {number} strength - 0..1
 * @property {'HIGH'|'MEDIUM'|'LOW'|'CONTESTED'} confidence
 * @property {string[]} contributingSignalIds - SystemSignal ids (from either person) this dynamic is built from
 * @property {string[]} tensions - ids of signals/relationship signals that push against this one
 * @property {string} temporalScope
 */

import {
  RELATIONSHIP_DIMENSIONS,
  CONFIDENCE_LEVELS,
  assertOneOf,
  assertString,
  assertArray,
  assertNumber,
} from './enums.js';

/**
 * @param {Partial<RelationshipSignal>} data
 * @returns {RelationshipSignal}
 */
export function createRelationshipSignal(data) {
  const signal = {
    id: data.id,
    dimension: data.dimension,
    personAId: data.personAId,
    personBId: data.personBId,
    synthesis: data.synthesis,
    strength: data.strength,
    confidence: data.confidence,
    contributingSignalIds: data.contributingSignalIds || [],
    tensions: data.tensions || [],
    temporalScope: data.temporalScope,
  };

  assertString(signal.id, 'RelationshipSignal.id');
  assertOneOf(signal.dimension, RELATIONSHIP_DIMENSIONS, 'RelationshipSignal.dimension');
  assertString(signal.personAId, 'RelationshipSignal.personAId');
  assertString(signal.personBId, 'RelationshipSignal.personBId');
  if (signal.personAId === signal.personBId) {
    throw new TypeError('RelationshipSignal: personAId and personBId must differ');
  }
  assertString(signal.synthesis, 'RelationshipSignal.synthesis');
  assertNumber(signal.strength, 'RelationshipSignal.strength');
  if (signal.strength < 0 || signal.strength > 1) {
    throw new TypeError(`RelationshipSignal.strength: expected 0..1, got ${signal.strength}`);
  }
  assertOneOf(signal.confidence, CONFIDENCE_LEVELS, 'RelationshipSignal.confidence');
  assertArray(signal.contributingSignalIds, 'RelationshipSignal.contributingSignalIds');
  signal.contributingSignalIds.forEach((s, i) =>
    assertString(s, `RelationshipSignal.contributingSignalIds[${i}]`)
  );
  if (signal.contributingSignalIds.length === 0) {
    throw new TypeError(
      'RelationshipSignal.contributingSignalIds: must not be empty — ' +
        'every relational conclusion needs an evidence trail (Design Spec §10).'
    );
  }
  assertArray(signal.tensions, 'RelationshipSignal.tensions');
  signal.tensions.forEach((t, i) => assertString(t, `RelationshipSignal.tensions[${i}]`));
  assertString(signal.temporalScope, 'RelationshipSignal.temporalScope');

  return Object.freeze(signal);
}
