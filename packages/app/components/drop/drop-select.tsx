import React from "react";
import { Linking, Platform } from "react-native";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useUser } from "app/hooks/use-user";

import { Button } from "design-system/button";
import { useIsDarkMode } from "design-system/hooks";
import { Spotify } from "design-system/icon";
import { Gift } from "design-system/icon";
import { useRouter } from "design-system/router";
import { Text } from "design-system/text";
import { View } from "design-system/view";

export const DropSelect = () => {
  const router = useRouter();
  const user = useUser({
    redirectTo: "/login",
    redirectIfProfileIncomplete: true,
  });
  const canCreateMusicDrop = !!user.user?.data.profile.spotify_artist_id;
  const isDark = useIsDarkMode();

  if (user.isIncompletedProfile) {
    return null;
  }

  return (
    <BottomSheetScrollView>
      <View tw="flex-row flex-wrap items-center justify-center pb-6">
        {Platform.OS !== "web" && !user.user?.data.profile.verified ? null : (
          <View tw="mt-6 w-full px-4 lg:w-[360px]">
            <CreateCard
              title="Drops: Free digital collectibles"
              description="Share a link to instantly create a collector list and connect with your fans."
              ctaLabel="Create Drop"
              icon={
                <Gift
                  color={isDark ? "black" : "white"}
                  height={16}
                  width={16}
                />
              }
              onPress={() => {
                if (Platform.OS !== "web") {
                  router.pop();
                  router.push("/drop/free");
                } else {
                  router.replace("/drop/free");
                }
              }}
            />
          </View>
        )}

        <View tw="mt-6 w-full px-4 lg:w-[360px]">
          <CreateCard
            title="Music Drop: Pre-Save on Spotify"
            icon={
              <Spotify
                color={isDark ? "black" : "white"}
                height={16}
                width={16}
              />
            }
            description="Promote your latest music: give your fans a free collectible for saving your song to their library."
            ctaLabel={
              canCreateMusicDrop ? "Create a Music Drop" : "Request Access"
            }
            onPress={() => {
              if (Platform.OS !== "web") {
                router.pop();
              }
              if (canCreateMusicDrop) {
                if (Platform.OS !== "web") {
                  router.pop();
                  router.push("/drop/music");
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
  ctaLabel,
  onPress,
  icon,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  onPress: () => void;
  icon: React.ReactNode;
}) => {
  return (
    <View tw="justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-900 lg:min-h-[216px]">
      <Text tw="text-lg font-bold text-gray-900 dark:text-gray-100 ">
        {title}
      </Text>
      <View tw="h-4" />
      <Text tw="text-base text-gray-900 dark:text-gray-100">{description}</Text>
      <View tw="h-4" />
      <Button onPress={onPress}>
        <View tw="w-full flex-row justify-center">
          {icon}
          <Text tw="ml-2 text-gray-50 dark:text-gray-900">{ctaLabel}</Text>
        </View>
      </Button>
    </View>
  );
};
