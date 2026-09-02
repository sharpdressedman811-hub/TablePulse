import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { TablePulseColors } from '@/constants/Colors';

export interface BrandColors {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  // Derived tokens (always computed from base colors)
  primaryMuted: string;
  accentMuted: string;
  surfaceSecondary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  divider: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  danger: string;
}

interface BrandingContextValue {
  brandColors: BrandColors;
  updateBranding: (colors: Partial<Pick<BrandColors, 'primary' | 'accent' | 'background' | 'surface' | 'text'>>) => Promise<void>;
  resetBranding: () => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_COLORS = TablePulseColors.dark;

function buildBrandColors(
  primary: string,
  accent: string,
  background: string,
  surface: string,
  text: string,
): BrandColors {
  return {
    primary,
    accent,
    background,
    surface,
    text,
    primaryMuted: primary + '26',
    accentMuted: accent + '26',
    surfaceSecondary: surface,
    textSecondary: text + 'AA',
    textTertiary: text + '66',
    border: primary + '1F',
    divider: primary + '0F',
    tint: primary,
    icon: text + 'AA',
    tabIconDefault: text + '66',
    tabIconSelected: primary,
    danger: '#EF4444',
  };
}

const defaultBrandColors = buildBrandColors(
  DEFAULT_COLORS.primary,
  DEFAULT_COLORS.accent,
  DEFAULT_COLORS.background,
  DEFAULT_COLORS.surface,
  DEFAULT_COLORS.text,
);

const BrandingContext = createContext<BrandingContextValue>({
  brandColors: defaultBrandColors,
  updateBranding: async () => {},
  resetBranding: async () => {},
  isLoading: false,
});

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [brandColors, setBrandColors] = useState<BrandColors>(defaultBrandColors);
  const [isLoading, setIsLoading] = useState(false);

  const applyGroupBranding = useCallback((row: Record<string, string | null>) => {
    const primary = row.brand_primary || DEFAULT_COLORS.primary;
    const accent = row.brand_accent || DEFAULT_COLORS.accent;
    const background = row.brand_background || DEFAULT_COLORS.background;
    const surface = row.brand_surface || DEFAULT_COLORS.surface;
    const text = row.brand_text || DEFAULT_COLORS.text;
    const colors = buildBrandColors(primary, accent, background, surface, text);
    console.log('[BrandingContext] Applying brand colors:', { primary, accent, background });
    setBrandColors(colors);
  }, []);

  useEffect(() => {
    if (!profile?.restaurant_group_id) {
      console.log('[BrandingContext] No restaurant_group_id — using defaults');
      setBrandColors(defaultBrandColors);
      return;
    }

    const groupId = profile.restaurant_group_id;
    console.log('[BrandingContext] Fetching branding for group:', groupId);
    setIsLoading(true);

    supabase
      .from('restaurant_groups')
      .select('brand_primary, brand_accent, brand_background, brand_surface, brand_text, logo_url')
      .eq('id', groupId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.warn('[BrandingContext] Failed to fetch branding:', error.message);
          setBrandColors(defaultBrandColors);
        } else if (data) {
          applyGroupBranding(data as Record<string, string | null>);
        }
        setIsLoading(false);
      });
  }, [profile?.restaurant_group_id, applyGroupBranding]);

  const updateBranding = useCallback(async (
    colors: Partial<Pick<BrandColors, 'primary' | 'accent' | 'background' | 'surface' | 'text'>>
  ) => {
    if (!profile?.restaurant_group_id) {
      console.warn('[BrandingContext] updateBranding called without restaurant_group_id');
      return;
    }

    const current = brandColors;
    const next = buildBrandColors(
      colors.primary ?? current.primary,
      colors.accent ?? current.accent,
      colors.background ?? current.background,
      colors.surface ?? current.surface,
      colors.text ?? current.text,
    );

    console.log('[BrandingContext] Optimistically updating brand colors');
    setBrandColors(next);

    const payload: Record<string, string> = {};
    if (colors.primary) payload.brand_primary = colors.primary;
    if (colors.accent) payload.brand_accent = colors.accent;
    if (colors.background) payload.brand_background = colors.background;
    if (colors.surface) payload.brand_surface = colors.surface;
    if (colors.text) payload.brand_text = colors.text;

    console.log('[BrandingContext] Persisting branding to Supabase:', payload);
    const { error } = await supabase
      .from('restaurant_groups')
      .update(payload)
      .eq('id', profile.restaurant_group_id);

    if (error) {
      console.error('[BrandingContext] Failed to persist branding:', error.message);
      setBrandColors(current);
      throw error;
    }
    console.log('[BrandingContext] Branding saved successfully');
  }, [profile?.restaurant_group_id, brandColors]);

  const resetBranding = useCallback(async () => {
    console.log('[BrandingContext] Resetting to default TablePulse colors');
    await updateBranding({
      primary: DEFAULT_COLORS.primary,
      accent: DEFAULT_COLORS.accent,
      background: DEFAULT_COLORS.background,
      surface: DEFAULT_COLORS.surface,
      text: DEFAULT_COLORS.text,
    });
  }, [updateBranding]);

  return (
    <BrandingContext.Provider value={{ brandColors, updateBranding, resetBranding, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
