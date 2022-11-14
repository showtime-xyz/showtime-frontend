// Web only component. This component never gets rendered on native. It handles the redirect from magic.link
import { useState, useRef, useEffect } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useAuth } from "app/hooks/auth/use-auth";
import { LOGIN_MAGIC_ENDPOINT } from "app/hooks/auth/use-magic-login";
import { useLatestValueRef } from "app/hooks/use-latest-value-ref";
import { Logger } from "app/lib/logger";
import { useMagic } from "app/lib/magic";
import { createParam } from "app/navigation/use-param";
import { isProfileIncomplete } from "app/utilities";

type Query = {
  redirectUri?: string;
  error?: string;
  shouldLogin?: string;
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
  const [magicError] = useParam("error");
  const [shouldLogin] = useParam("shouldLogin");

  const decodedURI = useLatestValueRef(redirectUri);
  const shouldLoginRef = useLatestValueRef(shouldLogin);

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
          if (shouldLoginRef.current) {
            const user = await login(LOGIN_MAGIC_ENDPOINT, {
              did: idToken,
            });
            // when profile is incomplete, login will automatically redirect user to /profile/edit. So we don't need to redirect user to decodedURI
            if (!isProfileIncomplete(user.data.profile)) {
              router.replace(decodedURI.current);
            }
          } else {
            let pathname = decodedURI.current;
            if (decodedURI.current.includes("?")) {
              pathname = decodedURI.current + "&did=" + idToken;
            } else {
              pathname = decodedURI.current + "?did=" + idToken;
            }

            router.replace(pathname);
          }
          setLoading(false);
        } catch (e) {
          Logger.error(e);
          router.push(decodedURI.current);
          setError(true);
        }
      }
    })();
  }, [
    magic,
    login,
    logout,
    router,
    setAuthenticationStatus,
    decodedURI,
    shouldLoginRef,
  ]);

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
      ) : error || magicError ? (
        <View tw="h-screen w-full items-center justify-center">
          <Text tw="text-base font-bold text-gray-900 dark:text-gray-100">
            Sorry. Something went wrong
          </Text>
          <Button
            tw="mt-4"
            onPress={() => {
              router.replace("/");
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
