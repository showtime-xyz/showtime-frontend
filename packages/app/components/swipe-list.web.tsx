import {
  useCallback,
  useMemo,
  useRef,
  createContext,
  useState,
  Ref,
} from "react";
import { useWindowDimensions } from "react-native";

import { useSharedValue } from "react-native-reanimated";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/virtual";
import { Virtual, Keyboard, Mousewheel } from "swiper/modules";
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
  const [initialParamProp] = useParam("initialScrollIndex");
  const isSwipeListScreen = typeof initialParamProp !== "undefined";
  const isSwiped = useRef(false);
  const swiper = useRef<any>(null);

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

  const scrollTimer = useRef<any>(null);
  const onRealIndexChange = useCallback(
    (e: SwiperClass) => {
      clearTimeout(scrollTimer.current);
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
        scrollTimer.current = setTimeout(() => {
          router.replace(
            {
              pathname: "/profile/[username]/[dropSlug]",
              query: {
                ...router.query,
                initialScrollIndex: activeIndex,
                username: data[activeIndex].creator_username,
                dropSlug: data[activeIndex].slug,
              },
            },
            getNFTSlug(data[activeIndex]),
            { shallow: true }
          );
        }, 700);
      }
      setActiveIndex(e.activeIndex);
    },
    [router, visibleItems, data, isSwipeListScreen, activeIndex]
  );

  if (data.length === 0) return null;

  return (
    <View
      testID="swipeList"
      id="slidelist"
      tw="h-screen overflow-hidden bg-gray-100 dark:bg-black"
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
                thresholdTime: 800,
              }}
              className="w-full"
              ref={swiper}
            >
              {data.map((item, index) => (
                <SwiperSlide key={item.nft_id} virtualIndex={index}>
                  <ItemKeyContext.Provider value={index}>
                    <FeedItem
                      nft={item}
                      itemHeight={windowHeight}
                      slideToNext={() => {
                        swiper.current?.swiper.slideTo(
                          Math.min(activeIndex + 1, data.length)
                        );
                      }}
                      slideToPrev={() => {
                        swiper.current?.swiper?.slideTo(
                          Math.max(activeIndex - 1, 0)
                        );
                      }}
                      listLength={data.length}
                    />
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
