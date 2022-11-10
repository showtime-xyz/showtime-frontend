import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useAuth } from "app/hooks/auth/use-auth";
import { Logger } from "app/lib/logger";
import { useMagic } from "app/lib/magic";
import { OAUTH_REDIRECT_URI } from "app/utilities";

import { LoginButton } from "./login-button";

const LoginWithTwitter = () => {
  const { magic } = useMagic();
  const { setAuthenticationStatus, login, logout } = useAuth();
  const router = useRouter();
  return (
    <LoginButton
      type="twitter"
      onPress={async () => {
        if (Platform.OS === "web") {
          //@ts-ignore
          await magic.oauth.loginWithRedirect({
            provider: "twitter",
            redirectURI: OAUTH_REDIRECT_URI,
            scope: ["email"],
          });
        } else {
          try {
            setAuthenticationStatus("AUTHENTICATING");
            //@ts-ignore
            const result = await magic.oauth.loginWithPopup({
              provider: "twitter",
              scope: ["email"],
              redirectURI: OAUTH_REDIRECT_URI,
            });

            const idToken = result.magic.idToken;
            const email = result.magic.userMetadata.email;
            console.log("idtoken ", result, idToken, email);
            // await login(LOGIN_MAGIC_ENDPOINT, {
            //   did: idToken,
            //   email,
            // });
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

export default LoginWithTwitter;
