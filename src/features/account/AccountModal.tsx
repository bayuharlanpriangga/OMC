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
  Chip,
  Divider,
} from '@mui/material';
import { X, UserCog, Mail, ShieldCheck, KeyRound } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { ChangePasswordModal } from './ChangePasswordModal';

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
}

export const AccountModal: React.FC<AccountModalProps> = ({ open, onClose, user }) => {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const displayName = user
    ? user.user_metadata?.full_name || user.email?.split('@')[0] || 'Seeker'
    : null;

  return (
    <>
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
              <UserCog size={18} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7', lineHeight: 1.1 }}>
                Kelola Akun
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Info akun & keamanan
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: 3 }}>
          {user ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Account Info */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Mail size={16} /> Info Akun
                </Typography>
                <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>
                  {displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', wordBreak: 'break-all' }}>
                  {user.email}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: '#1F293D' }} />

              {/* Connected login methods — placeholder structure for future multi-login support */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#9BB8DE', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldCheck size={16} /> Metode Login Terhubung
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid #1E1E1E',
                      backgroundColor: '#080808',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ color: '#EDF1F7' }}>Email & Password</Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>{user.email}</Typography>
                    </Box>
                    <Chip
                      label="Aktif"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        backgroundColor: 'rgba(52, 211, 153, 0.12)',
                        color: '#6EE7B7',
                        border: '1px solid rgba(52, 211, 153, 0.25)',
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: '#64748B', mt: 1, display: 'block' }}>
                  Metode login lain (Google, dsb.) akan bisa dihubungkan di sini nanti.
                </Typography>
              </Box>

              <Divider sx={{ borderColor: '#1F293D' }} />

              {/* Security */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#9BB8DE', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <KeyRound size={16} /> Keamanan
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setChangePasswordOpen(true)}
                  startIcon={<KeyRound size={16} />}
                  sx={{ borderColor: '#E0C99A', color: '#E0C99A' }}
                >
                  Ubah Password
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Masuk akun untuk mengelola info akun dan keamanan.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #1E2638' }}>
          <Button onClick={onClose} sx={{ color: '#94A3B8' }}>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>

      {user && (
        <ChangePasswordModal
          open={changePasswordOpen}
          onClose={() => setChangePasswordOpen(false)}
          userEmail={user.email || ''}
        />
      )}
    </>
  );
};
