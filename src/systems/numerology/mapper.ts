import { BaseChartResult, ChartInterpretationSection } from '../../types/systems';
import { BirthProfile } from '../../types/birth-data';
import { NumerologyCalculationResult } from './types';

export function mapNumerologyResult(
  calc: NumerologyCalculationResult,
  profile: BirthProfile
): BaseChartResult<NumerologyCalculationResult> {
  const lp = calc.lifePathNumber;
  const dest = calc.destinyNumber;
  const periodNow = (list: typeof calc.birth.pinnacles) =>
    list.find((p) => calc.currentAge >= p.startAge && (p.endAge === null || calc.currentAge <= p.endAge));
  const pinnacleNow = periodNow(calc.birth.pinnacles);

  const interpretations: ChartInterpretationSection[] = [
    {
      title: `Life Path ${lp.display}: ${lp.name}`,
      category: 'Primary Destiny Highway',
      summary: `Your central cosmic mission and evolutionary curriculum.`,
      content: `Life Path ${lp.value} represents the major lesson you came here to master. Governed by "${lp.tagline}", your core journey invites you to anchor ${lp.keywords.join(', ')}. When aligned with this frequency, opportunities emerge organically.`,
      keywords: [`Life Path ${lp.value}`, ...lp.keywords],
      highlights: [
        { label: 'Life Path Number', value: lp.display },
        { label: 'Archetype', value: lp.name },
        { label: 'Core Theme', value: lp.tagline },
      ],
    },
    {
      title: `Current Temporal Cycle: Personal Year ${calc.personalYearNumber}`,
      category: '9-Year Epicycle Phase',
      summary: `The prevailing energetic climate of your current calendar year (${calc.currentYear}).`,
      content: `You are traversing a Personal Year ${calc.personalYearNumber} in the universal 9-year evolutionary cycle. This temporal phase emphasizes ${getPersonalYearTheme(calc.personalYearNumber)}.`,
      keywords: [`Personal Year ${calc.personalYearNumber}`, `${calc.currentYear} Cycle`],
    },
  ];

  if (dest) {
    interpretations.splice(1, 0,
    {
      title: `Expression / Destiny Number ${dest.display}: ${dest.name}`,
      category: 'Natural Talents & Soul Vocations',
      summary: `How your name channels energetic potential into real-world manifestation.`,
      content: `Derived from the acoustic vibration of your given name, Expression ${dest.value} describes the specific toolkit, communicative style, and innate competencies you naturally possess to fulfill your Life Path.`,
      keywords: [`Expression ${dest.value}`, ...dest.keywords],
      highlights: [
        { label: 'Expression Number', value: dest.display },
        { label: 'Archetype', value: dest.name },
      ],
    }
    );
  }

  if (pinnacleNow) {
    const idx = calc.birth.pinnacles.indexOf(pinnacleNow) + 1;
    interpretations.push({
      title: `Current Pinnacle ${idx}: ${pinnacleNow.value}`,
      category: 'Life Stage Pinnacle',
      summary: `The dominant lesson of your current life stage (age ${pinnacleNow.startAge}${pinnacleNow.endAge === null ? '+' : `–${pinnacleNow.endAge}`}).`,
      content: `You are in your ${['first', 'second', 'third', 'fourth'][idx - 1]} Pinnacle, vibrating as ${pinnacleNow.value}. This stage highlights the themes of that number as the main opportunity and focus for this period of life.`,
      keywords: [`Pinnacle ${pinnacleNow.value}`],
    });
  }

  return {
    systemId: 'numerology',
    systemName: 'Numerology',
    generatedAt: new Date().toISOString(),
    profiles: [profile],
    data: calc,
    interpretations,
  };
}

function getPersonalYearTheme(year: number): string {
  const map: Record<number, string> = {
    1: 'new beginnings, pioneering ventures, self-reliance, and planting fresh intentional seeds',
    2: 'patience, partnership, cooperative development, and quiet emotional attunement',
    3: 'creative self-expression, joyful expansion, social connection, and artistic flow',
    4: 'hard work, structural foundations, physical organization, and disciplined security',
    5: 'dynamic change, liberation from constraints, travel, and personal flexibility',
    6: 'family obligations, community responsibility, domestic beauty, and heart healing',
    7: 'deep introspection, spiritual study, solitary reflection, and inner wisdom',
    8: 'material empowerment, executive achievement, financial expansion, and karmic harvest',
    9: 'release, forgiveness, compassionate completions, and clearing the deck for a new 9-year spiral',
  };
  return map[year] || 'growth and realignment';
}
