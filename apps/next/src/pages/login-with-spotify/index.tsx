import { Linking } from "react-native";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { useUser } from "app/hooks/use-user";

import { Button } from "design-system/button";

import { getSpotifyRedirectUri } from "./util";

const clientId = "e12f7eea542947ff843cfc68d762235a";
const scope =
  "user-read-recently-played user-read-private user-read-email user-follow-modify user-follow-read user-library-modify user-library-read";
const generateState = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return Array.from(Array(length))
    .map(() => possible.charAt(Math.floor(Math.random() * possible.length)))
    .join("");
};

const getSpotifyLoginParams = () => {
  const state = generateState(16);
  localStorage.setItem("spotify_auth_state", state);

  const params = {
    client_id: clientId,
    scope,
    redirect_uri: getSpotifyRedirectUri(),
    state,
    response_type: "code",
  };

  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  return `https://accounts.spotify.com/authorize?${queryString}`;
};

const LoginWithSpotify = withColorScheme(() => {
  const { isAuthenticated } = useUser();
  return (
    <ErrorBoundary>
      <View tw="flex-1" style={{ marginTop: 48 }}>
        {isAuthenticated ? (
          <Button onPress={() => Linking.openURL(getSpotifyLoginParams())}>
            Login With Spotify
          </Button>
        ) : (
          <Text style={{ alignContent: "center" }}>
            You must be logged in to login with Spotify.
          </Text>
        )}
      </View>
    </ErrorBoundary>
  );
});

export default LoginWithSpotify;
