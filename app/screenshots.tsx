import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const NAVY = '#000032';
const CYAN = '#00BDDF';
const AMBER = '#F59E0B';
const WHITE = '#FFFFFF';

// ─── Brand Strip ────────────────────────────────────────────────────────────

function BrandStrip() {
  return (
    <View
      style={{
        height: 52,
        backgroundColor: 'rgba(0,0,50,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: CYAN,
          fontFamily: 'DMSans_700Bold',
          fontWeight: '700',
        }}
      >
        TablePulse
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: CYAN }} />
        <Text
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.45)',
            fontFamily: 'DMSans_400Regular',
          }}
        >
          tablepulse.app
        </Text>
      </View>
    </View>
  );
}

// ─── Card Wrapper ────────────────────────────────────────────────────────────

function ScreenshotCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        width: 320,
        height: 693,
        borderRadius: 40,
        overflow: 'hidden',
        backgroundColor: NAVY,
        alignSelf: 'center',
        marginVertical: 12,
      }}
    >
      {children}
    </View>
  );
}

// ─── Headline Area ───────────────────────────────────────────────────────────

function HeadlineArea({ headline, subtitle }: { headline: string; subtitle: string }) {
  return (
    <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
      <Text
        style={{
          fontSize: 28,
          color: WHITE,
          fontFamily: 'DMSans_700Bold',
          fontWeight: '700',
          letterSpacing: -0.5,
          lineHeight: 34,
        }}
      >
        {headline}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.65)',
          fontFamily: 'DMSans_400Regular',
          marginTop: 8,
          lineHeight: 21,
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}

// ─── Card 1: Dashboard ───────────────────────────────────────────────────────

function Card1Dashboard() {
  const progressWidth = '72%';

  return (
    <ScreenshotCard>
      <HeadlineArea
        headline={'Your restaurant,\nat a glance.'}
        subtitle="Live metrics. Real-time alerts. Zero guesswork."
      />

      {/* Mock UI */}
      <View style={{ flex: 1, marginTop: 24, marginHorizontal: 16 }}>
        {/* Today's Brief cyan card */}
        <View
          style={{
            backgroundColor: CYAN,
            borderRadius: 14,
            padding: 14,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: NAVY,
              fontFamily: 'DMSans_700Bold',
              fontWeight: '700',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            TODAY'S BRIEF
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <View style={{ width: '45%' }}>
              <Text style={{ fontSize: 9, color: 'rgba(0,0,50,0.6)', fontFamily: 'DMSans_400Regular' }}>
                Projected Revenue
              </Text>
              <Text style={{ fontSize: 18, color: NAVY, fontFamily: 'DMSans_700Bold', fontWeight: '700', letterSpacing: -0.3 }}>
                $11,420
              </Text>
            </View>
            <View style={{ width: '45%' }}>
              <Text style={{ fontSize: 9, color: 'rgba(0,0,50,0.6)', fontFamily: 'DMSans_400Regular' }}>
                vs Normal
              </Text>
              <Text style={{ fontSize: 18, color: NAVY, fontFamily: 'DMSans_700Bold', fontWeight: '700', letterSpacing: -0.3 }}>
                +8.3%
              </Text>
            </View>
            <View style={{ width: '45%' }}>
              <Text style={{ fontSize: 9, color: 'rgba(0,0,50,0.6)', fontFamily: 'DMSans_400Regular' }}>
                Reservations
              </Text>
              <Text style={{ fontSize: 18, color: NAVY, fontFamily: 'DMSans_700Bold', fontWeight: '700', letterSpacing: -0.3 }}>
                184
              </Text>
            </View>
            <View style={{ width: '45%' }}>
              <Text style={{ fontSize: 9, color: 'rgba(0,0,50,0.6)', fontFamily: 'DMSans_400Regular' }}>
                Covers
              </Text>
              <Text style={{ fontSize: 18, color: NAVY, fontFamily: 'DMSans_700Bold', fontWeight: '700', letterSpacing: -0.3 }}>
                236
              </Text>
            </View>
          </View>
        </View>

        {/* Revenue Today card */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: 12,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'DMSans_600SemiBold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 6,
              fontSize: 10,
            }}
          >
            Revenue Today
          </Text>
          <Text
            style={{
              fontSize: 26,
              color: WHITE,
              fontFamily: 'DMSans_700Bold',
              fontWeight: '700',
              letterSpacing: -0.5,
            }}
          >
            $8,240
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'DMSans_400Regular',
              marginTop: 2,
              marginBottom: 8,
            }}
          >
            of $11,420 projected
          </Text>
          {/* Progress bar */}
          <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
            <View
              style={{
                height: 6,
                width: progressWidth,
                backgroundColor: CYAN,
                borderRadius: 3,
              }}
            />
          </View>
        </View>

        {/* Alert pills */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: 'rgba(239,68,68,0.12)',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 7,
              borderWidth: 1,
              borderColor: 'rgba(239,68,68,0.25)',
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' }} />
            <Text style={{ fontSize: 11, color: '#EF4444', fontFamily: 'DMSans_500Medium' }}>
              Salmon inventory low
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: 'rgba(245,158,11,0.12)',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 7,
              borderWidth: 1,
              borderColor: 'rgba(245,158,11,0.25)',
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: AMBER }} />
            <Text style={{ fontSize: 11, color: AMBER, fontFamily: 'DMSans_500Medium' }}>
              Afternoon below baseline
            </Text>
          </View>
        </View>
      </View>

      <BrandStrip />
    </ScreenshotCard>
  );
}

// ─── Card 2: AI Action Plan ──────────────────────────────────────────────────

function Card2ActionPlan() {
  return (
    <ScreenshotCard>
      <HeadlineArea
        headline={'AI tells you\nexactly what to do.'}
        subtitle="Ranked by revenue impact. No analyst required."
      />

      <View style={{ flex: 1, marginTop: 24, marginHorizontal: 16, gap: 8 }}>
        {/* Card A */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: AMBER }} />
            <Text style={{ fontSize: 13, color: WHITE, fontFamily: 'DMSans_700Bold', fontWeight: '700', flex: 1 }}>
              Afternoon Slump
            </Text>
            <View
              style={{
                backgroundColor: 'rgba(245,158,11,0.15)',
                borderRadius: 6,
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontSize: 10, color: AMBER, fontFamily: 'DMSans_600SemiBold' }}>
                +$420 impact
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'DMSans_400Regular' }}>
            Push 2-for-1 cocktails 3–5pm
          </Text>
        </View>

        {/* Card B */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
            <Text style={{ fontSize: 13, color: WHITE, fontFamily: 'DMSans_700Bold', fontWeight: '700', flex: 1 }}>
              Salmon Inventory
            </Text>
            <View
              style={{
                backgroundColor: 'rgba(239,68,68,0.15)',
                borderRadius: 6,
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontSize: 10, color: '#EF4444', fontFamily: 'DMSans_600SemiBold' }}>
                +$280 impact
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'DMSans_400Regular' }}>
            86 salmon — order 40 lbs
          </Text>
        </View>

        {/* Card C */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' }} />
            <Text style={{ fontSize: 13, color: WHITE, fontFamily: 'DMSans_700Bold', fontWeight: '700', flex: 1 }}>
              Margarita Trend
            </Text>
            <View
              style={{
                backgroundColor: 'rgba(34,197,94,0.15)',
                borderRadius: 6,
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontSize: 10, color: '#22C55E', fontFamily: 'DMSans_600SemiBold' }}>
                +$190 impact
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'DMSans_400Regular' }}>
            Feature on specials board
          </Text>
        </View>
      </View>

      <BrandStrip />
    </ScreenshotCard>
  );
}

// ─── Card 3: Proof of Value ──────────────────────────────────────────────────

function Card3ProofOfValue() {
  const scoreWidth = '87%';

  return (
    <ScreenshotCard>
      <HeadlineArea
        headline={'Prove the ROI\nof every change.'}
        subtitle="Before-and-after scoring. Show your investors."
      />

      <View style={{ flex: 1, marginTop: 24, marginHorizontal: 16 }}>
        {/* Hero score card */}
        <View
          style={{
            backgroundColor: CYAN,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: 'rgba(0,0,50,0.65)',
              fontFamily: 'DMSans_700Bold',
              fontWeight: '700',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            PERFORMANCE SCORE
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 52,
                color: NAVY,
                fontFamily: 'DMSans_700Bold',
                fontWeight: '700',
                lineHeight: 56,
              }}
            >
              87
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: 'rgba(0,0,50,0.5)',
                fontFamily: 'DMSans_400Regular',
                marginBottom: 6,
              }}
            >
              /100
            </Text>
          </View>
          {/* Progress bar */}
          <View style={{ height: 8, backgroundColor: 'rgba(0,0,50,0.15)', borderRadius: 4 }}>
            <View
              style={{
                height: 8,
                width: scoreWidth,
                backgroundColor: NAVY,
                borderRadius: 4,
              }}
            />
          </View>
        </View>

        {/* Metric rows */}
        <View style={{ gap: 8, marginTop: 10 }}>
          {[
            { label: 'Revenue Efficiency', score: '91' },
            { label: 'Labor Optimization', score: '84' },
            { label: 'Guest Satisfaction', score: '88' },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                backgroundColor: 'rgba(255,255,255,0.07)',
                borderRadius: 10,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 12, color: WHITE, fontFamily: 'DMSans_500Medium' }}>
                {item.label}
              </Text>
              <View
                style={{
                  backgroundColor: 'rgba(0,189,223,0.15)',
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 11, color: CYAN, fontFamily: 'DMSans_700Bold', fontWeight: '700' }}>
                  {item.score}
                  /100
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <BrandStrip />
    </ScreenshotCard>
  );
}

// ─── Card 4: Revenue Radar ───────────────────────────────────────────────────

const BAR_HEIGHTS = [40, 55, 35, 70, 85, 60, 45, 90];
const BAR_LABELS = ['11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p'];
const MAX_BAR = 90;
const CHART_HEIGHT = 80;

function Card4RevenueRadar() {
  return (
    <ScreenshotCard>
      <HeadlineArea
        headline={'Spot trends\nbefore they cost you.'}
        subtitle="Daypart analysis. Weekly patterns. Early warnings."
      />

      <View style={{ flex: 1, marginTop: 24, marginHorizontal: 16 }}>
        {/* Chart card */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: 12,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'DMSans_700Bold',
              fontWeight: '700',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            HOURLY REVENUE
          </Text>

          {/* Bars */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              height: CHART_HEIGHT,
              gap: 6,
            }}
          >
            {BAR_HEIGHTS.map((h, i) => {
              const barH = (h / MAX_BAR) * CHART_HEIGHT;
              return (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: barH,
                    backgroundColor: CYAN,
                    borderRadius: 3,
                  }}
                />
              );
            })}
          </View>

          {/* Hour labels */}
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
            {BAR_LABELS.map((label) => (
              <View key={label} style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'DMSans_400Regular',
                  }}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trend pills */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: 'rgba(34,197,94,0.12)',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderWidth: 1,
              borderColor: 'rgba(34,197,94,0.25)',
            }}
          >
            <Text style={{ fontSize: 11, color: '#22C55E', fontFamily: 'DMSans_600SemiBold' }}>
              +27% Margaritas
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: 'rgba(239,68,68,0.12)',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderWidth: 1,
              borderColor: 'rgba(239,68,68,0.25)',
            }}
          >
            <Text style={{ fontSize: 11, color: '#EF4444', fontFamily: 'DMSans_600SemiBold' }}>
              -12% Afternoon
            </Text>
          </View>
        </View>
      </View>

      <BrandStrip />
    </ScreenshotCard>
  );
}

// ─── Card 5: Multi-location ──────────────────────────────────────────────────

function Card5MultiLocation() {
  const locations = [
    { name: 'The Rustic Fork · Downtown', revenue: '$8,240', target: '72% to target', targetColor: CYAN, targetBg: 'rgba(0,189,223,0.15)' },
    { name: 'The Rustic Fork · Midtown', revenue: '$6,180', target: '54% to target', targetColor: AMBER, targetBg: 'rgba(245,158,11,0.15)' },
    { name: 'The Rustic Fork · Airport', revenue: '$4,920', target: '88% to target', targetColor: CYAN, targetBg: 'rgba(0,189,223,0.15)' },
  ];

  return (
    <ScreenshotCard>
      <HeadlineArea
        headline={'One app.\nEvery location.'}
        subtitle="Switch between restaurants instantly. Compare performance."
      />

      <View style={{ flex: 1, marginTop: 24, marginHorizontal: 16, gap: 8 }}>
        {locations.map((loc) => (
          <View
            key={loc.name}
            style={{
              backgroundColor: 'rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#22C55E' }} />
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'DMSans_400Regular' }}>
                  {loc.name}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 20, color: WHITE, fontFamily: 'DMSans_700Bold', fontWeight: '700', letterSpacing: -0.3 }}>
                {loc.revenue}
              </Text>
              <View
                style={{
                  backgroundColor: loc.targetBg,
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 11, color: loc.targetColor, fontFamily: 'DMSans_600SemiBold' }}>
                  {loc.target}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* Compare button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            backgroundColor: CYAN,
            borderRadius: 10,
            padding: 10,
            alignItems: 'center',
            marginTop: 2,
          }}
          onPress={() => console.log('[Screenshots] Compare Locations pressed')}
        >
          <Text style={{ fontSize: 13, color: NAVY, fontFamily: 'DMSans_700Bold', fontWeight: '700' }}>
            Compare Locations
          </Text>
        </TouchableOpacity>
      </View>

      <BrandStrip />
    </ScreenshotCard>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function ScreenshotsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: NAVY }}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => {
          console.log('[Screenshots] Back button pressed');
          router.back();
        }}
        style={{
          paddingTop: 56,
          paddingHorizontal: 24,
          paddingBottom: 8,
        }}
      >
        <Text style={{ fontSize: 15, color: CYAN, fontFamily: 'DMSans_500Medium' }}>
          ← Back
        </Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          paddingVertical: 40,
          paddingHorizontal: 20,
          gap: 24,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 22,
            color: WHITE,
            fontFamily: 'DMSans_700Bold',
            fontWeight: '700',
            letterSpacing: -0.5,
            marginBottom: 4,
            alignSelf: 'flex-start',
          }}
        >
          App Store Screenshots
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.45)',
            fontFamily: 'DMSans_400Regular',
            marginBottom: 8,
            alignSelf: 'flex-start',
          }}
        >
          6.7" iPhone · 5 frames
        </Text>

        <Card1Dashboard />
        <Card2ActionPlan />
        <Card3ProofOfValue />
        <Card4RevenueRadar />
        <Card5MultiLocation />
      </ScrollView>
    </View>
  );
}
