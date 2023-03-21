import { Dimensions } from "react-native";

import { Image } from "design-system/image";
import { Text } from "design-system/text";
import { View } from "design-system/view";

export const CopySpotifyLinkTutorial = () => {
  const previewWidth = Math.min(Dimensions.get("window").width, 480) - 40;

  return (
    <View tw="web:px-5 my-10">
      <Text tw="text-base font-bold text-gray-900 dark:text-white">
        How to find the Song Link on Spotify?
      </Text>
      <View tw="h-6" />
      <View tw="items-center">
        <Image
          source={{
            uri: "https://storage.googleapis.com/showtime-cdn/static/spotify_song_link_dropdown",
          }}
          width={previewWidth}
          height={previewWidth}
          resizeMode="contain"
          alt="Preview"
        />
      </View>
    </View>
  );
};
