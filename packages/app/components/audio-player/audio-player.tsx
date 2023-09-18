import { useEffect, useCallback, useState, useRef } from "react";
import { Platform } from "react-native";

import { Slider } from "@miblanchard/react-native-slider";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PauseOutline, Play } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import Spinner from "@showtime-xyz/universal.spinner";
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
  const isDark = useIsDarkMode();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef2 = useRef<NodeJS.Timeout | null>(null);
  const [tempScrubPosition, setTempScrubPosition] = useState<number | null>(
    null
  );
  const [localScrubPosition, setLocalScrubPosition] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function setup() {
      await setupPlayer();
    }
    setup();

    return function unmount() {
      if (Platform.OS !== "web") {
        pauseAllActiveTracks();
        TrackPlayer.reset();
      }
    };
  }, []);

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
      if (timeoutRef2.current) {
        clearTimeout(timeoutRef2.current);
      }
      const currentTrackId = await TrackPlayer.getActiveTrack();

      if (currentTrackId?.id !== id) {
        // Speichern Sie die aktuelle Position des Scrubbers
        setTempScrubPosition(trackInfo?.position || 0);

        await pauseAllActiveTracks();
        await TrackPlayer.reset().catch(() => {});
        await addTrack();

        if (trackInfo?.position && trackInfo?.position > 0) {
          await TrackPlayer.seekTo(trackInfo?.position);
        }

        timeoutRef2.current = setTimeout(async () => {
          setTempScrubPosition(null);
        }, delay);
      }
    },
    [addTrack, id, trackInfo.position]
  );

  const togglePlay = useCallback(async () => {
    const currentTrackId = await TrackPlayer.getActiveTrack();
    const currentState = (await TrackPlayer.getPlaybackState()).state;

    // Wenn der aktuell ausgewählte Track bereits spielt
    if (currentState === State.Playing && currentTrackId?.id === id) {
      await TrackPlayer.pause().catch(() => {});
      setTrackInfo(id.toFixed(), {
        state: State.Paused,
      });
    } else {
      // Wenn ein anderer Track spielt oder der Player pausiert ist
      await prepare(1000);
      await TrackPlayer.play().catch(() => {});
    }
  }, [id, prepare]);

  return (
    <View tw="web:max-w-sm mx-3 my-4 overflow-hidden rounded-full bg-black p-4 dark:bg-white">
      <View tw="flex-row items-center">
        <View tw="mr-4 items-center justify-center">
          <View tw="h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-black">
            <Pressable
              onPress={togglePlay}
              tw="w-full flex-1 items-center justify-center text-black dark:text-white"
            >
              {trackInfo.state === State.Loading ? (
                <Spinner
                  size="small"
                  secondaryColor={isDark ? "white" : "black"}
                />
              ) : trackInfo.state === State.Playing ? (
                <PauseOutline
                  color={isDark ? "white" : "black"}
                  stroke={isDark ? "white" : "black"}
                  strokeWidth={3}
                  width={30}
                />
              ) : (
                <View tw="ml-0.5">
                  <Play
                    color={isDark ? "white" : "black"}
                    stroke={isDark ? "white" : "black"}
                    strokeWidth={3}
                    width={40}
                  />
                </View>
              )}
            </Pressable>
          </View>
        </View>
        <View tw="mr-2 w-8 items-center justify-center text-center">
          <Text tw="text-[#959595] dark:text-[#707070]">
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
            minimumTrackTintColor={isDark ? "#000" : "#fff"}
            maximumTrackTintColor={isDark ? "#bababa" : "#555"}
            step={1}
            thumbStyle={{ height: 10, width: 10 }}
            thumbTintColor={isDark ? "#000" : "#fff"}
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
                // If another track is playing, pause it and play the selected track
                await prepare();
              } else {
                // If the same track is playing, pause it
                await TrackPlayer.pause();
              }
            }}
            onSlidingComplete={async (value) => {
              setLocalScrubPosition(value[0]);
              setTrackInfo(id.toFixed(), {
                position: value[0],
                //state: State.Playing,
              });

              timeoutRef.current = setTimeout(async () => {
                await TrackPlayer.play();
                await TrackPlayer.seekTo(value[0]);
                setLocalScrubPosition(null);
                setIsDragging(false);
              }, 300);
            }}
          />
        </View>
        <View tw="ml-2 w-8 items-center justify-center text-center">
          <Text tw="text-[#959595] dark:text-[#707070]">
            {trackInfo.duration ? formatTime(trackInfo.duration || 0) : "-:--"}
          </Text>
        </View>
      </View>
    </View>
  );
};
