import React from 'react';
import { View } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import SidebarNav from '@/components/SidebarNav';
import { useColors } from '@/hooks/useColors';
import { useLayout } from '@/hooks/useLayout';
import { TabBarItem } from '@/components/FloatingTabBar';

const TABS: TabBarItem[] = [
  { name: 'command-center', route: '/(tabs)/command-center', icon: 'home', label: 'Home' },
  { name: 'locations', route: '/(tabs)/locations', icon: 'map-pin', label: 'Locations' },
  { name: 'action-plan', route: '/(tabs)/action-plan', icon: 'bolt', label: 'Actions' },
  { name: 'revenue', route: '/(tabs)/revenue', icon: 'trending-up', label: 'Revenue' },
  { name: 'proof-of-value', route: '/(tabs)/proof-of-value', icon: 'award', label: 'POV' },
];

export default function TabLayout() {
  const colors = useColors();
  const { isTablet } = useLayout();

  if (isTablet) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}>
        <SidebarNav tabs={TABS} />
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'none',
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="command-center" />
            <Stack.Screen name="locations" />
            <Stack.Screen name="action-plan" />
            <Stack.Screen name="revenue" />
            <Stack.Screen name="proof-of-value" />
            <Stack.Screen name="labor" />
            <Stack.Screen name="marketing" />
          </Stack>
        </View>
      </View>
    );
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="command-center">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="locations">
        <Icon sf="mappin.and.ellipse" />
        <Label>Locations</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="action-plan">
        <Icon sf="bolt.fill" />
        <Label>Actions</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="revenue">
        <Icon sf="chart.line.uptrend.xyaxis" />
        <Label>Revenue</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="proof-of-value">
        <Icon sf="rosette" />
        <Label>POV</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
