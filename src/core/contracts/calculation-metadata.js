/*
 * OMC 2.0 — Calculation status & engine version metadata (Phase 03)
 *
 * Roadmap Phase 03 task: "Define calculation status and engine version
 * metadata." This is the small shared shape that Evidence (and, later,
 * any derived result) attaches so the UI can always show whether a
 * number came from a verified calculation, an approximation, or
 * couldn't be produced at all (Design Spec §5, §19 — "no silent
 * approximation").
 *
 * @typedef {Object} CalculationMetadata
 * @property {'verified'|'approximate'|'unavailable'} calculationStatus
 * @property {string} engineVersion - e.g. "engine.js@phase01"
 * @property {string} [calculatedAt] - ISO 8601 timestamp, optional
 * @property {string} [note] - human-readable caveat, required when
 *   calculationStatus is 'approximate' or 'unavailable'
 */

import { CALCULATION_STATUSES, assertOneOf, assertString } from './enums.js';

/**
 * The current engine's identity for provenance stamping. Bumped
 * manually when src/core/engine.js's output shape or calculation
 * behavior changes; see docs/ARCHITECTURE.md migration rule 4.
 */
export const CURRENT_ENGINE_VERSION = 'engine.js@phase01';

/**
 * @param {Partial<CalculationMetadata>} data
 * @returns {CalculationMetadata}
 */
export function createCalculationMetadata(data) {
  const meta = {
    calculationStatus: data.calculationStatus,
    engineVersion: data.engineVersion,
    calculatedAt: data.calculatedAt,
    note: data.note,
  };

  assertOneOf(meta.calculationStatus, CALCULATION_STATUSES, 'calculationStatus');
  assertString(meta.engineVersion, 'engineVersion');

  if (meta.calculatedAt !== undefined) {
    assertString(meta.calculatedAt, 'calculatedAt');
  }

  if (
    (meta.calculationStatus === 'approximate' ||
      meta.calculationStatus === 'unavailable') &&
    !meta.note
  ) {
    throw new TypeError(
      'CalculationMetadata: "note" is required when calculationStatus is ' +
        '"approximate" or "unavailable" — no silent approximation (Design Spec §19).'
    );
  }

  return Object.freeze(meta);
}
