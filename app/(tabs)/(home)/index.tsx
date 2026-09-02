import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { RecommendationCard } from "@/components/RecommendationCard";
import { SkeletonScreen } from "@/components/SkeletonLoader";
import { MetricCard } from "@/components/MetricCard";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { AI_RECOMMENDATIONS } from "@/data/mockRestaurant";

interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string | null;
  status: string | null;
}

interface Recommendation {
  id: string;
  title: string | null;
  description: string | null;
  type: string | null;
  status: string | null;
  revenue_opportunity_score: number | null;
  confidence_score: number | null;
  restaurant_id: string | null;
}

export default function HomeScreen() {
  const colors = useColors();
  const { user, profile } = useAuth();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!user) return;
    console.log('[HomeScreen] Fetching data for user:', user.id);
    setError('');

    try {
      const [restResult, recResult] = await Promise.all([
        supabase
          .from('restaurants')
          .select('id, name, cuisine_type, status')
          .eq('owner_id', user.id)
          .limit(10),
        supabase
          .from('recommendations')
          .select('id, title, description, type, status, revenue_opportunity_score, confidence_score, restaurant_id')
          .in('status', ['pending', 'viewed'])
          .order('revenue_opportunity_score', { ascending: false })
          .limit(5),
      ]);

      if (restResult.error) {
        console.warn('[HomeScreen] Restaurants fetch error:', restResult.error.message);
      } else {
        console.log('[HomeScreen] Restaurants loaded:', restResult.data?.length ?? 0);
        setRestaurants(restResult.data ?? []);
      }

      if (recResult.error) {
        console.warn('[HomeScreen] Recommendations fetch error:', recResult.error.message);
      } else {
        console.log('[HomeScreen] Recommendations loaded:', recResult.data?.length ?? 0);
        setRecommendations(recResult.data ?? []);
      }
    } catch (err: any) {
      console.error('[HomeScreen] Fetch error:', err);
      setError('Failed to load data. Pull to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    console.log('[HomeScreen] Pull-to-refresh triggered');
    setRefreshing(true);
    fetchData();
  };

  const isFounder = profile?.role === 'founder';

  // Use real recommendations if available, fall back to mock
  const displayRecs = recommendations.length > 0
    ? recommendations.map((r, idx) => ({
        id: r.id,
        priority: idx + 1,
        type: r.type ?? 'revenue',
        status: r.status ?? 'pending',
        confidence: Number(r.confidence_score ?? 75),
        dataType: 'verified_trend',
        problem: r.title ?? 'Recommendation',
        evidence: r.description ?? '',
        recommendation: r.description ?? '',
        expectedImpact: r.revenue_opportunity_score
          ? `$${Number(r.revenue_opportunity_score).toLocaleString()} opportunity`
          : '',
        impactRange: [0, 0] as [number, number],
        actionLabel: 'View Details',
        actionRoute: null,
        tags: [r.type ?? 'Revenue'],
      }))
    : AI_RECOMMENDATIONS.slice(0, 3);

  const primaryRestaurant = restaurants[0];
  const restaurantName = primaryRestaurant?.name ?? 'Your Restaurant';
  const locationCount = restaurants.length;
  const locationCountText = locationCount > 0
    ? `${locationCount} location${locationCount !== 1 ? 's' : ''}`
    : 'No locations yet';

  if (loading) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SkeletonScreen cards={4} />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Good morning
          </Text>
          <Text style={[styles.restaurantName, { color: colors.text }]}>
            {restaurantName}
          </Text>
          <Text style={[styles.locationCount, { color: colors.textTertiary }]}>
            {locationCountText}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: colors.primaryMuted }]}>
          <Text style={[styles.statusBadgeText, { color: colors.primary }]}>
            Live
          </Text>
        </View>
      </View>

      {/* Error state */}
      {error ? (
        <View style={[styles.errorBox, { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: '#EF4444' }]}>
          <Text style={[styles.errorText, { color: '#EF4444' }]}>{error}</Text>
        </View>
      ) : null}

      {/* Quick metrics */}
      <View style={styles.metricsRow}>
        <MetricCard
          label="Today's Revenue"
          value="$8,240"
          trend={-5.2}
          trendLabel="-5.2% vs avg"
          style={{ flex: 1 }}
        />
        <MetricCard
          label="Covers"
          value="142"
          trend={2.1}
          trendLabel="+2.1%"
          style={{ flex: 1 }}
        />
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today's Recommendations
          </Text>
          <View style={[styles.recCountBadge, { backgroundColor: colors.primaryMuted }]}>
            <Text style={[styles.recCountText, { color: colors.primary }]}>
              {displayRecs.length}
            </Text>
          </View>
        </View>

        {displayRecs.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              No recommendations yet
            </Text>
            <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
              Connect your POS and integrations to start receiving AI-powered insights.
            </Text>
          </View>
        ) : (
          <View style={styles.recList}>
            {displayRecs.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                compact
                onPress={() => {
                  console.log('[HomeScreen] Recommendation tapped:', rec.id);
                  router.push(`/recommendation/${rec.id}`);
                }}
              />
            ))}
          </View>
        )}
      </View>

      {/* Founder View link */}
      {isFounder && (
        <AnimatedPressable
          onPress={() => {
            console.log('[HomeScreen] Founder View link tapped — navigating to founder-dashboard');
            router.push('/founder-dashboard');
          }}
          style={styles.founderLink}
        >
          <Text style={[styles.founderLinkText, { color: colors.textTertiary }]}>
            Founder View →
          </Text>
        </AnimatedPressable>
      )}

      {/* Bottom padding */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: 24,
    fontFamily: 'DMSans_700Bold',
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  locationCount: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'DMSans_600SemiBold',
  },
  errorBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'DMSans_700Bold',
    letterSpacing: -0.2,
  },
  recCountBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recCountText: {
    fontSize: 12,
    fontFamily: 'DMSans_700Bold',
  },
  recList: {
    gap: 10,
  },
  emptyState: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontFamily: 'DMSans_600SemiBold',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  founderLink: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  founderLinkText: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
  },
});
