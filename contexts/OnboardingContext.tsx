import React, { createContext, useContext, useState } from "react";

interface OnboardingContextValue {
  onboardingDone: boolean | null;
  setOnboardingDone: (done: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextValue>({
  onboardingDone: null,
  setOnboardingDone: () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  return (
    <OnboardingContext.Provider value={{ onboardingDone, setOnboardingDone }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
