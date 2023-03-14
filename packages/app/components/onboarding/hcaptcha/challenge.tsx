import { useRef, useContext } from "react";

import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import axios, { AxiosError } from "axios";
import { WebViewMessageEvent } from "react-native-webview";
import { useSWRConfig } from "swr";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

import { USER_PROFILE_KEY } from "app/hooks/api-hooks";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { Logger } from "app/lib/logger";
import { useRudder } from "app/lib/rudderstack";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { toast } from "design-system/toast";

import { OnboardingStepContext } from "../onboarding-context";
import {
  useFinishOnboarding,
  useValidateCaptchaWithServer,
} from "./hcaptcha-utils";
import { siteKey } from "./sitekey";

export const Challenge = () => {
  const { user } = useContext(OnboardingStepContext);
  const { validate } = useValidateCaptchaWithServer();
  const finishOnboarding = useFinishOnboarding();

  const { mutate } = useSWRConfig();
  const matchMutate = useMatchMutate();
  const { rudder } = useRudder();

  const isDark = useIsDarkMode();
  const captchaRef = useRef<ConfirmHcaptcha>(null);

  const showCaptcha = () => {
    // skip directly to the next step if user has already a social account
    // connected or if the user has already completed the captcha challenge
    if (
      user?.data.profile.captcha_completed_at ||
      user?.data.profile.has_social_login
    ) {
      finishOnboarding();
      return;
    }

    // open the captcha if the condition above is not met
    captchaRef.current?.show();
  };

  const onMessage = async (event: WebViewMessageEvent) => {
    if (event && event.nativeEvent.data) {
      if (["cancel", "error", "expired"].includes(event.nativeEvent.data)) {
        captchaRef.current?.hide();
        toast("Please try again or connect a social account.");

        rudder?.track("hCaptcha Error", {
          error: event.nativeEvent.data,
        });

        return;
      } else {
        const token = event.nativeEvent.data;
        // send the response to the server and validate it
        const status = await validate(token).catch((err) => {
          const error = err as AxiosError;
          if (axios.isAxiosError(error)) {
            Logger.log(error.response?.data.error.message);
            toast.error(error.response?.data?.error?.message);
          } else {
            Logger.log(err?.message);
          }

          return "failed";
        });

        // if the captcha was validated successfully, we can
        // move on to the next step
        if (status !== "failed") {
          await mutate(MY_INFO_ENDPOINT);
          await matchMutate(
            (key) => typeof key === "string" && key.includes(USER_PROFILE_KEY)
          );
          rudder?.track("hCaptcha challenge success");

          // finish onboarding
          finishOnboarding();
        }

        // hide the captcha
        captchaRef.current?.hide();
      }
    }
  };

  return (
    <>
      <Button size="regular" variant="text" onPress={showCaptcha}>
        Skip
      </Button>
      <ConfirmHcaptcha
        ref={captchaRef}
        siteKey={siteKey}
        languageCode="en"
        onMessage={onMessage}
        size="invisible"
        showLoading={true}
        backgroundColor={
          isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)"
        }
        loadingIndicatorColor={isDark ? "white" : "black"}
      />
    </>
  );
};
