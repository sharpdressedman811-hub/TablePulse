import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useLayout } from '@/hooks/useLayout';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { BarChart } from '@/components/BarChart';
import { SkeletonScreen } from '@/components/SkeletonLoader';
import {
  TODAY_METRICS,
  HOURLY_SALES,
  DOW_PERFORMANCE,
  MENU_ITEMS,
  WEEKLY_TREND,
} from '@/data/mockRestaurant';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

type Period = 'today' | 'week' | 'month';

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

export default function RevenueScreen() {
  const colors = useColors();
  const { isTablet, isLargeTablet } = useLayout();
  const [period, setPeriod] = useState<Period>('today');
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

  const hourlyChartData = HOURLY_SALES.map((h) => ({
    label: h.hour,
    value: h.revenue,
    projected: h.projected,
    baseline: h.baseline,
  }));

  const dowChartData = DOW_PERFORMANCE.map((d) => ({
    label: d.day,
    value: d.thisWeek ?? d.avgRevenue,
    projected: null,
    baseline: d.avgRevenue,
  }));

  const weeklyChartData = WEEKLY_TREND.map((w) => ({
    label: w.week.replace('Apr ', 'A').replace('May ', 'M').replace('Jun ', 'J'),
    value: w.revenue,
    projected: null,
    baseline: null,
  }));

  const topItems = [...MENU_ITEMS].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const avgCheckSparkData = [54.2, 56.8, 55.1, 57.4, 59.0, 57.8, 58.03].map((v, i) => ({
    label: `D${i + 1}`,
    value: v,
    projected: null,
    baseline: null,
  }));

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
      {/* Period selector */}
      <AnimatedListItem index={0}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.surfaceSecondary,
            borderRadius: 12,
            padding: 3,
            marginTop: 4,
          }}
        >
          {(['today', 'week', 'month'] as Period[]).map((p) => {
            const isActive = period === p;
            const label = p === 'today' ? 'Today' : p === 'week' ? 'Week' : 'Month';
            return (
              <AnimatedPressable
                key={p}
                onPress={() => {
                  console.log('[Revenue] Period selected:', p);
                  setPeriod(p);
                }}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: isActive ? colors.surface : 'transparent',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : undefined,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: isActive ? '600' : '400',
                      color: isActive ? colors.text : colors.textSecondary,
                      fontFamily: isActive ? 'DMSans_600SemiBold' : 'DMSans_400Regular',
                    }}
                  >
                    {label}
                  </Text>
                </View>
              </AnimatedPressable>
            );
          })}
        </View>
      </AnimatedListItem>

      {period === 'today' && (
        <>
          {/* Revenue summary card */}
          <AnimatedListItem index={1}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                gap: 8,
              }}
            >
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
                  fontSize: 14,
                  color: colors.textSecondary,
                  fontFamily: 'DMSans_400Regular',
                }}
              >
                $11,420 projected end of day
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
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
                    -5.2% vs normal Tue
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={14} color={colors.primary} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: colors.primary,
                      fontFamily: 'DMSans_600SemiBold',
                    }}
                  >
                    +8.4% vs last Tue
                  </Text>
                </View>
              </View>
            </View>
          </AnimatedListItem>

          {/* Hourly bar chart + Avg check: side-by-side on large-tablet */}
          <AnimatedListItem index={2}>
            <View style={{ flexDirection: isLargeTablet ? 'row' : 'column', gap: 16 }}>
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
                <SectionTitle title="Hourly Revenue" />
                <BarChart
                  data={hourlyChartData}
                  height={140}
                  color={colors.primary}
                  showBaseline={true}
                  showProjected={true}
                />
                <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary }} />
                    <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Actual</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary, opacity: 0.3 }} />
                    <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Projected</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 10, height: 2, backgroundColor: colors.accent, opacity: 0.7 }} />
                    <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Baseline</Text>
                  </View>
                </View>
              </View>

              {/* Avg check — inline on large-tablet, separate item on smaller */}
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
                    gap: 10,
                  }}
                >
                  <SectionTitle title="Average Check" />
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: '700',
                        color: colors.text,
                        fontFamily: 'DMSans_700Bold',
                        letterSpacing: -0.3,
                        fontVariant: ['tabular-nums'],
                      }}
                    >
                      $58.03
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 }}>
                      <TrendingUp size={14} color={colors.primary} />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: colors.primary,
                          fontFamily: 'DMSans_600SemiBold',
                        }}
                      >
                        +2.1% vs normal
                      </Text>
                    </View>
                  </View>
                  <BarChart
                    data={avgCheckSparkData}
                    height={60}
                    color={colors.primary}
                    showBaseline={false}
                    showProjected={false}
                  />
                  <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>
                    Last 7 days
                  </Text>
                </View>
              )}
            </View>
          </AnimatedListItem>

          {/* Top performers */}
          <AnimatedListItem index={3}>
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
              <SectionTitle title="Top Items Today" />
              {topItems.map((item, i) => {
                const trendPositive = item.trend >= 0;
                const trendText = `${trendPositive ? '+' : ''}${item.trend}% vs avg`;
                return (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      borderTopWidth: i > 0 ? 1 : 0,
                      borderTopColor: colors.divider,
                    }}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: colors.primaryMuted,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: colors.primary,
                          fontFamily: 'DMSans_700Bold',
                        }}
                      >
                        {i + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: colors.text,
                          fontFamily: 'DMSans_600SemiBold',
                        }}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.textTertiary,
                          fontFamily: 'DMSans_400Regular',
                        }}
                      >
                        {item.category}
                        {' · '}
                        {item.soldToday} sold
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '700',
                          color: colors.text,
                          fontFamily: 'DMSans_700Bold',
                          fontVariant: ['tabular-nums'],
                        }}
                      >
                        ${item.revenue.toLocaleString()}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '600',
                          color: trendPositive ? colors.primary : colors.accent,
                          fontFamily: 'DMSans_600SemiBold',
                        }}
                      >
                        {trendText}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </AnimatedListItem>

          {/* Avg check — only shown standalone on non-large-tablet */}
          {!isLargeTablet && (
            <AnimatedListItem index={4}>
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
                <SectionTitle title="Average Check" />
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: '700',
                      color: colors.text,
                      fontFamily: 'DMSans_700Bold',
                      letterSpacing: -0.3,
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    $58.03
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 }}>
                    <TrendingUp size={14} color={colors.primary} />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: colors.primary,
                        fontFamily: 'DMSans_600SemiBold',
                      }}
                    >
                      +2.1% vs normal
                    </Text>
                  </View>
                </View>
                <BarChart
                  data={avgCheckSparkData}
                  height={60}
                  color={colors.primary}
                  showBaseline={false}
                  showProjected={false}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.textTertiary,
                    fontFamily: 'DMSans_400Regular',
                  }}
                >
                  Last 7 days
                </Text>
              </View>
            </AnimatedListItem>
          )}
        </>
      )}

      {period === 'week' && (
        <>
          <AnimatedListItem index={1}>
            <View style={{ flexDirection: isLargeTablet ? 'row' : 'column', gap: 16 }}>
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
                <SectionTitle title="This Week vs. Average" />
                <BarChart
                  data={dowChartData}
                  height={160}
                  color={colors.primary}
                  showBaseline={true}
                  showProjected={false}
                />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary }} />
                    <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>This Week</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 10, height: 2, backgroundColor: colors.accent, opacity: 0.7 }} />
                    <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>4-Week Avg</Text>
                  </View>
                </View>
              </View>
              {isLargeTablet && (
                <View style={{ flex: 1 }}>
                  {/* spacer placeholder so the chart doesn't stretch full width */}
                </View>
              )}
            </View>
          </AnimatedListItem>

          <AnimatedListItem index={2}>
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
              <SectionTitle title="Day-by-Day" />
              {DOW_PERFORMANCE.map((d, i) => {
                const hasActual = d.thisWeek !== null;
                const value = d.thisWeek ?? d.avgRevenue;
                const diff = hasActual ? ((value - d.avgRevenue) / d.avgRevenue) * 100 : 0;
                const diffText = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
                return (
                  <View
                    key={d.day}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      borderTopWidth: i > 0 ? 1 : 0,
                      borderTopColor: colors.divider,
                    }}
                  >
                    <Text
                      style={{
                        width: 36,
                        fontSize: 14,
                        fontWeight: '600',
                        color: hasActual ? colors.text : colors.textTertiary,
                        fontFamily: 'DMSans_600SemiBold',
                      }}
                    >
                      {d.day}
                    </Text>
                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                      <View style={{ height: 6, backgroundColor: colors.surfaceSecondary, borderRadius: 3 }}>
                        <View
                          style={{
                            height: 6,
                            width: `${(value / 21200) * 100}%`,
                            backgroundColor: hasActual
                              ? (diff >= 0 ? colors.primary : colors.accent)
                              : colors.textTertiary,
                            borderRadius: 3,
                            opacity: hasActual ? 1 : 0.4,
                          }}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: hasActual ? colors.text : colors.textTertiary,
                        fontFamily: 'DMSans_700Bold',
                        fontVariant: ['tabular-nums'],
                        width: 64,
                        textAlign: 'right',
                      }}
                    >
                      ${(value / 1000).toFixed(1)}k
                    </Text>
                    {hasActual && (
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '600',
                          color: diff >= 0 ? colors.primary : colors.accent,
                          fontFamily: 'DMSans_600SemiBold',
                          width: 44,
                          textAlign: 'right',
                        }}
                      >
                        {diffText}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </AnimatedListItem>
        </>
      )}

      {period === 'month' && (
        <>
          <AnimatedListItem index={1}>
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
              <SectionTitle title="Weekly Revenue Trend" />
              <BarChart
                data={weeklyChartData}
                height={160}
                color={colors.primary}
                showBaseline={false}
                showProjected={false}
              />
            </View>
          </AnimatedListItem>

          <AnimatedListItem index={2}>
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
              <SectionTitle title="8-Week Summary" />
              {WEEKLY_TREND.map((w, i) => {
                const prev = i > 0 ? WEEKLY_TREND[i - 1].revenue : w.revenue;
                const diff = ((w.revenue - prev) / prev) * 100;
                const diffText = i > 0 ? `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%` : '—';
                return (
                  <View
                    key={w.week}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      borderTopWidth: i > 0 ? 1 : 0,
                      borderTopColor: colors.divider,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.textSecondary,
                        fontFamily: 'DMSans_400Regular',
                        width: 52,
                      }}
                    >
                      {w.week}
                    </Text>
                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                      <View style={{ height: 6, backgroundColor: colors.surfaceSecondary, borderRadius: 3 }}>
                        <View
                          style={{
                            height: 6,
                            width: `${(w.revenue / 85000) * 100}%`,
                            backgroundColor: colors.primary,
                            borderRadius: 3,
                          }}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: colors.text,
                        fontFamily: 'DMSans_700Bold',
                        fontVariant: ['tabular-nums'],
                        width: 60,
                        textAlign: 'right',
                      }}
                    >
                      ${(w.revenue / 1000).toFixed(1)}k
                    </Text>
                    {i > 0 && (
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '600',
                          color: diff >= 0 ? colors.primary : colors.accent,
                          fontFamily: 'DMSans_600SemiBold',
                          width: 44,
                          textAlign: 'right',
                        }}
                      >
                        {diffText}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </AnimatedListItem>
        </>
      )}
    </Animated.ScrollView>
  );
}
