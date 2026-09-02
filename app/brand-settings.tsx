import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBranding } from '@/contexts/BrandingContext';
import { useAuth } from '@/contexts/AuthContext';
import { TablePulseColors } from '@/constants/Colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

function isValidHex(value: string): boolean {
  return HEX_REGEX.test(value);
}

interface ColorField {
  key: 'primary' | 'accent' | 'background' | 'surface' | 'text';
  label: string;
  description: string;
}

const COLOR_FIELDS: ColorField[] = [
  { key: 'primary', label: 'Primary', description: 'Buttons, links, highlights' },
  { key: 'accent', label: 'Accent', description: 'Secondary highlights, badges' },
  { key: 'background', label: 'Background', description: 'Main screen background' },
  { key: 'surface', label: 'Surface', description: 'Cards and panels' },
  { key: 'text', label: 'Text', description: 'Primary text color' },
];

const DEFAULTS = TablePulseColors.dark;

interface ColorRowProps {
  field: ColorField;
  value: string;
  error: string | null;
  onChange: (key: string, val: string) => void;
  colors: { primary: string; surface: string; text: string; textSecondary: string; textTertiary: string; border: string; danger: string };
}

function ColorRow({ field, value, error, onChange, colors }: ColorRowProps) {
  const [focused, setFocused] = useState(false);
  const swatchScale = useRef(new Animated.Value(1)).current;

  const handleSwatchPress = useCallback(() => {
    console.log(`[BrandSettings] Swatch tapped for field: ${field.key}`);
    Animated.sequence([
      Animated.timing(swatchScale, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.spring(swatchScale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }),
    ]).start();
  }, [field.key, swatchScale]);

  const displayColor = isValidHex(value) ? value : '#888888';
  const borderColor = error ? '#EF4444' : focused ? colors.primary : colors.border;

  return (
    <View style={styles.colorRow}>
      <View style={styles.colorRowHeader}>
        <Text style={[styles.colorLabel, { color: colors.text }]}>{field.label}</Text>
        <Text style={[styles.colorDesc, { color: colors.textTertiary }]}>{field.description}</Text>
      </View>
      <View style={[styles.colorInputRow, { borderColor, backgroundColor: colors.surface }]}>
        <Pressable onPress={handleSwatchPress} accessibilityLabel={`${field.label} color swatch`}>
          <Animated.View
            style={[styles.swatch, { backgroundColor: displayColor, transform: [{ scale: swatchScale }] }]}
          />
        </Pressable>
        <TextInput
          style={[styles.hexInput, { color: colors.text }]}
          value={value}
          onChangeText={(v) => onChange(field.key, v)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="#000000"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7}
          accessibilityLabel={`${field.label} hex color input`}
        />
        {isValidHex(value) && (
          <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
}

export default function BrandSettingsScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { brandColors, updateBranding, resetBranding, isLoading } = useBranding();

  const [values, setValues] = useState({
    primary: brandColors.primary,
    accent: brandColors.accent,
    background: brandColors.background,
    surface: brandColors.surface,
    text: brandColors.text,
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  // Sync if branding loads after mount
  useEffect(() => {
    if (!isLoading) {
      setValues({
        primary: brandColors.primary,
        accent: brandColors.accent,
        background: brandColors.background,
        surface: brandColors.surface,
        text: brandColors.text,
      });
    }
  }, [isLoading]);

  const isFounderOrAdmin = profile?.role === 'founder' || profile?.role === 'admin';

  const handleChange = useCallback((key: string, val: string) => {
    console.log(`[BrandSettings] Color changed: ${key} = ${val}`);
    setValues((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  }, [errors]);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string | null> = {};
    let valid = true;
    for (const field of COLOR_FIELDS) {
      if (!isValidHex(values[field.key])) {
        newErrors[field.key] = 'Must be a valid hex color (e.g. #FF0000)';
        valid = false;
      } else {
        newErrors[field.key] = null;
      }
    }
    setErrors(newErrors);
    return valid;
  }, [values]);

  const handleSave = useCallback(async () => {
    console.log('[BrandSettings] Save Changes tapped');
    if (!validate()) {
      console.log('[BrandSettings] Validation failed — not saving');
      return;
    }
    setSaving(true);
    try {
      await updateBranding(values);
      Alert.alert('Saved', 'Brand colors updated successfully.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[BrandSettings] Save failed:', msg);
      Alert.alert('Save Failed', `Could not save brand colors: ${msg}`);
    } finally {
      setSaving(false);
    }
  }, [values, validate, updateBranding]);

  const handleReset = useCallback(async () => {
    console.log('[BrandSettings] Reset to Default tapped');
    Alert.alert(
      'Reset to Default?',
      'This will restore the original TablePulse brand colors.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setResetting(true);
            try {
              await resetBranding();
              setValues({
                primary: DEFAULTS.primary,
                accent: DEFAULTS.accent,
                background: DEFAULTS.background,
                surface: DEFAULTS.surface,
                text: DEFAULTS.text,
              });
              setErrors({});
              Alert.alert('Reset', 'Brand colors restored to defaults.');
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Unknown error';
              console.error('[BrandSettings] Reset failed:', msg);
              Alert.alert('Reset Failed', msg);
            } finally {
              setResetting(false);
            }
          },
        },
      ]
    );
  }, [resetBranding]);

  const C = brandColors;

  // Preview colors — use current input values if valid, else fall back to brandColors
  const previewPrimary = isValidHex(values.primary) ? values.primary : C.primary;
  const previewAccent = isValidHex(values.accent) ? values.accent : C.accent;
  const previewBg = isValidHex(values.background) ? values.background : C.background;
  const previewSurface = isValidHex(values.surface) ? values.surface : C.surface;
  const previewText = isValidHex(values.text) ? values.text : C.text;

  const rowColors = {
    primary: C.primary,
    surface: C.surface,
    text: C.text,
    textSecondary: C.textSecondary,
    textTertiary: C.textTertiary,
    border: C.border,
    danger: C.danger,
  };

  if (!isFounderOrAdmin) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
        <View style={[styles.header, { borderBottomColor: C.border }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={24} color={C.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: C.text }]}>Brand Settings</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.accessDenied}>
          <Ionicons name="lock-closed-outline" size={48} color={C.textTertiary} />
          <Text style={[styles.accessDeniedTitle, { color: C.text }]}>Access Restricted</Text>
          <Text style={[styles.accessDeniedBody, { color: C.textSecondary }]}>
            Only founders and admins can edit brand settings.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Pressable
          onPress={() => {
            console.log('[BrandSettings] Back button tapped');
            router.back();
          }}
          style={styles.backBtn}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: C.text }]}>Brand & White-Label</Text>
        <View style={styles.backBtn} />
      </View>

      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Live Preview Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.textSecondary }]}>LIVE PREVIEW</Text>
          <View style={[styles.previewCard, { backgroundColor: previewSurface, borderColor: previewPrimary + '30' }]}>
            <View style={[styles.previewHeader, { backgroundColor: previewBg }]}>
              <View style={[styles.previewDot, { backgroundColor: previewPrimary }]} />
              <Text style={[styles.previewBrandName, { color: previewText }]}>Your Brand</Text>
              <View style={[styles.previewBadge, { backgroundColor: previewAccent + '30' }]}>
                <Text style={[styles.previewBadgeText, { color: previewAccent }]}>Pro</Text>
              </View>
            </View>
            <View style={styles.previewBody}>
              <Text style={[styles.previewBodyTitle, { color: previewText }]}>Restaurant Dashboard</Text>
              <Text style={[styles.previewBodySub, { color: previewText + '99' }]}>
                This is how your brand colors look in the app.
              </Text>
              <View style={[styles.previewBtn, { backgroundColor: previewPrimary }]}>
                <Text style={styles.previewBtnText}>Primary Action</Text>
              </View>
              <View style={[styles.previewBtnOutline, { borderColor: previewAccent }]}>
                <Text style={[styles.previewBtnOutlineText, { color: previewAccent }]}>Secondary Action</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Color Fields */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.textSecondary }]}>BRAND COLORS</Text>
          <View style={[styles.fieldsCard, { backgroundColor: C.surface, borderColor: C.border }]}>
            {COLOR_FIELDS.map((field, index) => (
              <View key={field.key}>
                <ColorRow
                  field={field}
                  value={values[field.key]}
                  error={errors[field.key] ?? null}
                  onChange={handleChange}
                  colors={rowColors}
                />
                {index < COLOR_FIELDS.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: C.divider }]} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <AnimatedPressable
            onPress={handleSave}
            disabled={saving || resetting}
            style={[styles.saveBtn, { backgroundColor: C.primary, opacity: saving ? 0.7 : 1 }]}
            accessibilityLabel="Save brand colors"
            accessibilityRole="button"
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save changes</Text>
              </>
            )}
          </AnimatedPressable>

          <AnimatedPressable
            onPress={handleReset}
            disabled={saving || resetting}
            style={[styles.resetBtn, { borderColor: C.border, opacity: resetting ? 0.7 : 1 }]}
            accessibilityLabel="Reset to default colors"
            accessibilityRole="button"
          >
            {resetting ? (
              <ActivityIndicator size="small" color={C.textSecondary} />
            ) : (
              <>
                <Ionicons name="refresh-outline" size={18} color={C.textSecondary} />
                <Text style={[styles.resetBtnText, { color: C.textSecondary }]}>Reset to default</Text>
              </>
            )}
          </AnimatedPressable>
        </View>

        <Text style={[styles.hint, { color: C.textTertiary }]}>
          Changes apply immediately across the app for all users in your restaurant group.
        </Text>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'DMSans_600SemiBold',
    letterSpacing: -0.3,
  },
  scroll: {
    padding: 20,
    gap: 24,
  },
  section: { gap: 10 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'DMSans_600SemiBold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  // Preview card
  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  previewDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  previewBrandName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
  },
  previewBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  previewBadgeText: {
    fontSize: 11,
    fontFamily: 'DMSans_600SemiBold',
  },
  previewBody: {
    padding: 16,
    gap: 10,
  },
  previewBodyTitle: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    letterSpacing: -0.2,
  },
  previewBodySub: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    lineHeight: 18,
  },
  previewBtn: {
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  previewBtnText: {
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
    color: '#FFFFFF',
  },
  previewBtnOutline: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  previewBtnOutlineText: {
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
  },
  // Fields card
  fieldsCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  colorRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  colorRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorLabel: {
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
  },
  colorDesc: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
  },
  colorInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  hexInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'DMSans_500Medium',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: '#EF4444',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
  // Actions
  actions: {
    gap: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 15,
    minHeight: 52,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: 'DMSans_600SemiBold',
    color: '#FFFFFF',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    minHeight: 52,
  },
  resetBtnText: {
    fontSize: 15,
    fontFamily: 'DMSans_500Medium',
  },
  hint: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Access denied
  accessDenied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 40,
  },
  accessDeniedTitle: {
    fontSize: 18,
    fontFamily: 'DMSans_600SemiBold',
  },
  accessDeniedBody: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});
