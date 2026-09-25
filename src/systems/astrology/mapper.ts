import { BaseChartResult, ChartInterpretationSection } from '../../types/systems';
import { BirthProfile } from '../../types/birth-data';
import { AstrologyCalculationResult, PlanetPosition } from './types';
import { ASTROLOGY_CHART_TYPES } from './registry';

export function mapAstrologyResult(
  calc: AstrologyCalculationResult,
  profile: BirthProfile
): BaseChartResult<AstrologyCalculationResult> {
  const chartDescriptor = ASTROLOGY_CHART_TYPES[calc.chartType as keyof typeof ASTROLOGY_CHART_TYPES] || {
    name: 'Astrological Chart',
  };

  const sun = calc.planets.find((p) => p.name === 'Sun');
  const moon = calc.planets.find((p) => p.name === 'Moon');
  const asc = calc.ascendant;

  const interpretations: ChartInterpretationSection[] = [];

  // Core Identity / Sun
  if (sun) {
    interpretations.push({
      title: `Solar Vitality in ${sun.sign}`,
      category: 'Core Identity & Life Force',
      summary: `The Sun represents the conscious ego, self-expression, and core vitality in ${sun.sign}.`,
      content: `With your Sun at ${sun.degree}°${sun.minute}' ${sun.sign}${sun.house ? ` in the ${getOrdinal(sun.house)} House` : ''}, your conscious purpose radiates through ${getSignKeywords(sun.sign)}. This is the central engine of your individuality—how you create meaning, assert your will, and build lasting legacy.`,
      keywords: [sun.sign, `${sun.element} Element`, `${sun.modality} Modality`],
      highlights: [
        { label: 'Degree', value: `${sun.degree}° ${sun.minute}'` },
        { label: 'Element', value: sun.element },
        { label: 'Modality', value: sun.modality },
      ],
    });
  }

  // Emotional Nature / Moon
  if (moon) {
    interpretations.push({
      title: `Lunar Sanctuary in ${moon.sign}`,
      category: 'Emotional Landscape & Instinct',
      summary: `The Moon reflects subconscious patterns, emotional safety, and instinctive responses in ${moon.sign}.`,
      content: `Your Moon at ${moon.degree}°${moon.minute}' ${moon.sign}${moon.house ? ` in the ${getOrdinal(moon.house)} House` : ''} governs how you nurture yourself and others. In ${moon.sign}, safety is established when you honor your need for ${getMoonKeywords(moon.sign)}.`,
      keywords: [moon.sign, `${moon.element} Element`, 'Instinctive Body'],
      highlights: [
        { label: 'Degree', value: `${moon.degree}° ${moon.minute}'` },
        { label: 'Element', value: moon.element },
      ],
    });
  }

  // Ascendant / Rising
  if (asc) {
    interpretations.push({
      title: `Ascendant Threshold: ${asc.sign} Rising`,
      category: 'Outer Persona & First Impressions',
      summary: `The Eastern Horizon at birth shapes physical vitality and outer engagement.`,
      content: `Having ${asc.sign} Rising at ${asc.degree}°${asc.minute}' establishes the lens through which you perceive reality. Others initially register your presence as ${getAscendantKeywords(asc.sign)}. Your chart ruler guides your life path through its corresponding house and aspect network.`,
      keywords: [asc.sign, 'First House Cusp', 'Chart Horizon'],
    });
  } else if (!calc.hasExactTime) {
    interpretations.push({
      title: 'Ascendant & House Cusps Omitted',
      category: 'Time Sensitivity Note',
      summary: 'Exact birth time is unknown, so house divisions and Rising Sign cannot be precisely ascertained.',
      content: 'Because the Earth rotates 1 degree every four minutes, the Ascendant changes signs approximately every two hours. Planetary sign placements remain highly accurate, but specific life arenas (Houses 1 through 12) require a verified birth time.',
    });
  }

  // Elemental Distribution
  const topElement = Object.entries(calc.elementBalance).sort((a, b) => b[1] - a[1])[0];
  interpretations.push({
    title: `Elemental Alchemy: Dominant ${topElement[0]}`,
    category: 'Energetic Constitution',
    summary: `Your chart exhibits a predominant ${topElement[0]} signature with ${topElement[1]} planetary bodies.`,
    content: `The elemental balance reveals your default mode of processing energy: Fire drives inspiration and spontaneous action, Earth anchors practicality and tangible results, Air stimulates conceptual dialogue and synthesis, while Water navigates empathic depth and intuition.`,
    highlights: Object.entries(calc.elementBalance).map(([el, count]) => ({
      label: el,
      value: `${count} bodies`,
    })),
  });

  return {
    systemId: 'astrology',
    chartTypeId: calc.chartType,
    systemName: 'Astrology',
    chartTypeName: chartDescriptor.name,
    generatedAt: new Date().toISOString(),
    profiles: [profile],
    data: calc,
    interpretations,
  };
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getSignKeywords(sign: string): string {
  const map: Record<string, string> = {
    Aries: 'pioneering courage, dynamic initiative, and sovereign independence',
    Taurus: 'grounded endurance, sensory appreciation, and steady resourcefulness',
    Gemini: 'intellectual curiosity, versatile storytelling, and mental agility',
    Cancer: 'deep intuitive resonance, emotional sanctuary, and protective care',
    Leo: 'creative radiance, heart-centered leadership, and noble warmth',
    Virgo: 'meticulous discernment, practical devotion, and systematic mastery',
    Libra: 'harmonious diplomacy, aesthetic equilibrium, and relational justice',
    Scorpio: 'transformative depth, psychological penetrance, and raw emotional truth',
    Sagittarius: 'philosophical expansion, wanderlust, and tireless quest for truth',
    Capricorn: 'strategic discipline, sovereign authority, and long-term architectural mastery',
    Aquarius: 'visionary innovation, humanitarian ideals, and nonconformist originality',
    Pisces: 'mystical empathy, transcendent imagination, and boundless oceanic oneness',
  };
  return map[sign] || 'individualized archetypal resonance';
}

function getMoonKeywords(sign: string): string {
  const map: Record<string, string> = {
    Aries: 'swift emotional autonomy and spontaneous passion',
    Taurus: 'tangible stability, comforting routines, and organic peace',
    Gemini: 'communicative sharing, mental stimulation, and verbal processing',
    Cancer: 'safe emotional shelter, familial warmth, and trusted privacy',
    Leo: 'affectionate appreciation, validation of creative gifts, and playful pride',
    Virgo: 'orderly simplicity, helpful purpose, and calm predictability',
    Libra: 'gentle reciprocal dialogue, aesthetic harmony, and relational peace',
    Scorpio: 'unflinching emotional intimacy, total privacy, and absolute loyalty',
    Sagittarius: 'spacious personal freedom, wide horizons, and philosophical levity',
    Capricorn: 'dignified self-sufficiency, respect, and tangible achievement',
    Aquarius: 'intellectual independence, friendship networks, and unforced individuality',
    Pisces: 'creative retreat, musical immersion, and gentle spiritual space',
  };
  return map[sign] || 'emotional alignment';
}

function getAscendantKeywords(sign: string): string {
  const map: Record<string, string> = {
    Aries: 'assertive, direct, and invigoratingly confident',
    Taurus: 'calm, composed, rooted, and physically reliable',
    Gemini: 'bright, communicative, alert, and socially engaging',
    Cancer: 'approachable, receptive, protective, and gently observant',
    Leo: 'dignified, magnetic, expressive, and warmly radiant',
    Virgo: 'attentive, perceptive, understated, and impeccably refined',
    Libra: 'charming, elegant, gracious, and attuned to social balance',
    Scorpio: 'magnetic, perceptive, quiet, and intensely focused',
    Sagittarius: 'open-hearted, buoyant, candid, and adventurous',
    Capricorn: 'mature, authoritative, competent, and grounded',
    Aquarius: 'distinctive, progressive, egalitarian, and refreshingly candid',
    Pisces: 'ethereal, adaptable, soft-spoken, and empathically porous',
  };
  return map[sign] || 'distinctive archetypal presence';
}
