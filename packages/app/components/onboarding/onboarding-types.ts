import { MyInfo } from "../../types";

export type PageQuery = {
  redirectUri?: string;
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
  redirectUri?: string;
};
