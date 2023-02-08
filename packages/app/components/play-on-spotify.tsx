import React from "react";
import { Linking, Platform, StyleSheet } from "react-native";

import { Spotify } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const PlayOnSpotify = ({ url }: { url: string }) => {
  return (
    <Pressable
      tw="px-1 py-0.5"
      onPress={(e) => {
        if (Platform.OS === "web") {
          e.preventDefault();
        }

        Linking.openURL(url);
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
