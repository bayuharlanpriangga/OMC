/*
 * OMC 2.0 — Evidence contract (Phase 03)
 *
 * Design Spec §18: "Evidence { system, sourceId, claim, strength,
 * calculationStatus, engineVersion }"
 *
 * Evidence is what an Evidence Drawer (§5) shows: which system, which
 * source entity, what the claim is, how strong it is, and whether the
 * number behind it was verified/approximate/unavailable. It intentionally
 * duplicates system+strength from SystemSignal rather than only holding
 * a signal id, because a single signal can have multiple pieces of
 * supporting/conflicting evidence with different claims and confidence
 * in that evidence specifically (§5: "supporting evidence and
 * conflicting evidence separately").
 *
 * @typedef {Object} Evidence
 * @property {'astrology'|'human-design'|'bazi'|'ziwei'|'numerology'} system
 * @property {string} sourceId - id of the SystemSignal or raw source entity this evidence supports/contests
 * @property {string} claim - human-readable statement of what this evidence shows
 * @property {number} strength - 0..1
 * @property {'verified'|'approximate'|'unavailable'} calculationStatus
 * @property {string} engineVersion
 */

import { SYSTEMS, CALCULATION_STATUSES, assertOneOf, assertString, assertNumber } from './enums.js';

/**
 * @param {Partial<Evidence>} data
 * @returns {Evidence}
 */
export function createEvidence(data) {
  const evidence = {
    system: data.system,
    sourceId: data.sourceId,
    claim: data.claim,
    strength: data.strength,
    calculationStatus: data.calculationStatus,
    engineVersion: data.engineVersion,
  };

  assertOneOf(evidence.system, SYSTEMS, 'Evidence.system');
  assertString(evidence.sourceId, 'Evidence.sourceId');
  assertString(evidence.claim, 'Evidence.claim');
  assertNumber(evidence.strength, 'Evidence.strength');
  if (evidence.strength < 0 || evidence.strength > 1) {
    throw new TypeError(`Evidence.strength: expected 0..1, got ${evidence.strength}`);
  }
  assertOneOf(evidence.calculationStatus, CALCULATION_STATUSES, 'Evidence.calculationStatus');
  assertString(evidence.engineVersion, 'Evidence.engineVersion');

  return Object.freeze(evidence);
}
