import { useCallback } from "react";

import { useRouter } from "@showtime-xyz/universal.router";

import { Analytics, EVENTS } from "app/lib/analytics";
import { axios } from "app/lib/axios";

import { onboardingPromiseCallbacks } from "../onboarding-promise";

export const useValidateCaptchaWithServer = () => {
  async function validate(token?: string) {
    if (!token) return Promise.reject(new Error("No token provided"));

    return await axios({
      url: "/v1/profile/captcha/verify",
      method: "POST",
      data: {
        hcaptcha_response_token: token,
      },
    });
  }

  return { validate };
};

export const useFinishOnboarding = () => {
  const router = useRouter();

  const finishOnboarding = useCallback(() => {
    router.pop();
    // let's wait a bit before resolving the promise
    // to make sure the user has time to see the animation
    Analytics.track(EVENTS.USER_FINISHED_ONBOARDING);
    setTimeout(() => {
      onboardingPromiseCallbacks.resolve?.(true);
    }, 1000);
  }, [router]);

  return finishOnboarding;
};
