export interface NumerologyNumber {
  value: number;
  isMasterNumber: boolean;
  name: string;
  tagline: string;
  keywords: string[];
}

export interface NumerologyCalculationResult {
  lifePathNumber: NumerologyNumber;
  destinyNumber: NumerologyNumber;
  soulUrgeNumber: NumerologyNumber;
  personalityNumber: NumerologyNumber;
  birthdayNumber: NumerologyNumber;
  maturityNumber: NumerologyNumber;
  personalYearNumber: number;
  currentYear: number;
  calculationMethod: 'Pythagorean' | 'Chaldean';
  digitBreakdown: {
    lifePathSteps: string[];
    destinySteps: string[];
  };
}
