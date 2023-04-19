import { ComponentProps } from "react";
import { Platform } from "react-native";

import { Video as ExpoVideo, ResizeMode } from "expo-av";

import { Image } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
  loading?: "eager" | "lazy";
} & ComponentProps<typeof ExpoVideo>;

export function ListVideo({ posterSource, ...props }: VideoProps) {
  // this is a temporary fix for the video on android due to expo-av performance issues
  if (Platform.OS === "android") {
    return (
      <Image
        source={posterSource}
        // @ts-ignore
        recyclingKey={posterSource?.uri}
        data-test-id={Platform.select({ web: "nft-card-media" })}
        resizeMode={ResizeMode.COVER}
        alt={"Video Poster"}
        style={{ height: "100%", width: "100%" }}
      />
    );
  }
  return (
    <>
      <ExpoVideo
        {...props}
        style={{ width: "100%", height: "100%" }}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        posterSource={posterSource}
        shouldPlay={true}
        isMuted={true}
        isLooping={true}
      />
    </>
  );
}
