import React from "react";
import { Linking } from "react-native";

import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  AppleMusic,
  ChevronRight,
  Spotify,
  Boost,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
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
    !!user.user?.data.profile.bypass_track_ownership_validation ||
    !!user.user?.data.profile.spotify_artist_id ||
    !!user.user?.data.profile.apple_music_artist_id;

  const isDark = useIsDarkMode();

  if (user.isIncompletedProfile || !canCreateMusicDrop) {
    return (
      <View tw="items-center justify-center p-4">
        <Text tw="text-xl font-bold">No permission</Text>
      </View>
    );
  }
  const iconColor = isDark ? "#fff" : "#121212";

  return (
    <BottomSheetScrollView useNativeModal={false}>
      <View tw="justify-center px-8" style={{ rowGap: 16 }}>
        <View tw="rounded-3xl border-[1px] border-gray-200 p-4">
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
                `linear-gradient(154deg, #00E786 0%, #4B27FE 36.26%, #B013D8 100%);`
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
              <Text tw="text-lg font-bold text-white">Pre-Save Airdrop</Text>
              <View tw="right-4 ml-auto">
                <ChevronRight color={"white"} width={24} height={24} />
              </View>
            </LinearGradient>
          </Pressable>
          <View tw="mt-4 flex-row" style={{ columnGap: 8 }}>
            <View tw="mt-[-4px]">
              <Boost
                fill={iconColor}
                color={iconColor}
                width={20}
                height={20}
              />
            </View>
            <View tw="flex-1">
              <Text tw="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Boost streams before release
              </Text>
              <Text tw="text-13 pt-2 text-gray-900 dark:text-gray-100">
                Airdrop a collectible to fans who Pre-Save your song on{" "}
                <Text tw="font-semibold">Spotify & Apple Music</Text>. Your song
                will auto-save to their library on release day. It auto-adds the
                song on its release day.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};
