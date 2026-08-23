// Phase 01 — Baseline & Extraction acceptance test.
//
// Two layers of protection:
//  1. Hard-coded expectations carried over from the legacy VALIDATION_CASES
//     (index.html ~line 6038) — these encode facts the product author already
//     verified against real charts, so they must never silently drift.
//  2. Full-object snapshot fixtures (tests/fixtures/engine-snapshots.json) —
//     these catch ANY change to the extracted engine's output, intentional
//     or not, across all five systems in one go.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { computeChart } from '../src/core/engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(
  readFileSync(path.join(__dirname, 'fixtures', 'engine-snapshots.json'), 'utf8')
);

describe('legacy VALIDATION_CASES parity (index.html ~6038)', () => {
  it('Bayu (real) — 2005-04-18 10:28, Cirebon-ish coords', () => {
    const D = computeChart('Bayu (real)', '2005-04-18', '10:28', 'test', -6.732, 108.552, 7);
    expect(D.planets.Sun.sign).toBe('Aries');
    expect(D.planets.Moon.sign).toBe('Leo');
    expect(D.planets.Ascendant.sign).toBe('Cancer');
    expect(D.planets.Mercury.sign).toBe('Aries');
    expect(D.planets.Venus.sign).toBe('Taurus');
    expect(D.planets.Mars.sign).toBe('Aquarius');
    expect(D.planets.Jupiter.sign).toBe('Libra');
    expect(D.planets.Saturn.sign).toBe('Cancer');
    expect(D.planets.Uranus.sign).toBe('Pisces');
    expect(D.planets.Neptune.sign).toBe('Aquarius');
    expect(D.planets.Pluto.sign).toBe('Sagittarius');
    expect(D.bazi.dayMaster).toBe('Yang Water');
    expect(D.bazi.year.el).toBe('Yin Wood');
    expect(D.bazi.month.el).toBe('Yang Metal');
  });

  it('J2000 test — 2000-01-01 12:00 UTC at (0,0)', () => {
    const D = computeChart('J2000 test', '2000-01-01', '12:00', 'test', 0, 0, 0);
    expect(D.planets.Sun.sign).toBe('Capricorn');
  });

  it('Feb 3 1995 (before lichun) — previous BaZi year applies', () => {
    const D = computeChart('t', '1995-02-03', '12:00', 'test', -6.2, 106.8, 7);
    expect(D.bazi.year.el).toBe('Yang Wood'); // 1994 Jia Xu year
  });

  it('Feb 6 1995 (after lichun) — new BaZi year applies', () => {
    const D = computeChart('t', '1995-02-06', '12:00', 'test', -6.2, 106.8, 7);
    expect(D.bazi.year.el).toBe('Yin Wood'); // 1995 Yi Hai year
  });
});

describe('full-output snapshot regression', () => {
  for (const [id, fx] of Object.entries(fixtures)) {
    it(`matches recorded snapshot: ${id}`, () => {
      const { name, date, time, city, lat, lon, tz } = fx.input;
      const D = computeChart(name, date, time, city, lat, lon, tz);
      expect(D).toEqual(fx.output);
    });
  }
});

describe('known structural invariants (Phase 01 sanity checks)', () => {
  it('always returns all 11 chart points', () => {
    const D = computeChart('t', '1990-06-01', '08:00', 'test', -6.2, 106.8, 7);
    const expected = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','Ascendant'];
    expect(Object.keys(D.planets).sort()).toEqual(expected.sort());
  });

  it('without a birth time, Ascendant falls back to the Sun position (documented approximation)', () => {
    const D = computeChart('t', '1990-06-01', '', 'test', -6.2, 106.8, 7);
    expect(D.planets.Ascendant.sign).toBe(D.planets.Sun.sign);
  });

  it('BaZi five-element counts are internally consistent (weighted hidden stems included)', () => {
    const D = computeChart('t', '1990-06-01', '08:00', 'test', -6.2, 106.8, 7);
    const total = Object.values(D.bazi.baziEls).reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThan(0);
  });
});
