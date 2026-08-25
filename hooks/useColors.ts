import { useColorScheme } from 'react-native';
import { TablePulseColors } from '@/constants/Colors';

export type AppColors = typeof TablePulseColors.light;

export function useColors(): AppColors {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? TablePulseColors.dark : TablePulseColors.light;
}
