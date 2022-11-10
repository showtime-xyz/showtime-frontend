import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useAuth } from "app/hooks/auth/use-auth";
import { LOGIN_MAGIC_ENDPOINT } from "app/hooks/auth/use-magic-login";
import { Logger } from "app/lib/logger";
import { useMagic } from "app/lib/magic";
import { OAUTH_REDIRECT_URI } from "app/utilities";

import { LoginButton } from "./login-button";

export const LoginWithApple = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const { magic } = useMagic();
  const router = useRouter();
  return (
    <LoginButton
      type="apple"
      onPress={async () => {
        if (Platform.OS === "web") {
          //@ts-ignore
          await magic.oauth.loginWithRedirect({
            provider: "apple",
            redirectURI: OAUTH_REDIRECT_URI,
            scope: ["email"],
          });
        } else {
          try {
            setAuthenticationStatus("AUTHENTICATING");
            //@ts-ignore
            const result = await magic.oauth.loginWithPopup({
              provider: "apple",
              redirectURI: OAUTH_REDIRECT_URI,
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
    />
  );
};
