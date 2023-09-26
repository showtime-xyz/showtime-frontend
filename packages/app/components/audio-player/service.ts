import TrackPlayer, {
  Event,
  AppKilledPlaybackBehavior,
  Capability,
  State,
} from "design-system/track-player";

import { progressState, setTrackInfo } from "./store";

export async function setupPlayer() {
  if (progressState.isSetup) {
    return true;
  }

  progressState.isSetup = false;
  try {
    await TrackPlayer.getActiveTrackIndex();
    progressState.isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer().catch(() => {});
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      alwaysPauseOnInterruption: true,
      capabilities: [Capability.Play, Capability.Pause],
      compactCapabilities: [Capability.Play, Capability.Pause],
      progressUpdateEventInterval: 1,
    });

    progressState.isSetup = true;
  }

  return progressState.isSetup;
}

export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async (event) => {
    if (!progressState.isDragging) {
      try {
        const trackIndex = event.track;
        if (trackIndex != null) {
          const track = await TrackPlayer.getTrack(trackIndex);
          const state = (await TrackPlayer.getPlaybackState()).state;

          if (track && track.id) {
            if (event.position >= event.duration) {
              setTrackInfo(track.id, {
                position: 0,
                state: State.Stopped,
              });
            } else {
              // write progress to the valtio store
              setTrackInfo(track.id, {
                ...(state !== (State.Ready || State.Buffering) && {
                  position: event.position,
                }),
                state: state,
                duration: event.duration,
              });
            }
          }
        }
      } catch {
        // ignore
      }
    }
  });

  // this is called when a track ended
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async (event) => {
    try {
      const trackIndex = event.track;
      if (trackIndex != null) {
        const track = await TrackPlayer.getTrack(trackIndex);

        if (track && track.id) {
          setTrackInfo(track.id, { position: 0, state: State.Stopped });
        }
      }
    } catch {
      // ignore
    }
  });
}
