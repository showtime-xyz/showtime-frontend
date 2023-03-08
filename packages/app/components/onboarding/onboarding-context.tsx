import { createContext } from "react";

import { OnboardingStep, OnboardingContextType } from "./onboarding-types";

export const OnboardingStepContext = createContext<OnboardingContextType>({
  step: OnboardingStep.Username,
  setStep: () => {},
});
