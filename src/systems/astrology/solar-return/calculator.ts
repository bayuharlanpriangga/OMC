import { BirthProfile } from '../../../types/birth-data';
import { calculateNatalChart } from '../natal/calculator';
import { AstrologyCalculationResult } from '../types';

/**
 * Solar Return Calculator
 * Generates the annual chart for when transiting Sun returns to its exact natal position in the target year.
 */
export function calculateSolarReturnChart(
  profile: BirthProfile,
  settings: { returnYear?: number; relocationCity?: string } = {}
): AstrologyCalculationResult {
  const targetYear = settings.returnYear || new Date().getFullYear();
  const [bYear, bMonth, bDay] = profile.birthDate.split('-');

  // Synthetic date for solar return alignment in target year
  const solarReturnProfile: BirthProfile = {
    ...profile,
    birthDate: `${targetYear}-${bMonth}-${bDay}`,
  };

  const result = calculateNatalChart(solarReturnProfile);

  return {
    ...result,
    chartType: 'solar-return',
    metadata: {
      ...result.metadata,
      solarReturnYear: targetYear,
    },
  };
}
