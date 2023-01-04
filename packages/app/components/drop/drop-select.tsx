import React from "react";
import { ScrollView } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const DropSelect = () => {
  const router = useRouter();

  return (
    <View tw="p-4">
      <ScrollView>
        <View tw="h-full lg:flex-row">
          <View tw="flex-1">
            <CreateCard
              title="Music drop"
              description="Promote your latest music: give your fans a free collectible for saving your song to their library."
              ctaLabel="Create Music Drop"
              onPress={() => router.push("/drop/music")}
            />
          </View>
          <View tw="h-4 w-4" />
          <View tw="flex-1">
            <CreateCard
              title="Event drop"
              description="Connect with fans who show up to your events. This drop lets people mark themselves at your event location."
              ctaLabel="Create Event Drop"
              onPress={() => router.push("/drop/event")}
            />
          </View>
          <View tw="h-4 w-4" />
          <View tw="flex-1">
            <CreateCard
              title="Private drop"
              description="A collectible for your biggest fans of your choice. Don't give up your VIP password so easily!"
              ctaLabel="Create Private Drop"
              onPress={() => router.push("/drop/private")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
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
