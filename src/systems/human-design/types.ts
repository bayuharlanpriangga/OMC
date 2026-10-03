export type HumanDesignType = 
  | 'Generator'
  | 'Manifesting Generator'
  | 'Projector'
  | 'Manifestor'
  | 'Reflector';

export type InnerAuthority = 
  | 'Emotional (Solar Plexus)'
  | 'Sacral'
  | 'Splenic'
  | 'Ego Manifested'
  | 'Ego Projected'
  | 'Self-Projected'
  | 'Mental (Sounding Board)'
  | 'Lunar (28-day cycle)';

export type HDCenterId = 
  | 'head'
  | 'ajna'
  | 'throat'
  | 'g-center'
  | 'heart'
  | 'solar-plexus'
  | 'sacral'
  | 'spleen'
  | 'root';

export interface HDCenter {
  id: HDCenterId;
  name: string;
  isDefined: boolean;
  definedGates: number[];
}

export interface HDGateActivation {
  gate: number;
  line: number;
  planet: string;
  /** id glyph: 'sun' | 'earth' | 'north-node' | 'south-node' | 'moon' | ... */
  planetId: string;
  isConscious: boolean; // Personality (black) vs Design (red)
  /** Detail posisi untuk variabel (PHS, environment, dst). */
  color: number;
  tone: number;
  base: number;
  /** Bujur ekliptika tropis (derajat). */
  longitude: number;
  /** Hanya tampil di kolom planet, tidak ikut menentukan channel/center (mis. Chiron, Lilith). */
  isExtra?: boolean;
}

export interface HDVariableArrow {
  color: number;
  tone: number;
  /** Tone 1–3 = kiri (passive), 4–6 = kanan (active). */
  direction: 'left' | 'right';
}

import type { HDExtendedVariables } from './variables';

export interface HumanDesignCalculationResult {
  type: HumanDesignType;
  profile: string; // e.g., '1/3', '4/6'
  profileName: string;
  authority: InnerAuthority;
  strategy: string;
  notSelfTheme: string;
  signature: string;
  definition: 'Single Definition' | 'Split Definition' | 'Triple Split' | 'Quadruple Split' | 'No Definition';
  incarnationCross: string;
  centers: Record<HDCenterId, HDCenter>;
  activeChannels: Array<{ id: string; name: string; gates: [number, number]; centers: [HDCenterId, HDCenterId] }>;
  /** Sudut inkarnasi + 4 gate cross (Personality Sun/Earth | Design Sun/Earth). */
  crossAngle: 'Right Angle' | 'Left Angle' | 'Juxtaposition';
  crossGates: { personalitySun: number; personalityEarth: number; designSun: number; designEarth: number };
  variables: { determination: HDVariableArrow; environment: HDVariableArrow; motivation: HDVariableArrow; perspective: HDVariableArrow };
  /** Variabel lanjutan: lingkungan, motivasi, perspektif, pencernaan, kognisi, tindakan pikiran, arketipe. */
  extendedVariables: HDExtendedVariables;
  /** Waktu (UTC, ISO) saat Design dihitung: Matahari 88° sebelum posisi lahir. */
  designDateUtc: string;
  personalityGates: HDGateActivation[];
  designGates: HDGateActivation[];
}
