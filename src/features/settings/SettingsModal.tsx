import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { X, Settings as SettingsIcon, Sliders, Database, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onResetProfiles: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  onResetProfiles,
}) => {
  const [defaultZodiac, setDefaultZodiac] = useState('tropical');
  const [defaultHouse, setDefaultHouse] = useState('placidus');
  const [highPrecision, setHighPrecision] = useState(true);
  const [animateDiagrams, setAnimateDiagrams] = useState(true);

  const handleResetData = () => {
    if (window.confirm('Reset all birth data back to initial seed state? Any customized profiles will be reset.')) {
      onResetProfiles();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1E2638',
          py: 2,
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
            <SettingsIcon size={18} />
          </Box>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7', lineHeight: 1.1 }}>
              Platform Settings
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Ephemeris computation defaults and preferences
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3, px: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Defaults section */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Sliders size={16} /> Calculation Defaults
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: '#94A3B8' }}>Default Zodiac Coordinate System</InputLabel>
                <Select
                  value={defaultZodiac}
                  label="Default Zodiac Coordinate System"
                  onChange={(e) => setDefaultZodiac(e.target.value)}
                >
                  <MenuItem value="tropical">Tropical (Western / Vernal Equinox Point)</MenuItem>
                  <MenuItem value="sidereal">Sidereal (Lahiri / Fixed Constellations)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: '#94A3B8' }}>Default Astrological House System</InputLabel>
                <Select
                  value={defaultHouse}
                  label="Default Astrological House System"
                  onChange={(e) => setDefaultHouse(e.target.value)}
                >
                  <MenuItem value="placidus">Placidus (Time Proportional)</MenuItem>
                  <MenuItem value="whole-sign">Whole Sign (Equal Sign Boundary)</MenuItem>
                  <MenuItem value="koch">Koch (GOH Birthplace Houses)</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={highPrecision}
                    onChange={(e) => setHighPrecision(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#E0C99A',
                        '& + .MuiSwitch-track': { backgroundColor: '#E0C99A' },
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>High-Precision Julian Day Ephemeris</Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>Compute minute-level true solar anomaly and astronomical offsets</Typography>
                  </Box>
                }
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#1F293D' }} />

          {/* Data Management */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#9BB8DE', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Database size={16} /> Data Profil Lahir
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
              Profil lahir Anda tersimpan secara lokal dan otomatis disinkronkan ke Supabase Database saat Anda masuk.
            </Typography>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleResetData}
              startIcon={<RotateCcw size={16} />}
              sx={{ borderColor: '#5C1D24', color: '#FCA5A5' }}
            >
              Hapus Data Profil Lokal
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #1E2638' }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};
