import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import { useColors } from '@/hooks/useColors';
import { IconSymbol } from '@/components/IconSymbol';
import { TabBarItem } from '@/components/FloatingTabBar';
import { useLayout } from '@/hooks/useLayout';

interface SidebarNavProps {
  tabs: TabBarItem[];
}

export default function SidebarNav({ tabs }: SidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const colors = useColors();
  const { isLargeTablet } = useLayout();

  const sidebarWidth = isLargeTablet ? 260 : 220;

  const activeTabIndex = React.useMemo(() => {
    let bestMatch = -1;
    let bestMatchScore = 0;
    tabs.forEach((tab, index) => {
      let score = 0;
      if (pathname === tab.route) score = 100;
      else if (pathname.startsWith(tab.route as string)) score = 80;
      else if (pathname.includes(tab.name)) score = 60;
      else if (String(tab.route).includes('/(tabs)/') && pathname.includes(String(tab.route).split('/(tabs)/')[1])) score = 40;
      if (score > bestMatchScore) { bestMatchScore = score; bestMatch = index; }
    });
    return bestMatch >= 0 ? bestMatch : 0;
  }, [pathname, tabs]);

  const bgColor = theme.dark ? 'rgba(18,18,20,0.95)' : 'rgba(255,255,255,0.92)';

  return (
    <BlurView
      intensity={80}
      style={[
        styles.sidebar,
        {
          width: sidebarWidth,
          backgroundColor: bgColor,
          borderRightColor: colors.border,
        },
        Platform.OS === 'web' && ({ backdropFilter: 'blur(20px)' } as object),
      ]}
    >
      {/* App brand */}
      <View style={styles.brand}>
        <View style={[styles.brandDot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.brandText, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
          TablePulse
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Nav items */}
      <View style={styles.navItems}>
        {tabs.map((tab, index) => {
          const isActive = activeTabIndex === index;
          const activeItemBg = theme.dark ? 'rgba(13,148,136,0.12)' : 'rgba(13,148,136,0.08)';
          const iconColor = isActive ? colors.primary : (theme.dark ? '#98989D' : '#6B7280');
          const labelColor = isActive ? colors.primary : (theme.dark ? '#98989D' : '#6B7280');
          const labelFamily = isActive ? 'DMSans_600SemiBold' : 'DMSans_500Medium';

          return (
            <TouchableOpacity
              key={tab.name}
              style={[
                styles.navItem,
                isActive && { backgroundColor: activeItemBg },
              ]}
              onPress={() => {
                console.log('[SidebarNav] Tab pressed:', tab.name, tab.route);
                router.push(tab.route);
              }}
              activeOpacity={0.7}
            >
              {isActive && (
                <View style={[styles.activeAccent, { backgroundColor: colors.primary }]} />
              )}
              <IconSymbol
                android_material_icon_name={tab.icon}
                ios_icon_name={tab.icon}
                size={20}
                color={iconColor}
              />
              <Text style={[styles.navLabel, { color: labelColor, fontFamily: labelFamily }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom badge */}
      <View style={styles.bottomBadge}>
        <View style={[styles.mockBadge, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#16A34A' }} />
          <Text style={[styles.mockText, { color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }]}>
            Mock Data Active
          </Text>
        </View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    height: '100%',
    borderRightWidth: 1,
    paddingTop: 60,
    paddingBottom: 32,
    flexDirection: 'column',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  navItems: {
    flex: 1,
    paddingHorizontal: 8,
    gap: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  activeAccent: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  bottomBadge: {
    paddingHorizontal: 16,
  },
  mockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
  },
  mockText: {
    fontSize: 11,
  },
});
