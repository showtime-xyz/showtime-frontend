import React from "react";
import { Linking, Platform } from "react-native";

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
          <View tw="flex-row items-center justify-center rounded-full bg-indigo-700 py-6 shadow-lg">
            <View tw="ml-auto">
              <View tw="mr-2 flex-row">
                <View tw="mr-1 mt-[2px]">
                  <AppleMusic color={"white"} width={18} height={18} />
                </View>
                <Spotify color={"white"} width={22} height={22} />
              </View>
            </View>
            <Text tw="text-lg text-white">Pre-Save Drop</Text>
            <View tw="right-4 ml-auto">
              <ChevronRight color={"white"} width={24} height={24} />
            </View>
          </View>
        </Pressable>
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
          <View tw="flex-row items-center justify-center rounded-full bg-blue-200 py-6 shadow-sm">
            <View tw="ml-auto">
              <Text tw="text-lg text-black">Digital art collectible</Text>
            </View>
            <View tw="right-4 ml-auto">
              <ChevronRight color={"black"} width={24} height={24} />
            </View>
          </View>
        </Pressable>

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
