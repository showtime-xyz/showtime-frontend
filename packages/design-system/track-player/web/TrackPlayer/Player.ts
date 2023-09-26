import { DeviceEventEmitter } from "react-native";

import { State, Track, Progress, PlaybackState } from "../types";

// import { SetupNotCalledError } from "./SetupNotCalledError";

export class Player {
  protected emitter = DeviceEventEmitter;
  protected element?: HTMLMediaElement;
  protected player?: shaka.Player;
  protected _current?: Track = undefined;
  protected _playWhenReady: boolean = false;
  protected _state: PlaybackState = { state: State.None };

  // current getter/setter
  public get current(): Track | undefined {
    return this._current;
  }
  public set current(cur: Track | undefined) {
    this._current = cur;
  }

  // state getter/setter
  public get state(): PlaybackState {
    return this._state;
  }
  public set state(newState: PlaybackState) {
    this._state = newState;
  }

  // playWhenReady getter/setter
  public get playWhenReady(): boolean {
    return this._playWhenReady;
  }
  public set playWhenReady(pwr: boolean) {
    this._playWhenReady = pwr;
  }

  async setupPlayer() {
    // shaka only runs in a browser
    if (typeof window === "undefined") return;

    // @ts-expect-error Not defined global
    if (typeof window.rntp !== "undefined") {
      return true;
    }

    // @ts-ignore
    const shaka = await import("shaka-player/dist/shaka-player.ui");
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();
    // Check to see if the browser supports the basic APIs Shaka needs.
    if (!shaka.Player.isBrowserSupported()) {
      // This browser does not have the minimum set of APIs we need.
      this.state = {
        state: State.Error,
        error: {
          code: "not_supported",
          message: "Browser not supported.",
        },
      };
      throw new Error("Browser not supported.");
    }

    // build dom element and attach shaka-player
    this.element = document.createElement("audio");
    this.element.setAttribute("id", "react-native-track-player");
    this.player = new shaka.Player(this.element);

    // Listen for relevant events events.
    this.player!.addEventListener("error", (error: any) => {
      // Extract the shaka.util.Error object from the event.
      this.onError(error.detail);
    });
    this.element.addEventListener("ended", () => this.onTrackEnded());
    this.element.addEventListener("playing", () => this.onTrackPlaying());
    this.element.addEventListener("pause", () => this.onTrackPaused());
    this.player!.addEventListener("loading", () => this.onTrackLoading());
    this.player!.addEventListener("loaded", () => this.onTrackLoaded());
    this.player!.addEventListener("buffering", ({ buffering }: any) => {
      if (buffering === true) {
        this.onTrackBuffering();
      }
    });

    // Attach player to the window to make it easy to access in the JS console.
    // @ts-ignore
    window.rntp = this.player;
  }

  /**
   * event handlers
   */
  protected async onTrackPlaying() {
    this.state = { state: State.Playing };
  }
  protected async onTrackPaused() {
    this.state = { state: State.Paused };
  }
  protected async onTrackLoading() {
    this.state = { state: State.Loading };
  }
  protected async onTrackLoaded() {
    this.state = { state: State.Ready };
  }
  protected async onTrackBuffering() {
    this.state = { state: State.Buffering };
  }
  protected async onTrackEnded() {
    this.state = { state: State.Ended };
  }
  protected onError(error: any) {
    this.state = {
      state: State.Error,
      error: {
        code: error.code,
        message: error.message,
      },
    };

    // Log the error.
    console.debug("Error code", error.code, "object", error);
  }

  /**
   * player control
   */
  public async load(track: Track) {
    if (!this.player) return;
    await this.player.load(track.url as string);
    this.current = track;
  }

  public async retry() {
    if (!this.player) return;
    this.player.retryStreaming();
  }

  public async stop() {
    if (!this.player) return;
    this.current = undefined;
    await this.player.unload();
  }

  public play() {
    if (!this.element) return;
    this.playWhenReady = true;
    return this.element.play();
  }

  public pause() {
    if (!this.element) return;
    this.playWhenReady = false;
    return this.element.pause();
  }

  public setRate(rate: number) {
    if (!this.element) return;
    return (this.element.playbackRate = rate);
  }

  public getRate() {
    if (!this.element) return;
    return this.element.playbackRate;
  }

  public seekBy(offset: number) {
    if (!this.element) return;
    this.element.currentTime += offset;
  }

  public seekTo(seconds: number) {
    if (!this.element) return;
    this.element.currentTime = seconds;
  }

  public setVolume(volume: number) {
    if (!this.element) return;
    this.element.volume = volume;
  }

  public getVolume() {
    if (!this.element) return;
    return this.element.volume;
  }

  public getDuration() {
    if (!this.element) return;
    return this.element.duration;
  }

  public getPosition() {
    if (!this.element) return;
    return this.element.currentTime;
  }

  public getProgress(): Progress {
    if (!this.element) {
      return { position: 0, duration: 0, buffered: 0 };
    }
    return {
      position: this.element.currentTime,
      duration: this.element.duration || 0,
      buffered: 0, // TODO: this.element.buffered.end,
    };
  }

  public getBufferedPosition() {
    if (!this.element) return;
    return this.element.buffered.end;
  }
}
