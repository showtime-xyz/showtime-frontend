import { useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";

export const DropExplanation = ({ onDone }: { onDone: () => void }) => {
  const previewAspectRatio = 382 / 256;
  const insets = useSafeAreaInsets();

  const windowDimensions = useWindowDimensions();
  const previewWidth = Math.min(
    windowDimensions.width > 768 ? windowDimensions.width * 0.2 : 170,
    350
  );
  const previewHeight = previewWidth * previewAspectRatio;
  const modalScreenContext = useModalScreenContext();
  useEffect(() => {
    modalScreenContext?.setTitle("");
    return () => {
      modalScreenContext?.setTitle("Choose your drop type");
    };
  }, [modalScreenContext]);

  return (
    <View tw="relative flex-1 px-8">
      <BottomSheetScrollView>
        <Text tw="text-center text-2xl font-bold text-gray-900 dark:text-gray-50 lg:text-4xl">
          Your jaw will drop, too.
        </Text>
        <View tw="mt-4 lg:mt-8 lg:flex-row">
          <View tw="z-20 items-center lg:items-stretch">
            <Image
              source={Platform.select({
                web: { uri: require("./drop-preview.png") },
                default: require("./drop-preview.png"),
              })}
              height={previewHeight}
              width={previewWidth}
              alt="Drop Preview"
            />
          </View>
          <View tw="mt-4 justify-center lg:mt-0 lg:flex-1 lg:px-8">
            <View>
              <Text tw="text-base font-bold text-gray-900 dark:text-gray-50 lg:text-xl">
                The easiest way to collect.
              </Text>
              <Text tw="pt-2 text-gray-900 dark:text-gray-50">
                So easy people have collected drops over 1.5 million times.
              </Text>
            </View>
            <View tw="mt-4 lg:mt-8">
              <Text tw="text-base font-bold text-gray-900 dark:text-gray-50 lg:text-xl">
                Promote songs, chats, NFTs.
              </Text>
              <Text tw="pt-2 text-gray-900 dark:text-gray-50">
                Over 2,500 superfans have pre-saved music drops on Spotify.
              </Text>
            </View>
            <View tw="mt-4 lg:mt-8">
              <Text tw="text-base font-bold text-gray-900 dark:text-gray-50 lg:text-xl">
                Instant collector (allow) list.
              </Text>
              <Text tw="pt-2 text-gray-900 dark:text-gray-50">
                Directly connect with your fans to offer raffles, presale, &
                other perks.
              </Text>
            </View>
            <View tw="mt-4 lg:mt-8">
              <Text tw="text-base font-bold text-gray-900 dark:text-gray-50 lg:text-xl">
                One link to blast everywhere.
              </Text>
              <Text tw="pt-2 text-gray-900 dark:text-gray-50">
                Share digital collectibles with your whole fanbase or privately.
              </Text>
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
      <View style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
        <Button onPress={onDone} size="regular" tw="z-30mt-4 lg:mt-8">
          Let's go
        </Button>
      </View>
    </View>
  );
};
