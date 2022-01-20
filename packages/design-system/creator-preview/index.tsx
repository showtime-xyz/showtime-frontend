import { useCallback, useContext } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { Text } from "design-system/text";
import { View } from "design-system/view";
import { Image } from "design-system/image";
import { VerificationBadge } from "design-system/verification-badge";
import { Accordion } from "design-system/accordion";
import { Button } from "design-system/button";
import { ChevronUp } from "design-system/icon";
import { useIsDarkMode } from "design-system/hooks";
import { Media } from "design-system/media";
import type { Creator, NFT } from "app/types";
import { withMemoAndColorScheme } from "app/components/memoWithTheme";

type Props = {
  creator: Creator;
};

export const ITEM_COLLAPSED_HEIGHT = 64;
export const ITEM_EXPANDED_HEIGHT =
  Dimensions.get("window").width / 3 + ITEM_COLLAPSED_HEIGHT + 24;

export const CreatorPreview = withMemoAndColorScheme((props: Props) => {
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
            <View tw="flex-row justify-center -mt-3">
              {props.creator.top_items.slice(0, 3).map((item) => {
                return (
                  <View tw="mx-1 rounded-3xl overflow-hidden" key={item.nft_id}>
                    <Item item={item} />
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

const ITEM_SIZE = Dimensions.get("window").width / 3 - 20;

const Item = ({ item }: { item: NFT }) => {
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

  return (
    <Media item={item} numColumns={3} tw="w-[30vw] h-[30vw] rounded-2xl" />
  );
};
