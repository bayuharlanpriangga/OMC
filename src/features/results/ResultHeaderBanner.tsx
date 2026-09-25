import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { ArrowLeft, Sliders, Sparkles, Printer, Calendar, Clock, MapPin, Globe } from 'lucide-react';
import { BaseChartResult } from '../../types/systems';

interface ResultHeaderBannerProps {
  result: BaseChartResult;
  onBackToHome: () => void;
  onReconfigure: () => void;
  onCalculateOtherSystem: () => void;
}

export const ResultHeaderBanner: React.FC<ResultHeaderBannerProps> = ({
  result,
  onBackToHome,
  onReconfigure,
  onCalculateOtherSystem,
}) => {
  const profile = result.profiles[0];

  return (
    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Top Action & Navigation Row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button
          onClick={onBackToHome}
          startIcon={<ArrowLeft size={16} />}
          sx={{
            color: '#94A3B8',
            fontSize: '0.875rem',
            '&:hover': { color: '#EDF1F7', backgroundColor: 'rgba(224, 201, 154, 0.08)' },
          }}
        >
          Kembali ke Beranda
        </Button>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onReconfigure}
            startIcon={<Sliders size={15} />}
            sx={{
              borderColor: '#2E3952',
              color: '#EDF1F7',
              borderRadius: 20,
              fontSize: '0.8rem',
              '&:hover': { borderColor: '#E0C99A', backgroundColor: 'rgba(224, 201, 154, 0.05)' },
            }}
          >
            Ubah Parameter
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={onCalculateOtherSystem}
            startIcon={<Sparkles size={15} />}
            sx={{
              borderColor: '#2E3952',
              color: '#E0C99A',
              borderRadius: 20,
              fontSize: '0.8rem',
              '&:hover': { borderColor: '#E0C99A', backgroundColor: 'rgba(224, 201, 154, 0.08)' },
            }}
          >
            Sistem Lain
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => window.print()}
            startIcon={<Printer size={15} />}
            sx={{
              borderColor: '#2E3952',
              color: '#94A3B8',
              borderRadius: 20,
              fontSize: '0.8rem',
              '&:hover': { color: '#EDF1F7', borderColor: '#3E4C6E' },
            }}
          >
            Cetak / Simpan
          </Button>
        </Box>
      </Box>

      {/* Main Title & Profile Metadata Card */}
      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          backgroundColor: '#080808',
          border: '1px solid #1C1C1C',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2.5,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '1.875rem' },
                color: '#EDF1F7',
                letterSpacing: '0.04em',
              }}
            >
              {result.systemName}
            </Typography>

            {result.chartTypeName && (
              <Chip
                label={result.chartTypeName}
                size="small"
                sx={{
                  backgroundColor: 'rgba(224, 201, 154, 0.12)',
                  color: '#E0C99A',
                  border: '1px solid rgba(224, 201, 154, 0.3)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Box>

          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Kalkulasi matriks kosmik dan arketipe metafisik berdasarkan data astronomis &amp; tradisi klasik.
          </Typography>
        </Box>

        {/* Profile Card */}
        {profile && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              backgroundColor: '#000000',
              border: '1px solid #222222',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              minWidth: { xs: '100%', md: 300 },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#EDF1F7' }}>
                {profile.name}
              </Typography>
              <Chip
                label={profile.relationship}
                size="small"
                sx={{ height: 20, fontSize: '0.65rem', backgroundColor: '#182033', color: '#CBD5E1' }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, fontSize: '0.75rem', color: '#94A3B8' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                <Calendar size={13} className="text-amber-400" />
                <span>{profile.birthDate}</span>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                <Clock size={13} className="text-amber-400" />
                {profile.isTimeUnknown ? (
                  <span style={{ color: '#F59E0B', fontWeight: 600 }}>Waktu Tidak Diketahui</span>
                ) : (
                  <span>{profile.birthTime || '12:00'}</span>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, fontSize: '0.75rem', color: '#94A3B8' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                <MapPin size={13} className="text-emerald-400" />
                <span>{profile.birthPlace}, {profile.country}</span>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                <Globe size={13} className="text-slate-400" />
                <span>{profile.timezone}</span>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
