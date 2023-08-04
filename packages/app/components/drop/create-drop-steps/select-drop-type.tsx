import React from "react";
import { Linking, Platform } from "react-native";

import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  AppleMusic,
  ChevronRight,
  Spotify,
} from "@showtime-xyz/universal.icon";
import {
  Raffle,
  CreatorChannel,
  CollectorList,
} from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useUser } from "app/hooks/use-user";

export const SelectDropType = (props: { handleNextStep: any }) => {
  const user = useUser({
    redirectTo: "/login",
    redirectIfProfileIncomplete: true,
  });
  const canCreateMusicDrop =
    !!user.user?.data.profile.spotify_artist_id ||
    !!user.user?.data.profile.apple_music_artist_id;
  const isDark = useIsDarkMode();
  const modalScreenContext = useModalScreenContext();
  const router = useRouter();

  if (user.isIncompletedProfile) {
    return null;
  }
  const iconColor = isDark ? "#fff" : "#121212";

  return (
    <BottomSheetScrollView useNativeModal={false}>
      <View tw="justify-center px-4" style={{ rowGap: 16 }}>
        <Pressable
          onPress={() => {
            if (canCreateMusicDrop) {
              props.handleNextStep();
            } else {
              Linking.openURL("https://showtimexyz.typeform.com/to/pXQVhkZo");
            }
          }}
        >
          <LinearGradient
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9999,
              paddingVertical: 24,
            }}
            {...fromCSS(
              `linear-gradient(147deg, #00D27A 0%, #5836FF 44.04%, #C0F 95.40%)`
            )}
          >
            <View tw="ml-auto">
              <View tw="mr-2 flex-row">
                <View tw="mr-1 mt-[2px]">
                  <AppleMusic color={"white"} width={18} height={18} />
                </View>
                <Spotify color={"white"} width={22} height={22} />
              </View>
            </View>
            <Text tw="text-lg font-bold text-white">Pre-Save Drop</Text>
            <View tw="right-4 ml-auto">
              <ChevronRight color={"white"} width={24} height={24} />
            </View>
          </LinearGradient>
        </Pressable>
        {Platform.OS !== "web" && !user.user?.data.profile.verified ? null : (
          <Pressable
            onPress={() => {
              if (Platform.OS !== "web") {
                modalScreenContext?.pop?.({
                  callback: () => {
                    router.push("/drop/free");
                  },
                });
              } else {
                router.replace("/drop/free");
              }
            }}
          >
            <LinearGradient
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9999,
                paddingVertical: 24,
              }}
              {...fromCSS(
                `linear-gradient(147deg, #c5e1e7 0%, #d3c6ff 40.06%, #e5bdff 100%)`
              )}
            >
              <View tw="ml-auto">
                <Text tw="text-lg font-bold text-black">
                  Digital art collectible
                </Text>
              </View>
              <View tw="right-4 ml-auto">
                <ChevronRight color={"black"} width={24} height={24} />
              </View>
            </LinearGradient>
          </Pressable>
        )}

        <View tw="mt-4 w-full items-center">
          <View style={{ rowGap: 16 }}>
            <View tw="flex-row" style={{ columnGap: 12 }}>
              <Raffle
                fill={iconColor}
                color={iconColor}
                width={20}
                height={20}
              />
              <View style={{ gap: 2 }}>
                <Text tw="font-semibold text-gray-900 dark:text-gray-50">
                  Offer Raffles
                </Text>
                <Text tw="text-gray-900 dark:text-gray-50">
                  Gift an NFT to attract collectors
                </Text>
              </View>
            </View>
            <View tw="flex-row" style={{ columnGap: 12 }}>
              <CreatorChannel
                fill={iconColor}
                color={iconColor}
                width={20}
                height={20}
              />
              <View style={{ gap: 2 }}>
                <Text tw="font-semibold text-gray-900 dark:text-gray-50">
                  Build a fanbase
                </Text>
                <Text tw="text-gray-900 dark:text-gray-50">
                  Collectors auto-join your channel
                </Text>
              </View>
            </View>
            <View tw="flex-row" style={{ columnGap: 12 }}>
              <CollectorList color={iconColor} width={20} height={20} />
              <View style={{ gap: 2 }}>
                <Text tw="font-semibold text-gray-900 dark:text-gray-50">
                  Collector lists
                </Text>
                <Text tw="text-gray-900 dark:text-gray-50">
                  Share a link to instantly create
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};
