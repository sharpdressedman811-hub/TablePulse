// TablePulse AI — Color System
// Both light and dark variants

export const TablePulseColors = {
  light: {
    primary: '#0D9488',
    primaryMuted: 'rgba(13, 148, 136, 0.10)',
    accent: '#F59E0B',
    danger: '#EF4444',
    background: '#F0F4F3',
    surface: '#FFFFFF',
    surfaceSecondary: '#F5F9F8',
    text: '#0F2420',
    textSecondary: '#4A6B65',
    textTertiary: '#8AADA8',
    border: 'rgba(13, 148, 136, 0.08)',
    divider: 'rgba(13, 148, 136, 0.05)',
    tint: '#0D9488',
    icon: '#4A6B65',
    tabIconDefault: '#8AADA8',
    tabIconSelected: '#0D9488',
  },
  dark: {
    primary: '#0D9488',
    primaryMuted: 'rgba(13, 148, 136, 0.15)',
    accent: '#F59E0B',
    danger: '#EF4444',
    background: '#0A1512',
    surface: '#111E1B',
    surfaceSecondary: '#162420',
    text: '#E8F5F3',
    textSecondary: '#7AADA8',
    textTertiary: '#4A6B65',
    border: 'rgba(255, 255, 255, 0.07)',
    divider: 'rgba(255, 255, 255, 0.04)',
    tint: '#0D9488',
    icon: '#7AADA8',
    tabIconDefault: '#4A6B65',
    tabIconSelected: '#0D9488',
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
