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
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { X, KeyRound } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  userEmail: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
  userEmail,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetAndClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok.');
      return;
    }
    if (newPassword === oldPassword) {
      setError('Password baru harus berbeda dari password lama.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: verify identity by re-authenticating with the old password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: oldPassword,
      });

      if (verifyError) {
        setError('Password lama salah. Silakan coba lagi.');
        setLoading(false);
        return;
      }

      // Step 2: identity confirmed, apply the new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message || 'Gagal mengubah password. Silakan coba lagi.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('Terjadi kesalahan tak terduga. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : resetAndClose}
      maxWidth="xs"
      fullWidth
      sx={{ '& .MuiDialog-paper': { backgroundColor: '#0A0A0A', border: '1px solid #1E1E1E' } }}
    >
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
            <KeyRound size={18} />
          </Box>
          <Typography variant="h6" component="div" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7', lineHeight: 1.1 }}>
            Ubah Password
          </Typography>
        </Box>
        <IconButton onClick={resetAndClose} size="small" sx={{ color: '#94A3B8' }} disabled={loading}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3, px: 3 }}>
        {success ? (
          <Alert severity="success" sx={{ backgroundColor: 'rgba(52, 211, 153, 0.08)', color: '#6EE7B7', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
            Password berhasil diubah.
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Masukkan password lama sebagai konfirmasi identitas, lalu tentukan password baru.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ backgroundColor: 'rgba(248, 113, 113, 0.08)', color: '#FCA5A5', border: '1px solid rgba(248, 113, 113, 0.25)' }}>
                {error}
              </Alert>
            )}

            <TextField
              type="password"
              label="Password Lama"
              size="small"
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={loading}
            />
            <TextField
              type="password"
              label="Password Baru"
              size="small"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              helperText="Minimal 6 karakter"
            />
            <TextField
              type="password"
              label="Konfirmasi Password Baru"
              size="small"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #1E2638' }}>
        {success ? (
          <Button onClick={resetAndClose} variant="contained" color="primary" fullWidth>
            Selesai
          </Button>
        ) : (
          <>
            <Button onClick={resetAndClose} sx={{ color: '#94A3B8' }} disabled={loading}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
            >
              {loading ? 'Memproses...' : 'Simpan Password Baru'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
