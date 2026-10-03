export interface NumerologyNumber {
  value: number;
  isMasterNumber: boolean;
  name: string;
  tagline: string;
  keywords: string[];
  /** Angka tunggal 1–9 (tanpa mempertahankan master number). */
  base: number;
  /** Angka majemuk sebelum direduksi (mis. 14 pada 14/5); null jika sudah ≤ 9. */
  compound: number | null;
  /** Tampilan gaya laporan: "14/5", "11/2", "7". */
  display: string;
}

/** Angka ringan tanpa metadata arketipe (dipakai untuk hasil turunan). */
export interface NumerologyFigure {
  value: number;
  base: number;
  compound: number | null;
  isMasterNumber: boolean;
  display: string;
}

/** Satu periode Pinnacle / Cycle dengan rentang usia. */
export interface NumerologyPeriod {
  /** Angka periode (master number dipertahankan). */
  value: number;
  startAge: number;
  /** null = berlangsung sampai akhir hidup. */
  endAge: number | null;
}

export interface NumerologyBirthSection {
  lifePath: NumerologyFigure;
  birthDay: NumerologyFigure;
  pinnacles: NumerologyPeriod[]; // 4
  cycles: NumerologyPeriod[]; // 3
  /** Karmic debt (13/14/16/19) yang muncul di Life Path atau Birth Day. */
  karmicDebts: number[];
}

export interface NumerologyNameSection {
  /** Bagian nama yang dihitung (setelah dinormalisasi A–Z). */
  nameParts: string[];
  expression: NumerologyFigure;
  /** Expression dari nama depan + belakang saja (tanpa nama tengah). */
  minorExpression: NumerologyFigure;
  heartsDesire: NumerologyFigure;
  minorHeartsDesire: NumerologyFigure;
  personality: NumerologyFigure;
  heartPersonalityBridge: number;
  balance: NumerologyFigure;
  cornerstone: string;
  subconsciousSelf: number;
  karmicLessons: number[];
  /** Karmic debt yang muncul di angka nama (info tambahan, tidak dihitung di Karmic Debt kelahiran). */
  nameKarmicDebts: { source: string; display: string }[];
}

export interface NumerologyDistributionEntry {
  number: number; // 1–9
  count: number;
  /** Persentase dari seluruh angka di laporan, 1 desimal. */
  percent: number;
}

export interface NumerologyHybridSection {
  maturity: NumerologyFigure;
  lifePathExpressionBridge: number;
  rationalThought: NumerologyFigure;
}

export interface NumerologyCalculationResult {
  lifePathNumber: NumerologyNumber;
  birthdayNumber: NumerologyNumber;
  /** Null jika nama tidak mengandung huruf A–Z. */
  destinyNumber: NumerologyNumber | null;
  soulUrgeNumber: NumerologyNumber | null;
  personalityNumber: NumerologyNumber | null;
  maturityNumber: NumerologyNumber | null;
  personalYearNumber: number;
  currentYear: number;
  currentAge: number;
  calculationMethod: 'Pythagorean' | 'Chaldean';
  birth: NumerologyBirthSection;
  /** Frekuensi angka 1–9 di seluruh angka laporan (master number dihitung sebagai angka tunggalnya). */
  numberDistribution: NumerologyDistributionEntry[];
  /** Angka dengan frekuensi tertinggi (bisa lebih dari satu jika seri). */
  dominantNumbers: number[];
  /** Null jika nama tidak mengandung huruf A–Z. */
  name: NumerologyNameSection | null;
  hybrid: NumerologyHybridSection | null;
  digitBreakdown: {
    lifePathSteps: string[];
    destinySteps: string[];
  };
}
