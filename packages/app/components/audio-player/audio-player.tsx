import { useEffect, useCallback, useState, useRef } from "react";
import { Platform } from "react-native";

import { Slider } from "@miblanchard/react-native-slider";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import TrackPlayer, { State } from "design-system/track-player";

import { useTrackProgress } from "./hooks/use-track-progress";
import { setupPlayer } from "./service";
import {
  pauseAllActiveTracks,
  progressState,
  setIsDragging,
  setTrackInfo,
} from "./store";
import { formatTime } from "./utils";

export const AudioPlayer = ({ id }: { id: number }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [tempScrubPosition, setTempScrubPosition] = useState<number | null>(
    null
  );

  const [localScrubPosition, setLocalScrubPosition] = useState<number | null>(
    null
  );
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

  const prepare = useCallback(
    async (delay = 0) => {
      const currentTrackId = await TrackPlayer.getActiveTrack();

      if (currentTrackId?.id !== id) {
        // Speichern Sie die aktuelle Position des Scrubbers
        setTempScrubPosition(trackInfo?.position || 0);

        await pauseAllActiveTracks();
        await TrackPlayer.reset().catch(() => {});
        await addTrack();

        setTimeout(() => {
          setTempScrubPosition(null);
        }, delay);
      }

      if (trackInfo?.position && trackInfo.position > 0) {
        await TrackPlayer.seekTo(trackInfo.position);
      }
    },
    [addTrack, id, trackInfo.position]
  );

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
        TrackPlayer.reset();
      }
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const currentTrackId = await TrackPlayer.getActiveTrack();
    const currentState = (await TrackPlayer.getPlaybackState()).state;

    // Wenn der aktuell ausgewählte Track bereits spielt
    if (currentState === State.Playing && currentTrackId?.id === id) {
      await pause();
      setTrackInfo(id.toFixed(), {
        state: State.Paused,
      });
    } else {
      // Wenn ein anderer Track spielt oder der Player pausiert ist
      await prepare(1000);
      await TrackPlayer.play().catch(() => {});
    }
  }, [id, pause, prepare]);

  return (
    <View tw="mx-3 my-4 overflow-hidden rounded-xl bg-slate-200 p-4">
      <View tw="items-center justify-center">
        <Text>Title</Text>
      </View>
      <View tw="flex-row items-center">
        <View tw="mr-2 w-8 items-center justify-center text-center">
          <Text>
            {formatTime(
              tempScrubPosition !== null
                ? tempScrubPosition
                : localScrubPosition || trackInfo.position || 0
            )}
          </Text>
        </View>
        <View tw="flex-1">
          <Slider
            minimumValue={0}
            maximumValue={trackInfo.duration || 147} // change 90 against  duration from api
            minimumTrackTintColor="#000"
            maximumTrackTintColor="#ff0"
            step={1}
            thumbStyle={{ height: 10, width: 10 }}
            value={
              progressState.isDragging
                ? localScrubPosition || trackInfo.position || 0
                : tempScrubPosition !== null
                ? tempScrubPosition
                : localScrubPosition
                ? localScrubPosition
                : trackInfo.position || 0
            }
            animateTransitions={false}
            onValueChange={(value) => {
              setLocalScrubPosition(value[0]);
            }}
            onSlidingStart={async (value) => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              setIsDragging(true);
              setLocalScrubPosition(value[0]);
              const currentTrackId = await TrackPlayer.getActiveTrack();

              if (currentTrackId?.id !== id) {
                // Wenn ein anderer Track spielt oder der Player pausiert ist
                await prepare();
              } else {
                // Wenn der aktuelle Track der ausgewählte Track ist
                await TrackPlayer.pause();
              }
            }}
            onSlidingComplete={async (value) => {
              setLocalScrubPosition(value[0]);
              setTrackInfo(id.toFixed(), {
                position: value[0],
              });
              await TrackPlayer.seekTo(value[0]);
              await TrackPlayer.play();

              timeoutRef.current = setTimeout(() => {
                setLocalScrubPosition(null);
                setIsDragging(false);
              }, 1000);
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
            trackInfo.state === State.Loading
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
