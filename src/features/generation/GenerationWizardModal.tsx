import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Radio,
} from '@mui/material';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  Users,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { BirthProfile, CreateBirthProfileDto } from '../../types/birth-data';
import { AstrologyChartTypeId, GenerationConfig, SystemId, SystemValidationResult } from '../../types/systems';
import { METAPHYSICAL_SYSTEMS, SYSTEMS_LIST } from '../../systems/registry';
import { ASTROLOGY_CHART_TYPES } from '../../systems/astrology/registry';
import { GenerationOrchestrator } from '../../services/generation-orchestrator';
import { CreateBirthProfileWizard } from '../birth-data/CreateBirthProfileWizard';

interface GenerationWizardModalProps {
  open: boolean;
  onClose: () => void;
  profiles: BirthProfile[];
  initialSystemId?: SystemId;
  initialAstrologyChartTypeId?: AstrologyChartTypeId;
  initialStep?: number;
  initialSettings?: Record<string, any>;
  onSaveProfile: (dto: CreateBirthProfileDto, editingId?: string) => void;
  onOpenBirthDataManager: () => void;
  onExecuteGeneration: (config: GenerationConfig, profiles: BirthProfile[]) => void;
}

export const GenerationWizardModal: React.FC<GenerationWizardModalProps> = ({
  open,
  onClose,
  profiles,
  initialSystemId,
  initialAstrologyChartTypeId,
  initialStep = 0,
  initialSettings,
  onSaveProfile,
  onOpenBirthDataManager,
  onExecuteGeneration,
}) => {
  // Wizard Steps:
  // 0: Select Profile(s)
  // 1: Select System
  // 2: (Astrology only) Select Astrology Chart Type
  // 3: Configuration & Validation
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<SystemId>(initialSystemId || 'astrology');
  const [selectedAstrologyChartType, setSelectedAstrologyChartType] = useState<AstrologyChartTypeId>(
    initialAstrologyChartTypeId || 'natal'
  );
  const [systemSettings, setSystemSettings] = useState<Record<string, any>>(
    initialSettings || {
      houseSystem: 'placidus',
      zodiac: 'tropical',
      returnYear: new Date().getFullYear(),
    }
  );

  // Validation state
  const [validationResult, setValidationResult] = useState<SystemValidationResult>({ isValid: true });

  // Profile Edit modal within wizard
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<BirthProfile | null>(null);

  // Initialize selected profile if available
  useEffect(() => {
    if (profiles.length > 0 && selectedProfileIds.length === 0) {
      setSelectedProfileIds([profiles[0].id]);
    }
  }, [profiles]);

  useEffect(() => {
    if (initialSystemId) {
      setSelectedSystemId(initialSystemId);
    }
  }, [initialSystemId]);

  useEffect(() => {
    if (initialAstrologyChartTypeId) {
      setSelectedAstrologyChartType(initialAstrologyChartTypeId);
    }
  }, [initialAstrologyChartTypeId]);

  useEffect(() => {
    if (open) {
      setCurrentStep(initialStep);
      if (initialSettings) {
        setSystemSettings(initialSettings);
      }
    }
  }, [open, initialStep, initialSettings]);

  // Selected profiles objects
  const selectedProfiles = profiles.filter((p) => selectedProfileIds.includes(p.id));
  const primaryProfile = selectedProfiles[0];

  const toggleSelectProfile = (id: string) => {
    setSelectedProfileIds([id]);
  };

  // Re-run validation whenever system, chart type, or profiles change
  useEffect(() => {
    if (!primaryProfile) {
      setValidationResult({ isValid: false, message: 'Harap pilih profil lahir terlebih dahulu.' });
      return;
    }

    const config: GenerationConfig = {
      systemId: selectedSystemId,
      astrologyChartTypeId: selectedSystemId === 'astrology' ? selectedAstrologyChartType : undefined,
      selectedProfileIds,
      settings: systemSettings,
    };

    const val = GenerationOrchestrator.validate(config, selectedProfiles);
    setValidationResult(val);
  }, [selectedSystemId, selectedAstrologyChartType, selectedProfileIds, profiles, systemSettings]);

  const handleNextStep = () => {
    if (currentStep === 0) {
      if (selectedProfiles.length === 0) return;
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (selectedSystemId === 'astrology') {
        setCurrentStep(2); // Go to astrology chart types
      } else {
        setCurrentStep(3); // Skip directly to configuration & validation
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBackStep = () => {
    if (currentStep === 3) {
      if (selectedSystemId === 'astrology') {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  const handleExecuteGeneration = () => {
    if (!validationResult.isValid) return;

    const config: GenerationConfig = {
      systemId: selectedSystemId,
      astrologyChartTypeId: selectedSystemId === 'astrology' ? selectedAstrologyChartType : undefined,
      selectedProfileIds,
      settings: systemSettings,
    };

    onClose();
    onExecuteGeneration(config, selectedProfiles);
  };

  const handleEditPrimaryProfile = () => {
    if (primaryProfile) {
      setProfileToEdit(primaryProfile);
      setEditProfileModalOpen(true);
    }
  };

  const getStepLabels = () => {
    if (selectedSystemId === 'astrology') {
      return ['Pilih Profil', 'Pilih Sistem', 'Tipe Chart', 'Konfigurasi'];
    }
    return ['Pilih Profil', 'Pilih Sistem', 'Konfigurasi'];
  };

  const activeStepperIndex = () => {
    if (selectedSystemId === 'astrology') {
      return currentStep;
    }
    if (currentStep === 3) return 2;
    return currentStep;
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        aria-labelledby="generation-wizard-title"
        slotProps={{
          paper: {
            sx: {
              minHeight: '75vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#000000',
              border: '1px solid #1E1E1E',
            },
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          id="generation-wizard-title"
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1A1A1A',
            py: 2.2,
            px: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'rgba(224, 201, 154, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E0C99A',
              }}
            >
              <Sparkles size={18} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7', lineHeight: 1.1 }}>
                Generate Chart
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }} aria-label="Close dialog">
            <X size={18} />
          </IconButton>
        </DialogTitle>

        {/* Content Body */}
        <DialogContent sx={{ p: { xs: 2.5, md: 3.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Progress Stepper */}
          <Box sx={{ mb: 3.5 }}>
            <Stepper activeStep={activeStepperIndex()} alternativeLabel>
              {getStepLabels().map((label, idx) => (
                <Step key={label} completed={activeStepperIndex() > idx}>
                  <StepLabel
                    slotProps={{
                      stepIcon: {
                        sx: {
                          '&.Mui-active': { color: '#E0C99A' },
                          '&.Mui-completed': { color: '#34D399' },
                        },
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: activeStepperIndex() === idx ? 600 : 400,
                        color: activeStepperIndex() === idx ? '#E0C99A' : '#94A3B8',
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* ============================================================== */}
          {/* STEP 0: SELECT PROFILE                                         */}
          {/* ============================================================== */}
          {currentStep === 0 && (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7' }}>
                  1. Pilih Profil
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onOpenBirthDataManager}
                  startIcon={<Users size={16} />}
                  sx={{ borderColor: '#2E3952', color: '#E0C99A', whiteSpace: 'nowrap' }}
                >
                  Kelola
                </Button>
              </Box>

              {profiles.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    border: '1px dashed #2A364F',
                    borderRadius: 3,
                    backgroundColor: '#0F1320',
                    my: 'auto',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: '#EDF1F7', mb: 1, fontWeight: 600 }}>
                    Belum Ada Profil Lahir
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2.5 }}>
                    Anda perlu menambahkan setidaknya satu data lahir sebelum dapat mengkalkulasi chart.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setProfileToEdit(null);
                      setEditProfileModalOpen(true);
                    }}
                  >
                    + Buat Profil Lahir Baru
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  {profiles.map((p) => {
                    const isSelected = selectedProfileIds.includes(p.id);
                    return (
                      <Card
                        key={p.id}
                        onClick={() => toggleSelectProfile(p.id)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(224, 201, 154, 0.07)' : '#111624',
                          border: isSelected ? '1.5px solid #E0C99A' : '1px solid #1E283D',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#E0C99A',
                            backgroundColor: 'rgba(224, 201, 154, 0.04)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Radio checked={isSelected} sx={{ p: 0, color: '#4B5563', '&.Mui-checked': { color: '#E0C99A' } }} />
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#EDF1F7' }}>
                                {p.name}
                              </Typography>
                            </Box>
                            <Chip
                              label={p.relationship}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: isSelected ? 'rgba(224, 201, 154, 0.15)' : '#182033',
                                color: isSelected ? '#E0C99A' : '#94A3B8',
                              }}
                            />
                          </Box>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, fontSize: '0.8125rem', color: '#94A3B8', pl: 3.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Calendar size={14} className="text-amber-400" />
                              <span>{p.birthDate}</span>
                              <span className="text-slate-600">·</span>
                              <Clock size={14} className="text-amber-400" />
                              {p.isTimeUnknown ? (
                                <span style={{ color: '#F59E0B', fontWeight: 600 }}>Waktu Tidak Diketahui</span>
                              ) : (
                                <span>{p.birthTime || '12:00'}</span>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <MapPin size={14} className="text-emerald-400" />
                              <span>
                                {p.birthPlace}, {p.country} ({p.timezone})
                              </span>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}

          {/* ============================================================== */}
          {/* STEP 1: SELECT SYSTEM                                          */}
          {/* ============================================================== */}
          {currentStep === 1 && (
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7' }}>
                  2. Pilih Sistem Metafisika
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Pilih salah satu dari 6 tradisi sistem perhitungan matriks energi kosmik.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 2,
                }}
              >
                {SYSTEMS_LIST.map((sys) => {
                  const isSelected = selectedSystemId === sys.id;
                  return (
                    <Card
                      key={sys.id}
                      onClick={() => setSelectedSystemId(sys.id)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(224, 201, 154, 0.08)' : '#111624',
                        border: isSelected ? '1.5px solid #E0C99A' : '1px solid #1E283D',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        '&:hover': {
                          borderColor: '#E0C99A',
                          backgroundColor: 'rgba(224, 201, 154, 0.05)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              backgroundColor: isSelected ? 'rgba(224, 201, 154, 0.2)' : '#182033',
                              color: isSelected ? '#E0C99A' : '#94A3B8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Compass size={18} />
                          </Box>
                          <Chip
                            label={sys.origin}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              backgroundColor: '#182033',
                              color: '#94A3B8',
                            }}
                          />
                        </Box>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#EDF1F7', mb: 0.5 }}>
                          {sys.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#E0C99A', display: 'block', mb: 1, fontWeight: 500 }}>
                          {sys.tagline}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.4 }}>
                          {sys.description}
                        </Typography>
                      </CardContent>

                      {sys.requirements.requiresExactTime && (
                        <Box sx={{ px: 2.5, pb: 2, pt: 0 }}>
                          <Typography variant="caption" sx={{ color: '#F59E0B', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Clock size={12} /> Memerlukan waktu lahir pasti
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* ============================================================== */}
          {/* STEP 2: SELECT ASTROLOGY CHART TYPE                            */}
          {/* ============================================================== */}
          {currentStep === 2 && selectedSystemId === 'astrology' && (
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7' }}>
                  3. Pilih Tipe Chart Astrologi
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Astrologi mendukung berbagai tipe chart independen. Pilih perspektif perhitungan yang diinginkan.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                {Object.values(ASTROLOGY_CHART_TYPES).map((ct) => {
                  const isSelected = selectedAstrologyChartType === ct.id;
                  return (
                    <Card
                      key={ct.id}
                      onClick={() => setSelectedAstrologyChartType(ct.id)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(224, 201, 154, 0.08)' : '#111624',
                        border: isSelected ? '1.5px solid #E0C99A' : '1px solid #1E283D',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#E0C99A',
                          backgroundColor: 'rgba(224, 201, 154, 0.05)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#EDF1F7' }}>
                            {ct.name}
                          </Typography>
                          {isSelected && <CheckCircle2 size={18} className="text-amber-300" />}
                        </Box>
                        <Typography variant="caption" sx={{ color: '#E0C99A', display: 'block', mb: 1, fontWeight: 500 }}>
                          {ct.tagline}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8125rem', lineHeight: 1.4 }}>
                          {ct.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* ============================================================== */}
          {/* STEP 3: CONFIGURATION & SYSTEM VALIDATION                      */}
          {/* ============================================================== */}
          {currentStep === 3 && (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7' }}>
                  Konfigurasi &amp; Validasi Persyaratan
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Menyiapkan parameter kalkulasi untuk sistem{' '}
                  <strong style={{ color: '#E0C99A' }}>{METAPHYSICAL_SYSTEMS[selectedSystemId].name}</strong>
                  {selectedSystemId === 'astrology' && ` (${selectedAstrologyChartType.toUpperCase()} Chart)`}.
                </Typography>
              </Box>

              {/* Requirement Validation Alert */}
              {!validationResult.isValid && (
                <Alert
                  severity="error"
                  icon={<AlertTriangle size={20} />}
                  sx={{
                    backgroundColor: '#2B1214',
                    color: '#FCA5A5',
                    border: '1px solid #5C1D24',
                    '& .MuiAlert-message': { width: '100%' },
                  }}
                  action={
                    primaryProfile?.isTimeUnknown ? (
                      <Button
                        color="inherit"
                        size="small"
                        onClick={handleEditPrimaryProfile}
                        sx={{ textDecoration: 'underline', fontWeight: 700 }}
                      >
                        Edit Waktu Lahir
                      </Button>
                    ) : undefined
                  }
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {validationResult.title || 'Persyaratan Data Belum Terpenuhi'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                    {validationResult.message}
                  </Typography>
                </Alert>
              )}

              {validationResult.warningOnly && (
                <Alert
                  severity="warning"
                  icon={<AlertTriangle size={20} />}
                  sx={{
                    backgroundColor: '#2B1E08',
                    color: '#FDE68A',
                    border: '1px solid #66460C',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {validationResult.title || 'Catatan Akurasi Waktu'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                    {validationResult.message}
                  </Typography>
                </Alert>
              )}

              {/* Selected Profile Summary Box */}
              {primaryProfile && (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    backgroundColor: '#0F1320',
                    border: '1px solid #1E283D',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Profil Terpilih
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#EDF1F7' }}>
                      {primaryProfile.name} ({primaryProfile.relationship})
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {primaryProfile.birthDate} ·{' '}
                      {primaryProfile.isTimeUnknown ? 'Waktu Tidak Diketahui' : primaryProfile.birthTime} ·{' '}
                      {primaryProfile.birthPlace}, {primaryProfile.country}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleEditPrimaryProfile}
                    sx={{ borderColor: '#2E3952', color: '#94A3B8' }}
                  >
                    Ubah Data Profil
                  </Button>
                </Box>
              )}

              {/* System-Specific Form Fields */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  backgroundColor: '#0F1420',
                  border: '1px solid #1F283D',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#E0C99A' }}>
                  Parameter Kalkulasi Sistem
                </Typography>

                {selectedSystemId === 'astrology' && (
                  <>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: '#94A3B8' }}>Sistem Rumah (Houses)</InputLabel>
                        <Select
                          value={systemSettings.houseSystem || 'placidus'}
                          label="Sistem Rumah (Houses)"
                          onChange={(e) => setSystemSettings({ ...systemSettings, houseSystem: e.target.value })}
                        >
                          <MenuItem value="placidus">Placidus (Standar Barat)</MenuItem>
                          <MenuItem value="whole-sign">Whole Sign (Tradisi Kuno/Hellenistik)</MenuItem>
                          <MenuItem value="koch">Koch</MenuItem>
                          <MenuItem value="equal">Equal House</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: '#94A3B8' }}>Sistem Zodiak</InputLabel>
                        <Select
                          value={systemSettings.zodiac || 'tropical'}
                          label="Sistem Zodiak"
                          onChange={(e) => setSystemSettings({ ...systemSettings, zodiac: e.target.value })}
                        >
                          <MenuItem value="tropical">Tropis (Musiman / Western)</MenuItem>
                          <MenuItem value="sidereal">Sideris (Konstelasi / Veda)</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {selectedAstrologyChartType === 'solar-return' && (
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Tahun Solar Return"
                        value={systemSettings.returnYear || new Date().getFullYear()}
                        onChange={(e) => setSystemSettings({ ...systemSettings, returnYear: Number(e.target.value) })}
                      />
                    )}

                    {selectedAstrologyChartType === 'progressed' && (
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Target Tanggal Progresi"
                        value={systemSettings.targetDate || new Date().toISOString().slice(0, 10)}
                        onChange={(e) => setSystemSettings({ ...systemSettings, targetDate: e.target.value })}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    )}
                  </>
                )}

                {selectedSystemId === 'numerology' && (
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#94A3B8' }}>Tradisi Perhitungan</InputLabel>
                    <Select
                      value={systemSettings.method || 'pythagorean'}
                      label="Tradisi Perhitungan"
                      onChange={(e) => setSystemSettings({ ...systemSettings, method: e.target.value })}
                    >
                      <MenuItem value="pythagorean">Pythagorean (Standar Barat 1-9)</MenuItem>
                      <MenuItem value="chaldean">Chaldean (Tradisi Mistis Kuno 1-8)</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {selectedSystemId === 'human-design' && (
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Human Design Bodygraph dikalkulasikan menggunakan posisi Matahari 88 derajat busur sebelum kelahiran (Fase Desain Bawah Sadar) dan posisi saat kelahiran (Fase Kepribadian Sadar).
                  </Typography>
                )}

                {selectedSystemId === 'bazi' && (
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Empat Pilar Takdir dihitung berdasarkan penyesuaian Waktu Matahari Sejati (True Solar Time) untuk memastikan ketepatan Pilar Jam dan Pilar Hari.
                  </Typography>
                )}

                {selectedSystemId === 'zi-wei-dou-shu' && (
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    12 Istana dan Bintang Kaisar Ungu diplot menggunakan kalender lunar Tiongkok kuno dan Jam Kelahiran (Shichen).
                  </Typography>
                )}

                {selectedSystemId === 'tzolkin' && (
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Koreksi Tanggal Kalender Suci 260-Kin Dreamspell / Maya Tradisional diselaraskan dengan Koreksi GMT (584283).
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>

        {/* Footer Actions */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid #1E2638',
            justifyContent: 'space-between',
          }}
        >
          <Button onClick={onClose} sx={{ color: '#94A3B8' }}>
            Batal
          </Button>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {currentStep > 0 && (
              <Button
                onClick={handleBackStep}
                variant="outlined"
                startIcon={<ArrowLeft size={16} />}
                sx={{ borderColor: '#2E3952', color: '#94A3B8' }}
              >
                Kembali
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                onClick={handleNextStep}
                variant="contained"
                color="primary"
                disabled={selectedProfileIds.length === 0}
                endIcon={<ArrowRight size={16} />}
              >
                Lanjutkan
              </Button>
            ) : (
              <Button
                onClick={handleExecuteGeneration}
                variant="contained"
                color="primary"
                disabled={!validationResult.isValid}
                startIcon={<Sparkles size={16} />}
                sx={{ px: 3, fontWeight: 700 }}
              >
                Generate Chart
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Profile Edit/Create Sub-modal */}
      <CreateBirthProfileWizard
        open={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        onSave={(dto, id) => {
          onSaveProfile(dto, id);
          setEditProfileModalOpen(false);
        }}
        initialProfile={profileToEdit}
      />
    </>
  );
};
