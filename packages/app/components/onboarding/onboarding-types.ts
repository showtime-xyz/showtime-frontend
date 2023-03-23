import { MyInfo } from "app/types";

export type PageQuery = {
  error?: string;
};

export enum OnboardingStep {
  Username = "username",
  Picture = "picture",
  Social = "social",
}

export type OnboardingContextType = {
  step: OnboardingStep;
  setStep: (step: OnboardingStep) => void;
  user?: MyInfo;
};
