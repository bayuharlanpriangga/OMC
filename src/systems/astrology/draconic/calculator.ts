import { BirthProfile } from '../../../types/birth-data';
import { calculateNatalChart, degreeToSign, normalizeAngle } from '../natal/calculator';
import { AstrologyCalculationResult, PlanetPosition } from '../types';

/**
 * Draconic Chart Calculator
 * Adjusts all planetary positions by subtracting the longitude of the North Node.
 * This positions the True/Mean North Node at 0°00' Aries.
 */
export function calculateDraconicChart(
  profile: BirthProfile,
  settings: { nodeType?: string } = {}
): AstrologyCalculationResult {
  const natalResult = calculateNatalChart(profile);
  const northNode = natalResult.planets.find((p) => p.name === 'North Node');
  const nodeOffset = northNode ? northNode.absoluteDegree : 0;

  const draconicPlanets: PlanetPosition[] = natalResult.planets.map((planet) => {
    const draconicAbs = normalizeAngle(planet.absoluteDegree - nodeOffset);
    const sign = degreeToSign(draconicAbs);
    const degInSign = draconicAbs % 30;

    return {
      ...planet,
      sign,
      degree: Math.floor(degInSign),
      minute: Math.floor((degInSign % 1) * 60),
      absoluteDegree: draconicAbs,
    };
  });

  return {
    ...natalResult,
    chartType: 'draconic',
    planets: draconicPlanets,
    metadata: {
      ...natalResult.metadata,
    },
  };
}
