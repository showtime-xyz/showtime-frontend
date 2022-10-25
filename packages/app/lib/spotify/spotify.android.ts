import {
  auth as SpotifyAuth,
  ApiScope,
  ApiConfig,
} from "react-native-spotify-remote";

import { clientID } from "./queryString";

// Api Config object, replace with your own applications client id and urls

export const redirectUri =
  process.env.STAGE === "development"
    ? "io.showtime.development://spotify-success"
    : "io.showtime://spotify-success";
// TODO: patch this PR - https://github.com/spotify/android-auth/pull/89/files
const spotifyConfig: ApiConfig = {
  clientID,
  redirectURL: redirectUri,
  scopes: [ApiScope.UserLibraryModifyScope],
  authType: "CODE",
};

export const getSpotifyAuthCode = async () => {
  return SpotifyAuth.authorize(spotifyConfig);
};
