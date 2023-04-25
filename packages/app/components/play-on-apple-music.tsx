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
      tw="px-1 py-0.5"
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
      <View tw="rounded-sm bg-black/60" style={StyleSheet.absoluteFillObject} />
      <View tw="flex-row">
        <ListenOnAppleMusic height={22} color="white" />
      </View>
    </Pressable>
  );
};
