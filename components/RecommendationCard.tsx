import React from 'react';
import { View, Text } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { AIRecommendation } from '@/data/mockRestaurant';
import { ChevronRight, TrendingUp, CheckCircle, BarChart2, AlertTriangle, Zap } from 'lucide-react-native';

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  compact?: boolean;
  onPress?: () => void;
  onAction?: () => void;
}

const PRIORITY_COLORS: Record<number, string> = {
  1: '#EF4444',
  2: '#F97316',
  3: '#F59E0B',
  4: '#3B82F6',
  5: '#0D9488',
};

const DATA_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  verified_fact: { label: 'Verified Fact', icon: null, color: '#16A34A' },
  verified_trend: { label: 'Verified Trend', icon: null, color: '#0D9488' },
  prediction: { label: 'Prediction', icon: null, color: '#3B82F6' },
  assumption: { label: 'Assumption', icon: null, color: '#F59E0B' },
};

const TYPE_LABELS: Record<string, string> = {
  revenue: 'Revenue',
  operations: 'Operations',
  marketing: 'Marketing',
  labor: 'Labor',
  menu: 'Menu',
};

function DataTypeIndicator({ dataType }: { dataType: string }) {
  const colors = useColors();
  const config = DATA_TYPE_CONFIG[dataType] ?? { label: dataType, color: colors.textSecondary };

  const getEmoji = () => {
    switch (dataType) {
      case 'verified_fact': return '✓';
      case 'verified_trend': return '📊';
      case 'prediction': return '🔮';
      case 'assumption': return '⚠️';
      default: return '•';
    }
  };

  const emoji = getEmoji();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: `${config.color}15`,
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 3,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontSize: 10 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: '600',
          color: config.color,
          fontFamily: 'DMSans_600SemiBold',
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}

export function RecommendationCard({
  recommendation: rec,
  compact = false,
  onPress,
  onAction,
}: RecommendationCardProps) {
  const colors = useColors();
  const priorityColor = PRIORITY_COLORS[rec.priority] ?? colors.primary;
  const typeLabel = TYPE_LABELS[rec.type] ?? rec.type;

  if (compact) {
    return (
      <AnimatedPressable onPress={onPress}>
        <View
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
          {/* Priority badge */}
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: priorityColor,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#FFFFFF',
                fontFamily: 'DMSans_700Bold',
              }}
            >
              {rec.priority}
            </Text>
          </View>

          {/* Content */}
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.text,
                fontFamily: 'DMSans_600SemiBold',
              }}
              numberOfLines={1}
            >
              {rec.problem}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  backgroundColor: colors.primaryMuted,
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: colors.primary,
                    fontFamily: 'DMSans_600SemiBold',
                  }}
                >
                  {typeLabel}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.textTertiary,
                  fontFamily: 'DMSans_400Regular',
                }}
              >
                {rec.confidence}% confidence
              </Text>
            </View>
          </View>

          <ChevronRight size={16} color={colors.textTertiary} />
        </View>
      </AnimatedPressable>
    );
  }

  // Full card
  return (
    <AnimatedPressable onPress={onPress}>
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
        {/* Top row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: priorityColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#FFFFFF',
                fontFamily: 'DMSans_700Bold',
              }}
            >
              {rec.priority}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colors.primaryMuted,
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: colors.primary,
                fontFamily: 'DMSans_600SemiBold',
              }}
            >
              {typeLabel}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: colors.accent,
                fontFamily: 'DMSans_600SemiBold',
              }}
            >
              {rec.confidence}% confidence
            </Text>
          </View>
          <DataTypeIndicator dataType={rec.dataType} />
        </View>

        {/* Problem */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: colors.text,
            fontFamily: 'DMSans_700Bold',
            lineHeight: 22,
          }}
        >
          {rec.problem}
        </Text>

        {/* Evidence */}
        <Text
          style={{
            fontSize: 14,
            color: colors.textSecondary,
            fontFamily: 'DMSans_400Regular',
            lineHeight: 20,
          }}
        >
          {rec.evidence}
        </Text>

        {/* Recommendation */}
        <View
          style={{
            borderLeftWidth: 3,
            borderLeftColor: colors.primary,
            paddingLeft: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.text,
              fontFamily: 'DMSans_400Regular',
              lineHeight: 20,
            }}
          >
            {rec.recommendation}
          </Text>
        </View>

        {/* Expected impact */}
        {rec.expectedImpact && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={14} color={colors.accent} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: colors.accent,
                fontFamily: 'DMSans_600SemiBold',
              }}
            >
              {rec.expectedImpact}
            </Text>
          </View>
        )}

        {/* Tags */}
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {rec.tags.map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: colors.surfaceSecondary,
                borderRadius: 6,
                paddingHorizontal: 8,
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
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {/* Action button */}
        {rec.actionLabel && (
          <AnimatedPressable
            onPress={() => {
              console.log('[RecommendationCard] Action pressed:', rec.actionLabel, 'rec_id:', rec.id);
              onAction?.();
            }}
          >
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 13,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  fontFamily: 'DMSans_600SemiBold',
                }}
              >
                {rec.actionLabel}
              </Text>
            </View>
          </AnimatedPressable>
        )}
      </View>
    </AnimatedPressable>
  );
}
