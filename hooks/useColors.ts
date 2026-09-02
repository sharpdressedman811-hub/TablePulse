import { useBranding } from '@/contexts/BrandingContext';
import { TablePulseColors } from '@/constants/Colors';

export type AppColors = typeof TablePulseColors.light;

export function useColors(): AppColors {
  const { brandColors } = useBranding();
  return brandColors as unknown as AppColors;
}
