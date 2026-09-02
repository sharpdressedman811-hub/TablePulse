// TablePulse AI — Color System
// Extracted from app-icon-iyn.png:
//   Background: #000032 (deep navy)
//   Primary:    #00DDFE (electric cyan)
//   Accent:     #D702F0 (vivid magenta/purple)
//   Mid-tone:   #1E045A (deep indigo)

export const TablePulseColors = {
  light: {
    primary: '#00BDDF',        // electric cyan (slightly deepened for light mode contrast)
    primaryMuted: 'rgba(0, 221, 254, 0.10)',
    accent: '#D702F0',         // vivid magenta
    accentMuted: 'rgba(215, 2, 240, 0.10)',
    danger: '#EF4444',
    background: '#F0F4FF',     // very light blue-white
    surface: '#FFFFFF',
    surfaceSecondary: '#F5F7FF',
    text: '#06003A',           // deep navy text
    textSecondary: '#3D2E6B',  // indigo-tinted secondary
    textTertiary: '#8B7DB5',   // muted purple-grey
    border: 'rgba(0, 221, 254, 0.12)',
    divider: 'rgba(0, 221, 254, 0.06)',
    tint: '#00BDDF',
    icon: '#3D2E6B',
    tabIconDefault: '#8B7DB5',
    tabIconSelected: '#00BDDF',
  },
  dark: {
    primary: '#00DDFE',        // electric cyan (exact from logo)
    primaryMuted: 'rgba(0, 221, 254, 0.15)',
    accent: '#D702F0',         // vivid magenta (exact from logo)
    accentMuted: 'rgba(215, 2, 240, 0.15)',
    danger: '#EF4444',
    background: '#000032',     // deep navy (exact from logo background)
    surface: '#06003A',        // slightly lighter navy
    surfaceSecondary: '#0D0050', // deep indigo surface
    text: '#E8F0FF',           // cool white with blue tint
    textSecondary: '#8BAFD4',  // muted cyan-blue
    textTertiary: '#4A5A8A',   // dark muted blue
    border: 'rgba(0, 221, 254, 0.12)',
    divider: 'rgba(0, 221, 254, 0.06)',
    tint: '#00DDFE',
    icon: '#8BAFD4',
    tabIconDefault: '#4A5A8A',
    tabIconSelected: '#00DDFE',
  },
};

// Legacy Colors export for backward compatibility
export const Colors = {
  light: {
    text: TablePulseColors.light.text,
    background: TablePulseColors.light.background,
    tint: TablePulseColors.light.tint,
    icon: TablePulseColors.light.icon,
    tabIconDefault: TablePulseColors.light.tabIconDefault,
    tabIconSelected: TablePulseColors.light.tabIconSelected,
  },
  dark: {
    text: TablePulseColors.dark.text,
    background: TablePulseColors.dark.background,
    tint: TablePulseColors.dark.tint,
    icon: TablePulseColors.dark.icon,
    tabIconDefault: TablePulseColors.dark.tabIconDefault,
    tabIconSelected: TablePulseColors.dark.tabIconSelected,
  },
};

export const zincColors = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b',
};

export const appleBlue = '#007AFF';
export const appleRed = '#FF3B30';
export const borderColor = '#A1A1AA80';
export const appleGreen = '#34C759';
