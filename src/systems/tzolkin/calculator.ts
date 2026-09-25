import { BirthProfile } from '../../types/birth-data';
import { GalacticTone, SolarSeal, TzolkinCalculationResult, TzolkinKin } from './types';

const SEALS: SolarSeal[] = [
  { number: 20, name: 'Sun', mayaName: 'Ahau', color: 'Yellow', action: 'Enlightening', power: 'Universal Fire', essence: 'Life', symbol: '☀️' },
  { number: 1, name: 'Dragon', mayaName: 'Imix', color: 'Red', action: 'Nurturing', power: 'Birth', essence: 'Being', symbol: '🐉' },
  { number: 2, name: 'Wind', mayaName: 'Ik', color: 'White', action: 'Communicating', power: 'Spirit', essence: 'Breath', symbol: '💨' },
  { number: 3, name: 'Night', mayaName: 'Akbal', color: 'Blue', action: 'Dreaming', power: 'Abundance', essence: 'Intuition', symbol: '🌌' },
  { number: 4, name: 'Seed', mayaName: 'Kan', color: 'Yellow', action: 'Targeting', power: 'Awareness', essence: 'Flowering', symbol: '🌱' },
  { number: 5, name: 'Serpent', mayaName: 'Chicchan', color: 'Red', action: 'Surviving', power: 'Life Force', essence: 'Instinct', symbol: '🐍' },
  { number: 6, name: 'Worldbridger', mayaName: 'Cimi', color: 'White', action: 'Equalizing', power: 'Death & Rebirth', essence: 'Opportunity', symbol: '🌉' },
  { number: 7, name: 'Hand', mayaName: 'Manik', color: 'Blue', action: 'Knowing', power: 'Accomplishment', essence: 'Healing', symbol: '✋' },
  { number: 8, name: 'Star', mayaName: 'Lamat', color: 'Yellow', action: 'Beautifying', power: 'Elegance', essence: 'Art', symbol: '⭐' },
  { number: 9, name: 'Moon', mayaName: 'Muluc', color: 'Red', action: 'Purifying', power: 'Universal Water', essence: 'Flow', symbol: '🌊' },
  { number: 10, name: 'Dog', mayaName: 'Oc', color: 'White', action: 'Loving', power: 'Heart', essence: 'Loyalty', symbol: '🐕' },
  { number: 11, name: 'Monkey', mayaName: 'Chuen', color: 'Blue', action: 'Playing', power: 'Magic', essence: 'Illusion', symbol: '🐒' },
  { number: 12, name: 'Human', mayaName: 'Eb', color: 'Yellow', action: 'Influencing', power: 'Free Will', essence: 'Wisdom', symbol: '👤' },
  { number: 13, name: 'Skywalker', mayaName: 'Ben', color: 'Red', action: 'Exploring', power: 'Space', essence: 'Wakefulness', symbol: '🚀' },
  { number: 14, name: 'Wizard', mayaName: 'Ix', color: 'White', action: 'Enchanting', power: 'Timelessness', essence: 'Receptivity', symbol: '🔮' },
  { number: 15, name: 'Eagle', mayaName: 'Men', color: 'Blue', action: 'Creating', power: 'Vision', essence: 'Mind', symbol: '🦅' },
  { number: 16, name: 'Warrior', mayaName: 'Cib', color: 'Yellow', action: 'Questioning', power: 'Intelligence', essence: 'Fearlessness', symbol: '🛡️' },
  { number: 17, name: 'Earth', mayaName: 'Caban', color: 'Red', action: 'Evolving', power: 'Navigation', essence: 'Synchronicity', symbol: '🌍' },
  { number: 18, name: 'Mirror', mayaName: 'Etznab', color: 'White', action: 'Reflecting', power: 'Endlessness', essence: 'Order', symbol: '🪞' },
  { number: 19, name: 'Storm', mayaName: 'Cauac', color: 'Blue', action: 'Catalyzing', power: 'Self-Generation', essence: 'Energy', symbol: '⚡' },
];

const TONES: GalacticTone[] = [
  { number: 1, name: 'Magnetic', creativePower: 'Unify', action: 'Attracting Purpose', ray: '1st Ray of Unity' },
  { number: 2, name: 'Lunar', creativePower: 'Polarize', action: 'Stabilizing Challenge', ray: '2nd Ray of Duality' },
  { number: 3, name: 'Electric', creativePower: 'Activate', action: 'Bonding Service', ray: '3rd Ray of Movement' },
  { number: 4, name: 'Self-Existing', creativePower: 'Define', action: 'Measuring Form', ray: '4th Ray of Order' },
  { number: 5, name: 'Overtone', creativePower: 'Empower', action: 'Commanding Radiance', ray: '5th Ray of Radiance' },
  { number: 6, name: 'Rhythmic', creativePower: 'Organize', action: 'Balancing Equality', ray: '6th Ray of Organic Balance' },
  { number: 7, name: 'Resonant', creativePower: 'Channel', action: 'Inspiring Attunement', ray: '7th Ray of Mystical Center' },
  { number: 8, name: 'Galactic', creativePower: 'Harmonize', action: 'Modeling Integrity', ray: '8th Ray of Living Harmony' },
  { number: 9, name: 'Solar', creativePower: 'Pulse', action: 'Realizing Intention', ray: '9th Ray of Realization' },
  { number: 10, name: 'Planetary', creativePower: 'Perfect', action: 'Producing Manifestation', ray: '10th Ray of Manifestation' },
  { number: 11, name: 'Spectral', creativePower: 'Dissolve', action: 'Releasing Liberation', ray: '11th Ray of Liberation' },
  { number: 12, name: 'Crystal', creativePower: 'Dedicate', action: 'Universalizing Cooperation', ray: '12th Ray of Complex Synergy' },
  { number: 13, name: 'Cosmic', creativePower: 'Endure', action: 'Transcending Presence', ray: '13th Ray of Universal Cosmic Return' },
];

export function calculateTzolkin(
  profile: BirthProfile,
  _settings: Record<string, any> = {}
): TzolkinCalculationResult {
  const [year, month, day] = profile.birthDate.split('-').map(Number);

  // Classic Dreamspell correlation: July 26, 1987 = Kin 34 (Galactic Wizard)
  const baseDate = new Date(1987, 6, 26).getTime();
  const birthDate = new Date(year, month - 1, day).getTime();
  const diffDays = Math.floor((birthDate - baseDate) / (1000 * 60 * 60 * 24));

  const kinNumber = ((34 + diffDays) % 260 + 260) % 260 || 260;

  const destinyKin = getKin(kinNumber);

  // Oracle Kins:
  // Analog: Seal index + Analog partner = 19 (in 0-19)
  const analogSealNum = (19 - (destinyKin.seal.number % 20) + 20) % 20;
  const analogKin = getKin(((destinyKin.kinNumber + 119) % 260) || 260);

  // Antipode: + 10 seals away (or + 130 kins)
  const antipodeKin = getKin(((destinyKin.kinNumber + 130) % 260) || 260);

  // Occult: Tone sum = 14, Seal sum = 21
  const occultKin = getKin(((261 - destinyKin.kinNumber) % 260) || 260);

  // Guide Kin based on tone
  const guideKin = getKin(((destinyKin.kinNumber + (destinyKin.tone.number * 12)) % 260) || 260);

  // Wavespell
  const wavespellDay = ((destinyKin.tone.number - 1) % 13) + 1;
  const wavespellOriginKin = ((destinyKin.kinNumber - wavespellDay + 1) % 260) || 260;
  const wavespellOrigin = getKin(wavespellOriginKin);

  // Castle (5 castles of 52 kins each)
  const castles = ['Red Castle of Turning', 'White Castle of Crossing', 'Blue Castle of Burning', 'Yellow Castle of Giving', 'Green Central Castle of Enchantment'];
  const castle = castles[Math.floor((kinNumber - 1) / 52)];

  return {
    destinyKin,
    wavespellSeal: wavespellOrigin.seal,
    wavespellDay,
    oracle: {
      guide: guideKin,
      antipode: antipodeKin,
      analog: analogKin,
      occult: occultKin,
    },
    castle,
    colorDirection: `${destinyKin.seal.color} Harmonic Quadrant`,
  };
}

function getKin(kinNumber: number): TzolkinKin {
  const normKin = ((kinNumber - 1) % 260) + 1;
  const toneIndex = (normKin - 1) % 13;
  const sealIndex = normKin % 20;

  const tone = TONES[toneIndex];
  const seal = SEALS[sealIndex];

  return {
    kinNumber: normKin,
    seal,
    tone,
    affirmation: `I harmonize in order to ${seal.action.toLowerCase()}, modeling ${seal.essence.toLowerCase()}. I seal the output of ${seal.power.toLowerCase()} with the ${tone.name.toLowerCase()} tone of ${tone.creativePower.toLowerCase()}.`,
  };
}
