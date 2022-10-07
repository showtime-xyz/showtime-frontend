import { NativeModules, Platform } from 'react-native';
import SpotifyApiConfig, { API_CONFIG_DEFAULTS } from './ApiConfig';
import SpotifySession from './SpotifySession';
import { getiOSScopeFromScopes } from './ApiScope';

/**
 * Spotify Authorization Module
 * 
 * *Used for managing Spotify Session*
 * 
 * ```typescript
 * import { auth as SpotifyAuth, remote as SpotifyRemote, ApiScope, ApiConfig } from 'react-native-spotify-remote';
 * const spotifyConfig: ApiConfig = {
 *     clientID: "SPOTIFY_CLIENT_ID",
 *     redirectURL: "SPOTIFY_REDIRECT_URL",
 *     tokenRefreshURL: "SPOTIFY_TOKEN_REFRESH_URL",
 *     tokenSwapURL: "SPOTIFY_TOKEN_SWAP_URL",
 *     scope: ApiScope.AppRemoteControlScope | ApiScope.UserFollowReadScope
 * }
 * async function playEpicSong(){
 *     try{
 *         const token = await SpotifyAuth.initialize(spotifyConfig);
 *         await SpotifyRemote.connect(token);
 *         SpotifyRemote.playUri("spotify:track:6IA8E2Q5ttcpbuahIejO74#0:38");
 *     }catch(err){
 *         console.error("Couldn't authorize with or connect to Spotify",err);
 *     }   
 * }
 * ```
 */
export interface SpotifyAuth {

    /**
     * Initializes a Session with Spotify and returns an accessToken
     * that can be used for interacting with other services
     *
     * @param {SpotifyApiConfig} config
     * @returns {Promise<string>} accessToken
     * @deprecated Use `authorize` instead, will be removed in future release
     */
    initialize(config: SpotifyApiConfig): Promise<string>;

    /**
     * Authorizes with Spotify returning a SpotifySession object if successful
     *
     * @param {SpotifyApiConfig} config
     * @returns {Promise<SpotifySession>}
     * @memberof SpotifyAuth
     */
    authorize(config: SpotifyApiConfig): Promise<SpotifySession>;

    /**
     * Ends the current Session and cleans up any resources
     *
     * @returns {Promise<void>}
     * @memberof SpotifyAuth
     */
    endSession(): Promise<void>;

    /**
     * Returns the current session or `undefined` if a session hasn't been started
     *
     * @returns {Promise<SpotifySession>}
     * @memberof SpotifyAuth
     */
    getSession(): Promise<SpotifySession | undefined>;
}

const SpotifyAuth = NativeModules.RNSpotifyRemoteAuth as SpotifyAuth;

// Augment the iOS implementation of authorize to convert the Android style scopes
// to flags
if (Platform.OS === "ios") {
    const iosAuthorize = NativeModules.RNSpotifyRemoteAuth.authorize;
    SpotifyAuth.authorize = (config: SpotifyApiConfig) => {
        const iosConfig = {
            ...API_CONFIG_DEFAULTS,
            ...config,
            scopes: getiOSScopeFromScopes(config.scopes)
        }
        return iosAuthorize(iosConfig);
    }
}

if(Platform.OS === "android"){
    const androidAuthorize = NativeModules.RNSpotifyRemoteAuth.authorize;
    SpotifyAuth.authorize = (config: SpotifyApiConfig) => {
        const mergedConfig = {
            ...API_CONFIG_DEFAULTS,
            ...config,
        }
        return androidAuthorize(mergedConfig);
    }
}


// todo: remove in future release
// Here for backwards compatability
SpotifyAuth.initialize = async (config: SpotifyApiConfig) => {
    const session = await SpotifyAuth.authorize(config);
    return session.accessToken;
}



export default SpotifyAuth;