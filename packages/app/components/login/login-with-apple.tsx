import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";

import { useAuth } from "app/hooks/auth/use-auth";
import { LOGIN_MAGIC_ENDPOINT } from "app/hooks/auth/use-magic-login";
import { Logger } from "app/lib/logger";
import { useMagic } from "app/lib/magic";

const APPLE_REDIRECT_URI = Platform.select({
  web: __DEV__
    ? "http://localhost:3000/magic-oauth-redirect"
    : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/magic-oauth-redirect`,
  default: `io.showtime${__DEV__ ? ".development" : ""}://magic-oauth-redirect`,
});

export const LoginWithApple = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const { magic } = useMagic();
  const router = useRouter();

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
          try {
            setAuthenticationStatus("AUTHENTICATING");
            const result = await magic.oauth.loginWithPopup({
              provider: "apple",
              redirectURI: APPLE_REDIRECT_URI,
            });

            const idToken = result.magic.idToken;
            const email = result.magic.userMetadata.email;
            await login(LOGIN_MAGIC_ENDPOINT, {
              did: idToken,
              email,
            });
            router.pop();
          } catch (e) {
            Logger.error(e);
            logout();
          }
        }
      }}
    >
      Login with Apple
    </Button>
  );
};
