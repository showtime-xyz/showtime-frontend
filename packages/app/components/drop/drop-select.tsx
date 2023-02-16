import React from "react";
import { Linking, Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Globe, Lock } from "@showtime-xyz/universal.icon";
import { Spotify } from "@showtime-xyz/universal.icon";
import { Gift } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { CompleteProfileModalContent } from "app/components/complete-profile-modal-content";
import { useUser } from "app/hooks/use-user";

import { useIsDarkMode } from "design-system/hooks";

export const DropSelect = () => {
  const router = useRouter();
  const user = useUser({ redirectTo: "/login" });
  const canCreateMusicDrop = !!user.user?.data.profile.spotify_artist_id;
  const isDark = useIsDarkMode();

  if (user.isIncompletedProfile) {
    return <CompleteProfileModalContent />;
  }

  return (
    <BottomSheetScrollView>
      <View tw="flex-row flex-wrap items-center justify-center">
        <View tw="mt-6 w-full px-4 lg:w-[360px]">
          <CreateCard
            title="Free drop"
            description="Give your fans a free collectible."
            ctaLabel="Create Free Drop"
            icon={
              <Gift color={isDark ? "black" : "white"} height={16} width={16} />
            }
            onPress={() => {
              if (Platform.OS !== "web") {
                router.pop();
              }
              router.push("/drop/free");
            }}
          />
        </View>
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
              canCreateMusicDrop ? "Create Music Drop" : "Request Access"
            }
            onPress={() => {
              if (Platform.OS !== "web") {
                router.pop();
              }
              if (canCreateMusicDrop) {
                router.push("/drop/music");
              } else {
                Linking.openURL("https://form.typeform.com/to/pXQVhkZo");
              }
            }}
          />
        </View>
        <View tw="mt-6 w-full px-4 lg:w-[360px]">
          <CreateCard
            title="Event drop"
            icon={
              <Globe
                color={isDark ? "black" : "white"}
                height={16}
                width={16}
              />
            }
            description="Connect with fans who show up to your events. This drop lets people mark themselves at your event location."
            ctaLabel="Create Event Drop"
            onPress={() => {
              if (Platform.OS !== "web") {
                router.pop();
              }
              router.push("/drop/event");
            }}
          />
        </View>
        <View tw="mt-6 w-full px-4 lg:w-[360px]">
          <CreateCard
            title="Private drop"
            icon={
              <Lock color={isDark ? "black" : "white"} height={16} width={16} />
            }
            description="A collectible for your biggest fans of your choice. Don't give up your password so easily!"
            ctaLabel="Create Private Drop"
            onPress={() => {
              if (Platform.OS !== "web") {
                router.pop();
              }
              router.push("/drop/private");
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
