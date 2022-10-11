import {
  auth as SpotifyAuth,
  ApiScope,
  ApiConfig,
} from "app/lib/react-native-spotify-remote";

// Api Config object, replace with your own applications client id and urls

export const redirectUri = "io.showtime.development://spotify-success";
// TODO: patch this PR - https://github.com/spotify/android-auth/pull/89/files
const spotifyConfig: ApiConfig = {
  clientID: "e12f7eea542947ff843cfc68d762235a",
  redirectURL: redirectUri,
  scopes: [
    ApiScope.UserReadRecentlyPlayedScope,
    ApiScope.UserReadPrivateScope,
    ApiScope.UserReadEmailScope,
    ApiScope.UserFollowModifyScope,
    ApiScope.UserFollowReadScope,
    ApiScope.UserLibraryModifyScope,
    ApiScope.UserLibraryReadScope,
    ApiScope.UserTopReadScope,
    ApiScope.UserReadPrivateScope,
  ],
  authType: "CODE",
};

export const getSpotifyAuthCode = async () => {
  return SpotifyAuth.authorize(spotifyConfig);
};
