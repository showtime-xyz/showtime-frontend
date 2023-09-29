import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export async function authenticateWithTwitter() {
  const apiUrl = "https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN;
  const redirectUri = Linking.createURL("twitter-oauth-redirect");

  const stateValue = encodeURI(redirectUri);
  const proxyRedirectUri = `${apiUrl}/api/twitter-auth/success-redirect?state=${stateValue}`;
  const response = await fetch(
    `${apiUrl}/api/twitter-auth/request-token?callback_url=${proxyRedirectUri}`
  );
  const res = await response.json();

  const authUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauth_token}`;
  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
  if (result.type === "success") {
    const params = new URLSearchParams(result.url.split("?")[1]);
    const oauthVerifier = params.get("oauth_verifier");
    const oauthToken = params.get("oauth_token");
    if (oauthVerifier && oauthToken) {
      const accessTokenResponse = await fetch(
        `${apiUrl}/api/twitter-auth/access-token?oauth_verifier=${oauthVerifier}&oauth_token=${oauthToken}&oauth_token_secret=${res.oauth_token_secret}`
      );
      const tokenRes = await accessTokenResponse.json();
      return {
        token: tokenRes.oauth_token + "+" + tokenRes.oauth_token_secret,
        redirectUri: proxyRedirectUri,
      };
    }
  }
}
