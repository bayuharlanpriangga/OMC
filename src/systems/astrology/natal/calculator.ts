import * as Astronomy from 'astronomy-engine';
import * as ephemeris from 'ephemeris';
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

// ---------------------------------------------------------------------------
// Small trig helpers (degrees in)
// ---------------------------------------------------------------------------
const toRad = (deg: number): number => deg * (Math.PI / 180);
const toDeg = (rad: number): number => rad * (180 / Math.PI);
const sinD = (deg: number): number => Math.sin(toRad(deg));
const cosD = (deg: number): number => Math.cos(toRad(deg));
const tanD = (deg: number): number => Math.tan(toRad(deg));

export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export function degreeToSign(degree: number): ZodiacSign {
  const norm = normalizeAngle(degree);
  const signIndex = Math.floor(norm / 30);
  return ZODIAC_SIGNS[signIndex % 12];
}

// ---------------------------------------------------------------------------
// Timezone-aware local civil time -> UTC conversion.
//
// BirthProfile stores a local calendar date/time plus an IANA timezone name
// (e.g. "Asia/Jakarta"). Astrological houses/Ascendant rotate ~1 degree
// every 4 minutes, so treating local clock time as if it were already UTC
// (the previous behaviour) can throw houses off by dozens of degrees for
// any birthplace far from Greenwich. We resolve the true UTC instant using
// the standard "double conversion" technique via Intl, which correctly
// accounts for historical DST rules without needing a timezone database
// dependency.
// ---------------------------------------------------------------------------
export function zonedCivilTimeToUtc(
  year: number, month: number, day: number, hour: number, minute: number,
  timeZone: string
): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const parts = dtf.formatToParts(guess).reduce((acc: Record<string, string>, p) => {
      if (p.type !== 'literal') acc[p.type] = p.value;
      return acc;
    }, {});
    const renderedAsUtc = Date.UTC(
      parseInt(parts.year, 10),
      parseInt(parts.month, 10) - 1,
      parseInt(parts.day, 10),
      parts.hour === '24' ? 0 : parseInt(parts.hour, 10),
      parseInt(parts.minute, 10),
      parseInt(parts.second, 10)
    );
    // How far off the guess's rendering in `timeZone` is from the desired
    // local wall-clock time tells us the zone's UTC offset at this instant.
    const diffMs = renderedAsUtc - guess.getTime();
    return new Date(guess.getTime() - diffMs);
  } catch {
    // Unknown/invalid IANA zone name: fall back to treating the time as UTC
    // (previous behaviour) rather than throwing.
    return guess;
  }
}

// ---------------------------------------------------------------------------
// Sidereal zodiac (Lahiri ayanamsa). Real Lahiri includes small periodic
// terms; this linear approximation (accurate to a few arc-minutes across
// recent decades) is the same order of precision most consumer apps use.
// ---------------------------------------------------------------------------
function lahiriAyanamsa(year: number): number {
  return 23.853 + 0.0139710 * (year - 2000);
}

// ---------------------------------------------------------------------------
// Mean lunar North Node (Meeus, "Astronomical Algorithms" ch. 47).
// ---------------------------------------------------------------------------
export function meanLunarNode(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const omega = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T ** 3) / 467441 - (T ** 4) / 60616000;
  return normalizeAngle(omega);
}

// ---------------------------------------------------------------------------
// Chiron: astronomy-engine does not model minor bodies, so Chiron comes from
// the `ephemeris` package (Moshier-based, pure JS, no data files). Verified
// against known ingress dates (Aquarius 2005, Pisces 2010, Aries 2018).
// ---------------------------------------------------------------------------
export function chironEclipticLongitude(date: Date): number {
  const r: any = ephemeris.getPlanet('chiron', date, 0, 0, 0);
  return normalizeAngle(r.observed.chiron.apparentLongitudeDd);
}

// ---------------------------------------------------------------------------
// Real geocentric apparent ecliptic longitude for any major planet via
// astronomy-engine (VSOP87/DE-derived, arc-second-class precision).
// ---------------------------------------------------------------------------
export function planetEclipticLongitude(body: Astronomy.Body, date: Date): number {
  if (body === Astronomy.Body.Sun) {
    return normalizeAngle(Astronomy.SunPosition(date).elon);
  }
  if (body === Astronomy.Body.Moon) {
    return normalizeAngle(Astronomy.EclipticGeoMoon(date).lon);
  }
  const vec = Astronomy.GeoVector(body, date, true);
  return normalizeAngle(Astronomy.Ecliptic(vec).elon);
}

function isRetrogradeNumeric(getLon: (d: Date) => number, date: Date): boolean {
  const before = getLon(new Date(date.getTime() - 12 * 3600 * 1000));
  const after = getLon(new Date(date.getTime() + 12 * 3600 * 1000));
  let delta = after - before;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

// ---------------------------------------------------------------------------
// House systems
// ---------------------------------------------------------------------------

// Whether a candidate cusp longitude should be read as its own value or its
// 180-degree opposite when assembling a monotonic sequence of house cusps
// around the circle (handles wraparound through 0/360).
function useOpposite(prevDeg: number, candidateDeg: number): boolean {
  if (candidateDeg < prevDeg) return !(Math.abs(candidateDeg - prevDeg) >= 180);
  if (prevDeg < candidateDeg) return !(candidateDeg - prevDeg < 180);
  return false;
}

// Assembles all 12 cusps from the Ascendant, Midheaven, and a callback that
// supplies the "raw" intermediate cusps for houses 2, 3, 11, 12 (from which
// 5, 6, 8, 9 are derived by symmetry, and 1/4/7/10 are Asc/IC/Desc/MC).
function assembleTwelveCusps(ascendant: number, midheaven: number, intermediate: (house: 2 | 3 | 11 | 12) => number): number[] {
  const h2raw = normalizeAngle(intermediate(2));
  const h3raw = normalizeAngle(intermediate(3));
  const h11raw = normalizeAngle(intermediate(11));
  const h12raw = normalizeAngle(intermediate(12));

  const ic = normalizeAngle(midheaven + 180);
  const desc = normalizeAngle(ascendant + 180);
  const h11opp = normalizeAngle(h11raw + 180);
  const h12opp = normalizeAngle(h12raw + 180);
  const h2opp = normalizeAngle(h2raw + 180);
  const h3opp = normalizeAngle(h3raw + 180);

  const h1 = ascendant;
  const h2 = useOpposite(h1, h2raw) ? h2opp : h2raw;
  const h3 = useOpposite(h1, h3raw) ? h3opp : h3raw;
  const h4 = ic;
  const h5 = useOpposite(h4, h11opp) ? h11raw : h11opp;
  const h6 = useOpposite(h4, h12opp) ? h12raw : h12opp;
  const h7 = desc;
  const h8 = useOpposite(h7, h2opp) ? h2raw : h2opp;
  const h9 = useOpposite(h7, h3opp) ? h3raw : h3opp;
  const h10 = midheaven;
  const h11 = useOpposite(h10, h11raw) ? h11opp : h11raw;
  const h12 = useOpposite(h10, h12raw) ? h12opp : h12raw;

  return [h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12];
}

// Placidus: divides the diurnal/nocturnal semi-arcs into thirds. Solved
// iteratively (fixed-point/Newton style), since a cusp's own declination
// depends on its longitude. This mirrors the standard published Placidus
// construction (e.g. Michael Erlewine's "Manual of Computer Programming
// for Astrologers").
function placidusCusps(ramc: number, ascendant: number, midheaven: number, latitude: number, obliquity: number): number[] {
  const offsetFor = (house: 2 | 3 | 11 | 12): number => {
    switch (house) {
      case 11: return ramc + 30;
      case 12: return ramc + 60;
      case 2: return ramc + 120;
      case 3: return ramc + 150;
    }
  };
  const fractionFor = (house: 2 | 3 | 11 | 12): number => {
    switch (house) {
      case 2: return 2 / 3;
      case 3: return 1 / 3;
      case 11: return 1 / 3;
      case 12: return 2 / 3;
    }
  };

  const solve = (house: 2 | 3 | 11 | 12): number => {
    const t = offsetFor(house);
    const frac = fractionFor(house);
    let c = Math.asin(sinD(obliquity) * sinD(t));
    let prev = 0;
    for (let i = 0; i < 30 && Math.abs(c - prev) >= 1e-5; i++) {
      const e = Math.atan(frac * (tanD(latitude) / cosD(t)));
      prev = c;
      c = Math.atan((tanD(t) * Math.cos(e)) / Math.cos(e + toRad(obliquity)));
    }
    return normalizeAngle(toDeg(c) + 180);
  };

  return assembleTwelveCusps(ascendant, midheaven, solve);
}

function equalHouseCusps(ascendant: number): number[] {
  return Array.from({ length: 12 }, (_, i) => normalizeAngle(ascendant + i * 30));
}

function wholeSignCusps(ascendant: number): number[] {
  const signStart = Math.floor(normalizeAngle(ascendant) / 30) * 30;
  return Array.from({ length: 12 }, (_, i) => normalizeAngle(signStart + i * 30));
}

// ---------------------------------------------------------------------------
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

  // Resolve the true UTC instant from the birth profile's local civil time
  // + IANA timezone (falls back to treating the time as UTC if no
  // timezone is recorded, e.g. legacy profiles).
  const utcDate = profile.timezone
    ? zonedCivilTimeToUtc(year, month, day, hour, minute, profile.timezone)
    : new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  const jd = 2451545.0 + (utcDate.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000;

  const zodiac = (settings.zodiac as string) || 'tropical';
  const ayanamsa = zodiac === 'sidereal' ? lahiriAyanamsa(year) : 0;
  const toZodiacFrame = (tropicalDeg: number) => normalizeAngle(tropicalDeg - ayanamsa);

  const bodyMap: Array<{ id: string; name: string; body?: Astronomy.Body; chiron?: boolean }> = [
    { id: 'sun', name: 'Sun', body: Astronomy.Body.Sun },
    { id: 'moon', name: 'Moon', body: Astronomy.Body.Moon },
    { id: 'mercury', name: 'Mercury', body: Astronomy.Body.Mercury },
    { id: 'venus', name: 'Venus', body: Astronomy.Body.Venus },
    { id: 'mars', name: 'Mars', body: Astronomy.Body.Mars },
    { id: 'jupiter', name: 'Jupiter', body: Astronomy.Body.Jupiter },
    { id: 'saturn', name: 'Saturn', body: Astronomy.Body.Saturn },
    { id: 'uranus', name: 'Uranus', body: Astronomy.Body.Uranus },
    { id: 'neptune', name: 'Neptune', body: Astronomy.Body.Neptune },
    { id: 'pluto', name: 'Pluto', body: Astronomy.Body.Pluto },
    { id: 'chiron', name: 'Chiron', chiron: true },
  ];

  const planetsRaw = bodyMap.map(({ id, name, body, chiron }) => {
    const getLon = chiron
      ? (d: Date) => chironEclipticLongitude(d)
      : (d: Date) => planetEclipticLongitude(body as Astronomy.Body, d);
    const absDeg = getLon(utcDate);
    const isRetro = (id === 'sun' || id === 'moon') ? false : isRetrogradeNumeric(getLon, utcDate);
    return { id, name, absDeg: toZodiacFrame(absDeg), isRetro };
  });

  const nodeLon = meanLunarNode(jd);
  planetsRaw.push({ id: 'north-node', name: 'North Node', absDeg: toZodiacFrame(nodeLon), isRetro: true });

  // Ascendant, Midheaven, and houses
  let ascendantDeg = 0;
  let midheavenDeg = 0;
  let houses: HouseCusp[] = [];
  const obliquity = 23.4392911;

  if (hasTime) {
    const gst = getGreenwichSiderealTime(jd);
    const lst = normalizeAngle(gst * 15 + profile.longitude);
    const ramc = lst; // Right Ascension of the Midheaven, in degrees

    // Standard formulas (Meeus): MC and Ascendant ecliptic longitudes from RAMC
    const mcTropical = normalizeAngle(toDeg(Math.atan2(sinD(ramc), cosD(ramc) * cosD(obliquity))));
    const ascTropical = normalizeAngle(
      toDeg(Math.atan2(cosD(ramc), -(sinD(ramc) * cosD(obliquity) + tanD(profile.latitude) * sinD(obliquity))))
    );
    ascendantDeg = toZodiacFrame(ascTropical);
    midheavenDeg = toZodiacFrame(mcTropical);

    const houseSystem = settings.houseSystem || 'placidus';
    let cusps: number[];
    switch (houseSystem) {
      case 'whole-sign':
        cusps = wholeSignCusps(ascendantDeg);
        break;
      case 'equal':
        cusps = equalHouseCusps(ascendantDeg);
        break;
      case 'placidus':
      case 'koch': // Koch not yet separately implemented; Placidus is used as the nearest supported system.
      default:
        cusps = placidusCusps(ramc, ascendantDeg, midheavenDeg, profile.latitude, obliquity);
        break;
    }

    houses = cusps.map((cuspDeg, idx) => {
      const sign = degreeToSign(cuspDeg);
      return {
        house: idx + 1,
        sign,
        degree: Math.floor(cuspDeg % 30),
        minute: Math.floor((cuspDeg % 1) * 60),
        absoluteDegree: cuspDeg,
        ruler: getSignRuler(sign),
      };
    });
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

function getGreenwichSiderealTime(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  let gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + t * t * 0.000387933;
  gst = ((gst % 360) + 360) % 360;
  return gst / 15;
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
