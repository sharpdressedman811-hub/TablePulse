import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useLayout } from '@/hooks/useLayout';
import { SkeletonScreen } from '@/components/SkeletonLoader';
import { POV_REPORT, classifyScore } from '@/data/mockPOV';
import {
  Star,
  Target,
  CheckCircle,
  XCircle,
  ChevronRight,
  TrendingUp,
  Award,
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

export default function ProofOfValueScreen() {
  const colors = useColors();
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

  const report = POV_REPORT;
  const classification = classifyScore(report.overallScore);
  const scoreBreakdownItems = Object.values(report.scoreBreakdown);

  const winPctDiff = Math.round(((report.biggestWin.actual - report.biggestWin.predicted) / report.biggestWin.predicted) * 100);
  const winPctText = `+${winPctDiff}%`;
  const missActualText = '$0 (unmeasured)';

  const captureRateText = `Capture rate: ${report.captureRate}% of identified opportunity — UNMEASURED opportunities excluded`;

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
                Proof of Value
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'DMSans_400Regular',
                color: colors.textSecondary,
                marginTop: 2,
              }}>
                {report.period}
                {' · '}
                The Golden Fork Group
              </Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.primary,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
              gap: 4,
            }}>
              <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={{
                fontSize: 13,
                fontFamily: 'DMSans_700Bold',
                color: '#FFFFFF',
              }}>
                87/100
              </Text>
            </View>
          </View>
        </AnimatedListItem>

        {/* Section B: Score Hero Card */}
        <AnimatedListItem index={1}>
          <View style={{
            backgroundColor: colors.primary,
            borderRadius: 20,
            padding: 24,
            marginBottom: 20,
          }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text style={{
                fontSize: 64,
                fontFamily: 'DMSans_700Bold',
                color: '#FFFFFF',
                lineHeight: 72,
              }}>
                {report.overallScore}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginTop: 4,
                gap: 4,
              }}>
                <CheckCircle size={14} color="#FFFFFF" />
                <Text style={{
                  fontSize: 13,
                  fontFamily: 'DMSans_600SemiBold',
                  color: '#FFFFFF',
                }}>
                  {classification.label}
                </Text>
              </View>
            </View>

            <Text style={{
              fontSize: 13,
              fontFamily: 'DMSans_400Regular',
              color: 'rgba(255,255,255,0.75)',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              {'Rolling 90-day average: '}
              {report.rollingAverage90Day}
              {' · '}
              {report.reportsInAverage}
              {' reports'}
            </Text>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              gap: 4,
            }}>
              <TrendingUp size={14} color="#F59E0B" />
              <Text style={{
                fontSize: 13,
                fontFamily: 'DMSans_600SemiBold',
                color: '#F59E0B',
              }}>
                +{report.scoreDelta} pts vs last month
              </Text>
            </View>

            {/* Progress bar with target marker */}
            <View style={{ position: 'relative', height: 8 }}>
              <View style={{
                height: 6,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 3,
                overflow: 'hidden',
                marginTop: 1,
              }}>
                <View style={{
                  width: `${report.overallScore}%`,
                  height: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 3,
                }} />
              </View>
              {/* Target marker at 85 */}
              <View style={{
                position: 'absolute',
                left: `${85}%`,
                top: -2,
                width: 2,
                height: 10,
                backgroundColor: '#F59E0B',
                borderRadius: 1,
              }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={{ fontSize: 10, fontFamily: 'DMSans_400Regular', color: 'rgba(255,255,255,0.5)' }}>0</Text>
              <Text style={{ fontSize: 10, fontFamily: 'DMSans_400Regular', color: '#F59E0B' }}>Target: 85</Text>
              <Text style={{ fontSize: 10, fontFamily: 'DMSans_400Regular', color: 'rgba(255,255,255,0.5)' }}>100</Text>
            </View>
          </View>
        </AnimatedListItem>

        {/* Section C: Score Breakdown */}
        <AnimatedListItem index={2}>
          <Text style={{
            fontSize: 17,
            fontFamily: 'DMSans_700Bold',
            color: colors.text,
            marginBottom: 10,
          }}>
            Score Breakdown
          </Text>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            marginBottom: 20,
            gap: 14,
          }}>
            {scoreBreakdownItems.map((dim) => {
              const fillPct = (dim.score / dim.max) * 100;
              const scoreText = `${dim.score}/${dim.max}`;
              return (
                <View key={dim.label}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'DMSans_400Regular',
                      color: colors.text,
                    }}>
                      {dim.label}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'DMSans_600SemiBold',
                      color: colors.primary,
                    }}>
                      {scoreText}
                    </Text>
                  </View>
                  <View style={{
                    height: 4,
                    backgroundColor: colors.primaryMuted,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <View style={{
                      width: `${fillPct}%`,
                      height: '100%',
                      backgroundColor: colors.primary,
                      borderRadius: 2,
                    }} />
                  </View>
                </View>
              );
            })}
          </View>
        </AnimatedListItem>

        {/* Section D: Financial Summary */}
        <AnimatedListItem index={3}>
          <Text style={{
            fontSize: 17,
            fontFamily: 'DMSans_700Bold',
            color: colors.text,
            marginBottom: 10,
          }}>
            Financial Impact
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 10,
          }}>
            {[
              { label: 'Revenue Identified', value: '$4,200' },
              { label: 'Measured Revenue', value: '$1,420' },
              { label: 'Cost Savings', value: '$380' },
              { label: 'Estimated ROI', value: '4.7x' },
            ].map((tile) => (
              <View key={tile.label} style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: colors.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 14,
              }}>
                <Text style={{
                  fontSize: 20,
                  fontFamily: 'DMSans_700Bold',
                  color: colors.primary,
                  marginBottom: 2,
                }}>
                  {tile.value}
                </Text>
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'DMSans_400Regular',
                  color: colors.textSecondary,
                }}>
                  {tile.label}
                </Text>
              </View>
            ))}
          </View>
          <View style={{
            backgroundColor: colors.primaryMuted,
            borderRadius: 10,
            padding: 12,
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 12,
              fontFamily: 'DMSans_400Regular',
              color: colors.textSecondary,
              lineHeight: 18,
            }}>
              {captureRateText}
            </Text>
          </View>
        </AnimatedListItem>

        {/* Section E: Recommendation Summary */}
        <AnimatedListItem index={4}>
          <Text style={{
            fontSize: 17,
            fontFamily: 'DMSans_700Bold',
            color: colors.text,
            marginBottom: 10,
          }}>
            Recommendations
          </Text>
          <View style={{
            flexDirection: 'row',
            gap: 8,
            marginBottom: 20,
          }}>
            {[
              { value: String(report.opportunitiesIdentified), label: 'Identified' },
              { value: String(report.recommendationsAccepted), label: 'Accepted' },
              { value: String(report.actionsCompleted), label: 'Completed' },
              { value: `${report.recommendationAccuracy}%`, label: 'Accuracy' },
            ].map((tile) => (
              <View key={tile.label} style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 20,
                  fontFamily: 'DMSans_700Bold',
                  color: colors.text,
                  marginBottom: 2,
                }}>
                  {tile.value}
                </Text>
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'DMSans_400Regular',
                  color: colors.textSecondary,
                  textAlign: 'center',
                }}>
                  {tile.label}
                </Text>
              </View>
            ))}
          </View>
        </AnimatedListItem>

        {/* Section F: Biggest Win */}
        <AnimatedListItem index={5}>
          <View style={{
            backgroundColor: 'rgba(22, 163, 74, 0.06)',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(22, 163, 74, 0.2)',
            padding: 16,
            marginBottom: 12,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <CheckCircle size={14} color="#16A34A" />
              <Text style={{
                fontSize: 11,
                fontFamily: 'DMSans_600SemiBold',
                color: '#16A34A',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                Biggest Win
              </Text>
            </View>
            <Text style={{
              fontSize: 16,
              fontFamily: 'DMSans_700Bold',
              color: colors.text,
              marginBottom: 6,
            }}>
              {report.biggestWin.title}
            </Text>
            <Text style={{
              fontSize: 13,
              fontFamily: 'DMSans_400Regular',
              color: colors.textSecondary,
              lineHeight: 20,
              marginBottom: 12,
            }}>
              {report.biggestWin.description}
            </Text>
            <View style={{ gap: 4, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, fontFamily: 'DMSans_400Regular', color: colors.textSecondary }}>
                  Predicted
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'DMSans_600SemiBold', color: colors.text }}>
                  ${report.biggestWin.predicted}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, fontFamily: 'DMSans_400Regular', color: colors.textSecondary }}>
                  Actual
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 13, fontFamily: 'DMSans_700Bold', color: '#16A34A' }}>
                    ${report.biggestWin.actual}
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: 'DMSans_600SemiBold', color: '#16A34A' }}>
                    {winPctText}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{
              height: 1,
              backgroundColor: 'rgba(22, 163, 74, 0.15)',
              marginBottom: 10,
            }} />
            <Text style={{ fontSize: 12, fontFamily: 'DMSans_400Regular', color: colors.textSecondary }}>
              {'Methodology: '}
              {report.biggestWin.methodology}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: 'DMSans_400Regular', color: colors.textSecondary, marginTop: 2 }}>
              {report.biggestWin.confidence}
              {'% confidence at recommendation'}
            </Text>
          </View>
        </AnimatedListItem>

        {/* Section G: Biggest Miss */}
        <AnimatedListItem index={6}>
          <View style={{
            backgroundColor: 'rgba(239, 68, 68, 0.06)',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(239, 68, 68, 0.2)',
            padding: 16,
            marginBottom: 20,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <XCircle size={14} color="#EF4444" />
              <Text style={{
                fontSize: 11,
                fontFamily: 'DMSans_600SemiBold',
                color: '#EF4444',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                Biggest Miss
              </Text>
            </View>
            <Text style={{
              fontSize: 16,
              fontFamily: 'DMSans_700Bold',
              color: colors.text,
              marginBottom: 6,
            }}>
              {report.biggestMiss.title}
            </Text>
            <Text style={{
              fontSize: 13,
              fontFamily: 'DMSans_400Regular',
              color: colors.textSecondary,
              lineHeight: 20,
              marginBottom: 12,
            }}>
              {report.biggestMiss.description}
            </Text>
            <View style={{ gap: 4, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, fontFamily: 'DMSans_400Regular', color: colors.textSecondary }}>
                  Predicted
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'DMSans_600SemiBold', color: colors.text }}>
                  ${report.biggestMiss.predicted}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, fontFamily: 'DMSans_400Regular', color: colors.textSecondary }}>
                  Actual
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'DMSans_700Bold', color: '#EF4444' }}>
                  {missActualText}
                </Text>
              </View>
            </View>
            <View style={{
              height: 1,
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              marginBottom: 10,
            }} />
            <Text style={{ fontSize: 12, fontFamily: 'DMSans_400Regular', color: colors.textSecondary, marginBottom: 6 }}>
              {'Root cause: '}
              {report.biggestMiss.rootCause}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
              <Zap size={12} color={colors.primary} style={{ marginTop: 1 }} />
              <Text style={{ fontSize: 12, fontFamily: 'DMSans_400Regular', color: colors.primary, flex: 1 }}>
                {'Fix applied: '}
                {report.biggestMiss.fix}
              </Text>
            </View>
          </View>
        </AnimatedListItem>

        {/* Section H: What We Learned */}
        <AnimatedListItem index={7}>
          <Text style={{
            fontSize: 17,
            fontFamily: 'DMSans_700Bold',
            color: colors.text,
            marginBottom: 10,
          }}>
            What We Learned
          </Text>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            borderLeftWidth: 3,
            borderLeftColor: colors.primary,
            padding: 16,
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: 'DMSans_400Regular',
              color: colors.text,
              lineHeight: 22,
            }}>
              {report.learned}
            </Text>
          </View>
        </AnimatedListItem>

        {/* Section I: Next Opportunities */}
        <AnimatedListItem index={8}>
          <Text style={{
            fontSize: 17,
            fontFamily: 'DMSans_700Bold',
            color: colors.text,
            marginBottom: 10,
          }}>
            Next Opportunities
          </Text>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
            marginBottom: 20,
          }}>
            {report.nextOpportunities.map((opp, idx) => {
              const isLast = idx === report.nextOpportunities.length - 1;
              const impactText = `$${opp.impact.toLocaleString()}`;
              const confidenceText = `${opp.confidence}%`;
              return (
                <TouchableOpacity
                  key={opp.title}
                  onPress={() => console.log('[POV] Next opportunity pressed:', opp.title)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: colors.divider,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'DMSans_600SemiBold',
                      color: colors.text,
                      marginBottom: 4,
                    }}>
                      {opp.title}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{
                        fontSize: 13,
                        fontFamily: 'DMSans_700Bold',
                        color: colors.primary,
                      }}>
                        {impactText}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'DMSans_400Regular',
                        color: colors.textSecondary,
                      }}>
                        {confidenceText}
                        {' confidence'}
                      </Text>
                      <View style={{
                        backgroundColor: colors.primaryMuted,
                        borderRadius: 6,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                      }}>
                        <Text style={{
                          fontSize: 10,
                          fontFamily: 'DMSans_600SemiBold',
                          color: colors.primary,
                          textTransform: 'uppercase',
                          letterSpacing: 0.3,
                        }}>
                          {opp.period}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <ChevronRight size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              );
            })}
          </View>
        </AnimatedListItem>

        {/* Section J: Honesty Footer */}
        <AnimatedListItem index={9}>
          <View style={{
            paddingHorizontal: 4,
            paddingBottom: 8,
          }}>
            <Text style={{
              fontSize: 11,
              fontFamily: 'DMSans_400Regular',
              color: colors.textTertiary,
              fontStyle: 'italic',
              lineHeight: 17,
              textAlign: 'center',
            }}>
              TablePulse distinguishes projected revenue from measured revenue. Scores reflect actual outcomes only. Unmeasured results are labeled UNMEASURED — never converted to success.
            </Text>
          </View>
        </AnimatedListItem>

      </View>
    </Animated.ScrollView>
  );
}
