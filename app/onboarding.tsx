import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { onboardingQuestions } from "@/constants/OnboardingQuestions";
import { completeOnboarding } from "@/utils/onboardingStorage";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { OptionCard } from "@/components/onboarding/OptionCard";
import { useOnboardingColors } from "@/hooks/useOnboardingColors";
import { supabase } from "@/utils/supabase";

const TOTAL_STEPS = onboardingQuestions.length;

export default function OnboardingScreen() {
  const colors = useOnboardingColors();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const opacity = useSharedValue(1);
  const isAnimating = useRef(false);

  const question = onboardingQuestions[currentStep];
  const selectedOption = answers[currentStep];
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const isFirstStep = currentStep === 0;

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const goBack = useCallback(() => {
    if (!isFirstStep && !isAnimating.current) {
      isAnimating.current = true;
      opacity.value = withTiming(0, { duration: 150 });
      setTimeout(() => {
        setCurrentStep((prev) => Math.max(0, prev - 1));
        opacity.value = withTiming(1, { duration: 200 });
        isAnimating.current = false;
      }, 150);
    }
  }, [isFirstStep, opacity]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!isFirstStep) {
        goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [isFirstStep, goBack]);

  const handleSelect = (optionId: string) => {
    console.log('[Onboarding] Option selected — step:', currentStep, 'option:', optionId);
    setAnswers((prev) => ({ ...prev, [currentStep]: optionId }));
  };

  const saveToSupabase = async (finalAnswers: Record<number, string>) => {
    console.log('[Onboarding] Saving responses to Supabase');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('[Onboarding] No user found — skipping Supabase save');
      return;
    }

    // Build responses object keyed by question id
    const responsesObj: Record<string, string> = {};
    onboardingQuestions.forEach((q, idx) => {
      if (finalAnswers[idx]) {
        responsesObj[q.id ?? `q${idx}`] = finalAnswers[idx];
      }
    });

    // Save onboarding responses
    const { error: respError } = await supabase
      .from('onboarding_responses')
      .upsert({
        user_id: user.id,
        responses: responsesObj,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (respError) {
      console.error('[Onboarding] Failed to save responses:', respError.message);
      throw new Error(respError.message);
    }

    console.log('[Onboarding] Responses saved successfully');

    // Derive restaurant name from answers (question 0 is typically restaurant name/type)
    const restaurantName = responsesObj['restaurant_name'] ?? responsesObj['q0'] ?? 'My Restaurant';
    const restaurantType = responsesObj['cuisine_type'] ?? responsesObj['q1'] ?? 'Restaurant';

    // Create restaurant group
    const { data: groupData, error: groupError } = await supabase
      .from('restaurant_groups')
      .insert({
        owner_id: user.id,
        name: `${restaurantName} Group`,
      })
      .select('id')
      .single();

    if (groupError) {
      console.warn('[Onboarding] Failed to create restaurant group:', groupError.message);
      // Non-fatal — continue
    } else {
      console.log('[Onboarding] Restaurant group created:', groupData?.id);

      // Create first restaurant
      const { error: restError } = await supabase
        .from('restaurants')
        .insert({
          group_id: groupData.id,
          name: restaurantName,
          cuisine_type: restaurantType,
          owner_id: user.id,
        });

      if (restError) {
        console.warn('[Onboarding] Failed to create restaurant:', restError.message);
      } else {
        console.log('[Onboarding] First restaurant created');
      }

      // Update profile with group id
      await supabase
        .from('profiles')
        .update({ restaurant_group_id: groupData.id })
        .eq('id', user.id);
    }
  };

  const handleContinue = async () => {
    if (!selectedOption) return;
    console.log('[Onboarding] Continue pressed — step:', currentStep, 'isLast:', isLastStep);

    if (isLastStep) {
      setSaving(true);
      setSaveError('');
      try {
        await saveToSupabase(answers);
        await completeOnboarding();
        console.log('[Onboarding] Onboarding complete — navigating to paywall');
        router.replace("/paywall");
      } catch (err: any) {
        console.error('[Onboarding] Save error:', err);
        setSaveError('Failed to save. Please try again.');
        setSaving(false);
      }
    } else {
      if (isAnimating.current) return;
      isAnimating.current = true;
      opacity.value = withTiming(0, { duration: 150 });
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        opacity.value = withTiming(1, { duration: 200 });
        isAnimating.current = false;
      }, 150);
    }
  };

  if (!question) return null;

  const optionCards: React.ReactElement[] = [];
  for (const option of question.options) {
    optionCards.push(
      <OptionCard
        key={option.id}
        emoji={option.emoji}
        label={option.label}
        selected={selectedOption === option.id}
        onPress={() => handleSelect(option.id)}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        {!isFirstStep ? (
          <Pressable onPress={goBack} style={styles.backButton} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}
        <View style={styles.progressWrapper}>
          <ProgressBar totalSteps={TOTAL_STEPS} currentStep={currentStep} />
        </View>
        <View style={styles.backButton} />
      </View>

      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.questionSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            {question.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text + "99" }]}>
            {question.subtitle}
          </Text>
        </View>

        <View style={styles.optionsSection}>
          {optionCards}
        </View>
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: 16 }]}>
        {saveError ? (
          <Text style={styles.errorText}>{saveError}</Text>
        ) : null}
        <Pressable
          onPress={handleContinue}
          disabled={!selectedOption || saving}
          style={[
            styles.continueButton,
            {
              backgroundColor: colors.primary,
              opacity: selectedOption && !saving ? 1 : 0.4,
            },
          ]}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.continueText}>
              {isLastStep ? "Get Started" : "Continue"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  progressWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questionSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  optionsSection: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  continueButton: {
    height: 55,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
