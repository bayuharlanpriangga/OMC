import { GATE_WHEEL } from './gates';
import { HDGateActivation } from './types';

/**
 * Variabel lanjutan Human Design, diturunkan dari color/tone posisi planet:
 *
 *  - Pencernaan (Determination) : COLOR Design Sun  → arah/flavor dari TONE
 *  - Kognisi Tubuh (Cognition)  : TONE  Design Sun  (indera tubuh)
 *  - Lingkungan (Environment)   : COLOR Design North Node
 *  - Motivasi (Motivation)      : COLOR Personality Sun
 *  - Tindakan Pikiran (Mind)    : TONE  Personality Sun
 *  - Perspektif (Perspective)   : COLOR Personality North Node
 *  - Arketipe Pemrogram         : Godhead dari gate Personality Sun
 *
 * Tone 1–3 = panah kiri (aktif/strategis), tone 4–6 = panah kanan (reseptif).
 */

export interface HDVariableValue {
  /** Label utama (nama Inggris standar Human Design). */
  label: string;
  /** Penjelasan singkat: flavor kiri/kanan atau tone. */
  detail: string;
}

export interface HDExtendedVariables {
  environment: HDVariableValue;
  motivation: HDVariableValue;
  perspective: HDVariableValue;
  digestion: HDVariableValue;
  cognition: HDVariableValue;
  mindAction: HDVariableValue;
  programmingArchetype: HDVariableValue;
}

type Pair = [string, string]; // [kiri, kanan]

// ---- Pencernaan (Determination) ----
const DIGESTION: Array<{ label: string; en: string; flavor: Pair }> = [
  { label: 'Appetite', en: 'Appetite', flavor: ['Consecutive', 'Alternating'] },
  { label: 'Taste', en: 'Taste', flavor: ['Open', 'Closed'] },
  { label: 'Thirst', en: 'Thirst', flavor: ['Hot', 'Cold'] },
  { label: 'Touch', en: 'Touch', flavor: ['Calm', 'Nervous'] },
  { label: 'Sound', en: 'Sound', flavor: ['High', 'Low'] },
  { label: 'Light', en: 'Light', flavor: ['Direct', 'Indirect'] },
];

// ---- Kognisi tubuh = tone body ----
const COGNITION: Array<{ label: string; en: string }> = [
  { label: 'Smell', en: 'Smell' },
  { label: 'Taste', en: 'Taste' },
  { label: 'Outer Vision', en: 'Outer Vision' },
  { label: 'Inner Vision', en: 'Inner Vision' },
  { label: 'Feeling', en: 'Feeling' },
  { label: 'Touch', en: 'Touch' },
];

const ENVIRONMENT: Array<{ label: string; en: string; flavor: Pair }> = [
  { label: 'Caves', en: 'Caves', flavor: ['Selective', 'Blending'] },
  { label: 'Markets', en: 'Markets', flavor: ['Internal', 'External'] },
  { label: 'Kitchens', en: 'Kitchens', flavor: ['Wet', 'Dry'] },
  { label: 'Mountains', en: 'Mountains', flavor: ['Active', 'Passive'] },
  { label: 'Valleys', en: 'Valleys', flavor: ['Narrow', 'Wide'] },
  { label: 'Shores', en: 'Shores', flavor: ['Natural', 'Artificial'] },
];

const MOTIVATION: Array<{ label: string; en: string }> = [
  { label: 'Fear', en: 'Fear' },
  { label: 'Hope', en: 'Hope' },
  { label: 'Desire', en: 'Desire' },
  { label: 'Need', en: 'Need' },
  { label: 'Guilt', en: 'Guilt' },
  { label: 'Innocence', en: 'Innocence' },
];

const PERSPECTIVE: Array<{ label: string; en: string }> = [
  { label: 'Survival', en: 'Survival' },
  { label: 'Possibility', en: 'Possibility' },
  { label: 'Power', en: 'Power' },
  { label: 'Wanting', en: 'Wanting' },
  { label: 'Probability', en: 'Probability' },
  { label: 'Personal', en: 'Personal' },
];

// Tone sisi Personality (Rave Psychology)
const MIND_TONE: Array<{ label: string; en: string }> = [
  { label: 'Security', en: 'Security' },
  { label: 'Uncertainty', en: 'Uncertainty' },
  { label: 'Action', en: 'Action' },
  { label: 'Meditation', en: 'Meditation' },
  { label: 'Judgment', en: 'Judgment' },
  { label: 'Acceptance', en: 'Acceptance' },
];

// 16 Godhead: tiap 4 gate berurutan di roda, mulai indeks 56 (Gate 13).
const GODHEADS: Array<{ name: string; title: string }> = [
  { name: 'Kali', title: 'The Destroyer of False Devotion' },
  { name: 'Mitra', title: 'The Evolution of Consciousness' },
  { name: 'Michael', title: 'The Angelical Mind' },
  { name: 'Janus', title: 'The Fertility of Mind' },
  { name: 'Maia', title: 'The Mother Goddess' },
  { name: 'Lakshmi', title: 'Goddess of Beauty and Good Fortune' },
  { name: 'Parvati', title: 'Goddess of Domestic Bliss' },
  { name: "Ma'at", title: 'Goddess of Truth, Justice and Cosmic Harmony' },
  { name: 'Thoth', title: 'God of Wisdom, Writing and Time' },
  { name: 'Harmonia', title: 'Goddess of the Family Bond' },
  { name: 'Christ Consciousness Field', title: 'Love Thy Neighbor' },
  { name: 'Minerva', title: 'Virgin Goddess of Warfare, Arts and Crafts' },
  { name: 'Hades', title: 'God of the Underworld' },
  { name: 'Prometheus', title: 'Thief of Fire and Benefactor of Humanity' },
  { name: 'Vishnu', title: 'God of Monotheism' },
  { name: 'The Keepers of the Wheel', title: 'Guardians of the Wheel' },
];

export function godheadOfGate(gate: number): { name: string; title: string; gates: number[] } {
  const idx = GATE_WHEEL.indexOf(gate);
  const group = Math.floor(((idx - 56 + 64) % 64) / 4);
  const start = (56 + group * 4) % 64;
  const gates = [0, 1, 2, 3].map((i) => GATE_WHEEL[(start + i) % 64]);
  return { ...GODHEADS[group], gates };
}

const side = (tone: number) => (tone <= 3 ? 0 : 1);

export function buildExtendedVariables(personality: HDGateActivation[], design: HDGateActivation[]): HDExtendedVariables {
  const pick = (list: HDGateActivation[], id: string) => list.find((a) => a.planetId === id)!;
  const dSun = pick(design, 'sun');
  const dNode = pick(design, 'north-node');
  const pSun = pick(personality, 'sun');
  const pNode = pick(personality, 'north-node');

  const dig = DIGESTION[dSun.color - 1];
  const cog = COGNITION[dSun.tone - 1];
  const env = ENVIRONMENT[dNode.color - 1];
  const mot = MOTIVATION[pSun.color - 1];
  const mind = MIND_TONE[pSun.tone - 1];
  const per = PERSPECTIVE[pNode.color - 1];
  const god = godheadOfGate(pSun.gate);

  return {
    environment: { label: env.label, detail: `${env.flavor[side(dNode.tone)]} · ${side(dNode.tone) ? 'Observer' : 'Observed'}` },
    motivation: { label: mot.label, detail: side(pSun.tone) ? 'Receptive' : 'Strategic' },
    perspective: { label: per.label, detail: side(pNode.tone) ? 'Peripheral' : 'Focused' },
    digestion: { label: dig.label, detail: `${dig.flavor[side(dSun.tone)]} · ${side(dSun.tone) ? 'Passive' : 'Active'}` },
    cognition: { label: cog.label, detail: `Tone ${dSun.tone}` },
    mindAction: { label: mind.label, detail: `Tone ${pSun.tone}` },
    programmingArchetype: { label: god.name, detail: `${god.title} · Gates ${god.gates.join(', ')}` },
  };
}
