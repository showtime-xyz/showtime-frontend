import { useState, useRef, useEffect } from "react";

import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useAuth } from "app/hooks/auth/use-auth";
import { LOGIN_MAGIC_ENDPOINT } from "app/hooks/auth/use-magic-login";
import { Logger } from "app/lib/logger";
import { useMagic } from "app/lib/magic";

import { Button, Spinner } from "design-system";

const MagicOauthRedirect = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { magic } = useMagic();
  const requestSent = useRef(false);
  const router = useRouter();

  useEffect(() => {
    (async function getMagicAuthData() {
      if (magic && requestSent.current === false) {
        try {
          requestSent.current = true;
          setLoading(true);
          setAuthenticationStatus("AUTHENTICATING");
          //@ts-ignore
          const result = await magic.oauth.getRedirectResult();
          const idToken = result.magic.idToken;
          const email = result.magic.userMetadata.email;
          await login(LOGIN_MAGIC_ENDPOINT, {
            did: idToken,
            email,
          });
          setLoading(false);
          router.push("/");
        } catch (e) {
          Logger.error(e);
          logout();
          router.push("/");
          setError(true);
        }
      }
    })();
  }, [magic, login, logout, router, setAuthenticationStatus]);

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
