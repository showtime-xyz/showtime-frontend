import { useState } from "react";
import { Platform } from "react-native";

import * as WebBrowser from "expo-web-browser";

import { useMagic } from "app/lib/magic";
import { OAUTH_REDIRECT_URI } from "app/utilities";

import { Logger } from "../logger";

export const useMagicSocialAuth = () => {
  const { magic } = useMagic();
  // Maybe move spotify auth here?
  const [loading, setLoading] = useState<
    "twitter" | "google" | "apple" | "instagram" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const getInstagramToken = async () => {
    setLoading("instagram");
    setError(null);

    const redirectURI = Platform.select({
      web: `${
        __DEV__
          ? "http://localhost:3000"
          : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`
      }/instagram-oauth-redirect`,
      default: `io.showtime${
        __DEV__ ? ".development" : ""
      }://instagram-oauth-redirect`,
    });

    let redirectAPIHandler = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/api/instagram-oauth-redirect`;
    const url = `https://api.instagram.com/oauth/authorize?client_id=${
      process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      redirectAPIHandler
    )}&response_type=code&scope=user_profile&state=${encodeURIComponent(
      redirectURI
    )}`;

    try {
      const res = await WebBrowser.openAuthSessionAsync(url, redirectURI);
      if (res.type === "success") {
        let urlObj = new URL(res.url);
        const code = urlObj.searchParams.get("code");
        return code;
      } else {
        setError("Something went wrong ");
        Logger.error("Something went wrong ", res);
      }
    } catch (err) {
      setError("Something went wrong");
      Logger.error("Instagram connect failed ", err);
    } finally {
      setLoading(null);
    }
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
    getInstagramToken,
    loading,
    error,
  };
};
