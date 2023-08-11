import { useEffect, useCallback, useState } from "react";

import Slider from "@react-native-community/slider";
import TrackPlayer, { State } from "react-native-track-player";

import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useTrackProgress } from "./hooks/use-track-progress";
import { setupPlayer } from "./service";
import { pauseAllActiveTracks, setTrackInfo } from "./store";
import { formatTime } from "./utils";

export const AudioPlayer = ({ id }: { id: number }) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const trackInfo = useTrackProgress(id);

  console.log("trackInfo", trackInfo);

  const addTrack = useCallback(async () => {
    await TrackPlayer.add({
      id: id,
      url: "https://showtime-media-stage.b-cdn.net/hirbod-test/AUDIO-2023-07-17-20-38-40.mp3",
    });
  }, [id]);

  const play = useCallback(async () => {
    pauseAllActiveTracks();
    await TrackPlayer.reset().catch(() => {});
    await addTrack();
    if (trackInfo.position && trackInfo.position > 0) {
      await TrackPlayer.seekTo(trackInfo.position);
    }
    await TrackPlayer.play().catch(() => {});
  }, [addTrack, trackInfo.position]);

  const pause = useCallback(async () => {
    TrackPlayer.pause().catch(() => {});
  }, []);

  useEffect(() => {
    async function setup() {
      const isSetup = await setupPlayer();

      if (isSetup) {
        setIsPlayerReady(true);
      }
    }
    setup();

    return () => {
      requestAnimationFrame(() => {
        pauseAllActiveTracks();
        TrackPlayer.reset();
      });
    };
  }, []);

  const togglePlay = useCallback(async () => {
    if (trackInfo.state === State.Playing) {
      await pause();
    } else {
      await play();
    }
  }, [pause, play, trackInfo.state]);

  return (
    <View>
      {isPlayerReady && (
        <Text onPress={togglePlay}>
          {trackInfo.state === State.Buffering ? (
            <Spinner size="small" />
          ) : trackInfo.state === State.Playing ? (
            "Pause"
          ) : (
            "Play"
          )}
        </Text>
      )}
      <Text>{formatTime(trackInfo.position || 0)}</Text>
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={trackInfo.duration || 0}
        minimumTrackTintColor="#000"
        maximumTrackTintColor="#ff0"
        step={0.01}
        value={trackInfo.position || 0}
        onValueChange={async (value) => {
          if (trackInfo.state !== State.Playing) {
            setTrackInfo(id.toString(), {
              position: value,
              state: State.Playing,
            });
            play();
          } else {
            TrackPlayer.seekTo(value);
            setTrackInfo(id.toString(), {
              position: value,
              state: State.Playing,
            });
          }
        }}
        disabled={trackInfo.state === State.Buffering || !isPlayerReady}
      />
    </View>
  );
};
