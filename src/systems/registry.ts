import { AstrologyChartTypeDescriptor, AstrologyChartTypeId, BirthProfile, SystemValidationResult } from '../../types/systems';

export const ASTROLOGY_CHART_TYPES: Record<AstrologyChartTypeId, AstrologyChartTypeDescriptor> = {
  natal: {
    id: 'natal',
    name: 'Natal Chart',
    tagline: 'The foundational celestial blueprint of birth',
    description: 'Calculates the exact positions of the Sun, Moon, planets, and astrological houses at the precise moment and geographic coordinates of birth.',
    requirements: {
      requiresExactTime: false, // Can calculate planet signs without time, but houses/Ascendant need time
      requiresLocation: true,
      minProfiles: 1,
      maxProfiles: 1,
      notes: 'Unknown birth time will calculate planetary signs without Ascendant and House cusps.',
    },
    configFields: [
      {
        id: 'houseSystem',
        label: 'House System',
        type: 'select',
        options: [
          { label: 'Placidus (Standard)', value: 'placidus' },
          { label: 'Whole Sign (Traditional)', value: 'whole-sign' },
          { label: 'Koch', value: 'koch' },
          { label: 'Equal House', value: 'equal' },
        ],
        defaultValue: 'placidus',
      },
      {
        id: 'zodiac',
        label: 'Zodiac System',
        type: 'select',
        options: [
          { label: 'Tropical (Western)', value: 'tropical' },
          { label: 'Sidereal (Lahiri)', value: 'sidereal' },
        ],
        defaultValue: 'tropical',
      },
    ],
  },
  draconic: {
    id: 'draconic',
    name: 'Draconic Chart',
    tagline: 'The soul orientation and higher spiritual destiny',
    description: 'Calculates the chart with the Lunar True North Node adjusted to 0° Aries, revealing underlying soul purpose and karmic motivations.',
    requirements: {
      requiresExactTime: false,
      requiresLocation: true,
      minProfiles: 1,
      maxProfiles: 1,
    },
    configFields: [
      {
        id: 'nodeType',
        label: 'Lunar Node Calculation',
        type: 'select',
        options: [
          { label: 'True Node', value: 'true' },
          { label: 'Mean Node', value: 'mean' },
        ],
        defaultValue: 'true',
      },
    ],
  },
  'solar-return': {
    id: 'solar-return',
    name: 'Solar Return',
    tagline: 'Annual solar birthday revolution cycle',
    description: 'Constructs the astrological chart for the exact annual moment the Sun returns to its exact natal zodiacal degree and minute.',
    requirements: {
      requiresExactTime: true,
      requiresLocation: true,
      minProfiles: 1,
      maxProfiles: 1,
      timeRequirementMessage: 'Solar Return charts calculate precise return minutes and Ascendant, requiring an accurate birth time.',
    },
    configFields: [
      {
        id: 'returnYear',
        label: 'Return Year',
        type: 'number',
        defaultValue: new Date().getFullYear(),
        helperText: 'The target year for this solar revolution',
      },
      {
        id: 'relocationCity',
        label: 'Return Location',
        type: 'select',
        options: [
          { label: 'Natal Birth Place', value: 'natal' },
          { label: 'Current Residence', value: 'current' },
        ],
        defaultValue: 'natal',
      },
    ],
  },
  'lunar-return': {
    id: 'lunar-return',
    name: 'Lunar Return',
    tagline: 'Monthly 27.3-day emotional cycle blueprint',
    description: 'Constructs a chart for the moment the transiting Moon returns to its exact natal position, charting emotional focus for the 28-day cycle.',
    requirements: {
      requiresExactTime: true,
      requiresLocation: true,
      minProfiles: 1,
      maxProfiles: 1,
      timeRequirementMessage: 'The Moon moves 13° per day. Lunar returns require exact birth time for precise alignment.',
    },
    configFields: [
      {
        id: 'cycleMonth',
        label: 'Target Month Cycle',
        type: 'select',
        options: [
          { label: 'Current Lunar Cycle', value: 'current' },
          { label: 'Next Lunar Cycle', value: 'next' },
        ],
        defaultValue: 'current',
      },
    ],
  },
  progressed: {
    id: 'progressed',
    name: 'Secondary Progressions',
    tagline: 'Internal soul maturation (A day for a year)',
    description: 'Calculates symbolic psychological and life progression where each single day of planetary movement after birth represents one full year of lived life.',
    requirements: {
      requiresExactTime: true,
      requiresLocation: true,
      minProfiles: 1,
      maxProfiles: 1,
      timeRequirementMessage: 'Progressed charts calculate subtle Ascendant shifts that require exact birth time.',
    },
    configFields: [
      {
        id: 'targetDate',
        label: 'Progression Target Date',
        type: 'date',
        defaultValue: new Date().toISOString().slice(0, 10),
        helperText: 'Date to calculate current inner evolution stage',
      },
    ],
  },
};

export function validateAstrologyChartRequirements(
  chartTypeId: AstrologyChartTypeId,
  profile: BirthProfile
): SystemValidationResult {
  const chartType = ASTROLOGY_CHART_TYPES[chartTypeId];
  if (!chartType) {
    return { isValid: false, message: `Unknown astrology chart type ${chartTypeId}` };
  }

  if (chartType.requirements.requiresExactTime && (profile.isTimeUnknown || !profile.birthTime)) {
    return {
      isValid: false,
      code: 'MISSING_TIME',
      title: 'Birth Time Required',
      message: chartType.requirements.timeRequirementMessage || `${chartType.name} requires a known birth time to compute exact house cusps and rotational angles.`,
      actionText: 'Update Birth Time',
    };
  }

  // Natal warning if time is unknown (warns about Ascendant/houses, but allows planetary signs calculation)
  if (chartTypeId === 'natal' && (profile.isTimeUnknown || !profile.birthTime)) {
    return {
      isValid: true,
      warningOnly: true,
      code: 'MISSING_TIME',
      title: 'Approximate Natal Chart',
      message: 'Birth time is unknown. Planetary sign placements will be calculated at solar noon, but Rising sign (Ascendant) and house positions will be omitted.',
    };
  }

  return { isValid: true };
}
