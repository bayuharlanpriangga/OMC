import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { BookOpen } from 'lucide-react';
import { BaseChartResult } from '../../types/systems';
import { AstrologyCalculationResult } from '../../systems/astrology/types';
import { AstrologyVisualization } from '../generation/visualizations/AstrologyVisualization';
import { ResultHeaderBanner } from './ResultHeaderBanner';

interface AstrologyResultPageProps {
  result: BaseChartResult<AstrologyCalculationResult>;
  onBackToHome: () => void;
  onReconfigure: () => void;
  onCalculateOtherSystem: () => void;
  onNavigateToLibrary: () => void;
}

export const AstrologyResultPage: React.FC<AstrologyResultPageProps> = ({
  result,
  onBackToHome,
  onReconfigure,
  onCalculateOtherSystem,
  onNavigateToLibrary,
}) => {
  return (
    <Box className="system-result-page system-bg-astrology" sx={{ py: 4, position: 'relative' }}>
      {/* Dedicated Astrology Background Slot (Ready for PNG / WebP Custom Artwork) */}
      <Box className="system-backdrop-slot">
        <Box
          component="img"
          src="/backgrounds/astrology-bg.webp"
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
        {/* Subtle celestial astrolabe watermark */}
        <Box
          sx={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 600,
            height: 600,
            borderRadius: '50%',
            border: '1px solid rgba(224, 201, 154, 0.04)',
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

        {/* Core Domain Visualization */}
        <AstrologyVisualization result={result} />

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
              Pelajari Lebih Lanjut di Library Astrologi
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Pahami arti rumah (houses), planet tanda zodiak, dan interaksi aspek kosmik secara mendalam.
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
            Buka Codex Astrologi
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
