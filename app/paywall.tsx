/**
 * TablePulse AI — Paywall Screen
 *
 * Three-tier subscription paywall: STARTER / INTELLIGENCE / GROWTH
 * Matches the TablePulse design system (teal primary, DM Sans, dark mode).
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Linking,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PurchasesPackage } from "react-native-purchases";
import Purchases from "react-native-purchases";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useBranding } from "@/contexts/BrandingContext";
import { TablePulseColors } from "@/constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Tier definitions ────────────────────────────────────────────────────────

interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  popular: boolean;
  features: string[];
}

const TIERS: Tier[] = [
  {
    id: "starter",
    name: "STARTER",
    price: "$299",
    period: "/month",
    tagline: "Essential insights for growing restaurants",
    popular: false,
    features: [
      "Daily revenue & cover tracking",
      "Basic AI recommendations",
      "Labor cost overview",
      "Weekly performance reports",
      "1 location",
    ],
  },
  {
    id: "intelligence",
    name: "INTELLIGENCE",
    price: "$399",
    period: "/month",
    tagline: "Full AI power for serious operators",
    popular: true,
    features: [
      "Everything in Starter",
      "Predictive revenue forecasting",
      "Smart staffing optimization",
      "Marketing campaign automation",
      "Real-time anomaly alerts",
      "Up to 3 locations",
    ],
  },
  {
    id: "growth",
    name: "GROWTH",
    price: "$449",
    period: "/month",
    tagline: "Enterprise-grade for multi-location groups",
    popular: false,
    features: [
      "Everything in Intelligence",
      "Unlimited locations",
      "Custom AI model training",
      "White-glove onboarding",
      "Dedicated account manager",
      "API access & integrations",
    ],
  },
];

// ─── AnimatedPressable ────────────────────────────────────────────────────────

function AnimatedPressable({
  onPress,
  style,
  children,
  disabled,
}: {
  onPress?: () => void;
  style?: any;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };
  const animOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, disabled && { opacity: 0.5 }]}>
      <Pressable
        onPressIn={animIn}
        onPressOut={animOut}
        onPress={onPress}
        disabled={disabled}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

// ─── Tier Card ────────────────────────────────────────────────────────────────

function TierCard({
  tier,
  selected,
  onSelect,
  colors,
  index,
}: {
  tier: Tier;
  selected: boolean;
  onSelect: () => void;
  colors: typeof TablePulseColors.light;
  index: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isPopular = tier.popular;

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <AnimatedPressable onPress={onSelect}>
        <View
          style={[
            styles.tierCard,
            {
              backgroundColor: colors.surface,
              borderColor: selected
                ? colors.primary
                : isPopular
                ? colors.primary + "40"
                : colors.border,
              borderWidth: selected ? 2 : isPopular ? 1.5 : 1,
            },
          ]}
        >
          {/* Popular badge */}
          {isPopular && (
            <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
            </View>
          )}

          {/* Header row */}
          <View style={styles.tierHeader}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.tierName,
                  {
                    color: isPopular ? colors.primary : colors.textSecondary,
                    fontFamily: "DMSans_700Bold",
                  },
                ]}
              >
                {tier.name}
              </Text>
              <Text
                style={[
                  styles.tierTagline,
                  { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
                ]}
              >
                {tier.tagline}
              </Text>
            </View>

            {/* Selection indicator */}
            <View
              style={[
                styles.selectionCircle,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.primary : "transparent",
                },
              ]}
            >
              {selected && <Text style={styles.selectionCheck}>✓</Text>}
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text
              style={[
                styles.priceAmount,
                {
                  color: colors.text,
                  fontFamily: "DMSans_700Bold",
                },
              ]}
            >
              {tier.price}
            </Text>
            <Text
              style={[
                styles.pricePeriod,
                { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
              ]}
            >
              {tier.period}
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.tierDivider, { backgroundColor: colors.divider }]} />

          {/* Features */}
          <View style={styles.featuresList}>
            {tier.features.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <View
                  style={[
                    styles.featureCheck,
                    { backgroundColor: colors.primaryMuted },
                  ]}
                >
                  <Text style={[styles.featureCheckText, { color: colors.primary }]}>
                    ✓
                  </Text>
                </View>
                <Text
                  style={[
                    styles.featureText,
                    { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
                  ]}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PaywallScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { brandColors } = useBranding();
  const colors = brandColors;

  const {
    packages,
    loading,
    isSubscribed,
    isWeb,
    purchasePackage,
    restorePurchases,
    mockWebPurchase,
    mockNativePurchase,
  } = useSubscription();

  const [selectedTierId, setSelectedTierId] = useState<string>("intelligence");
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(
    packages[0] || null
  );
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplying, setPromoApplying] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslate, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (packages.length > 0 && !selectedPackage) {
      setSelectedPackage(packages[0]);
    }
  }, [packages]);

  // Navigate to main app after successful subscription
  const navigateToApp = () => {
    console.log("[Paywall] Navigating to main app after subscription");
    router.replace("/(tabs)/command-center");
  };

  const handlePurchase = async () => {
    console.log("[Paywall] Purchase button pressed — tier:", selectedTierId);

    // Web or no packages: use mock flow
    if (isWeb || packages.length === 0) {
      if (isWeb) {
        console.log("[Paywall] Web mock purchase triggered");
        mockWebPurchase();
        navigateToApp();
      } else if (__DEV__) {
        console.log("[Paywall] Dev mock native purchase triggered");
        await mockNativePurchase();
        navigateToApp();
      }
      return;
    }

    if (!selectedPackage) return;

    try {
      setPurchasing(true);
      console.log("[Paywall] Initiating RevenueCat purchase for package:", selectedPackage.identifier);
      const success = await purchasePackage(selectedPackage);
      if (success) {
        console.log("[Paywall] Purchase successful");
        Alert.alert(
          "Welcome to TablePulse AI!",
          "Your subscription is now active. Let's grow your restaurant.",
          [{ text: "Get Started", onPress: navigateToApp }]
        );
      }
    } catch (error: any) {
      console.error("[Paywall] Purchase failed:", error);
      Alert.alert("Purchase Failed", error.message || "Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    console.log("[Paywall] Restore purchases tapped");
    try {
      setRestoring(true);
      const restored = await restorePurchases();
      if (restored) {
        console.log("[Paywall] Purchases restored successfully");
        Alert.alert("Restored!", "Your subscription has been restored.", [
          { text: "Continue", onPress: navigateToApp },
        ]);
      } else {
        console.log("[Paywall] No purchases found to restore");
        Alert.alert(
          "No Purchases Found",
          "We couldn't find any previous purchases linked to your account."
        );
      }
    } catch (error: any) {
      console.error("[Paywall] Restore failed:", error);
      Alert.alert("Restore Failed", error.message || "Please try again.");
    } finally {
      setRestoring(false);
    }
  };

  const handleSkip = () => {
    console.log("[Paywall] Skip tapped (dev/testing only)");
    router.replace("/(tabs)/command-center");
  };

  const handleTierSelect = (tierId: string) => {
    console.log("[Paywall] Tier selected:", tierId);
    setSelectedTierId(tierId);
    if (packages.length > 0) {
      setSelectedPackage(packages[0]);
    }
  };

  const handlePromoCodeTap = () => {
    console.log("[Paywall] 'Have a promo code?' tapped — platform:", Platform.OS);
    if (Platform.OS === "ios") {
      console.log("[Paywall] iOS: presenting native code redemption sheet");
      Purchases.presentCodeRedemptionSheet();
    } else {
      setPromoCode("");
      setPromoModalVisible(true);
    }
  };

  const handlePromoApply = async () => {
    const trimmed = promoCode.trim();
    console.log("[Paywall] Android promo code apply tapped — code:", trimmed);
    if (!trimmed) {
      Alert.alert("Enter a code", "Please enter a promo code before applying.");
      return;
    }
    setPromoApplying(true);
    try {
      const playStoreUrl = `https://play.google.com/redeem?code=${encodeURIComponent(trimmed)}`;
      console.log("[Paywall] Opening Play Store redeem URL:", playStoreUrl);
      await Linking.openURL(playStoreUrl);
      setPromoModalVisible(false);
    } catch (err: any) {
      console.error("[Paywall] Failed to open Play Store redeem URL:", err);
      Alert.alert("Could not open Play Store", "Please open the Google Play Store manually to redeem your code.");
    } finally {
      setPromoApplying(false);
    }
  };

  // Already subscribed — go straight to app
  if (isSubscribed) {
    return (
      <View style={[styles.subscribedContainer, { backgroundColor: colors.background }]}>
        <SafeAreaView edges={["top", "bottom"]} style={styles.subscribedSafeArea}>
          <View style={styles.subscribedContent}>
            <View style={[styles.subscribedIconRing, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[styles.subscribedIcon, { color: colors.primary }]}>✓</Text>
            </View>
            <Text style={[styles.subscribedTitle, { color: colors.text, fontFamily: "DMSans_700Bold" }]}>
              You're subscribed
            </Text>
            <Text style={[styles.subscribedSubtitle, { color: colors.textSecondary, fontFamily: "DMSans_400Regular" }]}>
              Your TablePulse AI subscription is active
            </Text>
            <AnimatedPressable onPress={navigateToApp}>
              <View style={[styles.ctaButton, { backgroundColor: colors.primary }]}>
                <Text style={[styles.ctaButtonText, { fontFamily: "DMSans_700Bold" }]}>
                  Open Dashboard
                </Text>
              </View>
            </AnimatedPressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const selectedTier = TIERS.find((t) => t.id === selectedTierId) || TIERS[1];
  const ctaLabel = purchasing
    ? "Processing..."
    : `Start Free Trial — ${selectedTier.price}/mo`;

  const isCtaDisabled = purchasing || restoring;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslate }],
              },
            ]}
          >
            {/* Logo mark */}
            <View style={[styles.logoMark, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[styles.logoMarkText, { color: colors.primary }]}>TP</Text>
            </View>

            <View style={[styles.plansBadge, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[styles.plansBadgeText, { color: colors.primary, fontFamily: "DMSans_600SemiBold" }]}>
                CHOOSE YOUR PLAN
              </Text>
            </View>

            <Text
              style={[
                styles.headline,
                { color: colors.text, fontFamily: "DMSans_700Bold" },
              ]}
            >
              Grow smarter with{"\n"}AI-powered insights
            </Text>
            <Text
              style={[
                styles.subheadline,
                { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
              ]}
            >
              Join hundreds of restaurants using TablePulse AI to optimize revenue, labor, and marketing.
            </Text>
          </Animated.View>

          {/* ── Tier Cards ── */}
          <View style={styles.tiersContainer}>
            {TIERS.map((tier, index) => (
              <TierCard
                key={tier.id}
                tier={tier}
                selected={selectedTierId === tier.id}
                onSelect={() => handleTierSelect(tier.id)}
                colors={colors}
                index={index}
              />
            ))}
          </View>

          {/* ── No packages notice (Expo Go) ── */}
          {!isWeb && packages.length === 0 && !loading && (
            <View style={[styles.noPackagesBox, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <Text style={[styles.noPackagesText, { color: colors.textSecondary, fontFamily: "DMSans_400Regular" }]}>
                Live purchases require a development or production build.
              </Text>
              {__DEV__ && (
                <AnimatedPressable
                  onPress={async () => {
                    console.log("[Paywall] Dev simulate purchase tapped");
                    await mockNativePurchase();
                    navigateToApp();
                  }}
                >
                  <View style={[styles.devMockButton, { borderColor: colors.primary }]}>
                    <Text style={[styles.devMockText, { color: colors.primary, fontFamily: "DMSans_600SemiBold" }]}>
                      Dev: Simulate Purchase
                    </Text>
                  </View>
                </AnimatedPressable>
              )}
            </View>
          )}

          {/* ── Bottom padding ── */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ── Sticky Bottom CTA ── */}
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
          ]}
        >
          {/* CTA Button */}
          <AnimatedPressable onPress={handlePurchase} disabled={isCtaDisabled}>
            <View
              style={[
                styles.ctaButton,
                { backgroundColor: colors.primary },
                isCtaDisabled && { opacity: 0.6 },
              ]}
            >
              {purchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.ctaButtonText, { fontFamily: "DMSans_700Bold" }]}>
                  {ctaLabel}
                </Text>
              )}
            </View>
          </AnimatedPressable>

          {/* Restore + Skip row */}
          <View style={styles.secondaryRow}>
            <AnimatedPressable onPress={handleRestore} disabled={restoring}>
              <View style={styles.secondaryAction}>
                {restoring ? (
                  <ActivityIndicator size="small" color={colors.textSecondary} />
                ) : (
                  <Text
                    style={[
                      styles.secondaryActionText,
                      { color: colors.textSecondary, fontFamily: "DMSans_500Medium" },
                    ]}
                  >
                    Restore Purchases
                  </Text>
                )}
              </View>
            </AnimatedPressable>

            <View style={[styles.secondaryDot, { backgroundColor: colors.textTertiary }]} />

            <AnimatedPressable onPress={handleSkip}>
              <View style={styles.secondaryAction}>
                <Text
                  style={[
                    styles.secondaryActionText,
                    { color: colors.textTertiary, fontFamily: "DMSans_400Regular" },
                  ]}
                >
                  Skip for now
                </Text>
              </View>
            </AnimatedPressable>
          </View>

          {/* Promo code link */}
          <AnimatedPressable onPress={handlePromoCodeTap}>
            <View style={styles.promoCodeRow}>
              <Text
                style={[
                  styles.promoCodeText,
                  { color: colors.primary, fontFamily: "DMSans_500Medium" },
                ]}
              >
                Have a promo code?
              </Text>
            </View>
          </AnimatedPressable>

          {/* Legal */}
          <Text
            style={[
              styles.legalText,
              { color: colors.textTertiary, fontFamily: "DMSans_400Regular" },
            ]}
          >
            {Platform.OS === "ios" ? "Apple ID" : "Google Play"} account will be charged.
            Subscription renews automatically. Cancel anytime.{" "}
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() => Linking.openURL("https://tablepulse.app/terms")}
              accessibilityRole="link"
              accessibilityLabel="Terms of Service"
            >
              Terms
            </Text>
            {" · "}
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() => Linking.openURL("https://tablepulse.app/privacy")}
              accessibilityRole="link"
              accessibilityLabel="Privacy Policy"
            >
              Privacy
            </Text>
          </Text>
        </View>
      </SafeAreaView>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* Android promo code modal */}
      <Modal
        visible={promoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          console.log("[Paywall] Android promo modal dismissed");
          setPromoModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalKAV}
            >
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalCard,
                    { backgroundColor: colors.surface, shadowColor: "#000" },
                  ]}
                >
                  {/* Modal header */}
                  <View style={styles.modalHeader}>
                    <View style={[styles.modalIconRing, { backgroundColor: colors.primaryMuted }]}>
                      <Text style={[styles.modalIcon, { color: colors.primary }]}>%</Text>
                    </View>
                    <Text
                      style={[
                        styles.modalTitle,
                        { color: colors.text, fontFamily: "DMSans_700Bold" },
                      ]}
                    >
                      Redeem Promo Code
                    </Text>
                    <Text
                      style={[
                        styles.modalSubtitle,
                        { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
                      ]}
                    >
                      Promo codes are applied through the Google Play Store. Enter your code below and tap Apply to open Play Store.
                    </Text>
                  </View>

                  {/* Text input */}
                  <TextInput
                    style={[
                      styles.promoInput,
                      {
                        backgroundColor: colors.surfaceSecondary,
                        borderColor: promoCode.length > 0 ? colors.primary : colors.border,
                        color: colors.text,
                        fontFamily: "DMSans_400Regular",
                      },
                    ]}
                    placeholder="Enter promo code"
                    placeholderTextColor={colors.textTertiary}
                    value={promoCode}
                    onChangeText={(text) => {
                      console.log("[Paywall] Promo code input changed:", text);
                      setPromoCode(text);
                    }}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handlePromoApply}
                  />

                  {/* Action buttons */}
                  <View style={styles.modalActions}>
                    <AnimatedPressable
                      onPress={() => {
                        console.log("[Paywall] Android promo modal cancelled");
                        setPromoModalVisible(false);
                      }}
                      style={{ flex: 1 }}
                    >
                      <View
                        style={[
                          styles.modalCancelButton,
                          { borderColor: colors.border },
                        ]}
                      >
                        <Text
                          style={[
                            styles.modalCancelText,
                            { color: colors.textSecondary, fontFamily: "DMSans_500Medium" },
                          ]}
                        >
                          Cancel
                        </Text>
                      </View>
                    </AnimatedPressable>

                    <AnimatedPressable
                      onPress={handlePromoApply}
                      disabled={promoApplying}
                      style={{ flex: 1 }}
                    >
                      <View
                        style={[
                          styles.modalApplyButton,
                          { backgroundColor: colors.primary },
                          promoApplying && { opacity: 0.6 },
                        ]}
                      >
                        {promoApplying ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <Text
                            style={[
                              styles.modalApplyText,
                              { fontFamily: "DMSans_700Bold" },
                            ]}
                          >
                            Apply
                          </Text>
                        )}
                      </View>
                    </AnimatedPressable>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoMark: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoMarkText: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  plansBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  plansBadgeText: {
    fontSize: 11,
    letterSpacing: 1.2,
  },
  headline: {
    fontSize: 30,
    lineHeight: 36,
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  subheadline: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: SCREEN_WIDTH * 0.8,
  },

  // Tiers
  tiersContainer: {
    gap: 12,
  },
  tierCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "visible",
  },
  popularBadge: {
    position: "absolute",
    top: -11,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  tierHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tierName: {
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: 3,
  },
  tierTagline: {
    fontSize: 13,
    lineHeight: 18,
  },
  selectionCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    marginTop: 2,
  },
  selectionCheck: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 14,
  },
  priceAmount: {
    fontSize: 32,
    letterSpacing: -1,
  },
  pricePeriod: {
    fontSize: 15,
    marginLeft: 2,
  },
  tierDivider: {
    height: 1,
    marginBottom: 14,
  },
  featuresList: {
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  featureCheckText: {
    fontSize: 10,
    fontWeight: "700",
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },

  // No packages
  noPackagesBox: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  noPackagesText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  devMockButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  devMockText: {
    fontSize: 13,
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    gap: 12,
  },
  ctaButton: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaButtonText: {
    fontSize: 17,
    color: "#fff",
    letterSpacing: -0.2,
  },
  secondaryRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  secondaryAction: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  secondaryActionText: {
    fontSize: 14,
  },
  secondaryDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  legalText: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },

  // Subscribed state
  subscribedContainer: {
    flex: 1,
  },
  subscribedSafeArea: {
    flex: 1,
  },
  subscribedContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  subscribedIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  subscribedIcon: {
    fontSize: 32,
  },
  subscribedTitle: {
    fontSize: 26,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  subscribedSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  // Promo code link
  promoCodeRow: {
    alignItems: "center",
    paddingVertical: 2,
  },
  promoCodeText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },

  // Android promo modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalKAV: {
    width: "100%",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    gap: 20,
  },
  modalHeader: {
    alignItems: "center",
    gap: 10,
  },
  modalIconRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  modalIcon: {
    fontSize: 22,
    fontWeight: "700",
  },
  modalTitle: {
    fontSize: 20,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  promoInput: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
    letterSpacing: 1,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 15,
  },
  modalApplyButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalApplyText: {
    fontSize: 15,
    color: "#fff",
  },
});
