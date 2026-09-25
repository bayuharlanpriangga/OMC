import { BaseChartResult, ChartInterpretationSection } from '../../types/systems';
import { BirthProfile } from '../../types/birth-data';
import { TzolkinCalculationResult } from './types';

export function mapTzolkinResult(
  calc: TzolkinCalculationResult,
  profile: BirthProfile
): BaseChartResult<TzolkinCalculationResult> {
  const kin = calc.destinyKin;

  const interpretations: ChartInterpretationSection[] = [
    {
      title: `Galactic Signature: Kin ${kin.kinNumber} (${kin.seal.color} ${kin.tone.name} ${kin.seal.name})`,
      category: 'Cosmic Solar Identity',
      summary: `Your vibrational frequency in the 260-kin sacred galactic matrix.`,
      content: `As Kin ${kin.kinNumber}, your solar seal is ${kin.seal.name} (${kin.seal.mayaName}) in the ${kin.seal.color} directional family, powered by the ${kin.tone.name} tone of ${kin.tone.action}. Your core essence is ${kin.seal.essence}, activating through ${kin.seal.power}.`,
      keywords: [`Kin ${kin.kinNumber}`, `${kin.seal.color} ${kin.seal.name}`, `${kin.tone.name} Tone`],
      highlights: [
        { label: 'Kin Number', value: `Kin ${kin.kinNumber}` },
        { label: 'Solar Seal', value: `${kin.seal.name} (${kin.seal.mayaName})` },
        { label: 'Galactic Tone', value: `${kin.tone.name} (Tone ${kin.tone.number})` },
        { label: 'Solar Action', value: kin.seal.action },
        { label: 'Affirmation', value: kin.affirmation },
      ],
    },
    {
      title: `Wavespell Journey: ${calc.wavespellSeal.name} Wavespell`,
      category: '13-Kin Evolutionary Rhythm',
      summary: `You were born on Day ${calc.wavespellDay} of the 13-day ${calc.wavespellSeal.name} cycle.`,
      content: `The Wavespell is the foundational fractal time unit of the Tzolkin. The ${calc.wavespellSeal.name} Wavespell provides the spiritual quest and overarching curriculum that informs your destiny kin.`,
      keywords: [`${calc.wavespellSeal.name} Wavespell`, `Day ${calc.wavespellDay} of 13`],
    },
  ];

  return {
    systemId: 'tzolkin',
    systemName: 'Tzolkin (Mayan Calendar)',
    generatedAt: new Date().toISOString(),
    profiles: [profile],
    data: calc,
    interpretations,
  };
}
