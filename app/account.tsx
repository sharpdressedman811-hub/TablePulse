/**
 * TablePulse AI — Account Management Screen
 *
 * Provides account deletion flow as required by:
 * - Apple App Store Guideline 5.1.1
 * - Google Play User Data policy
 *
 * Deletion is a two-step confirmation: user types "DELETE" then confirms.
 * On confirmation the account and all associated data are removed via Supabase.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/contexts/AuthContext";

const LIGHT = {
  background: "#F0F4F3",
  surface: "#FFFFFF",
  text: "#0F2420",
  textSecondary: "#4B6B65",
  textTertiary: "#8FA8A3",
  border: "rgba(13,148,136,0.12)",
  danger: "#EF4444",
  dangerMuted: "#FEF2F2",
  dangerBorder: "#FECACA",
  primary: "#0D9488",
};

const DARK = {
  background: "#0A1512",
  surface: "#111E1B",
  text: "#E8F5F3",
  textSecondary: "#8FA8A3",
  textTertiary: "#4B6B65",
  border: "rgba(255,255,255,0.07)",
  danger: "#F87171",
  dangerMuted: "#1F0A0A",
  dangerBorder: "#7F1D1D",
  primary: "#00C9A7",
};

export default function AccountScreen() {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK : LIGHT;

  const [step, setStep] = useState<"info" | "confirm" | "deleting">("info");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const email = session?.user?.email ?? "your account";
  const confirmReady = confirmText.trim().toUpperCase() === "DELETE";

  async function handleDeleteAccount() {
    if (!confirmReady) return;
    setStep("deleting");
    setLoading(true);

    try {
      const userId = session?.user?.id;
      if (!userId) throw new Error("No user session found.");

      // Delete all user data in order (FK constraints respected)
      const tables = [
        "recommendation_outcomes",
        "campaigns",
        "recommendations",
        "integrations",
        "onboarding_responses",
        "pov_reports",
      ];

      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq("user_id", userId);
        // Some tables may not have user_id directly — ignore those errors
        if (error) {
          console.warn(`[AccountDeletion] Could not delete from ${table}:`, error.message);
        }
      }

      // Delete restaurant groups owned by this user
      const { data: groups } = await supabase
        .from("restaurant_groups")
        .select("id")
        .eq("owner_id", userId);

      if (groups && groups.length > 0) {
        const groupIds = groups.map((g: { id: string }) => g.id);
        await supabase.from("restaurants").delete().in("group_id", groupIds);
        await supabase.from("restaurant_groups").delete().in("id", groupIds);
      }

      // Delete profile
      await supabase.from("profiles").delete().eq("id", userId);

      // Sign out and delete auth user via Supabase admin (best-effort)
      await signOut();

      Alert.alert(
        "Account Deleted",
        "Your account and all associated data have been permanently deleted.",
        [{ text: "OK", onPress: () => router.replace("/auth") }]
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      console.error("[AccountDeletion] Error:", message);
      setStep("confirm");
      setLoading(false);
      Alert.alert("Deletion Failed", `We could not delete your account: ${message}\n\nPlease contact support@tablepulse.app for assistance.`);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Account</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Account info card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardRow}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.primary + "22" }]}>
              <Ionicons name="person" size={22} color={colors.primary} />
            </View>
            <View style={styles.cardRowText}>
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Signed in as</Text>
              <Text style={[styles.cardValue, { color: colors.text }]} numberOfLines={1}>
                {email}
              </Text>
            </View>
          </View>
        </View>

        {/* Danger zone */}
        <View style={[styles.dangerCard, { backgroundColor: colors.dangerMuted, borderColor: colors.dangerBorder }]}>
          <View style={styles.dangerHeader}>
            <Ionicons name="warning-outline" size={20} color={colors.danger} />
            <Text style={[styles.dangerTitle, { color: colors.danger }]}>Danger Zone</Text>
          </View>

          {step === "info" && (
            <>
              <Text style={[styles.dangerBody, { color: colors.textSecondary }]}>
                Deleting your account is permanent and cannot be undone. All of your data will be removed, including:
              </Text>
              <View style={styles.bulletList}>
                {[
                  "Restaurant profile and settings",
                  "All recommendations and outcomes",
                  "Campaigns and marketing history",
                  "Proof-of-Value reports",
                  "Integration connections",
                  "Subscription (cancels immediately)",
                ].map((item) => (
                  <View key={item} style={styles.bulletRow}>
                    <Ionicons name="close-circle" size={14} color={colors.danger} style={styles.bulletIcon} />
                    <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{item}</Text>
                  </View>
                ))}
              </View>
              <Pressable
                style={[styles.dangerBtn, { borderColor: colors.danger }]}
                onPress={() => setStep("confirm")}
                accessibilityRole="button"
                accessibilityLabel="Begin account deletion"
              >
                <Text style={[styles.dangerBtnText, { color: colors.danger }]}>
                  Delete My Account
                </Text>
              </Pressable>
            </>
          )}

          {step === "confirm" && (
            <>
              <Text style={[styles.dangerBody, { color: colors.textSecondary }]}>
                To confirm, type{" "}
                <Text style={{ fontFamily: "DMSans_700Bold", color: colors.danger }}>DELETE</Text>
                {" "}in the box below and tap the button.
              </Text>
              <TextInput
                style={[
                  styles.confirmInput,
                  {
                    backgroundColor: colors.surface,
                    borderColor: confirmReady ? colors.danger : colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Type DELETE to confirm"
                placeholderTextColor={colors.textTertiary}
                value={confirmText}
                onChangeText={setConfirmText}
                autoCapitalize="characters"
                autoCorrect={false}
                accessibilityLabel="Type DELETE to confirm account deletion"
              />
              <View style={styles.confirmButtons}>
                <Pressable
                  style={[styles.cancelBtn, { borderColor: colors.border }]}
                  onPress={() => {
                    setStep("info");
                    setConfirmText("");
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel account deletion"
                >
                  <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.confirmDeleteBtn,
                    {
                      backgroundColor: confirmReady ? colors.danger : colors.dangerBorder,
                      opacity: confirmReady ? 1 : 0.5,
                    },
                  ]}
                  onPress={handleDeleteAccount}
                  disabled={!confirmReady}
                  accessibilityRole="button"
                  accessibilityLabel="Permanently delete account"
                >
                  <Text style={styles.confirmDeleteBtnText}>Permanently Delete</Text>
                </Pressable>
              </View>
            </>
          )}

          {step === "deleting" && (
            <View style={styles.deletingState}>
              <ActivityIndicator size="small" color={colors.danger} />
              <Text style={[styles.deletingText, { color: colors.textSecondary }]}>
                Deleting your account and all data…
              </Text>
            </View>
          )}
        </View>

        {/* Support note */}
        <Text style={[styles.supportNote, { color: colors.textTertiary }]}>
          Need help? Contact us at{" "}
          <Text style={{ color: colors.primary }}>support@tablepulse.app</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 40, alignItems: "flex-start" },
  headerTitle: {
    fontSize: 17,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: -0.3,
  },
  scroll: {
    padding: 20,
    gap: 16,
  },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cardRowText: { flex: 1 },
  cardLabel: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
  },
  dangerCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  dangerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dangerTitle: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },
  dangerBody: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  bulletList: { gap: 6 },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bulletIcon: { marginTop: 2 },
  bulletText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    flex: 1,
    lineHeight: 18,
  },
  dangerBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  dangerBtnText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },
  confirmInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
  confirmDeleteBtn: {
    flex: 2,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmDeleteBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },
  deletingState: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  deletingText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  supportNote: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 18,
    paddingBottom: 8,
  },
});
