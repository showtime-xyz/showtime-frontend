import { useState } from "react";

import { useMagic } from "app/lib/magic";
import { OAUTH_REDIRECT_URI } from "app/utilities";

import { Logger } from "../logger";

export const useMagicSocialAuth = () => {
  const { magic } = useMagic();
  // Maybe move spotify auth here?
  const [loading, setLoading] = useState<
    "twitter" | "google" | "apple" | "instagram" | null
  >(null);
  const [error, setError] = useState(null);

  const performMagicAuthWithTwitter = async () => {
    setError(null);
    setLoading("twitter");

    const scope = ["email"];
    const redirectUri = OAUTH_REDIRECT_URI;
    return magic.oauth
      .loginWithPopup({
        provider: "twitter",
        scope,
        redirectURI: redirectUri,
      })
      .catch((err) => {
        Logger.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(null);
      });
  };

  const performMagicAuthWithGoogle = async () => {
    const scope = ["email"];
    const redirectUri = OAUTH_REDIRECT_URI;
    setError(null);
    setLoading("google");

    return magic.oauth
      .loginWithPopup({
        provider: "google",
        scope,
        redirectURI: redirectUri,
      })
      .catch((err) => {
        Logger.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(null);
      });
  };

  const performMagicAuthWithApple = async () => {
    const scope = ["email"];
    const redirectUri = OAUTH_REDIRECT_URI;
    setError(null);
    setLoading("apple");

    return magic.oauth
      .loginWithPopup({
        provider: "apple",
        scope,
        redirectURI: redirectUri,
      })
      .catch((err) => {
        Logger.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(null);
      });
  };

  return {
    performMagicAuthWithApple,
    performMagicAuthWithGoogle,
    performMagicAuthWithTwitter,
    loading,
    error,
  };
};
