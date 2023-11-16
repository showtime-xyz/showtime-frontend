import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

import { useRouter } from "@showtime-xyz/universal.router";

import { useAuth } from "app/hooks/auth/use-auth";
import { LOGIN_MAGIC_ENDPOINT } from "app/hooks/auth/use-magic-login";
import { useWeb3 } from "app/hooks/use-web3";
import { Logger } from "app/lib/logger";
import { useMagic } from "app/lib/magic";
import { useMagicSocialAuth } from "app/lib/social-logins";
import { isProfileIncomplete } from "app/utilities";

import { LoginButton } from "./login-button";

export const LoginWithApple = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const router = useRouter();
  const { performMagicAuthWithApple } = useMagicSocialAuth();
  const { setWeb3 } = useWeb3();
  const { magic } = useMagic();

  return (
    <LoginButton
      type="apple"
      onPress={async () => {
        try {
          setAuthenticationStatus("AUTHENTICATING");
          const result = await performMagicAuthWithApple();
          const idToken = result.magic.idToken;
          const user = await login(LOGIN_MAGIC_ENDPOINT, {
            did: idToken,
            provider_access_token: result.oauth.accessToken,
            provider_scope: result.oauth.scope,
          });

          const client = createWalletClient({
            chain: mainnet,
            transport: custom(magic.rpcProvider),
          });

          setWeb3({ ...client, isMagic: true });

          // when profile is incomplete, login will automatically redirect user to /profile/edit. So we don't need to redirect user to decodedURI
          if (!isProfileIncomplete(user.data.profile)) {
            router.pop();
          }
        } catch (e) {
          Logger.error(e);
          logout();
        }
      }}
    />
  );
};
