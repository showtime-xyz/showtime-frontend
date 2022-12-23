import React from "react";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowLeft } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { EventDrop } from "./event-drop";
import { MusicDrop } from "./music-drop";
import { PasswordDrop } from "./password-drop";

type DropTypes = "music" | "vip" | "event";

export const DropForm = () => {
  const [dropType, setDropType] = React.useState<DropTypes | null>(null);
  const isDark = useIsDarkMode();

  const getDropTypeComponent = (type: DropTypes | null) => {
    switch (type) {
      case "music":
        return <MusicDrop />;
      case "vip":
        return <PasswordDrop />;
      case "event":
        return <EventDrop />;
      default:
        return (
          <View tw="lg:flex-row">
            <View tw="flex-1">
              <CreateCard
                title="Music drop"
                description="Promote your latest music: give your fans a free collectible for saving your song to their library."
                ctaLabel="Create Music Drop"
                onPress={() => setDropType("music")}
              />
            </View>
            <View tw="h-4 w-4" />
            <View tw="flex-1">
              <CreateCard
                title="Event drop"
                description="Connect with fans who show up to your events. This drop lets people mark themselves at your event location."
                ctaLabel="Create Event Drop"
                onPress={() => setDropType("event")}
              />
            </View>
            <View tw="h-4 w-4" />
            <View tw="flex-1">
              <CreateCard
                title="VIP drop"
                description="A collectible for your biggest fans of your choice. Don't give up your VIP password so easily!"
                ctaLabel="Create VIP Drop"
                onPress={() => setDropType("vip")}
              />
            </View>
          </View>
        );
    }
  };

  return (
    <View tw="p-4">
      {dropType && (
        <Pressable tw="ml-2" onPress={() => setDropType(null)}>
          <ArrowLeft
            color={isDark ? colors.gray[100] : colors.gray[900]}
            width={24}
            height={24}
          />
        </Pressable>
      )}
      {getDropTypeComponent(dropType)}
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
