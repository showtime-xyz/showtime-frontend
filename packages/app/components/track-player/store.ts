import { State } from "react-native-track-player";
import { proxy } from "valtio";

type PlaybackState = State; // ... add other states as needed

type TrackPlaybackInfo = {
  position?: number;
  state?: PlaybackState;
  duration?: number;
};

type ProgressStateStore = {
  tracks: Record<string, TrackPlaybackInfo>;
};

export const progressState = proxy<ProgressStateStore>({
  tracks: {},
});

export const setTrackInfo = (id: string, info: Partial<TrackPlaybackInfo>) => {
  if (!progressState.tracks[id]) {
    progressState.tracks[id] = {};
  }

  if (info.position !== undefined) {
    progressState.tracks[id].position = info.position;
  }
  if (info.state !== undefined) {
    progressState.tracks[id].state = info.state;
  }
  if (info.duration !== undefined) {
    progressState.tracks[id].duration = info.duration;
  }
};

export const pauseAllActiveTracks = () => {
  for (const [id, trackInfo] of Object.entries(progressState.tracks)) {
    if (trackInfo.position && trackInfo.position > 0) {
      trackInfo.state = State.Paused;
    }
  }
};

export const stopAllActiveTracks = () => {
  for (const [id, trackInfo] of Object.entries(progressState.tracks)) {
    if (trackInfo.position && trackInfo.position > 0) {
      trackInfo.state = State.Paused;
      trackInfo.position = 0;
    }
  }
};
