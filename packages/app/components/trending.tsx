import React, { Suspense, useCallback, useMemo, useRef } from "react";
import { Dimensions, FlatList, StatusBar } from "react-native";
import { ImageStyle } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeaderLeft, HeaderRight } from "app/components/header";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import type { NFT } from "app/types";

import { View, Text, Spinner } from "design-system";
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

export const Trending = () => {
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

const feedItemStyle = {
  height: screenHeight,
  width: screenWidth,
};

const mediaMaxHeightRelativeToScreen = 0.7;
const mediaMinHeightRelativeToScreen = 0.5;

const FeedItem = ({ nft }: { nft: NFT }) => {
  let mediaHeight =
    screenWidth /
    (isNaN(Number(nft.token_aspect_ratio))
      ? 1
      : Number(nft.token_aspect_ratio));

  const mediaContainerHeight = Math.min(
    Math.max(
      mediaHeight,
      feedItemStyle.height * mediaMinHeightRelativeToScreen
    ),
    feedItemStyle.height * mediaMaxHeightRelativeToScreen
  );

  mediaHeight = Math.min(mediaHeight, mediaContainerHeight);

  const descriptionHeight = screenHeight - mediaContainerHeight;

  return (
    <View style={feedItemStyle}>
      <View
        tw="w-full items-center justify-end bg-black"
        style={{ height: mediaContainerHeight }}
      >
        <Media
          item={nft}
          style={{
            height: mediaHeight,
            width: screenWidth,
          }}
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
      <Image
        source={{ uri: nft.still_preview_url }}
        style={tw.style("w-full h-full absolute")}
      />

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

  const listRef = useRef<FlatList>(null);

  // useScrollToTop();
  useScrollToTop(
    React.useRef({
      scrollToTop: () => {
        listRef.current.scrollToOffset({ animated: false, offset: 0 });
      },
    })
  );

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
      <Header />
      <View tw={`bg-black`}>
        <ViewabilityTrackerFlatlist
          keyExtractor={(_item, index) => index.toString()}
          getItemLayout={(_data, index) => {
            return {
              length: screenHeight,
              offset: screenHeight * index,
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
          style={{ backgroundColor: "black" }}
          contentContainerStyle={{ backgroundColor: "black" }}
          ListFooterComponent={ListFooterComponent}
        />
      </View>
    </>
  );
};

const Header = () => {
  const top = useSafeAreaInsets().top;

  return (
    <View
      tw="absolute items-center w-full flex-row justify-between px-4"
      sx={{ top, zIndex: 1 }}
    >
      <HeaderLeft color={tw.color("white") || "white"} canGoBack={false} />
      <Text
        tw="text-gray-100 font-bold"
        variant="text-xl"
        sx={{
          fontSize: 18,
          textShadowColor: "rgba(0, 0, 0, 0.4)",
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4,
        }}
      >
        Home
      </Text>
      <HeaderRight
        variant="text"
        textStyle={{
          fontSize: 18,
          textShadowColor: "rgba(0, 0, 0, 0.4)",
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4,
          color: "white",
        }}
      />
    </View>
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

type Props = {
  item: NFT;
  style?: ImageStyle;
};

function Media({ item, style }: Props) {
  const imageUri = getImageUrlLarge(
    item?.token_aspect_ratio,
    item?.still_preview_url ? item?.still_preview_url : item?.token_img_url
  );

  const videoUri = item?.source_url
    ? item?.source_url
    : item?.token_animation_url;

  return (
    <View>
      {imageUri &&
      (item?.mime_type === "image/svg+xml" || imageUri.includes(".svg")) ? (
        <PinchToZoom>
          <Image
            source={{
              uri: `${
                process.env.NEXT_PUBLIC_BACKEND_URL
              }/v1/media/format/img?url=${encodeURIComponent(imageUri)}`,
            }}
            style={style}
            blurhash={item?.blurhash}
            resizeMode="contain"
          />
        </PinchToZoom>
      ) : null}

      {item?.mime_type?.startsWith("image") &&
      item?.mime_type !== "image/svg+xml" ? (
        <PinchToZoom>
          <Image
            source={{
              uri: imageUri,
            }}
            style={style}
            blurhash={item?.blurhash}
            resizeMode="contain"
          />
        </PinchToZoom>
      ) : null}

      {item?.mime_type?.startsWith("video") ? (
        <View>
          <Video
            source={{
              uri: videoUri,
            }}
            posterSource={{
              uri: item?.still_preview_url,
            }}
            style={style}
            useNativeControls
            resizeMode="contain"
          />
        </View>
      ) : null}
    </View>
  );
}

const MemoizedMedia = withMemoAndColorScheme(Media);

export { MemoizedMedia as Media };
