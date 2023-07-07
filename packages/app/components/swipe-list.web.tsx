import {
  useCallback,
  useMemo,
  useRef,
  createContext,
  useState,
  useLayoutEffect,
} from "react";
import { useWindowDimensions } from "react-native";

import throttle from "lodash/throttle";
import { useSharedValue } from "react-native-reanimated";
import "swiper/css";
import "swiper/css/virtual";
import { Virtual, Keyboard, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useWebScroll } from "@showtime-xyz/universal.hooks";
import {
  InfiniteScrollList,
  ListRenderItem,
  ListRenderItemInfo,
} from "@showtime-xyz/universal.infinite-scroll-list";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { clamp } from "@showtime-xyz/universal.utils";
import { View } from "@showtime-xyz/universal.view";

import { FeedItem } from "app/components/feed-item";
import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/components/viewability-tracker-flatlist";
import { VideoConfigContext } from "app/context/video-config-context";
import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { createParam } from "app/navigation/use-param";
import type { NFT } from "app/types";
import { isMobileWeb, isSafari } from "app/utilities";

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);
type Props = {
  data: NFT[];
  fetchMore?: () => void;
  isRefreshing?: boolean;
  refresh?: () => void;
  initialScrollIndex?: number;
  bottomPadding?: number;
};
const { useParam } = createParam();

export const SwiperActiveIndexContext = createContext<number>(0);
export const SwipeList = ({
  data,
  fetchMore,
  initialScrollIndex = 0,
}: Props) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<any>(null);
  useScrollToTop(listRef);
  const [initialParamProp] = useParam("initialScrollIndex");
  const isSwipeListScreen = typeof initialParamProp !== "undefined";
  const isSwiped = useRef(false);

  const visibleItems = useSharedValue<any[]>([
    undefined,
    initialScrollIndex,
    initialScrollIndex + 1 < data.length ? initialScrollIndex + 1 : undefined,
  ]);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );
  useLayoutEffect(() => {
    listRef.current?.scrollTo(0, initialScrollIndex * windowHeight);
  }, [initialScrollIndex, windowHeight]);
  // const onRealIndexChange = useCallback(() => {
  //   const offsetY = listRef.current?.getBoundingClientRect()?.y;
  //   const previousIndex = 0;
  //   const activeIndex = 0;

  //   if (
  //     activeIndex !== 0 &&
  //     !isSwiped.current &&
  //     router.pathname === "/" &&
  //     isSafari()
  //   ) {
  //     // change URL is for hide smart app banner on Safari when swipe once
  //     window.history.replaceState(null, "", "foryou");
  //     isSwiped.current = true;
  //   }
  //   visibleItems.value = [
  //     previousIndex,
  //     activeIndex,
  //     activeIndex + 1 < data.length ? activeIndex + 1 : undefined,
  //   ];
  //   if (isSwipeListScreen) {
  //     router.replace(
  //       {
  //         pathname: "/profile/[username]/[dropSlug]",
  //         query: {
  //           ...router.query,
  //           initialScrollIndex: activeIndex,
  //           username: data[activeIndex].creator_username,
  //           dropSlug: data[activeIndex].slug,
  //         },
  //       },
  //       getNFTSlug(data[activeIndex]),
  //       { shallow: true }
  //     );
  //   }
  //   setActiveIndex(activeIndex);
  // }, [visibleItems, data, router, isSwipeListScreen]);

  // useWebScroll(listRef, onRealIndexChange);
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT>) => {
      return (
        <View key={item.nft_id} tw="snap-start snap-always">
          <ItemKeyContext.Provider value={index}>
            <FeedItem nft={item} itemHeight={windowHeight} />
          </ItemKeyContext.Provider>
        </View>
      );
    },
    [windowHeight]
  );
  const keyExtractor = useCallback((item: NFT) => `${item.nft_id}`, []);
  if (data.length === 0) return null;

  return (
    <View
      testID="swipeList"
      id="slidelist"
      tw="max-h-[100svh] min-h-[100dvh] snap-y snap-mandatory overflow-y-auto bg-gray-100 dark:bg-black"
      ref={listRef}
    >
      <VideoConfigContext.Provider value={videoConfig}>
        <SwiperActiveIndexContext.Provider value={activeIndex}>
          <ViewabilityItemsContext.Provider value={visibleItems}>
            <ViewabilityInfiniteScrollList
              data={data}
              useWindowScroll
              renderItem={renderItem}
              estimatedItemSize={64}
              keyExtractor={keyExtractor}
              overscan={8}
            />
          </ViewabilityItemsContext.Provider>
        </SwiperActiveIndexContext.Provider>
      </VideoConfigContext.Provider>
    </View>
  );
};
