import { BaseChartResult, ChartInterpretationSection } from '../../types/systems';
import { BirthProfile } from '../../types/birth-data';
import { HumanDesignCalculationResult } from './types';

export function mapHumanDesignResult(
  calc: HumanDesignCalculationResult,
  profile: BirthProfile
): BaseChartResult<HumanDesignCalculationResult> {
  const interpretations: ChartInterpretationSection[] = [
    {
      title: `Aura Mechanics: The ${calc.type}`,
      category: 'Energetic Type & Strategy',
      summary: `You operate with the energetic blueprint of a ${calc.type}. Strategy: ${calc.strategy}.`,
      content: `As a ${calc.type}, your aura has a distinct electromagnetic frequency. When navigating decisions through your strategy (${calc.strategy}) rather than mental pressure, you bypass resistance and eliminate ${calc.notSelfTheme.toLowerCase()}, stepping into the pure state of ${calc.signature.toLowerCase()}.`,
      keywords: [calc.type, calc.strategy, `Signature: ${calc.signature}`],
      highlights: [
        { label: 'Energy Type', value: calc.type },
        { label: 'Strategy', value: calc.strategy },
        { label: 'Inner Authority', value: calc.authority },
        { label: 'Not-Self Theme', value: calc.notSelfTheme },
        { label: 'Signature', value: calc.signature },
      ],
    },
    {
      title: `Inner Decision Compass: ${calc.authority}`,
      category: 'Authority & Somatic Truth',
      summary: `Your mind is a brilliant passenger, not your inner decision-maker. Trust ${calc.authority}.`,
      content: `In Human Design, the mind should never make decisions about your direction, relationships, or work. Your somatic truth resides exclusively in your ${calc.authority}. Learning to pause and feel this body-based response is the core experiment of deconditioning.`,
      keywords: [calc.authority, 'Somatic Intelligence', 'Inner Authority'],
    },
    {
      title: `Life Profile: ${calc.profile} (${calc.profileName})`,
      category: 'Costume of Purpose',
      summary: `The archetypal costume you wear to fulfill your life purpose.`,
      content: `The first number (${calc.profile.split('/')[0]}) represents conscious personality awareness, while the second number (${calc.profile.split('/')[1]}) represents the unconscious physical design that others see before you notice it yourself. Together, they create the dynamic interplay of the ${calc.profileName}.`,
      keywords: [calc.profile, calc.profileName],
    },
  ];

  return {
    systemId: 'human-design',
    systemName: 'Human Design',
    generatedAt: new Date().toISOString(),
    profiles: [profile],
    data: calc,
    interpretations,
  };
}
