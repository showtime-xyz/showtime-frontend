import { useRef } from "react";

import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import { WebViewMessageEvent } from "react-native-webview";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

import { useRudder } from "app/lib/rudderstack";

import { toast } from "design-system/toast";

import { siteKey } from "./sitekey";

export const Challenge = () => {
  const { rudder } = useRudder();

  const isDark = useIsDarkMode();
  const captchaRef = useRef<ConfirmHcaptcha>(null);

  const onMessage = async (event: WebViewMessageEvent) => {
    if (event && event.nativeEvent.data) {
      if (["cancel", "error", "expired"].includes(event.nativeEvent.data)) {
        captchaRef.current?.hide();

        rudder?.track("hCaptcha Error", {
          error: event.nativeEvent.data,
        });
        toast("Captcha challenge failed.", {
          message: "Please try again or connect a social account.",
        });

        return;
      } else {
        const token = event.nativeEvent.data;
        console.log("Verified code from hCaptcha", token);
        captchaRef.current?.hide();

        // todo: send the response to the server and validate it

        rudder?.track("hCaptcha challenge success");
      }
    }
  };

  const showCaptcha = () => {
    captchaRef.current?.show();
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
