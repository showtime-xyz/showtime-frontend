import { useEffect, useCallback, useState } from "react";
import { Platform } from "react-native";

import { Slider } from "@miblanchard/react-native-slider";

import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import TrackPlayer, { State } from "design-system/track-player";

import { useTrackProgress } from "./hooks/use-track-progress";
import { setupPlayer } from "./service";
import { pauseAllActiveTracks, setTrackInfo } from "./store";
import { formatTime } from "./utils";

export const AudioPlayer = ({ id }: { id: number }) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const trackInfo = useTrackProgress(id);

  const addTrack = useCallback(async () => {
    await TrackPlayer.add([
      {
        id: id,
        url: "https://showtime-media-stage.b-cdn.net/hirbod-test/AUDIO-2023-07-17-20-38-40.mp3",
      },
    ]);
  }, [id]);

  const play = useCallback(async () => {
    pauseAllActiveTracks();
    await TrackPlayer.reset().catch(() => {});
    await addTrack();
    if (trackInfo?.position && trackInfo.position > 0) {
      await TrackPlayer.seekTo(trackInfo.position);
    }
    await TrackPlayer.play().catch(() => {});
  }, [addTrack, trackInfo?.position]);

  const pause = useCallback(async () => {
    await TrackPlayer.pause().catch(() => {});
  }, []);

  useEffect(() => {
    async function setup() {
      const isSetup = await setupPlayer();

      if (isSetup) {
        setIsPlayerReady(true);
      }
    }
    setup();

    return function unmount() {
      if (Platform.OS !== "web") {
        pauseAllActiveTracks();
        TrackPlayer.pause();
        TrackPlayer.reset();
      }
    };
  }, []);

  const togglePlay = useCallback(async () => {
    if (trackInfo.state === State.Playing) {
      await pause();
    } else {
      await play();
    }
  }, [pause, play, trackInfo?.state]);

  return (
    <View>
      {isPlayerReady && (
        <Text onPress={togglePlay}>
          {trackInfo.state === State.Buffering ? (
            <Spinner size="small" />
          ) : trackInfo.state === State.Playing ? (
            "Pause" + id
          ) : (
            "Play" + id
          )}
        </Text>
      )}
      <Text>{formatTime(trackInfo.position || 0)}</Text>
      <Slider
        minimumValue={0}
        maximumValue={trackInfo.duration || 0}
        minimumTrackTintColor="#000"
        maximumTrackTintColor="#ff0"
        step={1}
        value={trackInfo.position || 0}
        onValueChange={async (value) => {
          if (trackInfo.state !== State.Playing) {
            setTrackInfo(id.toString(), {
              position: value[0],
              state: State.Playing,
            });
            play();
          } else {
            TrackPlayer.seekTo(value[0]);
            setTrackInfo(id.toString(), {
              position: value[0],
              state: State.Playing,
            });
          }
        }}
        disabled={trackInfo.state === State.Buffering || !isPlayerReady}
      />
    </View>
  );
};