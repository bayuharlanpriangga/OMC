import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
} from '@mui/material';
import { BaseChartResult } from '../../../types/systems';
import { AstrologyCalculationResult, PlanetPosition } from '../../../systems/astrology/types';
import { SIGN_GLYPHS, ZODIAC_SIGNS } from '../../../systems/astrology/natal/calculator';

interface AstrologyVisualizationProps {
  result: BaseChartResult<AstrologyCalculationResult>;
}

export const AstrologyVisualization: React.FC<AstrologyVisualizationProps> = ({ result }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);

  const { data } = result;
  const { planets, houses, aspects, elementBalance, modalityBalance } = data;

  // Chart Wheel geometry settings
  const size = 460;
  const center = size / 2;
  const radius = size / 2 - 20;
  const innerRadius = radius - 45;
  const houseRadius = innerRadius - 40;
  const aspectsRadius = houseRadius - 40;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Overview Metric Bar */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
          '& > div': {
            py: { xs: 1.5, sm: 0 },
            px: { xs: 0, sm: 2.5 },
            borderBottom: { xs: '1px solid #1E283D', sm: 'none' },
            borderRight: { xs: 'none', sm: '1px solid #1E283D' },
          },
          '& > div:first-of-type': { pl: 0 },
          '& > div:last-of-type': { borderBottom: 'none', borderRight: 'none', pr: 0 },
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Sun Sign
          </Typography>
          <Typography variant="h6" sx={{ color: '#E0C99A', mt: 0.5, fontWeight: 700 }}>
            {planets.find((p) => p.name === 'Sun')?.sign} {planets.find((p) => p.name === 'Sun')?.degree}°
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Moon Sign
          </Typography>
          <Typography variant="h6" sx={{ color: '#9BB8DE', mt: 0.5, fontWeight: 700 }}>
            {planets.find((p) => p.name === 'Moon')?.sign} {planets.find((p) => p.name === 'Moon')?.degree}°
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Ascendant (Rising)
          </Typography>
          <Typography variant="h6" sx={{ color: data.ascendant ? '#34D399' : '#FBBF24', mt: 0.5, fontWeight: 700 }}>
            {data.ascendant ? `${data.ascendant.sign} ${data.ascendant.degree}°` : 'Time Unknown'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            House System
          </Typography>
          <Typography variant="h6" sx={{ color: '#EDF1F7', mt: 0.5, fontWeight: 600, textTransform: 'capitalize' }}>
            {data.houseSystem}
          </Typography>
        </Box>
      </Box>

      {/* Main Wheel & Elements Container */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
          alignItems: 'start',
          '& > *:first-of-type': {
            borderRight: { xs: 'none', lg: '1px solid #1E283D' },
            pr: { xs: 0, lg: 3 },
          },
        }}
      >
        {/* Interactive Astrological Chart Wheel (Pure SVG, NO Gradients) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ alignSelf: 'flex-start', mb: 1, color: '#E0C99A', fontFamily: '"Cinzel", serif' }}>
            Celestial Wheel Projection
          </Typography>

          <Box sx={{ width: '100%', maxWidth: size, position: 'relative', userSelect: 'none' }}>
            <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
              {/* Outer Ecliptic Zodiac Ring */}
              <circle cx={center} cy={center} r={radius} fill="#090D18" stroke="#25324D" strokeWidth="2" />
              <circle cx={center} cy={center} r={innerRadius} fill="#0B0E1A" stroke="#25324D" strokeWidth="1.5" />

              {/* 12 Zodiac Segments */}
              {ZODIAC_SIGNS.map((sign, i) => {
                const angle = i * 30;
                const rad = (angle * Math.PI) / 180;
                const textAngle = angle + 15;
                const textRad = (textAngle * Math.PI) / 180;
                const glyphX = center + (radius - 22) * Math.cos(textRad);
                const glyphY = center + (radius - 22) * Math.sin(textRad);

                return (
                  <g key={sign}>
                    {/* Sign separator line */}
                    <line
                      x1={center + innerRadius * Math.cos(rad)}
                      y1={center + innerRadius * Math.sin(rad)}
                      x2={center + radius * Math.cos(rad)}
                      y2={center + radius * Math.sin(rad)}
                      stroke="#222C42"
                      strokeWidth="1"
                    />
                    {/* Zodiac Glyph */}
                    <text
                      x={glyphX}
                      y={glyphY}
                      fill="#E0C99A"
                      fontSize="14"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily="system-ui"
                    >
                      {SIGN_GLYPHS[sign]}
                    </text>
                  </g>
                );
              })}

              {/* House Cusps Lines (if time known) */}
              {data.hasExactTime &&
                houses.map((h) => {
                  const rad = ((h.absoluteDegree - 90) * Math.PI) / 180;
                  const isCardinal = h.house === 1 || h.house === 4 || h.house === 7 || h.house === 10;
                  return (
                    <line
                      key={h.house}
                      x1={center + aspectsRadius * Math.cos(rad)}
                      y1={center + aspectsRadius * Math.sin(rad)}
                      x2={center + innerRadius * Math.cos(rad)}
                      y2={center + innerRadius * Math.sin(rad)}
                      stroke={isCardinal ? '#E0C99A' : '#1C263A'}
                      strokeWidth={isCardinal ? 1.5 : 0.8}
                      strokeDasharray={isCardinal ? undefined : '2,2'}
                    />
                  );
                })}

              {/* Aspect Geometric Lines between bodies */}
              {aspects.slice(0, 16).map((asp, idx) => {
                const p1 = planets.find((p) => p.name === asp.planet1);
                const p2 = planets.find((p) => p.name === asp.planet2);
                if (!p1 || !p2) return null;

                const rad1 = ((p1.absoluteDegree - 90) * Math.PI) / 180;
                const rad2 = ((p2.absoluteDegree - 90) * Math.PI) / 180;
                const x1 = center + aspectsRadius * Math.cos(rad1);
                const y1 = center + aspectsRadius * Math.sin(rad1);
                const x2 = center + aspectsRadius * Math.cos(rad2);
                const y2 = center + aspectsRadius * Math.sin(rad2);

                const aspectColor =
                  asp.aspectType === 'Trine'
                    ? '#60A5FA'
                    : asp.aspectType === 'Square'
                    ? '#F87171'
                    : asp.aspectType === 'Opposition'
                    ? '#FBBF24'
                    : asp.aspectType === 'Sextile'
                    ? '#34D399'
                    : '#E0C99A';

                return (
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={aspectColor}
                    strokeWidth="0.8"
                    opacity="0.45"
                  />
                );
              })}

              {/* Planet Markers along the circle */}
              {planets.map((planet) => {
                const rad = ((planet.absoluteDegree - 90) * Math.PI) / 180;
                const px = center + (innerRadius - 20) * Math.cos(rad);
                const py = center + (innerRadius - 20) * Math.sin(rad);
                const isHovered = hoveredPlanet?.id === planet.id;

                return (
                  <g
                    key={planet.id}
                    onMouseEnter={() => setHoveredPlanet(planet)}
                    onMouseLeave={() => setHoveredPlanet(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={px}
                      cy={py}
                      r={isHovered ? 13 : 9}
                      fill={isHovered ? '#E0C99A' : '#141B2B'}
                      stroke={isHovered ? '#EDF1F7' : '#3E4F73'}
                      strokeWidth={isHovered ? 2 : 1}
                    />
                    <text
                      x={px}
                      y={py}
                      fill={isHovered ? '#0B0E17' : '#EDF1F7'}
                      fontSize={isHovered ? '11' : '9'}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {planet.glyph}
                    </text>
                  </g>
                );
              })}

              {/* Inner Center Hub */}
              <circle cx={center} cy={center} r={aspectsRadius} fill="#090D18" stroke="#1D273B" strokeWidth="1" />
              <circle cx={center} cy={center} r="6" fill="#E0C99A" opacity="0.6" />
            </svg>
          </Box>

          {/* Hovered Planet Details Popover */}
          <Box sx={{ mt: 1.5, minHeight: 36, textAlign: 'center' }}>
            {hoveredPlanet ? (
              <Typography variant="body2" sx={{ color: '#E0C99A', fontWeight: 600 }}>
                {hoveredPlanet.glyph} {hoveredPlanet.name} in {hoveredPlanet.sign} at {hoveredPlanet.degree}°{hoveredPlanet.minute}'
                {hoveredPlanet.house ? ` (House ${hoveredPlanet.house})` : ''} {hoveredPlanet.isRetrograde ? '· Retrograde (Rx)' : ''}
              </Typography>
            ) : (
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Hover over planet glyphs on the wheel to inspect coordinate details
              </Typography>
            )}
          </Box>
        </Box>

        {/* Elemental & Modality Breakdown */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ pb: 2.5, mb: 2.5, borderBottom: '1px solid #1E283D' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#E0C99A', fontFamily: '"Cinzel", serif' }}>
              Elemental Composition
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, textAlign: 'center' }}>
              {Object.entries(elementBalance).map(([element, count]) => {
                const colors: Record<string, { bg: string; text: string; border: string }> = {
                  Fire: { bg: 'rgba(239, 68, 68, 0.12)', text: '#FCA5A5', border: 'rgba(239, 68, 68, 0.3)' },
                  Earth: { bg: 'rgba(34, 197, 94, 0.12)', text: '#86EFAC', border: 'rgba(34, 197, 94, 0.3)' },
                  Air: { bg: 'rgba(59, 130, 246, 0.12)', text: '#93C5FD', border: 'rgba(59, 130, 246, 0.3)' },
                  Water: { bg: 'rgba(168, 85, 247, 0.12)', text: '#D8B4FE', border: 'rgba(168, 85, 247, 0.3)' },
                };
                const c = colors[element] || colors.Fire;
                return (
                  <Box
                    key={element}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: c.bg,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: c.text, fontWeight: 600, display: 'block' }}>
                      {element}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#EDF1F7', mt: 0.5, fontWeight: 700 }}>
                      {count}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#9BB8DE', fontFamily: '"Cinzel", serif' }}>
              Modality Distribution
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center' }}>
              {Object.entries(modalityBalance).map(([mod, count], i, arr) => (
                <Box
                  key={mod}
                  sx={{
                    py: 1,
                    px: 1.5,
                    borderRight: i < arr.length - 1 ? '1px solid #1E283D' : 'none',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, display: 'block' }}>
                    {mod}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#EDF1F7', mt: 0.5, fontWeight: 700 }}>
                    {count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tabs for Planetary Positions, Houses, and Aspects Tables */}
      <Box sx={{ borderTop: '1px solid #1E283D', pt: 3 }}>
        <Box sx={{ borderBottom: '1px solid #1E283D' }}>
          <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)}>
            <Tab label="Planetary Bodies" />
            <Tab label="House Cusps (1-12)" disabled={!data.hasExactTime} />
            <Tab label="Major Aspects" />
          </Tabs>
        </Box>

        {/* Tab 0: Planetary Table */}
        {tabIndex === 0 && (
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ borderBottom: '1px solid #202A3E' }}>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Planet</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Zodiac Sign</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Position</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>House</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Element / Modality</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Motion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planets.map((planet) => (
                  <TableRow
                    key={planet.id}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(224, 201, 154, 0.04)' },
                      borderBottom: '1px solid #161F30',
                    }}
                  >
                    <TableCell sx={{ color: '#EDF1F7', fontWeight: 600 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: '#E0C99A', fontFamily: 'system-ui', fontSize: '1.1rem' }}>
                          {planet.glyph}
                        </Typography>
                        {planet.name}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#D4DCED' }}>
                      {SIGN_GLYPHS[planet.sign]} {planet.sign}
                    </TableCell>
                    <TableCell sx={{ color: '#D4DCED', fontFamily: '"JetBrains Mono", monospace' }}>
                      {planet.degree}° {planet.minute}'
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8' }}>
                      {planet.house ? `House ${planet.house}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip label={`${planet.element} · ${planet.modality}`} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                    </TableCell>
                    <TableCell>
                      {planet.isRetrograde ? (
                        <Chip label="Retrograde (Rx)" size="small" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', height: 20, fontSize: '0.68rem' }} />
                      ) : (
                        <Typography variant="caption" sx={{ color: '#64748B' }}>Direct</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tab 1: Houses Table */}
        {tabIndex === 1 && data.hasExactTime && (
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ borderBottom: '1px solid #202A3E' }}>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>House</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Sign Cusp</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Exact Degree</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Ruling Planet</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {houses.map((h) => (
                  <TableRow key={h.house} sx={{ borderBottom: '1px solid #161F30' }}>
                    <TableCell sx={{ color: '#EDF1F7', fontWeight: 600 }}>
                      House {h.house}
                    </TableCell>
                    <TableCell sx={{ color: '#D4DCED' }}>
                      {SIGN_GLYPHS[h.sign]} {h.sign}
                    </TableCell>
                    <TableCell sx={{ color: '#D4DCED', fontFamily: '"JetBrains Mono", monospace' }}>
                      {h.degree}° {h.minute}'
                    </TableCell>
                    <TableCell sx={{ color: '#E0C99A' }}>
                      {h.ruler}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tab 2: Aspects Table */}
        {tabIndex === 2 && (
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ borderBottom: '1px solid #202A3E' }}>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Body 1</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Aspect</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Body 2</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Angle</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Orb</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aspects.map((asp, idx) => (
                  <TableRow key={idx} sx={{ borderBottom: '1px solid #161F30' }}>
                    <TableCell sx={{ color: '#EDF1F7', fontWeight: 600 }}>{asp.planet1}</TableCell>
                    <TableCell>
                      <Chip
                        label={asp.aspectType}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          backgroundColor:
                            asp.aspectType === 'Trine' ? 'rgba(96, 165, 250, 0.15)' :
                            asp.aspectType === 'Square' ? 'rgba(248, 113, 113, 0.15)' :
                            asp.aspectType === 'Opposition' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                          color:
                            asp.aspectType === 'Trine' ? '#93C5FD' :
                            asp.aspectType === 'Square' ? '#FCA5A5' :
                            asp.aspectType === 'Opposition' ? '#FDE68A' : '#6EE7B7',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#EDF1F7', fontWeight: 600 }}>{asp.planet2}</TableCell>
                    <TableCell sx={{ color: '#D4DCED', fontFamily: '"JetBrains Mono", monospace' }}>
                      {asp.angle}°
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontFamily: '"JetBrains Mono", monospace' }}>
                      {asp.orb}°
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Structured Archetypal Interpretations */}
      <Box sx={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #1E283D' }}>
        <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', pt: 3 }}>
          Archetypal Interpretations
        </Typography>
        {result.interpretations.map((sec, idx) => (
          <Box
            key={idx}
            sx={{
              py: 3,
              borderBottom: idx === result.interpretations.length - 1 ? 'none' : '1px solid #1E283D',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#E0C99A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                {sec.category}
              </Typography>
              {sec.keywords && (
                <Box sx={{ display: 'flex', gap: 0.8 }}>
                  {sec.keywords.map((kw) => (
                    <Chip key={kw} label={kw} size="small" sx={{ height: 20, fontSize: '0.68rem', backgroundColor: '#1A2338', color: '#94A3B8' }} />
                  ))}
                </Box>
              )}
            </Box>
            <Typography variant="h6" sx={{ color: '#EDF1F7', mb: 1, fontFamily: '"Cinzel", serif' }}>
              {sec.title}
            </Typography>
            <Typography variant="body1" sx={{ color: '#D4DCED', mb: 1.5 }}>
              {sec.content}
            </Typography>
            {sec.highlights && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1.5, pt: 1.5, borderTop: '1px solid #1B2438' }}>
                {sec.highlights.map((hl) => (
                  <Box key={hl.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>{hl.label}:</Typography>
                    <Typography variant="caption" sx={{ color: '#E0C99A', fontWeight: 600 }}>{hl.value}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
