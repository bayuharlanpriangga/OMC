import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
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
        <Card sx={{ backgroundColor: '#0B0F1B', border: '1px dashed #2A364F', textAlign: 'center', p: 2 }}>
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
        </Card>
      );
    }

    const stem = pillar.heavenlyStem!;
    const branch = pillar.earthlyBranch!;
    const stemStyle = elementTheme[stem.element];
    const branchStyle = elementTheme[branch.element];

    return (
      <Card
        sx={{
          backgroundColor: isDayMasterPillar ? 'rgba(224, 201, 154, 0.05)' : '#0E1322',
          border: isDayMasterPillar ? '1.5px solid #E0C99A' : '1px solid #1E283D',
          textAlign: 'center',
          p: 2,
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
      </Card>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Day Master Highlight Banner */}
      <Card sx={{ backgroundColor: '#0E1322', border: '1px solid #1F283D', p: 2.5 }}>
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

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ p: 1.2, px: 2, borderRadius: 2, backgroundColor: '#131929', border: '1px solid #24304A' }}>
              <Typography variant="caption" sx={{ color: '#34D399', display: 'block', fontWeight: 600 }}>
                Favorable Elements
              </Typography>
              <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>
                {favorableElements.join(', ')}
              </Typography>
            </Box>
            <Box sx={{ p: 1.2, px: 2, borderRadius: 2, backgroundColor: '#131929', border: '1px solid #24304A' }}>
              <Typography variant="caption" sx={{ color: '#F87171', display: 'block', fontWeight: 600 }}>
                Unfavorable Elements
              </Typography>
              <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>
                {unfavorableElements.join(', ')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* The Four Pillars Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {renderPillarCard(pillars.year)}
        {renderPillarCard(pillars.month)}
        {renderPillarCard(pillars.day, true)}
        {renderPillarCard(pillars.hour)}
      </Box>

      {/* Five Elements Distribution */}
      <Card sx={{ backgroundColor: '#0D111D', border: '1px solid #1E283D', p: 3 }}>
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
      </Card>

      {/* Interpretations */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7' }}>
          Classical BaZi Readings
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
