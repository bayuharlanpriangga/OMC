import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { X, Crown, Sparkles } from 'lucide-react';
import { BaseChartResult } from '../../../types/systems';
import { ZiWeiCalculationResult, ZiWeiPalace } from '../../../systems/zi-wei-dou-shu/types';

interface ZiWeiVisualizationProps {
  result: BaseChartResult<ZiWeiCalculationResult>;
}

export const ZiWeiVisualization: React.FC<ZiWeiVisualizationProps> = ({ result }) => {
  const { data } = result;
  const [inspectPalace, setInspectPalace] = useState<ZiWeiPalace | null>(null);

  const lifePalace = data.palaces.find((p) => p.isLifePalace) || data.palaces[0];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Overview Banner */}
      <Card sx={{ backgroundColor: '#0E1322', border: '1px solid #1F283D', p: 2.5 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#E0C99A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Imperial Chart Anchor
            </Typography>
            <Typography variant="h5" sx={{ color: '#EDF1F7', fontFamily: '"Cinzel", serif', mt: 0.5, fontWeight: 700 }}>
              Life Palace in Branch {data.lifePalaceBranch} · {data.elementBureau}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Body Palace: Branch {data.bodyPalaceBranch} · {data.lunarBirthDate}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {data.transformationsSummary.map((t, idx) => (
              <Chip
                key={idx}
                label={`${t.type.split(' ')[0]}: ${t.star}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(224, 201, 154, 0.1)',
                  color: '#E0C99A',
                  border: '1px solid rgba(224, 201, 154, 0.25)',
                }}
              />
            ))}
          </Box>
        </Box>
      </Card>

      {/* 12 Palaces Grid (3x4 or 4x3 responsive matrix) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography variant="subtitle2" sx={{ color: '#E0C99A', fontFamily: '"Cinzel", serif' }}>
          The 12 Imperial Palaces Matrix
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
          {data.palaces.map((palace) => {
            const isLife = palace.isLifePalace;

            return (
              <Card
                key={palace.index}
                onClick={() => setInspectPalace(palace)}
                sx={{
                  backgroundColor: isLife ? 'rgba(224, 201, 154, 0.08)' : '#0E1322',
                  border: isLife ? '1.5px solid #E0C99A' : '1px solid #1E283D',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  '&:hover': {
                    borderColor: '#E0C99A',
                    backgroundColor: '#111728',
                  },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: '"JetBrains Mono", monospace' }}>
                        {palace.heavenlyStem} {palace.earthlyBranch}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: isLife ? '#E0C99A' : '#EDF1F7', fontWeight: 700 }}>
                        {palace.name} {isLife && '👑'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontFamily: '"Cinzel", serif' }}>
                      {palace.chinese}
                    </Typography>
                  </Box>

                  {/* Major Stars list */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1.5 }}>
                    {palace.majorStars.map((star) => (
                      <Box key={star.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#D4DCED', fontWeight: 600 }}>
                          {star.name.split('(')[0]}
                        </Typography>
                        <Chip
                          label={star.brightness.split(' ')[0]}
                          size="small"
                          sx={{ height: 16, fontSize: '0.62rem', backgroundColor: '#1A2338', color: '#E0C99A' }}
                        />
                      </Box>
                    ))}
                    {palace.majorStars.length === 0 && (
                      <Typography variant="caption" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                        Empty Palace (Borrow opposite)
                      </Typography>
                    )}
                  </Box>

                  {/* Transformation chip if any */}
                  {palace.majorStars.some((s) => s.transformation) && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={palace.majorStars.find((s) => s.transformation)?.transformation?.split(' ')[0]}
                        size="small"
                        color="secondary"
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>

      {/* Palace Inspection Dialog */}
      {inspectPalace && (
        <Dialog open={Boolean(inspectPalace)} onClose={() => setInspectPalace(null)} maxWidth="sm" fullWidth>
          <DialogTitle component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E2638' }}>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7' }}>
                {inspectPalace.name} ({inspectPalace.chinese})
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Pillar: {inspectPalace.heavenlyStem} {inspectPalace.earthlyBranch} {inspectPalace.isLifePalace ? '· Life Palace' : ''}
              </Typography>
            </Box>
            <IconButton onClick={() => setInspectPalace(null)} size="small" sx={{ color: '#94A3B8' }}>
              <X size={18} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ py: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 1 }}>
              Major Imperial Stars
            </Typography>
            {inspectPalace.majorStars.map((star) => (
              <Box key={star.name} sx={{ p: 1.5, mb: 1, borderRadius: 2, backgroundColor: '#0B0F1B', border: '1px solid #1E283D' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>
                    {star.name} ({star.chinese})
                  </Typography>
                  <Chip label={star.brightness} size="small" sx={{ color: '#E0C99A' }} />
                </Box>
                {star.transformation && (
                  <Chip label={`Four Transformations: ${star.transformation}`} size="small" color="secondary" sx={{ mt: 1 }} />
                )}
              </Box>
            ))}

            <Typography variant="subtitle2" sx={{ color: '#9BB8DE', mt: 2, mb: 1 }}>
              Auxiliary &amp; Assistant Stars
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {inspectPalace.minorStars.map((ms) => (
                <Chip key={ms} label={ms} size="small" sx={{ backgroundColor: '#131929', color: '#D4DCED' }} />
              ))}
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Interpretations */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7' }}>
          Imperial Palace Interpretations
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
