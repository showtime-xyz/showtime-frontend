import React from "react";
import { Linking, Platform } from "react-native";

import { Chip } from "@showtime-xyz/universal.chip";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  CreatorChannelType,
  ChevronRight,
  FreeDropType,
  MusicDropType,
} from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useUser } from "app/hooks/use-user";

export const DropSelect = () => {
  const modalScreenContext = useModalScreenContext();

  const router = useRouter();
  const user = useUser({
    redirectTo: "/login",
    redirectIfProfileIncomplete: true,
  });
  const canCreateMusicDrop =
    !!user.user?.data.profile.spotify_artist_id ||
    !!user.user?.data.profile.apple_music_artist_id;
  const isDark = useIsDarkMode();

  if (user.isIncompletedProfile) {
    return null;
  }
  const iconColor = isDark ? "#fff" : "#121212";
  return (
    <BottomSheetScrollView useNativeModal={false}>
      <View tw="flex-row flex-wrap">
        <View tw="w-full px-4">
          <CreateCard
            title="Creator Updates"
            icon={
              <CreatorChannelType color={iconColor} height={24} width={24} />
            }
            isNew
            description="Send an exclusive update to your fans on your channel"
            onPress={() => {
              const pathname = `/channels/${user.user?.data.profile.profile_id}`;
              if (Platform.OS === "web") {
                router.push(pathname);
              } else {
                modalScreenContext?.pop?.({
                  callback: () => {
                    router.push(pathname);
                  },
                });
              }
            }}
          />
        </View>
        {Platform.OS !== "web" && !user.user?.data.profile.verified ? null : (
          <View tw="mt-2.5 w-full px-4">
            <CreateCard
              title="Drops: Free digital collectibles"
              description="Share a link to instantly create a collector list and connect with your fans."
              icon={<FreeDropType color={iconColor} height={24} width={24} />}
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
            />
          </View>
        )}

        <View tw="mt-2.5 w-full px-4">
          <CreateCard
            title="Pre-Save on Spotify or Apple Music"
            icon={<MusicDropType color={iconColor} height={24} width={24} />}
            description="Promote your latest music: give your fans a free collectible for saving your song to their library."
            onPress={() => {
              if (!canCreateMusicDrop) {
                if (Platform.OS !== "web") {
                  modalScreenContext?.pop?.({
                    callback: () => {
                      router.push("/drop/music");
                    },
                  });
                } else {
                  router.replace("/drop/music");
                }
              } else {
                Linking.openURL("https://showtimexyz.typeform.com/to/pXQVhkZo");
              }
            }}
          />
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

const CreateCard = ({
  title,
  description,
  onPress,
  icon,
  isNew = false,
}: {
  title: string;
  description: string;
  onPress: () => void;
  icon: React.ReactNode;
  isNew?: boolean;
}) => {
  return (
    <PressableScale
      onPress={onPress}
      tw="flex-row justify-between rounded-xl bg-gray-100 py-4 pl-4 pr-2 dark:bg-gray-900"
    >
      {icon}
      <View tw="ml-2 mt-1 flex-1 flex-row items-center justify-between">
        <View tw="flex-1">
          <View tw="flex-row ">
            <Text tw="text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </Text>
            {isNew && (
              <Chip
                label="New"
                tw="-mt-0.5 ml-1 bg-indigo-700 p-1 md:px-1.5"
                textTw="text-white"
                variant="text"
              />
            )}
          </View>
          <View tw="h-2" />
          <Text tw="text-sm text-gray-900 dark:text-gray-100">
            {description}
          </Text>
        </View>
        <ChevronRight color={"#696969"} width={24} height={24} />
      </View>
    </PressableScale>
  );
};
