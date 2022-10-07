// Types
export { default as ApiConfig } from './ApiConfig'
export { default as ApiScope } from './ApiScope';
export { default as RepeatMode } from './RepeatMode'
export { default as PlayerState } from './PlayerState';
export { default as PlayerContext } from './PlayerContext';
export { default as Track } from './Track';
export { default as Artist } from './Artist';
export { default as Album } from './Album';
export { default as ContentType } from './ContentType';
export { default as ContentItem } from './ContentItem';
export { default as CrossfadeState } from './CrossfadeState';
export { default as SpotifySession } from './SpotifySession';
export { default as GetChildrenItemsOptions } from './GetChildrenItemsOptions';
export { default as PlaybackOptions } from './PlaybackOptions';
export { default as PlaybackRestrictions } from "./PlaybackRestrictions";
export { default as RecommendedContentOptions } from "./RecommendedContentOptions";

export { SpotifyAuth } from './SpotifyAuth';
export { SpotifyRemoteApi, SpotifyRemoteEvents } from './SpotifyRemote';

// Modules
import { default as _auth } from './SpotifyAuth';
import { default as _remote } from './SpotifyRemote';

/** 
 * Singleton Instance of [[SpotifyAuth]]
 * ```typescript
 * import {auth} from 'react-native-spotify-remote'
 * ```
*/
export const auth = _auth;

/** 
 * Singleton Instance of [[SpotifyRemoteApi]]
 * ```typescript
 * import {remote} from 'react-native-spotify-remote'
 * ```
*/
export const remote = _remote;