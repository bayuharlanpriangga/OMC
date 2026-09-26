import React from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { BaseChartResult } from '../../../types/systems';
import { NumerologyCalculationResult } from '../../../systems/numerology/types';

interface NumerologyVisualizationProps {
  result: BaseChartResult<NumerologyCalculationResult>;
}

export const NumerologyVisualization: React.FC<NumerologyVisualizationProps> = ({ result }) => {
  const { data } = result;
  const { lifePathNumber, destinyNumber, soulUrgeNumber, personalityNumber, birthdayNumber, maturityNumber } = data;

  const coreCards = [
    { title: 'Life Path Number', num: lifePathNumber, desc: 'Central cosmic highway and evolutionary curriculum' },
    { title: 'Expression / Destiny', num: destinyNumber, desc: 'Acoustic nominal frequency and natural talents' },
    { title: 'Soul Urge / Heart', num: soulUrgeNumber, desc: 'Subconscious yearnings and spiritual longing' },
    { title: 'Personality Number', num: personalityNumber, desc: 'Outer demeanor and first impression frequency' },
    { title: 'Birthday Number', num: birthdayNumber, desc: 'Specific catalyst gift endowed on day of arrival' },
    { title: 'Maturity Number', num: maturityNumber, desc: 'Mid-life synthesis of Life Path and Destiny' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Primary Life Path Banner */}
      <Box sx={{ pb: 3, borderBottom: '1px solid #1E283D' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              backgroundColor: '#161E30',
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
              {lifePathNumber.value}
            </Typography>
            {lifePathNumber.isMasterNumber && (
              <Typography variant="caption" sx={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#FBBF24', textTransform: 'uppercase' }}>
                Master
              </Typography>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', fontWeight: 700 }}>
                {lifePathNumber.name}
              </Typography>
              {lifePathNumber.isMasterNumber && (
                <Chip label="Master Vibration" size="small" sx={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', color: '#FDE68A', border: '1px solid #D97706' }} />
              )}
            </Box>
            <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 1 }}>
              "{lifePathNumber.tagline}"
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {lifePathNumber.keywords.map((kw) => (
                <Chip key={kw} label={kw} size="small" sx={{ backgroundColor: '#131929', color: '#94A3B8' }} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Grid of Core Numbers */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        {coreCards.map((item, i) => {
          const row = Math.floor(i / 2);
          const col = i % 2;
          const isLastRow = row === Math.floor((coreCards.length - 1) / 2);
          return (
            <Box
              key={item.title}
              sx={{
                py: 2.5,
                pr: { xs: 0, sm: col === 0 ? 3 : 0 },
                pl: { xs: 0, sm: col === 1 ? 3 : 0 },
                borderBottom: { xs: i === coreCards.length - 1 ? 'none' : '1px solid #1E283D', sm: isLastRow ? 'none' : '1px solid #1E283D' },
                borderRight: { xs: 'none', sm: col === 0 ? '1px solid #1E283D' : 'none' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {item.title}
                </Typography>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: '#141C2E',
                    border: '1px solid #283755',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.num.isMasterNumber ? '#FBBF24' : '#E0C99A',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                >
                  {item.num.value}
                </Box>
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#EDF1F7', fontWeight: 600, mb: 0.5 }}>
                {item.num.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1.5 }}>
                {item.desc}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {item.num.keywords.slice(0, 3).map((kw) => (
                  <Chip key={kw} label={kw} size="small" sx={{ height: 18, fontSize: '0.65rem', backgroundColor: '#161F33', color: '#D4DCED' }} />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Calculation Derivation Proof */}
      <Box sx={{ pt: 3, borderTop: '1px solid #1E283D' }}>
        <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 1.5, fontFamily: '"Cinzel", serif' }}>
          Mathematical Derivation ({data.calculationMethod} Method)
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            '& > *:first-of-type': {
              borderBottom: { xs: '1px solid #1E283D', md: 'none' },
              borderRight: { xs: 'none', md: '1px solid #1E283D' },
              pb: { xs: 2, md: 0 },
              pr: { xs: 0, md: 3 },
            },
            '& > *:last-child': { pl: { xs: 0, md: 3 }, pt: { xs: 2, md: 0 } },
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
              Life Path Calculation
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {data.digitBreakdown.lifePathSteps.map((step, sIdx) => (
                <Typography key={sIdx} variant="caption" sx={{ color: '#D4DCED', fontFamily: '"JetBrains Mono", monospace' }}>
                  {step}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
              Expression Calculation
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {data.digitBreakdown.destinySteps.map((step, sIdx) => (
                <Typography key={sIdx} variant="caption" sx={{ color: '#D4DCED', fontFamily: '"JetBrains Mono", monospace' }}>
                  {step}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Interpretations */}
      <Box sx={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #1E283D' }}>
        <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', pt: 3 }}>
          Vibrational Interpretations
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
