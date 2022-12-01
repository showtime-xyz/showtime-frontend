import { useState, useRef, useEffect } from "react";

import { useRouter } from "@showtime-xyz/universal.router";

import { useLatestValueRef } from "app/hooks/use-latest-value-ref";
import { useWeb3 } from "app/hooks/use-web3";
import { Logger } from "app/lib/logger";
import { useMagic } from "app/lib/magic";
import { createParam } from "app/navigation/use-param";
import { isProfileIncomplete } from "app/utilities";

import { useAuth } from "./use-auth";
import { LOGIN_MAGIC_ENDPOINT } from "./use-magic-login";

type Query = {
  redirectUri?: string;
  error?: string;
  shouldLogin?: string;
};

const { useParam } = createParam<Query>();

export const useMagicAuthRedirect = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { magic } = useMagic();
  const requestSent = useRef(false);
  const router = useRouter();
  const [redirectUri] = useParam("redirectUri");
  const [shouldLogin] = useParam("shouldLogin");
  const { setWeb3 } = useWeb3();
  const shouldLoginRef = useLatestValueRef(shouldLogin);
  const decodedURI = useLatestValueRef(redirectUri);
  const [magicError] = useParam("error");

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

            const EthersWeb3Provider = (
              await import("@ethersproject/providers")
            ).Web3Provider;
            // @ts-ignore
            const ethersProvider = new EthersWeb3Provider(magic.rpcProvider);
            setWeb3(ethersProvider);

            // when profile is incomplete, login will automatically redirect user to /profile/edit. So we don't need to redirect user to decodedURI
            if (!isProfileIncomplete(user.data.profile) && decodedURI.current) {
              router.replace(decodedURI.current);
            }
          } else if (decodedURI.current) {
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
    setWeb3,
  ]);

  useEffect(() => {
    if (magicError) {
      setError(true);
    }
  }, [magicError]);

  return {
    loading,
    error,
  };
};
