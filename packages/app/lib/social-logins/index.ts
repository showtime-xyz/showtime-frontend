import { useMagic } from "app/lib/magic";
import { OAUTH_REDIRECT_URI } from "app/utilities";

export const useMagicSocialAuth = () => {
  const { magic } = useMagic();

  const performMagicAuthWithTwitter = async () => {
    const scope = ["email"];
    const redirectUri = OAUTH_REDIRECT_URI;
    return magic.oauth.loginWithPopup({
      provider: "twitter",
      scope,
      redirectURI: redirectUri,
    });
  };

  const performMagicAuthWithGoogle = async () => {
    const scope = ["email"];
    const redirectUri = OAUTH_REDIRECT_URI;

    return magic.oauth.loginWithPopup({
      provider: "google",
      scope,
      redirectURI: redirectUri,
    });
  };

  const performMagicAuthWithApple = async () => {
    const scope = ["email"];
    const redirectUri = OAUTH_REDIRECT_URI;

    return magic.oauth.loginWithPopup({
      provider: "apple",
      scope,
      redirectURI: redirectUri,
    });
  };

  return {
    performMagicAuthWithApple,
    performMagicAuthWithGoogle,
    performMagicAuthWithTwitter,
  };
};
