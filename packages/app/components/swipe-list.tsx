import React, { useCallback, useMemo, useRef } from "react";
import { Dimensions, FlatList, Pressable, RefreshControl } from "react-native";

import { useScrollToTop } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Blurhash } from "react-native-blurhash";
import { DataProvider, LayoutProvider } from "recyclerlistview";

import { Collection } from "app/components/feed/collection";
import { CommentButton } from "app/components/feed/comment-button";
import { Creator } from "app/components/feed/creator";
import { Like } from "app/components/feed/like";
import { NFTDropdown } from "app/components/nft-dropdown";
import { VideoConfigContext } from "app/context/video-config-context";
import type { NFT } from "app/types";
import { handleShareNFT } from "app/utilities";

import { useIsDarkMode } from "design-system/hooks";
import { Share } from "design-system/icon";
import { Image } from "design-system/image";
import { Media } from "design-system/media";
import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";
import { View } from "design-system/view";

import { ViewabilityTrackerRecyclerList } from "./viewability-tracker-swipe-list";

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
  headerHeight = 0,
}: any) => {
  const listRef = useRef<FlatList>(null);

  useScrollToTop(listRef);

  const itemHeight = screenHeight - headerHeight;

  let dataProvider = useMemo(
    () =>
      new DataProvider((r1, r2) => {
        return r1.nft_id !== r2.nft_id;
      }).cloneWithRows(data),
    [data]
  );

  const _layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        () => {
          return "item";
        },
        (_type, dim) => {
          dim.width = screenWidth;
          dim.height = itemHeight;
        }
      ),
    [screenWidth, itemHeight]
  );

  const _rowRenderer = useCallback(
    (_type: any, item: any) => {
      return (
        <FeedItem
          itemHeight={itemHeight}
          bottomBarHeight={bottomBarHeight}
          nft={item}
        />
      );
    },
    [itemHeight]
  );

  // const ListFooterComponent = useCallback(() => {
  //   const colorMode = useColorScheme();
  //   return isLoadingMore ? (
  //     <View tw="w-full">
  //       <Skeleton height={100} width={screenWidth} colorMode={colorMode} />
  //     </View>
  //   ) : null;
  // }, [isLoadingMore, bottomBarHeight, screenWidth]);

  const scrollViewProps = useMemo(
    () => ({
      pagingEnabled: true,
      showsVerticalScrollIndicator: false,
      refreshControl: (
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
      ),
    }),
    [isRefreshing, refresh]
  );

  const videoConfig = useMemo(
    () => ({
      isMuted: false,
      useNativeControls: true,
    }),
    []
  );

  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <ViewabilityTrackerRecyclerList
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={_rowRenderer}
        ref={listRef}
        initialRenderIndex={initialScrollIndex}
        style={tw.style("dark:bg-gray-900 bg-gray-100")}
        renderAheadOffset={screenHeight}
        onEndReached={fetchMore}
        onEndReachedThreshold={screenHeight}
        scrollViewProps={scrollViewProps}
      />
    </VideoConfigContext.Provider>
  );
};

const FeedItem = React.memo(
  ({
    nft,
    bottomBarHeight = 0,
    itemHeight,
  }: {
    nft: NFT;
    bottomBarHeight: number;
    itemHeight: number;
  }) => {
    const feedItemStyle = {
      height: itemHeight,
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

    const descriptionHeight = feedItemStyle.height - mediaContainerHeight;

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
  }
);

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
          <CommentButton nft={nft} />
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
