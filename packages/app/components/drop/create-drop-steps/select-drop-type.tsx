import React from "react";
import { Linking, Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import {
  Raffle,
  CreatorChannel,
  CollectorList,
} from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
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
  const modalScreenContext = useModalScreenContext();
  const router = useRouter();

  if (user.isIncompletedProfile) {
    return null;
  }
  const iconColor = isDark ? "#fff" : "#121212";

  return (
    <BottomSheetScrollView useNativeModal={false}>
      <View tw="justify-center px-4" style={{ rowGap: 8 }}>
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
        <Button
          size="regular"
          tw="w-full"
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
          <Text>Digital art collectible</Text>
          <ChevronRight color={"white"} />
        </Button>
        <View tw="mt-4 w-[70%] self-center" style={{ rowGap: 8 }}>
          <View>
            <View tw="flex-row" style={{ columnGap: 12 }}>
              <Raffle color={iconColor} width={20} height={20} />
              <View style={{ gap: 2 }}>
                <Text>Offer Raffles</Text>
                <Text>Gift an NFT to attract collectors</Text>
              </View>
            </View>
          </View>
          <View>
            <View tw="flex-row" style={{ columnGap: 12 }}>
              <CreatorChannel color={iconColor} width={20} height={20} />
              <View style={{ gap: 2 }}>
                <Text>Build a fanbase</Text>
                <Text>Collectors auto-join your channel</Text>
              </View>
            </View>
          </View>
          <View>
            <View tw="flex-row" style={{ columnGap: 12 }}>
              <CollectorList color={iconColor} width={20} height={20} />
              <View style={{ gap: 2 }}>
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
