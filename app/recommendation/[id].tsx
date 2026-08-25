import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useLayout } from '@/hooks/useLayout';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { AI_RECOMMENDATIONS } from '@/data/mockRestaurant';
import { TrendingUp, AlertTriangle, ChevronLeft } from 'lucide-react-native';

const PRIORITY_COLORS: Record<number, string> = {
  1: '#EF4444',
  2: '#F97316',
  3: '#F59E0B',
  4: '#3B82F6',
  5: '#0D9488',
};

const DATA_TYPE_CONFIG: Record<string, { label: string; emoji: string; color: string; description: string }> = {
  verified_fact: {
    label: 'Verified Fact',
    emoji: '✓',
    color: '#16A34A',
    description: 'This is based on confirmed data from your POS or reservation system.',
  },
  verified_trend: {
    label: 'Verified Trend',
    emoji: '📊',
    color: '#0D9488',
    description: 'This pattern has been observed consistently in your historical data.',
  },
  prediction: {
    label: 'Prediction',
    emoji: '🔮',
    color: '#3B82F6',
    description: 'This is a forecast based on historical patterns. Actual results may vary.',
  },
  assumption: {
    label: 'Assumption',
    emoji: '⚠️',
    color: '#F59E0B',
    description: 'This is based on industry averages or incomplete data. Verify before acting.',
  },
};

const TYPE_LABELS: Record<string, string> = {
  revenue: 'Revenue',
  operations: 'Operations',
  marketing: 'Marketing',
  labor: 'Labor',
  menu: 'Menu',
};

export default function RecommendationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { isTablet, isLargeTablet } = useLayout();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const contentMaxWidth = isLargeTablet ? 900 : isTablet ? 720 : undefined;
  const horizontalPadding = isTablet ? 32 : 16;

  const rec = AI_RECOMMENDATIONS.find((r) => r.id === id);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  if (!rec) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }}>
          Recommendation not found
        </Text>
      </View>
    );
  }

  const priorityColor = PRIORITY_COLORS[rec.priority] ?? colors.primary;
  const typeLabel = TYPE_LABELS[rec.type] ?? rec.type;
  const dataTypeConfig = DATA_TYPE_CONFIG[rec.dataType] ?? { label: rec.dataType, emoji: '•', color: colors.textSecondary, description: '' };
  const confidenceWidth: `${number}%` = `${rec.confidence}%`;

  return (
    <>
      <Stack.Screen
        options={{
          title: typeLabel,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Animated.ScrollView
        style={{ flex: 1, backgroundColor: colors.background, opacity: fadeAnim }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingBottom: 60,
            gap: 16,
            maxWidth: contentMaxWidth,
            alignSelf: contentMaxWidth ? 'center' : undefined,
            width: contentMaxWidth ? '100%' : undefined,
          }}
        showsVerticalScrollIndicator={false}
      >
        {/* Priority + type header */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: priorityColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  fontFamily: 'DMSans_700Bold',
                }}
              >
                {rec.priority}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: colors.textTertiary,
                  fontFamily: 'DMSans_600SemiBold',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Priority {rec.priority}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: colors.text,
                  fontFamily: 'DMSans_700Bold',
                }}
              >
                {typeLabel}
              </Text>
            </View>
          </View>

          {/* Data type */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: `${dataTypeConfig.color}15`,
              borderRadius: 10,
              padding: 12,
            }}
          >
            <Text style={{ fontSize: 16 }}>{dataTypeConfig.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: dataTypeConfig.color,
                  fontFamily: 'DMSans_700Bold',
                }}
              >
                {dataTypeConfig.label}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  fontFamily: 'DMSans_400Regular',
                  lineHeight: 17,
                  marginTop: 2,
                }}
              >
                {dataTypeConfig.description}
              </Text>
            </View>
          </View>
        </View>

        {/* Problem */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: colors.textTertiary,
              fontFamily: 'DMSans_600SemiBold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            The Problem
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: colors.text,
              fontFamily: 'DMSans_700Bold',
              lineHeight: 24,
            }}
          >
            {rec.problem}
          </Text>
        </View>

        {/* Evidence */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: colors.textTertiary,
              fontFamily: 'DMSans_600SemiBold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Evidence
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: colors.textSecondary,
              fontFamily: 'DMSans_400Regular',
              lineHeight: 22,
            }}
          >
            {rec.evidence}
          </Text>
        </View>

        {/* Recommendation */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: colors.textTertiary,
              fontFamily: 'DMSans_600SemiBold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Recommendation
          </Text>
          <View style={{ borderLeftWidth: 3, borderLeftColor: colors.primary, paddingLeft: 12 }}>
            <Text
              style={{
                fontSize: 15,
                color: colors.text,
                fontFamily: 'DMSans_400Regular',
                lineHeight: 22,
              }}
            >
              {rec.recommendation}
            </Text>
          </View>
        </View>

        {/* Expected impact */}
        {rec.expectedImpact && (
          <View
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(245, 158, 11, 0.20)',
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: colors.accent,
                fontFamily: 'DMSans_600SemiBold',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Expected Impact
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={18} color={colors.accent} />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '700',
                  color: colors.accent,
                  fontFamily: 'DMSans_700Bold',
                }}
              >
                {rec.expectedImpact}
              </Text>
            </View>
          </View>
        )}

        {/* Confidence meter */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            gap: 10,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: colors.textTertiary,
                fontFamily: 'DMSans_600SemiBold',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              AI Confidence
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: colors.text,
                fontFamily: 'DMSans_700Bold',
                fontVariant: ['tabular-nums'],
              }}
            >
              {rec.confidence}%
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: colors.surfaceSecondary, borderRadius: 4 }}>
            <View
              style={{
                height: 8,
                width: confidenceWidth,
                backgroundColor: rec.confidence >= 80 ? colors.primary : colors.accent,
                borderRadius: 4,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 12,
              color: colors.textTertiary,
              fontFamily: 'DMSans_400Regular',
              fontStyle: 'italic',
            }}
          >
            Based on {rec.dataType === 'verified_fact' ? 'confirmed data' : rec.dataType === 'verified_trend' ? 'historical trend analysis' : 'predictive modeling'}
          </Text>
        </View>

        {/* Tags */}
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {rec.tags.map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: colors.primaryMuted,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: colors.primary,
                  fontFamily: 'DMSans_500Medium',
                }}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {/* Action button */}
        {rec.actionLabel && (
          <AnimatedPressable
            onPress={() => {
              console.log('[RecommendationDetail] Action pressed:', rec.actionLabel, 'rec_id:', rec.id);
              if (rec.actionRoute) {
                router.push(rec.actionRoute as any);
              } else {
                router.back();
              }
            }}
          >
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  fontFamily: 'DMSans_700Bold',
                }}
              >
                {rec.actionLabel}
              </Text>
            </View>
          </AnimatedPressable>
        )}

        {/* Dismiss */}
        <AnimatedPressable
          onPress={() => {
            console.log('[RecommendationDetail] Dismiss pressed for rec:', rec.id);
            router.back();
          }}
        >
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.textTertiary,
                fontFamily: 'DMSans_400Regular',
              }}
            >
              Dismiss recommendation
            </Text>
          </View>
        </AnimatedPressable>

        {/* Disclaimer */}
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
            TablePulse AI distinguishes between verified facts, trends, predictions, and assumptions. Always apply your own judgment before taking action.
          </Text>
        </View>
      </Animated.ScrollView>
    </>
  );
}
