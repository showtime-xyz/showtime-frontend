import React from "react";
import { Linking, Platform } from "react-native";

import { Spotify } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const PlayOnSpotify = ({ url }: { url: string }) => {
  return (
    <Pressable
      tw="flex-row rounded-xl bg-gray-800/80 px-2 py-1"
      onPress={(e) => {
        if (Platform.OS === "web") {
          e.preventDefault();
        }

        Linking.openURL(url);
      }}
    >
      <View tw="mr-2">
        <Spotify color="white" />
      </View>
      <Text tw="text-[12px] font-semibold text-white">Play on Spotify</Text>
    </Pressable>
  );
};
