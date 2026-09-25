import { BaseChartResult, ChartInterpretationSection } from '../../types/systems';
import { BirthProfile } from '../../types/birth-data';
import { ZiWeiCalculationResult } from './types';

export function mapZiWeiDouShuResult(
  calc: ZiWeiCalculationResult,
  profile: BirthProfile
): BaseChartResult<ZiWeiCalculationResult> {
  const lifePalace = calc.palaces.find((p) => p.isLifePalace) || calc.palaces[0];
  const careerPalace = calc.palaces.find((p) => p.name.includes('Career'));
  const wealthPalace = calc.palaces.find((p) => p.name.includes('Wealth'));

  const interpretations: ChartInterpretationSection[] = [
    {
      title: `Life Palace (Ming Gong): Root Destiny & Archetype`,
      category: 'Imperial Life Matrix',
      summary: `The central nexus governing character, innate destiny, and lifelong tendencies.`,
      content: `Anchored in the earthly branch ${lifePalace.earthlyBranch}, your Life Palace hosts ${lifePalace.majorStars.map((s) => `${s.name} [${s.brightness}]`).join(', ')}. This planetary signature gives you noble poise, strategic long-range focus, and inherent resilience.`,
      keywords: [lifePalace.earthlyBranch, ...lifePalace.majorStars.map((s) => s.name)],
      highlights: [
        { label: 'Life Palace Branch', value: calc.lifePalaceBranch },
        { label: 'Element Bureau', value: calc.elementBureau },
        { label: 'Core Stars', value: lifePalace.majorStars.map((s) => s.name).join(', ') },
      ],
    },
    {
      title: `The San Fang Si Zheng (Three Harmonious Triads)`,
      category: 'Destiny Triad Convergence',
      summary: `The interconnected resonance between Life Palace, Career Palace, Wealth Palace, and Travel Palace.`,
      content: `In Zi Wei Dou Shu, no palace exists in isolation. Your Life Palace resonates directly with Career (${careerPalace?.majorStars.map((s) => s.name).join(', ') || 'Aligned'}) and Wealth (${wealthPalace?.majorStars.map((s) => s.name).join(', ') || 'Blessed'}), generating an integrated destiny triangle.`,
      keywords: ['San Fang Si Zheng', 'Wealth Palace', 'Career Palace'],
    },
  ];

  return {
    systemId: 'zi-wei-dou-shu',
    systemName: 'Zi Wei Dou Shu',
    generatedAt: new Date().toISOString(),
    profiles: [profile],
    data: calc,
    interpretations,
  };
}
