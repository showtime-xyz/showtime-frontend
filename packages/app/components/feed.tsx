import React, { Suspense, useCallback, useMemo, useRef } from "react";
import { Dimensions, FlatList, StatusBar } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { useScrollToTop } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Blurhash } from "react-native-blurhash";

import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import type { NFT } from "app/types";

import { View, Text, Spinner, Media } from "design-system";
import { Avatar } from "design-system/avatar";
import { useIsDarkMode } from "design-system/hooks";
import {
  Message,
  Heart,
  Share,
  MoreHorizontal,
  ShowtimeGradient,
} from "design-system/icon";
import { Image } from "design-system/image";
import { PinchToZoom } from "design-system/pinch-to-zoom";
import { tw } from "design-system/tailwind";
import { Video } from "design-system/video";

import { useActivity } from "../hooks/api-hooks";
import { formatAddressShort } from "../utilities";
import { ViewabilityTrackerFlatlist } from "./viewability-tracker-flatlist";

export const Feed = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View tw="flex-1" testID="homeFeed">
        <Suspense
          fallback={
            <View tw="flex-1 justify-center items-center">
              <Spinner size="small" />
            </View>
          }
        >
          <FeedList />
        </Suspense>
      </View>
    </>
  );
};

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");
const mediaMaxHeightRelativeToScreen = 0.6;

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
      <View
        tw="w-full items-center justify-end bg-black"
        style={{ height: mediaContainerHeight }}
      >
        <Media
          item={nft}
          numColumns={1}
          tw={`h-[${mediaHeight}px] w-[${screenWidth}px]`}
          resizeMode="contain"
        />
      </View>
      <View tw="w-full" style={{ height: descriptionHeight }}>
        <Description nft={nft} />
      </View>
    </View>
  );
};

const Description = ({ nft }: { nft: NFT }) => {
  const isDark = useIsDarkMode();
  const tint = isDark ? "dark" : "light";
  const bottomBarHeight = useBottomTabBarHeight();

  return (
    <View tw="w-full flex-1">
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
      <BlurView style={tw.style(`p-4 flex-1`)} tint={tint} intensity={85}>
        <View tw="flex-row justify-between">
          <View tw="flex-row">
            <View tw="flex-row items-center">
              <Heart
                height={20}
                width={20}
                color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
              />
              <Text tw="text-xs text-gray-900 dark:text-white font-bold ml-1 ">
                42.4k
              </Text>
            </View>

            <View tw="flex-row items-center ml-4">
              <Message
                height={20}
                width={20}
                color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
              />
              <Text tw="text-xs text-gray-900 dark:text-white font-bold ml-1">
                200
              </Text>
            </View>
          </View>

          <View tw="flex-row">
            <Share
              height={20}
              width={20}
              color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
            />
            <View tw="w-8" />
            <MoreHorizontal
              height={20}
              width={20}
              color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
            />
          </View>
        </View>
        <View tw="flex-row mt-4">
          <Avatar url={nft.creator_img_url} size={32} />
          <View tw="justify-around ml-1">
            <Text tw="text-xs font-bold text-gray-900 dark:text-white">
              {nft.owner_username ? (
                <>@{nft.owner_username}</>
              ) : (
                <>{formatAddressShort(nft.owner_address)}</>
              )}
            </Text>
            <Text tw="text-gray-900 text-xs dark:text-white">
              15 minutes ago
            </Text>
          </View>
        </View>
        <View tw="mt-4">
          <Text
            variant="text-2xl"
            tw="text-gray-900 dark:text-white"
            numberOfLines={3}
            sx={{ fontSize: 16, lineHeight: 20 }}
          >
            {nft.token_description}
          </Text>
        </View>

        <View
          tw="mt-auto flex-row justify-between items-center"
          style={{ paddingBottom: bottomBarHeight }}
        >
          <View tw="flex-row items-center">
            <ShowtimeGradient height={20} width={20} />
            <Text tw="ml-2 font-bold text-xs dark:text-white">Showtime</Text>
          </View>
          <Text tw="text-xs text-gray-900 dark:text-white">100 Editions</Text>
        </View>
      </BlurView>
    </View>
  );
};

// 1. we keep absolute header in feed instead of native one
// 2. Media resize mode is kept contain and 60% screen height
// 3. Description takes 40% screen height
export const FeedList = () => {
  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useActivity({ typeId: 0 });
  const ListFooterComponent = useCallback(
    () => <Footer isLoading={isLoadingMore} />,
    [isLoadingMore]
  );
  const headerHeight = useHeaderHeight();

  const listRef = useRef<FlatList>(null);

  // useScrollToTop();
  useScrollToTop(listRef);

  const newData: any = useMemo(() => {
    if (data && Array.isArray(data)) {
      return data.filter((d) => d.nfts[0]);
    }
    return [];
  }, [data]);

  if (isLoading) {
    return (
      <View tw="items-center justify-center flex-1">
        <Spinner />
      </View>
    );
  }

  return (
    <>
      <View tw={`bg-black`}>
        <ViewabilityTrackerFlatlist
          keyExtractor={(_item, index) => index.toString()}
          getItemLayout={(_data, index) => {
            return {
              length: screenHeight - headerHeight,
              offset: (screenHeight - headerHeight) * index,
              index,
            };
          }}
          ref={listRef}
          windowSize={3}
          initialNumToRender={1}
          renderItem={({ item }) => <FeedItem nft={item.nfts[0]} />}
          pagingEnabled
          onEndReachedThreshold={0.6}
          onEndReached={fetchMore}
          data={newData}
          ListFooterComponent={ListFooterComponent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  const tabBarHeight = useBottomTabBarHeight();

  if (isLoading) {
    return (
      <View
        tw="h-16 items-center justify-center mt-6 px-3"
        sx={{ marginBottom: tabBarHeight }}
      >
        <Spinner size="small" />
      </View>
    );
  }

  return <View sx={{ marginBottom: tabBarHeight }}></View>;
};

const getImageUrlLarge = (tokenAspectRatio: string, imgUrl?: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    if (tokenAspectRatio && Number(tokenAspectRatio) > 1)
      imgUrl = imgUrl.split("=")[0] + "=h1328";
    else imgUrl = imgUrl.split("=")[0] + "=w1328";
  }

  return imgUrl;
};

const MemoizedMedia = withMemoAndColorScheme(Media);

export { MemoizedMedia as Media };
