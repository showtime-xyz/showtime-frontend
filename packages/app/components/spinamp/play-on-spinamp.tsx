import React, { useState, useRef, useEffect, useCallback } from "react";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { Audio } from "expo-av";
import { useAnimatedReaction } from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";

import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/components/viewability-tracker-flatlist";
import { Logger } from "app/lib/logger";

import { Play } from "design-system/icon";

const Stop = () => <View tw="mx-1 h-3 w-3 bg-white" />;

export const PlayOnSpinamp = ({ url }: { url: string }) => {
  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const sound = useRef<Audio.Sound | null>(new Audio.Sound());

  // unload sound when component unmounts
  useEffect(() => {
    const currentRef = sound.current;
    currentRef?.setOnPlaybackStatusUpdate(async (status) => {
      if (!status.isLoaded) {
        setIsPlaying(false);

        if (status.error) {
          Logger.error("Spinamp Playback Error", status.error);
        }
      } else {
        if (status.isBuffering) {
          setIsLoading(true);
        }

        if (status.isPlaying) {
          setIsLoading(false);
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }

        if (status.didJustFinish && !status.isLooping) {
          // The player has just finished playing and will stop.
          setIsPlaying(false);
        }
      }
    });

    return () => {
      currentRef?.unloadAsync();
    };
  }, []);

  const togglePlay = useCallback(async () => {
    if (isLoading) return;
    if (isPlaying) {
      await sound.current?.stopAsync();
      return;
    }

    // get status to see if sound is loaded
    const status = await sound.current?.getStatusAsync();

    if (!status?.isLoaded) {
      try {
        setIsLoading(true);
        await sound.current?.loadAsync({
          uri: url,
        });
      } catch (error) {
        Logger.error("Failed to load Spinamp audio", error);
      }
    }

    sound.current?.playAsync();
  }, [isPlaying, isLoading, url]);

  const pause = useCallback(() => {
    isPlaying && sound.current?.pauseAsync();
  }, [isPlaying]);

  useAnimatedReaction(
    () => context.value,
    (ctx) => {
      if (isItemInList) {
        if (ctx[1] === id) {
          //runOnJS(play)();
        } else {
          runOnJS(pause)();
        }
      }
    },
    [id, isItemInList, pause]
  );

  return (
    <Pressable tw="-mt-2 h-8 px-2" onPress={togglePlay}>
      <View
        tw="rounded-xl bg-gray-800/80"
        style={StyleSheet.absoluteFillObject}
      />
      <View tw="flex-1 flex-row items-center">
        {isLoading ? (
          <View tw="w-4 scale-75 transform">
            <Spinner size="small" />
          </View>
        ) : (
          <View tw="w-4">
            {isPlaying ? <Stop /> : <Play color={"white"} />}
          </View>
        )}

        <Image
          tw={"ml-3 self-center"}
          source={require("./powered-by.png")}
          style={{
            height: 12,
            width: 120,
          }}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
};
