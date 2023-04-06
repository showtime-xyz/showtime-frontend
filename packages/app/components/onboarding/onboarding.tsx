import React, { useState, useMemo } from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AnimatePresence } from "moti";

import { ClientSideOnly } from "@showtime-xyz/universal.client-side-only";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";

import { OnboardingStepContext } from "./onboarding-context";
import { OnboardingStep } from "./onboarding-types";
import { SelectPicture } from "./select-picture";
import { SelectSocial } from "./select-social";
import { SelectUsername } from "./select-username";

export const Onboarding = () => {
  const { user } = useUser();

  // determine initial step
  const initialStep = useMemo(() => {
    // if (__DEV__) {
    //   return OnboardingStep.Username;
    // }

    if (user?.data?.profile.img_url) {
      return OnboardingStep.Social;
    }

    if (user?.data?.profile.username) {
      return OnboardingStep.Picture;
    }

    return OnboardingStep.Username;
  }, [user]);
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const value = useMemo(() => ({ step, setStep, user }), [step, user]);

  return (
    <ClientSideOnly>
      <OnboardingStepContext.Provider value={value}>
        <BottomSheetModalProvider>
          <View tw="mt-8 flex-1">
            <AnimatePresence exitBeforeEnter>
              {step === OnboardingStep.Username && (
                <SelectUsername key="username" />
              )}
              {step === OnboardingStep.Picture && (
                <SelectPicture key="picture" />
              )}
              {step === OnboardingStep.Social && <SelectSocial key="social" />}
            </AnimatePresence>
          </View>
        </BottomSheetModalProvider>
      </OnboardingStepContext.Provider>
    </ClientSideOnly>
  );
};
