import React, { useState, useRef, useEffect, useCallback } from "react";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { Audio } from "expo-av";
import { useAnimatedReaction } from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";

import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { View } from "@showtime-xyz/universal.view";

import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/components/viewability-tracker-flatlist";

import { Play } from "design-system/icon";
import { ThreeDotsAnimation } from "design-system/three-dots";

const Stop = () => <View tw="mx-1 h-3 w-3 bg-white" />;

export const PlayOnSpinamp = () => {
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
          // should we handle this?
        }
      } else {
        if (status.isPlaying) {
          setIsPlaying(true);
          setIsLoading(false);
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
      setIsPlaying(false);
      return;
    }

    // get status to see if sound is loaded
    const status = await sound.current?.getStatusAsync();

    if (!status?.isLoaded) {
      try {
        setIsLoading(true);
        await sound.current?.loadAsync({
          uri: "https://media.spinamp.xyz/v1/QmTYS6nJyTpte48Red2c97eM2bjs5bxU6tjo12H8LWbbdA?resource_type=video&cld-content-marker=jit",
        });
      } catch (error) {
        // handle error?
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }

    await sound.current?.playAsync();
    setIsPlaying(false);
  }, [isPlaying, isLoading]);

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
        {isLoading && (
          <View tw="w-0">
            <ThreeDotsAnimation color="white" />
          </View>
        )}
        <View tw="w-4">
          {isLoading ? "" : isPlaying ? <Stop /> : <Play color={"white"} />}
        </View>

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
