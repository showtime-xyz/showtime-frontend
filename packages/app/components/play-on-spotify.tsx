import React from "react";
import { Linking, Platform, StyleSheet } from "react-native";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { Analytics, EVENTS } from "app/lib/analytics";

import { Spotify } from "design-system/icon";
import { Pressable } from "design-system/pressable";
import { Text } from "design-system/text";
import { View } from "design-system/view";

export const PlayOnSpotify = ({
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

        if (edition.spotify_track_url) {
          Linking.openURL(edition.spotify_track_url);
          Analytics.track(EVENTS.PLAY_ON_SPOTIFY_PRESSED, {
            editionId: edition.creator_airdrop_edition.id,
          });
        }
      }}
    >
      <View
        tw="rounded-xl bg-gray-800/80"
        style={StyleSheet.absoluteFillObject}
      />
      <View tw="flex-row items-center">
        <Spotify color="white" width={20} height={20} />
        <Text
          style={{ lineHeight: 18 }}
          tw="ml-1 text-xs font-semibold text-white"
        >
          Play on Spotify
        </Text>
      </View>
    </Pressable>
  );
};
