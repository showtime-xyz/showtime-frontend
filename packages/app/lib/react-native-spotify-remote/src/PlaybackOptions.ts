import RepeatMode from './RepeatMode';


/**
 * Player Playback options
 *
 * @export
 * @interface PlaybackOptions
 */
export default interface PlaybackOptions {

    /**
     * Shuffling on / off
     *
     * @type {boolean}
     * @memberof PlaybackOptions
     */
    isShuffling: boolean;

    /**
     * The repeat mode of playback
     *
     * @type {RepeatMode}
     * @memberof PlaybackOptions
     */
    repeatMode: RepeatMode;
}