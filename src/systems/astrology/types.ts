export type ZodiacSign = 
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' 
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' 
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type AstrologicalElement = 'Fire' | 'Earth' | 'Air' | 'Water';
export type AstrologicalModality = 'Cardinal' | 'Fixed' | 'Mutable';

export interface PlanetPosition {
  id: string;
  name: string;
  glyph: string;
  sign: ZodiacSign;
  degree: number; // 0 to 29.99 within sign
  absoluteDegree: number; // 0 to 359.99
  minute: number;
  second: number;
  house: number; // 1 to 12 (0 if unknown)
  isRetrograde: boolean;
  speed?: number;
  element: AstrologicalElement;
  modality: AstrologicalModality;
}

export interface HouseCusp {
  house: number;
  sign: ZodiacSign;
  degree: number;
  minute: number;
  absoluteDegree: number;
  ruler: string;
}

export type AspectType = 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';

export interface ChartAspect {
  planet1: string;
  planet2: string;
  aspectType: AspectType;
  angle: number;
  orb: number;
  isApplying: boolean;
}

export interface AstrologyCalculationResult {
  chartType: string;
  zodiacSystem: 'tropical' | 'sidereal';
  houseSystem: string;
  hasExactTime: boolean;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: ChartAspect[];
  ascendant?: PlanetPosition;
  midheaven?: PlanetPosition;
  elementBalance: Record<AstrologicalElement, number>;
  modalityBalance: Record<AstrologicalModality, number>;
  metadata: {
    julianDay: number;
    siderealTime?: string;
    solarReturnYear?: number;
    progressionDate?: string;
  };
}
