import { BirthProfile } from '../types/birth-data';
import { BaseChartResult, GenerationConfig, SystemValidationResult } from '../types/systems';
import { validateSystemRequirements } from '../systems/registry';
import { validateAstrologyChartRequirements } from '../systems/astrology/registry';

// Astrology
import { calculateNatalChart } from '../systems/astrology/natal/calculator';
import { calculateDraconicChart } from '../systems/astrology/draconic/calculator';
import { calculateSolarReturnChart } from '../systems/astrology/solar-return/calculator';
import { calculateLunarReturnChart } from '../systems/astrology/lunar-return/calculator';
import { calculateProgressedChart } from '../systems/astrology/progressed/calculator';
import { mapAstrologyResult } from '../systems/astrology/mapper';

// Other systems
import { calculateHumanDesign } from '../systems/human-design/calculator';
import { mapHumanDesignResult } from '../systems/human-design/mapper';

import { calculateNumerology } from '../systems/numerology/calculator';
import { mapNumerologyResult } from '../systems/numerology/mapper';

import { calculateBaZi } from '../systems/bazi/calculator';
import { mapBaZiResult } from '../systems/bazi/mapper';

import { calculateZiWeiDouShu } from '../systems/zi-wei-dou-shu/calculator';
import { mapZiWeiDouShuResult } from '../systems/zi-wei-dou-shu/mapper';

import { calculateTzolkin } from '../systems/tzolkin/calculator';
import { mapTzolkinResult } from '../systems/tzolkin/mapper';

export class GenerationOrchestrator {
  /**
   * Validates profile(s) against chosen system and chart-type rules
   */
  public static validate(config: GenerationConfig, profiles: BirthProfile[]): SystemValidationResult {
    // 1. Top-level system validation
    const systemValidation = validateSystemRequirements(config.systemId, profiles);
    if (!systemValidation.isValid) {
      return systemValidation;
    }

    // 2. Astrology chart-type specific validation
    if (config.systemId === 'astrology') {
      const chartType = config.astrologyChartTypeId || 'natal';
      const chartValidation = validateAstrologyChartRequirements(chartType, profiles[0]);
      if (!chartValidation.isValid) {
        return chartValidation;
      }
      if (chartValidation.warningOnly) {
        return chartValidation;
      }
    }

    return systemValidation;
  }

  /**
   * Executes calculation and produces standard BaseChartResult
   */
  public static async execute(config: GenerationConfig, profiles: BirthProfile[]): Promise<BaseChartResult> {
    const profile = profiles[0];
    if (!profile) {
      throw new Error('At least one birth profile is required for chart generation.');
    }

    // Simulated short calculation tick for natural UI transition
    await new Promise((resolve) => setTimeout(resolve, 600));

    switch (config.systemId) {
      case 'astrology': {
        const chartType = config.astrologyChartTypeId || 'natal';
        let calcOutput;
        switch (chartType) {
          case 'draconic':
            calcOutput = calculateDraconicChart(profile, config.settings);
            break;
          case 'solar-return':
            calcOutput = calculateSolarReturnChart(profile, config.settings);
            break;
          case 'lunar-return':
            calcOutput = calculateLunarReturnChart(profile, config.settings);
            break;
          case 'progressed':
            calcOutput = calculateProgressedChart(profile, config.settings);
            break;
          case 'natal':
          default:
            calcOutput = calculateNatalChart(profile, config.settings);
            break;
        }
        return mapAstrologyResult(calcOutput, profile);
      }

      case 'human-design': {
        const calcOutput = calculateHumanDesign(profile, config.settings);
        return mapHumanDesignResult(calcOutput, profile);
      }

      case 'numerology': {
        const calcOutput = calculateNumerology(profile, config.settings);
        return mapNumerologyResult(calcOutput, profile);
      }

      case 'bazi': {
        const calcOutput = calculateBaZi(profile, config.settings);
        return mapBaZiResult(calcOutput, profile);
      }

      case 'zi-wei-dou-shu': {
        const calcOutput = calculateZiWeiDouShu(profile, config.settings);
        return mapZiWeiDouShuResult(calcOutput, profile);
      }

      case 'tzolkin': {
        const calcOutput = calculateTzolkin(profile, config.settings);
        return mapTzolkinResult(calcOutput, profile);
      }

      default:
        throw new Error(`Unsupported metaphysical system: ${config.systemId}`);
    }
  }
}
