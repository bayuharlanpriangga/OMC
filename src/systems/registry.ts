import { BirthProfile, SystemDescriptor, SystemId, SystemValidationResult } from '../types/systems';

export const METAPHYSICAL_SYSTEMS: Record<SystemId, SystemDescriptor> = {
  astrology: {
    id: 'astrology',
    name: 'Astrology',
    category: 'Celestial Mechanics & Archetypes',
    tagline: 'Planetary alignments, zodiacal archetypes, and temporal geometry',
    description: 'Ancient and modern celestial mechanics mapping the precise positions of stellar bodies against cosmic coordinates at the moment of incarnation.',
    iconName: 'Sparkles',
    origin: 'Hellenistic, Babylonian & Western Traditions',
    requirements: {
      requiresExactTime: false, // Top-level handles chart-type specific validation
      requiresLocation: true,
      minProfiles: 1,
      maxProfiles: 1,
    },
    isConfigurable: true,
  },
  'human-design': {
    id: 'human-design',
    name: 'Human Design',
    category: 'Bio-Energetic Synthesis',
    tagline: 'The Bodygraph synthesis of I Ching, Chakras, Kabbalah, and Quantum Neutrinos',
    description: 'Synthesizes ancient energetic frameworks with modern genetics and neutrino streams to produce a mechanical map of energetic strategy and inner authority.',
    iconName: 'Network',
    origin: 'Ra Uru Hu (1987 Ibiza Transmission)',
    requirements: {
      requiresExactTime: true,
      requiresLocation: true,
      minProfiles: 1,
      maxProfiles: 1,
      timeRequirementMessage: 'Human Design calculates exact unconscious design neutrino imprinting 88° solar degrees prior to birth and conscious personality imprinting at birth. A known birth time is strictly required.',
    },
    isConfigurable: true,
  },
  numerology: {
    id: 'numerology',
    name: 'Numerology',
    category: 'Vibrational Mathematics',
    tagline: 'Universal frequencies, Life Path calculations, and phonetic resonances',
    description: 'Decodes the metaphysical vibration encoded in temporal rhythms (birth date) and nominal acoustics (name frequencies) using Pythagorean and Chaldean traditions.',
    iconName: 'Binary',
    origin: 'Pythagorean & Chaldean Mystery Schools',
    requirements: {
      requiresExactTime: false,
      requiresLocation: false,
      minProfiles: 1,
      maxProfiles: 1,
    },
    isConfigurable: true,
  },
  bazi: {
    id: 'bazi',
    name: 'BaZi (Four Pillars of Destiny)',
    category: 'Eastern Elemental Qi',
    tagline: 'Heavenly Stems, Earthly Branches, and Yin-Yang Five-Element dynamics',
    description: 'Maps the cosmic Qi at birth across four temporal pillars: Year, Month, Day, and Hour, analyzing the Day Master relationship to surrounding elements.',
    iconName: 'Compass',
    origin: 'Classical Chinese Imperial Metaphysics',
    requirements: {
      requiresExactTime: false,
      requiresLocation: true,
      minProfiles: 1,
      maxProfiles: 1,
      notes: 'Unknown birth time allows 3 pillars (Year, Month, Day). The Hour Pillar requires known birth time.',
    },
    isConfigurable: true,
  },
  'zi-wei-dou-shu': {
    id: 'zi-wei-dou-shu',
    name: 'Zi Wei Dou Shu',
    category: 'Imperial Purple Star Astrology',
    tagline: '12 Palaces, Emperor Stars, and Karmic Transformations',
    description: 'An elite classical Chinese astrological system arranging the 14 Major Imperial Stars across 12 life palaces to reveal life trajectory and karmic destiny.',
    iconName: 'Crown',
    origin: 'Song Dynasty Imperial Astronomers',
    requirements: {
      requiresExactTime: true,
      requiresLocation: true,
      minProfiles: 1,
      maxProfiles: 1,
      timeRequirementMessage: 'Zi Wei Dou Shu locates the Life Palace (Ming Gong) and Star distributions specifically through the Chinese two-hour birth branch (Shi Chen). An exact birth time is required.',
    },
    isConfigurable: true,
  },
  tzolkin: {
    id: 'tzolkin',
    name: 'Tzolkin (Mayan Sacred Calendar)',
    category: 'Galactic Harmonic Frequencies',
    tagline: '260-Kin Sacred Matrix, Solar Seals, and 13 Galactic Tones',
    description: 'The ancient Mesoamerican harmonic matrix synchronizing human consciousness with galactic time cycles through 20 Solar Glyphs and 13 Creative Tones.',
    iconName: 'Sun',
    origin: 'Mesoamerican Classic Maya Civilization',
    requirements: {
      requiresExactTime: false,
      requiresLocation: false,
      minProfiles: 1,
      maxProfiles: 1,
    },
    isConfigurable: true,
  },
};

export const SYSTEMS_LIST = Object.values(METAPHYSICAL_SYSTEMS);

/**
 * Validates profiles against top-level system requirements
 */
export function validateSystemRequirements(
  systemId: SystemId,
  profiles: BirthProfile[]
): SystemValidationResult {
  const system = METAPHYSICAL_SYSTEMS[systemId];
  if (!system) {
    return { isValid: false, message: `System ${systemId} not recognized.` };
  }

  // Profile count check
  if (profiles.length < system.requirements.minProfiles) {
    return {
      isValid: false,
      code: 'PROFILE_COUNT',
      title: 'Profile Selection Needed',
      message: `Please select at least ${system.requirements.minProfiles} birth profile to proceed with ${system.name}.`,
    };
  }

  const primaryProfile = profiles[0];

  // Time requirement check
  if (system.requirements.requiresExactTime) {
    if (primaryProfile.isTimeUnknown || !primaryProfile.birthTime) {
      return {
        isValid: false,
        code: 'MISSING_TIME',
        title: 'Birth Time Required',
        message: system.requirements.timeRequirementMessage || `${system.name} requires an exact birth time to calculate precise coordinates.`,
        actionText: 'Edit Birth Data',
      };
    }
  }

  // BaZi warning if time is unknown
  if (systemId === 'bazi' && (primaryProfile.isTimeUnknown || !primaryProfile.birthTime)) {
    return {
      isValid: true,
      warningOnly: true,
      code: 'MISSING_TIME',
      title: 'Three Pillars Mode',
      message: 'Birth time is unknown. Year, Month, and Day pillars will be calculated. The Hour Pillar will be marked unknown.',
    };
  }

  return { isValid: true };
}
