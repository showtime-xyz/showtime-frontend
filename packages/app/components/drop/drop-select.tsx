import React from "react";
import { Linking } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useUser } from "app/hooks/use-user";

export const DropSelect = () => {
  const router = useRouter();
  const user = useUser();
  const canCreateMusicDrop = !!user.user?.data.profile.spotify_artist_id;

  return (
    <BottomSheetScrollView>
      <View tw="flex-row flex-wrap items-center justify-center">
        <View tw="m-4 w-[320px]">
          <CreateCard
            title="Free drop"
            description="Give your fans a free collectible."
            ctaLabel="Create Free Drop"
            onPress={() => router.push("/drop/free")}
          />
        </View>
        <View tw="m-4 w-[320px]">
          <CreateCard
            title="Music drop"
            description="Promote your latest music: give your fans a free collectible for saving your song to their library."
            ctaLabel={
              canCreateMusicDrop ? "Create Music Drop" : "Request Access"
            }
            onPress={() =>
              canCreateMusicDrop
                ? router.push("/drop/music")
                : Linking.openURL(
                    "https://showtimexyz.typeform.com/to/pXQVhkZo"
                  )
            }
          />
        </View>
        <View tw="m-4 w-[320px]">
          <CreateCard
            title="Event drop"
            description="Connect with fans who show up to your events. This drop lets people mark themselves at your event location."
            ctaLabel="Create Event Drop"
            onPress={() => router.push("/drop/event")}
          />
        </View>
        <View tw="m-4 w-[320px]">
          <CreateCard
            title="Private drop"
            description="A collectible for your biggest fans of your choice. Don't give up your password so easily!"
            ctaLabel="Create Private Drop"
            onPress={() => router.push("/drop/private")}
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
}: {
  title: string;
  description: string;
  ctaLabel: string;
  onPress: () => void;
}) => {
  return (
    <View tw="min-h-[180px] justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-900 lg:min-h-[216px]">
      <Text tw="text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </Text>
      <Text tw="text-base text-gray-900 dark:text-gray-100">{description}</Text>
      <Button onPress={onPress}>{ctaLabel}</Button>
    </View>
  );
};
