import React from "react";
import { Linking } from "react-native";

import Svg, { SvgProps, Path } from "react-native-svg";

import { Button } from "@showtime-xyz/universal.button";
import { Globe } from "@showtime-xyz/universal.icon";
import { Spotify } from "@showtime-xyz/universal.icon";
import { Gift } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useUser } from "app/hooks/use-user";

const SvgLock = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
    <Path
      fill={props.color}
      d="M17 9V7c0-2.8-2.2-5-5-5S7 4.2 7 7v2c-1.7 0-3 1.3-3 3v7c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-7c0-1.7-1.3-3-3-3zM9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V7zm4.1 8.5-.1.1V17c0 .6-.4 1-1 1s-1-.4-1-1v-1.4c-.6-.6-.7-1.5-.1-2.1.6-.6 1.5-.7 2.1-.1.6.5.7 1.5.1 2.1z"
    />
  </Svg>
);

export const DropSelect = () => {
  const router = useRouter();
  const user = useUser();
  const canCreateMusicDrop = !!user.user?.data.profile.spotify_artist_id;

  return (
    <BottomSheetScrollView>
      <View tw="flex-row flex-wrap items-center justify-center">
        <View tw="m-4 w-full px-4 lg:w-[360px]">
          <CreateCard
            title="Free drop"
            description="Give your fans a free collectible."
            ctaLabel="Create Free Drop"
            icon={<Gift color="white" height={16} width={16} />}
            onPress={() => router.push("/drop/free")}
          />
        </View>
        <View tw="m-4 w-full px-4 lg:w-[360px]">
          <CreateCard
            title="Music drop"
            icon={<Spotify color="white" height={16} width={16} />}
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
        <View tw="m-4 w-full px-4 lg:w-[360px]">
          <CreateCard
            title="Event drop"
            icon={<Globe color="white" height={16} width={16} />}
            description="Connect with fans who show up to your events. This drop lets people mark themselves at your event location."
            ctaLabel="Create Event Drop"
            onPress={() => router.push("/drop/event")}
          />
        </View>
        <View tw="m-4 w-full px-4 lg:w-[360px]">
          <CreateCard
            title="Private drop"
            icon={<SvgLock color="white" height={16} width={16} />}
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
  icon,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  onPress: () => void;
  icon: React.ReactNode;
}) => {
  return (
    <View tw="min-h-[180px] justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-900 lg:min-h-[216px]">
      <Text tw="text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </Text>
      <Text tw="text-base text-gray-900 dark:text-gray-100">{description}</Text>
      <Button onPress={onPress}>
        <View tw="w-full flex-row justify-center">
          {icon}
          <Text tw="ml-2 text-gray-50 dark:text-gray-900">{ctaLabel}</Text>
        </View>
      </Button>
    </View>
  );
};
