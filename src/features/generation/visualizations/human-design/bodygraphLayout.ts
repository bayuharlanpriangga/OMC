import { HDCenterId } from '../../../../systems/human-design/types';

/**
 * Geometri bodygraph (viewBox 500 × 700). Semua koordinat dibuat manual supaya
 * tiap gate duduk di tepi center-nya dan channel bisa digambar sebagai garis
 * antar gate (dengan waypoint bila perlu menghindari center lain).
 */

export type Pt = [number, number];

export interface CenterShape {
  id: HDCenterId;
  label: string;
  kind: 'polygon' | 'rect';
  /** polygon: daftar titik. rect: [x1,y1,x2,y2] */
  points: number[][] | number[];
}

export const CENTER_SHAPES: CenterShape[] = [
  { id: 'head', label: 'Head', kind: 'polygon', points: [[250, 12], [208, 88], [292, 88]] },
  { id: 'ajna', label: 'Ajna', kind: 'polygon', points: [[208, 108], [292, 108], [250, 184]] },
  { id: 'throat', label: 'Throat', kind: 'rect', points: [210, 236, 290, 306] },
  { id: 'g-center', label: 'G Center', kind: 'polygon', points: [[250, 326], [302, 378], [250, 430], [198, 378]] },
  { id: 'heart', label: 'Heart / Ego', kind: 'polygon', points: [[336, 402], [302, 452], [370, 452]] },
  { id: 'spleen', label: 'Spleen', kind: 'polygon', points: [[112, 474], [112, 598], [208, 536]] },
  { id: 'solar-plexus', label: 'Solar Plexus', kind: 'polygon', points: [[388, 474], [388, 598], [292, 536]] },
  { id: 'sacral', label: 'Sacral', kind: 'rect', points: [216, 490, 284, 562] },
  { id: 'root', label: 'Root', kind: 'rect', points: [216, 616, 284, 684] },
];

export const GATE_POS: Record<number, Pt> = {
  // Head
  64: [232, 76], 61: [250, 76], 63: [268, 76],
  // Ajna
  47: [232, 118], 24: [250, 118], 4: [268, 118],
  17: [232, 140], 43: [250, 158], 11: [268, 140],
  // Throat
  62: [232, 245], 23: [250, 245], 56: [268, 245],
  16: [219, 259], 20: [219, 278],
  35: [281, 255], 12: [281, 269], 45: [281, 283],
  31: [232, 297], 8: [250, 297], 33: [268, 297],
  // G Center
  1: [250, 342], 7: [232, 358], 13: [268, 358],
  10: [216, 378], 25: [284, 378],
  15: [232, 398], 46: [268, 398], 2: [250, 414],
  // Heart
  21: [336, 418], 51: [320, 436], 26: [312, 447], 40: [354, 445],
  // Spleen
  48: [124, 488], 57: [146, 506], 44: [168, 518], 50: [190, 530],
  32: [174, 552], 28: [150, 566], 18: [126, 580],
  // Solar plexus
  36: [376, 488], 22: [354, 506], 37: [332, 518], 6: [310, 530],
  49: [326, 552], 55: [350, 566], 30: [374, 580],
  // Sacral
  5: [232, 500], 14: [250, 500], 29: [268, 500],
  34: [224, 518], 27: [224, 538],
  59: [276, 522],
  42: [232, 554], 3: [250, 554], 9: [268, 554],
  // Root
  53: [232, 624], 60: [250, 624], 52: [268, 624],
  54: [224, 642], 38: [224, 656], 58: [224, 670],
  19: [276, 642], 39: [276, 656], 41: [276, 670],
};

/** Waypoint tambahan (di luar titik ujung) agar channel tidak menembus center lain. */
export const CHANNEL_WAYPOINTS: Record<string, Pt[]> = {
  '20-34': [[196, 298], [196, 498]],
  '10-34': [[212, 440]],
  '26-44': [[262, 470], [206, 486]],
  '10-57': [[176, 440]],
  '20-57': [[186, 370]],
  '16-48': [[150, 330]],
};
