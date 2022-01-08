import { Text } from "@showtime/universal-ui.text";
import { View } from "@showtime/universal-ui.view";
import { Image } from "@showtime/universal-ui.image";
import { VerificationBadge } from "@showtime/universal-ui.verification-badge";
import { Accordion } from "@showtime/universal-ui.accordion";
import { Button } from "@showtime/universal-ui.button";
import { ChevronUp } from "@showtime/universal-ui.icon";
import { Video } from "expo-av";
import { memo, useCallback, useContext } from "react";
import { useIsDarkMode } from "@showtime/universal-ui.hooks";
// import { Creator, NFT } from "app/types";
import { Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type Props = {
  creator: any;
};

export const ITEM_COLLAPSED_HEIGHT = 64;
export const ITEM_EXPANDED_HEIGHT =
  Dimensions.get("window").width / 2 + ITEM_COLLAPSED_HEIGHT + 20;

export const CreatorPreview = memo((props: Props) => {
  const isDark = useIsDarkMode();
  const isExpanded = useSharedValue(false);
  const style = useAnimatedStyle(() => ({
    height: isExpanded.value ? ITEM_EXPANDED_HEIGHT : ITEM_COLLAPSED_HEIGHT,
    overflow: "hidden",
  }));

  return (
    <Animated.View style={style}>
      <Accordion.Root
        onValueChange={useCallback((v) => {
          if (v) {
            isExpanded.value = true;
          } else {
            isExpanded.value = false;
          }
        }, [])}
      >
        <Accordion.Item
          value="hello"
          tw="mb-4"
          disabled={props.creator.top_items.length === 0}
        >
          <Accordion.Trigger>
            <View tw="w-full">
              <View tw="flex-row justify-between">
                <View tw="flex-row items-center">
                  <View tw="h-8 w-8 bg-gray-200 rounded-full mr-2">
                    <Image
                      source={{ uri: props.creator.img_url }}
                      tw="h-8 w-8 rounded-full"
                    />
                  </View>
                  <View>
                    <Text tw="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                      {props.creator.name}
                    </Text>
                    <View tw="items-center flex-row">
                      <Text tw="mt-[1px] text-sm text-gray-900 dark:text-white font-semibold mr-1">
                        @{props.creator.username}
                      </Text>
                      <View tw="mt-1">
                        <VerificationBadge size={14} />
                      </View>
                    </View>
                  </View>
                </View>
                <View tw="flex-row">
                  <Button variant="tertiary" tw="h-8 mr-2">
                    <Text tw="text-gray-900 font-bold text-sm dark:text-white">
                      Follow
                    </Text>
                  </Button>
                  {props.creator.top_items.length > 0 ? (
                    <Accordion.Chevron>
                      <Button variant="tertiary" tw="rounded-full h-8 w-8">
                        <ChevronUp color={isDark ? "#fff" : "#000"} />
                      </Button>
                    </Accordion.Chevron>
                  ) : null}
                </View>
              </View>
            </View>
          </Accordion.Trigger>
          <Accordion.Content>
            <View tw="flex-1 flex-row mb-2" style={{ margin: -10 }}>
              {props.creator.top_items.slice(0, 2).map((item) => {
                return (
                  <View tw="mr-2 rounded-lg overflow-hidden" key={item.nft_id}>
                    <Media item={item} />
                  </View>
                );
              })}
            </View>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </Animated.View>
  );
});

const ITEM_SIZE = Dimensions.get("window").width / 2 - 10;

const Media = ({ item }: { item: any }) => {
  const { value: selectedValue } = useContext(
    Accordion.RNAccordion.RootContext
  );
  const { value: itemValue } = useContext(Accordion.RNAccordion.ItemContext);
  const isExpanded = itemValue === selectedValue;

  if (!isExpanded) {
    return (
      <View
        style={{
          height: ITEM_SIZE,
          width: ITEM_SIZE,
        }}
      />
    );
  }

  if (item.mime_type?.startsWith("video")) {
    return (
      <Video
        source={{
          uri: item.animation_preview_url,
        }}
        style={{
          height: ITEM_SIZE,
          width: ITEM_SIZE,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        isMuted
      />
    );
  } else if (item.mime_type?.startsWith("image")) {
    return (
      <Image
        source={{
          uri: item.still_preview_url,
        }}
        style={{
          height: ITEM_SIZE,
          width: ITEM_SIZE,
        }}
        resizeMode="cover"
      />
    );
  }

  return null;
};
