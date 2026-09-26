import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';
import { BaseChartResult } from '../../../types/systems';
import { BaZiCalculationResult, BaZiPillar, WuXingElement } from '../../../systems/bazi/types';

interface BaZiVisualizationProps {
  result: BaseChartResult<BaZiCalculationResult>;
}

export const BaZiVisualization: React.FC<BaZiVisualizationProps> = ({ result }) => {
  const { data } = result;
  const { pillars, dayMaster, dayMasterStrength, elementPercentages, favorableElements, unfavorableElements, hasHourPillar } = data;

  const elementTheme: Record<WuXingElement, { color: string; bg: string; border: string }> = {
    Wood: { color: '#86EFAC', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)' },
    Fire: { color: '#FCA5A5', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)' },
    Earth: { color: '#FDE68A', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.3)' },
    Metal: { color: '#CBD5E1', bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.3)' },
    Water: { color: '#93C5FD', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)' },
  };

  const renderPillarCard = (pillar: BaZiPillar, isDayMasterPillar = false) => {
    if (pillar.isUnknown) {
      return (
        <Box sx={{ textAlign: 'center', pt: 2 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase' }}>
            {pillar.title}
          </Typography>
          <Box sx={{ py: 4 }}>
            <Typography variant="body2" sx={{ color: '#FBBF24', fontStyle: 'italic' }}>
              Birth Time Unknown
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
              Hour pillar requires precise time
            </Typography>
          </Box>
        </Box>
      );
    }

    const stem = pillar.heavenlyStem!;
    const branch = pillar.earthlyBranch!;
    const stemStyle = elementTheme[stem.element];
    const branchStyle = elementTheme[branch.element];

    return (
      <Box
        sx={{
          textAlign: 'center',
          pt: 2,
          borderTop: isDayMasterPillar ? '2px solid #E0C99A' : '2px solid transparent',
        }}
      >
        <Typography variant="caption" sx={{ color: isDayMasterPillar ? '#E0C99A' : '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
          {pillar.title} {isDayMasterPillar ? '(Self)' : ''}
        </Typography>

        {/* Heavenly Stem */}
        <Box sx={{ my: 1.5, p: 1.5, borderRadius: 2, backgroundColor: stemStyle.bg, border: `1px solid ${stemStyle.border}` }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
            {stem.tenGod}
          </Typography>
          <Typography variant="h3" sx={{ color: stemStyle.color, fontFamily: '"Cinzel", serif', my: 0.5, fontWeight: 700 }}>
            {stem.chinese}
          </Typography>
          <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>
            {stem.name} ({stem.yinYang} {stem.element})
          </Typography>
        </Box>

        {/* Earthly Branch */}
        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: branchStyle.bg, border: `1px solid ${branchStyle.border}` }}>
          <Typography variant="h3" sx={{ color: branchStyle.color, fontFamily: '"Cinzel", serif', my: 0.5, fontWeight: 700 }}>
            {branch.chinese}
          </Typography>
          <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>
            {branch.name} ({branch.zodiacAnimal})
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
            {branch.element} Branch
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Day Master Highlight Banner */}
      <Box sx={{ pb: 3, borderBottom: '1px solid #1E283D' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#E0C99A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Day Master Sovereign Spirit (Ri Zhu)
            </Typography>
            <Typography variant="h5" sx={{ color: '#EDF1F7', fontFamily: '"Cinzel", serif', mt: 0.5, fontWeight: 700 }}>
              {dayMaster.name} ({dayMaster.chinese}) — {dayMaster.yinYang} {dayMaster.element}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.3 }}>
              Elemental Constitution: <strong className="text-amber-300">{dayMasterStrength}</strong> Day Master
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <Box sx={{ pl: 0, pr: 2.5, borderRight: '1px solid #1E283D' }}>
              <Typography variant="caption" sx={{ color: '#34D399', display: 'block', fontWeight: 600 }}>
                Favorable Elements
              </Typography>
              <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>
                {favorableElements.join(', ')}
              </Typography>
            </Box>
            <Box sx={{ pl: 2.5, pr: 0 }}>
              <Typography variant="caption" sx={{ color: '#F87171', display: 'block', fontWeight: 600 }}>
                Unfavorable Elements
              </Typography>
              <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>
                {unfavorableElements.join(', ')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* The Four Pillars Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
          '& > *': {
            borderBottom: { xs: '1px solid #1E283D', sm: 'none' },
            borderRight: { xs: 'none', sm: '1px solid #1E283D' },
            pb: { xs: 2, sm: 0 },
            px: { xs: 0, sm: 2 },
          },
          '& > *:first-of-type': { pl: 0 },
          '& > *:last-child': { borderBottom: 'none', borderRight: 'none', pr: 0 },
        }}
      >
        {renderPillarCard(pillars.year)}
        {renderPillarCard(pillars.month)}
        {renderPillarCard(pillars.day, true)}
        {renderPillarCard(pillars.hour)}
      </Box>

      {/* Five Elements Distribution */}
      <Box sx={{ pt: 3, borderTop: '1px solid #1E283D' }}>
        <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 2, fontFamily: '"Cinzel", serif' }}>
          Five Elements (Wu Xing) Balance
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as WuXingElement[]).map((elem) => {
            const pct = elementPercentages[elem];
            const theme = elementTheme[elem];
            return (
              <Box key={elem}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: theme.color, fontWeight: 600 }}>
                    {elem} Element
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontFamily: '"JetBrains Mono", monospace' }}>
                    {pct}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#161D2B',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.color,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Interpretations */}
      <Box sx={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #1E283D' }}>
        <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', pt: 3 }}>
          Classical BaZi Readings
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
