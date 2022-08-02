import { useCallback, useMemo, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  useWindowDimensions,
} from "react-native";

import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";

import { FeedItem } from "app/components/feed-item";
import { VideoConfigContext } from "app/context/video-config-context";
import { useUser } from "app/hooks/use-user";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useNavigation, useScrollToTop } from "app/lib/react-navigation/native";
import type { NFT } from "app/types";

import { ViewabilityTrackerFlashList } from "./viewability-tracker-flash-list";

const { height: screenHeight } = Dimensions.get("screen");
const MOBILE_WEB_TABS_HEIGHT = 50;
const MOBILE_WEB_BOTTOM_NAV_HEIGHT = 64;

type Props = {
  data: NFT[];
  fetchMore?: () => void;
  isRefreshing?: boolean;
  refresh?: () => void;
  initialScrollIndex?: number;
  bottomPadding?: number;
  listId?: number;
};

export const SwipeList = ({
  data,
  fetchMore,
  isRefreshing = false,
  refresh,
  initialScrollIndex = 0,
  bottomPadding = 0,
  listId,
}: Props) => {
  const { isAuthenticated } = useUser();
  const listRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight();
  useScrollToTop(listRef);
  const navigation = useNavigation();
  const { height: safeAreaFrameHeight } = useSafeAreaFrame();
  const { height: windowHeight } = useWindowDimensions();

  const itemHeight =
    Platform.OS === "web"
      ? windowHeight -
        headerHeight -
        (isAuthenticated
          ? MOBILE_WEB_BOTTOM_NAV_HEIGHT + MOBILE_WEB_TABS_HEIGHT
          : 0)
      : Platform.OS === "android"
      ? safeAreaFrameHeight - headerHeight
      : screenHeight;

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

  const renderItem = useCallback(
    ({ item }: { item: NFT }) => (
      <FeedItem
        nft={item}
        {...{
          itemHeight,
          bottomPadding,
          detailStyle,
          toggleHeader,
          hideHeader,
          showHeader,
          listId,
        }}
      />
    ),
    [
      itemHeight,
      bottomPadding,
      detailStyle,
      toggleHeader,
      hideHeader,
      showHeader,
      listId,
    ]
  );

  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  const extendedState = useMemo(() => ({ bottomPadding }), [bottomPadding]);

  if (data.length === 0) return null;

  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <ViewabilityTrackerFlashList
        data={data}
        onEndReached={fetchMore}
        initialScrollIndex={initialScrollIndex}
        showsVerticalScrollIndicator={false}
        ref={listRef}
        onRefresh={refresh}
        extraData={extendedState}
        onMomentumScrollEnd={showHeader}
        refreshing={isRefreshing}
        pagingEnabled
        renderItem={renderItem}
        estimatedItemSize={itemHeight}
      />
    </VideoConfigContext.Provider>
  );
};
