import React from 'react';
import { View, Text } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: object;
}

export function MetricCard({
  label,
  value,
  subtext,
  trend,
  trendLabel,
  icon,
  onPress,
  style,
}: MetricCardProps) {
  const colors = useColors();

  const trendColor = trend !== undefined
    ? trend >= 0 ? colors.primary : colors.accent
    : undefined;

  const trendDisplay = trendLabel ?? (trend !== undefined ? `${trend > 0 ? '+' : ''}${trend}%` : undefined);

  const cardContent = (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
          flex: 1,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '600',
            color: colors.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontFamily: 'DMSans_600SemiBold',
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
        {icon}
      </View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          color: colors.text,
          fontFamily: 'DMSans_700Bold',
          letterSpacing: -0.3,
          fontVariant: ['tabular-nums'],
        }}
        numberOfLines={1}
      >
        {value}
      </Text>
      {(subtext || trendDisplay) && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
          {trendDisplay && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              {trend !== undefined && trend >= 0 ? (
                <TrendingUp size={12} color={trendColor} />
              ) : trend !== undefined ? (
                <TrendingDown size={12} color={trendColor} />
              ) : null}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: trendColor ?? colors.textSecondary,
                  fontFamily: 'DMSans_600SemiBold',
                }}
              >
                {trendDisplay}
              </Text>
            </View>
          )}
          {subtext && (
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                fontFamily: 'DMSans_400Regular',
              }}
              numberOfLines={1}
            >
              {subtext}
            </Text>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable onPress={onPress} style={{ flex: 1 }}>
        {cardContent}
      </AnimatedPressable>
    );
  }

  return cardContent;
}
