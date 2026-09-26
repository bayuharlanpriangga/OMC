import {
  BirthProfile,
  SystemDescriptor,
  SystemId,
  SystemValidationResult,
} from '../types/systems';

export const METAPHYSICAL_SYSTEMS: Record<SystemId, SystemDescriptor> = {
  astrology: {
    id: 'astrology',
    name: 'Western Astrology',
    category: 'Celestial Systems',
    tagline: 'The planetary blueprint of the moment you were born',
    description:
      'Maps the positions of the Sun, Moon, and planets against the zodiac and houses at the exact moment of birth, revealing personality, life themes, and cyclical timing.',
    iconName: 'Compass',
    origin: 'Western / Hellenistic',
    requirements: {
      requiresExactTime: false,
      requiresLocation: true,
      minProfiles: 1,
      maxProfiles: 1,
      notes: 'Individual chart-type requirements (e.g. Solar Return, Progressed) are validated separately.',
    },
    isConfigurable: true,
  },
  'human-design': {
    id: 'human-design',
    name: 'Human Design',
    category: 'Bio-Energetic Systems',
    tagline: 'Your energetic blueprint, decoded from two moments in time',
    description:
      'Synthesizes astrology, the I Ching, Kabbalah, and chakra systems into a Bodygraph built from your birth moment and the planetary positions 88 degrees of solar arc earlier.',
    iconName: 'Fingerprint',
    origin: 'Modern Synthesis (Ra Uru Hu, 1987)',
    requirements: {
      requiresExactTime: false,
      requiresLocation: false,
      minProfiles: 1,
      maxProfiles: 1,
      notes: 'An unknown birth time defaults the Design calculation to 12:00, which may shift Type/Authority accuracy.',
    },
    isConfigurable: false,
  },
  numerology: {
    id: 'numerology',
    name: 'Numerology',
    category: 'Vibrational Systems',
    tagline: 'The hidden arithmetic of a name and a birth date',
    description:
      'Reduces a birth date and name to core numbers — Life Path, Expression, Soul Urge — to reveal vibrational patterns of identity and destiny.',
    iconName: 'Hash',
    origin: 'Pythagorean / Western',
    requirements: {
      requiresExactTime: false,
      requiresLocation: false,
      minProfiles: 1,
      maxProfiles: 1,
    },
    isConfigurable: false,
  },
  bazi: {
    id: 'bazi',
    name: 'BaZi',
    category: 'Chinese Metaphysics',
    tagline: 'The Four Pillars of Destiny',
    description:
      'Charts the Heavenly Stems and Earthly Branches for the year, month, day, and hour of birth to map the Five Elements at play in a life.',
    iconName: 'Columns3',
    origin: 'Chinese / Taoist',
    requirements: {
      requiresExactTime: false,
      requiresLocation: false,
      minProfiles: 1,
      maxProfiles: 1,
      notes: 'Without a known birth time, the Hour Pillar is omitted from the reading.',
    },
    isConfigurable: false,
  },
  'zi-wei-dou-shu': {
    id: 'zi-wei-dou-shu',
    name: 'Zi Wei Dou Shu',
    category: 'Chinese Metaphysics',
    tagline: 'The Imperial Court of Stars',
    description:
      'Places 14 major stars and their attendants across 12 palaces to construct a comprehensive life map, considered one of the most detailed Chinese astrological systems.',
    iconName: 'Crown',
    origin: 'Chinese Imperial Court',
    requirements: {
      requiresExactTime: false,
      requiresLocation: false,
      minProfiles: 1,
      maxProfiles: 1,
      notes: 'Requires a birth time for accurate Life Palace placement; unknown time defaults to 12:00.',
    },
    isConfigurable: false,
  },
  tzolkin: {
    id: 'tzolkin',
    name: 'Tzolkin',
    category: 'Mesoamerican Systems',
    tagline: 'The 260-day sacred Mayan count',
    description:
      'Combines 20 Solar Seals with 13 Galactic Tones from the sacred Mayan calendar to reveal a harmonic signature for the day of birth.',
    iconName: 'Sun',
    origin: 'Maya / Mesoamerican',
    requirements: {
      requiresExactTime: false,
      requiresLocation: false,
      minProfiles: 1,
      maxProfiles: 1,
    },
    isConfigurable: false,
  },
};

export const SYSTEMS_LIST: SystemDescriptor[] = Object.values(METAPHYSICAL_SYSTEMS);

/**
 * Top-level validation: profile count and location requirements for the
 * selected system as a whole. System-specific / chart-type-specific rules
 * (e.g. astrology's per-chart-type time requirements) are validated
 * separately by their own registries.
 */
export function validateSystemRequirements(
  systemId: SystemId,
  profiles: BirthProfile[]
): SystemValidationResult {
  const system = METAPHYSICAL_SYSTEMS[systemId];

  if (!system) {
    return { isValid: false, message: `Unknown metaphysical system: ${systemId}` };
  }

  const { minProfiles, maxProfiles, requiresLocation } = system.requirements;

  if (profiles.length < minProfiles || profiles.length > maxProfiles) {
    return {
      isValid: false,
      code: 'PROFILE_COUNT',
      title: 'Incorrect Number of Profiles',
      message:
        minProfiles === maxProfiles
          ? `${system.name} requires exactly ${minProfiles} birth profile${minProfiles > 1 ? 's' : ''} to be selected.`
          : `${system.name} requires between ${minProfiles} and ${maxProfiles} birth profiles to be selected.`,
      actionText: 'Adjust Profile Selection',
    };
  }

  if (requiresLocation) {
    const missingLocation = profiles.some(
      (p) => p.latitude === undefined || p.latitude === null || p.longitude === undefined || p.longitude === null
    );
    if (missingLocation) {
      return {
        isValid: false,
        code: 'MISSING_LOCATION',
        title: 'Birth Location Required',
        message: `${system.name} requires an accurate birth location (latitude/longitude) to compute correctly.`,
        actionText: 'Update Birth Location',
      };
    }
  }

  return { isValid: true };
}
