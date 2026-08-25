import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <NativeTabs>
      {/* Command Center */}
      <NativeTabs.Trigger name="command-center">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      {/* Action Plan */}
      <NativeTabs.Trigger name="action-plan">
        <Icon sf="bolt.fill" />
        <Label>Actions</Label>
      </NativeTabs.Trigger>

      {/* Revenue */}
      <NativeTabs.Trigger name="revenue">
        <Icon sf="chart.line.uptrend.xyaxis" />
        <Label>Revenue</Label>
      </NativeTabs.Trigger>

      {/* Labor */}
      <NativeTabs.Trigger name="labor">
        <Icon sf="person.2.fill" />
        <Label>Labor</Label>
      </NativeTabs.Trigger>

      {/* Marketing */}
      <NativeTabs.Trigger name="marketing">
        <Icon sf="megaphone.fill" />
        <Label>Marketing</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
