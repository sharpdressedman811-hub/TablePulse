// TablePulse AI — Mock Data for "The Golden Fork"

export const RESTAURANT = {
  name: 'The Golden Fork',
  location: 'Austin, TX',
  type: 'American Bistro',
  coverCapacity: 85,
  openTime: '11:00 AM',
  closeTime: '10:00 PM',
};

export const TODAY_METRICS = {
  date: 'Tuesday, June 10',
  revenueActual: 8240,
  revenueProjected: 11420,
  revenueBaseline: 10800,
  revenueVsNormal: -5.2,
  coversActual: 142,
  coversProjected: 236,
  reservationsTotal: 184,
  reservationsSeated: 97,
  reservationsPending: 87,
  laborPercent: 31.8,
  laborCost: 2620,
  laborScheduled: 14,
  avgCheck: 58.03,
  avgCheckVsNormal: 2.1,
  openHours: 6.5,
};

export const HOURLY_SALES = [
  { hour: '11AM', revenue: 420, covers: 8, baseline: 380, projected: null },
  { hour: '12PM', revenue: 1840, covers: 32, baseline: 1920, projected: null },
  { hour: '1PM', revenue: 2210, covers: 38, baseline: 2100, projected: null },
  { hour: '2PM', revenue: 680, covers: 12, baseline: 820, projected: null },
  { hour: '3PM', revenue: 290, covers: 5, baseline: 480, projected: null },
  { hour: '4PM', revenue: 180, covers: 3, baseline: 420, projected: null },
  { hour: '5PM', revenue: 940, covers: 16, baseline: 880, projected: null },
  { hour: '6PM', revenue: 1680, covers: 28, baseline: 1640, projected: null },
  { hour: '7PM', revenue: null, projected: 1920, covers: null, baseline: 1880 },
  { hour: '8PM', revenue: null, projected: 1640, covers: null, baseline: 1600 },
  { hour: '9PM', revenue: null, projected: 820, covers: null, baseline: 780 },
  { hour: '10PM', revenue: null, projected: 320, covers: null, baseline: 300 },
];

export const DOW_PERFORMANCE = [
  { day: 'Mon', avgRevenue: 7200, thisWeek: 7840 },
  { day: 'Tue', avgRevenue: 10800, thisWeek: 8240 },
  { day: 'Wed', avgRevenue: 11200, thisWeek: null },
  { day: 'Thu', avgRevenue: 12400, thisWeek: null },
  { day: 'Fri', avgRevenue: 18600, thisWeek: null },
  { day: 'Sat', avgRevenue: 21200, thisWeek: null },
  { day: 'Sun', avgRevenue: 14800, thisWeek: null },
];

export const MENU_ITEMS = [
  { id: '1', name: 'Grilled Salmon', category: 'Entrees', soldToday: 28, revenue: 1092, avgPrice: 39, trend: 12, profitMargin: 68 },
  { id: '2', name: 'Filet Mignon', category: 'Entrees', soldToday: 14, revenue: 980, avgPrice: 70, trend: 5, profitMargin: 72 },
  { id: '3', name: 'Caesar Salad', category: 'Starters', soldToday: 42, revenue: 630, avgPrice: 15, trend: -8, profitMargin: 82 },
  { id: '4', name: 'Truffle Fries', category: 'Sides', soldToday: 67, revenue: 804, avgPrice: 12, trend: 22, profitMargin: 78 },
  { id: '5', name: 'Margarita', category: 'Cocktails', soldToday: 38, revenue: 570, avgPrice: 15, trend: 27, profitMargin: 85 },
  { id: '6', name: 'Lobster Bisque', category: 'Starters', soldToday: 8, revenue: 200, avgPrice: 25, trend: -15, profitMargin: 55 },
  { id: '7', name: 'Chicken Piccata', category: 'Entrees', soldToday: 19, revenue: 532, avgPrice: 28, trend: 3, profitMargin: 65 },
  { id: '8', name: 'Chocolate Lava Cake', category: 'Desserts', soldToday: 31, revenue: 434, avgPrice: 14, trend: 18, profitMargin: 80 },
];

export const LABOR_DATA = {
  scheduled: [
    { role: 'Front of House', scheduled: 6, actual: 5, hoursWorked: 32.5 },
    { role: 'Back of House', scheduled: 5, actual: 5, hoursWorked: 27.0 },
    { role: 'Bar', scheduled: 2, actual: 2, hoursWorked: 13.0 },
    { role: 'Management', scheduled: 1, actual: 1, hoursWorked: 6.5 },
  ],
  laborPercent: 31.8,
  laborCost: 2620,
  salesPerLaborHour: 104.30,
  targetLaborPercent: 28.0,
  forecastedDinnerLabor: 34.2,
  overstaffedPeriods: ['2PM–4PM'],
  understaffedPeriods: ['7PM–9PM'],
};

export const INVENTORY_ALERTS = [
  { id: '1', item: 'Atlantic Salmon', currentStock: '4.2 lbs', projectedNeed: '8.5 lbs', status: 'critical', action: 'Order before 3PM' },
  { id: '2', item: 'Truffle Oil', currentStock: '1 bottle', projectedNeed: '1.5 bottles', status: 'warning', action: 'Check with supplier' },
  { id: '3', item: 'Filet Mignon', currentStock: '12 portions', projectedNeed: '10 portions', status: 'ok', action: null },
];

export const RESERVATIONS = {
  total: 184,
  seated: 97,
  pending: 87,
  noShows: 3,
  cancellations: 2,
  peakPeriod: '6PM–8PM',
  peakCovers: 68,
  avgPartySize: 3.2,
};

export const AI_RECOMMENDATIONS = [
  {
    id: 'rec_001',
    priority: 1,
    type: 'revenue',
    status: 'action_required',
    confidence: 82,
    dataType: 'verified_trend',
    problem: 'Afternoon revenue is tracking 17% below baseline',
    evidence: '2PM–5PM revenue today: $470 vs. $1,720 Tuesday average. This pattern has occurred 3 of the last 4 Tuesdays.',
    recommendation: 'Launch a targeted 2–4 PM happy hour promotion. Suggest: half-price appetizers + $2 off cocktails.',
    expectedImpact: '$280–$520 additional revenue',
    impactRange: [280, 520] as [number, number],
    actionLabel: 'Create Campaign',
    actionRoute: '/campaign/new?type=happy_hour',
    tags: ['Revenue', 'Promotion'],
  },
  {
    id: 'rec_002',
    priority: 2,
    type: 'operations',
    status: 'monitor',
    confidence: 91,
    dataType: 'verified_fact',
    problem: 'Salmon inventory may be insufficient for projected dinner demand',
    evidence: 'Current stock: 4.2 lbs. Projected dinner demand based on reservation count (87 pending) and historical salmon order rate (18%): ~8.5 lbs needed.',
    recommendation: 'Verify salmon inventory before 3 PM. Contact supplier if stock is below 6 lbs.',
    expectedImpact: 'Prevent $1,092+ in lost sales and guest dissatisfaction',
    impactRange: [800, 1200] as [number, number],
    actionLabel: 'Mark as Checked',
    actionRoute: null,
    tags: ['Inventory', 'Dinner'],
  },
  {
    id: 'rec_003',
    priority: 3,
    type: 'marketing',
    status: 'opportunity',
    confidence: 78,
    dataType: 'verified_trend',
    problem: 'Margarita sales are up 27% — an untapped social opportunity',
    evidence: 'Margaritas sold today: 38 (vs. 30 Tuesday average). This is the 3rd consecutive Tuesday with elevated margarita sales.',
    recommendation: 'Feature margaritas in today\'s social content. The trend is real and timely.',
    expectedImpact: 'Estimated 15–25% increase in evening cocktail orders',
    impactRange: [120, 200] as [number, number],
    actionLabel: 'Create Social Post',
    actionRoute: '/campaign/new?type=social_post&item=margarita',
    tags: ['Marketing', 'Cocktails'],
  },
  {
    id: 'rec_004',
    priority: 4,
    type: 'labor',
    status: 'monitor',
    confidence: 88,
    dataType: 'prediction',
    problem: 'Dinner service may be understaffed for projected 6–8 PM peak',
    evidence: '87 pending reservations for tonight. Historical data shows 6–8 PM covers average 68 on Tuesdays with this reservation volume. Current FOH staffing: 5 (1 below schedule).',
    recommendation: 'Consider calling in 1 additional FOH staff member for the 6–9 PM shift.',
    expectedImpact: 'Prevent service delays and maintain guest satisfaction scores',
    impactRange: [0, 0] as [number, number],
    actionLabel: 'Review Schedule',
    actionRoute: '/(tabs)/labor',
    tags: ['Labor', 'Dinner'],
  },
  {
    id: 'rec_005',
    priority: 5,
    type: 'menu',
    status: 'opportunity',
    confidence: 74,
    dataType: 'verified_trend',
    problem: 'Truffle Fries are your fastest-growing item — not featured prominently',
    evidence: 'Truffle Fries sold 67 today (+22% vs. average). They appear as a side item only. Upsell rate when suggested by servers: 34%.',
    recommendation: 'Brief servers to actively suggest Truffle Fries as an add-on during dinner service.',
    expectedImpact: 'Estimated $120–$180 additional revenue',
    impactRange: [120, 180] as [number, number],
    actionLabel: 'Add to Server Brief',
    actionRoute: null,
    tags: ['Menu', 'Upsell'],
  },
];

export type AIRecommendation = typeof AI_RECOMMENDATIONS[0];

export const WEEKLY_TREND = [
  { week: 'Apr 14', revenue: 68400 },
  { week: 'Apr 21', revenue: 71200 },
  { week: 'Apr 28', revenue: 69800 },
  { week: 'May 5', revenue: 74100 },
  { week: 'May 12', revenue: 72600 },
  { week: 'May 19', revenue: 76800 },
  { week: 'May 26', revenue: 78200 },
  { week: 'Jun 2', revenue: 81400 },
];

export const CAMPAIGNS = [
  {
    id: 'camp_001',
    name: 'Tuesday Happy Hour',
    type: 'promotion',
    status: 'draft',
    createdAt: 'Today',
    channels: ['Instagram', 'SMS'],
    estimatedReach: 1240,
    offer: 'Half-price appetizers + $2 off cocktails, 2–5 PM',
    headline: 'Beat the Tuesday Slump 🍹',
    caption: 'Your favorite spot just got even better on Tuesdays. Half-price apps and $2 off cocktails from 2–5 PM. See you soon! 🍽️',
    status_label: 'Awaiting Approval',
  },
  {
    id: 'camp_002',
    name: 'Weekend Brunch Launch',
    type: 'announcement',
    status: 'active',
    createdAt: 'Jun 5',
    channels: ['Instagram', 'Email', 'SMS'],
    estimatedReach: 3800,
    offer: 'New Saturday & Sunday brunch menu, 10 AM–2 PM',
    headline: 'Brunch is Here 🥂',
    caption: 'We\'re thrilled to announce Saturday & Sunday brunch at The Golden Fork. Bottomless mimosas, farm-fresh eggs, and your favorite classics. Reserve your table now.',
    status_label: 'Live',
  },
];
