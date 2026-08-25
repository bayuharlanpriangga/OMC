import { describe, it, expect } from 'vitest';
import {
  createSystemSignal,
  createEvidence,
  createPattern,
  createTimelineEvent,
  createRelationshipSignal,
  createCalculationMetadata,
  SYSTEMS,
  DOMAINS,
  CONFIDENCE_LEVELS,
  CALCULATION_STATUSES,
  PATTERN_TYPES,
  RELATIONSHIP_DIMENSIONS,
} from '../src/core/contracts/index.js';

const validSignal = {
  id: 'sig-1',
  system: 'astrology',
  domain: 'work',
  label: 'Sun in Capricorn',
  value: 'Capricorn',
  strength: 0.8,
  confidence: 'HIGH',
  temporalScope: 'natal',
  sources: ['entity-1'],
};

describe('enums', () => {
  it('exposes the five systems, eight domains, four confidence levels, three calculation statuses', () => {
    expect(SYSTEMS).toHaveLength(5);
    expect(DOMAINS).toHaveLength(8);
    expect(CONFIDENCE_LEVELS).toEqual(['HIGH', 'MEDIUM', 'LOW', 'CONTESTED']);
    expect(CALCULATION_STATUSES).toEqual(['verified', 'approximate', 'unavailable']);
    expect(PATTERN_TYPES).toContain('Temporal Activation');
    expect(RELATIONSHIP_DIMENSIONS).toHaveLength(8);
  });
});

describe('SystemSignal', () => {
  it('accepts a valid signal and freezes it', () => {
    const signal = createSystemSignal(validSignal);
    expect(signal.id).toBe('sig-1');
    expect(Object.isFrozen(signal)).toBe(true);
  });

  it('rejects an unknown system', () => {
    expect(() => createSystemSignal({ ...validSignal, system: 'tarot' })).toThrow(/system/);
  });

  it('rejects an unknown domain', () => {
    expect(() => createSystemSignal({ ...validSignal, domain: 'career' })).toThrow(/domain/);
  });

  it('rejects strength outside 0..1', () => {
    expect(() => createSystemSignal({ ...validSignal, strength: 1.5 })).toThrow(/strength/);
  });

  it('rejects an invalid confidence level', () => {
    expect(() => createSystemSignal({ ...validSignal, confidence: 'VERY_HIGH' })).toThrow(
      /confidence/
    );
  });

  it('defaults sources to an empty array when omitted', () => {
    const rest = { ...validSignal };
    delete rest.sources;
    const signal = createSystemSignal(rest);
    expect(signal.sources).toEqual([]);
  });
});

describe('Evidence', () => {
  const validEvidence = {
    system: 'astrology',
    sourceId: 'sig-1',
    claim: 'Sun longitude falls within Capricorn.',
    strength: 0.9,
    calculationStatus: 'verified',
    engineVersion: 'engine.js@phase01',
  };

  it('accepts valid evidence', () => {
    expect(createEvidence(validEvidence).calculationStatus).toBe('verified');
  });

  it('rejects an invalid calculationStatus', () => {
    expect(() =>
      createEvidence({ ...validEvidence, calculationStatus: 'guessed' })
    ).toThrow(/calculationStatus/);
  });
});

describe('CalculationMetadata', () => {
  it('requires a note when status is approximate', () => {
    expect(() =>
      createCalculationMetadata({
        calculationStatus: 'approximate',
        engineVersion: 'engine.js@phase01',
      })
    ).toThrow(/note/);
  });

  it('requires a note when status is unavailable', () => {
    expect(() =>
      createCalculationMetadata({
        calculationStatus: 'unavailable',
        engineVersion: 'engine.js@phase01',
      })
    ).toThrow(/note/);
  });

  it('does not require a note when status is verified', () => {
    expect(() =>
      createCalculationMetadata({
        calculationStatus: 'verified',
        engineVersion: 'engine.js@phase01',
      })
    ).not.toThrow();
  });
});

describe('Pattern', () => {
  const validPattern = {
    id: 'pat-1',
    domain: 'work',
    type: 'Convergence',
    signals: ['sig-1', 'sig-2'],
    synthesis: 'Two systems point toward the same theme.',
    confidence: 'MEDIUM',
    tensions: [],
    temporalContext: 'natal',
  };

  it('accepts a valid pattern', () => {
    expect(createPattern(validPattern).type).toBe('Convergence');
  });

  it('rejects an unknown pattern type', () => {
    expect(() => createPattern({ ...validPattern, type: 'Coincidence' })).toThrow(/type/);
  });

  it('requires at least one signal', () => {
    expect(() => createPattern({ ...validPattern, signals: [] })).toThrow(/signal/);
  });
});

describe('TimelineEvent', () => {
  const validEvent = {
    id: 'tl-1',
    sourceSystem: 'astrology',
    start: '2024-01-01',
    end: '2024-06-01',
    signalIds: ['sig-1'],
    intensity: 0.7,
    interpretation: 'A notable transit period.',
  };

  it('accepts a valid system-sourced event', () => {
    expect(createTimelineEvent(validEvent).sourceSystem).toBe('astrology');
  });

  it('accepts a personal event with no signalIds', () => {
    const event = createTimelineEvent({
      id: 'tl-personal-1',
      sourceSystem: 'personal',
      start: '2023-01-01',
      signalIds: [],
      intensity: 0.4,
      interpretation: 'User-added life note.',
    });
    expect(event.sourceSystem).toBe('personal');
  });

  it('rejects a personal event that carries signalIds (never proof of a system prediction)', () => {
    expect(() =>
      createTimelineEvent({ ...validEvent, sourceSystem: 'personal', signalIds: ['sig-1'] })
    ).toThrow(/personal event/);
  });

  it('rejects intensity outside 0..1', () => {
    expect(() => createTimelineEvent({ ...validEvent, intensity: 2 })).toThrow(/intensity/);
  });
});

describe('RelationshipSignal', () => {
  const validRelSignal = {
    id: 'rel-1',
    dimension: 'emotional',
    personAId: 'person-a',
    personBId: 'person-b',
    synthesis: 'A notable emotional dynamic between the two.',
    strength: 0.6,
    confidence: 'MEDIUM',
    contributingSignalIds: ['sig-a-1', 'sig-b-1'],
    tensions: [],
    temporalScope: 'natal',
  };

  it('accepts a valid relationship signal', () => {
    expect(createRelationshipSignal(validRelSignal).dimension).toBe('emotional');
  });

  it('rejects an unknown dimension', () => {
    expect(() => createRelationshipSignal({ ...validRelSignal, dimension: 'chemistry' })).toThrow(
      /dimension/
    );
  });

  it('rejects personAId === personBId', () => {
    expect(() =>
      createRelationshipSignal({ ...validRelSignal, personBId: 'person-a' })
    ).toThrow(/differ/);
  });

  it('requires at least one contributing signal (evidence trail, §10)', () => {
    expect(() =>
      createRelationshipSignal({ ...validRelSignal, contributingSignalIds: [] })
    ).toThrow(/contributingSignalIds/);
  });
});
