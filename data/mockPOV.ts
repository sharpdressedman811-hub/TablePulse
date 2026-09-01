// TablePulse AI — Proof-of-Value Mock Data

// Multi-location operator profile
export const OPERATOR = {
  name: 'Harvest Group',
  locations: 5,
  plan: 'Growth Plan',
  memberSince: 'March 2024',
};

// Individual location data
export const LOCATIONS = [
  {
    id: 'loc_001',
    name: 'The Golden Fork — Downtown',
    address: 'Austin, TX',
    urgencyScore: 91,
    urgencyReason: 'Labor 14pts above target + Tuesday gap',
    revenueThisWeek: 81400,
    revenueLastWeek: 76800,
    revenueTrend: 6.0,
    laborPercent: 34.2,
    laborTarget: 28.0,
    topOpportunity: 'Tuesday 2–5 PM slow period',
    topOpportunityValue: 920,
    status: 'needs_attention',
  },
  {
    id: 'loc_002',
    name: 'The Golden Fork — South Congress',
    address: 'Austin, TX',
    urgencyScore: 67,
    urgencyReason: 'Lapsed customer reactivation opportunity',
    revenueThisWeek: 64200,
    revenueLastWeek: 63800,
    revenueTrend: 0.6,
    laborPercent: 27.4,
    laborTarget: 28.0,
    topOpportunity: '847 lapsed customers (90+ days)',
    topOpportunityValue: 3200,
    status: 'opportunity',
  },
  {
    id: 'loc_003',
    name: 'The Golden Fork — Domain',
    address: 'Austin, TX',
    urgencyScore: 44,
    urgencyReason: 'On track — minor menu optimization available',
    revenueThisWeek: 92100,
    revenueLastWeek: 89400,
    revenueTrend: 3.0,
    laborPercent: 26.8,
    laborTarget: 28.0,
    topOpportunity: 'Truffle Fries upsell not featured',
    topOpportunityValue: 480,
    status: 'on_track',
  },
  {
    id: 'loc_004',
    name: 'The Golden Fork — Cedar Park',
    address: 'Cedar Park, TX',
    urgencyScore: 78,
    urgencyReason: 'Friday dinner understaffed 3 weeks running',
    revenueThisWeek: 58600,
    revenueLastWeek: 61200,
    revenueTrend: -4.2,
    laborPercent: 29.1,
    laborTarget: 28.0,
    topOpportunity: 'Friday dinner understaffing pattern',
    topOpportunityValue: 1840,
    status: 'needs_attention',
  },
  {
    id: 'loc_005',
    name: 'The Golden Fork — Round Rock',
    address: 'Round Rock, TX',
    urgencyScore: 55,
    urgencyReason: 'Weekend brunch launch performing below forecast',
    revenueThisWeek: 47300,
    revenueLastWeek: 44100,
    revenueTrend: 7.3,
    laborPercent: 30.2,
    laborTarget: 28.0,
    topOpportunity: 'Brunch menu promotion needed',
    topOpportunityValue: 620,
    status: 'opportunity',
  },
];

// Monthly Proof-of-Value Report
export const POV_REPORT = {
  period: 'May 2025',
  generatedDate: 'June 1, 2025',
  overallScore: 87,
  previousScore: 82,
  scoreDelta: 5,
  reportsInAverage: 142,
  rollingAverage90Day: 85.7,

  // Score breakdown
  scoreBreakdown: {
    financialImpact: { score: 22, max: 25, label: 'Financial Impact' },
    recommendationAccuracy: { score: 17, max: 20, label: 'Recommendation Accuracy' },
    actionability: { score: 13, max: 15, label: 'Actionability' },
    dataQuality: { score: 9, max: 10, label: 'Data Quality' },
    customerAdoption: { score: 9, max: 10, label: 'Customer Adoption' },
    measuredResults: { score: 9, max: 10, label: 'Measured Results' },
    userSatisfaction: { score: 8, max: 10, label: 'User Satisfaction' },
  },

  // Financial summary
  revenueOpportunityIdentified: 4200,
  measuredIncrementalRevenue: 1420,
  costSavings: 380,
  estimatedROI: 4.7,
  captureRate: 33.8,

  // Recommendation summary
  opportunitiesIdentified: 7,
  recommendationsAccepted: 5,
  actionsCompleted: 4,
  recommendationAccuracy: 82,

  // Biggest win
  biggestWin: {
    title: 'Tuesday Slow-Period Campaign',
    description:
      'Happy-hour promotion targeting lapsed customers generated $920 in measured incremental revenue against a prediction of $700.',
    predicted: 700,
    actual: 920,
    methodology: 'Matched historical control',
    confidence: 74,
  },

  // Biggest miss
  biggestMiss: {
    title: 'Friday Late-Night Upsell',
    description:
      'Recommendation was accepted but generated no measurable incremental revenue. Root cause: insufficient historical data for this day part.',
    predicted: 340,
    actual: 0,
    rootCause: 'Insufficient historical data for Friday 10PM–12AM',
    fix: 'Confidence reduced for late-night recommendations with < 90 days of data',
  },

  // What we learned
  learned:
    'Tuesday 3–5 PM gap responds strongly to appetizer + cocktail promotions targeted at lapsed customers. Friday late-night requires 90+ days of data before recommendations are generated.',

  // Next opportunities
  nextOpportunities: [
    { title: 'Labor optimization — Wednesday lunch', impact: 340, confidence: 88, period: 'weekly' },
    { title: 'Customer reactivation — 847 lapsed guests', impact: 3200, confidence: 76, period: 'one-time' },
    { title: 'Menu engineering — 3 high-margin items', impact: 480, confidence: 71, period: 'ongoing' },
  ],
};

// Improvement dashboard data
export const IMPROVEMENT_DASHBOARD = {
  currentScore: 85.7,
  previousScore: 82.4,
  scoreDelta: 3.3,
  reportsEvaluated: 142,
  totalRecommendations: 1284,
  accepted: 734,
  successful: 511,
  revenueOpportunityIdentified: 482000,
  measuredIncrementalImpact: 176000,
  captureRate: 36.5,
  averageROI: 4.2,

  failureModes: [
    { rank: 1, label: 'Poor campaign timing', percent: 23 },
    { rank: 2, label: 'Insufficient historical data', percent: 19 },
    { rank: 3, label: 'Low reservation accuracy', percent: 14 },
    { rank: 4, label: 'Weak customer segmentation', percent: 12 },
    { rank: 5, label: 'Incorrect demand forecast', percent: 11 },
  ],

  successPatterns: [
    { rank: 1, label: 'Slow-period targeted campaigns', successRate: 74 },
    { rank: 2, label: 'Event-based demand capture', successRate: 71 },
    { rank: 3, label: 'Lapsed customer reactivation', successRate: 68 },
    { rank: 4, label: 'Labor-to-revenue optimization', successRate: 66 },
    { rank: 5, label: 'High-margin menu promotion', successRate: 63 },
  ],

  confidenceCalibration: [
    { labeled: '90%+', actualSuccessRate: 88, status: 'calibrated' },
    { labeled: '80–89%', actualSuccessRate: 79, status: 'calibrated' },
    { labeled: '70–79%', actualSuccessRate: 71, status: 'calibrated' },
    { labeled: '60–69%', actualSuccessRate: 55, status: 'miscalibrated' },
    { labeled: '50–59%', actualSuccessRate: 48, status: 'calibrated' },
  ],
};

// Score classification helper
export function classifyScore(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Exceptional', color: '#16A34A' };
  if (score >= 85) return { label: 'Target Achieved', color: '#0D9488' };
  if (score >= 75) return { label: 'Needs Improvement', color: '#F59E0B' };
  if (score >= 60) return { label: 'Poor', color: '#F97316' };
  return { label: 'Critical', color: '#EF4444' };
}
