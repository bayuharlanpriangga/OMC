import React from 'react';
import { HDCenterId, HDGateActivation, HumanDesignCalculationResult } from '../../../../systems/human-design/types';
import { CHANNELS, GATE_CENTER } from '../../../../systems/human-design/gates';
import { CENTER_SHAPES, CHANNEL_WAYPOINTS, GATE_POS, Pt } from './bodygraphLayout';

/** Warna: Personality = emas (sadar), Design = merah (bawah sadar). */
export const PERSONALITY_COLOR = '#E0C99A';
export const DESIGN_COLOR = '#DC2626';

const CENTER_FILL: Record<HDCenterId, { fill: string; text: string }> = {
  head: { fill: '#E0C99A', text: '#1A1408' },
  ajna: { fill: '#9BB8DE', text: '#0A1320' },
  throat: { fill: '#D97706', text: '#FFFFFF' },
  'g-center': { fill: '#E0C99A', text: '#1A1408' },
  heart: { fill: '#EF4444', text: '#FFFFFF' },
  'solar-plexus': { fill: '#D97706', text: '#FFFFFF' },
  sacral: { fill: '#EF4444', text: '#FFFFFF' },
  spleen: { fill: '#D97706', text: '#FFFFFF' },
  root: { fill: '#D97706', text: '#FFFFFF' },
};

type GateState = 'p' | 'd' | 'both' | null;

const SILHOUETTE =
  'M250 -2 C300 -2 324 40 324 96 C324 150 302 196 292 214 C332 226 402 240 426 300 C442 350 426 440 412 520 ' +
  'C402 600 398 660 382 700 L118 700 C102 660 98 600 88 520 C74 440 58 350 74 300 C98 240 168 226 208 214 ' +
  'C198 196 176 150 176 96 C176 40 200 -2 250 -2 Z';

const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Pecah polyline di tengah panjangnya → [separuh dekat gate A, separuh dekat gate B] */
function splitPolyline(pts: Pt[]): [Pt[], Pt[]] {
  const segs = pts.slice(1).map((p, i) => dist(pts[i], p));
  const total = segs.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= total / 2) {
      const t = (total / 2 - acc) / segs[i];
      const mid: Pt = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t];
      return [[...pts.slice(0, i + 1), mid], [mid, ...pts.slice(i + 1)]];
    }
    acc += segs[i];
  }
  return [pts, pts];
}

const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');

interface Props {
  data: HumanDesignCalculationResult;
  selectedCenter: HDCenterId | null;
  onSelectCenter: (id: HDCenterId | null) => void;
}

const ArrowGlyph: React.FC<{ x: number; y: number; dir: 'left' | 'right'; color: string }> = ({ x, y, dir, color }) => {
  const s = dir === 'left' ? 1 : -1;
  return <path d={`M${x - 9 * s} ${y} L${x + 1 * s} ${y - 8} L${x + 1 * s} ${y - 3.5} L${x + 10 * s} ${y - 3.5} L${x + 10 * s} ${y + 3.5} L${x + 1 * s} ${y + 3.5} L${x + 1 * s} ${y + 8} Z`} fill={color} />;
};

export const Bodygraph: React.FC<Props> = ({ data, selectedCenter, onSelectCenter }) => {
  const gateState = React.useMemo(() => {
    const m: Record<number, GateState> = {};
    const add = (list: HDGateActivation[], kind: 'p' | 'd') =>
      list.filter((a) => !a.isExtra).forEach((a) => {
        m[a.gate] = m[a.gate] && m[a.gate] !== kind ? 'both' : kind;
      });
    add(data.personalityGates, 'p');
    add(data.designGates, 'd');
    return m;
  }, [data]);

  const colorOf = (s: GateState) => (s === 'p' ? PERSONALITY_COLOR : s === 'd' ? DESIGN_COLOR : null);
  const activeIds = new Set(data.activeChannels.map((c) => c.id));

  const halfLine = (key: string, pts: Pt[], s: GateState, width: number) => {
    if (!s) return null;
    const d = toPath(pts);
    if (s === 'both') {
      return (
        <g key={key}>
          <path d={d} stroke={PERSONALITY_COLOR} strokeWidth={width} strokeLinecap="butt" fill="none" />
          <path d={d} stroke={DESIGN_COLOR} strokeWidth={width} strokeDasharray="5 5" strokeLinecap="butt" fill="none" />
        </g>
      );
    }
    return <path key={key} d={d} stroke={colorOf(s)!} strokeWidth={width} strokeLinecap="butt" fill="none" />;
  };

  const V = data.variables;
  const varRows: Array<{ key: string; label: string; v: typeof V.determination; x: number; y: number; side: 'l' | 'r'; color: string }> = [
    { key: 'det', label: 'Determination', v: V.determination, x: 40, y: 34, side: 'l', color: DESIGN_COLOR },
    { key: 'env', label: 'Environment', v: V.environment, x: 40, y: 66, side: 'l', color: DESIGN_COLOR },
    { key: 'mot', label: 'Motivation', v: V.motivation, x: 460, y: 34, side: 'r', color: PERSONALITY_COLOR },
    { key: 'per', label: 'Perspective', v: V.perspective, x: 460, y: 66, side: 'r', color: PERSONALITY_COLOR },
  ];

  return (
    <svg viewBox="0 -6 500 706" width="100%" role="img" aria-label="Human Design bodygraph" fontFamily='"Plus Jakarta Sans", system-ui, sans-serif' style={{ display: 'block' }}>
      <path d={SILHOUETTE} fill="#0F131D" stroke="#1B2233" strokeWidth="1.5" />

      {/* Channel: jalur dasar + separuh aktif per gate */}
      {CHANNELS.map((ch) => {
        const [ga, gb] = ch.gates;
        const pts: Pt[] = [GATE_POS[ga], ...(CHANNEL_WAYPOINTS[ch.id] || []), GATE_POS[gb]];
        const [halfA, halfB] = splitPolyline(pts);
        const isOn = activeIds.has(ch.id);
        return (
          <g key={ch.id}>
            <path d={toPath(pts)} stroke="#0A0D14" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d={toPath(pts)} stroke="#242B3B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {halfLine(`${ch.id}-a`, halfA, gateState[ga] ?? null, isOn ? 6 : 4)}
            {halfLine(`${ch.id}-b`, halfB, gateState[gb] ?? null, isOn ? 6 : 4)}
          </g>
        );
      })}

      {/* Center */}
      {CENTER_SHAPES.map((c) => {
        const def = data.centers[c.id].isDefined;
        const sel = selectedCenter === c.id;
        const fill = def ? CENTER_FILL[c.id].fill : '#0B0F19';
        const stroke = sel ? '#E0C99A' : def ? '#EDF1F7' : '#33405C';
        const common = { fill, stroke, strokeWidth: sel ? 3 : 1.8, strokeLinejoin: 'round' as const, style: { cursor: 'pointer' } };
        return (
          <g key={c.id} onClick={() => onSelectCenter(sel ? null : c.id)}>
            <title>{`${c.label} — ${def ? 'Defined' : 'Undefined (Open)'}`}</title>
            {c.kind === 'rect' ? (
              <rect x={(c.points as number[])[0]} y={(c.points as number[])[1]} width={(c.points as number[])[2] - (c.points as number[])[0]} height={(c.points as number[])[3] - (c.points as number[])[1]} rx="5" {...common} />
            ) : (
              <polygon points={(c.points as number[][]).map((p) => p.join(',')).join(' ')} {...common} />
            )}
          </g>
        );
      })}

      {/* Gate */}
      {Object.entries(GATE_POS).map(([g, [x, y]]) => {
        const gate = Number(g);
        const s = gateState[gate] ?? null;
        const r = 7.6;
        const inactive = !s;
        return (
          <g key={g} pointerEvents="none">
            {s === 'both' ? (
              <>
                <path d={`M${x} ${y - r} A${r} ${r} 0 0 0 ${x} ${y + r} Z`} fill={PERSONALITY_COLOR} />
                <path d={`M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} Z`} fill={DESIGN_COLOR} />
                <circle cx={x} cy={y} r={r} fill="none" stroke="#0A0D14" strokeWidth="1" />
              </>
            ) : (
              <circle cx={x} cy={y} r={r} fill={inactive ? '#F1F5F9' : colorOf(s)!} stroke="#0A0D14" strokeWidth="1" opacity={inactive ? 0.92 : 1} />
            )}
            <text x={x} y={y + 0.4} fontSize="8.4" fontWeight="700" textAnchor="middle" dominantBaseline="central" fill={s === 'p' || inactive ? '#0A0D14' : s === 'd' ? '#FFFFFF' : '#0A0D14'} stroke={s === 'both' ? '#F8FAFC' : 'none'} strokeWidth={s === 'both' ? 0.3 : 0} paintOrder="stroke">
              {gate}
            </text>
          </g>
        );
      })}

      {/* Variabel (Determination / Environment | Motivation / Perspective) */}
      {varRows.map(({ key, label, v, x, y, side, color }) => (
        <g key={key}>
          <title>{`${label}: color ${v.color}, tone ${v.tone} (${v.direction === 'left' ? 'Passive/Left' : 'Active/Right'})`}</title>
          <ArrowGlyph x={x} y={y} dir={v.direction} color={color} />
          {side === 'l' ? (
            <text x={x + 22} y={y + 5} fill="#EDF1F7" fontSize="16" fontWeight="700">
              {v.color}
              <tspan fontSize="10" dy="4" dx="2" fill="#94A3B8">{v.tone}</tspan>
            </text>
          ) : (
            <text x={x - 22} y={y + 5} fill="#EDF1F7" fontSize="16" fontWeight="700" textAnchor="end">
              <tspan fontSize="10" dy="-4" dx="0" fill="#94A3B8">{v.tone}</tspan>
              <tspan dy="4" dx="2">{v.color}</tspan>
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};
