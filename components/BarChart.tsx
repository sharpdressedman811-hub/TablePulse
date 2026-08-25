import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface BarChartDataPoint {
  label: string;
  value: number | null;
  projected?: number | null;
  baseline?: number | null;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  height?: number;
  color?: string;
  showBaseline?: boolean;
  showProjected?: boolean;
  showLabels?: boolean;
}

export function BarChart({
  data,
  height = 140,
  color,
  showBaseline = false,
  showProjected = false,
  showLabels = true,
}: BarChartProps) {
  const colors = useColors();
  const barColor = color ?? colors.primary;
  const animProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animProgress, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [animProgress]);

  // Compute max value across all data
  const allValues = data.flatMap((d) => [
    d.value ?? 0,
    showProjected ? (d.projected ?? 0) : 0,
    showBaseline ? (d.baseline ?? 0) : 0,
  ]);
  const maxValue = Math.max(...allValues, 1);

  return (
    <View style={{ height: height + (showLabels ? 24 : 0) }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
        {data.map((item, index) => {
          const actualHeight = item.value !== null && item.value !== undefined
            ? (item.value / maxValue) * height
            : 0;
          const projectedHeight = item.projected !== null && item.projected !== undefined
            ? (item.projected / maxValue) * height
            : 0;
          const baselineHeight = item.baseline !== null && item.baseline !== undefined
            ? (item.baseline / maxValue) * height
            : 0;

          const hasActual = item.value !== null && item.value !== undefined;
          const hasProjected = showProjected && item.projected !== null && item.projected !== undefined;

          return (
            <View key={index} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ width: '100%', height, justifyContent: 'flex-end', position: 'relative' }}>
                {/* Baseline line */}
                {showBaseline && baselineHeight > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: baselineHeight,
                      left: 0,
                      right: 0,
                      height: 1.5,
                      backgroundColor: colors.accent,
                      opacity: 0.6,
                      zIndex: 2,
                    }}
                  />
                )}
                {/* Projected bar */}
                {hasProjected && (
                  <Animated.View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: animProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, projectedHeight],
                      }),
                      backgroundColor: barColor,
                      opacity: 0.25,
                      borderRadius: 3,
                      borderWidth: 1,
                      borderColor: barColor,
                      borderStyle: 'dashed',
                    }}
                  />
                )}
                {/* Actual bar */}
                {hasActual && (
                  <Animated.View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: animProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, actualHeight],
                      }),
                      backgroundColor: barColor,
                      borderRadius: 3,
                      borderCurve: 'continuous',
                    }}
                  />
                )}
              </View>
              {showLabels && (
                <Text
                  style={{
                    fontSize: 9,
                    color: colors.textTertiary,
                    marginTop: 4,
                    fontFamily: 'DMSans_400Regular',
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
