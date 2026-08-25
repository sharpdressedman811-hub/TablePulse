import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import SidebarNav from '@/components/SidebarNav';
import { useColors } from '@/hooks/useColors';
import { useLayout } from '@/hooks/useLayout';
import { useSubscriptionGuard } from "@/hooks/useSubscriptionGuard";

const TABS: TabBarItem[] = [
  { name: 'command-center', route: '/(tabs)/command-center', icon: 'home', label: 'Home' },
  { name: 'action-plan', route: '/(tabs)/action-plan', icon: 'bolt', label: 'Actions' },
  { name: 'revenue', route: '/(tabs)/revenue', icon: 'trending-up', label: 'Revenue' },
  { name: 'labor', route: '/(tabs)/labor', icon: 'group', label: 'Labor' },
  { name: 'marketing', route: '/(tabs)/marketing', icon: 'campaign', label: 'Marketing' },
];

export default function TabLayout() {
  useSubscriptionGuard();

  const colors = useColors();
  const { isTablet } = useLayout();

  const stackContent = (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="command-center" />
      <Stack.Screen name="action-plan" />
      <Stack.Screen name="revenue" />
      <Stack.Screen name="labor" />
      <Stack.Screen name="marketing" />
    </Stack>
  );

  if (isTablet) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}>
        <SidebarNav tabs={TABS} />
        <View style={{ flex: 1 }}>
          {stackContent}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {stackContent}
      <FloatingTabBar
        tabs={TABS}
        containerWidth={340}
        borderRadius={35}
        bottomMargin={20}
      />
    </View>
  );
}
