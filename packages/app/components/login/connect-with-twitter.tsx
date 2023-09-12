import * as React from "react";
import { Button, Platform } from "react-native";

import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

const apiUrl = __DEV__
  ? "http://localhost:3000"
  : "https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN;

function makeRedirectUri({
  native,
  scheme,
  isTripleSlashed,
  queryParams,
  path,
  preferLocalhost,
}: any) {
  if (
    Platform.OS !== "web" &&
    native &&
    [ExecutionEnvironment.Standalone, ExecutionEnvironment.Bare].includes(
      Constants.executionEnvironment
    )
  ) {
    // Should use the user-defined native scheme in standalone builds
    return native;
  }
  const url = Linking.createURL(path || "", {
    isTripleSlashed,
    scheme,
    queryParams,
  });

  if (preferLocalhost) {
    const ipAddress = url.match(
      /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/
    );
    // Only replace if an IP address exists
    if (ipAddress?.length) {
      const [protocol, path] = url.split(ipAddress[0]);
      return `${protocol}localhost${path}`;
    }
  }

  return url;
}

async function authenticateWithTwitter() {
  const redirectUri =
    makeRedirectUri({
      scheme: `io.showtime${__DEV__ ? ".development" : ""}:/`,
    }) + "/twitter-oauth-redirect";

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
      return tokenRes;
    }
  }
}

export function ConnectWithTwitter() {
  return (
    <Button
      title="Login"
      onPress={async () => {
        authenticateWithTwitter();
      }}
    />
  );
}
