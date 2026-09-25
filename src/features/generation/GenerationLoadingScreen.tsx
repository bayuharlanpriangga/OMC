import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { Compass, Sparkles } from 'lucide-react';
import { BirthProfile } from '../../types/birth-data';

interface GenerationLoadingScreenProps {
  systemName: string;
  chartTypeName?: string;
  profile?: BirthProfile;
}

const PHASES = [
  'Mengakses efemeris astronomis dan siklus temporal...',
  'Menghitung geometri koordinat dan sumbu bujur...',
  'Menerjemahkan polaritas dan konfigurasi aspek...',
  'Menyusun peta energi dan sintesis arketipe...',
  'Menyiapkan halaman hasil visualisasi...',
];

export const GenerationLoadingScreen: React.FC<GenerationLoadingScreenProps> = ({
  systemName,
  chartTypeName,
  profile,
}) => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        position: 'relative',
        overflow: 'hidden',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        {/* Floating directly on pure black background - NO wrapping card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 2,
          }}
        >
          {/* Animated Celestial Wheel Icon */}
          <Box
            sx={{
              position: 'relative',
              width: 96,
              height: 96,
              mb: 3.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress
              size={96}
              thickness={2.2}
              sx={{
                color: '#E0C99A',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#0A0A0A',
                border: '1.5px solid #282828',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E0C99A',
              }}
            >
              <Compass size={30} strokeWidth={1.8} className="animate-spin" style={{ animationDuration: '6s' }} />
            </Box>
          </Box>

          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              color: '#EDF1F7',
              letterSpacing: '0.04em',
              mb: 1.5,
              fontSize: { xs: '1.5rem', sm: '1.875rem' },
            }}
          >
            Menghitung Matriks {systemName}
          </Typography>

          {chartTypeName && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2.2,
                py: 0.6,
                borderRadius: 20,
                backgroundColor: 'rgba(224, 201, 154, 0.08)',
                border: '1px solid rgba(224, 201, 154, 0.25)',
                color: '#E0C99A',
                fontSize: '0.8125rem',
                fontWeight: 600,
                mb: 2.5,
              }}
            >
              <Sparkles size={14} />
              {chartTypeName}
            </Box>
          )}

          {/* Target Profile Note */}
          {profile && (
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3.5 }}>
              Untuk: <strong style={{ color: '#EDF1F7' }}>{profile.name}</strong> ({profile.relationship}) ·{' '}
              {profile.birthPlace}, {profile.country}
            </Typography>
          )}

          {/* Dynamic Loading Phase without boxed card */}
          <Box
            sx={{
              minHeight: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 3,
              py: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#A1A1AA',
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '0.015em',
                transition: 'opacity 0.2s ease',
              }}
            >
              {PHASES[phaseIndex]}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
