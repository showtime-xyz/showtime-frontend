import React from "react";
import { Linking, Platform, StyleSheet } from "react-native";

import { SpotifyPure } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { Analytics, EVENTS } from "app/lib/analytics";

export const PlayOnSpotify = ({
  edition,
}: {
  edition: CreatorEditionResponse;
}) => {
  return (
    <Pressable
      tw="items-center justify-center px-1 py-0.5"
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
      <View tw="rounded bg-black/60" style={StyleSheet.absoluteFillObject} />
      <View tw="flex-row items-center">
        <SpotifyPure color="white" width={18.11} height={18.11} />
        <Text
          style={{ marginTop: 0, marginBottom: 0 }}
          tw="ml-1 text-xs font-medium text-white"
        >
          Play on Spotify
        </Text>
      </View>
    </Pressable>
  );
};
