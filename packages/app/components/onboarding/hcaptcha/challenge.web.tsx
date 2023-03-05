import { useRef, useState } from "react";
import { StyleSheet } from "react-native";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import * as Portal from "@radix-ui/react-portal";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { useToast } from "@showtime-xyz/universal.toast";
import { View } from "@showtime-xyz/universal.view";

import { siteKey } from "./sitekey";

export const Challenge = () => {
  const toast = useToast();
  const [hCaptchaLoaded, setHCaptchaLoaded] = useState(false);
  const [challengeRunning, setChallengeIsRunning] = useState(false);
  const isDark = useIsDarkMode();
  const captchaRef = useRef<HCaptcha>(null);

  // this is the callback function that is called when the
  // hcaptcha library is loaded
  const onLoad = () => {
    setHCaptchaLoaded(true);
  };

  const showCaptcha = async () => {
    // this reaches out to the hcaptcha library and runs the
    // execute function on it. you can use other functions as well
    // documented in the api:
    // https://docs.hcaptcha.com/configuration#jsapi

    setChallengeIsRunning(true);

    try {
      const result = await captchaRef.current?.execute({ async: true });
      console.log("hCaptcha response", result?.response);
      // todo: send the response to the server and validate it
      try {
        //
      } catch {
        //
      }
    } catch (err) {
      console.log("hCaptcha error", err);
      toast?.show({
        message:
          "Captcha challenge failed.\nPlease try again or connect a social account.",
        hideAfter: 5000,
      });
    } finally {
      // this has to be called to reset the captcha once validated with the server
      // captchaRef.current?.resetCaptcha();

      setChallengeIsRunning(false);
    }
  };

  const onExpire = () => {
    console.log("hCaptcha Token Expired");
  };

  const onError = (err: string) => {
    console.log(`hCaptcha Error: ${err}`);
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
        onError={onError}
        onExpire={onExpire}
        onVerify={() => {}}
        theme={isDark ? "dark" : "light"}
        languageOverride="en"
      />
      {challengeRunning && (
        <Portal.Root>
          <View
            tw="items-center justify-center bg-black opacity-[0.6] dark:bg-black dark:opacity-[0.6]"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          ></View>
        </Portal.Root>
      )}
    </>
  );
};
