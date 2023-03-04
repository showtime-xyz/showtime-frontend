import { useRef } from "react";

import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import { WebViewMessageEvent } from "react-native-webview";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useToast } from "@showtime-xyz/universal.toast";

import { useRudder } from "app/lib/rudderstack";

// demo sitekey
const siteKey = "00000000-0000-0000-0000-000000000000";

export const Challenge = () => {
  const toast = useToast();
  const { rudder } = useRudder();

  const isDark = useIsDarkMode();
  const captchaRef = useRef<ConfirmHcaptcha>(null);

  const onMessage = (event: WebViewMessageEvent) => {
    if (event && event.nativeEvent.data) {
      if (["cancel", "error", "expired"].includes(event.nativeEvent.data)) {
        captchaRef.current?.hide();

        rudder?.track("hCaptcha Error", {
          error: event.nativeEvent.data,
        });
        toast?.show({
          message: "Captcha challenge failed. Please try again.",
          hideAfter: 3000,
        });

        return;
      } else {
        console.log("Verified code from hCaptcha", event.nativeEvent.data);
        captchaRef.current?.hide();

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
