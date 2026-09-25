import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { BaseChartResult } from '../../../types/systems';
import { TzolkinCalculationResult, TzolkinKin } from '../../../systems/tzolkin/types';

interface TzolkinVisualizationProps {
  result: BaseChartResult<TzolkinCalculationResult>;
}

export const TzolkinVisualization: React.FC<TzolkinVisualizationProps> = ({ result }) => {
  const { data } = result;
  const { destinyKin, oracle, wavespellSeal, wavespellDay, castle, colorDirection } = data;

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    Red: { bg: 'rgba(239, 68, 68, 0.12)', text: '#FCA5A5', border: 'rgba(239, 68, 68, 0.35)' },
    White: { bg: 'rgba(241, 245, 249, 0.12)', text: '#F1F5F9', border: 'rgba(241, 245, 249, 0.35)' },
    Blue: { bg: 'rgba(59, 130, 246, 0.12)', text: '#93C5FD', border: 'rgba(59, 130, 246, 0.35)' },
    Yellow: { bg: 'rgba(234, 179, 8, 0.12)', text: '#FDE68A', border: 'rgba(234, 179, 8, 0.35)' },
  };

  const renderKinPill = (kin: TzolkinKin, role: string) => {
    const c = colorMap[kin.seal.color];
    return (
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: c.bg,
          border: `1px solid ${c.border}`,
          textAlign: 'center',
          minWidth: 120,
        }}
      >
        <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>
          {role}
        </Typography>
        <Typography variant="h6" sx={{ color: c.text, fontWeight: 700, my: 0.2 }}>
          {kin.seal.symbol} Kin {kin.kinNumber}
        </Typography>
        <Typography variant="caption" sx={{ color: '#EDF1F7', fontWeight: 600, display: 'block' }}>
          {kin.tone.name} {kin.seal.name}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Galactic Signature Banner */}
      <Card sx={{ backgroundColor: '#0E1322', border: '1.5px solid #E0C99A', p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              backgroundColor: '#131929',
              border: '2px solid #E0C99A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E0C99A',
              flexShrink: 0,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {destinyKin.kinNumber}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9BB8DE' }}>
              KIN
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', fontWeight: 700 }}>
                {destinyKin.seal.symbol} {destinyKin.seal.color} {destinyKin.tone.name} {destinyKin.seal.name} ({destinyKin.seal.mayaName})
              </Typography>
              <Chip label={colorDirection} size="small" sx={{ backgroundColor: '#161F33', color: '#E0C99A' }} />
            </Box>
            <Typography variant="body2" sx={{ color: '#E0C99A', fontStyle: 'italic', mb: 1 }}>
              "{destinyKin.affirmation}"
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              <Chip label={`Action: ${destinyKin.seal.action}`} size="small" />
              <Chip label={`Power: ${destinyKin.seal.power}`} size="small" />
              <Chip label={`Tone ${destinyKin.tone.number}: ${destinyKin.tone.creativePower}`} size="small" />
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Destiny Oracle Cross & Wavespell */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Five-Part Galactic Cross (Oracle) */}
        <Card sx={{ backgroundColor: '#0D111D', border: '1px solid #1E283D', p: 3 }}>
          <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 2.5, fontFamily: '"Cinzel", serif' }}>
            The 5-Part Destiny Oracle Cross
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            {/* Guide Kin (Top) */}
            {renderKinPill(oracle.guide, 'Higher Guide')}

            {/* Middle Row: Antipode (Left), Destiny (Center), Analog (Right) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              {renderKinPill(oracle.antipode, 'Antipode (Challenge)')}
              {renderKinPill(destinyKin, 'Destiny Core')}
              {renderKinPill(oracle.analog, 'Analog (Support)')}
            </Box>

            {/* Occult Kin (Bottom) */}
            {renderKinPill(oracle.occult, 'Occult (Hidden Magic)')}
          </Box>
        </Card>

        {/* Wavespell & Castle Cycles */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card sx={{ backgroundColor: '#0E1322', border: '1px solid #1E283D', p: 2.5 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Wavespell Architecture
            </Typography>
            <Typography variant="h6" sx={{ color: '#EDF1F7', fontFamily: '"Cinzel", serif', mt: 0.5 }}>
              {wavespellSeal.symbol} {wavespellSeal.name} Wavespell
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
              You were born on <strong>Day {wavespellDay}</strong> of this 13-day transformative wave.
            </Typography>
          </Card>

          <Card sx={{ backgroundColor: '#0E1322', border: '1px solid #1E283D', p: 2.5 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Galactic Castle
            </Typography>
            <Typography variant="h6" sx={{ color: '#9BB8DE', fontFamily: '"Cinzel", serif', mt: 0.5 }}>
              {castle}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
              A 52-day evolutionary quadrant in the 260-day sacred spin.
            </Typography>
          </Card>
        </Box>
      </Box>

      {/* Interpretations */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7' }}>
          Galactic Interpretations
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
