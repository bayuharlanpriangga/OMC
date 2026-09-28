import React, { useMemo } from 'react';
import type { AstrologyCalculationResult, PlanetPosition } from '../../../../systems/astrology/types';
import { AstroGlyph, ZodiacGlyph } from './astroGlyphs';

/**
 * Natal chart wheel (gaya astro-seek), tema emas OMC.
 *
 * Orientasi standar: Ascendant di kiri (jam 9), zodiak berputar berlawanan
 * arah jarum jam, MC di atas, IC di bawah. Kalau jam lahir tidak diketahui,
 * 0° Aries ditaruh di kiri dan garis house tidak digambar.
 *
 * Warna: latar wheel emas, semua garis hitam, garis aspek merah untuk
 * konflik (square, opposition) dan biru untuk harmoni (trine, sextile).
 */

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const SIZE = 760;
const C = SIZE / 2;

// Radius tiap cincin, dari luar ke dalam
const R = {
  signOut: 330,
  signIn: 284,
  houseOut: 196,
  aspect: 168,
};
const R_SIGN_GLYPH = (R.signOut + R.signIn) / 2;
const R_HOUSE_NUM = (R.houseOut + R.aspect) / 2;
const R_DEG = 263;
const R_PLANET = 243;
const R_PLANET_SIGN = 225;
const R_MIN = 209;

const INK = '#000000';
const GOLD = {
  band: '#D2B983',
  field: '#E0C99A',
  ring: '#CDB47C',
  core: '#F0E4C6',
};
const HARMONY = '#1D4ED8';
const CONFLICT = '#C62828';

const norm = (a: number) => ((a % 360) + 360) % 360;

interface Props {
  data: AstrologyCalculationResult;
  hoveredId: string | null;
  onHover: (planet: PlanetPosition | null) => void;
}

export const NatalChartWheel: React.FC<Props> = ({ data, hoveredId, onHover }) => {
  const { planets, houses, aspects, hasExactTime, ascendant, midheaven } = data;

  // Derajat zodiak yang ditaruh di kiri (jam 9)
  const anchor = hasExactTime && ascendant ? ascendant.absoluteDegree : 0;

  // lon (derajat ekliptika) -> sudut layar (derajat, berlawanan jarum jam dari timur)
  const screenAngle = (lon: number) => 180 + norm(lon - anchor);
  const pt = (lon: number, r: number) => {
    const a = (screenAngle(lon) * Math.PI) / 180;
    return { x: C + r * Math.cos(a), y: C - r * Math.sin(a) };
  };
  const ptAt = (angleDeg: number, r: number) => {
    const a = (angleDeg * Math.PI) / 180;
    return { x: C + r * Math.cos(a), y: C - r * Math.sin(a) };
  };

  // Sebar posisi tampilan planet supaya tidak saling tumpuk
  const display = useMemo(() => {
    const MIN_SEP = 6; // derajat minimum antar pusat glyph
    const items = planets
      .map((p) => ({ id: p.id, lon: p.absoluteDegree, shown: p.absoluteDegree }))
      .sort((a, b) => a.lon - b.lon);
    const n = items.length;
    if (n < 2) return new Map(items.map((i) => [i.id, i.shown]));

    for (let iter = 0; iter < 200; iter++) {
      let moved = false;
      for (let i = 0; i < n; i++) {
        const a = items[i];
        const b = items[(i + 1) % n];
        let gap = b.shown - a.shown;
        if (i === n - 1) gap += 360;
        if (gap < MIN_SEP) {
          const push = (MIN_SEP - gap) / 2 + 0.01;
          a.shown -= push;
          b.shown += push;
          moved = true;
        }
      }
      if (!moved) break;
    }
    return new Map(items.map((i) => [i.id, norm(i.shown)]));
  }, [planets]);

  // Tick derajat pada cincin dalam pita zodiak
  const tickPath = useMemo(() => {
    let d = '';
    for (let deg = 0; deg < 360; deg++) {
      const len = deg % 10 === 0 ? 11 : deg % 5 === 0 ? 8 : 4;
      const a = pt(deg, R.signIn);
      const b = pt(deg, R.signIn + len);
      d += `M${a.x.toFixed(2)} ${a.y.toFixed(2)}L${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor]);

  const shownAspects = aspects.filter((a) => a.aspectType !== 'Conjunction');
  const lonOf = (name: string) => planets.find((p) => p.name === name)?.absoluteDegree;

  const aspectStyle = (type: string, orb: number) => {
    const w = 1.1 + Math.max(0, 1 - orb / 6) * 1.4;
    switch (type) {
      case 'Trine':
        return { color: HARMONY, width: w, dash: undefined };
      case 'Sextile':
        return { color: HARMONY, width: w * 0.85, dash: '6 4' };
      case 'Square':
        return { color: CONFLICT, width: w, dash: undefined };
      default: // Opposition
        return { color: CONFLICT, width: w * 1.1, dash: undefined };
    }
  };

  const hoveredName = planets.find((p) => p.id === hoveredId)?.name;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      height="100%"
      role="img"
      aria-label="Natal chart wheel"
      style={{ display: 'block' }}
      fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
    >
      {/* Latar wheel: emas */}
      <circle cx={C} cy={C} r={R.signOut} fill={GOLD.band} stroke={INK} strokeWidth="2" />
      <circle cx={C} cy={C} r={R.signIn} fill={GOLD.field} stroke={INK} strokeWidth="1.4" />
      <circle cx={C} cy={C} r={R.houseOut} fill={GOLD.ring} stroke={INK} strokeWidth="1.4" />
      <circle cx={C} cy={C} r={R.aspect} fill={GOLD.core} stroke={INK} strokeWidth="1.6" />

      {/* Tick derajat */}
      <path d={tickPath} stroke={INK} strokeWidth="0.7" fill="none" />

      {/* Pembatas sign + glyph sign */}
      {SIGNS.map((sign, i) => {
        const a = pt(i * 30, R.signIn);
        const b = pt(i * 30, R.signOut);
        const g = pt(i * 30 + 15, R_SIGN_GLYPH);
        return (
          <g key={sign}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={INK} strokeWidth="1.2" />
            <ZodiacGlyph sign={sign} x={g.x} y={g.y} size={30} />
          </g>
        );
      })}

      {/* Garis house + angka house (hanya jika jam lahir diketahui) */}
      {hasExactTime && houses.length === 12 && (
        <g>
          {houses.map((h) => {
            const angle = h.house === 1 || h.house === 4 || h.house === 7 || h.house === 10;
            const a = pt(h.absoluteDegree, R.aspect);
            const b = pt(h.absoluteDegree, angle ? R.signOut + 14 : R.signIn);
            return (
              <line
                key={h.house}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={INK}
                strokeWidth={angle ? 2.6 : 1}
              />
            );
          })}
          {houses.map((h, i) => {
            const next = houses[(i + 1) % 12];
            const span = norm(next.absoluteDegree - h.absoluteDegree);
            const p = pt(h.absoluteDegree + span / 2, R_HOUSE_NUM);
            return (
              <text
                key={`n${h.house}`}
                x={p.x}
                y={p.y}
                fontSize="12"
                fontWeight="600"
                fill={INK}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {h.house}
              </text>
            );
          })}

          {/* Label sumbu AC / MC / DC / IC */}
          {[
            { lon: ascendant?.absoluteDegree, t: 'AC' },
            { lon: midheaven?.absoluteDegree, t: 'MC' },
            { lon: ascendant ? ascendant.absoluteDegree + 180 : undefined, t: 'DC' },
            { lon: midheaven ? midheaven.absoluteDegree + 180 : undefined, t: 'IC' },
          ].map(({ lon, t }) => {
            if (lon === undefined) return null;
            const p = pt(lon, R.signOut + 30);
            return (
              <text
                key={t}
                x={p.x}
                y={p.y}
                fontSize="13"
                fontWeight="700"
                fill="#E0C99A"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {t}
              </text>
            );
          })}
        </g>
      )}

      {/* Garis aspek: merah = konflik, biru = harmoni (konjungsi tidak digambar) */}
      <g>
        {shownAspects.map((asp, idx) => {
          const l1 = lonOf(asp.planet1);
          const l2 = lonOf(asp.planet2);
          if (l1 === undefined || l2 === undefined) return null;
          const a = pt(l1, R.aspect);
          const b = pt(l2, R.aspect);
          const s = aspectStyle(asp.aspectType, asp.orb);
          const involved = hoveredName && (asp.planet1 === hoveredName || asp.planet2 === hoveredName);
          const opacity = hoveredName ? (involved ? 1 : 0.1) : 0.85;
          return (
            <line
              key={idx}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={s.color}
              strokeWidth={involved ? s.width + 0.8 : s.width}
              strokeDasharray={s.dash}
              strokeLinecap="round"
              opacity={opacity}
            />
          );
        })}
        {/* titik ujung aspek di lingkaran dalam */}
        {planets.map((p) => {
          const q = pt(p.absoluteDegree, R.aspect);
          return <circle key={`d${p.id}`} cx={q.x} cy={q.y} r="2.4" fill={INK} />;
        })}
      </g>

      {/* Planet */}
      {planets.map((p) => {
        const shown = display.get(p.id) ?? p.absoluteDegree;
        const moved = Math.abs(norm(shown - p.absoluteDegree + 180) - 180) > 0.4;
        const isHover = hoveredId === p.id;

        const tickA = pt(p.absoluteDegree, R.signIn);
        const tickB = pt(p.absoluteDegree, R.signIn - 6);
        const label = pt(shown, R.signIn - 6);
        const deg = pt(shown, R_DEG);
        const glyph = pt(shown, R_PLANET);
        const signG = pt(shown, R_PLANET_SIGN);
        const min = pt(shown, R_MIN);

        return (
          <g
            key={p.id}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover(p)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onHover(isHover ? null : p)}
          >
            {/* tick posisi asli */}
            <line x1={tickA.x} y1={tickA.y} x2={tickB.x} y2={tickB.y} stroke={INK} strokeWidth="1.6" />
            {moved && (
              <line x1={tickB.x} y1={tickB.y} x2={label.x} y2={label.y} stroke={INK} strokeWidth="0.7" />
            )}

            {/* area sentuh */}
            <circle cx={glyph.x} cy={glyph.y} r="15" fill="transparent" />
            {isHover && <circle cx={glyph.x} cy={glyph.y} r="14" fill={INK} />}

            <text x={deg.x} y={deg.y} fontSize="11" fontWeight="600" fill={INK} textAnchor="middle" dominantBaseline="central">
              {p.degree}°
            </text>
            <AstroGlyph
              name={p.id}
              x={glyph.x}
              y={glyph.y}
              size={isHover ? 22 : 20}
              color={isHover ? GOLD.field : INK}
              strokeWidth={1.7}
            />
            <ZodiacGlyph sign={p.sign} x={signG.x} y={signG.y} size={17} />
            <text x={min.x} y={min.y} fontSize="10" fill={INK} textAnchor="middle" dominantBaseline="central">
              {String(p.minute).padStart(2, '0')}′
            </text>
            {p.isRetrograde && (() => {
              // geser R searah garis singgung supaya tidak menabrak label lain
              const a = (screenAngle(shown) * Math.PI) / 180;
              const rx = glyph.x + 13 * -Math.sin(a);
              const ry = glyph.y + 13 * -Math.cos(a);
              return (
                <text x={rx} y={ry} fontSize="9" fontWeight="700" fill={CONFLICT} textAnchor="middle" dominantBaseline="central">
                  R
                </text>
              );
            })()}
          </g>
        );
      })}
    </svg>
  );
};

export default NatalChartWheel;
