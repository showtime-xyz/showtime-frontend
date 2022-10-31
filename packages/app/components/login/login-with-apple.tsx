import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";

import { useMagic } from "app/providers/magic-provider.web";

const APPLE_REDIRECT_URI = Platform.select({
  web: __DEV__
    ? "http://localhost:3000/magic-oauth-redirect"
    : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/magic-oauth-redirect`,
  default: `io.showtime${__DEV__ ? ".development" : ""}://magic-oauth-redirect`,
});

export const LoginWithApple = () => {
  const { magic } = useMagic();
  return (
    <Button
      size="regular"
      onPress={async () => {
        if (Platform.OS === "web") {
          await magic.oauth.loginWithRedirect({
            provider: "apple",
            redirectURI: APPLE_REDIRECT_URI,
            scope: ["email"],
          });
        } else {
          const result = await magic.oauth.loginWithPopup({
            provider: "apple",
            redirectURI: APPLE_REDIRECT_URI,
            scope: ["email"],
          });

          console.log("result ", result);
          // Do the api call here
        }
      }}
    >
      Login with Apple
    </Button>
  );
};
