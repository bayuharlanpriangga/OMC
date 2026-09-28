import React from 'react';

/**
 * Glyph astrologi sebagai path SVG (kotak -10..10).
 * Dipakai supaya simbol tampil monokrom & konsisten di semua device.
 * Karakter unicode (♈, ☉, dst) sering dirender sebagai emoji berwarna.
 */
interface GlyphDef {
  paths: string[];
  // [cx, cy, r, filled?]
  circles?: Array<[number, number, number, boolean?]>;
}

export const GLYPHS: Record<string, GlyphDef> = {
  // ---- Planet & titik ----
  sun: { paths: [], circles: [[0, 0, 8], [0, 0, 1.4, true]] },
  moon: { paths: ['M1 -9 A9 9 0 0 0 1 9 A12 12 0 0 1 1 -9 Z'] },
  mercury: {
    paths: ['M-4.5 -9.5 A4.5 4.5 0 0 0 4.5 -9.5', 'M0 4.5 V10', 'M-3 7.5 H3'],
    circles: [[0, 0, 4.5]],
  },
  venus: { paths: ['M0 1 V10', 'M-3.5 6 H3.5'], circles: [[0, -3.5, 4.5]] },
  mars: { paths: ['M2 -1.5 L8 -7.5', 'M3.5 -8 H8 V-3.5'], circles: [[-1.5, 2.5, 5]] },
  jupiter: {
    paths: ['M-7 -3 C-7 -9 -1 -10 0 -5 C0 -1 -3 2 -8 3 H8', 'M3.5 -3 V10'],
  },
  saturn: {
    paths: ['M-2 -10 V1', 'M-5 -7.5 H1', 'M-2 -3 C2 -6 6.5 -3.5 5 1.5 C4 4.5 1 6 2.5 9.5'],
  },
  uranus: {
    paths: ['M-5 -9 V2', 'M5 -9 V2', 'M-5 -3.5 H5', 'M0 -3.5 V4'],
    circles: [[0, 7, 3]],
  },
  neptune: {
    paths: [
      'M-6 -8 C-6 -1 6 -1 6 -8',
      'M0 -9.5 V10',
      'M-3.5 6 H3.5',
      'M-7.5 -6.5 L-6 -9 L-4.2 -6.5',
      'M4.2 -6.5 L6 -9 L7.5 -6.5',
    ],
  },
  pluto: {
    paths: ['M-6.5 -8 C-6.5 0 6.5 0 6.5 -8', 'M0 -2 V10', 'M-3.5 6.5 H3.5'],
    circles: [[0, -6, 2.8]],
  },
  chiron: {
    paths: ['M0 -10 V1.5', 'M0 -6 L5 -9', 'M-4 -3 L0 1.5'],
    circles: [[0, 5.5, 3.5]],
  },
  'north-node': {
    paths: ['M-6 5 C-6 -9 6 -9 6 5'],
    circles: [[-6, 7, 2], [6, 7, 2]],
  },

  // ---- Zodiak ----
  aries: {
    paths: [
      'M0 10 V-1 C0 -6 -3 -9 -6 -9 C-9 -9 -9.5 -5 -7.5 -3.5',
      'M0 -1 C0 -6 3 -9 6 -9 C9 -9 9.5 -5 7.5 -3.5',
    ],
  },
  taurus: { paths: ['M-7 -9 C-7 -2 7 -2 7 -9'], circles: [[0, 4.5, 5]] },
  gemini: {
    paths: [
      'M-7.5 -9.5 C-3 -6.5 3 -6.5 7.5 -9.5',
      'M-7.5 9.5 C-3 6.5 3 6.5 7.5 9.5',
      'M-3.5 -7.5 V7.5',
      'M3.5 -7.5 V7.5',
    ],
  },
  cancer: {
    paths: ['M-2 -5.5 C1 -9 6 -8.5 8 -5', 'M2 5.5 C-1 9 -6 8.5 -8 5'],
    circles: [[-4.5, -3.5, 2.6], [4.5, 3.5, 2.6]],
  },
  leo: {
    paths: ['M-2 -4.5 C-1.5 -11 6.5 -10 5.5 -3 C5 1.5 2.5 5 2.5 8 C2.5 10.5 6.5 10.5 6.5 8'],
    circles: [[-4.5, -2, 3.2]],
  },
  virgo: {
    paths: [
      'M-8 -8 V6',
      'M-8 -5 C-8 -9 -2 -9 -2 -5 V6',
      'M-2 -5 C-2 -9 4 -9 4 -5 V4 C4 8 6 9 8.5 8.5',
      'M2 6 L9 9.5',
    ],
  },
  libra: { paths: ['M-9 8 H9', 'M-9 3.5 H-4 C-4 -9 4 -9 4 3.5 H9'] },
  scorpio: {
    paths: [
      'M-8 -8 V6',
      'M-8 -5 C-8 -9 -2 -9 -2 -5 V6',
      'M-2 -5 C-2 -9 4 -9 4 -5 V4 C4 9 8 9 9.3 4',
      'M5.5 4 H9.5 V8',
    ],
  },
  sagittarius: {
    paths: ['M-8 9 L8 -7', 'M1 -7.5 H8.5 V0', 'M-5.5 0.5 L0.5 6.5'],
  },
  capricorn: {
    paths: [
      'M-8 -8 C-5.5 -8 -5 -4 -4.5 0 L-3.5 6 L1.5 -6.5 C2.5 -9 6.5 -8.5 6.5 -4 C6.5 0 3 2 3 5',
    ],
    circles: [[5.5, 7, 2.8]],
  },
  aquarius: {
    paths: [
      'M-9 -4 L-4.5 -7.5 L0 -4 L4.5 -7.5 L9 -4',
      'M-9 4 L-4.5 0.5 L0 4 L4.5 0.5 L9 4',
    ],
  },
  pisces: {
    paths: ['M-7 -9 C-1 -5 -1 5 -7 9', 'M7 -9 C1 -5 1 5 7 9', 'M-6 0 H6'],
  },
};

interface AstroGlyphProps {
  /** id planet ('sun', 'north-node', ...) atau nama sign ('Aries' / 'aries') */
  name: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Glyph di dalam <svg> yang sudah ada (dipakai di wheel). */
export const AstroGlyph: React.FC<AstroGlyphProps> = ({
  name,
  x = 0,
  y = 0,
  size = 20,
  color = '#000',
  strokeWidth = 1.6,
}) => {
  const def = GLYPHS[name.toLowerCase()];
  if (!def) return null;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${size / 20})`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      pointerEvents="none"
    >
      {def.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
      {def.circles?.map(([cx, cy, r, filled], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={filled ? color : 'none'} />
      ))}
    </g>
  );
};

/** Glyph mandiri (untuk tabel / teks). */
export const AstroGlyphInline: React.FC<{
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ name, size = 16, color = 'currentColor', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="-11 -11 22 22"
    style={{ verticalAlign: 'middle', flexShrink: 0, ...style }}
    aria-hidden="true"
  >
    <AstroGlyph name={name} color={color} size={20} strokeWidth={1.5} />
  </svg>
);

/**
 * Glyph zodiak dari file PNG (public/astrology/zodiak/<variant>/<sign>-<variant>.png, 64x64, transparan).
 * variant 'dark' = goresan hitam (dipakai di atas latar gold, mis. wheel).
 * variant 'gold' = untuk latar gelap (mis. daftar aspek), belum ada filenya.
 */
export type ZodiacVariant = 'dark' | 'gold';

export const zodiacSrc = (sign: string, variant: ZodiacVariant = 'dark') =>
  `${import.meta.env.BASE_URL}astrology/zodiak/${variant}/${sign.toLowerCase()}-${variant}.png`;

/** Di dalam <svg>: gambar PNG zodiak, titik tengah di (x, y). */
export const ZodiacGlyph: React.FC<{
  sign: string;
  x?: number;
  y?: number;
  size?: number;
  variant?: ZodiacVariant;
}> = ({ sign, x = 0, y = 0, size = 24, variant = 'dark' }) => (
  <image
    href={zodiacSrc(sign, variant)}
    x={x - size / 2}
    y={y - size / 2}
    width={size}
    height={size}
    pointerEvents="none"
  />
);
