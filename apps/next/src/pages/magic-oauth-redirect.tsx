import { useState, useRef, useEffect } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useAuth } from "app/hooks/auth/use-auth";
import { LOGIN_MAGIC_ENDPOINT } from "app/hooks/auth/use-magic-login";
import { Logger } from "app/lib/logger";
import { useMagic } from "app/lib/magic";
import { createParam } from "app/navigation/use-param";

type Query = {
  redirectUri?: string;
};

const { useParam } = createParam<Query>();
const MagicOauthRedirect = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { magic } = useMagic();
  const requestSent = useRef(false);
  const router = useRouter();
  const [redirectUri] = useParam("redirectUri");

  useEffect(() => {
    (async function getMagicAuthData() {
      if (magic && requestSent.current === false && redirectUri) {
        try {
          requestSent.current = true;
          setLoading(true);
          setAuthenticationStatus("AUTHENTICATING");
          //@ts-ignore
          const result = await magic.oauth.getRedirectResult();
          const idToken = result.magic.idToken;
          await login(LOGIN_MAGIC_ENDPOINT, {
            did: idToken,
          });
          setLoading(false);
          router.push(redirectUri);
        } catch (e) {
          Logger.error(e);
          logout();
          router.push(redirectUri);
          setError(true);
        }
      }
    })();
  }, [magic, login, logout, router, setAuthenticationStatus, redirectUri]);

  return (
    <View tw="flex h-screen w-screen items-center justify-center">
      {loading ? (
        <View tw="flex-row items-center">
          <Text tw="text-base font-bold text-gray-900 dark:text-gray-100">
            Please wait
          </Text>
          <View tw="ml-2">
            <Spinner size="medium" />
          </View>
        </View>
      ) : error ? (
        <View>
          <Text tw="text-base font-bold text-gray-900 dark:text-gray-100">
            Sorry. Something went wrong
          </Text>
          <Button
            tw="mt-4"
            onPress={() => {
              router.push("/");
            }}
          >
            Go back
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export default MagicOauthRedirect;
