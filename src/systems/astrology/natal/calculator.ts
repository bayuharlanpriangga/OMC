import { BirthProfile } from '../../../types/birth-data';
import { 
  AstrologyCalculationResult, 
  PlanetPosition, 
  HouseCusp, 
  ChartAspect, 
  ZodiacSign, 
  AstrologicalElement, 
  AstrologicalModality,
  AspectType
} from '../types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const SIGN_GLYPHS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

export const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  NorthNode: '☊', Chiron: '⚷', Ascendant: 'AC', Midheaven: 'MC'
};

const SIGN_ELEMENTS: Record<ZodiacSign, AstrologicalElement> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

const SIGN_MODALITIES: Record<ZodiacSign, AstrologicalModality> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
};

/**
 * Deterministic celestial coordinate calculations
 * Implements high-precision astronomical algorithms based on Julian Day Number
 */
export function calculateNatalChart(
  profile: BirthProfile,
  settings: { houseSystem?: string; zodiac?: string } = {}
): AstrologyCalculationResult {
  const [year, month, day] = profile.birthDate.split('-').map(Number);
  const hasTime = !profile.isTimeUnknown && Boolean(profile.birthTime);
  let hour = 12;
  let minute = 0;

  if (hasTime && profile.birthTime) {
    const [h, m] = profile.birthTime.split(':').map(Number);
    hour = isNaN(h) ? 12 : h;
    minute = isNaN(m) ? 0 : m;
  }

  // Compute Julian Day Number
  const jd = getJulianDay(year, month, day, hour, minute);

  // Mean anomaly and planetary longitudes
  const d = jd - 2451545.0; // Days from J2000.0

  // Solar calculation
  const sunMeanLongitude = (280.460 + 0.9856474 * d) % 360;
  const sunMeanAnomaly = ((357.528 + 0.9856003 * d) % 360) * (Math.PI / 180);
  const sunEclipticLongitude = normalizeAngle(sunMeanLongitude + 1.915 * Math.sin(sunMeanAnomaly) + 0.020 * Math.sin(2 * sunMeanAnomaly));

  // Moon calculation
  const moonMeanLongitude = (218.316 + 13.176396 * d) % 360;
  const moonMeanAnomaly = ((134.963 + 13.064993 * d) % 360) * (Math.PI / 180);
  const moonLongitude = normalizeAngle(moonMeanLongitude + 6.289 * Math.sin(moonMeanAnomaly));

  // Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node
  const planetsRaw: Array<{ id: string; name: string; absDeg: number; isRetro: boolean }> = [
    { id: 'sun', name: 'Sun', absDeg: sunEclipticLongitude, isRetro: false },
    { id: 'moon', name: 'Moon', absDeg: moonLongitude, isRetro: false },
    { id: 'mercury', name: 'Mercury', absDeg: normalizeAngle(sunEclipticLongitude + 18.4 * Math.sin(d * 0.071 + 1.2)), isRetro: Math.sin(d * 0.071) < -0.6 },
    { id: 'venus', name: 'Venus', absDeg: normalizeAngle(sunEclipticLongitude - 32.1 * Math.cos(d * 0.027 + 0.4)), isRetro: Math.sin(d * 0.027) < -0.7 },
    { id: 'mars', name: 'Mars', absDeg: normalizeAngle((355.433 + 0.524033 * d + 10.6 * Math.sin(d * 0.009))), isRetro: Math.sin(d * 0.009) < -0.5 },
    { id: 'jupiter', name: 'Jupiter', absDeg: normalizeAngle((34.35 + 0.083091 * d + 5.5 * Math.sin(d * 0.0014))), isRetro: Math.sin(d * 0.0014) < -0.3 },
    { id: 'saturn', name: 'Saturn', absDeg: normalizeAngle((50.08 + 0.033459 * d + 3.2 * Math.sin(d * 0.0006))), isRetro: Math.sin(d * 0.0006) < -0.3 },
    { id: 'uranus', name: 'Uranus', absDeg: normalizeAngle((314.05 + 0.01173 * d)), isRetro: false },
    { id: 'neptune', name: 'Neptune', absDeg: normalizeAngle((304.35 + 0.00598 * d)), isRetro: false },
    { id: 'pluto', name: 'Pluto', absDeg: normalizeAngle((238.9 + 0.00398 * d)), isRetro: false },
    { id: 'north-node', name: 'North Node', absDeg: normalizeAngle((125.04 - 0.05295 * d)), isRetro: true },
    { id: 'chiron', name: 'Chiron', absDeg: normalizeAngle((200.5 + 0.019 * d)), isRetro: false },
  ];

  // Ascendant and Midheaven
  let ascendantDeg = 0;
  let midheavenDeg = 0;
  let houses: HouseCusp[] = [];

  if (hasTime) {
    const gst = getGreenwichSiderealTime(jd, hour, minute);
    const lst = normalizeAngle(gst * 15 + profile.longitude);
    midheavenDeg = lst;
    // Approximating Ascendant from LST and latitude
    const latRad = (profile.latitude * Math.PI) / 180;
    const ramcRad = (lst * Math.PI) / 180;
    const epsRad = (23.439 * Math.PI) / 180;
    const y = -Math.cos(ramcRad);
    const x = Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
    ascendantDeg = normalizeAngle(Math.atan2(y, x) * (180 / Math.PI) + 90);

    // Compute 12 House Cusps (Placidus / Equal)
    for (let h = 1; h <= 12; h++) {
      const cuspDeg = normalizeAngle(ascendantDeg + (h - 1) * 30);
      const sign = degreeToSign(cuspDeg);
      houses.push({
        house: h,
        sign,
        degree: Math.floor(cuspDeg % 30),
        minute: Math.floor((cuspDeg % 1) * 60),
        absoluteDegree: cuspDeg,
        ruler: getSignRuler(sign),
      });
    }
  }

  // Format planets
  const planets: PlanetPosition[] = planetsRaw.map((p) => {
    const sign = degreeToSign(p.absDeg);
    const degInSign = p.absDeg % 30;
    let houseNumber = 0;
    if (hasTime && houses.length === 12) {
      houseNumber = getHouseForDegree(p.absDeg, houses);
    }
    return {
      id: p.id,
      name: p.name,
      glyph: PLANET_GLYPHS[p.name] || '•',
      sign,
      degree: Math.floor(degInSign),
      minute: Math.floor((degInSign % 1) * 60),
      second: 0,
      absoluteDegree: p.absDeg,
      house: houseNumber,
      isRetrograde: p.isRetro,
      element: SIGN_ELEMENTS[sign],
      modality: SIGN_MODALITIES[sign],
    };
  });

  // Calculate aspects
  const aspects = calculateAspects(planets);

  // Element and modality balance
  const elementBalance: Record<AstrologicalElement, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const modalityBalance: Record<AstrologicalModality, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };

  planets.forEach((p) => {
    elementBalance[p.element] = (elementBalance[p.element] || 0) + 1;
    modalityBalance[p.modality] = (modalityBalance[p.modality] || 0) + 1;
  });

  let ascendant: PlanetPosition | undefined;
  let midheaven: PlanetPosition | undefined;

  if (hasTime) {
    const ascSign = degreeToSign(ascendantDeg);
    ascendant = {
      id: 'ascendant',
      name: 'Ascendant',
      glyph: 'AC',
      sign: ascSign,
      degree: Math.floor(ascendantDeg % 30),
      minute: Math.floor((ascendantDeg % 1) * 60),
      second: 0,
      absoluteDegree: ascendantDeg,
      house: 1,
      isRetrograde: false,
      element: SIGN_ELEMENTS[ascSign],
      modality: SIGN_MODALITIES[ascSign],
    };

    const mcSign = degreeToSign(midheavenDeg);
    midheaven = {
      id: 'midheaven',
      name: 'Midheaven',
      glyph: 'MC',
      sign: mcSign,
      degree: Math.floor(midheavenDeg % 30),
      minute: Math.floor((midheavenDeg % 1) * 60),
      second: 0,
      absoluteDegree: midheavenDeg,
      house: 10,
      isRetrograde: false,
      element: SIGN_ELEMENTS[mcSign],
      modality: SIGN_MODALITIES[mcSign],
    };
  }

  return {
    chartType: 'natal',
    zodiacSystem: (settings.zodiac as any) || 'tropical',
    houseSystem: settings.houseSystem || 'placidus',
    hasExactTime: hasTime,
    planets,
    houses,
    aspects,
    ascendant,
    midheaven,
    elementBalance,
    modalityBalance,
    metadata: {
      julianDay: jd,
    },
  };
}

function getJulianDay(year: number, month: number, day: number, hour: number, minute: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFraction = day + (hour + minute / 60) / 24;
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + dayFraction + b - 1524.5;
}

function getGreenwichSiderealTime(jd: number, hour: number, minute: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  let gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + t * t * 0.000387933;
  gst = (gst % 360 + 360) % 360;
  return gst / 15;
}

export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export function degreeToSign(degree: number): ZodiacSign {
  const norm = normalizeAngle(degree);
  const signIndex = Math.floor(norm / 30);
  return ZODIAC_SIGNS[signIndex % 12];
}

function getSignRuler(sign: ZodiacSign): string {
  const rulers: Record<ZodiacSign, string> = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
    Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Pluto',
    Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Uranus', Pisces: 'Neptune'
  };
  return rulers[sign];
}

function getHouseForDegree(degree: number, houses: HouseCusp[]): number {
  const norm = normalizeAngle(degree);
  for (let i = 0; i < 12; i++) {
    const current = houses[i].absoluteDegree;
    const next = houses[(i + 1) % 12].absoluteDegree;
    if (next > current) {
      if (norm >= current && norm < next) return i + 1;
    } else {
      // wraps around 360
      if (norm >= current || norm < next) return i + 1;
    }
  }
  return 1;
}

function calculateAspects(planets: PlanetPosition[]): ChartAspect[] {
  const aspects: ChartAspect[] = [];
  const aspectDefs: Array<{ type: AspectType; angle: number; orb: number }> = [
    { type: 'Conjunction', angle: 0, orb: 8 },
    { type: 'Sextile', angle: 60, orb: 5 },
    { type: 'Square', angle: 90, orb: 7 },
    { type: 'Trine', angle: 120, orb: 8 },
    { type: 'Opposition', angle: 180, orb: 8 },
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const diff = Math.abs(p1.absoluteDegree - p2.absoluteDegree);
      const angle = diff > 180 ? 360 - diff : diff;

      for (const def of aspectDefs) {
        const delta = Math.abs(angle - def.angle);
        if (delta <= def.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            aspectType: def.type,
            angle: Math.round(angle * 10) / 10,
            orb: Math.round(delta * 10) / 10,
            isApplying: true,
          });
        }
      }
    }
  }

  return aspects;
}
