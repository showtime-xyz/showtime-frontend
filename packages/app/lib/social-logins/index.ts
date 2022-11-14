import { Platform } from "react-native";

import { useMagic } from "app/lib/magic";
import { OAUTH_REDIRECT_URI } from "app/utilities";

type Config = {
  shouldLogin?: string;
  redirectUri?: string;
};

export const useMagicSocialAuth = () => {
  const { magic } = useMagic();

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
