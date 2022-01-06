import { Text } from "design-system/text";
import { View } from "design-system/view";
import { Image } from "design-system/image";
import { VerificationBadge } from "design-system/verification-badge";
import { Accordion } from "design-system/accordion";
import { Button } from "design-system/button";
import { ChevronUp } from "design-system/icon";
import { Video } from "expo-av";
import { memo, useCallback, useContext, useMemo, useState } from "react";
import { useIsDarkMode } from "../hooks";
import { Creator, NFT } from "app/types";
import { Dimensions } from "react-native";

type Props = {
  creator: Creator;
};

export const ITEM_COLLAPSED_HEIGHT = 64;
export const ITEM_EXPANDED_HEIGHT =
  Dimensions.get("window").width / 2 - 10 + ITEM_COLLAPSED_HEIGHT;

export const CreatorPreview = memo((props: Props) => {
  const isDark = useIsDarkMode();
  const [isExpanded, setExpanded] = useState(false);
  return (
    <View
      style={useMemo(() => ({
        height: isExpanded ? ITEM_EXPANDED_HEIGHT : ITEM_COLLAPSED_HEIGHT,
        overflow: "hidden",
      }),[isExpanded])}
    >
      <Accordion.Root
        onValueChange={useCallback((v) => {
          if (v) {
            setExpanded(true);
          } else {
            setExpanded(false);
          }
        },[setExpanded])}
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
    </View>
  );
});

const ITEM_SIZE = Dimensions.get("window").width / 2 - 10;

const Media = ({ item }: { item: NFT }) => {
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
