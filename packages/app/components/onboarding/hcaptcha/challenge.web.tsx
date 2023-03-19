import { useRef, useState } from "react";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import * as Portal from "@radix-ui/react-portal";
import axios, { AxiosError } from "axios";
import { useSWRConfig } from "swr";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

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

const noop = () => {};

export const Challenge = () => {
  const { user } = useContext(OnboardingStepContext);
  const { validate } = useValidateCaptchaWithServer();
  const finishOnboarding = useFinishOnboarding();
  const { mutate } = useSWRConfig();
  const matchMutate = useMatchMutate();
  const { rudder } = useRudder();
  const [hCaptchaLoaded, setHCaptchaLoaded] = useState(
    typeof window.hcaptcha !== "undefined"
  );
  const [challengeRunning, setChallengeIsRunning] = useState(false);
  const isDark = useIsDarkMode();
  const captchaRef = useRef<HCaptcha>(null);

  // this is the callback function that is called when the
  // hcaptcha library is loaded
  const onLoad = () => {
    setHCaptchaLoaded(true);
  };

  const showCaptcha = async () => {
    // skip directly to the next step if user has already a social account
    // connected or if the user has already completed the captcha challenge

    const hasSocialHandle =
      user?.data?.profile?.social_login_handles?.twitter ||
      user?.data?.profile?.social_login_handles?.instagram ||
      false;

    if (user?.data?.profile?.captcha_completed_at || hasSocialHandle) {
      finishOnboarding();
      return;
    }

    // open the captcha if the condition above is not met

    setChallengeIsRunning(true);

    try {
      const token = await captchaRef.current?.execute({ async: true });

      // send the response to the server and validate it
      const status = await validate(token?.response).catch((err) => {
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
    } catch (err) {
      toast.error(
        "Captcha challenge failed.\nPlease try again or connect a social account."
      );
    } finally {
      // this has to be called to reset the captcha once validated with the server
      captchaRef.current?.resetCaptcha();
      setChallengeIsRunning(false);
    }
  };

  // hCaptcha injects a very ugly square on the page when the challenge is running
  // this function removes it even though its super hacky
  const fixUglySquare = () => {
    const sq = document.querySelector('div[style*="border-width: 11px" i]');
    if (sq) sq.remove();
  };

  return (
    <>
      <Button
        size="regular"
        variant="text"
        onPress={showCaptcha}
        disabled={!hCaptchaLoaded || challengeRunning}
      >
        {hCaptchaLoaded && !challengeRunning ? (
          "Skip"
        ) : (
          <Spinner size="small" color={isDark ? "white" : "black"} />
        )}
      </Button>
      <HCaptcha
        onLoad={onLoad}
        onOpen={fixUglySquare}
        ref={captchaRef}
        sitekey={siteKey}
        size="invisible"
        onError={noop}
        onExpire={noop}
        onVerify={noop}
        theme={isDark ? "dark" : "light"}
        languageOverride="en"
      />
      {challengeRunning && (
        <Portal.Root>
          <View
            tw="items-center justify-center bg-black/60 dark:bg-black/60"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </Portal.Root>
      )}
    </>
  );
};
