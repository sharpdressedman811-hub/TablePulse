import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface SkeletonLineProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function SkeletonLine({ width = '100%', height = 14, borderRadius, style }: SkeletonLineProps) {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: borderRadius ?? height / 2,
          backgroundColor: colors.surfaceSecondary,
          opacity,
        },
        style,
      ]}
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
  style?: object;
}

export function SkeletonCard({ lines = 3, style }: SkeletonCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 10,
        },
        style,
      ]}
    >
      <SkeletonLine width="60%" height={16} />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 2 ? '80%' : '100%'} height={12} />
      ))}
    </View>
  );
}

interface SkeletonScreenProps {
  cards?: number;
}

export function SkeletonScreen({ cards = 3 }: SkeletonScreenProps) {
  return (
    <View style={{ gap: 12, padding: 16 }}>
      <SkeletonLine width="50%" height={28} />
      <SkeletonLine width="70%" height={14} />
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} lines={3} />
      ))}
    </View>
  );
}
