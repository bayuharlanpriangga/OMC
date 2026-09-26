import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  Radio,
} from '@mui/material';
import {
  Compass,
  Users,
  Settings as SettingsIcon,
  Sparkles,
  BookOpen,
  Menu as MenuIcon,
  X,
  LogOut,
  LogIn,
  Cloud,
  Plus,
  Calendar,
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { BirthProfile } from '../../types/birth-data';

interface NavbarProps {
  currentTab: 'home' | 'library';
  user: SupabaseUser | null;
  profiles?: BirthProfile[];
  selectedProfileIds?: string[];
  onSelectProfile?: (id: string) => void;
  onNavigate: (tab: 'home' | 'library') => void;
  onOpenBirthData: () => void;
  onOpenSettings: () => void;
  onStartCalculation: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  user,
  profiles = [],
  selectedProfileIds = [],
  onSelectProfile,
  onNavigate,
  onOpenBirthData,
  onOpenSettings,
  onStartCalculation,
  onOpenAuth,
  onLogout,
}) => {
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isProfileMenuOpen = Boolean(profileAnchorEl);

  const handleOpenProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const displayName = user
    ? user.user_metadata?.full_name || user.email?.split('@')[0] || 'Seeker'
    : null;

  const activeProfile = profiles.find((p) => selectedProfileIds.includes(p.id)) || profiles[0];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#000000',
        borderBottom: '1px solid #1A1A1A',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, justifyContent: 'space-between' }}>
          {/* Brand Logo & Name */}
          <Box
            onClick={() => onNavigate('home')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1.5px solid #E0C99A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0A0A0A',
                color: '#E0C99A',
              }}
            >
              <Compass size={20} strokeWidth={1.8} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  letterSpacing: '0.12em',
                  color: '#EDF1F7',
                  lineHeight: 1,
                }}
              >
                METAPHYSICA
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#9CA3AF',
                  display: 'block',
                  mt: 0.3,
                }}
              >
                Celestial &amp; Energetic Matrix
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button
              onClick={() => onNavigate('home')}
              sx={{
                color: currentTab === 'home' ? '#E0C99A' : '#9CA3AF',
                fontWeight: currentTab === 'home' ? 600 : 500,
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                borderRadius: 20,
                backgroundColor: currentTab === 'home' ? 'rgba(224, 201, 154, 0.08)' : 'transparent',
                '&:hover': {
                  color: '#EDF1F7',
                  backgroundColor: 'rgba(224, 201, 154, 0.06)',
                },
              }}
            >
              Home
            </Button>

            <Button
              startIcon={<BookOpen size={16} />}
              onClick={() => onNavigate('library')}
              sx={{
                color: currentTab === 'library' ? '#E0C99A' : '#9CA3AF',
                fontWeight: currentTab === 'library' ? 600 : 500,
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                borderRadius: 20,
                backgroundColor: currentTab === 'library' ? 'rgba(224, 201, 154, 0.08)' : 'transparent',
                '&:hover': {
                  color: '#EDF1F7',
                  backgroundColor: 'rgba(224, 201, 154, 0.06)',
                },
              }}
            >
              Library
            </Button>
          </Box>

          {/* Right Action Area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onStartCalculation}
              startIcon={<Sparkles size={16} />}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                px: 2.5,
                py: 0.9,
                fontWeight: 700,
                fontSize: '0.8125rem',
              }}
            >
              Calculate Chart
            </Button>

            {/* Auth Button (when guest) */}
            {!user ? (
              <Button
                variant="outlined"
                size="small"
                onClick={onOpenAuth}
                startIcon={<LogIn size={15} />}
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  borderColor: '#262626',
                  color: '#EDF1F7',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  px: 2,
                  py: 0.7,
                  '&:hover': {
                    borderColor: '#E0C99A',
                    color: '#E0C99A',
                    backgroundColor: 'rgba(224, 201, 154, 0.08)',
                  },
                }}
              >
                Masuk / Daftar
              </Button>
            ) : null}

            {/* Profile Avatar / Menu Trigger (Always opens clean dropdown) */}
            <IconButton
              onClick={handleOpenProfileMenu}
              aria-label="Account & Profile options"
              aria-controls={isProfileMenuOpen ? 'profile-dropdown-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isProfileMenuOpen ? 'true' : undefined}
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                backgroundColor: '#0A0A0A',
                border: user ? '1.5px solid #E0C99A' : '1px solid #262626',
                color: '#E0C99A',
                '&:hover': {
                  backgroundColor: '#141414',
                  borderColor: '#E0C99A',
                },
              }}
            >
              {user ? (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    bgcolor: 'rgba(224, 201, 154, 0.2)',
                    color: '#E0C99A',
                    fontWeight: 700,
                  }}
                >
                  {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              ) : (
                <Users size={19} />
              )}
            </IconButton>

            {/* Mobile Hamburger Toggle */}
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#EDF1F7' }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            backgroundColor: '#000000',
            borderBottom: '1px solid #1A1A1A',
            px: 3,
            py: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {!user ? (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<LogIn size={18} />}
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                sx={{
                  borderColor: '#E0C99A',
                  color: '#E0C99A',
                  py: 1,
                  mb: 1,
                }}
              >
                Masuk / Daftar Akun
              </Button>
            ) : (
              <Box sx={{ px: 1.5, py: 1.2, mb: 1, borderRadius: 2, backgroundColor: '#0A0A0A', border: '1px solid #1E1E1E' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#EDF1F7' }}>
                  {displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                  {user.email}
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: currentTab === 'home' ? '#E0C99A' : '#EDF1F7',
                backgroundColor: currentTab === 'home' ? 'rgba(224, 201, 154, 0.08)' : 'transparent',
                py: 1,
              }}
            >
              Home
            </Button>
            <Button
              fullWidth
              startIcon={<BookOpen size={18} />}
              onClick={() => {
                onNavigate('library');
                setMobileMenuOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: currentTab === 'library' ? '#E0C99A' : '#EDF1F7',
                backgroundColor: currentTab === 'library' ? 'rgba(224, 201, 154, 0.08)' : 'transparent',
                py: 1,
              }}
            >
              Library (Educational)
            </Button>
            <Button
              fullWidth
              startIcon={<Users size={18} />}
              onClick={() => {
                onOpenBirthData();
                setMobileMenuOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: '#EDF1F7',
                py: 1,
              }}
            >
              Birth Data Manager
            </Button>
            <Divider sx={{ my: 1, borderColor: '#1A1A1A' }} />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<Sparkles size={18} />}
              onClick={() => {
                onStartCalculation();
                setMobileMenuOpen(false);
              }}
            >
              Calculate Chart
            </Button>
          </Box>
        </Box>
      )}

      {/* ============================================================== */}
      {/* PROFILE DROPDOWN MENU (Anchored directly below the icon button) */}
      {/* ============================================================== */}
      <Menu
        id="profile-dropdown-menu"
        anchorEl={profileAnchorEl}
        open={isProfileMenuOpen}
        onClose={handleCloseProfileMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              width: 310,
              mt: 1.5,
              backgroundColor: '#050505',
              border: '1px solid #1E1E1E',
              borderRadius: 3,
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.95)',
              p: 1,
            },
          },
        }}
      >
        {/* User Account State Section */}
        {user ? (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#EDF1F7' }}>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', wordBreak: 'break-all', display: 'block', mt: 0.2 }}>
              {user.email}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                icon={<Cloud size={12} className="text-emerald-400" />}
                label="Supabase Cloud Synced"
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
        ) : (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#EDF1F7', mb: 0.5 }}>
              Mode Tamu
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 1.5 }}>
              Masuk akun untuk sinkronisasi profil lahir secara permanen.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              onClick={() => {
                handleCloseProfileMenu();
                onOpenAuth();
              }}
              startIcon={<LogIn size={14} />}
              sx={{ fontWeight: 700 }}
            >
              Masuk / Daftar Akun
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 1, borderColor: '#1A1A1A' }} />

        {/* Quick Stored Birth Profiles Section inside Dropdown */}
        <Box sx={{ px: 2, py: 0.8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#E0C99A', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Profil Lahir Tersimpan
            </Typography>
            <Typography variant="caption" sx={{ color: '#71717A' }}>
              ({profiles.length})
            </Typography>
          </Box>

          {profiles.length === 0 ? (
            <Box sx={{ py: 1, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 1 }}>
                Belum ada profil tersimpan.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxHeight: 160, overflowY: 'auto' }}>
              {profiles.slice(0, 4).map((p) => {
                const isSelected = activeProfile?.id === p.id;
                return (
                  <Box
                    key={p.id}
                    onClick={() => {
                      if (onSelectProfile) onSelectProfile(p.id);
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 1.2,
                      py: 0.8,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(224, 201, 154, 0.08)' : 'transparent',
                      border: isSelected ? '1px solid rgba(224, 201, 154, 0.3)' : '1px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(224, 201, 154, 0.05)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Radio
                        checked={isSelected}
                        size="small"
                        sx={{ p: 0, color: '#4B5563', '&.Mui-checked': { color: '#E0C99A' } }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#EDF1F7' }}>
                          {p.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.68rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Calendar size={10} /> {p.birthDate}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={p.relationship}
                      size="small"
                      sx={{ height: 18, fontSize: '0.65rem', backgroundColor: '#141414', color: '#A1A1AA' }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}

          <Button
            size="small"
            fullWidth
            onClick={() => {
              handleCloseProfileMenu();
              onOpenBirthData();
            }}
            startIcon={<Plus size={14} />}
            sx={{
              mt: 1,
              py: 0.7,
              fontSize: '0.75rem',
              color: '#E0C99A',
              borderColor: '#262626',
              borderWidth: '1px',
              borderStyle: 'dashed',
              borderRadius: 2,
              '&:hover': { borderColor: '#E0C99A', backgroundColor: 'rgba(224, 201, 154, 0.06)' },
            }}
          >
            Kelola / Tambah Profil
          </Button>
        </Box>

        <Divider sx={{ my: 1, borderColor: '#1A1A1A' }} />

        {/* SETTINGS MENU ITEM */}
        <MenuItem
          onClick={() => {
            handleCloseProfileMenu();
            onOpenSettings();
          }}
          sx={{
            py: 1,
            px: 2,
            borderRadius: 1.5,
            '&:hover': { backgroundColor: 'rgba(224, 201, 154, 0.08)' },
          }}
        >
          <ListItemIcon sx={{ color: '#9CA3AF', minWidth: 32 }}>
            <SettingsIcon size={16} />
          </ListItemIcon>
          <ListItemText
            primary={<Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#EDF1F7' }}>Pengaturan (Settings)</Typography>}
            secondary={<Typography sx={{ fontSize: '0.7rem', color: '#71717A' }}>Ephemeris &amp; preferensi</Typography>}
          />
        </MenuItem>

        {user && (
          <>
            <Divider sx={{ my: 0.8, borderColor: '#1A1A1A' }} />
            {/* LOGOUT */}
            <MenuItem
              onClick={() => {
                handleCloseProfileMenu();
                onLogout();
              }}
              sx={{
                py: 1,
                px: 2,
                borderRadius: 1.5,
                '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.1)' },
              }}
            >
              <ListItemIcon sx={{ color: '#F87171', minWidth: 32 }}>
                <LogOut size={16} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#F87171' }}>Keluar (Logout)</Typography>}
              />
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};
