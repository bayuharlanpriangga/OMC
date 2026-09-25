import { BirthProfile } from '../../types/birth-data';
import { HDCenterId, HDGateActivation, HumanDesignCalculationResult, HumanDesignType, InnerAuthority } from './types';

export function calculateHumanDesign(
  profile: BirthProfile,
  _settings: Record<string, any> = {}
): HumanDesignCalculationResult {
  const [year, month, day] = profile.birthDate.split('-').map(Number);
  const [hour, min] = (profile.birthTime || '12:00').split(':').map(Number);

  // Deterministic seed from birth coordinates and datetime
  const seed = (year * 365 + month * 31 + day) * 1440 + hour * 60 + min;

  // Derive conscious personality gates & unconscious design gates
  const personalitySunGate = ((Math.floor(seed / 100) % 64) + 1);
  const personalitySunLine = ((Math.floor(seed / 10) % 6) + 1);
  const designSunGate = (((personalitySunGate + 48) % 64) || 64);
  const designSunLine = (((personalitySunLine + 3) % 6) || 6);

  const profileCode = `${personalitySunLine}/${designSunLine}`;
  const profileNames: Record<string, string> = {
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

  // Channel definitions between centers
  const ALL_CHANNELS: Array<{ id: string; name: string; gates: [number, number]; c1: HDCenterId; c2: HDCenterId }> = [
    { id: '64-47', name: 'Abstraction (Mental Activity to Clarity)', gates: [64, 47], c1: 'head', c2: 'ajna' },
    { id: '61-24', name: 'Awareness (A Thinker)', gates: [61, 24], c1: 'head', c2: 'ajna' },
    { id: '63-4', name: 'Logic (Doubt to Certainty)', gates: [63, 4], c1: 'head', c2: 'ajna' },
    { id: '17-62', name: 'Acceptance (Organizational Being)', gates: [17, 62], c1: 'ajna', c2: 'throat' },
    { id: '43-23', name: 'Structuring (Genius to Freak)', gates: [43, 23], c1: 'ajna', c2: 'throat' },
    { id: '11-56', name: 'Curiosity (A Searcher)', gates: [11, 56], c1: 'ajna', c2: 'throat' },
    { id: '20-57', name: 'Brainwave (Penetrating Awareness)', gates: [20, 57], c1: 'throat', c2: 'spleen' },
    { id: '20-34', name: 'Charisma (Where Thoughts Become Deeds)', gates: [20, 34], c1: 'throat', c2: 'sacral' },
    { id: '34-57', name: 'Power (An Archetype)', gates: [34, 57], c1: 'sacral', c2: 'spleen' },
    { id: '10-20', name: 'Awakening (Higher Principles)', gates: [10, 20], c1: 'g-center', c2: 'throat' },
    { id: '7-31', name: 'The Alpha (Leadership "Good or Bad")', gates: [7, 31], c1: 'g-center', c2: 'throat' },
    { id: '1-8', name: 'Inspiration (The Creative Role Model)', gates: [1, 8], c1: 'g-center', c2: 'throat' },
    { id: '13-33', name: 'The Prodigal (The Witness)', gates: [13, 33], c1: 'g-center', c2: 'throat' },
    { id: '25-51', name: 'Initiation (Needing to be First)', gates: [25, 51], c1: 'g-center', c2: 'heart' },
    { id: '2-14', name: 'The Beat (Keeper of Keys)', gates: [2, 14], c1: 'g-center', c2: 'sacral' },
    { id: '29-46', name: 'Discovery (Succeeding Where Others Fail)', gates: [29, 46], c1: 'sacral', c2: 'g-center' },
    { id: '59-6', name: 'Mating (Focused on Reproduction)', gates: [59, 6], c1: 'sacral', c2: 'solar-plexus' },
    { id: '37-40', name: 'Community (Part of the Whole)', gates: [37, 40], c1: 'solar-plexus', c2: 'heart' },
    { id: '21-45', name: 'Money (The Line of the Gatherer)', gates: [21, 45], c1: 'heart', c2: 'throat' },
    { id: '12-22', name: 'Openness (A Social Being)', gates: [12, 22], c1: 'throat', c2: 'solar-plexus' },
    { id: '35-36', name: 'Transitoriness (A Jack of All Trades)', gates: [35, 36], c1: 'throat', c2: 'solar-plexus' },
    { id: '18-58', name: 'Judgment (Insatiability for Perfection)', gates: [18, 58], c1: 'spleen', c2: 'root' },
    { id: '28-38', name: 'Struggle (A Stubborn Survivor)', gates: [28, 38], c1: 'spleen', c2: 'root' },
    { id: '54-32', name: 'Transformation (Being Driven)', gates: [54, 32], c1: 'root', c2: 'spleen' },
    { id: '19-49', name: 'Synthesis (Sensitivity)', gates: [19, 49], c1: 'root', c2: 'solar-plexus' },
    { id: '39-55', name: 'Emoting (Moodiness)', gates: [39, 55], c1: 'root', c2: 'solar-plexus' },
    { id: '41-30', name: 'Recognition (Focused Energy)', gates: [41, 30], c1: 'root', c2: 'solar-plexus' },
  ];

  // Pick deterministic active channels
  const activeChannels: Array<{ id: string; name: string; gates: [number, number] }> = [];
  const definedCentersSet = new Set<HDCenterId>();

  // Determine active channels deterministically
  ALL_CHANNELS.forEach((ch, idx) => {
    if ((seed + idx * 7) % 5 === 0) {
      activeChannels.push({ id: ch.id, name: ch.name, gates: ch.gates });
      definedCentersSet.add(ch.c1);
      definedCentersSet.add(ch.c2);
    }
  });

  // Ensure at least 1-2 channels if none
  if (activeChannels.length === 0) {
    const ch = ALL_CHANNELS[seed % ALL_CHANNELS.length];
    activeChannels.push({ id: ch.id, name: ch.name, gates: ch.gates });
    definedCentersSet.add(ch.c1);
    definedCentersSet.add(ch.c2);
  }

  // Determine Type based on Sacral and Motor to Throat connections
  let type: HumanDesignType = 'Projector';
  let authority: InnerAuthority = 'Self-Projected';
  let strategy = 'Wait for the Invitation & Recognition';
  let notSelfTheme = 'Bitterness';
  let signature = 'Success';

  const isSacralDefined = definedCentersSet.has('sacral');
  const isSolarPlexusDefined = definedCentersSet.has('solar-plexus');
  const isSpleenDefined = definedCentersSet.has('spleen');
  const isHeartDefined = definedCentersSet.has('heart');
  const isThroatDefined = definedCentersSet.has('throat');

  if (isSacralDefined) {
    if (isThroatDefined && (activeChannels.some((c) => c.gates.includes(20) && c.gates.includes(34)))) {
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
  } else if (isThroatDefined && (isHeartDefined || isSolarPlexusDefined)) {
    type = 'Manifestor';
    strategy = 'To Inform before Initiating Action';
    notSelfTheme = 'Anger';
    signature = 'Peace';
  } else if (definedCentersSet.size === 0) {
    type = 'Reflector';
    strategy = 'Wait a Full Lunar Cycle (28.5 Days)';
    notSelfTheme = 'Disappointment';
    signature = 'Surprise';
  } else {
    type = 'Projector';
    strategy = 'Wait for the Invitation';
    notSelfTheme = 'Bitterness';
    signature = 'Success';
  }

  // Authority hierarchy
  if (isSolarPlexusDefined) {
    authority = 'Emotional (Solar Plexus)';
  } else if (isSacralDefined) {
    authority = 'Sacral';
  } else if (isSpleenDefined) {
    authority = 'Splenic';
  } else if (isHeartDefined) {
    authority = 'Ego Projected';
  } else if (definedCentersSet.has('g-center')) {
    authority = 'Self-Projected';
  } else if (type === 'Reflector') {
    authority = 'Lunar (28-day cycle)';
  } else {
    authority = 'Mental (Sounding Board)';
  }

  // Build Centers
  const centerNames: Record<HDCenterId, string> = {
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

  const centers = {} as Record<HDCenterId, any>;
  (Object.keys(centerNames) as HDCenterId[]).forEach((cid) => {
    centers[cid] = {
      id: cid,
      name: centerNames[cid],
      isDefined: definedCentersSet.has(cid),
      definedGates: activeChannels
        .filter((c) => {
          const def = ALL_CHANNELS.find((ac) => ac.id === c.id);
          return def && (def.c1 === cid || def.c2 === cid);
        })
        .flatMap((c) => c.gates),
    };
  });

  // Sample conscious and unconscious gate activations
  const personalityGates: HDGateActivation[] = [
    { gate: personalitySunGate, line: personalitySunLine, planet: 'Sun', isConscious: true },
    { gate: ((personalitySunGate + 32) % 64) || 64, line: personalitySunLine, planet: 'Earth', isConscious: true },
    { gate: ((seed % 64) + 1), line: ((seed % 6) + 1), planet: 'Moon', isConscious: true },
    { gate: (((seed * 3) % 64) + 1), line: (((seed * 3) % 6) + 1), planet: 'North Node', isConscious: true },
    { gate: (((seed * 7) % 64) + 1), line: (((seed * 7) % 6) + 1), planet: 'Mercury', isConscious: true },
  ];

  const designGates: HDGateActivation[] = [
    { gate: designSunGate, line: designSunLine, planet: 'Sun', isConscious: false },
    { gate: ((designSunGate + 32) % 64) || 64, line: designSunLine, planet: 'Earth', isConscious: false },
    { gate: (((seed + 19) % 64) + 1), line: (((seed + 19) % 6) + 1), planet: 'Moon', isConscious: false },
    { gate: (((seed + 41) % 64) + 1), line: (((seed + 41) % 6) + 1), planet: 'North Node', isConscious: false },
  ];

  return {
    type,
    profile: profileCode,
    profileName: profileNames[profileCode] || 'Conscious Explorer',
    authority,
    strategy,
    notSelfTheme,
    signature,
    definition: definedCentersSet.size > 4 ? 'Single Definition' : 'Split Definition',
    incarnationCross: `Right Angle Cross of the Vessel of Love (${personalitySunGate}/${((personalitySunGate + 32) % 64) || 64})`,
    centers,
    activeChannels,
    personalityGates,
    designGates,
  };
}
