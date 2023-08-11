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
        title: "Showtime",
        artist: "Creator channels",
        artwork: "https://media.showtime.xyz/assets/st-logo.png",
      },
    ]);
  }, [id]);

  const prepare = useCallback(async () => {
    pauseAllActiveTracks();
    await TrackPlayer.reset().catch(() => {});
    await addTrack();
    if (trackInfo?.position && trackInfo.position > 0) {
      await TrackPlayer.seekTo(trackInfo.position);
    }
  }, [addTrack, trackInfo.position]);

  const play = useCallback(async () => {
    await prepare();
    await TrackPlayer.play().catch(() => {});
  }, [prepare]);

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
      setTrackInfo(id.toFixed(), {
        state: State.Paused,
      });
    } else {
      await play();
    }
  }, [id, pause, play, trackInfo.state]);

  return (
    <View tw="mx-3 my-4 overflow-hidden rounded-xl bg-slate-200 p-4">
      <View tw="items-center justify-center">
        <Text>Title</Text>
      </View>
      <View tw="flex-row items-center">
        <View tw="mr-2 w-8 items-center justify-center text-center">
          <Text>{formatTime(trackInfo.position || 0)}</Text>
        </View>
        <View tw="flex-1">
          <Slider
            minimumValue={0}
            maximumValue={trackInfo.duration || 0}
            minimumTrackTintColor="#000"
            maximumTrackTintColor="#ff0"
            step={1}
            thumbStyle={{ height: 10, width: 10 }}
            value={trackInfo.position || 0}
            animateTransitions={false}
            onSlidingStart={async () => {
              if (isPlayerReady && trackInfo.state === State.Playing) {
                await TrackPlayer.pause();
              } else {
                await prepare();
              }
            }}
            onSlidingComplete={async (value) => {
              if (isPlayerReady) {
                await TrackPlayer.seekTo(value[0]);
                await TrackPlayer.play();
              }
            }}
          />
        </View>
        <View tw="ml-2 w-8 items-center justify-center text-center">
          <Text>
            {trackInfo.duration ? formatTime(trackInfo.duration || 0) : "-:--"}
          </Text>
        </View>
      </View>
      <View tw="items-center justify-center">
        {isPlayerReady && (
          <Text onPress={togglePlay}>
            {trackInfo.state === State.Buffering ||
            trackInfo.state === State.Connecting
              ? "Loading..."
              : trackInfo.state === State.Playing
              ? "Pause " + id
              : "Play " + id}
          </Text>
        )}
      </View>
    </View>
  );
};
