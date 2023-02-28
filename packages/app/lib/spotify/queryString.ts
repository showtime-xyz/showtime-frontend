import { Platform } from "react-native";

export const redirectUri = Platform.select({
  web: `${
    __DEV__
      ? "http://localhost:3000"
      : "https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN
  }/spotify-auth/redirect`,
  default: `io.showtime${__DEV__ ? ".development" : ""}://spotify-success`,
});

export const scope = [
  "user-library-modify",
  "user-library-read",
  "user-follow-modify",
  "user-follow-read",
].join("%20");

export const clientID = "e12f7eea542947ff843cfc68d762235a";

export const getQueryString = (_redirectUri?: string) => {
  const state = _redirectUri ? `redirectUri=${_redirectUri}` : "";

  const params = {
    client_id: clientID,
    redirect_uri: redirectUri,
    state,
    response_type: "code",
  };

  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  // Something about using encodeURIComponent and setting in the href
  // changes %20 back to a space.
  // https://stackoverflow.com/a/16598501
  // I couldn't get it to work otherwise

  return `https://accounts.spotify.com/authorize?${queryString}&${scope}`;
};
