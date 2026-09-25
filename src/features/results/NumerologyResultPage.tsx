import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { BookOpen } from 'lucide-react';
import { BaseChartResult } from '../../types/systems';
import { NumerologyCalculationResult } from '../../systems/numerology/types';
import { NumerologyVisualization } from '../generation/visualizations/NumerologyVisualization';
import { ResultHeaderBanner } from './ResultHeaderBanner';

interface NumerologyResultPageProps {
  result: BaseChartResult<NumerologyCalculationResult>;
  onBackToHome: () => void;
  onReconfigure: () => void;
  onCalculateOtherSystem: () => void;
  onNavigateToLibrary: () => void;
}

export const NumerologyResultPage: React.FC<NumerologyResultPageProps> = ({
  result,
  onBackToHome,
  onReconfigure,
  onCalculateOtherSystem,
  onNavigateToLibrary,
}) => {
  return (
    <Box className="system-result-page system-bg-numerology" sx={{ py: 4, position: 'relative' }}>
      {/* Dedicated Numerology Background Slot (Ready for PNG / WebP Custom Artwork) */}
      <Box className="system-backdrop-slot">
        <Box
          component="img"
          src="/backgrounds/numerology-bg.webp"
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
        {/* Subtle vibrational concentric circles */}
        <Box
          sx={{
            position: 'absolute',
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 700,
            borderRadius: '50%',
            border: '1px solid rgba(167, 139, 250, 0.03)',
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

        {/* Core Domain Numerical Matrix Visualization */}
        <NumerologyVisualization result={result} />

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
              Pelajari Lebih Lanjut di Library Numerologi
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Pelajari esensi getaran Angka Jalur Hidup (Life Path), Angka Master 11/22/33, dan Tahun Pribadi Anda.
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
            Buka Codex Numerologi
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
