import { Platform, useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const DropExplanation = ({ onDone }: { onDone: () => void }) => {
  const previewAspectRatio = 382 / 256;

  const windowDimensions = useWindowDimensions();
  const previewWidth =
    windowDimensions.width > 768 ? windowDimensions.width * 0.2 : 170;
  const previewHeight = previewWidth * previewAspectRatio;

  return (
    <View tw="flex-1 px-8">
      <Text tw="text-center text-2xl font-bold text-gray-900 dark:text-gray-50 md:text-4xl">
        Your jaw will drop, too.
      </Text>
      <View tw="mt-4 md:mt-8 md:flex-row">
        <View tw="items-center md:items-stretch">
          <Image
            source={Platform.select({
              web: { uri: require("./drop-preview.png") },
              default: require("./drop-preview.png"),
            })}
            height={previewHeight}
            width={previewWidth}
          />
        </View>
        <View tw="mt-4 justify-center md:mt-0 md:flex-1 md:px-8">
          <View>
            <Text tw="text-base font-bold text-gray-900 dark:text-gray-50 md:text-xl">
              The easiest way to collect.
            </Text>
            <Text tw="pt-2 text-gray-900 dark:text-gray-50">
              So easy people have collected drops over 1.5 million times
            </Text>
          </View>
          <View tw="mt-4 md:mt-8">
            <Text tw="text-base font-bold text-gray-900 dark:text-gray-50 md:text-xl">
              Promote songs, chats, NFTs.
            </Text>
            <Text tw="pt-2 text-gray-900 dark:text-gray-50">
              Over 2,500 superfans have pre-saved music drops on Spotify
            </Text>
          </View>
          <View tw="mt-4 md:mt-8">
            <Text tw="text-base font-bold text-gray-900 dark:text-gray-50 md:text-xl">
              Instant collector (allow) list.
            </Text>
            <Text tw="pt-2 text-gray-900 dark:text-gray-50">
              Directly connect with your fans to offer raffles, presale, & other
              perks
            </Text>
          </View>
          <View tw="mt-4 md:mt-8">
            <Text tw="text-base font-bold text-gray-900 dark:text-gray-50 md:text-xl">
              One link to blast everywhere.
            </Text>
            <Text tw="pt-2 text-gray-900 dark:text-gray-50">
              Share digital collectibles with your whole fanbase or privately
            </Text>
          </View>
        </View>
      </View>
      <Button onPress={onDone} tw="mt-4 md:mt-8">
        Let's go
      </Button>
    </View>
  );
};
