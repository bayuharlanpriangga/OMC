/*
 * OMC 2.0 — Shared contract vocabulary (Phase 03: Core Contracts & State)
 *
 * Single source of truth for the enums referenced by every contract in
 * this directory, so a lens phase (04–08) and an intelligence phase
 * (09–13) always agree on the same string values.
 */

// The five metaphysical systems. Values match the `system` field already
// used in src/shell/routes.js (Phase 02) so a SystemSignal.system can be
// used directly as a sidebar/route lookup key without translation.
export const SYSTEMS = Object.freeze([
  'astrology',
  'human-design',
  'bazi',
  'ziwei',
  'numerology',
]);

// Living Self Model core dimensions (Design Spec §2) — the cross-system
// "domain" a signal, pattern, or timeline event belongs to.
export const DOMAINS = Object.freeze([
  'identity',
  'mind',
  'emotion',
  'energy',
  'values',
  'work',
  'relationships',
  'time',
]);

// Evidence & Explainability confidence scale (Design Spec §5).
export const CONFIDENCE_LEVELS = Object.freeze([
  'HIGH',
  'MEDIUM',
  'LOW',
  'CONTESTED',
]);

// Calculation Integrity status (Design Spec §5, §19) — "verified,
// approximate, or unavailable", never a silent approximation.
export const CALCULATION_STATUSES = Object.freeze([
  'verified',
  'approximate',
  'unavailable',
]);

// Pattern Intelligence Engine pattern types (Design Spec §4 table).
// Kept as the exact labels from the spec table, including the
// space-containing "Temporal Activation".
export const PATTERN_TYPES = Object.freeze([
  'Convergence',
  'Contradiction',
  'Compensation',
  'Conditional',
  'Temporal Activation',
  'Latent',
  'Recurrence',
  'Interaction',
]);

// Relationship Dynamics dimensions (Design Spec §10). RelationshipSignal
// itself is not enumerated in §18 Data Contracts — this list is Phase
// 03's own extrapolation from §10's prose list, documented here and in
// relationship-signal.js rather than silently invented.
export const RELATIONSHIP_DIMENSIONS = Object.freeze([
  'communication',
  'emotional',
  'energy-pace',
  'values',
  'conflict',
  'closeness-autonomy',
  'complementary',
  'growth',
]);

// Personal Knowledge Graph edge types (Design Spec §3) — how one signal
// or pattern relates to another. Used by Pattern.tensions and future
// graph-shaped views; not a field on every contract.
export const EDGE_TYPES = Object.freeze([
  'supports',
  'contradicts',
  'amplifies',
  'compensates',
  'activates',
  'contextualizes',
  'derives-from',
]);

export function assertOneOf(value, allowed, fieldName) {
  if (!allowed.includes(value)) {
    throw new TypeError(
      `${fieldName}: expected one of [${allowed.join(', ')}], got ${JSON.stringify(
        value
      )}`
    );
  }
}

export function assertString(value, fieldName) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${fieldName}: expected a non-empty string, got ${JSON.stringify(value)}`);
  }
}

export function assertArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${fieldName}: expected an array, got ${JSON.stringify(value)}`);
  }
}

export function assertNumber(value, fieldName) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError(`${fieldName}: expected a number, got ${JSON.stringify(value)}`);
  }
}
