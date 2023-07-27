import { useCallback, useState, memo } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { BorderlessButton } from "react-native-gesture-handler";

import { Showtime } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

function delay(ms: number = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const StarDropBadge = () => {
  return (
    <View tw="rounded-md bg-[#CE8903] px-1 py-1">
      <View tw="flex-row items-center justify-center">
        <View tw="mr-1">
          <Showtime
            width={10}
            height={10}
            color={"white"}
            stroke={"white"}
            fill={"white"}
          />
        </View>

        <Text tw="text-xs font-medium text-white" style={{ lineHeight: 14 }}>
          Star drop
        </Text>
      </View>
    </View>
  );
};

export const GatedMessage = memo(({ latestNFT }: { latestNFT?: string }) => {
  const router = useRouter();

  const unlockMessage = useCallback(async () => {
    if (!latestNFT) return;
    router.push(latestNFT);
  }, [latestNFT, router]);

  if (!latestNFT) return null;

  return (
    <View tw="mx-3 my-2 h-[120px] items-center justify-center overflow-hidden rounded-2xl bg-slate-400">
      <BorderlessButton
        onPress={unlockMessage}
        activeOpacity={0.7}
        foreground
        style={{
          flexGrow: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearGradient
          style={{
            position: "absolute",
            width: "200%",
            height: "100%",
            borderRadius: 16,
            overflow: "hidden",
            transform: [{ scaleX: 1 }],
          }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: -0.6 }}
          // Adding the color stops manually
          colors={[
            "#F5E794",
            "#F5E794",
            "#F5E794",
            "#E6A130",
            "#FFE956",
            "#FFEC92",
            "#FFEC92",
            "#FED749",
            "#FDC93F",
            "#F5E794",
            "#F6C33D",
            "#ED9F26",
            "#E88A3F",
            "#F4CE5E",
            "#E4973C",
            "#FFD480",
            "#F5E794",
            "#F5E794",
            "#F5E794",
          ]}
        />
        <View tw="absolute left-3 top-3">
          <StarDropBadge />
        </View>
        <View tw="flex-row items-center justify-center">
          <View tw="mr-2">
            <Showtime width={16} height={16} fill={"black"} />
          </View>
          <Text tw="text-sm font-semibold">Collect to unlock</Text>
        </View>
      </BorderlessButton>
    </View>
  );
});

GatedMessage.displayName = "GatedMessage";
