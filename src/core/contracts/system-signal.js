/*
 * OMC 2.0 — SystemSignal contract (Phase 03)
 *
 * Design Spec §18: "SystemSignal { id, system, domain, label, value,
 * strength, confidence, temporalScope, sources[] }"
 *
 * A SystemSignal is one atomic observation from one system (e.g.
 * Astrology's "Sun in Capricorn" or Human Design's "Sacral defined").
 * Patterns (pattern.js) are built FROM signals; a signal never
 * references a Pattern back.
 *
 * @typedef {Object} SystemSignal
 * @property {string} id
 * @property {'astrology'|'human-design'|'bazi'|'ziwei'|'numerology'} system
 * @property {'identity'|'mind'|'emotion'|'energy'|'values'|'work'|'relationships'|'time'} domain
 * @property {string} label - short human-readable description
 * @property {string|number} value - the raw or normalized value (e.g. "Capricorn", 7)
 * @property {number} strength - 0..1, how strongly this signal is expressed
 * @property {'HIGH'|'MEDIUM'|'LOW'|'CONTESTED'} confidence
 * @property {string} temporalScope - e.g. "natal", "current-transit", "2024-luck-pillar"
 * @property {string[]} sources - source entity ids this signal derives from (Personal Knowledge Graph node ids)
 */

import {
  SYSTEMS,
  DOMAINS,
  CONFIDENCE_LEVELS,
  assertOneOf,
  assertString,
  assertArray,
  assertNumber,
} from './enums.js';

/**
 * @param {Partial<SystemSignal>} data
 * @returns {SystemSignal}
 */
export function createSystemSignal(data) {
  const signal = {
    id: data.id,
    system: data.system,
    domain: data.domain,
    label: data.label,
    value: data.value,
    strength: data.strength,
    confidence: data.confidence,
    temporalScope: data.temporalScope,
    sources: data.sources || [],
  };

  assertString(signal.id, 'SystemSignal.id');
  assertOneOf(signal.system, SYSTEMS, 'SystemSignal.system');
  assertOneOf(signal.domain, DOMAINS, 'SystemSignal.domain');
  assertString(signal.label, 'SystemSignal.label');

  if (typeof signal.value !== 'string' && typeof signal.value !== 'number') {
    throw new TypeError(
      `SystemSignal.value: expected a string or number, got ${JSON.stringify(signal.value)}`
    );
  }

  assertNumber(signal.strength, 'SystemSignal.strength');
  if (signal.strength < 0 || signal.strength > 1) {
    throw new TypeError(`SystemSignal.strength: expected 0..1, got ${signal.strength}`);
  }

  assertOneOf(signal.confidence, CONFIDENCE_LEVELS, 'SystemSignal.confidence');
  assertString(signal.temporalScope, 'SystemSignal.temporalScope');
  assertArray(signal.sources, 'SystemSignal.sources');
  signal.sources.forEach((s, i) => assertString(s, `SystemSignal.sources[${i}]`));

  return Object.freeze(signal);
}
