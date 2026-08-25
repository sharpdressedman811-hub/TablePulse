import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Animated, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useLayout } from '@/hooks/useLayout';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { StatusBadge } from '@/components/StatusBadge';
import { CAMPAIGNS } from '@/data/mockRestaurant';
import { Instagram, Mail, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react-native';

const CAMPAIGN_TYPES = [
  { id: 'happy_hour', label: 'Happy Hour', emoji: '🍹', description: 'Drive traffic during slow periods with a time-limited offer' },
  { id: 'social_post', label: 'Social Post', emoji: '📸', description: 'Feature a trending item or moment on Instagram' },
  { id: 'email', label: 'Email Campaign', emoji: '📧', description: 'Reach your email list with a targeted offer' },
  { id: 'slow_period', label: 'Slow Period Promo', emoji: '⏰', description: 'Target recurring slow periods with a recurring promotion' },
  { id: 'announcement', label: 'Announcement', emoji: '📣', description: 'Share news about your restaurant with your audience' },
];

function ChannelChip({ channel, selected, onPress }: { channel: string; selected: boolean; onPress: () => void }) {
  const colors = useColors();
  const icon = channel === 'Instagram'
    ? <Instagram size={14} color={selected ? '#FFFFFF' : colors.primary} />
    : channel === 'Email'
    ? <Mail size={14} color={selected ? '#FFFFFF' : colors.primary} />
    : <MessageSquare size={14} color={selected ? '#FFFFFF' : colors.primary} />;

  return (
    <AnimatedPressable onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: selected ? colors.primary : colors.primaryMuted,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 7,
        }}
      >
        {icon}
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: selected ? '#FFFFFF' : colors.primary,
            fontFamily: 'DMSans_600SemiBold',
          }}
        >
          {channel}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

export default function CampaignScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { isTablet, isLargeTablet } = useLayout();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const contentMaxWidth = isLargeTablet ? 900 : isTablet ? 720 : undefined;
  const horizontalPadding = isTablet ? 32 : 16;

  const isNew = id === 'new';
  const existingCampaign = isNew ? null : CAMPAIGNS.find((c) => c.id === id);

  const [selectedType, setSelectedType] = useState(CAMPAIGN_TYPES[0]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['Instagram']);
  const [headline, setHeadline] = useState('');
  const [caption, setCaption] = useState('');
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  const toggleChannel = (channel: string) => {
    console.log('[Campaign] Channel toggled:', channel);
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  if (!isNew && !existingCampaign) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }}>
          Campaign not found
        </Text>
      </View>
    );
  }

  if (!isNew && existingCampaign) {
    const statusMap: Record<string, string> = { draft: 'awaiting', active: 'live' };
    const badgeStatus = statusMap[existingCampaign.status] ?? existingCampaign.status;

    return (
      <>
        <Stack.Screen options={{ title: existingCampaign.name, headerBackButtonDisplayMode: 'minimal' }} />
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
          {/* Status + meta */}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold' }}>
                {existingCampaign.name}
              </Text>
              <StatusBadge status={badgeStatus} label={existingCampaign.status_label} />
            </View>
            <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }}>
              Created {existingCampaign.createdAt}
              {' · '}
              {existingCampaign.estimatedReach.toLocaleString()} estimated reach
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              {existingCampaign.channels.map((ch) => (
                <View
                  key={ch}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: colors.primaryMuted,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  {ch === 'Instagram' ? <Instagram size={12} color={colors.primary} /> : ch === 'Email' ? <Mail size={12} color={colors.primary} /> : <MessageSquare size={12} color={colors.primary} />}
                  <Text style={{ fontSize: 12, color: colors.primary, fontFamily: 'DMSans_500Medium' }}>{ch}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Offer */}
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
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 }}>Offer</Text>
            <Text style={{ fontSize: 15, color: colors.text, fontFamily: 'DMSans_400Regular', lineHeight: 22 }}>
              {existingCampaign.offer}
            </Text>
          </View>

          {/* Content preview */}
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
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 }}>Content Preview</Text>
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold' }}>
              {existingCampaign.headline}
            </Text>
            <View style={{ backgroundColor: colors.surfaceSecondary, borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: colors.primary }}>
              <Text style={{ fontSize: 14, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', lineHeight: 20, fontStyle: 'italic' }}>
                {existingCampaign.caption}
              </Text>
            </View>
          </View>

          {/* Approval notice */}
          <View
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: 'rgba(245, 158, 11, 0.20)',
              flexDirection: 'row',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={16} color={colors.accent} style={{ marginTop: 1 }} />
            <Text style={{ flex: 1, fontSize: 13, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', lineHeight: 18 }}>
              Human approval required before publishing. Review the content carefully before approving.
            </Text>
          </View>

          {/* Actions */}
          <View style={{ gap: 10 }}>
            <AnimatedPressable
              onPress={() => {
                console.log('[Campaign] Approve & Schedule pressed for:', existingCampaign.id);
                setApproved(true);
              }}
            >
              <View style={{ backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', fontFamily: 'DMSans_700Bold' }}>
                  {approved ? '✓ Approved' : 'Approve & Schedule'}
                </Text>
              </View>
            </AnimatedPressable>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <AnimatedPressable
                onPress={() => {
                  console.log('[Campaign] Edit pressed for:', existingCampaign.id);
                }}
                style={{ flex: 1 }}
              >
                <View style={{ backgroundColor: colors.primaryMuted, borderRadius: 12, paddingVertical: 13, alignItems: 'center' }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primary, fontFamily: 'DMSans_600SemiBold' }}>Edit</Text>
                </View>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => {
                  console.log('[Campaign] Discard pressed for:', existingCampaign.id);
                  router.back();
                }}
                style={{ flex: 1 }}
              >
                <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.10)', borderRadius: 12, paddingVertical: 13, alignItems: 'center' }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.danger, fontFamily: 'DMSans_600SemiBold' }}>Discard</Text>
                </View>
              </AnimatedPressable>
            </View>
          </View>
        </Animated.ScrollView>
      </>
    );
  }

  // New campaign builder
  return (
    <>
      <Stack.Screen options={{ title: 'New Campaign', headerBackButtonDisplayMode: 'minimal' }} />
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Campaign type selector */}
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
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold' }}>
            Campaign Type
          </Text>
          {CAMPAIGN_TYPES.map((type) => {
            const isSelected = selectedType.id === type.id;
            return (
              <AnimatedPressable
                key={type.id}
                onPress={() => {
                  console.log('[Campaign] Type selected:', type.id);
                  setSelectedType(type);
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: isSelected ? colors.primaryMuted : colors.surfaceSecondary,
                    borderWidth: 1.5,
                    borderColor: isSelected ? colors.primary : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{type.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: isSelected ? colors.primary : colors.text,
                        fontFamily: 'DMSans_600SemiBold',
                      }}
                    >
                      {type.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        fontFamily: 'DMSans_400Regular',
                        marginTop: 2,
                      }}
                      numberOfLines={1}
                    >
                      {type.description}
                    </Text>
                  </View>
                  {isSelected && <CheckCircle size={18} color={colors.primary} />}
                </View>
              </AnimatedPressable>
            );
          })}
        </View>

        {/* Channels */}
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
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold' }}>
            Channels
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Instagram', 'Email', 'SMS'].map((ch) => (
              <ChannelChip
                key={ch}
                channel={ch}
                selected={selectedChannels.includes(ch)}
                onPress={() => toggleChannel(ch)}
              />
            ))}
          </View>
        </View>

        {/* AI-generated content preview */}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold' }}>
              AI-Generated Content
            </Text>
            <View style={{ backgroundColor: colors.primaryMuted, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: colors.primary, fontFamily: 'DMSans_600SemiBold' }}>Preview</Text>
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', marginBottom: 6 }}>Headline</Text>
            <View style={{ backgroundColor: colors.surfaceSecondary, borderRadius: 10, padding: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, fontFamily: 'DMSans_700Bold' }}>
                Beat the Tuesday Slump 🍹
              </Text>
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textTertiary, fontFamily: 'DMSans_600SemiBold', marginBottom: 6 }}>Caption</Text>
            <View style={{ backgroundColor: colors.surfaceSecondary, borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: colors.primary }}>
              <Text style={{ fontSize: 14, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', lineHeight: 20, fontStyle: 'italic' }}>
                "Your favorite spot just got even better on Tuesdays. Half-price apps and $2 off cocktails from 2–5 PM. See you soon! 🍽️"
              </Text>
            </View>
          </View>
        </View>

        {/* Approval notice */}
        <View
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: 'rgba(245, 158, 11, 0.20)',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <AlertTriangle size={16} color={colors.accent} />
          <Text style={{ flex: 1, fontSize: 13, color: colors.textSecondary, fontFamily: 'DMSans_400Regular', lineHeight: 18 }}>
            Human approval required before publishing. You'll review the final content before it goes live.
          </Text>
        </View>

        {/* Create button */}
        <AnimatedPressable
          onPress={() => {
            console.log('[Campaign] Create Campaign pressed, type:', selectedType.id, 'channels:', selectedChannels);
            router.back();
          }}
        >
          <View style={{ backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', fontFamily: 'DMSans_700Bold' }}>
              Create Campaign
            </Text>
          </View>
        </AnimatedPressable>

        <AnimatedPressable onPress={() => {
          console.log('[Campaign] Cancel new campaign pressed');
          router.back();
        }}>
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }}>Cancel</Text>
          </View>
        </AnimatedPressable>
      </Animated.ScrollView>
    </>
  );
}
