import { ComponentProps, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { Video as ExpoVideo, ResizeMode } from "expo-av";
import { Source } from "react-native-fast-image";

import { Image } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { MuteButton } from "app/components/mute-button";
import { useMuteButtonBottomOffset } from "app/components/mute-button/mute-button";
import { useVideoConfig } from "app/context/video-config-context";
import { useViewabilityMount } from "app/hooks/use-viewability-mount";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
  showMuteButton?: boolean;
} & ComponentProps<typeof ExpoVideo>;

function Video({
  tw,
  blurhash,
  posterSource,
  showMuteButton,
  ...props
}: VideoProps) {
  const videoRef = useRef<ExpoVideo>(null);
  const videoConfig = useVideoConfig();
  const [muted, setMuted] = useState(true);

  const { id } = useViewabilityMount({ videoRef, source: props.source });
  const bottomOffset = useMuteButtonBottomOffset();

  return (
    <>
      <View tw={tw}>
        {videoConfig?.previewOnly ? (
          <Image
            tw={tw}
            style={StyleSheet.absoluteFill}
            blurhash={blurhash}
            source={posterSource as Source}
          />
        ) : (
          <>
            <Image
              tw={tw}
              style={StyleSheet.absoluteFill}
              blurhash={blurhash}
              source={posterSource as Source}
            />

            <ExpoVideo
              ref={videoRef}
              style={StyleSheet.absoluteFill}
              useNativeControls={videoConfig?.useNativeControls}
              resizeMode={ResizeMode.COVER}
              posterSource={posterSource}
              isMuted={muted}
            />
            {showMuteButton ? (
              <View
                style={{
                  bottom: bottomOffset,
                  right: 10,
                  position: "absolute",
                }}
              >
                <MuteButton onPress={() => setMuted(!muted)} muted={muted} />
              </View>
            ) : null}
          </>
        )}

        {__DEV__ ? (
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: "white",
              position: "absolute",
            }}
          >
            Video {id}
          </Text>
        ) : null}
      </View>
    </>
  );
}

export { Video };
