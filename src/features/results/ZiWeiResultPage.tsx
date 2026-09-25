import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { BookOpen } from 'lucide-react';
import { BaseChartResult } from '../../types/systems';
import { ZiWeiCalculationResult } from '../../systems/zi-wei-dou-shu/types';
import { ZiWeiVisualization } from '../generation/visualizations/ZiWeiVisualization';
import { ResultHeaderBanner } from './ResultHeaderBanner';

interface ZiWeiResultPageProps {
  result: BaseChartResult<ZiWeiCalculationResult>;
  onBackToHome: () => void;
  onReconfigure: () => void;
  onCalculateOtherSystem: () => void;
  onNavigateToLibrary: () => void;
}

export const ZiWeiResultPage: React.FC<ZiWeiResultPageProps> = ({
  result,
  onBackToHome,
  onReconfigure,
  onCalculateOtherSystem,
  onNavigateToLibrary,
}) => {
  return (
    <Box className="system-result-page system-bg-zi-wei-dou-shu" sx={{ py: 4, position: 'relative' }}>
      {/* Dedicated Zi Wei Dou Shu Background Slot (Ready for PNG / WebP Custom Artwork) */}
      <Box className="system-backdrop-slot">
        <Box
          component="img"
          src="/backgrounds/zi-wei-bg.webp"
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
        {/* Subtle imperial star formation accent */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            width: 500,
            height: 500,
            border: '1px solid rgba(192, 132, 252, 0.03)',
            borderRadius: '50%',
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

        {/* Core Domain 12 Palaces Imperial Visualization */}
        <ZiWeiVisualization result={result} />

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
              Pelajari Lebih Lanjut di Library Zi Wei Dou Shu
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Pahami Istana Jiwa (Ming Gong), 14 Bintang Utama Kaisar Ungu, dan Transformasi Empat Si Hua (Lu, Quan, Ke, Ji).
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
            Buka Codex Zi Wei
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
