import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useAuth } from "app/hooks/auth/use-auth";
import { LOGIN_MAGIC_ENDPOINT } from "app/hooks/auth/use-magic-login";
import { Logger } from "app/lib/logger";
import { useMagicSocialAuth } from "app/lib/social-logins";

import { LoginButton } from "./login-button";

export const LoginWithGoogle = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const router = useRouter();
  const { performMagicAuthWithGoogle } = useMagicSocialAuth();

  return (
    <LoginButton
      type="google"
      onPress={async () => {
        if (Platform.OS === "web") {
          performMagicAuthWithGoogle({ redirectUri: "/", shouldLogin: "yes" });
        } else {
          try {
            setAuthenticationStatus("AUTHENTICATING");
            const result = await performMagicAuthWithGoogle();
            const idToken = result.magic.idToken;
            await login(LOGIN_MAGIC_ENDPOINT, {
              did: idToken,
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
