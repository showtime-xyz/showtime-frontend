import PlaybackOptions from './PlaybackOptions';
import PlaybackRestrictions from './PlaybackRestrictions';
import Track from './Track';


/**
 * The state of the player in Spotify
 *
 * @export
 * @interface PlayerState
 */
export default interface PlayerState {

    /**
     * The Current Track
     *
     * @type {Track}
     * @memberof PlayerState
     */
    track: Track;

    /**
     * Current playback position in ms
     *
     * @type {number}
     * @memberof PlayerState
     */
    playbackPosition: number;

    /**
     * Playback speed (podcasts)
     *
     * @type {*}
     * @memberof PlayerState
     */
    playbackSpeed: any;

    /**
     * Whether the player is Paused
     *
     * @type {boolean}
     * @memberof PlayerState
     */
    isPaused: boolean;

    /**
     * Any playback restrictions for the current user account
     *
     * @type {PlaybackRestrictions}
     * @memberof PlayerState
     */
    playbackRestrictions: PlaybackRestrictions;


    /**
     * Current Playback options
     *
     * @type {PlaybackOptions}
     * @memberof PlayerState
     */
    playbackOptions: PlaybackOptions;
}

