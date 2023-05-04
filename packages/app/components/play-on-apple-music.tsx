import React from "react";
import { Linking, Platform, StyleSheet } from "react-native";

import { ListenOnAppleMusic } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { Analytics, EVENTS } from "app/lib/analytics";

export const PlayOnAppleMusic = ({
  edition,
}: {
  edition: CreatorEditionResponse;
}) => {
  return (
    <Pressable
      tw="px-1 pb-px pt-[3px]"
      onPress={(e) => {
        if (Platform.OS === "web") {
          e.preventDefault();
        }

        if (edition.apple_music_track_url) {
          Linking.openURL(edition.apple_music_track_url);
          Analytics.track(EVENTS.PLAY_ON_APPLE_MUSIC_PRESSED, {
            editionId: edition.creator_airdrop_edition.id,
          });
        }
      }}
    >
      <View
        tw="items-center justify-center rounded bg-black/60"
        style={StyleSheet.absoluteFillObject}
      />
      <View tw="h-full flex-row items-center justify-center">
        <ListenOnAppleMusic height={20} width={20 * (125 / 27)} color="white" />
      </View>
    </Pressable>
  );
};
