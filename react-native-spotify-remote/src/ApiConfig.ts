import ApiScope from './ApiScope';

export default interface SpotifyApiConfig {
  /**
   * Client Id of application registered with Spotify Api
   * see https://developer.spotify.com/dashboard/applications
   *
   * @type {string}
   * @memberof SpotifyApiConfig
   */
  clientID: string;

  /**
   * The redirect url back to your application (i.e. myapp://spotify-login-callback )
   *
   * @type {string}
   * @memberof SpotifyApiConfig
   */
  redirectURL: string;

  /**
   * Endpoint on your server to do token swap
   *
   * @type {string}
   * @memberof SpotifyApiConfig
   */
  tokenSwapURL?: string;

  /**
   * Endpoint on your server to refesh token
   *
   * @type {string}
   * @memberof SpotifyApiConfig
   */
  tokenRefreshURL?: string;

  /**
   * URI of Spotify item to play upon authorization. `""` will
   * attempt to resume playback from where it was.
   *
   * **Note:**
   * *If Spotify is already open and playing, this parameter will not*
   * *have any effect*
   * @type {string}
   * @memberof SpotifyApiConfig
   */
  playURI?: string;

  /**
   * Requested API Scopes, need to have AppRemoteControlScope
   * to control playback of app
   * @type {ApiScope}
   * @memberof SpotifyApiConfig
   */
  scopes?: ApiScope[];

  /**
   * Whether or not the auth dialog should be shown.
   * Useful for debugging auth flows.
   *
   * @type {boolean}
   * @memberof SpotifyApiConfig
   */
  showDialog?: boolean;

  /**
   * (Android) Choose the response type CODE or TOKEN.
   * Useful to determine if you need a on time login or a longterm login.
   *
   * @type {'TOKEN' | 'CODE'}
   * @memberof SpotifyApiConfig
   */
  authType?: 'TOKEN' | 'CODE';
}

export const API_CONFIG_DEFAULTS: Partial<SpotifyApiConfig> = {
  showDialog: false,
  scopes: [],
};
