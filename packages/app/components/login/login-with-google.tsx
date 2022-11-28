import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useAuth } from "app/hooks/auth/use-auth";
import { LOGIN_MAGIC_ENDPOINT } from "app/hooks/auth/use-magic-login";
import { useWeb3 } from "app/hooks/use-web3";
import { Logger } from "app/lib/logger";
import { useMagic } from "app/lib/magic";
import { useMagicSocialAuth } from "app/lib/social-logins";
import { isProfileIncomplete } from "app/utilities";

import { LoginButton } from "./login-button";

export const LoginWithGoogle = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const router = useRouter();
  const { performMagicAuthWithGoogle } = useMagicSocialAuth();
  const { setWeb3 } = useWeb3();
  const { magic } = useMagic();

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
            const user = await login(LOGIN_MAGIC_ENDPOINT, {
              did: idToken,
            });

            const EthersWeb3Provider = (
              await import("@ethersproject/providers")
            ).Web3Provider;
            // @ts-ignore
            const ethersProvider = new EthersWeb3Provider(magic.rpcProvider);
            setWeb3(ethersProvider);
            // when profile is incomplete, login will automatically redirect user to /profile/edit. So we don't need to redirect user to decodedURI
            if (!isProfileIncomplete(user.data.profile)) {
              router.pop();
            }
          } catch (e) {
            Logger.error(e);
            logout();
          }
        }
      }}
    />
  );
};
