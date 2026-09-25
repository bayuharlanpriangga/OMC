import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { BaseChartResult } from '../../../types/systems';
import { HDCenterId, HumanDesignCalculationResult } from '../../../systems/human-design/types';

interface HumanDesignVisualizationProps {
  result: BaseChartResult<HumanDesignCalculationResult>;
}

export const HumanDesignVisualization: React.FC<HumanDesignVisualizationProps> = ({ result }) => {
  const { data } = result;
  const [selectedCenter, setSelectedCenter] = useState<HDCenterId | null>(null);

  // Geometric coordinates for 9 Bodygraph centers in SVG (width 380, height 520)
  const centerCoords: Record<HDCenterId, { x: number; y: number; label: string }> = {
    head: { x: 190, y: 45, label: 'Head' },
    ajna: { x: 190, y: 110, label: 'Ajna' },
    throat: { x: 190, y: 185, label: 'Throat' },
    'g-center': { x: 190, y: 270, label: 'G-Center' },
    heart: { x: 275, y: 285, label: 'Heart / Ego' },
    spleen: { x: 95, y: 355, label: 'Spleen' },
    'solar-plexus': { x: 285, y: 355, label: 'Solar Plexus' },
    sacral: { x: 190, y: 375, label: 'Sacral' },
    root: { x: 190, y: 465, label: 'Root' },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Key Bioenergetic Metrics Bar */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <Card sx={{ backgroundColor: '#0E1322', border: '1px solid #1F283D' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Energy Type
            </Typography>
            <Typography variant="h6" sx={{ color: '#E0C99A', mt: 0.5, fontWeight: 700 }}>
              {data.type}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: '#0E1322', border: '1px solid #1F283D' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Profile
            </Typography>
            <Typography variant="h6" sx={{ color: '#9BB8DE', mt: 0.5, fontWeight: 700 }}>
              {data.profile} ({data.profileName.split('/')[0].trim()})
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: '#0E1322', border: '1px solid #1F283D' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Inner Authority
            </Typography>
            <Typography variant="h6" sx={{ color: '#34D399', mt: 0.5, fontWeight: 700 }}>
              {data.authority}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: '#0E1322', border: '1px solid #1F283D' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Strategy
            </Typography>
            <Typography variant="body2" sx={{ color: '#EDF1F7', mt: 0.8, fontWeight: 600 }}>
              {data.strategy}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Main Bodygraph & Center Details */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* Interactive Bodygraph SVG (NO Gradients) */}
        <Card sx={{ backgroundColor: '#0D111D', border: '1px solid #1E283D', p: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ alignSelf: 'flex-start', mb: 1.5, color: '#E0C99A', fontFamily: '"Cinzel", serif' }}>
            The Nine-Center Bodygraph
          </Typography>

          <Box sx={{ width: '100%', maxWidth: 380, position: 'relative', userSelect: 'none' }}>
            <svg viewBox="0 0 380 520" width="100%" height="100%">
              {/* Background Spinal Circuit Channels */}
              <line x1="190" y1="45" x2="190" y2="110" stroke="#1F2A3F" strokeWidth="4" />
              <line x1="190" y1="110" x2="190" y2="185" stroke="#1F2A3F" strokeWidth="4" />
              <line x1="190" y1="185" x2="190" y2="270" stroke="#1F2A3F" strokeWidth="4" />
              <line x1="190" y1="270" x2="190" y2="375" stroke="#1F2A3F" strokeWidth="4" />
              <line x1="190" y1="375" x2="190" y2="465" stroke="#1F2A3F" strokeWidth="4" />

              {/* Diagonal Channels */}
              <line x1="190" y1="270" x2="275" y2="285" stroke="#1F2A3F" strokeWidth="3" />
              <line x1="190" y1="185" x2="95" y2="355" stroke="#1F2A3F" strokeWidth="3" />
              <line x1="190" y1="185" x2="285" y2="355" stroke="#1F2A3F" strokeWidth="3" />
              <line x1="95" y1="355" x2="190" y2="375" stroke="#1F2A3F" strokeWidth="3" />
              <line x1="285" y1="355" x2="190" y2="375" stroke="#1F2A3F" strokeWidth="3" />
              <line x1="95" y1="355" x2="190" y2="465" stroke="#1F2A3F" strokeWidth="3" />
              <line x1="285" y1="355" x2="190" y2="465" stroke="#1F2A3F" strokeWidth="3" />

              {/* Active Channels Highlight */}
              {data.activeChannels.map((ch) => {
                return (
                  <path
                    key={ch.id}
                    d="M 190 270 L 190 375"
                    stroke="#E0C99A"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                );
              })}

              {/* Render 9 Centers */}
              {/* 1. HEAD (Upright Triangle) */}
              <g onClick={() => setSelectedCenter('head')} style={{ cursor: 'pointer' }}>
                <polygon
                  points="190,20 160,65 220,65"
                  fill={data.centers.head.isDefined ? '#E0C99A' : '#101625'}
                  stroke={data.centers.head.isDefined ? '#EDF1F7' : '#2A364F'}
                  strokeWidth="2"
                />
                <text x="190" y="52" fill={data.centers.head.isDefined ? '#1A1408' : '#94A3B8'} fontSize="9" fontWeight="bold" textAnchor="middle">
                  HEAD
                </text>
              </g>

              {/* 2. AJNA (Inverted Triangle) */}
              <g onClick={() => setSelectedCenter('ajna')} style={{ cursor: 'pointer' }}>
                <polygon
                  points="160,85 220,85 190,135"
                  fill={data.centers.ajna.isDefined ? '#9BB8DE' : '#101625'}
                  stroke={data.centers.ajna.isDefined ? '#EDF1F7' : '#2A364F'}
                  strokeWidth="2"
                />
                <text x="190" y="105" fill={data.centers.ajna.isDefined ? '#0A1320' : '#94A3B8'} fontSize="9" fontWeight="bold" textAnchor="middle">
                  AJNA
                </text>
              </g>

              {/* 3. THROAT (Square) */}
              <g onClick={() => setSelectedCenter('throat')} style={{ cursor: 'pointer' }}>
                <rect
                  x="165"
                  y="160"
                  width="50"
                  height="50"
                  rx="6"
                  fill={data.centers.throat.isDefined ? '#D97706' : '#101625'}
                  stroke={data.centers.throat.isDefined ? '#EDF1F7' : '#2A364F'}
                  strokeWidth="2"
                />
                <text x="190" y="188" fill={data.centers.throat.isDefined ? '#FFFFFF' : '#94A3B8'} fontSize="8" fontWeight="bold" textAnchor="middle">
                  THROAT
                </text>
              </g>

              {/* 4. G-CENTER (Diamond) */}
              <g onClick={() => setSelectedCenter('g-center')} style={{ cursor: 'pointer' }}>
                <polygon
                  points="190,240 220,270 190,300 160,270"
                  fill={data.centers['g-center'].isDefined ? '#E0C99A' : '#101625'}
                  stroke={data.centers['g-center'].isDefined ? '#EDF1F7' : '#2A364F'}
                  strokeWidth="2"
                />
                <text x="190" y="273" fill={data.centers['g-center'].isDefined ? '#1A1408' : '#94A3B8'} fontSize="8" fontWeight="bold" textAnchor="middle">
                  G-CENTER
                </text>
              </g>

              {/* 5. HEART / EGO (Small Triangle) */}
              <g onClick={() => setSelectedCenter('heart')} style={{ cursor: 'pointer' }}>
                <polygon
                  points="260,270 290,285 260,300"
                  fill={data.centers.heart.isDefined ? '#EF4444' : '#101625'}
                  stroke={data.centers.heart.isDefined ? '#EDF1F7' : '#2A364F'}
                  strokeWidth="2"
                />
                <text x="270" y="288" fill={data.centers.heart.isDefined ? '#FFFFFF' : '#94A3B8'} fontSize="7" fontWeight="bold" textAnchor="middle">
                  EGO
                </text>
              </g>

              {/* 6. SPLEEN (Left Triangle) */}
              <g onClick={() => setSelectedCenter('spleen')} style={{ cursor: 'pointer' }}>
                <polygon
                  points="115,325 115,385 65,355"
                  fill={data.centers.spleen.isDefined ? '#D97706' : '#101625'}
                  stroke={data.centers.spleen.isDefined ? '#EDF1F7' : '#2A364F'}
                  strokeWidth="2"
                />
                <text x="100" y="358" fill={data.centers.spleen.isDefined ? '#FFFFFF' : '#94A3B8'} fontSize="7" fontWeight="bold" textAnchor="middle">
                  SPLEEN
                </text>
              </g>

              {/* 7. SOLAR PLEXUS (Right Triangle) */}
              <g onClick={() => setSelectedCenter('solar-plexus')} style={{ cursor: 'pointer' }}>
                <polygon
                  points="265,325 315,355 265,385"
                  fill={data.centers['solar-plexus'].isDefined ? '#D97706' : '#101625'}
                  stroke={data.centers['solar-plexus'].isDefined ? '#EDF1F7' : '#2A364F'}
                  strokeWidth="2"
                />
                <text x="280" y="358" fill={data.centers['solar-plexus'].isDefined ? '#FFFFFF' : '#94A3B8'} fontSize="7" fontWeight="bold" textAnchor="middle">
                  EMOTIONAL
                </text>
              </g>

              {/* 8. SACRAL (Square) */}
              <g onClick={() => setSelectedCenter('sacral')} style={{ cursor: 'pointer' }}>
                <rect
                  x="165"
                  y="350"
                  width="50"
                  height="50"
                  rx="6"
                  fill={data.centers.sacral.isDefined ? '#EF4444' : '#101625'}
                  stroke={data.centers.sacral.isDefined ? '#EDF1F7' : '#2A364F'}
                  strokeWidth="2"
                />
                <text x="190" y="378" fill={data.centers.sacral.isDefined ? '#FFFFFF' : '#94A3B8'} fontSize="8" fontWeight="bold" textAnchor="middle">
                  SACRAL
                </text>
              </g>

              {/* 9. ROOT (Square) */}
              <g onClick={() => setSelectedCenter('root')} style={{ cursor: 'pointer' }}>
                <rect
                  x="165"
                  y="440"
                  width="50"
                  height="50"
                  rx="6"
                  fill={data.centers.root.isDefined ? '#D97706' : '#101625'}
                  stroke={data.centers.root.isDefined ? '#EDF1F7' : '#2A364F'}
                  strokeWidth="2"
                />
                <text x="190" y="468" fill={data.centers.root.isDefined ? '#FFFFFF' : '#94A3B8'} fontSize="8" fontWeight="bold" textAnchor="middle">
                  ROOT
                </text>
              </g>
            </svg>
          </Box>

          <Typography variant="caption" sx={{ color: '#94A3B8', mt: 1 }}>
            Click on any center to review its definition state and conditioning potential
          </Typography>
        </Card>

        {/* Selected Center or Summary Panel */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Card sx={{ backgroundColor: '#0E1322', border: '1px solid #1E283D' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 1.5, fontFamily: '"Cinzel", serif' }}>
                {selectedCenter ? data.centers[selectedCenter].name : 'Bio-Energetic Mechanics'}
              </Typography>
              {selectedCenter ? (
                <Box>
                  <Chip
                    label={data.centers[selectedCenter].isDefined ? 'Defined (Consistent Transmission)' : 'Undefined (Open / Receptor)'}
                    color={data.centers[selectedCenter].isDefined ? 'primary' : 'default'}
                    size="small"
                    sx={{ mb: 1.5 }}
                  />
                  <Typography variant="body2" sx={{ color: '#D4DCED' }}>
                    {data.centers[selectedCenter].isDefined
                      ? `This center produces a steady, reliable internal frequency that remains fixed regardless of environment.`
                      : `This center is open and porous, picking up and amplifying the emotional or mental frequencies of the people around you.`}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>Definition Architecture:</Typography>
                    <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>{data.definition}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>Not-Self Theme:</Typography>
                    <Typography variant="body2" sx={{ color: '#F87171', fontWeight: 600 }}>{data.notSelfTheme}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>Aura Signature:</Typography>
                    <Typography variant="body2" sx={{ color: '#34D399', fontWeight: 600 }}>{data.signature}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #1E283D' }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>Incarnation Cross:</Typography>
                    <Typography variant="body2" sx={{ color: '#E0C99A', fontWeight: 600 }}>{data.incarnationCross}</Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Active Channels List */}
          <Card sx={{ backgroundColor: '#0E1322', border: '1px solid #1E283D' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: '#9BB8DE', mb: 1.5, fontFamily: '"Cinzel", serif' }}>
                Defined Electromagnetic Channels
              </Typography>
              {data.activeChannels.map((ch) => (
                <Box key={ch.id} sx={{ py: 1, borderBottom: '1px solid #172133', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>
                      Channel {ch.id}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {ch.name}
                    </Typography>
                  </Box>
                  <Chip label={`Gates ${ch.gates[0]} · ${ch.gates[1]}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Structured Interpretations */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7' }}>
          Deconditioning &amp; Strategy Guidelines
        </Typography>
        {result.interpretations.map((sec, idx) => (
          <Card key={idx} sx={{ backgroundColor: '#0E1322', border: '1px solid #1F283D' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: '#E0C99A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, display: 'block', mb: 0.5 }}>
                {sec.category}
              </Typography>
              <Typography variant="h6" sx={{ color: '#EDF1F7', mb: 1, fontFamily: '"Cinzel", serif' }}>
                {sec.title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#D4DCED', mb: 1.5 }}>
                {sec.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
