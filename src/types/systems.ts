export { type BirthProfile } from './birth-data';
import { BirthProfile } from './birth-data';

export type SystemId = 
  | 'astrology'
  | 'human-design'
  | 'numerology'
  | 'bazi'
  | 'zi-wei-dou-shu'
  | 'tzolkin';

export type AstrologyChartTypeId = 
  | 'natal'
  | 'draconic'
  | 'solar-return'
  | 'lunar-return'
  | 'progressed';

export interface SystemRequirements {
  requiresExactTime: boolean;
  requiresLocation: boolean;
  minProfiles: number;
  maxProfiles: number;
  timeRequirementMessage?: string;
  notes?: string;
}

export interface SystemDescriptor {
  id: SystemId;
  name: string;
  category: string;
  tagline: string;
  description: string;
  iconName: string;
  origin: string;
  requirements: SystemRequirements;
  isConfigurable: boolean;
}

export interface AstrologyChartTypeDescriptor {
  id: AstrologyChartTypeId;
  name: string;
  tagline: string;
  description: string;
  requirements: SystemRequirements;
  configFields: Array<{
    id: string;
    label: string;
    type: 'select' | 'date' | 'number' | 'switch';
    options?: { label: string; value: string }[];
    defaultValue: any;
    helperText?: string;
  }>;
}

export interface SystemValidationResult {
  isValid: boolean;
  warningOnly?: boolean;
  code?: 'MISSING_TIME' | 'PROFILE_COUNT' | 'MISSING_LOCATION' | 'INVALID_DATE';
  title?: string;
  message?: string;
  actionText?: string;
}

export interface GenerationConfig {
  systemId: SystemId;
  astrologyChartTypeId?: AstrologyChartTypeId;
  selectedProfileIds: string[];
  settings: Record<string, any>;
}

export type GenerationStage = 
  | 'idle'
  | 'validating'
  | 'calculating'
  | 'mapping'
  | 'completed'
  | 'failed';

export interface BaseChartResult<TData = any> {
  systemId: SystemId;
  chartTypeId?: string;
  systemName: string;
  chartTypeName?: string;
  generatedAt: string;
  profiles: BirthProfile[];
  data: TData;
  interpretations: ChartInterpretationSection[];
}

export interface ChartInterpretationSection {
  title: string;
  category: string;
  summary: string;
  content: string;
  keywords?: string[];
  highlights?: { label: string; value: string }[];
}
