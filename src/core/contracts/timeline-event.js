/*
 * OMC 2.0 — TimelineEvent contract (Phase 03)
 *
 * Design Spec §18: "TimelineEvent { id, sourceSystem, start, end,
 * signalIds[], intensity, interpretation }"
 *
 * One entry in the unified timeline (§9 — astrology transits, BaZi Luck
 * Pillars, Numerology cycles, Zi Wei cycles all become TimelineEvents so
 * Life Replay can render them on one axis). A manually-added personal
 * event (§9: "User can add personal events manually... never treated as
 * proof of a system prediction") is represented the same shape with
 * sourceSystem: 'personal' and signalIds: [].
 *
 * @typedef {Object} TimelineEvent
 * @property {string} id
 * @property {'astrology'|'human-design'|'bazi'|'ziwei'|'numerology'|'personal'} sourceSystem
 * @property {string} start - ISO 8601 date
 * @property {string} [end] - ISO 8601 date; omitted for a point-in-time event
 * @property {string[]} signalIds - SystemSignal ids active during this period (empty for personal events)
 * @property {number} intensity - 0..1, how prominent this period/event is
 * @property {string} interpretation - human-readable framing; future periods must read as symbolic context, not guaranteed events (§9)
 */

import { SYSTEMS, assertOneOf, assertString, assertArray, assertNumber } from './enums.js';

const TIMELINE_SOURCE_SYSTEMS = Object.freeze([...SYSTEMS, 'personal']);

/**
 * @param {Partial<TimelineEvent>} data
 * @returns {TimelineEvent}
 */
export function createTimelineEvent(data) {
  const event = {
    id: data.id,
    sourceSystem: data.sourceSystem,
    start: data.start,
    end: data.end,
    signalIds: data.signalIds || [],
    intensity: data.intensity,
    interpretation: data.interpretation,
  };

  assertString(event.id, 'TimelineEvent.id');
  assertOneOf(event.sourceSystem, TIMELINE_SOURCE_SYSTEMS, 'TimelineEvent.sourceSystem');
  assertString(event.start, 'TimelineEvent.start');
  if (event.end !== undefined) {
    assertString(event.end, 'TimelineEvent.end');
  }
  assertArray(event.signalIds, 'TimelineEvent.signalIds');
  event.signalIds.forEach((s, i) => assertString(s, `TimelineEvent.signalIds[${i}]`));
  if (event.sourceSystem === 'personal' && event.signalIds.length > 0) {
    throw new TypeError(
      'TimelineEvent.signalIds: a personal event must not carry signalIds — ' +
        'personal events are never treated as proof of a system prediction (Design Spec §9).'
    );
  }
  assertNumber(event.intensity, 'TimelineEvent.intensity');
  if (event.intensity < 0 || event.intensity > 1) {
    throw new TypeError(`TimelineEvent.intensity: expected 0..1, got ${event.intensity}`);
  }
  assertString(event.interpretation, 'TimelineEvent.interpretation');

  return Object.freeze(event);
}
