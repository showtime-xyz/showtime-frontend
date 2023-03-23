import { useRef, useState } from "react";
import { StyleSheet, Platform } from "react-native";

import { BlurView as ExpoBlurView } from "expo-blur";

import { TextButton } from "@showtime-xyz/universal.button";
import { View } from "@showtime-xyz/universal.view";

import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { EyeOff } from "design-system/icon";
import { Text } from "design-system/text";

const PlatformBlurView = Platform.OS === "ios" ? ExpoBlurView : View;

export const NSFWGate = ({
  show,
  nftId,
  variant = "default",
}: {
  show?: boolean;
  nftId: number;
  variant?: "default" | "thumbnail";
}) => {
  const headerHeight = useHeaderHeight();
  const lastNftId = useRef(nftId);
  const [showNFT, setShowNFT] = useState(false);
  if (variant === "default" && nftId !== lastNftId.current) {
    lastNftId.current = nftId;
    setShowNFT(false);
  }
  if (!show || showNFT) return null;

  if (variant === "thumbnail") {
    return (
      <PlatformBlurView
        tint="dark"
        intensity={100}
        tw="android:bg-gray-800 web:bg-black/30 backdrop-blur-3xl"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          overflow: "hidden",
        }}
      >
        <View tw="flex-1 justify-between">
          <View tw="mt-auto mb-auto items-center justify-center text-center">
            <EyeOff color="white" fontSize={30} width={30} height={30} />
          </View>
        </View>
      </PlatformBlurView>
    );
  }
  return (
    <PlatformBlurView
      tw="web:bg-black/30 android:bg-gray-800 backdrop-blur-3xl"
      tint="dark"
      intensity={100}
      style={{
        ...StyleSheet.absoluteFillObject,
        top: Platform.OS === "ios" ? headerHeight - 10 : 0,
        overflow: "hidden",
      }}
    >
      <View tw="flex-1 justify-between">
        <View tw="mt-auto mb-auto items-center justify-center px-12 text-center">
          <EyeOff color="white" fontSize={30} width={30} height={30} />
          <View tw="mt-4">
            <Text tw="text-center text-lg font-bold text-white">
              Sensitive Content
            </Text>
            <Text tw="mt-5 text-center font-normal leading-5 text-white">
              The content beyond this point may be explicit or inappropriate for
              some users. Viewer discretion is advised. By proceeding, you
              confirm that you are over the age of 18 and that you understand
              the nature of the content.
            </Text>
          </View>
          <TextButton
            onPress={() => setShowNFT(true)}
            accentColor={["white", "white"]}
            variant="outlined"
            tw="mt-8 rounded-lg border border-white text-white dark:border-white dark:text-white"
          >
            Show content
          </TextButton>
        </View>
        <View tw="my-10 items-center justify-center px-12 text-center">
          <Text tw="text-center text-xs text-white">
            We hide sensitive content so that users can decide for themselves
            whether they want to see it.
          </Text>
        </View>
      </View>
    </PlatformBlurView>
  );
};
