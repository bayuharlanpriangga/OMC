import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Compass,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { BirthProfile } from '../../types/birth-data';
import { SystemId } from '../../types/systems';
import { SYSTEMS_LIST } from '../../systems/registry';
import { CelestialMachineAnimation } from './CelestialMachineAnimation';

interface HomePageProps {
  profiles: BirthProfile[];
  onStartCalculation: (systemId?: SystemId) => void;
  onNavigateToLibrary: (systemId?: SystemId) => void;
  onOpenBirthData: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  profiles,
  onStartCalculation,
  onNavigateToLibrary,
  onOpenBirthData,
}) => {
  const activeProfile = profiles[0];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#000000' }}>
      {/* ============================================================== */}
      {/* HERO SECTION (LEFT-ALIGNED, NO GRADIENTS, SOPHISTICATED COSMIC) */}
      {/* ============================================================== */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#000000',
          borderBottom: '1px solid #1A1A1A',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 14 },
        }}
      >
        {/* Animated Sacred Metrological Machine:
            1. Rotating Outer Ring with 12 Astrology Planets
            2. Rotating Inner Ring with Numerology Numbers (Counter-clockwise)
            3. Centered Human Design Bodygraph with Sequentially Activating Connecting Channels
        */}
        <CelestialMachineAnimation />

        {/* Real HTML/React Hero Content (Strictly Left-Aligned) */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: { xs: '100%', md: 780 } }}>
            {/* Overline Badge */}
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <Chip
                label="SACRED METROLOGY &amp; BIO-ENERGETIC ARCHITECTURE"
                size="small"
                sx={{
                  backgroundColor: 'rgba(224, 201, 154, 0.08)',
                  color: '#E0C99A',
                  border: '1px solid rgba(224, 201, 154, 0.25)',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  px: 0.5,
                }}
              />
            </Box>

            {/* Hero Heading */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3.4rem', md: '4.2rem' },
                color: '#EDF1F7',
                mb: 2.5,
                fontFamily: '"Cinzel", serif',
                fontWeight: 600,
                letterSpacing: '0.015em',
                lineHeight: 1.1,
              }}
            >
              Decode the Multidimensional Blueprint of Consciousness
            </Typography>

            {/* Restrained Subtitle */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                color: '#9CA3AF',
                lineHeight: 1.65,
                mb: 4,
                maxWidth: 680,
              }}
            >
              Metaphysica unifies the world's six core metaphysical systems—Astrology,
              Human Design, Numerology, BaZi, Zi Wei Dou Shu, and Tzolkin—within an
              architecturally isolated, high-precision calculation framework.
            </Typography>

            {/* Hero CTAs */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 5 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => onStartCalculation()}
                startIcon={<Sparkles size={18} />}
                sx={{
                  px: 3.5,
                  py: 1.4,
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  borderRadius: 24,
                }}
              >
                Calculate Chart
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => onNavigateToLibrary()}
                startIcon={<BookOpen size={18} />}
                sx={{
                  px: 3,
                  py: 1.35,
                  fontSize: '0.9375rem',
                  borderColor: '#262626',
                  color: '#EDF1F7',
                  borderRadius: 24,
                  '&:hover': {
                    borderColor: '#E0C99A',
                    backgroundColor: 'rgba(224, 201, 154, 0.05)',
                  },
                }}
              >
                Explore Library
              </Button>
            </Box>

            {/* Quick Profile State Indicator */}
            {activeProfile ? (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.2,
                  px: 2,
                  borderRadius: 3,
                  backgroundColor: '#080808',
                  border: '1px solid #1E1E1E',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#34D399',
                  }}
                />
                <Typography variant="body2" sx={{ color: '#D4DCED', fontSize: '0.8125rem' }}>
                  Siap kalkulasi untuk: <strong>{activeProfile.name}</strong> ({activeProfile.relationship}) ·{' '}
                  <span className="text-zinc-400">{activeProfile.birthPlace}, {activeProfile.country}</span>
                </Typography>
                <Button
                  size="small"
                  onClick={onOpenBirthData}
                  sx={{ color: '#E0C99A', fontSize: '0.75rem', minWidth: 0, p: 0, ml: 1, textDecoration: 'underline' }}
                >
                  Kelola Profil
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.2,
                  px: 2,
                  borderRadius: 3,
                  backgroundColor: '#080808',
                  border: '1px solid #1E1E1E',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#E0C99A',
                  }}
                />
                <Typography variant="body2" sx={{ color: '#D4DCED', fontSize: '0.8125rem' }}>
                  Belum ada profil lahir yang tersimpan.
                </Typography>
                <Button
                  size="small"
                  onClick={onOpenBirthData}
                  sx={{ color: '#E0C99A', fontSize: '0.75rem', minWidth: 0, p: 0, ml: 1, textDecoration: 'underline' }}
                >
                  + Tambah Profil
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* SECTION: THE SIX TOP-LEVEL SYSTEMS DISCOVERY MATRIX           */}
      {/* ============================================================== */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#000000', borderBottom: '1px solid #1A1A1A' }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#E0C99A' }}>
              System Registry
            </Typography>
            <Typography variant="h3" sx={{ color: '#EDF1F7', fontFamily: '"Cinzel", serif', mt: 0.5 }}>
              Six Sovereign Metaphysical Disciplines
            </Typography>
            <Typography variant="body1" sx={{ color: '#9CA3AF', mt: 1, maxWidth: 700 }}>
              Each discipline operates with independent mathematical calculators, strict domain isolation, and unique visualization architectures.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
            {SYSTEMS_LIST.map((system) => {
              return (
                <Card
                  key={system.id}
                  sx={{
                    backgroundColor: '#080808',
                    border: '1px solid #1C1C1C',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.2s ease, transform 0.2s ease',
                    '&:hover': {
                      borderColor: '#E0C99A',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          backgroundColor: '#121212',
                          border: '1px solid #222222',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#E0C99A',
                        }}
                      >
                        <Compass size={22} />
                      </Box>
                      <Chip
                        label={system.requirements.requiresExactTime ? 'Requires Time' : 'Time Flexible'}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.68rem',
                          backgroundColor: system.requirements.requiresExactTime ? 'rgba(251, 191, 36, 0.1)' : 'rgba(52, 211, 153, 0.1)',
                          color: system.requirements.requiresExactTime ? '#FDE68A' : '#6EE7B7',
                        }}
                      />
                    </Box>

                    <Typography variant="h5" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', mb: 0.5, fontWeight: 700 }}>
                      {system.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#E0C99A', fontWeight: 600, display: 'block', mb: 1.5 }}>
                      {system.category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2, minHeight: 48 }}>
                      {system.description}
                    </Typography>

                    <Typography variant="caption" sx={{ color: '#71717A', display: 'block', mb: 3 }}>
                      Tradition: {system.origin}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, pt: 2, borderTop: '1px solid #1A1A1A' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        fullWidth
                        onClick={() => onStartCalculation(system.id)}
                        endIcon={<ArrowRight size={14} />}
                      >
                        Calculate
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onNavigateToLibrary(system.id)}
                        sx={{ borderColor: '#222222', color: '#9CA3AF', minWidth: 80 }}
                      >
                        Learn
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* SECTION: ARCHITECTURAL RIGOR & DATA INTEGRITY                 */}
      {/* ============================================================== */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#000000', borderBottom: '1px solid #1A1A1A' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            <Box>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#111111', color: '#E0C99A', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, border: '1px solid #222222' }}>
                <Clock size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', mb: 1 }}>
                Strict Unknown Birth Time Rule
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', lineHeight: 1.6 }}>
                Unknown birth time is explicitly preserved as null, never normalized to midnight (00:00). Systems that require minute-level rotational angles refuse execution honestly rather than fabricating inaccurate charts.
              </Typography>
            </Box>

            <Box>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#111111', color: '#9BB8DE', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, border: '1px solid #222222' }}>
                <Cpu size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', mb: 1 }}>
                Isolated Domain Engines
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', lineHeight: 1.6 }}>
                Each metaphysical system is isolated with dedicated calculation math and result mappers. Domain calculations remain completely pure TypeScript, independent from React or MUI presentation components.
              </Typography>
            </Box>

            <Box>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#111111', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, border: '1px solid #222222' }}>
                <ShieldCheck size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', mb: 1 }}>
                Unified Profile Ownership
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', lineHeight: 1.6 }}>
                Birth data is system-agnostic and managed centrally via the Profile menu. One birth profile feeds Astrology, Human Design, BaZi, Zi Wei Dou Shu, Numerology, and Tzolkin without duplicated entry.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, backgroundColor: '#000000', borderTop: '1px solid #141414', mt: 'auto' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ color: '#71717A' }}>
              © {new Date().getFullYear()} Metaphysica Platform. High-precision metaphysical computation &amp; sacred geometry.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography
                variant="caption"
                onClick={() => onNavigateToLibrary()}
                sx={{ color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#E0C99A' } }}
              >
                Educational Library
              </Typography>
              <Typography
                variant="caption"
                onClick={onOpenBirthData}
                sx={{ color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#E0C99A' } }}
              >
                Birth Profiles
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
