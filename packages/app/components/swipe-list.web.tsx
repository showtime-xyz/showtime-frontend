import { useCallback, useMemo, useRef } from "react";
import { Dimensions, useWindowDimensions } from "react-native";

import { Virtual, Mousewheel } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { FeedItem } from "app/components/feed-item";
import { VideoConfigContext } from "app/context/video-config-context";
import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import type { NFT } from "app/types";

const { height: screenHeight } = Dimensions.get("screen");

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

export const SwipeList = ({
  data,
  fetchMore,
  isRefreshing = false,
  refresh,
  initialScrollIndex = 0,
  bottomPadding = 0,
}: Props) => {
  const listRef = useRef<any>(null);
  const headerHeight = useHeaderHeight();
  useScrollToTop(listRef);
  const { height: safeAreaFrameHeight } = useSafeAreaFrame();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const momentumScrollCallback = useRef(undefined);
  const setMomentumScrollCallback = useCallback((cb: any) => {
    momentumScrollCallback.current = cb;
  }, []);

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
    <View testID="swipeList" nativeID="slidelist" tw="h-screen overflow-hidden">
      <VideoConfigContext.Provider value={videoConfig}>
        <Swiper
          modules={[Virtual, Mousewheel]}
          height={windowHeight}
          width={windowWidth}
          slidesPerView={1}
          virtual
          direction="vertical"
          mousewheel
        >
          {data.map((item, index) => (
            <SwiperSlide key={item.nft_id} virtualIndex={index}>
              <FeedItem
                nft={item}
                {...{
                  itemHeight: windowHeight,
                  bottomPadding,
                  setMomentumScrollCallback,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </VideoConfigContext.Provider>
    </View>
  );
};
