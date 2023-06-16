import React from "react";
import { Linking, Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Chip } from "@showtime-xyz/universal.chip";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import {
  Raffle,
  CreatorChannel,
  CollectorList,
} from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useUser } from "app/hooks/use-user";

import { StepProps } from "./types";

export const SelectDropType = (props: StepProps) => {
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
      <View tw="justify-center" style={{ rowGap: 8 }}>
        <Button size="regular" tw="w-full" onPress={props.handleNextStep}>
          <Text>Paid Collectible Badge</Text>
          <ChevronRight color={"white"} />
        </Button>
        <Button
          size="regular"
          tw="w-full"
          onPress={() => {
            if (canCreateMusicDrop) {
              props.handleNextStep();
            } else {
              Linking.openURL("https://showtimexyz.typeform.com/to/pXQVhkZo");
            }
          }}
        >
          <Text>Pre-Save Drop</Text>
          <ChevronRight color={"white"} />
        </Button>
        <View tw="mt-4 w-[80%] self-center" style={{ rowGap: 8 }}>
          <View>
            <View tw="flex-row" style={{ columnGap: 8 }}>
              <Raffle color={iconColor} />
              <View>
                <Text>Offer Raffles</Text>
                <Text>Gift an NFT to attract collectors</Text>
              </View>
            </View>
          </View>
          <View>
            <View tw="flex-row" style={{ columnGap: 8 }}>
              <CreatorChannel color={iconColor} />
              <View>
                <Text>Build a fanbase</Text>
                <Text>Collectors auto-join your channel</Text>
              </View>
            </View>
          </View>
          <View>
            <View tw="flex-row" style={{ columnGap: 8 }}>
              <CollectorList color={iconColor} />
              <View>
                <Text>Collector lists</Text>
                <Text>Share a link to instantly create</Text>
              </View>
            </View>
          </View>
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
