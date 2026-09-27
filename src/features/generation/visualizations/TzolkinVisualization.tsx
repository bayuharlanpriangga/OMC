import React from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { BaseChartResult } from '../../../types/systems';
import { TzolkinCalculationResult, TzolkinKin, SolarSeal } from '../../../systems/tzolkin/types';
import { getSealIconPath, getCastleIconPath } from '../../../systems/tzolkin/icons';

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

  const SealIcon: React.FC<{ seal: SolarSeal; size?: number }> = ({ seal, size = 28 }) => (
    <Box
      component="img"
      src={getSealIconPath(seal)}
      alt={seal.name}
      onError={(e: any) => {
        e.currentTarget.style.display = 'none';
      }}
      sx={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }}
    />
  );

  // Destiny Core: the position tied to the actual Kin number (shown separately
  // above Wavespell Architecture, not inside this pill).
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 0.5 }}>
          <SealIcon seal={kin.seal} size={32} />
        </Box>
        <Typography variant="body2" sx={{ color: c.text, fontWeight: 700, display: 'block' }}>
          {kin.tone.name} {kin.seal.name}
        </Typography>
      </Box>
    );
  };

  // Guide / Antipode / Analog / Occult: companion Solar Seals, not full Kins —
  // they don't carry their own Kin number, only the destiny Kin does.
  const renderSealPill = (seal: SolarSeal, role: string) => {
    const c = colorMap[seal.color];
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 0.5 }}>
          <SealIcon seal={seal} size={32} />
        </Box>
        <Typography variant="body2" sx={{ color: c.text, fontWeight: 700, display: 'block' }}>
          {seal.name}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
          {seal.color} Seal
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Galactic Signature Banner */}
      <Box sx={{ pb: 3, borderBottom: '1px solid #1E283D' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
          <SealIcon seal={destinyKin.seal} size={90} />

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', fontWeight: 700 }}>
                {destinyKin.seal.color} {destinyKin.tone.name} {destinyKin.seal.name} ({destinyKin.seal.mayaName})
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
      </Box>

      {/* Destiny Oracle Cross & Wavespell */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          alignItems: 'start',
          '& > *:first-of-type': {
            borderRight: { xs: 'none', md: '1px solid #1E283D' },
            pr: { xs: 0, md: 3 },
          },
        }}
      >
        {/* Five-Part Galactic Cross (Oracle) */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 0.5, fontFamily: '"Cinzel", serif' }}>
            The 5-Part Destiny Oracle Cross
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
            Only the Destiny Core is your birth Kin — the other 4 are companion Solar Seals.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            {/* Guide Seal (Top) */}
            {renderSealPill(oracle.guide, 'Higher Guide')}

            {/* Middle Row: Antipode (Left), Destiny (Center), Analog (Right) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              {renderSealPill(oracle.antipode, 'Antipode (Challenge)')}
              {renderKinPill(destinyKin, 'Destiny Core')}
              {renderSealPill(oracle.analog, 'Analog (Support)')}
            </Box>

            {/* Occult Seal (Bottom) */}
            {renderSealPill(oracle.occult, 'Occult (Hidden Magic)')}
          </Box>
        </Box>

        {/* Wavespell & Castle Cycles */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ pb: 2.5, mb: 2.5, borderBottom: '1px solid #1E283D' }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Kin
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: colorMap[destinyKin.seal.color].text, lineHeight: 1 }}>
              {destinyKin.kinNumber}
            </Typography>
          </Box>

          <Box sx={{ pb: 2.5, mb: 2.5, borderBottom: '1px solid #1E283D' }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Wavespell Architecture
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <SealIcon seal={wavespellSeal} size={22} />
              <Typography variant="h6" sx={{ color: '#EDF1F7', fontFamily: '"Cinzel", serif' }}>
                {wavespellSeal.name} Wavespell
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
              You were born on <strong>Day {wavespellDay}</strong> of this 13-day transformative wave.
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Galactic Castle
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Box
                component="img"
                src={getCastleIconPath(castle)}
                alt={castle}
                onError={(e: any) => {
                  e.currentTarget.style.display = 'none';
                }}
                sx={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0 }}
              />
              <Typography variant="h6" sx={{ color: '#9BB8DE', fontFamily: '"Cinzel", serif' }}>
                {castle}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
              A 52-day evolutionary quadrant in the 260-day sacred spin.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Interpretations */}
      <Box sx={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #1E283D' }}>
        <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', pt: 3 }}>
          Galactic Interpretations
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
