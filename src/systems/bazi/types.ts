export type WuXingElement = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type YinYang = 'Yang' | 'Yin';

export interface HeavenlyStem {
  name: string;
  chinese: string;
  element: WuXingElement;
  yinYang: YinYang;
  tenGod?: string;
}

export interface EarthlyBranch {
  name: string;
  chinese: string;
  zodiacAnimal: string;
  element: WuXingElement;
  hiddenStems: HeavenlyStem[];
}

export interface BaZiPillar {
  title: 'Year Pillar' | 'Month Pillar' | 'Day Pillar' | 'Hour Pillar';
  isUnknown?: boolean;
  heavenlyStem?: HeavenlyStem;
  earthlyBranch?: EarthlyBranch;
}

export interface BaZiCalculationResult {
  hasHourPillar: boolean;
  dayMaster: HeavenlyStem;
  pillars: {
    year: BaZiPillar;
    month: BaZiPillar;
    day: BaZiPillar;
    hour: BaZiPillar;
  };
  elementDistribution: Record<WuXingElement, number>;
  elementPercentages: Record<WuXingElement, number>;
  dayMasterStrength: 'Strong' | 'Weak' | 'Balanced';
  favorableElements: WuXingElement[];
  unfavorableElements: WuXingElement[];
}
