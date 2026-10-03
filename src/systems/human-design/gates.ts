import { HDCenterId } from './types';

/**
 * Data statis Human Design: roda 64 gate (Rave Mandala), 36 channel, dan peta gate → center.
 *
 * Roda gate: Gate 25 dimulai 28°15' Pisces (358.25° ekliptika tropis), lalu tiap gate
 * selebar 5.625° (= 360/64), tiap line 0.9375°, color 0.15625°, tone 0.0260416°, base 0.0043402°.
 */

export const WHEEL_START = 358.25;
export const GATE_SPAN = 360 / 64;

export const GATE_WHEEL: number[] = [
  25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12,
  15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6,
  46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11,
  10, 58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37, 63, 22, 36,
];

export interface GatePosition {
  gate: number;
  line: number;
  color: number;
  tone: number;
  base: number;
}

/** Bujur ekliptika (0–360°) → gate.line.color.tone.base */
export function longitudeToGate(longitude: number): GatePosition {
  const offset = (((longitude - WHEEL_START) % 360) + 360) % 360;
  const gatePos = offset / GATE_SPAN;
  const gateIdx = Math.min(63, Math.floor(gatePos));

  const lineSpace = (gatePos - gateIdx) * 6;
  const line = Math.min(5, Math.floor(lineSpace));
  const colorSpace = (lineSpace - line) * 6;
  const color = Math.min(5, Math.floor(colorSpace));
  const toneSpace = (colorSpace - color) * 6;
  const tone = Math.min(5, Math.floor(toneSpace));
  const baseSpace = (toneSpace - tone) * 5;
  const base = Math.min(4, Math.floor(baseSpace));

  return { gate: GATE_WHEEL[gateIdx], line: line + 1, color: color + 1, tone: tone + 1, base: base + 1 };
}

export const GATE_CENTER: Record<number, HDCenterId> = {};
const centerGates: Record<HDCenterId, number[]> = {
  head: [64, 61, 63],
  ajna: [47, 24, 4, 17, 43, 11],
  throat: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
  'g-center': [1, 2, 7, 10, 13, 15, 25, 46],
  heart: [21, 51, 26, 40],
  'solar-plexus': [36, 22, 37, 6, 49, 55, 30],
  sacral: [5, 14, 29, 34, 27, 42, 3, 9, 59],
  spleen: [48, 57, 44, 50, 32, 28, 18],
  root: [53, 60, 52, 54, 38, 58, 19, 39, 41],
};
(Object.keys(centerGates) as HDCenterId[]).forEach((c) => centerGates[c].forEach((g) => (GATE_CENTER[g] = c)));

export interface ChannelDef {
  id: string;
  name: string;
  gates: [number, number];
}

/** 36 channel resmi. Urutan gates = [gate A, gate B]; center diturunkan dari GATE_CENTER. */
export const CHANNELS: ChannelDef[] = [
  { id: '64-47', name: 'Abstraction (Mental Activity to Clarity)', gates: [64, 47] },
  { id: '61-24', name: 'Awareness (A Thinker)', gates: [61, 24] },
  { id: '63-4', name: 'Logic (Doubt to Certainty)', gates: [63, 4] },
  { id: '17-62', name: 'Acceptance (An Organizational Being)', gates: [17, 62] },
  { id: '43-23', name: 'Structuring (Genius to Freak)', gates: [43, 23] },
  { id: '11-56', name: 'Curiosity (A Searcher)', gates: [11, 56] },
  { id: '31-7', name: 'The Alpha (Leadership)', gates: [31, 7] },
  { id: '8-1', name: 'Inspiration (The Creative Role Model)', gates: [8, 1] },
  { id: '33-13', name: 'The Prodigal (The Witness)', gates: [33, 13] },
  { id: '20-10', name: 'Awakening (Commitment to Higher Principles)', gates: [20, 10] },
  { id: '20-57', name: 'The Brainwave (Penetrating Awareness)', gates: [20, 57] },
  { id: '16-48', name: 'The Wavelength (Talent)', gates: [16, 48] },
  { id: '20-34', name: 'Charisma (Where Thoughts Become Deeds)', gates: [20, 34] },
  { id: '45-21', name: 'Money (A Materialist)', gates: [45, 21] },
  { id: '35-36', name: 'Transitoriness (A Jack of All Trades)', gates: [35, 36] },
  { id: '12-22', name: 'Openness (A Social Being)', gates: [12, 22] },
  { id: '15-5', name: 'Rhythm (Being in the Flow)', gates: [15, 5] },
  { id: '2-14', name: 'The Beat (Keeper of the Keys)', gates: [2, 14] },
  { id: '46-29', name: 'Discovery (Succeeding Where Others Fail)', gates: [46, 29] },
  { id: '10-34', name: 'Exploration (Following One\'s Convictions)', gates: [10, 34] },
  { id: '10-57', name: 'Perfected Form (Survival)', gates: [10, 57] },
  { id: '25-51', name: 'Initiation (Needing to be First)', gates: [25, 51] },
  { id: '26-44', name: 'Surrender (A Transmitter)', gates: [26, 44] },
  { id: '37-40', name: 'Community (A Way of Being Together)', gates: [37, 40] },
  { id: '27-50', name: 'Preservation (Custodianship)', gates: [27, 50] },
  { id: '34-57', name: 'Power (An Archetype)', gates: [34, 57] },
  { id: '59-6', name: 'Mating (Focused on Reproduction)', gates: [59, 6] },
  { id: '42-53', name: 'Maturation (Balanced Development)', gates: [42, 53] },
  { id: '3-60', name: 'Mutation (Energy Which Fluctuates and Initiates Pulse)', gates: [3, 60] },
  { id: '9-52', name: 'Concentration (Focused Determination)', gates: [9, 52] },
  { id: '18-58', name: 'Judgment (Insatiability for Perfection)', gates: [18, 58] },
  { id: '28-38', name: 'Struggle (A Stubborn Survivor)', gates: [28, 38] },
  { id: '32-54', name: 'Transformation (Being Driven)', gates: [32, 54] },
  { id: '19-49', name: 'Synthesis (Sensitivity)', gates: [19, 49] },
  { id: '39-55', name: 'Emoting (Moodiness)', gates: [39, 55] },
  { id: '30-41', name: 'Recognition (Focused Energy)', gates: [30, 41] },
];

export const MOTOR_CENTERS: HDCenterId[] = ['sacral', 'solar-plexus', 'heart', 'root'];

/**
 * Nama Right Angle Cross. Tiap nama dipakai 4 gate yang indeksnya di roda berselisih 16
 * (mis. Laws = 3, 56, 50, 60), jadi kuncinya: indeks roda Personality Sun mod 16.
 */
const RIGHT_ANGLE_CROSS_NAMES = [
  'the Vessel of Love', 'Service', 'Tension', 'Penetration',
  'Maya', 'Laws', 'the Unexpected', 'the Four Ways',
  'the Sphinx', 'Explanation', 'Contagion', 'the Sleeping Phoenix',
  'Planning', 'Consciousness', 'Rulership', 'Eden',
];

export const rightAngleCrossName = (personalitySunGate: number): string =>
  RIGHT_ANGLE_CROSS_NAMES[GATE_WHEEL.indexOf(personalitySunGate) % 16];
