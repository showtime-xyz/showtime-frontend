import { useEffect, useCallback, useState, useRef, memo } from "react";
import { Platform } from "react-native";

import { Slider } from "@miblanchard/react-native-slider";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PauseOutline, Play } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import Spinner from "@showtime-xyz/universal.spinner";

import TrackPlayer, { State } from "design-system/track-player";

import { LeanText, LeanView } from "../creator-channels/components/lean-text";
import { useTrackProgress } from "./hooks/use-track-progress";
import { setupPlayer } from "./service";
import {
  pauseAllActiveTracks,
  progressState,
  setIsDragging,
  setTrackInfo,
} from "./store";
import { formatTime } from "./utils";

export const AudioPlayer = memo(
  ({
    id,
    url,
    duration,
  }: {
    id: number;
    url: string;
    duration?: number | null;
  }) => {
    const isDark = useIsDarkMode();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef2 = useRef<NodeJS.Timeout | null>(null);
    const playerControlTimer = useRef<NodeJS.Timeout | null>(null);
    const [tempScrubPosition, setTempScrubPosition] = useState<number | null>(
      null
    );
    const [localScrubPosition, setLocalScrubPosition] = useState<number | null>(
      null
    );

    useEffect(() => {
      async function setup() {
        // this method is already optimized and will exit early if already setup
        setupPlayer().catch(() => {});
      }

      // call setup on mount, should trigger once only
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
          url,
          title: "Showtime",
          artist: "Creator Channels",
          artwork: "https://media.showtime.xyz/assets/st-logo.png",
        },
      ]);
    }, [id, url]);

    const prepare = useCallback(
      async (delay = 0) => {
        if (!url) return;
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
        } else {
          await TrackPlayer.seekTo(trackInfo?.position || 0);
        }
      },
      [addTrack, id, trackInfo?.position, url]
    );

    const togglePlay = useCallback(async () => {
      if (!url) return;
      const currentTrackId = await TrackPlayer.getActiveTrack();
      const currentState = (await TrackPlayer.getPlaybackState()).state;

      if (currentState === State.Playing && currentTrackId?.id === id) {
        // android does not emit the pause state correctly, so we manually call it
        pauseAllActiveTracks();
        await TrackPlayer.pause().catch(() => {});
      } else {
        await prepare(1000);

        await TrackPlayer.play().catch(() => {});
      }
    }, [id, prepare, url]);

    return (
      <LeanView tw="web:max-w-sm web:p-2 overflow-hidden rounded-full bg-black p-4 dark:bg-white">
        <LeanView tw="flex-row items-center">
          <LeanView tw="mr-4 items-center justify-center">
            <LeanView tw="h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-black">
              <Pressable
                onPress={togglePlay}
                tw="w-full flex-1 items-center justify-center text-black dark:text-white"
              >
                {trackInfo.state === State.Loading ||
                trackInfo.state === State.Buffering ? (
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
                  <LeanView tw="ml-0.5">
                    <Play
                      color={isDark ? "white" : "black"}
                      stroke={isDark ? "white" : "black"}
                      strokeWidth={3}
                      width={40}
                    />
                  </LeanView>
                )}
              </Pressable>
            </LeanView>
          </LeanView>
          <LeanView tw="mr-2 w-8 items-center justify-center text-center">
            <LeanText tw="text-[#959595] dark:text-[#707070]">
              {formatTime(
                tempScrubPosition !== null
                  ? tempScrubPosition
                  : localScrubPosition || trackInfo.position || 0
              )}
            </LeanText>
          </LeanView>
          <LeanView tw="flex-1">
            <Slider
              minimumValue={0}
              maximumValue={trackInfo.duration || duration || 60} // 60 is fallback
              minimumTrackTintColor={isDark ? "#000" : "#fff"}
              maximumTrackTintColor={isDark ? "#bababa" : "#555"}
              step={1}
              thumbStyle={{ height: 12, width: 12 }}
              thumbTintColor={isDark ? "#000" : "#fff"}
              trackClickable={trackInfo.duration || duration ? true : false}
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
                if (playerControlTimer.current) {
                  clearTimeout(playerControlTimer.current);
                }
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
                  state: State.Playing,
                });

                playerControlTimer.current = setTimeout(
                  async () => {
                    await TrackPlayer.play();
                    await TrackPlayer.seekTo(value[0]);
                    timeoutRef.current = setTimeout(() => {
                      setLocalScrubPosition(null);
                      setIsDragging(false);
                    }, 300);
                  },
                  Platform.OS === "web" ? 100 : 30
                );
              }}
            />
          </LeanView>
          <LeanView tw="ml-2 w-8 items-center justify-center text-center">
            <LeanText tw="text-[#959595] dark:text-[#707070]">
              {duration || trackInfo.duration
                ? formatTime(duration || trackInfo.duration || 0)
                : "-:--"}
            </LeanText>
          </LeanView>
        </LeanView>
      </LeanView>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";
