import { BirthProfile } from '../../../types/birth-data';
import { calculateNatalChart } from '../natal/calculator';
import { AstrologyCalculationResult } from '../types';

/**
 * Lunar Return Calculator
 * Generates the lunar cycle return chart for emotional rhythms.
 */
export function calculateLunarReturnChart(
  profile: BirthProfile,
  _settings: { cycleMonth?: string } = {}
): AstrologyCalculationResult {
  const result = calculateNatalChart(profile);

  return {
    ...result,
    chartType: 'lunar-return',
  };
}
