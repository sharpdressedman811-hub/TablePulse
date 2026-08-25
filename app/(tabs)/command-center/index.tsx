import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { MetricCard } from '@/components/MetricCard';
import { RecommendationCard } from '@/components/RecommendationCard';
import { BarChart } from '@/components/BarChart';
import { SkeletonScreen } from '@/components/SkeletonLoader';
import {
  RESTAURANT,
  TODAY_METRICS,
  HOURLY_SALES,
  AI_RECOMMENDATIONS,
  INVENTORY_ALERTS,
} from '@/data/mockRestaurant';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  Wifi,
} from 'lucide-react-native';

function AnimatedListItem({ index, children }: { index: number; children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 350, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export default function CommandCenterScreen() {
  const colors = useColors();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const revenueProgress = TODAY_METRICS.revenueActual / TODAY_METRICS.revenueProjected;
  const laborAboveTarget = TODAY_METRICS.laborPercent > 28;

  const chartData = HOURLY_SALES.slice(0, 8).map((h) => ({
    label: h.hour,
    value: h.revenue,
    projected: null,
    baseline: h.baseline,
  }));

  const revenueVsNormalText = `${TODAY_METRICS.revenueVsNormal > 0 ? '+' : ''}${TODAY_METRICS.revenueVsNormal}% vs normal`;
  const avgCheckTrendText = `+${TODAY_METRICS.avgCheckVsNormal}% vs normal`;
  const laborTargetText = `vs ${28}% target`;
  const progressPercent = Math.round(revenueProgress * 100);

  if (loading) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <SkeletonScreen cards={4} />
      </ScrollView>
    );
  }

  return (
    <Animated.ScrollView
      style={{ flex: 1, backgroundColor: colors.background, opacity: fadeAnim }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, gap: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <AnimatedListItem index={0}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: colors.text,
                fontFamily: 'DMSans_700Bold',
                letterSpacing: -0.5,
              }}
            >
              {RESTAURANT.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                fontFamily: 'DMSans_400Regular',
                marginTop: 2,
              }}
            >
              {RESTAURANT.location}
              {' · '}
              {RESTAURANT.type}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.textTertiary,
                fontFamily: 'DMSans_400Regular',
                marginTop: 2,
              }}
            >
              {TODAY_METRICS.date}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginTop: 4,
            }}
          >
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#16A34A' }} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#16A34A',
                fontFamily: 'DMSans_600SemiBold',
              }}
            >
              Live
            </Text>
          </View>
        </View>
      </AnimatedListItem>

      {/* Today's Brief Card */}
      <AnimatedListItem index={1}>
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 20,
            padding: 20,
            borderCurve: 'continuous',
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              fontFamily: 'DMSans_700Bold',
              marginBottom: 16,
            }}
          >
            Today's Brief
          </Text>

          {/* 2x2 metrics grid */}
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'DMSans_400Regular',
                  marginBottom: 2,
                }}
              >
                Projected Revenue
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  fontFamily: 'DMSans_700Bold',
                  letterSpacing: -0.3,
                  fontVariant: ['tabular-nums'],
                }}
              >
                $11,420
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'DMSans_400Regular',
                  marginBottom: 2,
                }}
              >
                vs Normal
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: colors.accent,
                  fontFamily: 'DMSans_700Bold',
                  letterSpacing: -0.3,
                }}
              >
                {revenueVsNormalText.split(' ')[0]}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'DMSans_400Regular',
                  marginBottom: 2,
                }}
              >
                Reservations
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  fontFamily: 'DMSans_700Bold',
                  letterSpacing: -0.3,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {TODAY_METRICS.reservationsTotal}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'DMSans_400Regular',
                  marginBottom: 2,
                }}
              >
                Covers
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  fontFamily: 'DMSans_700Bold',
                  letterSpacing: -0.3,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {TODAY_METRICS.coversProjected}
              </Text>
            </View>
          </View>

          {/* Labor bar */}
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 12,
              padding: 12,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.8)',
                  fontFamily: 'DMSans_500Medium',
                }}
              >
                Labor Cost
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: laborAboveTarget ? colors.accent : '#FFFFFF',
                  fontFamily: 'DMSans_700Bold',
                }}
              >
                {TODAY_METRICS.laborPercent}%
                {' '}
                <Text style={{ fontWeight: '400', color: 'rgba(255,255,255,0.6)' }}>
                  {laborTargetText}
                </Text>
              </Text>
            </View>
            <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 }}>
              <View
                style={{
                  height: 6,
                  width: `${Math.min((TODAY_METRICS.laborPercent / 40) * 100, 100)}%`,
                  backgroundColor: laborAboveTarget ? colors.accent : '#FFFFFF',
                  borderRadius: 3,
                }}
              />
              {/* Target marker */}
              <View
                style={{
                  position: 'absolute',
                  left: `${(28 / 40) * 100}%`,
                  top: -2,
                  width: 2,
                  height: 10,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 1,
                }}
              />
            </View>
          </View>
        </View>
      </AnimatedListItem>

      {/* Alerts row */}
      <AnimatedListItem index={2}>
        <View>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: colors.textTertiary,
              fontFamily: 'DMSans_600SemiBold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 10,
            }}
          >
            Alerts
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }}>
            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16 }}>
              <AnimatedPressable
                onPress={() => {
                  console.log('[CommandCenter] Alert pressed: Salmon inventory');
                  router.push('/recommendation/rec_002');
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(239, 68, 68, 0.10)',
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(239, 68, 68, 0.20)',
                  }}
                >
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.danger }} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '500',
                      color: colors.danger,
                      fontFamily: 'DMSans_500Medium',
                    }}
                  >
                    Salmon inventory low
                  </Text>
                </View>
              </AnimatedPressable>

              <AnimatedPressable
                onPress={() => {
                  console.log('[CommandCenter] Alert pressed: Afternoon below baseline');
                  router.push('/recommendation/rec_001');
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(245, 158, 11, 0.10)',
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(245, 158, 11, 0.20)',
                  }}
                >
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent }} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '500',
                      color: colors.accent,
                      fontFamily: 'DMSans_500Medium',
                    }}
                  >
                    Afternoon below baseline
                  </Text>
                </View>
              </AnimatedPressable>

              <AnimatedPressable
                onPress={() => {
                  console.log('[CommandCenter] Alert pressed: Margaritas trending');
                  router.push('/recommendation/rec_003');
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(34, 197, 94, 0.10)',
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(34, 197, 94, 0.20)',
                  }}
                >
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#16A34A' }} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '500',
                      color: '#16A34A',
                      fontFamily: 'DMSans_500Medium',
                    }}
                  >
                    Margaritas trending +27%
                  </Text>
                </View>
              </AnimatedPressable>
            </View>
          </ScrollView>
        </View>
      </AnimatedListItem>

      {/* Revenue Snapshot */}
      <AnimatedListItem index={3}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
            gap: 12,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: colors.textTertiary,
              fontFamily: 'DMSans_600SemiBold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Revenue Today
          </Text>

          <View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                color: colors.text,
                fontFamily: 'DMSans_700Bold',
                letterSpacing: -0.5,
                fontVariant: ['tabular-nums'],
              }}
            >
              $8,240
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                fontFamily: 'DMSans_400Regular',
                marginTop: 2,
              }}
            >
              of $11,420 projected · {TODAY_METRICS.openHours} hrs open
            </Text>
          </View>

          {/* Progress bar */}
          <View style={{ height: 8, backgroundColor: colors.surfaceSecondary, borderRadius: 4 }}>
            <View
              style={{
                height: 8,
                width: `${progressPercent}%`,
                backgroundColor: colors.primary,
                borderRadius: 4,
              }}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <TrendingDown size={14} color={colors.accent} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: colors.accent,
                fontFamily: 'DMSans_600SemiBold',
              }}
            >
              {revenueVsNormalText}
            </Text>
          </View>
        </View>
      </AnimatedListItem>

      {/* Hourly bar chart */}
      <AnimatedListItem index={4}>
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
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: colors.textTertiary,
              fontFamily: 'DMSans_600SemiBold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Hourly Revenue
          </Text>
          <BarChart
            data={chartData}
            height={100}
            color={colors.primary}
            showBaseline={false}
            showProjected={false}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary }} />
              <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Actual</Text>
            </View>
          </View>
        </View>
      </AnimatedListItem>

      {/* Key metrics grid */}
      <AnimatedListItem index={5}>
        <View style={{ gap: 10 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: colors.textTertiary,
              fontFamily: 'DMSans_600SemiBold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Key Metrics
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <MetricCard
              label="Avg Check"
              value="$58.03"
              trend={TODAY_METRICS.avgCheckVsNormal}
              trendLabel={avgCheckTrendText}
            />
            <MetricCard
              label="Covers"
              value="142"
              subtext="of 236 projected"
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <MetricCard
              label="Reservations"
              value="87"
              subtext="pending tonight"
            />
            <MetricCard
              label="Labor"
              value="31.8%"
              trend={-3.8}
              trendLabel="3.8% above target"
            />
          </View>
        </View>
      </AnimatedListItem>

      {/* AI Recommendations preview */}
      <AnimatedListItem index={6}>
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '700',
                color: colors.text,
                fontFamily: 'DMSans_700Bold',
              }}
            >
              AI Action Plan
            </Text>
            <AnimatedPressable
              onPress={() => {
                console.log('[CommandCenter] See All recommendations pressed');
                router.push('/(tabs)/action-plan');
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.primary,
                    fontFamily: 'DMSans_500Medium',
                  }}
                >
                  See All
                </Text>
                <ChevronRight size={14} color={colors.primary} />
              </View>
            </AnimatedPressable>
          </View>

          {AI_RECOMMENDATIONS.slice(0, 3).map((rec, index) => (
            <AnimatedListItem key={rec.id} index={index}>
              <RecommendationCard
                recommendation={rec}
                compact
                onPress={() => {
                  console.log('[CommandCenter] Recommendation pressed:', rec.id, rec.problem);
                  router.push(`/recommendation/${rec.id}`);
                }}
              />
            </AnimatedListItem>
          ))}
        </View>
      </AnimatedListItem>

      {/* Integrations status */}
      <AnimatedListItem index={7}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: colors.textTertiary,
              fontFamily: 'DMSans_600SemiBold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Connected Sources
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {['Toast (Mock)', 'OpenTable (Mock)', '7shifts (Mock)'].map((source) => (
              <View
                key={source}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: colors.surfaceSecondary,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#16A34A' }} />
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    fontFamily: 'DMSans_500Medium',
                  }}
                >
                  {source}
                </Text>
              </View>
            ))}
          </View>
          <Text
            style={{
              fontSize: 11,
              color: colors.textTertiary,
              fontFamily: 'DMSans_400Regular',
              fontStyle: 'italic',
            }}
          >
            Mock data — connect real integrations in Settings
          </Text>
        </View>
      </AnimatedListItem>
    </Animated.ScrollView>
  );
}
