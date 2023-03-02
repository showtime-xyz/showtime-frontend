import { createContext } from "react";

import { OnboardingStep, ThemeContextType } from "./onboarding-types";

export const OnboardingStepContext = createContext<ThemeContextType>({
  step: OnboardingStep.Username,
  setStep: () => {},
});
