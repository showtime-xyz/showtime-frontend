import { useRouter } from "@showtime-xyz/universal.router";

import { useAuth } from "app/hooks/auth/use-auth";
import { LOGIN_MAGIC_ENDPOINT } from "app/hooks/auth/use-magic-login";
import { Logger } from "app/lib/logger";
import { useMagicSocialAuth } from "app/lib/social-logins";

import { LoginButton } from "./login-button";

export const LoginWithTwitter = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const router = useRouter();
  const { performMagicAuthWithTwitter } = useMagicSocialAuth();

  return (
    <LoginButton
      type="twitter"
      onPress={async () => {
        try {
          setAuthenticationStatus("AUTHENTICATING");
          const result = await performMagicAuthWithTwitter();
          const idToken = result.magic.idToken;
          await login(LOGIN_MAGIC_ENDPOINT, {
            did: idToken,
          });
          router.pop();
        } catch (e) {
          Logger.error(e);
          logout();
        }
      }}
    />
  );
};
