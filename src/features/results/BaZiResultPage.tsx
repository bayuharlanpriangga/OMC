import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { BookOpen } from 'lucide-react';
import { BaseChartResult } from '../../types/systems';
import { BaZiCalculationResult } from '../../systems/bazi/types';
import { BaZiVisualization } from '../generation/visualizations/BaZiVisualization';
import { ResultHeaderBanner } from './ResultHeaderBanner';

interface BaZiResultPageProps {
  result: BaseChartResult<BaZiCalculationResult>;
  onBackToHome: () => void;
  onReconfigure: () => void;
  onCalculateOtherSystem: () => void;
  onNavigateToLibrary: () => void;
}

export const BaZiResultPage: React.FC<BaZiResultPageProps> = ({
  result,
  onBackToHome,
  onReconfigure,
  onCalculateOtherSystem,
  onNavigateToLibrary,
}) => {
  return (
    <Box className="system-result-page system-bg-bazi" sx={{ py: 4, position: 'relative' }}>
      {/* Dedicated BaZi Background Slot (Ready for PNG / WebP Custom Artwork) */}
      <Box className="system-backdrop-slot">
        <Box
          component="img"
          src="/backgrounds/bazi-bg.webp"
          alt=""
          onError={(e: any) => {
            e.currentTarget.style.display = 'none';
          }}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.15,
            display: 'block',
          }}
        />
        {/* Subtle Eastern elemental square matrix */}
        <Box
          sx={{
            position: 'absolute',
            top: 60,
            left: 40,
            width: 450,
            height: 450,
            border: '1px solid rgba(251, 146, 60, 0.03)',
            pointerEvents: 'none',
          }}
        />
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header & Profile Details */}
        <ResultHeaderBanner
          result={result}
          onBackToHome={onBackToHome}
          onReconfigure={onReconfigure}
          onCalculateOtherSystem={onCalculateOtherSystem}
        />

        {/* Core Domain Four Pillars Visualization */}
        <BaZiVisualization result={result} />

        {/* Bottom Educational Codex Link */}
        <Box
          sx={{
            mt: 6,
            p: 3,
            borderRadius: 3,
            backgroundColor: '#0E1320',
            border: '1px solid #1E2638',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7' }}>
              Pelajari Lebih Lanjut di Library BaZi
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Pelajari Empat Pilar Takdir (Four Pillars), 10 Batang Langit, 12 Cabang Bumi, dan Keseimbangan Lima Elemen (Wu Xing).
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={onNavigateToLibrary}
            startIcon={<BookOpen size={16} />}
            sx={{
              borderColor: '#E0C99A',
              color: '#E0C99A',
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: 'rgba(224, 201, 154, 0.08)' },
            }}
          >
            Buka Codex BaZi
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
