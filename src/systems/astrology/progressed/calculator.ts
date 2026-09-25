import { BirthProfile } from '../../../types/birth-data';
import { calculateNatalChart } from '../natal/calculator';
import { AstrologyCalculationResult } from '../types';

/**
 * Secondary Progressions Calculator
 * A day for a year formula: Each day after birth equals 1 year of life.
 */
export function calculateProgressedChart(
  profile: BirthProfile,
  settings: { targetDate?: string } = {}
): AstrologyCalculationResult {
  const [bYear, bMonth, bDay] = profile.birthDate.split('-').map(Number);
  const birthDateObj = new Date(bYear, bMonth - 1, bDay);
  const targetDateObj = settings.targetDate ? new Date(settings.targetDate) : new Date();

  // Age in fractional years
  const ageInYears = (targetDateObj.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const progressedDays = Math.max(0, ageInYears);

  // Advance birth date by progressedDays
  const progressedTimestamp = birthDateObj.getTime() + progressedDays * 24 * 60 * 60 * 1000;
  const progressedDateObj = new Date(progressedTimestamp);
  const progressedDateStr = progressedDateObj.toISOString().slice(0, 10);

  const progressedProfile: BirthProfile = {
    ...profile,
    birthDate: progressedDateStr,
  };

  const result = calculateNatalChart(progressedProfile);

  return {
    ...result,
    chartType: 'progressed',
    metadata: {
      ...result.metadata,
      progressionDate: settings.targetDate || new Date().toISOString().slice(0, 10),
    },
  };
}
