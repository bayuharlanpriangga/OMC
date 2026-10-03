import * as Astronomy from 'astronomy-engine';
import { BirthProfile } from '../../types/birth-data';
import {
  chironEclipticLongitude,
  normalizeAngle,
  planetEclipticLongitude,
  zonedCivilTimeToUtc,
} from '../astrology/natal/calculator';
import { CHANNELS, GATE_CENTER, MOTOR_CENTERS, longitudeToGate, rightAngleCrossName } from './gates';
import {
  HDCenterId,
  HDGateActivation,
  HDVariableArrow,
  HumanDesignCalculationResult,
  HumanDesignType,
  InnerAuthority,
} from './types';

/**
 * Human Design — dihitung dari posisi astronomis nyata.
 *
 *  - Personality (sadar / hitam)  : posisi planet saat lahir.
 *  - Design (bawah sadar / merah) : posisi planet saat Matahari tepat 88° (busur ekliptika)
 *    sebelum posisi Matahari lahir, ± 88–89 hari sebelum lahir.
 *  - Setiap bujur ekliptika dipetakan ke roda 64 gate (lihat gates.ts).
 *  - Channel terdefinisi bila KEDUA gate-nya aktif (dari Personality maupun Design).
 */

const BODIES: Array<{ id: string; name: string; body?: Astronomy.Body; extra?: 'earth' | 'north-node' | 'south-node' | 'chiron' | 'lilith' }> = [
  { id: 'sun', name: 'Sun', body: Astronomy.Body.Sun },
  { id: 'earth', name: 'Earth', extra: 'earth' },
  { id: 'north-node', name: 'North Node', extra: 'north-node' },
  { id: 'south-node', name: 'South Node', extra: 'south-node' },
  { id: 'moon', name: 'Moon', body: Astronomy.Body.Moon },
  { id: 'mercury', name: 'Mercury', body: Astronomy.Body.Mercury },
  { id: 'venus', name: 'Venus', body: Astronomy.Body.Venus },
  { id: 'mars', name: 'Mars', body: Astronomy.Body.Mars },
  { id: 'jupiter', name: 'Jupiter', body: Astronomy.Body.Jupiter },
  { id: 'saturn', name: 'Saturn', body: Astronomy.Body.Saturn },
  { id: 'uranus', name: 'Uranus', body: Astronomy.Body.Uranus },
  { id: 'neptune', name: 'Neptune', body: Astronomy.Body.Neptune },
  { id: 'pluto', name: 'Pluto', body: Astronomy.Body.Pluto },
  { id: 'chiron', name: 'Chiron', extra: 'chiron' },
  { id: 'lilith', name: 'Lilith', extra: 'lilith' },
];

/**
 * True (osculating) lunar node: perpotongan bidang orbit Bulan saat itu dengan ekliptika.
 * Human Design (mis. humandesignindonesia) memakai True Node, bukan Mean Node.
 */
function trueLunarNode(date: Date): number {
  const dt = 60 * 1000; // 1 menit
  const pos = (d: Date) => Astronomy.Ecliptic(Astronomy.GeoMoon(d)).vec;
  const a = pos(new Date(date.getTime() - dt));
  const b = pos(new Date(date.getTime() + dt));
  const r = pos(date);
  const v = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
  // h = r × v ; node naik = k × h = (-h_y, h_x, 0)
  const hx = r.y * v.z - r.z * v.y;
  const hy = r.z * v.x - r.x * v.z;
  return normalizeAngle((Math.atan2(hx, -hy) * 180) / Math.PI);
}

/** Mean Black Moon Lilith (apogee rata-rata Bulan), Meeus ch. 50. */
function meanLilith(date: Date): number {
  const T = (toJd(date) - 2451545.0) / 36525;
  const perigee = 83.3532465 + 4069.0137287 * T - 0.01032 * T * T - T ** 3 / 80053 + T ** 4 / 18999000;
  return normalizeAngle(perigee + 180);
}

const toJd = (d: Date) => 2451545.0 + (d.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000;

function longitudeOf(id: string, date: Date): number {
  const sun = () => planetEclipticLongitude(Astronomy.Body.Sun, date);
  switch (id) {
    case 'earth':
      return normalizeAngle(sun() + 180);
    case 'north-node':
      return trueLunarNode(date);
    case 'south-node':
      return normalizeAngle(trueLunarNode(date) + 180);
    case 'chiron':
      return chironEclipticLongitude(date);
    case 'lilith':
      return meanLilith(date);
    default: {
      const b = BODIES.find((x) => x.id === id)!;
      return planetEclipticLongitude(b.body as Astronomy.Body, date);
    }
  }
}

/** Cari waktu ketika Matahari berada 88° di belakang bujur Matahari lahir. */
export function findDesignDate(birthUtc: Date): Date {
  const target = normalizeAngle(planetEclipticLongitude(Astronomy.Body.Sun, birthUtc) - 88);
  let t = birthUtc.getTime() - 89.3 * 86400000; // tebakan awal
  for (let i = 0; i < 12; i++) {
    const lon = planetEclipticLongitude(Astronomy.Body.Sun, new Date(t));
    let diff = lon - target;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 1e-7) break;
    t -= (diff / 0.9856) * 86400000; // Matahari ≈ 0.9856°/hari
  }
  return new Date(t);
}

function activationsAt(date: Date, isConscious: boolean): HDGateActivation[] {
  return BODIES.map(({ id, name, extra }) => {
    const longitude = longitudeOf(id, date);
    const g = longitudeToGate(longitude);
    return {
      gate: g.gate,
      line: g.line,
      planet: name,
      planetId: id,
      isConscious,
      color: g.color,
      tone: g.tone,
      base: g.base,
      longitude,
      isExtra: extra === 'chiron' || extra === 'lilith' ? true : undefined,
    };
  });
}

const arrow = (a: HDGateActivation): HDVariableArrow => ({
  color: a.color,
  tone: a.tone,
  direction: a.tone <= 3 ? 'left' : 'right',
});

const PROFILE_NAMES: Record<string, string> = {
  '1/3': 'Investigator / Martyr',
  '1/4': 'Investigator / Opportunist',
  '2/4': 'Hermit / Opportunist',
  '2/5': 'Hermit / Heretic',
  '3/5': 'Martyr / Heretic',
  '3/6': 'Martyr / Role Model',
  '4/6': 'Opportunist / Role Model',
  '4/1': 'Opportunist / Investigator',
  '5/1': 'Heretic / Investigator',
  '5/2': 'Heretic / Hermit',
  '6/2': 'Role Model / Hermit',
  '6/3': 'Role Model / Martyr',
};

const CENTER_NAMES: Record<HDCenterId, string> = {
  head: 'Head Center',
  ajna: 'Ajna Center',
  throat: 'Throat Center',
  'g-center': 'G-Center (Identity & Direction)',
  heart: 'Heart / Ego Center',
  'solar-plexus': 'Solar Plexus (Emotional)',
  sacral: 'Sacral Center (Life Force)',
  spleen: 'Spleen Center (Immunity & Intuition)',
  root: 'Root Center (Pressure & Adrenaline)',
};

export function calculateHumanDesign(
  profile: BirthProfile,
  _settings: Record<string, any> = {}
): HumanDesignCalculationResult {
  const [year, month, day] = profile.birthDate.split('-').map(Number);
  const hasTime = !profile.isTimeUnknown && Boolean(profile.birthTime);
  const [hour, min] = hasTime ? (profile.birthTime as string).split(':').map(Number) : [12, 0];

  const birthUtc = profile.timezone
    ? zonedCivilTimeToUtc(year, month, day, hour || 0, min || 0, profile.timezone)
    : new Date(Date.UTC(year, month - 1, day, hour || 0, min || 0, 0));
  const designUtc = findDesignDate(birthUtc);

  const personalityGates = activationsAt(birthUtc, true);
  const designGates = activationsAt(designUtc, false);

  // ---- Gate aktif (Chiron tidak ikut menentukan definisi) ----
  const active = new Set<number>();
  [...personalityGates, ...designGates].filter((a) => !a.isExtra).forEach((a) => active.add(a.gate));

  // ---- Channel & center terdefinisi ----
  const activeChannels = CHANNELS.filter((c) => active.has(c.gates[0]) && active.has(c.gates[1])).map((c) => ({
    id: c.id,
    name: c.name,
    gates: c.gates,
    centers: [GATE_CENTER[c.gates[0]], GATE_CENTER[c.gates[1]]] as [HDCenterId, HDCenterId],
  }));

  const defined = new Set<HDCenterId>();
  activeChannels.forEach((c) => c.centers.forEach((cid) => defined.add(cid)));

  // Graf koneksi antar center terdefinisi
  const adj = new Map<HDCenterId, Set<HDCenterId>>();
  activeChannels.forEach(({ centers: [a, b] }) => {
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a)!.add(b);
    adj.get(b)!.add(a);
  });

  const reachable = (from: HDCenterId): Set<HDCenterId> => {
    const seen = new Set<HDCenterId>([from]);
    const stack = [from];
    while (stack.length) {
      const cur = stack.pop()!;
      adj.get(cur)?.forEach((n) => {
        if (!seen.has(n)) {
          seen.add(n);
          stack.push(n);
        }
      });
    }
    return seen;
  };

  // Jumlah komponen terhubung = arsitektur definisi
  const visited = new Set<HDCenterId>();
  let components = 0;
  defined.forEach((c) => {
    if (!visited.has(c)) {
      components++;
      reachable(c).forEach((x) => visited.add(x));
    }
  });
  const definition: HumanDesignCalculationResult['definition'] =
    components === 0 ? 'No Definition'
    : components === 1 ? 'Single Definition'
    : components === 2 ? 'Split Definition'
    : components === 3 ? 'Triple Split'
    : 'Quadruple Split';

  // ---- Type ----
  const motorToThroat = MOTOR_CENTERS.some((m) => defined.has(m) && reachable(m).has('throat'));
  let type: HumanDesignType;
  let strategy: string;
  let notSelfTheme: string;
  let signature: string;

  if (defined.size === 0) {
    type = 'Reflector';
    strategy = 'Wait a Full Lunar Cycle (28.5 Days)';
    notSelfTheme = 'Disappointment';
    signature = 'Surprise';
  } else if (defined.has('sacral')) {
    if (motorToThroat) {
      type = 'Manifesting Generator';
      strategy = 'Wait to Respond, then Inform before Acting';
      notSelfTheme = 'Frustration & Anger';
      signature = 'Satisfaction & Peace';
    } else {
      type = 'Generator';
      strategy = 'To Respond to Life';
      notSelfTheme = 'Frustration';
      signature = 'Satisfaction';
    }
  } else if (motorToThroat) {
    type = 'Manifestor';
    strategy = 'To Inform before Initiating Action';
    notSelfTheme = 'Anger';
    signature = 'Peace';
  } else {
    type = 'Projector';
    strategy = 'Wait for the Invitation';
    notSelfTheme = 'Bitterness';
    signature = 'Success';
  }

  // ---- Inner Authority (hierarki resmi) ----
  let authority: InnerAuthority;
  if (type === 'Reflector') authority = 'Lunar (28-day cycle)';
  else if (defined.has('solar-plexus')) authority = 'Emotional (Solar Plexus)';
  else if (defined.has('sacral')) authority = 'Sacral';
  else if (defined.has('spleen')) authority = 'Splenic';
  else if (defined.has('heart')) authority = reachable('heart').has('throat') ? 'Ego Manifested' : 'Ego Projected';
  else if (defined.has('g-center') && reachable('g-center').has('throat')) authority = 'Self-Projected';
  else authority = 'Mental (Sounding Board)';

  // ---- Profile & Incarnation Cross ----
  const pSun = personalityGates[0];
  const pEarth = personalityGates[1];
  const dSun = designGates[0];
  const dEarth = designGates[1];

  const profileCode = `${pSun.line}/${dSun.line}`;
  const crossAngle: HumanDesignCalculationResult['crossAngle'] =
    profileCode === '4/1'
      ? 'Juxtaposition'
      : ['5/1', '5/2', '6/2', '6/3'].includes(profileCode)
      ? 'Left Angle'
      : 'Right Angle';

  const centers = {} as HumanDesignCalculationResult['centers'];
  (Object.keys(CENTER_NAMES) as HDCenterId[]).forEach((cid) => {
    centers[cid] = {
      id: cid,
      name: CENTER_NAMES[cid],
      isDefined: defined.has(cid),
      definedGates: activeChannels.filter((c) => c.centers.includes(cid)).flatMap((c) => c.gates.filter((g) => GATE_CENTER[g] === cid)),
    };
  });

  const nodeP = personalityGates.find((a) => a.planetId === 'north-node')!;
  const nodeD = designGates.find((a) => a.planetId === 'north-node')!;

  return {
    type,
    profile: profileCode,
    profileName: PROFILE_NAMES[profileCode] || 'Conscious Explorer',
    authority,
    strategy,
    notSelfTheme,
    signature,
    definition,
    incarnationCross: `${crossAngle === 'Right Angle' ? `Right Angle Cross of ${rightAngleCrossName(pSun.gate)}` : `${crossAngle} Cross`} (${pSun.gate}/${pEarth.gate} | ${dSun.gate}/${dEarth.gate})`,
    crossAngle,
    crossGates: { personalitySun: pSun.gate, personalityEarth: pEarth.gate, designSun: dSun.gate, designEarth: dEarth.gate },
    variables: {
      determination: arrow(dSun),
      environment: arrow(nodeD),
      motivation: arrow(pSun),
      perspective: arrow(nodeP),
    },
    designDateUtc: designUtc.toISOString(),
    centers,
    activeChannels,
    personalityGates,
    designGates,
  };
}
