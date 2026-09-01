import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  FileText,
  BarChart2,
  DollarSign,
  Zap,
  Target,
} from 'lucide-react-native';
import { BarChart } from '@/components/BarChart';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import {
  businessMetrics,
  productMetrics,
  weeklyActiveUsers,
  valueMetrics,
  unitEconomicsMetrics,
} from '@/data/mockFounderMetrics';

// ─── Design tokens (always dark, Bloomberg-terminal aesthetic) ───────────────
const D = {
  bg: '#0A0A0A',
  surface: '#141414',
  surfaceElevated: '#1C1C1C',
  teal: '#00C9A7',
  tealMuted: 'rgba(0, 201, 167, 0.12)',
  tealDim: 'rgba(0, 201, 167, 0.06)',
  amber: '#F59E0B',
  red: '#EF4444',
  green: '#22C55E',
  text: '#F0F0F0',
  textSecondary: '#9A9A9A',
  textTertiary: '#555555',
  border: 'rgba(255,255,255,0.07)',
  divider: 'rgba(255,255,255,0.04)',
};

// ─── Trend indicator ─────────────────────────────────────────────────────────
function TrendBadge({ trend, trendLabel }: { trend: number; trendLabel: string }) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;
  const isNeutral = trend === 0;

  // For churn and CAC, negative is good
  const isInverseMetric = trendLabel.startsWith('-') && (
    trendLabel.includes('pts') || trendLabel.includes('$')
  );

  let color = D.textSecondary;
  let Icon = Minus;

  if (isNeutral) {
    // Parse trendLabel for direction hints
    if (trendLabel.startsWith('↑')) { color = D.teal; Icon = TrendingUp; }
    else if (trendLabel.startsWith('↓')) { color = D.teal; Icon = TrendingDown; }
    else if (trendLabel.startsWith('→')) { color = D.textSecondary; Icon = Minus; }
    else { color = D.textSecondary; Icon = Minus; }
  } else if (isPositive) {
    color = D.teal;
    Icon = TrendingUp;
  } else if (isNegative) {
    // Negative trend on inverse metrics (churn, CAC) is good
    color = isInverseMetric ? D.teal : D.red;
    Icon = TrendingDown;
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Icon size={11} color={color} strokeWidth={2.5} />
      <Text style={{ fontSize: 11, fontWeight: '600', color, fontFamily: 'DMSans_600SemiBold' }}>
        {trendLabel}
      </Text>
    </View>
  );
}

// ─── Dark MetricCard override ─────────────────────────────────────────────────
function DarkMetricCard({
  label,
  value,
  subtext,
  trend,
  trendLabel,
}: {
  label: string;
  value: string;
  subtext?: string;
  trend: number;
  trendLabel: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: D.surface,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: D.border,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: '600',
          color: D.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          fontFamily: 'DMSans_600SemiBold',
          marginBottom: 6,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: D.text,
          fontFamily: 'DMSans_700Bold',
          letterSpacing: -0.3,
          marginBottom: 4,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
      <TrendBadge trend={trend} trendLabel={trendLabel} />
      {subtext ? (
        <Text
          style={{
            fontSize: 10,
            color: D.textTertiary,
            fontFamily: 'DMSans_400Regular',
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {subtext}
        </Text>
      ) : null}
    </View>
  );
}

// ─── Section header with collapse toggle ─────────────────────────────────────
function SectionHeader({
  title,
  subtitle,
  icon,
  isOpen,
  onToggle,
  index,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <AnimatedPressable
        onPress={() => {
          console.log(`[FounderDashboard] Section toggled: ${title}, now ${isOpen ? 'collapsed' : 'expanded'}`);
          onToggle();
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: D.surfaceElevated,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: D.border,
            gap: 12,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: D.tealMuted,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: D.text,
                fontFamily: 'DMSans_700Bold',
                letterSpacing: -0.2,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: D.textSecondary,
                fontFamily: 'DMSans_400Regular',
                marginTop: 1,
              }}
            >
              {subtitle}
            </Text>
          </View>
          {isOpen ? (
            <ChevronUp size={18} color={D.textTertiary} />
          ) : (
            <ChevronDown size={18} color={D.textTertiary} />
          )}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ─── 2-column metric grid ─────────────────────────────────────────────────────
function MetricGrid({ metrics }: { metrics: typeof businessMetrics }) {
  const rows: (typeof businessMetrics)[] = [];
  for (let i = 0; i < metrics.length; i += 2) {
    rows.push(metrics.slice(i, i + 2));
  }

  return (
    <View style={{ gap: 8 }}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={{ flexDirection: 'row', gap: 8 }}>
          {row.map((m, colIdx) => (
            <DarkMetricCard
              key={colIdx}
              label={m.label}
              value={m.value}
              subtext={m.subtext}
              trend={m.trend}
              trendLabel={m.trendLabel}
            />
          ))}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}

// ─── Value bar comparison ─────────────────────────────────────────────────────
function ValueBar() {
  const subCostWidth = useRef(new Animated.Value(0)).current;
  const valueWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(subCostWidth, {
          toValue: 1,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(valueWidth, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, []);

  // $346 subscription vs $1,627 value — ratio 4.7x
  // subscription bar = 346/1627 = 21.3% of full width
  const subPct = (346 / 1627) * 100;

  return (
    <View
      style={{
        backgroundColor: D.surface,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: D.border,
        gap: 14,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: D.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          fontFamily: 'DMSans_600SemiBold',
        }}
      >
        Subscription Cost vs. Value Delivered
      </Text>

      {/* Subscription cost bar */}
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: D.textSecondary, fontFamily: 'DMSans_400Regular' }}>
            Avg monthly subscription
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: D.text, fontFamily: 'DMSans_700Bold' }}>
            $346
          </Text>
        </View>
        <View style={{ height: 8, backgroundColor: D.surfaceElevated, borderRadius: 4, overflow: 'hidden' }}>
          <Animated.View
            style={{
              height: '100%',
              width: subCostWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', `${subPct}%`],
              }),
              backgroundColor: D.textSecondary,
              borderRadius: 4,
            }}
          />
        </View>
      </View>

      {/* Value delivered bar */}
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: D.textSecondary, fontFamily: 'DMSans_400Regular' }}>
            Avg measured value delivered
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: D.teal, fontFamily: 'DMSans_700Bold' }}>
            $1,627
          </Text>
        </View>
        <View style={{ height: 8, backgroundColor: D.surfaceElevated, borderRadius: 4, overflow: 'hidden' }}>
          <Animated.View
            style={{
              height: '100%',
              width: valueWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: D.teal,
              borderRadius: 4,
            }}
          />
        </View>
      </View>

      {/* Ratio callout */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: D.tealMuted,
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: '800', color: D.teal, fontFamily: 'DMSans_700Bold', letterSpacing: -0.5 }}>
          4.7x
        </Text>
        <Text style={{ fontSize: 13, color: D.teal, fontFamily: 'DMSans_400Regular' }}>
          return on subscription cost
        </Text>
      </View>
    </View>
  );
}

// ─── Break-even progress bar ──────────────────────────────────────────────────
function BreakEvenBar() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(progress, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const pct = (41 / 122) * 100; // 33.6%

  return (
    <View
      style={{
        backgroundColor: D.surface,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: D.border,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: D.textTertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              fontFamily: 'DMSans_600SemiBold',
            }}
          >
            Path to Break-even
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '800',
              color: D.text,
              fontFamily: 'DMSans_700Bold',
              letterSpacing: -0.5,
              marginTop: 4,
            }}
          >
            41 / 122
          </Text>
          <Text style={{ fontSize: 12, color: D.textSecondary, fontFamily: 'DMSans_400Regular' }}>
            restaurants
          </Text>
        </View>
        <View
          style={{
            backgroundColor: D.tealMuted,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: D.teal, fontFamily: 'DMSans_700Bold' }}>
            34%
          </Text>
          <Text style={{ fontSize: 10, color: D.teal, fontFamily: 'DMSans_400Regular', textAlign: 'center' }}>
            of target
          </Text>
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <View style={{ height: 12, backgroundColor: D.surfaceElevated, borderRadius: 6, overflow: 'hidden' }}>
          <Animated.View
            style={{
              height: '100%',
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', `${pct}%`],
              }),
              backgroundColor: D.teal,
              borderRadius: 6,
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 11, color: D.textTertiary, fontFamily: 'DMSans_400Regular' }}>
            0
          </Text>
          <Text style={{ fontSize: 11, color: D.textTertiary, fontFamily: 'DMSans_400Regular' }}>
            Break-even: 122 restaurants
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Collapsible section wrapper ──────────────────────────────────────────────
function CollapsibleSection({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = true,
  index,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const heightAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggle = useCallback(() => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);
    Animated.timing(heightAnim, {
      toValue,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [isOpen, heightAnim]);

  return (
    <View style={{ gap: 12 }}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        isOpen={isOpen}
        onToggle={toggle}
        index={index}
      />
      {isOpen && (
        <View style={{ gap: 12 }}>
          {children}
        </View>
      )}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function FounderDashboard() {
  const insets = useSafeAreaInsets();
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    console.log('[FounderDashboard] Screen mounted — loading founder metrics');
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(headerTranslate, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleExportPDF = useCallback(() => {
    console.log('[FounderDashboard] Export as PDF tapped');
    if (Platform.OS === 'android') {
      ToastAndroid.show('PDF export coming soon', ToastAndroid.SHORT);
    } else {
      Alert.alert('Coming Soon', 'PDF export will be available in the next release.');
    }
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={{ flex: 1, backgroundColor: D.bg }}>
        {/* Custom header */}
        <Animated.View
          style={{
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
            paddingTop: insets.top + 8,
            paddingHorizontal: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: D.border,
            backgroundColor: D.bg,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AnimatedPressable
              onPress={() => {
                console.log('[FounderDashboard] Back button pressed');
                router.back();
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: D.surfaceElevated,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: D.border,
              }}
            >
              <ArrowLeft size={18} color={D.textSecondary} />
            </AnimatedPressable>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: D.text,
                  fontFamily: 'DMSans_700Bold',
                  letterSpacing: -0.4,
                }}
              >
                Founder Dashboard
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: D.teal,
                  fontFamily: 'DMSans_400Regular',
                  marginTop: 1,
                }}
              >
                TablePulse · Investor View
              </Text>
            </View>
            {/* Live indicator */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: D.tealMuted,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: D.teal,
                }}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: D.teal,
                  fontFamily: 'DMSans_600SemiBold',
                }}
              >
                DEMO
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Scrollable content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: insets.bottom + 40,
            gap: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero KPI strip */}
          <Animated.View
            style={{
              opacity: headerOpacity,
              flexDirection: 'row',
              gap: 8,
            }}
          >
            {[
              { label: 'MRR', value: '$14.2K', sub: '+18% MoM' },
              { label: 'Restaurants', value: '41', sub: '+6 MoM' },
              { label: 'NRR', value: '118%', sub: 'Expansion' },
            ].map((kpi, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: i === 0 ? D.tealMuted : D.surface,
                  borderRadius: 12,
                  padding: 12,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: i === 0 ? 'rgba(0,201,167,0.25)' : D.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '600',
                    color: i === 0 ? D.teal : D.textTertiary,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontFamily: 'DMSans_600SemiBold',
                  }}
                >
                  {kpi.label}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '800',
                    color: i === 0 ? D.teal : D.text,
                    fontFamily: 'DMSans_700Bold',
                    letterSpacing: -0.5,
                    marginTop: 2,
                  }}
                >
                  {kpi.value}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: i === 0 ? D.teal : D.textSecondary,
                    fontFamily: 'DMSans_400Regular',
                    marginTop: 1,
                  }}
                >
                  {kpi.sub}
                </Text>
              </View>
            ))}
          </Animated.View>

          {/* Section 1 — Business Metrics */}
          <CollapsibleSection
            title="Business Performance"
            subtitle="Revenue, conversion & unit economics"
            icon={<DollarSign size={18} color={D.teal} />}
            defaultOpen
            index={0}
          >
            <MetricGrid metrics={businessMetrics} />
          </CollapsibleSection>

          {/* Section 2 — Product Usage */}
          <CollapsibleSection
            title="Product Adoption"
            subtitle="Engagement, usage depth & feature adoption"
            icon={<Zap size={18} color={D.teal} />}
            defaultOpen
            index={1}
          >
            <MetricGrid metrics={productMetrics} />

            {/* WAU chart */}
            <View
              style={{
                backgroundColor: D.surface,
                borderRadius: 14,
                padding: 16,
                borderWidth: 1,
                borderColor: D.border,
                gap: 12,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: D.textTertiary,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontFamily: 'DMSans_600SemiBold',
                  }}
                >
                  Weekly Active Users — 8 Weeks
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={12} color={D.teal} />
                  <Text style={{ fontSize: 11, color: D.teal, fontFamily: 'DMSans_600SemiBold', fontWeight: '600' }}>
                    +73% growth
                  </Text>
                </View>
              </View>
              <BarChart
                data={weeklyActiveUsers}
                height={120}
                color={D.teal}
                showLabels
              />
            </View>
          </CollapsibleSection>

          {/* Section 3 — Value Creation */}
          <CollapsibleSection
            title="Proven Customer Value"
            subtitle="ROI, savings & measurable outcomes"
            icon={<Target size={18} color={D.teal} />}
            defaultOpen
            index={2}
          >
            <MetricGrid metrics={valueMetrics} />
            <ValueBar />
          </CollapsibleSection>

          {/* Section 4 — Unit Economics */}
          <CollapsibleSection
            title="Unit Economics"
            subtitle="Margins, COGS & path to profitability"
            icon={<BarChart2 size={18} color={D.teal} />}
            defaultOpen
            index={3}
          >
            <MetricGrid metrics={unitEconomicsMetrics} />
            <BreakEvenBar />
          </CollapsibleSection>

          {/* Export button */}
          <AnimatedPressable
            onPress={handleExportPDF}
            style={{
              backgroundColor: D.teal,
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <FileText size={18} color='#0A0A0A' />
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: '#0A0A0A',
                fontFamily: 'DMSans_700Bold',
                letterSpacing: -0.2,
              }}
            >
              Export as PDF
            </Text>
          </AnimatedPressable>

          {/* Disclaimer */}
          <Text
            style={{
              fontSize: 11,
              color: D.textTertiary,
              fontFamily: 'DMSans_400Regular',
              textAlign: 'center',
              lineHeight: 16,
              paddingHorizontal: 16,
            }}
          >
            Metrics reflect current demo data. Live data requires Supabase integration.
          </Text>
        </ScrollView>
      </View>
    </>
  );
}
