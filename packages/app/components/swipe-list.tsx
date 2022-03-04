import React, { useCallback, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StatusBar,
} from "react-native";

import { useScrollToTop } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Blurhash } from "react-native-blurhash";

import type { NFT } from "app/types";

import { useIsDarkMode } from "design-system/hooks";
import { Share } from "design-system/icon";
import { Image } from "design-system/image";
import { Media } from "design-system/media";
import { Skeleton } from "design-system/skeleton";
import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";
import { View } from "design-system/view";

import { handleShareNFT } from "../utilities";
import { Collection } from "./feed/collection";
import { Creator } from "./feed/creator";
import { Like } from "./feed/like";
import { NFTDropdown } from "./nft-dropdown";
import { ViewabilityTrackerFlatlist } from "./viewability-tracker-flatlist";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");
const mediaMaxHeightRelativeToScreen = 0.6;

export const SwipeList = ({
  data,
  fetchMore,
  isRefreshing,
  refresh,
  initialScrollIndex = 0,
  isLoadingMore,
  bottomBarHeight = 0,
  headerHeight = StatusBar.currentHeight,
}: any) => {
  const listRef = useRef<FlatList>(null);

  useScrollToTop(listRef);

  const renderItem = useCallback(
    ({ item }) => (
      <FeedItem
        headerHeight={headerHeight}
        bottomBarHeight={bottomBarHeight}
        nft={item}
      />
    ),
    [bottomBarHeight, headerHeight]
  );

  const keyExtractor = useCallback((_item, index) => _item.nft_id, []);

  const itemHeight = screenHeight - headerHeight;

  const getItemLayout = useCallback(
    (_data, index) => {
      return {
        length: itemHeight,
        offset: itemHeight * index,
        index,
      };
    },
    [itemHeight]
  );

  const ListFooterComponent = useCallback(
    () =>
      isLoadingMore ? (
        <View tw="w-full" sx={{ marginBottom: bottomBarHeight }}>
          <Skeleton height={100} width={screenWidth} />
        </View>
      ) : null,
    [isLoadingMore, bottomBarHeight, screenWidth]
  );

  return (
    <ViewabilityTrackerFlatlist
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      onRefresh={refresh}
      refreshing={isRefreshing}
      ref={listRef}
      windowSize={3}
      initialNumToRender={1}
      renderItem={renderItem}
      pagingEnabled
      onEndReached={fetchMore}
      data={data}
      ListFooterComponent={ListFooterComponent}
      showsVerticalScrollIndicator={false}
      // TODO: contentOffset open issue on iOS - look into it
      // https://github.com/facebook/react-native/issues/33221
      {...Platform.select({
        ios: { initialScrollIndex },
        default: {
          contentOffset: {
            y: initialScrollIndex * itemHeight,
            x: 0,
          },
        },
      })}
    />
  );
};

const FeedItem = ({
  nft,
  bottomBarHeight = 0,
  headerHeight = 0,
}: {
  nft: NFT;
  bottomBarHeight: number;
  headerHeight: number;
}) => {
  const feedItemStyle = {
    height: screenHeight - headerHeight,
    width: screenWidth,
  };

  let mediaHeight =
    screenWidth /
    (isNaN(Number(nft.token_aspect_ratio))
      ? 1
      : Number(nft.token_aspect_ratio));

  const mediaContainerHeight = Math.min(
    mediaHeight,
    feedItemStyle.height * mediaMaxHeightRelativeToScreen
  );

  mediaHeight = Math.min(mediaHeight, mediaContainerHeight);

  const descriptionHeight = screenHeight - mediaContainerHeight - headerHeight;

  return (
    <View style={feedItemStyle}>
      <View tw="absolute w-full h-full">
        {nft.blurhash ? (
          <Blurhash
            blurhash={nft.blurhash}
            decodeWidth={16}
            decodeHeight={16}
            decodeAsync={true}
            style={tw.style("w-full h-full")}
          />
        ) : (
          <Image
            source={{ uri: nft.still_preview_url }}
            style={tw.style("w-full h-full")}
          />
        )}
      </View>
      <View
        tw={`w-full items-center justify-end bg-black h-[${mediaContainerHeight}px]`}
      >
        <Media
          item={nft}
          numColumns={1}
          tw={`h-[${mediaHeight}px] w-[${screenWidth}px]`}
          resizeMode="contain"
        />
      </View>
      <View tw={`w-full h-[${descriptionHeight}px]`}>
        <NFTDetails nft={nft} bottomBarHeight={bottomBarHeight} />
      </View>
    </View>
  );
};

const NFTDetails = ({
  nft,
  bottomBarHeight = 0,
}: {
  nft: NFT;
  bottomBarHeight: number;
}) => {
  const isDark = useIsDarkMode();
  const tint = isDark ? "dark" : "light";

  return (
    <BlurView style={tw.style(`p-4 flex-1 w-full`)} tint={tint} intensity={85}>
      <View tw="flex-row justify-between">
        <View tw="flex-row">
          <Like nft={nft} />

          <View tw="flex-row items-center ml-4">
            {/* Comments here */}

            {/* <Message
              height={24}
              width={24}
              //@ts-ignore
              color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
            />
            <Text tw="text-xs text-gray-900 dark:text-white font-bold ml-1">
              240
            </Text> */}
          </View>
        </View>

        <View tw="flex-row">
          <Pressable onPress={() => handleShareNFT(nft)}>
            <Share
              height={22}
              width={22}
              //@ts-ignore
              color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
            />
          </Pressable>

          <View tw="w-8" />
          <NFTDropdown nft={nft} />
        </View>
      </View>
      <View tw="flex-row mt-4">
        <Creator nft={nft} />
      </View>
      <View tw="mt-4">
        <Text
          variant="text-2xl"
          tw="text-gray-900 dark:text-white"
          numberOfLines={3}
          sx={{ fontSize: 17, lineHeight: 22 }}
        >
          {nft.token_name}
        </Text>
      </View>

      <View tw={`mt-auto pb-[${bottomBarHeight}px]`}>
        <Collection nft={nft} />
      </View>
    </BlurView>
  );
};
