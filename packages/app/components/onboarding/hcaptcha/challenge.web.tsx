import { useRef, useState } from "react";

import HCaptcha from "@hcaptcha/react-hcaptcha";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Spinner } from "@showtime-xyz/universal.spinner";

// demo sitekey
const siteKey = "e75de5d7-0f0c-4061-8647-65362888979e";

export const Challenge = () => {
  const [hCaptchaLoaded, setHCaptchaLoaded] = useState(false);
  const isDark = useIsDarkMode();
  const captchaRef = useRef<HCaptcha>(null);

  const onLoad = () => {
    console.log("hCaptcha loaded");
    setHCaptchaLoaded(true);
  };

  const showCaptcha = () => {
    // this reaches out to the hcaptcha library and runs the
    // execute function on it. you can use other functions as well
    // documented in the api:
    // https://docs.hcaptcha.com/configuration#jsapi
    captchaRef.current?.execute();
  };

  const onExpire = () => {
    console.log("hCaptcha Token Expired");
  };

  const onError = (err: string) => {
    console.log(`hCaptcha Error: ${err}`);
  };

  return (
    <>
      <Button
        size="regular"
        variant="text"
        onPress={showCaptcha}
        disabled={!hCaptchaLoaded}
      >
        {hCaptchaLoaded ? (
          "Skip"
        ) : (
          <Spinner size="small" color={isDark ? "white" : "black"} />
        )}
      </Button>
      <HCaptcha
        onLoad={onLoad}
        ref={captchaRef}
        sitekey={siteKey}
        size="invisible"
        onError={onError}
        onExpire={onExpire}
        theme={isDark ? "dark" : "light"}
      />
    </>
  );
};
