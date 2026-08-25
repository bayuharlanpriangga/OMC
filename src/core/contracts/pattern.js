/*
 * OMC 2.0 — Pattern contract (Phase 03)
 *
 * Design Spec §18: "Pattern { id, domain, type, signals[], synthesis,
 * confidence, tensions[], temporalContext }"
 *
 * Phase 03 defines this SHAPE only. Actually computing patterns from
 * signals (cross-system synthesis) is Phase 09 (Pattern Intelligence) —
 * explicitly out of scope here (roadmap: "No cross-system synthesis").
 * The fixture provider in ../state/fixture-provider.js includes a
 * couple of hand-authored example Patterns purely so downstream code
 * has something real to validate this contract against; they are not
 * produced by any synthesis logic.
 *
 * @typedef {Object} Pattern
 * @property {string} id
 * @property {'identity'|'mind'|'emotion'|'energy'|'values'|'work'|'relationships'|'time'} domain
 * @property {'Convergence'|'Contradiction'|'Compensation'|'Conditional'|'Temporal Activation'|'Latent'|'Recurrence'|'Interaction'} type
 * @property {string[]} signals - SystemSignal ids this pattern is built from
 * @property {string} synthesis - human-readable interpretive statement (must stay interpretive, not scientific-certainty language — §4)
 * @property {'HIGH'|'MEDIUM'|'LOW'|'CONTESTED'} confidence
 * @property {string[]} tensions - ids of signals/patterns that push against this one
 * @property {string} temporalContext - e.g. "natal", "current-period", "2019-2022"
 */

import {
  DOMAINS,
  PATTERN_TYPES,
  CONFIDENCE_LEVELS,
  assertOneOf,
  assertString,
  assertArray,
} from './enums.js';

/**
 * @param {Partial<Pattern>} data
 * @returns {Pattern}
 */
export function createPattern(data) {
  const pattern = {
    id: data.id,
    domain: data.domain,
    type: data.type,
    signals: data.signals || [],
    synthesis: data.synthesis,
    confidence: data.confidence,
    tensions: data.tensions || [],
    temporalContext: data.temporalContext,
  };

  assertString(pattern.id, 'Pattern.id');
  assertOneOf(pattern.domain, DOMAINS, 'Pattern.domain');
  assertOneOf(pattern.type, PATTERN_TYPES, 'Pattern.type');
  assertArray(pattern.signals, 'Pattern.signals');
  pattern.signals.forEach((s, i) => assertString(s, `Pattern.signals[${i}]`));
  if (pattern.signals.length === 0) {
    throw new TypeError('Pattern.signals: a pattern must reference at least one signal');
  }
  assertString(pattern.synthesis, 'Pattern.synthesis');
  assertOneOf(pattern.confidence, CONFIDENCE_LEVELS, 'Pattern.confidence');
  assertArray(pattern.tensions, 'Pattern.tensions');
  pattern.tensions.forEach((t, i) => assertString(t, `Pattern.tensions[${i}]`));
  assertString(pattern.temporalContext, 'Pattern.temporalContext');

  return Object.freeze(pattern);
}
