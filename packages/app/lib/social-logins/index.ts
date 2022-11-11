import { useState } from "react";
import { Platform } from "react-native";

import { useAuth } from "app/hooks/auth/use-auth";
import { useMagic } from "app/lib/magic";
import { OAUTH_REDIRECT_URI } from "app/utilities";

type Config = {
  shouldLogin?: string;
  redirectUri?: string;
};

export const useMagicSocialAuth = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { magic } = useMagic();

  //   // Web only
  //   const handleLoginRedirectOnWeb = async () => {
  //     try {
  //       setLoading(true);
  //       setAuthenticationStatus("AUTHENTICATING");
  //       //@ts-ignore
  //       const result = await magic.oauth.getRedirectResult();
  //       const idToken = result.magic.idToken;
  //       await login(LOGIN_MAGIC_ENDPOINT, {
  //         did: idToken,
  //       });
  //       console.log("efef ", result);
  //     } catch (e) {
  //       Logger.error(e);
  //       logout();
  //       setError(true);
  //       throw e;
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Web only
  //   const handleLogin = async () => {
  //     try {
  //       setLoading(true);
  //       setAuthenticationStatus("AUTHENTICATING");
  //       //@ts-ignore
  //       const result = await magic.oauth.getRedirectResult();
  //       const idToken = result.magic.idToken;
  //       await login(LOGIN_MAGIC_ENDPOINT, {
  //         did: idToken,
  //       });
  //       console.log("efef ", result);
  //     } catch (e) {
  //       Logger.error(e);
  //       logout();
  //       setError(true);
  //       throw e;
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const performMagicAuthWithTwitter = async (config?: Config) => {
    const scope = ["email"];
    const params = new URLSearchParams(config).toString();
    const redirectUri = OAUTH_REDIRECT_URI + "?" + params;
    if (Platform.OS === "web") {
      //@ts-ignore
      return magic.oauth.loginWithRedirect({
        provider: "twitter",
        redirectURI: redirectUri,
        scope,
      });
    } else {
      return magic.oauth.loginWithPopup({
        provider: "twitter",
        scope,
        redirectURI: redirectUri,
      });
    }
  };

  const performMagicAuthWithGoogle = async (config?: Config) => {
    const scope = ["email"];
    const params = new URLSearchParams(config).toString();
    const redirectUri = OAUTH_REDIRECT_URI + "?" + params;

    if (Platform.OS === "web") {
      //@ts-ignore
      return magic.oauth.loginWithRedirect({
        provider: "google",
        redirectURI: redirectUri,
        scope,
      });
    } else {
      return magic.oauth.loginWithPopup({
        provider: "google",
        scope,
        redirectURI: redirectUri,
      });
    }
  };

  const performMagicAuthWithApple = async (config?: Config) => {
    const scope = ["email"];
    const params = new URLSearchParams(config).toString();
    const redirectUri = OAUTH_REDIRECT_URI + "?" + params;

    if (Platform.OS === "web") {
      //@ts-ignore
      return magic.oauth.loginWithRedirect({
        provider: "apple",
        redirectURI: redirectUri,
        scope,
      });
    } else {
      return magic.oauth.loginWithPopup({
        provider: "apple",
        scope,
        redirectURI: redirectUri,
      });
    }
  };

  return {
    performMagicAuthWithApple,
    performMagicAuthWithGoogle,
    performMagicAuthWithTwitter,
  };
};
