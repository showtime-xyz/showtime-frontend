import React, { Suspense, useCallback, useMemo, useRef } from "react";
import { Dimensions, FlatList, Pressable, StatusBar } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { useScrollToTop } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Blurhash } from "react-native-blurhash";

import type { NFT } from "app/types";

import { View, Text, Media, Skeleton } from "design-system";
import { useColorScheme, useIsDarkMode } from "design-system/hooks";
import { Share } from "design-system/icon";
import { Image } from "design-system/image";
import { tw } from "design-system/tailwind";

import { useActivity } from "../hooks/api-hooks";
import { handleShareNFT } from "../utilities";
import { Collection } from "./feed/collection";
import { Creator } from "./feed/creator";
import { Like } from "./feed/like";
import { NFTDropdown } from "./nft-dropdown";
import { ViewabilityTrackerFlatlist } from "./viewability-tracker-flatlist";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");
const mediaMaxHeightRelativeToScreen = 0.6;

export const Feed = () => {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View tw="flex-1" testID="homeFeed">
        <Suspense
          fallback={
            <View tw="items-center">
              <Skeleton
                colorMode={colorScheme}
                height={screenHeight - 300}
                width={screenWidth}
              />
              <View tw="h-2" />
              <Skeleton
                colorMode={colorScheme}
                height={300}
                width={screenWidth}
              />
            </View>
          }
        >
          <FeedList />
        </Suspense>
      </View>
    </>
  );
};

export const FeedList = () => {
  const { data, fetchMore, isRefreshing, refresh, isLoadingMore } = useActivity(
    { typeId: 0 }
  );

  const headerHeight = useHeaderHeight();

  const listRef = useRef<FlatList>(null);

  useScrollToTop(listRef);

  const newData: any = useMemo(() => {
    if (data && Array.isArray(data)) {
      return data.filter((d) => d.nfts[0]);
    }
    return [];
  }, [data]);

  const renderItem = useCallback(
    ({ item }) => <FeedItem nft={item.nfts[0]} />,
    []
  );

  const keyExtractor = useCallback((_item, index) => index.toString(), []);

  const getItemLayout = useCallback(
    (_data, index) => {
      return {
        length: screenHeight - headerHeight,
        offset: (screenHeight - headerHeight) * index,
        index,
      };
    },
    [headerHeight]
  );

  const ListFooterComponent = useCallback(
    () => <Footer isLoading={isLoadingMore} />,
    [isLoadingMore]
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
      data={newData}
      ListFooterComponent={ListFooterComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const FeedItem = ({ nft }: { nft: NFT }) => {
  const headerTop = useHeaderHeight();

  const feedItemStyle = {
    height: screenHeight - headerTop,
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

  const descriptionHeight = screenHeight - mediaContainerHeight - headerTop;

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
        <NFTDetails nft={nft} />
      </View>
    </View>
  );
};

const NFTDetails = ({ nft }: { nft: NFT }) => {
  const isDark = useIsDarkMode();
  const tint = isDark ? "dark" : "light";
  const bottomBarHeight = useBottomTabBarHeight();

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
              height={24}
              width={24}
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
const Footer = (props: { isLoading: boolean }) => {
  const tabBarHeight = useBottomTabBarHeight();

  if (props.isLoading) {
    return (
      <View tw="w-full" sx={{ marginBottom: tabBarHeight }}>
        <Skeleton height={100} width={screenWidth} />
      </View>
    );
  }

  return null;
};
