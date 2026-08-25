import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { useColors } from '@/hooks/useColors';

const TABS: TabBarItem[] = [
  { name: 'command-center', route: '/(tabs)/command-center', icon: 'home', label: 'Home' },
  { name: 'action-plan', route: '/(tabs)/action-plan', icon: 'bolt', label: 'Actions' },
  { name: 'revenue', route: '/(tabs)/revenue', icon: 'trending-up', label: 'Revenue' },
  { name: 'labor', route: '/(tabs)/labor', icon: 'group', label: 'Labor' },
  { name: 'marketing', route: '/(tabs)/marketing', icon: 'campaign', label: 'Marketing' },
];

export default function TabLayout() {
  const colors = useColors();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
      <FloatingTabBar
        tabs={TABS}
        containerWidth={340}
        borderRadius={35}
        bottomMargin={20}
      />
    </View>
  );
}
