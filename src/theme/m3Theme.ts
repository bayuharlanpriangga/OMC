import { createTheme } from '@mui/material/styles';

/**
 * Material 3 Design Tokens for Metaphysica
 * Following strict M3 color roles and elevation layers.
 * Rule: NO GRADIENTS. Refined pure pitch-black palette (#000000).
 * No dark blue tints.
 */
export const m3Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E0C99A', // Celestial Starlight / Champagne Gold
      light: '#F3E4C3',
      dark: '#B89F70',
      contrastText: '#000000',
    },
    secondary: {
      main: '#9BB8DE', // Ethereal Slate / Celestial Indigo
      light: '#C0D5F3',
      dark: '#6D8EBA',
      contrastText: '#000000',
    },
    background: {
      default: '#000000', // Pure pitch black
      paper: '#080808',   // Pure dark charcoal surface
    },
    text: {
      primary: '#EDF1F7',
      secondary: '#9CA3AF',
      disabled: '#4B5563',
    },
    divider: '#1A1A1A',
    error: {
      main: '#F87171',
      light: '#FCA5A5',
      dark: '#DC2626',
      contrastText: '#000000',
    },
    warning: {
      main: '#FBBF24',
      light: '#FDE68A',
      dark: '#D97706',
      contrastText: '#000000',
    },
    info: {
      main: '#60A5FA',
      light: '#93C5FD',
      dark: '#2563EB',
      contrastText: '#000000',
    },
    success: {
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#059669',
      contrastText: '#000000',
    },
    action: {
      active: '#E0C99A',
      hover: 'rgba(224, 201, 154, 0.08)',
      selected: 'rgba(224, 201, 154, 0.14)',
      disabled: 'rgba(156, 163, 175, 0.3)',
      disabledBackground: 'rgba(30, 30, 30, 0.5)',
      focus: 'rgba(224, 201, 154, 0.16)',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 600,
      letterSpacing: '0.02em',
      lineHeight: 1.15,
    },
    h2: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 600,
      letterSpacing: '0.02em',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 500,
      letterSpacing: '0.015em',
      lineHeight: 1.25,
    },
    h4: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.005em',
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      color: '#9CA3AF',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      color: '#9CA3AF',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      color: '#D4DCED',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      color: '#9CA3AF',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    overline: {
      fontFamily: '"Cinzel", serif',
      letterSpacing: '0.12em',
      fontWeight: 600,
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#EDF1F7',
          scrollbarColor: '#282828 #000000',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '9px',
            height: '9px',
            backgroundColor: '#000000',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#000000',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#262626',
            borderRadius: '6px',
            border: '2px solid #000000',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#3E3E3E',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '10px 24px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#E0C99A',
            color: '#000000',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: '#F3E4C3',
            },
          },
          '&.MuiButton-outlinedPrimary': {
            borderColor: '#3D3425',
            color: '#E0C99A',
            '&:hover': {
              borderColor: '#E0C99A',
              backgroundColor: 'rgba(224, 201, 154, 0.08)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#080808',
          borderRadius: 16,
          border: '1px solid #1C1C1C',
          boxShadow: 'none',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#050505',
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000', // Pure pitch black modal
          backgroundImage: 'none',
          borderRadius: 20,
          border: '1px solid #1E1E1E',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.95)',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(6px)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#050505',
          backgroundImage: 'none',
          border: '1px solid #1E1E1E',
          borderRadius: 16,
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.9)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#080808',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#222222',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3D3D3D',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0C99A',
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 48,
          '&.Mui-selected': {
            color: '#E0C99A',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#E0C99A',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
  },
});
