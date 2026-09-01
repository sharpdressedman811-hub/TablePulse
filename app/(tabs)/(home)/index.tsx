import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { AnimatedPressable } from "@/components/AnimatedPressable";

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Welcome to Newly
      </Text>
      <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
        Your app is currently building...
      </Text>

      {/* Founder View link — discreet, bottom of screen */}
      <AnimatedPressable
        onPress={() => {
          console.log('[HomeScreen] Founder View link tapped — navigating to founder-dashboard');
          router.push('/founder-dashboard');
        }}
        style={styles.founderLink}
      >
        <Text style={styles.founderLinkText}>
          Founder View →
        </Text>
      </AnimatedPressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  founderLink: {
    marginTop: 48,
  },
  founderLinkText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});
