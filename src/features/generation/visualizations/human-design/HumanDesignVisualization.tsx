import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { BaseChartResult } from '../../../../types/systems';
import { HDCenterId, HDGateActivation, HumanDesignCalculationResult } from '../../../../systems/human-design/types';
import { AstroGlyphInline } from '../astrology/astroGlyphs';
import { Bodygraph, DESIGN_COLOR, PERSONALITY_COLOR } from './Bodygraph';

/** Kolom posisi planet (gate.line) — kiri = Design (merah), kanan = Personality (emas). */
const PlanetColumn: React.FC<{ rows: HDGateActivation[]; kind: 'design' | 'personality' }> = ({ rows, kind }) => {
  const isDesign = kind === 'design';
  const accent = isDesign ? DESIGN_COLOR : PERSONALITY_COLOR;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%' }}>
      <Box sx={{ textAlign: 'center', mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: accent, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', lineHeight: 1.2 }}>
          {isDesign ? 'Design' : 'Personality'}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.65rem', display: 'block', lineHeight: 1.2 }}>
          {isDesign ? 'Unconscious' : 'Conscious'}
        </Typography>
      </Box>
      {rows.map((a) => (
        <Box
          key={a.planetId}
          title={a.isExtra ? `${a.planet} — hanya informasi, tidak menentukan definisi` : a.planet}
          sx={{
            display: 'flex',
            flexDirection: isDesign ? 'row' : 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0.75,
            px: 1,
            height: 26,
            borderRadius: 1,
            backgroundColor: isDesign ? 'rgba(220, 38, 38, 0.16)' : 'rgba(224, 201, 154, 0.12)',
            border: `1px solid ${isDesign ? 'rgba(220, 38, 38, 0.45)' : 'rgba(224, 201, 154, 0.35)'}`,
            opacity: a.isExtra ? 0.6 : 1,
          }}
        >
          <AstroGlyphInline name={a.planetId} size={15} color={accent} />
          <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600, fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums' }}>
            {a.gate}.{a.line}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const LegendSwatch: React.FC<{ color: string; striped?: boolean; label: string }> = ({ color, striped, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
    <Box
      sx={{
        width: 18,
        height: 6,
        borderRadius: 3,
        background: striped ? `repeating-linear-gradient(90deg, ${PERSONALITY_COLOR} 0 4px, ${DESIGN_COLOR} 4px 8px)` : color,
      }}
    />
    <Typography variant="caption" sx={{ color: '#94A3B8' }}>{label}</Typography>
  </Box>
);

interface HumanDesignVisualizationProps {
  result: BaseChartResult<HumanDesignCalculationResult>;
}

export const HumanDesignVisualization: React.FC<HumanDesignVisualizationProps> = ({ result }) => {
  const { data } = result;
  const [selectedCenter, setSelectedCenter] = useState<HDCenterId | null>(null);

  const profileTz = result.profiles[0]?.timezone;
  const designDateLabel = (() => {
    try {
      return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: profileTz || 'UTC' }).format(new Date(data.designDateUtc));
    } catch {
      return new Date(data.designDateUtc).toUTCString();
    }
  })();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Key Bioenergetic Metrics Bar */}
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
            Energy Type
          </Typography>
          <Typography variant="h6" sx={{ color: '#E0C99A', mt: 0.5, fontWeight: 700 }}>
            {data.type}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Profile
          </Typography>
          <Typography variant="h6" sx={{ color: '#9BB8DE', mt: 0.5, fontWeight: 700 }}>
            {data.profile} ({data.profileName.split('/')[0].trim()})
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Inner Authority
          </Typography>
          <Typography variant="h6" sx={{ color: '#34D399', mt: 0.5, fontWeight: 700 }}>
            {data.authority}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Strategy
          </Typography>
          <Typography variant="body2" sx={{ color: '#EDF1F7', mt: 0.8, fontWeight: 600 }}>
            {data.strategy}
          </Typography>
        </Box>
      </Box>

      {/* Main Bodygraph & Center Details */}
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
        {/* Bodygraph + kolom posisi planet (gaya chart HD klasik) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ alignSelf: 'flex-start', mb: 1.5, color: '#E0C99A', fontFamily: '"Cinzel", serif' }}>
            The Nine-Center Bodygraph
          </Typography>

          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gap: { xs: 1.5, md: 1 },
              alignItems: 'start',
              gridTemplateColumns: { xs: '1fr 1fr', md: 'minmax(88px, 112px) minmax(0, 1fr) minmax(88px, 112px)' },
              gridTemplateAreas: { xs: '"graph graph" "design personality"', md: '"design graph personality"' },
            }}
          >
            <Box sx={{ gridArea: 'design' }}>
              <PlanetColumn rows={data.designGates} kind="design" />
            </Box>

            <Box sx={{ gridArea: 'graph', width: '100%', maxWidth: 460, mx: 'auto', userSelect: 'none' }}>
              <Bodygraph data={data} selectedCenter={selectedCenter} onSelectCenter={setSelectedCenter} />
            </Box>

            <Box sx={{ gridArea: 'personality' }}>
              <PlanetColumn rows={data.personalityGates} kind="personality" />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2.5, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <LegendSwatch color={PERSONALITY_COLOR} label="Personality" />
            <LegendSwatch color={DESIGN_COLOR} label="Design" />
            <LegendSwatch color="" striped label="Keduanya" />
          </Box>
          <Typography variant="caption" sx={{ color: '#64748B', mt: 1, textAlign: 'center' }}>
            Design dihitung saat Matahari 88° sebelum posisi lahir · {designDateLabel}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', mt: 0.25, textAlign: 'center' }}>
            Klik center untuk melihat detailnya
          </Typography>
        </Box>

        {/* Selected Center or Summary Panel */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ pb: 2.5, mb: 2.5, borderBottom: '1px solid #1E283D' }}>
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
                {data.centers[selectedCenter].definedGates.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                    {Array.from(new Set(data.centers[selectedCenter].definedGates)).map((g) => (
                      <Chip key={g} label={`Gate ${g}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                    ))}
                  </Box>
                )}
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
          </Box>

          {/* Active Channels List */}
          <Box>
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
          </Box>
        </Box>
      </Box>

      {/* Structured Interpretations */}
      <Box sx={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #1E283D' }}>
        <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', pt: 3 }}>
          Deconditioning &amp; Strategy Guidelines
        </Typography>
        {result.interpretations.map((sec, idx) => (
          <Box
            key={idx}
            sx={{ py: 3, borderBottom: idx === result.interpretations.length - 1 ? 'none' : '1px solid #1E283D' }}
          >
            <Typography variant="caption" sx={{ color: '#E0C99A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, display: 'block', mb: 0.5 }}>
              {sec.category}
            </Typography>
            <Typography variant="h6" sx={{ color: '#EDF1F7', mb: 1, fontFamily: '"Cinzel", serif' }}>
              {sec.title}
            </Typography>
            <Typography variant="body1" sx={{ color: '#D4DCED', mb: 1.5 }}>
              {sec.content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
