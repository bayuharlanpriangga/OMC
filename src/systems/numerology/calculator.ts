import { BirthProfile } from '../../types/birth-data';
import { NumerologyCalculationResult, NumerologyNumber } from './types';

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

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

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

function getNumberDetails(val: number): NumerologyNumber {
  const reduced = reduceNumber(val, true);
  const meta = NUMBER_METADATA[reduced.value] || {
    name: `Vibration ${reduced.value}`,
    tagline: 'Harmonic frequency',
    keywords: ['Resonance'],
  };
  return {
    value: reduced.value,
    isMasterNumber: reduced.isMaster,
    name: meta.name,
    tagline: meta.tagline,
    keywords: meta.keywords,
  };
}

export function calculateNumerology(
  profile: BirthProfile,
  _settings: Record<string, any> = {}
): NumerologyCalculationResult {
  const [yStr, mStr, dStr] = profile.birthDate.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);

  // Life Path: Reduce year, month, day individually first (Pythagorean method)
  const redMonth = reduceNumber(m, true);
  const redDay = reduceNumber(d, true);
  const redYear = reduceNumber(y, true);
  const lifePathRaw = redMonth.value + redDay.value + redYear.value;
  const lifePathNumber = getNumberDetails(lifePathRaw);

  const cleanName = profile.name.toUpperCase().replace(/[^A-Z]/g, '') || 'SEEKER';

  // Expression / Destiny: Sum of all letters
  let destinySum = 0;
  let vowelsSum = 0;
  let consonantsSum = 0;

  for (const char of cleanName) {
    const val = PYTHAGOREAN_MAP[char] || 0;
    destinySum += val;
    if (VOWELS.has(char)) {
      vowelsSum += val;
    } else {
      consonantsSum += val;
    }
  }

  const destinyNumber = getNumberDetails(destinySum);
  const soulUrgeNumber = getNumberDetails(vowelsSum || 1);
  const personalityNumber = getNumberDetails(consonantsSum || 1);
  const birthdayNumber = getNumberDetails(d);
  const maturityNumber = getNumberDetails(lifePathNumber.value + destinyNumber.value);

  const currentYear = new Date().getFullYear();
  const personalYearRaw = reduceNumber(m, false).value + reduceNumber(d, false).value + reduceNumber(currentYear, false).value;
  const personalYearNumber = reduceNumber(personalYearRaw, false).value;

  return {
    lifePathNumber,
    destinyNumber,
    soulUrgeNumber,
    personalityNumber,
    birthdayNumber,
    maturityNumber,
    personalYearNumber,
    currentYear,
    calculationMethod: 'Pythagorean',
    digitBreakdown: {
      lifePathSteps: [
        `Month (${m}) → ${redMonth.value}`,
        `Day (${d}) → ${redDay.value}`,
        `Year (${y}) → ${redYear.value}`,
        `Sum: ${redMonth.value} + ${redDay.value} + ${redYear.value} = ${lifePathRaw} → ${lifePathNumber.value}`,
      ],
      destinySteps: [
        `Name: ${cleanName}`,
        `Letter Frequencies Sum = ${destinySum} → ${destinyNumber.value}`,
      ],
    },
  };
}
