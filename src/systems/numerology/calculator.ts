import { BirthProfile } from '../../types/birth-data';
import {
  NumerologyCalculationResult,
  NumerologyFigure,
  NumerologyNumber,
  NumerologyPeriod,
} from './types';

const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

const KARMIC_DEBT_NUMBERS = [13, 14, 16, 19];
const isVowelLetter = (ch: string) => 'AEIOU'.includes(ch);

const NUMBER_METADATA: Record<number, { name: string; tagline: string; keywords: string[] }> = {
  1: { name: 'The Sovereign Pioneer', tagline: 'Originality, Leadership & Independence', keywords: ['Initiative', 'Courage', 'Willpower', 'Autonomy'] },
  2: { name: 'The Harmonious Diplomat', tagline: 'Cooperation, Intuition & Partnership', keywords: ['Receptivity', 'Balance', 'Empathy', 'Peacemaker'] },
  3: { name: 'The Radiant Creator', tagline: 'Self-Expression, Joy & Verbal Radiance', keywords: ['Optimism', 'Imagination', 'Artistry', 'Charisma'] },
  4: { name: 'The Master Architect', tagline: 'Structure, Diligence & Foundation', keywords: ['Stability', 'Discipline', 'Order', 'Realism'] },
  5: { name: 'The Dynamic Catalyst', tagline: 'Freedom, Adaptability & Adventure', keywords: ['Versatility', 'Expansion', 'Curiosity', 'Movement'] },
  6: { name: 'The Sacred Caregiver', tagline: 'Responsibility, Healing & Compassion', keywords: ['Nurturance', 'Harmonization', 'Community', 'Integrity'] },
  7: { name: 'The Solitary Mystic', tagline: 'Wisdom, Contemplation & Analysis', keywords: ['Truth-Seeker', 'Depth', 'Intuition', 'Intellect'] },
  8: { name: 'The Sovereign Manifestor', tagline: 'Executive Power, Abundance & Mastery', keywords: ['Authority', 'Material Mastery', 'Vision', 'Efficiency'] },
  9: { name: 'The Universal Humanitarian', tagline: 'Compassion, Completion & Transcendence', keywords: ['Altruism', 'Wisdom', 'Surrender', 'Universality'] },
  11: { name: 'The Master Illuminator', tagline: 'High Spiritual Intuition & Revelation', keywords: ['Transcendence', 'Inspiration', 'Psychic Channel', 'Visionary'] },
  22: { name: 'The Master Builder', tagline: 'Transforming Cosmic Blueprints into Tangible Reality', keywords: ['Architect of Future', 'Enduring Legacy', 'Large Scale', 'Manifestation'] },
  33: { name: 'The Master Teacher', tagline: 'Cosmic Compassion & Spiritual Upliftment', keywords: ['Universal Devotion', 'Selfless Love', 'Divine Guidance', 'Awakener'] },
};

function reduceNumber(num: number, preserveMaster = true): { value: number; isMaster: boolean } {
  if (preserveMaster && (num === 11 || num === 22 || num === 33)) {
    return { value: num, isMaster: true };
  }
  if (num <= 9) {
    return { value: num, isMaster: false };
  }
  const sum = String(num)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return reduceNumber(sum, preserveMaster);
}

function toFigure(raw: number): NumerologyFigure {
  const value = reduceNumber(raw, true).value;
  const base = reduceNumber(raw, false).value;
  const isMasterNumber = value !== base;
  const compound = raw > 9 ? raw : null;
  let display: string;
  if (compound === null) display = String(value);
  else if (isMasterNumber) display = compound === value ? `${compound}/${base}` : `${compound}/${value}/${base}`;
  else display = `${compound}/${value}`;
  return { value, base, compound, isMasterNumber, display };
}

function getNumberDetails(raw: number): NumerologyNumber {
  const fig = toFigure(raw);
  const meta = NUMBER_METADATA[fig.value] || {
    name: `Vibration ${fig.value}`,
    tagline: 'Harmonic frequency',
    keywords: ['Resonance'],
  };
  return { ...fig, name: meta.name, tagline: meta.tagline, keywords: meta.keywords };
}

/** Nama → bagian-bagian (depan, tengah, belakang) berisi huruf A–Z saja; aksen dinormalisasi (é → E). */
function splitNameParts(raw: string): string[] {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .split(/\s+/)
    .map((p) => p.replace(/[^A-Z]/g, ''))
    .filter(Boolean);
}

/** Y dihitung vokal hanya jika tidak bersebelahan dengan vokal lain (Bayu → konsonan, Lynn/Mary → vokal). */
function isVowelAt(part: string, i: number): boolean {
  const ch = part[i];
  if (isVowelLetter(ch)) return true;
  if (ch !== 'Y') return false;
  const prev = part[i - 1];
  const next = part[i + 1];
  return !(prev && isVowelLetter(prev)) && !(next && isVowelLetter(next));
}

const letterValue = (ch: string) => PYTHAGOREAN_MAP[ch] || 0;

/**
 * Metode per-nama: tiap bagian nama direduksi dulu (master number dipertahankan), lalu hasilnya dijumlahkan.
 * Angka majemuk (14, 24, 17, ...) berasal dari penjumlahan ini.
 */
function sumByParts(parts: string[], pick: (isVowel: boolean) => boolean): NumerologyFigure {
  let compound = 0;
  for (const part of parts) {
    let s = 0;
    for (let i = 0; i < part.length; i++) {
      if (pick(isVowelAt(part, i))) s += letterValue(part[i]);
    }
    if (s > 0) compound += reduceNumber(s, true).value;
  }
  return toFigure(compound);
}

function buildPeriods(values: number[], boundaries: Array<[number, number | null]>): NumerologyPeriod[] {
  return values.map((value, i) => ({ value, startAge: boundaries[i][0], endAge: boundaries[i][1] }));
}

export function calculateNumerology(
  profile: BirthProfile,
  _settings: Record<string, any> = {}
): NumerologyCalculationResult {
  const [yStr, mStr, dStr] = profile.birthDate.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);

  // ---------- Angka kelahiran ----------
  // Life Path: reduksi bulan, hari, tahun masing-masing dulu (master number dipertahankan), lalu dijumlahkan.
  const redMonth = reduceNumber(m, true);
  const redDay = reduceNumber(d, true);
  const redYear = reduceNumber(y, true);
  const lifePathRaw = redMonth.value + redDay.value + redYear.value;
  const lifePathFigure = toFigure(lifePathRaw);
  const birthDayFigure = toFigure(d);
  const lifePathNumber = getNumberDetails(lifePathRaw);
  const birthdayNumber = getNumberDetails(d);

  // Pinnacle: P1 = bulan + hari, P2 = hari + tahun, P3 = P1 + P2, P4 = bulan + tahun.
  const p1 = reduceNumber(redMonth.value + redDay.value, true).value;
  const p2 = reduceNumber(redDay.value + redYear.value, true).value;
  const p3 = reduceNumber(p1 + p2, true).value;
  const p4 = reduceNumber(redMonth.value + redYear.value, true).value;
  // Pinnacle pertama berakhir di usia 36 − Life Path (angka tunggal), tiap pinnacle berikutnya 9 tahun.
  const end1 = 36 - lifePathFigure.base;
  const pinnacles = buildPeriods(
    [p1, p2, p3, p4],
    [[0, end1], [end1 + 1, end1 + 9], [end1 + 10, end1 + 18], [end1 + 19, null]]
  );
  // Cycle: bulan, hari, tahun. Usia 0–27, 28–55, 56+.
  const cycles = buildPeriods(
    [redMonth.value, redDay.value, redYear.value],
    [[0, 27], [28, 55], [56, null]]
  );
  // Karmic Debt kelahiran: compound Life Path atau tanggal lahir.
  const karmicDebts = Array.from(
    new Set([lifePathRaw, d].filter((n) => KARMIC_DEBT_NUMBERS.includes(n)))
  );

  // ---------- Angka nama ----------
  const parts = splitNameParts(profile.name || '');
  const hasName = parts.length > 0;

  let name: NumerologyCalculationResult['name'] = null;
  let hybrid: NumerologyCalculationResult['hybrid'] = null;
  let destinyNumber: NumerologyNumber | null = null;
  let soulUrgeNumber: NumerologyNumber | null = null;
  let personalityNumber: NumerologyNumber | null = null;
  let maturityNumber: NumerologyNumber | null = null;
  const destinySteps: string[] = [];

  if (hasName) {
    const all = () => true;
    const vowelsOnly = (v: boolean) => v;
    const consonantsOnly = (v: boolean) => !v;

    const expression = sumByParts(parts, all);
    const heartsDesire = sumByParts(parts, vowelsOnly);
    const personality = sumByParts(parts, consonantsOnly);

    // Minor = nama depan + belakang saja (nama tengah dilewati). Untuk nama ≤ 2 kata sama dengan versi penuh.
    const minorParts = parts.length >= 3 ? [parts[0], parts[parts.length - 1]] : parts;
    const minorExpression = sumByParts(minorParts, all);
    const minorHeartsDesire = sumByParts(minorParts, vowelsOnly);

    // Balance = jumlah inisial seluruh nama; Cornerstone = huruf pertama nama depan.
    const balance = toFigure(parts.reduce((acc, p) => acc + letterValue(p[0]), 0));
    const cornerstone = parts[0][0];

    // Karmic Lessons = angka 1–9 yang tidak muncul di nama; Subconscious Self = 9 − jumlah lesson.
    const present = new Set<number>();
    for (const part of parts) for (const ch of part) present.add(letterValue(ch));
    const karmicLessons = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !present.has(n));
    const subconsciousSelf = 9 - karmicLessons.length;

    name = {
      nameParts: parts,
      expression,
      minorExpression,
      heartsDesire,
      minorHeartsDesire,
      personality,
      heartPersonalityBridge: Math.abs(heartsDesire.base - personality.base),
      balance,
      cornerstone,
      subconsciousSelf,
      karmicLessons,
      nameKarmicDebts: [
        { source: 'Expression', fig: expression },
        { source: "Heart's Desire", fig: heartsDesire },
        { source: 'Personality', fig: personality },
      ]
        .filter((x) => x.fig.compound !== null && KARMIC_DEBT_NUMBERS.includes(x.fig.compound))
        .map((x) => ({ source: x.source, display: x.fig.display })),
    };

    const maturityFigure = toFigure(lifePathFigure.value + expression.value);
    hybrid = {
      maturity: maturityFigure,
      lifePathExpressionBridge: Math.abs(lifePathFigure.base - expression.base),
      rationalThought: toFigure(parts[0].split('').reduce((acc, ch) => acc + letterValue(ch), 0)),
    };

    destinyNumber = getNumberDetails(expression.compound ?? expression.value);
    soulUrgeNumber = heartsDesire.value > 0 ? getNumberDetails(heartsDesire.compound ?? heartsDesire.value) : null;
    personalityNumber = personality.value > 0 ? getNumberDetails(personality.compound ?? personality.value) : null;
    maturityNumber = getNumberDetails(lifePathFigure.value + expression.value);

    destinySteps.push(`Name: ${parts.join(' ')}`);
    for (const part of parts) {
      const raw = part.split('').reduce((acc, ch) => acc + letterValue(ch), 0);
      destinySteps.push(`${part}: ${part.split('').map((ch) => `${ch}${letterValue(ch)}`).join('+')} = ${raw} → ${reduceNumber(raw, true).value}`);
    }
    destinySteps.push(`Sum of reduced names = ${expression.compound ?? expression.value} → ${expression.value}`);
  } else {
    destinySteps.push('Nama tidak mengandung huruf A–Z, angka nama tidak dapat dihitung.');
  }

  // ---------- Distribusi angka (dominant) ----------
  // Tiap angka di laporan dihitung 1x ke angka tunggalnya (11 → 2, 22 → 4, 33 → 6). Selisih bridge 0 dilewati.
  const tallyValues: number[] = [
    lifePathFigure.base,
    birthDayFigure.base,
    ...[p1, p2, p3, p4].map((v) => reduceNumber(v, false).value),
    ...[redMonth.value, redDay.value, redYear.value].map((v) => reduceNumber(v, false).value),
  ];
  if (name && hybrid) {
    tallyValues.push(
      name.expression.base,
      name.minorExpression.base,
      name.heartsDesire.base,
      name.minorHeartsDesire.base,
      name.personality.base,
      name.heartPersonalityBridge,
      name.balance.base,
      name.subconsciousSelf,
      hybrid.maturity.base,
      hybrid.lifePathExpressionBridge,
      hybrid.rationalThought.base
    );
  }
  const tallyCounts = new Map<number, number>();
  for (const v of tallyValues) if (v >= 1 && v <= 9) tallyCounts.set(v, (tallyCounts.get(v) || 0) + 1);
  const tallyTotal = Array.from(tallyCounts.values()).reduce((a, b) => a + b, 0);
  const numberDistribution = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
    const count = tallyCounts.get(n) || 0;
    return { number: n, count, percent: tallyTotal ? Math.round((count / tallyTotal) * 1000) / 10 : 0 };
  });
  const maxCount = Math.max(...numberDistribution.map((e) => e.count));
  const dominantNumbers = maxCount > 0 ? numberDistribution.filter((e) => e.count === maxCount).map((e) => e.number) : [];

  // ---------- Personal Year ----------
  const now = new Date();
  const currentYear = now.getFullYear();
  const personalYearRaw = reduceNumber(m, false).value + reduceNumber(d, false).value + reduceNumber(currentYear, false).value;
  const personalYearNumber = reduceNumber(personalYearRaw, false).value;

  let currentAge = currentYear - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) currentAge -= 1;

  return {
    lifePathNumber,
    birthdayNumber,
    destinyNumber,
    soulUrgeNumber,
    personalityNumber,
    maturityNumber,
    personalYearNumber,
    currentYear,
    currentAge,
    calculationMethod: 'Pythagorean',
    birth: { lifePath: lifePathFigure, birthDay: birthDayFigure, pinnacles, cycles, karmicDebts },
    numberDistribution,
    dominantNumbers,
    name,
    hybrid,
    digitBreakdown: {
      lifePathSteps: [
        `Month (${m}) → ${redMonth.value}`,
        `Day (${d}) → ${redDay.value}`,
        `Year (${y}) → ${redYear.value}`,
        `Sum: ${redMonth.value} + ${redDay.value} + ${redYear.value} = ${lifePathRaw} → ${lifePathNumber.value}`,
      ],
      destinySteps,
    },
  };
}
