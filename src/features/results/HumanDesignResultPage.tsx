import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { BookOpen } from 'lucide-react';
import { BaseChartResult } from '../../types/systems';
import { HumanDesignCalculationResult } from '../../systems/human-design/types';
import { HumanDesignVisualization } from '../generation/visualizations/HumanDesignVisualization';
import { ResultHeaderBanner } from './ResultHeaderBanner';

interface HumanDesignResultPageProps {
  result: BaseChartResult<HumanDesignCalculationResult>;
  onBackToHome: () => void;
  onReconfigure: () => void;
  onCalculateOtherSystem: () => void;
  onNavigateToLibrary: () => void;
}

export const HumanDesignResultPage: React.FC<HumanDesignResultPageProps> = ({
  result,
  onBackToHome,
  onReconfigure,
  onCalculateOtherSystem,
  onNavigateToLibrary,
}) => {
  return (
    <Box className="system-result-page system-bg-human-design" sx={{ py: 4, position: 'relative' }}>
      {/* Dedicated Human Design Background Slot (Ready for PNG / WebP Custom Artwork) */}
      <Box className="system-backdrop-slot">
        <Box
          component="img"
          src="/backgrounds/human-design-bg.webp"
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
        {/* Subtle geometric grid matrix accent */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 500,
            height: 500,
            border: '1px solid rgba(56, 189, 248, 0.03)',
            borderRadius: '24px',
            transform: 'rotate(45deg)',
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

        {/* Core Domain Bodygraph Visualization */}
        <HumanDesignVisualization result={result} />

        {/* Bottom Educational Codex Link */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid #1E283D',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7' }}>
              Pelajari Lebih Lanjut di Library Human Design
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Pahami 9 Pusat Energi (Centers), Tipe Aura, Otoritas Batin, dan Strategi pengambilan keputusan Anda.
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
            Buka Codex Human Design
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
