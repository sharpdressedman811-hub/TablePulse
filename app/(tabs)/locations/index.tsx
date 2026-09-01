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
import { useLayout } from '@/hooks/useLayout';
import { SkeletonScreen } from '@/components/SkeletonLoader';
import { OPERATOR, LOCATIONS } from '@/data/mockPOV';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  AlertTriangle,
  Users,
  BarChart2,
  Zap,
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

function urgencyBadgeColor(score: number): string {
  if (score >= 80) return '#EF4444';
  if (score >= 60) return '#F59E0B';
  return '#16A34A';
}

function statusConfig(status: string): { label: string; bg: string; text: string } {
  if (status === 'needs_attention') return { label: 'Needs Attention', bg: 'rgba(239,68,68,0.1)', text: '#EF4444' };
  if (status === 'opportunity') return { label: 'Opportunity', bg: 'rgba(245,158,11,0.1)', text: '#F59E0B' };
  return { label: 'On Track', bg: 'rgba(22,163,74,0.1)', text: '#16A34A' };
}

const STATUS_ORDER: Record<string, number> = { needs_attention: 0, opportunity: 1, on_track: 2 };

export default function LocationsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isTablet, isLargeTablet } = useLayout();
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const horizontalPadding = isTablet ? 32 : 16;
  const paddingBottom = isTablet ? 60 : 120;
  const contentMaxWidth = isLargeTablet ? 900 : isTablet ? 720 : undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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

  const sortedLocations = [...LOCATIONS].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3)
  );

  const groupSummaryChips = [
    { label: 'Total Revenue This Week', value: '$343,600' },
    { label: 'Avg Labor', value: '29.5%' },
    { label: 'Active Opportunities', value: '12' },
    { label: 'Avg POV Score', value: '85.7' },
  ];

  const crossLocationInsights = [
    {
      text: 'Tuesday slow period affects 3 of 5 locations — coordinate a group-wide campaign',
      type: 'pattern',
      borderColor: '#3B82F6',
      bg: 'rgba(59,130,246,0.06)',
    },
    {
      text: 'Downtown labor cost is 6.2pts above group average — investigate scheduling',
      type: 'alert',
      borderColor: '#F59E0B',
      bg: 'rgba(245,158,11,0.06)',
    },
    {
      text: 'Domain location is your highest-margin location — study and replicate',
      type: 'opportunity',
      borderColor: '#0D9488',
      bg: 'rgba(13,148,136,0.06)',
    },
  ];

  return (
    <Animated.ScrollView
      style={{ flex: 1, backgroundColor: colors.background, opacity: fadeAnim }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingHorizontal: horizontalPadding,
        paddingBottom,
        paddingTop: 16,
        alignItems: contentMaxWidth ? 'center' : undefined,
      }}
    >
      <View style={{ width: '100%', maxWidth: contentMaxWidth }}>

        {/* Section A: Header */}
        <AnimatedListItem index={0}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 28,
                fontFamily: 'DMSans_700Bold',
                color: colors.text,
                letterSpacing: -0.5,
              }}>
                Locations
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'DMSans_400Regular',
                color: colors.textSecondary,
                marginTop: 2,
              }}>
                {OPERATOR.name}
                {' · '}
                {OPERATOR.locations}
                {' locations'}
              </Text>
            </View>
            <View style={{
              backgroundColor: colors.primaryMuted,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}>
              <Text style={{
                fontSize: 11,
                fontFamily: 'DMSans_600SemiBold',
                color: colors.primary,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                Area Manager
              </Text>
            </View>
          </View>
        </AnimatedListItem>

        {/* Section B: Group Summary Strip */}
        <AnimatedListItem index={1}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 4, marginBottom: 20 }}
          >
            {groupSummaryChips.map((chip) => (
              <View key={chip.label} style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 14,
                paddingVertical: 10,
                minWidth: 140,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'DMSans_700Bold',
                  color: colors.text,
                  marginBottom: 2,
                }}>
                  {chip.value}
                </Text>
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'DMSans_400Regular',
                  color: colors.textSecondary,
                }}>
                  {chip.label}
                </Text>
              </View>
            ))}
          </ScrollView>
        </AnimatedListItem>

        {/* Section C: Location Cards */}
        {sortedLocations.map((loc, idx) => {
          const badgeColor = urgencyBadgeColor(loc.urgencyScore);
          const status = statusConfig(loc.status);
          const isAboveTarget = loc.laborPercent > loc.laborTarget;
          const laborColor = isAboveTarget ? '#EF4444' : '#16A34A';
          const trendPositive = loc.revenueTrend >= 0;
          const trendColor = trendPositive ? '#16A34A' : '#EF4444';
          const trendText = trendPositive
            ? `+${loc.revenueTrend}%`
            : `${loc.revenueTrend}%`;
          const revenueText = `$${loc.revenueThisWeek.toLocaleString()}`;
          const laborText = `${loc.laborPercent}%`;
          const laborTargetText = `vs ${loc.laborTarget}% target`;
          const opportunityValueText = `$${loc.topOpportunityValue.toLocaleString()}`;

          return (
            <AnimatedListItem key={loc.id} index={idx + 2}>
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
                marginBottom: 12,
              }}>
                {/* Top row: name + urgency score */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{
                    fontSize: 15,
                    fontFamily: 'DMSans_700Bold',
                    color: colors.text,
                    flex: 1,
                    marginRight: 8,
                  }}>
                    {loc.name}
                  </Text>
                  <View style={{
                    backgroundColor: badgeColor,
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    minWidth: 36,
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontFamily: 'DMSans_700Bold',
                      color: '#FFFFFF',
                    }}>
                      {loc.urgencyScore}
                    </Text>
                  </View>
                </View>

                {/* Address */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <MapPin size={12} color={colors.textTertiary} />
                  <Text style={{
                    fontSize: 12,
                    fontFamily: 'DMSans_400Regular',
                    color: colors.textTertiary,
                  }}>
                    {loc.address}
                  </Text>
                </View>

                {/* Urgency reason */}
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'DMSans_400Regular',
                  color: colors.textSecondary,
                  fontStyle: 'italic',
                  marginBottom: 12,
                }}>
                  {loc.urgencyReason}
                </Text>

                {/* Revenue + Labor row */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 11,
                      fontFamily: 'DMSans_600SemiBold',
                      color: colors.textTertiary,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 2,
                    }}>
                      Revenue This Week
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={{
                        fontSize: 16,
                        fontFamily: 'DMSans_700Bold',
                        color: colors.text,
                      }}>
                        {revenueText}
                      </Text>
                      {trendPositive
                        ? <TrendingUp size={13} color={trendColor} />
                        : <TrendingDown size={13} color={trendColor} />}
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'DMSans_600SemiBold',
                        color: trendColor,
                      }}>
                        {trendText}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 11,
                      fontFamily: 'DMSans_600SemiBold',
                      color: colors.textTertiary,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 2,
                    }}>
                      Labor
                    </Text>
                    <Text style={{
                      fontSize: 16,
                      fontFamily: 'DMSans_700Bold',
                      color: laborColor,
                    }}>
                      {laborText}
                    </Text>
                    <Text style={{
                      fontSize: 11,
                      fontFamily: 'DMSans_400Regular',
                      color: colors.textTertiary,
                    }}>
                      {laborTargetText}
                    </Text>
                  </View>
                </View>

                {/* Top opportunity */}
                <View style={{
                  backgroundColor: colors.primaryMuted,
                  borderRadius: 10,
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 11,
                      fontFamily: 'DMSans_600SemiBold',
                      color: colors.primary,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 2,
                    }}>
                      Top Opportunity
                    </Text>
                    <Text style={{
                      fontSize: 13,
                      fontFamily: 'DMSans_400Regular',
                      color: colors.text,
                    }}>
                      {loc.topOpportunity}
                    </Text>
                  </View>
                  <Text style={{
                    fontSize: 15,
                    fontFamily: 'DMSans_700Bold',
                    color: colors.primary,
                    marginLeft: 8,
                  }}>
                    {opportunityValueText}
                  </Text>
                </View>

                {/* Status badge + View Details button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{
                    backgroundColor: status.bg,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontFamily: 'DMSans_600SemiBold',
                      color: status.text,
                    }}>
                      {status.label}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('[Locations] View Details pressed for:', loc.name);
                      router.push('/(tabs)/command-center');
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Text style={{
                      fontSize: 13,
                      fontFamily: 'DMSans_600SemiBold',
                      color: colors.primary,
                    }}>
                      View Details
                    </Text>
                    <ChevronRight size={14} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </AnimatedListItem>
          );
        })}

        {/* Section D: Cross-Location Intelligence */}
        <AnimatedListItem index={sortedLocations.length + 2}>
          <Text style={{
            fontSize: 17,
            fontFamily: 'DMSans_700Bold',
            color: colors.text,
            marginBottom: 10,
            marginTop: 8,
          }}>
            Cross-Location Intelligence
          </Text>
          <View style={{ gap: 10, marginBottom: 20 }}>
            {crossLocationInsights.map((insight, idx) => {
              const insightIdx = sortedLocations.length + 3 + idx;
              return (
                <AnimatedListItem key={insight.type} index={insightIdx}>
                  <View style={{
                    backgroundColor: insight.bg,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: `${insight.borderColor}30`,
                    borderLeftWidth: 3,
                    borderLeftColor: insight.borderColor,
                    padding: 14,
                  }}>
                    <Text style={{
                      fontSize: 13,
                      fontFamily: 'DMSans_400Regular',
                      color: colors.text,
                      lineHeight: 20,
                    }}>
                      {insight.text}
                    </Text>
                  </View>
                </AnimatedListItem>
              );
            })}
          </View>
        </AnimatedListItem>

      </View>
    </Animated.ScrollView>
  );
}
