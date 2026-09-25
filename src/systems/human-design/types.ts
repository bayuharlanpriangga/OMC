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
  isConscious: boolean; // Personality (black) vs Design (red)
}

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
  activeChannels: Array<{ id: string; name: string; gates: [number, number] }>;
  personalityGates: HDGateActivation[];
  designGates: HDGateActivation[];
}
