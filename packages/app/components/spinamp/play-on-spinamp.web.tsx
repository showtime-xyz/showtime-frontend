import React, { useState, useRef, useEffect, useCallback } from "react";
import { GestureResponderEvent, StyleSheet } from "react-native";

import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { useIntersectionObserver } from "app/hooks/use-intersection-observer.web";
import { Logger } from "app/lib/logger";

import { Play } from "design-system/icon";

const Stop = () => <View tw="mx-1 h-3 w-3 bg-white" />;

export const PlayOnSpinamp = ({ url }: { url: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const sound = useRef<HTMLAudioElement | undefined>(new Audio(url));

  // unload sound when component unmounts
  useEffect(() => {
    const currentRef = sound.current;

    const loadedData = () => {
      setIsLoading(false);
    };

    const ended = () => {
      setIsPlaying(false);
      if (sound.current) {
        sound.current.currentTime = 0;
      }
    };

    const playing = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const pause = () => {
      setIsPlaying(false);
    };

    currentRef?.addEventListener("loadeddata", loadedData);
    currentRef?.addEventListener("ended", ended);
    currentRef?.addEventListener("playing", playing);
    currentRef?.addEventListener("pause", pause);

    return () => {
      if (currentRef) {
        currentRef?.removeEventListener("loadeddata", loadedData);
        currentRef?.removeEventListener("ended", ended);
        currentRef?.removeEventListener("playing", playing);
        currentRef?.removeEventListener("pause", pause);

        currentRef.srcObject = null;
        setIsPlaying(false);
      }
    };
  }, []);

  const togglePlay = useCallback(
    async (e: GestureResponderEvent) => {
      e.preventDefault();

      if (isLoading) return;
      if (isPlaying) {
        await sound.current?.pause();
        return;
      }

      setIsLoading(true);
      try {
        sound.current?.play();
      } catch (error) {
        Logger.error("Spinamp Playback Error", error);
      }
    },
    [isPlaying, isLoading]
  );

  const pause = useCallback(() => {
    isPlaying && sound.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (!isVisible) {
      pause();
    }
  }, [isVisible, pause]);

  return (
    <Pressable tw="-mt-2 h-8 px-2" onPress={togglePlay}>
      <View
        tw="rounded-xl bg-gray-800/80"
        style={StyleSheet.absoluteFillObject}
        ref={ref}
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
          tw={"ml-2 self-center p-2"}
          source={require("./powered-by.png")}
          width={140}
          height={20}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
};
