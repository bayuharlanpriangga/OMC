export type StarBrightness = 'Miao (Temple)' | 'Wang (Bright)' | 'De (Good)' | 'Li (Average)' | 'Xian (Dim)';
export type TransformationType = 'Hua Lu (Prosperity)' | 'Hua Quan (Power)' | 'Hua Ke (Fame)' | 'Hua Ji (Karma)';

export interface ZiWeiStar {
  name: string;
  chinese: string;
  brightness: StarBrightness;
  category: 'Major Imperial' | 'Minor Lucky' | 'Sha / Malevolent' | 'Helper';
  transformation?: TransformationType;
}

export interface ZiWeiPalace {
  index: number;
  name: string;
  chinese: string;
  earthlyBranch: string;
  heavenlyStem: string;
  isLifePalace: boolean;
  isBodyPalace: boolean;
  majorStars: ZiWeiStar[];
  minorStars: string[];
}

export interface ZiWeiCalculationResult {
  lunarBirthDate: string;
  lifePalaceBranch: string;
  bodyPalaceBranch: string;
  elementBureau: string; // e.g., 'Water 2nd Bureau', 'Wood 3rd Bureau'
  palaces: ZiWeiPalace[];
  transformationsSummary: Array<{ star: string; type: TransformationType; palace: string }>;
}
