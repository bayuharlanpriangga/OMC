import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { X, Lock, Mail, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onAuthSuccess }) => {
  const [tabIndex, setTabIndex] = useState(0); // 0: Sign In, 1: Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(false);
  };

  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    setTabIndex(newTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Harap masukkan email dan kata sandi.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi harus minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      if (tabIndex === 0) {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setSuccessMsg('Berhasil masuk! Menyinkronkan profil...');
          setTimeout(() => {
            resetForm();
            onClose();
            if (onAuthSuccess) onAuthSuccess();
          }, 800);
        }
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || email.split('@')[0],
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setSuccessMsg('Pendaftaran berhasil! Anda telah masuk.');
          setTimeout(() => {
            resetForm();
            onClose();
            if (onAuthSuccess) onAuthSuccess();
          }, 900);
        } else if (data.user && !data.session) {
          setSuccessMsg('Akun berhasil dibuat! Silakan periksa email Anda untuk verifikasi jika konfirmasi diaktifkan, atau coba masuk.');
          setTabIndex(0);
        }
      }
    } catch (err: any) {
      console.error('Supabase Auth Error:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat otentikasi. Silakan periksa kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!loading) {
          resetForm();
          onClose();
        }
      }}
      maxWidth="xs"
      fullWidth
      aria-labelledby="auth-modal-title"
    >
      <DialogTitle
        id="auth-modal-title"
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
              width: 34,
              height: 34,
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
              {tabIndex === 0 ? 'Masuk ke Metaphysica' : 'Daftar Akun Baru'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Otentikasi Supabase &amp; Sinkronisasi Cloud
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={() => {
            resetForm();
            onClose();
          }}
          disabled={loading}
          size="small"
          sx={{ color: '#94A3B8' }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: '1px solid #1E2638', px: 3, pt: 1 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Masuk (Sign In)" sx={{ fontSize: '0.85rem' }} />
          <Tab label="Daftar (Sign Up)" sx={{ fontSize: '0.85rem' }} />
        </Tabs>
      </Box>

      <DialogContent sx={{ py: 3, px: 3 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5, backgroundColor: '#2B1214', color: '#FCA5A5', border: '1px solid #5C1D24' }}>
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2.5, backgroundColor: '#0D281E', color: '#6EE7B7', border: '1px solid #16533A' }}>
            {successMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tabIndex === 1 && (
              <TextField
                fullWidth
                size="small"
                label="Nama Lengkap"
                placeholder="Contoh: Elena Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={16} className="text-slate-400" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}

            <TextField
              fullWidth
              size="small"
              type="email"
              label="Alamat Email"
              placeholder="nama@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={16} className="text-slate-400" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              size="small"
              type={showPassword ? 'text' : 'password'}
              label="Kata Sandi"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={16} className="text-slate-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#94A3B8' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 1, py: 1.1, fontWeight: 700 }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: '#1A1408' }} />
              ) : tabIndex === 0 ? (
                'Masuk'
              ) : (
                'Buat Akun'
              )}
            </Button>
          </Box>
        </form>

        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', textAlign: 'center', mt: 2.5 }}>
          Terhubung secara langsung ke Cloud Database &amp; Auth Supabase.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
