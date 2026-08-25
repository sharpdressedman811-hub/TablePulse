import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useLayout } from '@/hooks/useLayout';
import { RecommendationCard } from '@/components/RecommendationCard';
import { BarChart } from '@/components/BarChart';
import { SkeletonScreen } from '@/components/SkeletonLoader';
import { LABOR_DATA, AI_RECOMMENDATIONS, TODAY_METRICS } from '@/data/mockRestaurant';
import { AlertTriangle, Users, DollarSign, Clock, TrendingUp } from 'lucide-react-native';

function AnimatedListItem({ index, children }: { index: number; children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 70, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 350, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

function SectionTitle({ title }: { title: string }) {
  const colors = useColors();
  return (
    <Text
      style={{
        fontSize: 17,
        fontWeight: '700',
        color: colors.text,
        fontFamily: 'DMSans_700Bold',
        marginBottom: 2,
      }}
    >
      {title}
    </Text>
  );
}

export default function LaborScreen() {
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

  const laborRecs = AI_RECOMMENDATIONS.filter((r) => r.type === 'labor');

  const laborPercent = LABOR_DATA.laborPercent;
  const targetPercent = LABOR_DATA.targetLaborPercent;
  const aboveTarget = laborPercent > targetPercent;
  const diff = (laborPercent - targetPercent).toFixed(1);
  const overBudget = Math.round((laborPercent - targetPercent) / 100 * TODAY_METRICS.revenueActual);

  const totalHours = LABOR_DATA.scheduled.reduce((sum, r) => sum + r.hoursWorked, 0);
  const totalScheduled = LABOR_DATA.scheduled.reduce((sum, r) => sum + r.scheduled, 0);
  const totalActual = LABOR_DATA.scheduled.reduce((sum, r) => sum + r.actual, 0);

  // Forecasted covers by hour (5PM–10PM)
  const forecastData = [
    { label: '5PM', value: 16, projected: null, baseline: null },
    { label: '6PM', value: 28, projected: null, baseline: null },
    { label: '7PM', value: null, projected: 42, baseline: null },
    { label: '8PM', value: null, projected: 38, baseline: null },
    { label: '9PM', value: null, projected: 22, baseline: null },
    { label: '10PM', value: null, projected: 8, baseline: null },
  ];

  const laborPercentText = `${laborPercent}%`;
  const diffText = `${diff}% above target`;
  const overBudgetText = `$${overBudget} over budget today`;
  const salesPerHourText = `$${LABOR_DATA.salesPerLaborHour.toFixed(2)}`;

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
          gap: 20,
          maxWidth: contentMaxWidth,
          alignSelf: contentMaxWidth ? 'center' : undefined,
          width: contentMaxWidth ? '100%' : undefined,
        }}
      showsVerticalScrollIndicator={false}
    >
      {/* Labor health card */}
      <AnimatedListItem index={0}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: aboveTarget ? 'rgba(245, 158, 11, 0.25)' : colors.border,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View>
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: '700',
                  color: aboveTarget ? colors.accent : colors.primary,
                  fontFamily: 'DMSans_700Bold',
                  letterSpacing: -1,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {laborPercentText}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  fontFamily: 'DMSans_400Regular',
                }}
              >
                vs {targetPercent}% target
              </Text>
            </View>
            {aboveTarget && (
              <View
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  borderRadius: 10,
                  padding: 8,
                }}
              >
                <AlertTriangle size={20} color={colors.accent} />
              </View>
            )}
          </View>

          {/* Progress bar */}
          <View style={{ height: 8, backgroundColor: colors.surfaceSecondary, borderRadius: 4, position: 'relative' }}>
            <View
              style={{
                height: 8,
                width: `${Math.min((laborPercent / 40) * 100, 100)}%`,
                backgroundColor: aboveTarget ? colors.accent : colors.primary,
                borderRadius: 4,
              }}
            />
            {/* Target marker */}
            <View
              style={{
                position: 'absolute',
                left: `${(targetPercent / 40) * 100}%`,
                top: -3,
                width: 2,
                height: 14,
                backgroundColor: colors.text,
                borderRadius: 1,
                opacity: 0.4,
              }}
            />
          </View>

          {aboveTarget && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={14} color={colors.accent} />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: colors.accent,
                  fontFamily: 'DMSans_600SemiBold',
                }}
              >
                {diffText}
                {' — '}
                {overBudgetText}
              </Text>
            </View>
          )}
        </View>
      </AnimatedListItem>

      {/* Key metrics row */}
      <AnimatedListItem index={1}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 }}>Labor Cost</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold', fontVariant: ['tabular-nums'] }}>
              ${LABOR_DATA.laborCost.toLocaleString()}
            </Text>
            <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>today</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 }}>Sales/Labor Hr</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold', fontVariant: ['tabular-nums'] }}>
              {salesPerHourText}
            </Text>
            <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>per hour</Text>
          </View>
        </View>
      </AnimatedListItem>

      <AnimatedListItem index={2}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 }}>Staff Scheduled</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold', fontVariant: ['tabular-nums'] }}>
              {totalScheduled}
            </Text>
            <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>total today</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 }}>Hours Worked</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold', fontVariant: ['tabular-nums'] }}>
              {totalHours.toFixed(0)}
            </Text>
            <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>hrs so far</Text>
          </View>
        </View>
      </AnimatedListItem>

      {/* Staff breakdown table + Tonight's forecast: side-by-side on large-tablet */}
      <AnimatedListItem index={3}>
        <View style={{ flexDirection: isLargeTablet ? 'row' : 'column', gap: 16, alignItems: 'flex-start' }}>
          <View
            style={{
              flex: isLargeTablet ? 1 : undefined,
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              gap: 12,
            }}
          >
            <SectionTitle title="By Role" />

            {/* Header row */}
            <View style={{ flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
              <Text style={{ flex: 2, fontSize: 11, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.4 }}>Role</Text>
              <Text style={{ width: 60, fontSize: 11, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'center' }}>Sched</Text>
              <Text style={{ width: 60, fontSize: 11, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'center' }}>Actual</Text>
              <Text style={{ width: 50, fontSize: 11, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'right' }}>Hrs</Text>
            </View>

            {LABOR_DATA.scheduled.map((row, i) => {
              const diff = row.actual - row.scheduled;
              const actualColor = diff === 0 ? colors.primary : diff < 0 ? (diff === -1 ? colors.accent : colors.danger) : colors.primary;
              return (
                <View
                  key={row.role}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 6,
                    borderTopWidth: i > 0 ? 1 : 0,
                    borderTopColor: colors.divider,
                  }}
                >
                  <Text style={{ flex: 2, fontSize: 14, color: colors.text, fontFamily: 'DMSans_400Regular' }} numberOfLines={1}>
                    {row.role}
                  </Text>
                  <Text style={{ width: 60, fontSize: 14, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', textAlign: 'center', fontVariant: ['tabular-nums'] }}>
                    {row.scheduled}
                  </Text>
                  <Text style={{ width: 60, fontSize: 14, fontWeight: '600', color: actualColor, fontFamily: 'DMSans_600SemiBold', textAlign: 'center', fontVariant: ['tabular-nums'] }}>
                    {row.actual}
                  </Text>
                  <Text style={{ width: 50, fontSize: 14, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', textAlign: 'right', fontVariant: ['tabular-nums'] }}>
                    {row.hoursWorked.toFixed(1)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Tonight's forecast chart — inline on large-tablet */}
          {isLargeTablet && (
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                gap: 12,
              }}
            >
              <SectionTitle title="Tonight's Forecast" />
              <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }}>
                Projected covers by hour (5PM–10PM)
              </Text>
              <BarChart
                data={forecastData}
                height={120}
                color={colors.primary}
                showBaseline={false}
                showProjected={true}
              />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary }} />
                  <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Actual</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary, opacity: 0.3 }} />
                  <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Projected</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </AnimatedListItem>

      {/* Staffing alerts */}
      <AnimatedListItem index={4}>
        <View style={{ gap: 10 }}>
          <SectionTitle title="Staffing Alerts" />

          <View
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: 'rgba(245, 158, 11, 0.20)',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 5 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, fontFamily: 'DMSans_600SemiBold', marginBottom: 4 }}>
                Overstaffed {LABOR_DATA.overstaffedPeriods[0]}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', lineHeight: 18 }}>
                Consider sending 1 FOH home early. Projected revenue doesn't justify current staffing.
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: 'rgba(239, 68, 68, 0.20)',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger, marginTop: 5 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, fontFamily: 'DMSans_600SemiBold', marginBottom: 4 }}>
                Understaffed {LABOR_DATA.understaffedPeriods[0]}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', lineHeight: 18 }}>
                87 pending reservations suggest a heavy dinner. Consider calling in 1 additional FOH.
              </Text>
            </View>
          </View>
        </View>
      </AnimatedListItem>

      {/* Tonight's forecast chart — only shown standalone on non-large-tablet */}
      {!isLargeTablet && (
        <AnimatedListItem index={5}>
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
            <SectionTitle title="Tonight's Forecast" />
            <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }}>
              Projected covers by hour (5PM–10PM)
            </Text>
            <BarChart
              data={forecastData}
              height={120}
              color={colors.primary}
              showBaseline={false}
              showProjected={true}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary }} />
                <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Actual</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary, opacity: 0.3 }} />
                <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Projected</Text>
              </View>
            </View>
          </View>
        </AnimatedListItem>
      )}

      {/* Labor recommendations */}
      {laborRecs.length > 0 && (
        <AnimatedListItem index={6}>
          <View style={{ gap: 10 }}>
            <SectionTitle title="Labor Recommendations" />
            {laborRecs.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                compact
                onPress={() => {
                  console.log('[Labor] Recommendation pressed:', rec.id);
                  router.push(`/recommendation/${rec.id}`);
                }}
              />
            ))}
          </View>
        </AnimatedListItem>
      )}
    </Animated.ScrollView>
  );
}
