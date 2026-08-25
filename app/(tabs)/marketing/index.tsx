import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonScreen } from '@/components/SkeletonLoader';
import { CAMPAIGNS } from '@/data/mockRestaurant';
import { Megaphone, Instagram, Mail, MessageSquare, Zap, TrendingUp } from 'lucide-react-native';

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

function ChannelChip({ channel }: { channel: string }) {
  const colors = useColors();
  const icon = channel === 'Instagram'
    ? <Instagram size={12} color={colors.primary} />
    : channel === 'Email'
    ? <Mail size={12} color={colors.primary} />
    : <MessageSquare size={12} color={colors.primary} />;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.primaryMuted,
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 3,
      }}
    >
      {icon}
      <Text
        style={{
          fontSize: 11,
          fontWeight: '500',
          color: colors.primary,
          fontFamily: 'DMSans_500Medium',
        }}
      >
        {channel}
      </Text>
    </View>
  );
}

export default function MarketingScreen() {
  const colors = useColors();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
        <SkeletonScreen cards={3} />
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
      {/* Opportunity spotlight */}
      <AnimatedListItem index={0}>
        <View
          style={{
            backgroundColor: '#78350F',
            borderRadius: 20,
            padding: 20,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 16 }}>📊</Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: 'rgba(255,255,255,0.8)',
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                fontFamily: 'DMSans_700Bold',
              }}
            >
              Biggest Opportunity Right Now
            </Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#FFFFFF',
              fontFamily: 'DMSans_700Bold',
              lineHeight: 24,
            }}
          >
            Tuesday 2–5 PM is your largest recurring slow period
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'DMSans_400Regular' }}>Avg Revenue</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', fontFamily: 'DMSans_700Bold', fontVariant: ['tabular-nums'] }}>$1,180</Text>
            </View>
            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <View>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'DMSans_400Regular' }}>Today</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.accent, fontFamily: 'DMSans_700Bold', fontVariant: ['tabular-nums'] }}>$470 (–60%)</Text>
            </View>
          </View>
          <AnimatedPressable
            onPress={() => {
              console.log('[Marketing] Create Campaign pressed from opportunity spotlight');
              router.push('/campaign/new');
            }}
          >
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  fontFamily: 'DMSans_700Bold',
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                Create Campaign
              </Text>
            </View>
          </AnimatedPressable>
        </View>
      </AnimatedListItem>

      {/* Active campaigns */}
      <AnimatedListItem index={1}>
        <View style={{ gap: 10 }}>
          <SectionTitle title="Campaigns" />
          {CAMPAIGNS.map((campaign, i) => {
            const statusMap: Record<string, string> = {
              draft: 'awaiting',
              active: 'live',
            };
            const badgeStatus = statusMap[campaign.status] ?? campaign.status;

            return (
              <AnimatedListItem key={campaign.id} index={i}>
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
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '700',
                          color: colors.text,
                          fontFamily: 'DMSans_700Bold',
                        }}
                        numberOfLines={1}
                      >
                        {campaign.name}
                      </Text>
                      <View
                        style={{
                          backgroundColor: colors.surfaceSecondary,
                          borderRadius: 5,
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: colors.textSecondary,
                            fontFamily: 'DMSans_500Medium',
                            textTransform: 'capitalize',
                          }}
                        >
                          {campaign.type}
                        </Text>
                      </View>
                    </View>
                    <StatusBadge status={badgeStatus} label={campaign.status_label} />
                  </View>

                  <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                    {campaign.channels.map((ch) => (
                      <ChannelChip key={ch} channel={ch} />
                    ))}
                    <View
                      style={{
                        backgroundColor: colors.surfaceSecondary,
                        borderRadius: 6,
                        paddingHorizontal: 7,
                        paddingVertical: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color: colors.textSecondary,
                          fontFamily: 'DMSans_500Medium',
                        }}
                      >
                        {campaign.estimatedReach.toLocaleString()} reach
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.textSecondary,
                      fontFamily: 'DMSans_400Regular',
                    }}
                    numberOfLines={1}
                  >
                    {campaign.offer}
                  </Text>

                  <AnimatedPressable
                    onPress={() => {
                      console.log('[Marketing] View campaign pressed:', campaign.id, campaign.name);
                      router.push(`/campaign/${campaign.id}`);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: colors.primaryMuted,
                        borderRadius: 10,
                        paddingVertical: 10,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: colors.primary,
                          fontFamily: 'DMSans_600SemiBold',
                        }}
                      >
                        View Campaign
                      </Text>
                    </View>
                  </AnimatedPressable>
                </View>
              </AnimatedListItem>
            );
          })}
        </View>
      </AnimatedListItem>

      {/* AI content ideas */}
      <AnimatedListItem index={2}>
        <View style={{ gap: 10 }}>
          <SectionTitle title="AI Content Ideas" />

          {/* Card 1 — Social Post */}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ backgroundColor: colors.primaryMuted, borderRadius: 8, padding: 6 }}>
                <Instagram size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold' }}>
                  🍹 Margarita Tuesday
                </Text>
                <Text style={{ fontSize: 12, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Social Post</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', lineHeight: 18 }}>
              Margaritas are trending +27% today. Feature them in your next post.
            </Text>
            <View
              style={{
                backgroundColor: colors.surfaceSecondary,
                borderRadius: 10,
                padding: 12,
                borderLeftWidth: 3,
                borderLeftColor: colors.primary,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', lineHeight: 18, fontStyle: 'italic' }}>
                "Your Tuesday just got better. Our signature margaritas are flying out of the bar tonight — come see why. 🍹 #TheGoldenFork #AustinEats"
              </Text>
            </View>
            <AnimatedPressable
              onPress={() => {
                console.log('[Marketing] Use This Caption pressed: Margarita Tuesday');
              }}
            >
              <View
                style={{
                  backgroundColor: colors.primaryMuted,
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary, fontFamily: 'DMSans_600SemiBold' }}>
                  Use This Caption
                </Text>
              </View>
            </AnimatedPressable>
          </View>

          {/* Card 2 — Email */}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.10)', borderRadius: 8, padding: 6 }}>
                <Mail size={16} color="#2563EB" />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold' }}>
                  📧 Win Back Slow Afternoons
                </Text>
                <Text style={{ fontSize: 12, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Email Campaign</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', lineHeight: 18 }}>
              Target guests who visited on weekdays. Offer a 2–5 PM incentive.
            </Text>
            <View
              style={{
                backgroundColor: colors.surfaceSecondary,
                borderRadius: 10,
                padding: 12,
                borderLeftWidth: 3,
                borderLeftColor: '#2563EB',
              }}
            >
              <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', marginBottom: 4 }}>Subject line:</Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', fontStyle: 'italic' }}>
                "We miss you (and we have happy hour 🎉)"
              </Text>
            </View>
            <AnimatedPressable
              onPress={() => {
                console.log('[Marketing] Create Email pressed');
                router.push('/campaign/new?type=email');
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.10)',
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2563EB', fontFamily: 'DMSans_600SemiBold' }}>
                  Create Email
                </Text>
              </View>
            </AnimatedPressable>
          </View>

          {/* Card 3 — SMS */}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ backgroundColor: 'rgba(34, 197, 94, 0.10)', borderRadius: 8, padding: 6 }}>
                <MessageSquare size={16} color="#16A34A" />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold' }}>
                  📱 Tonight's Dinner Push
                </Text>
                <Text style={{ fontSize: 12, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>SMS Blast</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', lineHeight: 18 }}>
              87 reservations tonight. Send a reminder to drive walk-ins for remaining capacity.
            </Text>
            <View
              style={{
                backgroundColor: colors.surfaceSecondary,
                borderRadius: 10,
                padding: 12,
                borderLeftWidth: 3,
                borderLeftColor: '#16A34A',
              }}
            >
              <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', fontStyle: 'italic', lineHeight: 18 }}>
                "The Golden Fork has tables available tonight! Join us for dinner. Reply STOP to opt out."
              </Text>
            </View>
            <AnimatedPressable
              onPress={() => {
                console.log('[Marketing] Send SMS pressed');
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.10)',
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#16A34A', fontFamily: 'DMSans_600SemiBold' }}>
                  Send SMS
                </Text>
              </View>
            </AnimatedPressable>
          </View>
        </View>
      </AnimatedListItem>

      {/* Slow period analysis */}
      <AnimatedListItem index={3}>
        <View style={{ gap: 10 }}>
          <SectionTitle title="Recurring Slow Periods" />

          {[
            { period: 'Tuesday 2–5 PM', avg: '$1,180', weeks: '4 weeks consistent', opportunity: 'High opportunity', color: colors.danger },
            { period: 'Monday 3–6 PM', avg: '$890', weeks: '3 weeks consistent', opportunity: 'Medium opportunity', color: colors.accent },
            { period: 'Wednesday 2–4 PM', avg: '$1,040', weeks: '2 weeks consistent', opportunity: 'Medium opportunity', color: colors.accent },
          ].map((item, i) => (
            <View
              key={item.period}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.border,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 4,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: item.color,
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold' }}>
                  {item.period}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', marginTop: 2 }}>
                  Avg {item.avg}
                  {' · '}
                  {item.weeks}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: item.color, fontFamily: 'DMSans_600SemiBold', marginTop: 2 }}>
                  {item.opportunity}
                </Text>
              </View>
              <AnimatedPressable
                onPress={() => {
                  console.log('[Marketing] Create Campaign for slow period:', item.period);
                  router.push('/campaign/new?type=slow_period');
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.primaryMuted,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary, fontFamily: 'DMSans_600SemiBold' }}>
                    Create
                  </Text>
                </View>
              </AnimatedPressable>
            </View>
          ))}
        </View>
      </AnimatedListItem>
    </Animated.ScrollView>
  );
}
