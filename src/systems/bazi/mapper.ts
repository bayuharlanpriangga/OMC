import { BaseChartResult, ChartInterpretationSection } from '../../types/systems';
import { BirthProfile } from '../../types/birth-data';
import { BaZiCalculationResult } from './types';

export function mapBaZiResult(
  calc: BaZiCalculationResult,
  profile: BirthProfile
): BaseChartResult<BaZiCalculationResult> {
  const dm = calc.dayMaster;

  const interpretations: ChartInterpretationSection[] = [
    {
      title: `Day Master: ${dm.name} (${dm.chinese}) — ${dm.yinYang} ${dm.element}`,
      category: 'Core Self & Spirit (Ri Zhu)',
      summary: `The central sovereign element of your energetic constitution.`,
      content: `Your Day Master is ${dm.name} (${dm.chinese}), symbolizing ${dm.yinYang} ${dm.element}. As a ${calc.dayMasterStrength} Day Master, your fundamental life mission revolves around balancing your personal elemental Qi against the seasons and cosmic currents.`,
      keywords: [`${dm.yinYang} ${dm.element}`, `Strength: ${calc.dayMasterStrength}`, `Favorable: ${calc.favorableElements.join(', ')}`],
      highlights: [
        { label: 'Day Master', value: `${dm.name} (${dm.chinese})` },
        { label: 'Nature', value: `${dm.yinYang} ${dm.element}` },
        { label: 'Constitution', value: `${calc.dayMasterStrength} Element` },
        { label: 'Favorable Qi', value: calc.favorableElements.join(', ') },
      ],
    },
    {
      title: `Pillar Architecture: ${calc.hasHourPillar ? 'Complete Four Pillars' : 'Three Pillars (Hour Unknown)'}`,
      category: 'Temporal Roots & Branches',
      summary: `The interaction of Heaven (Stems) and Earth (Branches).`,
      content: calc.hasHourPillar
        ? `With all four pillars mapped, your life trajectory can be read through Year (Ancestors/Society), Month (Parents/Career), Day (Spouse/Self), and Hour (Children/Later Life aspirations).`
        : `Because the exact birth hour is not recorded, the Hour Pillar is omitted. The foundational triad of Year, Month, and Day provides strong insight into social, career, and core relational dynamics.`,
    },
  ];

  return {
    systemId: 'bazi',
    systemName: 'BaZi (Four Pillars)',
    generatedAt: new Date().toISOString(),
    profiles: [profile],
    data: calc,
    interpretations,
  };
}
