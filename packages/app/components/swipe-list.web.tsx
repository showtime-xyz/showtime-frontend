import { useCallback, useMemo, useRef, createContext, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useSharedValue } from "react-native-reanimated";
import { Virtual, Keyboard, Mousewheel } from "swiper";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";

import { useRouter } from "@showtime-xyz/universal.router";
import { clamp } from "@showtime-xyz/universal.utils";
import { View } from "@showtime-xyz/universal.view";

import { FeedItem } from "app/components/feed-item";
import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/components/viewability-tracker-flatlist";
import { VideoConfigContext } from "app/context/video-config-context";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { createParam } from "app/navigation/use-param";
import type { NFT } from "app/types";
import { isMobileWeb, isSafari } from "app/utilities";

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

  const onRealIndexChange = useCallback(
    (e: SwiperClass) => {
      if (
        e.activeIndex !== 0 &&
        !isSwiped.current &&
        router.pathname === "/" &&
        isSafari()
      ) {
        // change URL is for hide smart app banner on Safari when swipe once
        window.history.replaceState(null, "", "foryou");
        isSwiped.current = true;
      }
      visibleItems.value = [
        e.previousIndex,
        e.activeIndex,
        e.activeIndex + 1 < data.length ? e.activeIndex + 1 : undefined,
      ];
      if (isSwipeListScreen) {
        router.replace(
          {
            pathname: "/profile/[username]/[dropSlug]",
            query: {
              ...router.query,
              initialScrollIndex: e.activeIndex,
              username: data[e.activeIndex].creator_username,
              dropSlug: data[e.activeIndex].slug,
            },
          },
          getNFTSlug(data[e.activeIndex]),
          { shallow: true }
        );
      }
      setActiveIndex(e.activeIndex);
    },
    [visibleItems, data, router, isSwipeListScreen]
  );

  if (data.length === 0) return null;

  return (
    <View
      testID="swipeList"
      id="slidelist"
      tw="fixed inset-0 h-screen overflow-hidden bg-gray-100 dark:bg-black"
    >
      <VideoConfigContext.Provider value={videoConfig}>
        <SwiperActiveIndexContext.Provider value={activeIndex}>
          <ViewabilityItemsContext.Provider value={visibleItems}>
            <Swiper
              modules={[Virtual, Keyboard, Mousewheel]}
              height={windowHeight}
              width={windowWidth}
              keyboard
              initialSlide={clamp(initialScrollIndex, 0, data.length - 1)}
              virtual={{
                enabled: true,
                addSlidesBefore: 1,
                addSlidesAfter: 2,
                cache: false,
              }}
              direction="vertical"
              onRealIndexChange={onRealIndexChange}
              onReachEnd={fetchMore}
              threshold={isMobileWeb() ? 0 : 25}
              noSwiping
              noSwipingClass="swiper-no-swiping"
              mousewheel={{
                noMousewheelClass: "swiper-no-swiping",
                sensitivity: 1.1,
                thresholdTime: 600,
              }}
            >
              {data.map((item, index) => (
                <SwiperSlide key={item.nft_id} virtualIndex={index}>
                  <ItemKeyContext.Provider value={index}>
                    <FeedItem nft={item} itemHeight={windowHeight} />
                  </ItemKeyContext.Provider>
                </SwiperSlide>
              ))}
            </Swiper>
          </ViewabilityItemsContext.Provider>
        </SwiperActiveIndexContext.Provider>
      </VideoConfigContext.Provider>
    </View>
  );
};
