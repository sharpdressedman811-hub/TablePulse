export interface OnboardingOption {
  id: string;
  emoji: string;
  label: string;
}

export interface OnboardingQuestion {
  id: string;
  title: string;
  subtitle: string;
  inputType?: 'text' | 'options';
  options: OnboardingOption[];
}

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: "restaurant_name",
    title: "What's your restaurant called?",
    subtitle: "We'll personalise your dashboard around your brand",
    inputType: "text",
    options: [],
  },
  {
    id: "restaurant_type",
    title: "What type of restaurant do you run?",
    subtitle: "Helps us tailor your recommendations",
    inputType: "options",
    options: [
      { id: "fast_casual", emoji: "🥙", label: "Fast Casual" },
      { id: "fine_dining", emoji: "🍽️", label: "Fine Dining" },
      { id: "cafe", emoji: "☕", label: "Café / Bakery" },
      { id: "bar_grill", emoji: "🍺", label: "Bar & Grill" },
      { id: "qsr", emoji: "🍔", label: "Quick Service (QSR)" },
      { id: "other", emoji: "🍴", label: "Other" },
    ],
  },
  {
    id: "locations",
    title: "How many locations do you operate?",
    subtitle: "We scale our insights to your footprint",
    inputType: "options",
    options: [
      { id: "1", emoji: "📍", label: "Just 1" },
      { id: "2_5", emoji: "📍📍", label: "2–5" },
      { id: "6_20", emoji: "🏢", label: "6–20" },
      { id: "20_plus", emoji: "🏙️", label: "20+" },
    ],
  },
  {
    id: "biggest_challenge",
    title: "What's your biggest challenge right now?",
    subtitle: "We'll prioritise the insights that matter most",
    inputType: "options",
    options: [
      { id: "foot_traffic", emoji: "👣", label: "Driving foot traffic" },
      { id: "retention", emoji: "🔄", label: "Customer retention" },
      { id: "competition", emoji: "⚔️", label: "Standing out from competitors" },
      { id: "margins", emoji: "💸", label: "Protecting margins" },
      { id: "online_rep", emoji: "⭐", label: "Managing online reputation" },
    ],
  },
  {
    id: "heard_from",
    title: "How did you hear about TablePulse?",
    subtitle: "We'd love to know what brought you here",
    inputType: "options",
    options: [
      { id: "social", emoji: "📱", label: "Social media" },
      { id: "friend", emoji: "🤝", label: "Word of mouth" },
      { id: "appstore", emoji: "🏪", label: "App Store" },
      { id: "search", emoji: "🔍", label: "Online search" },
      { id: "sales", emoji: "💼", label: "TablePulse sales team" },
    ],
  },
];
