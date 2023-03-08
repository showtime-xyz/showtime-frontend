import React, { useState, useMemo, useLayoutEffect } from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AnimatePresence } from "moti";

import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { createParam } from "app/navigation/use-param";

import { OnboardingStepContext } from "./onboarding-context";
import { OnboardingStep, PageQuery } from "./onboarding-types";
import { SelectPicture } from "./select-picture";
import { SelectSocial } from "./select-social";
import { SelectUsername } from "./select-username";

const { useParam } = createParam<PageQuery>();

export const Onboarding = () => {
  const { user, isIncompletedProfile } = useUser();
  const router = useRouter();

  const [redirectUri] = useParam("redirectUri");

  // redirect to home if user is not incompleted profile
  // this should prevent user from going back to onboarding
  // with the back button
  useLayoutEffect(() => {
    if (!isIncompletedProfile) {
      router.pop();
    }
  }, [isIncompletedProfile, router]);

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
  const value = useMemo(
    () => ({ step, setStep, user, redirectUri }),
    [step, user, redirectUri]
  );

  if (!isIncompletedProfile) return null;

  return (
    <OnboardingStepContext.Provider value={value}>
      <BottomSheetModalProvider>
        <View tw="mt-8 flex-1">
          <AnimatePresence exitBeforeEnter>
            {step === OnboardingStep.Username && (
              <SelectUsername key="username" />
            )}
            {step === OnboardingStep.Picture && <SelectPicture key="picture" />}
            {step === OnboardingStep.Social && <SelectSocial key="social" />}
          </AnimatePresence>
        </View>
      </BottomSheetModalProvider>
    </OnboardingStepContext.Provider>
  );
};
