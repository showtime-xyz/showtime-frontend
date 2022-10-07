export default interface CrossfadeState {
    /**
     * The on/off state of crossfade.
     *
     * @type {boolean}
     * @memberof CrossfadeState
     */
    enabled: boolean;

    /**
     * The duration of crossfade in milliseconds. The value is meaningless if crossfade is not enabled.
     *
     * @type {number}
     * @memberof CrossfadeState
     */
    duration: number;
}
