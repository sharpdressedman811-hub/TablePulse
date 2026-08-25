import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useLayout } from '@/hooks/useLayout';
import { RecommendationCard } from '@/components/RecommendationCard';
import { SkeletonScreen } from '@/components/SkeletonLoader';
import { AI_RECOMMENDATIONS, TODAY_METRICS } from '@/data/mockRestaurant';
import { Brain, Clock } from 'lucide-react-native';

function AnimatedListItem({ index, children }: { index: number; children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export default function ActionPlanScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isTablet, isLargeTablet } = useLayout();
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const contentMaxWidth = isLargeTablet ? 900 : isTablet ? 720 : undefined;
  const horizontalPadding = isTablet ? 32 : 16;
  const paddingBottom = isTablet ? 60 : 120;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const laborAboveTarget = TODAY_METRICS.laborPercent > 28;

  if (loading) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <SkeletonScreen cards={3} />
      </ScrollView>
    );
  }

  return (
    <Animated.ScrollView
      style={{ flex: 1, backgroundColor: colors.background, opacity: fadeAnim }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingBottom: paddingBottom,
          gap: 16,
          maxWidth: contentMaxWidth,
          alignSelf: contentMaxWidth ? 'center' : undefined,
          width: contentMaxWidth ? '100%' : undefined,
        }}
      showsVerticalScrollIndicator={false}
    >
      {/* Subtitle */}
      <AnimatedListItem index={0}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              fontFamily: 'DMSans_400Regular',
            }}
          >
            {AI_RECOMMENDATIONS.length} recommendations
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Clock size={12} color={colors.textTertiary} />
            <Text
              style={{
                fontSize: 12,
                color: colors.textTertiary,
                fontFamily: 'DMSans_400Regular',
              }}
            >
              Updated 2 min ago
            </Text>
          </View>
        </View>
      </AnimatedListItem>

      {/* Today's Brief summary card */}
      <AnimatedListItem index={1}>
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 16,
            padding: 16,
            gap: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Brain size={14} color="rgba(255,255,255,0.8)" />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: 'rgba(255,255,255,0.8)',
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                fontFamily: 'DMSans_700Bold',
              }}
            >
              Today's Brief
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: '#FFFFFF',
              fontFamily: 'DMSans_500Medium',
              lineHeight: 20,
            }}
          >
            Projected: $11,420 · 184 reservations · 236 covers · Labor {TODAY_METRICS.laborPercent}%
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'DMSans_400Regular',
              fontStyle: 'italic',
            }}
          >
            AI generated · Based on verified data
          </Text>
        </View>
      </AnimatedListItem>

      {/* Recommendation cards */}
      {AI_RECOMMENDATIONS.map((rec, index) => (
        <AnimatedListItem key={rec.id} index={index + 2}>
          <RecommendationCard
            recommendation={rec}
            compact={false}
            onPress={() => {
              console.log('[ActionPlan] Recommendation card pressed:', rec.id, rec.problem);
              router.push(`/recommendation/${rec.id}`);
            }}
            onAction={() => {
              console.log('[ActionPlan] Action button pressed:', rec.actionLabel, 'for rec:', rec.id);
              if (rec.actionRoute) {
                router.push(rec.actionRoute as any);
              }
            }}
          />
        </AnimatedListItem>
      ))}

      {/* Disclaimer */}
      <AnimatedListItem index={AI_RECOMMENDATIONS.length + 2}>
        <View
          style={{
            backgroundColor: colors.surfaceSecondary,
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: colors.textTertiary,
              fontFamily: 'DMSans_400Regular',
              lineHeight: 18,
              fontStyle: 'italic',
            }}
          >
            TablePulse AI distinguishes between verified facts, trends, predictions, and assumptions. Recommendations are based on your restaurant's actual data. Always apply your own judgment before taking action.
          </Text>
        </View>
      </AnimatedListItem>
    </Animated.ScrollView>
  );
}
