import { useCallback, useMemo, useRef, memo } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  Platform,
} from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import { useScrollToTop, useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import * as Device from "expo-device";
import { Blurhash } from "react-native-blurhash";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { DataProvider, LayoutProvider } from "recyclerlistview";

import { CommentButton } from "app/components/feed/comment-button";
import { Creator } from "app/components/feed/creator";
import { FeedItemTapGesture } from "app/components/feed/feed-item-tap-gesture";
import { Like } from "app/components/feed/like";
import { NFTDropdown } from "app/components/nft-dropdown";
import { LikeContextProvider } from "app/context/like-context";
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
const mediaMaxHeightRelativeToScreen = 1;

export const SwipeList = ({
  data,
  fetchMore,
  isRefreshing,
  refresh,
  initialScrollIndex = 0,
  isLoadingMore,
  bottomPadding = 0,
}: any) => {
  const listRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight();
  useScrollToTop(listRef);
  const navigation = useNavigation();
  const { height: safeAreaFrameHeight } = useSafeAreaFrame();

  const itemHeight =
    Platform.OS === "android"
      ? safeAreaFrameHeight - headerHeight
      : screenHeight;

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

  const opacity = useSharedValue(1);

  const detailStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, []);

  const hideHeader = useCallback(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        headerShown: false,
      });
      opacity.value = withTiming(0);
    }
  }, [navigation, opacity]);

  const showHeader = useCallback(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        headerShown: true,
      });
      opacity.value = withTiming(1);
    }
  }, [navigation, opacity]);

  const toggleHeader = useCallback(() => {
    if (opacity.value === 1) {
      hideHeader();
    } else {
      showHeader();
    }
  }, [hideHeader, showHeader, opacity]);

  const _rowRenderer = useCallback(
    (_type: any, item: any) => {
      return (
        <FeedItem
          itemHeight={itemHeight}
          bottomPadding={bottomPadding}
          nft={item}
          detailStyle={detailStyle}
          toggleHeader={toggleHeader}
          hideHeader={hideHeader}
          showHeader={showHeader}
        />
      );
    },
    [itemHeight, bottomPadding, hideHeader, showHeader, toggleHeader, opacity]
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
      onMomentumScrollEnd: showHeader,
      refreshControl: (
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
      ),
    }),
    [isRefreshing, refresh, showHeader]
  );

  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
    }),
    []
  );

  const extendedState = useMemo(() => ({ bottomPadding }), [bottomPadding]);

  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <ViewabilityTrackerRecyclerList
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={_rowRenderer}
        ref={listRef}
        initialRenderIndex={initialScrollIndex}
        style={tw.style("dark:bg-gray-900 bg-gray-100")}
        renderAheadOffset={itemHeight}
        onEndReached={fetchMore}
        onEndReachedThreshold={itemHeight}
        scrollViewProps={scrollViewProps}
        extendedState={extendedState}
      />
    </VideoConfigContext.Provider>
  );
};

export const FeedItem = memo(
  ({
    nft,
    bottomPadding = 0,
    itemHeight,
    hideHeader,
    showHeader,
    toggleHeader,
    detailStyle,
  }: {
    nft: NFT;
    detailStyle: any;
    showHeader: any;
    hideHeader: any;
    toggleHeader: any;
    bottomPadding: number;
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

    const isDark = useIsDarkMode();
    const tint = isDark ? "dark" : "light";

    return (
      <LikeContextProvider nft={nft}>
        <BlurView style={tw.style(`flex-1 w-full`)} tint={tint} intensity={85}>
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
          <FeedItemTapGesture
            toggleHeader={toggleHeader}
            showHeader={showHeader}
          >
            <View
              tw={`absolute h-[${
                itemHeight - bottomPadding - 50
              }px] justify-center`}
            >
              <Media
                item={nft}
                numColumns={1}
                tw={`h-[${mediaHeight}px] w-[${screenWidth}px]`}
                resizeMode="contain"
                onPinchStart={hideHeader}
                onPinchEnd={showHeader}
              />
            </View>
          </FeedItemTapGesture>

          <Reanimated.View
            style={[
              tw.style("z-1 absolute bottom-0 right-0 left-0"),
              detailStyle,
            ]}
          >
            <BlurView tint={tint} intensity={85}>
              <NFTDetails nft={nft} />
              <View
                tw={`${
                  bottomPadding && bottomPadding !== 0
                    ? `h-[${bottomPadding - 1}px]`
                    : "h-0"
                }`}
              />
            </BlurView>
          </Reanimated.View>
        </BlurView>
      </LikeContextProvider>
    );
  }
);

const NFTDetails = ({ nft }: { nft: NFT }) => {
  return (
    <View tw="px-4">
      <View tw="h-4" />

      <Creator nft={nft} />

      <View tw="h-4" />

      <Text
        variant="text-2xl"
        tw="dark:text-white"
        numberOfLines={3}
        sx={{ fontSize: 17, lineHeight: 22 }}
      >
        {nft.token_name}
      </Text>

      <View tw="h-4" />

      <View tw="flex-row justify-between">
        <View tw="flex-row">
          <Like nft={nft} />
          <View tw="w-6" />
          <CommentButton nft={nft} />
        </View>

        <View tw="flex-row">
          <Pressable onPress={() => handleShareNFT(nft)}>
            <Share
              height={22}
              width={22}
              // @ts-ignore
              color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
            />
          </Pressable>
          <View tw="w-8" />
          <NFTDropdown nft={nft} />
        </View>
      </View>

      <View tw="h-4" />
    </View>
  );
};
