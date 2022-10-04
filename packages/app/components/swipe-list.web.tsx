import { useCallback, useMemo, useRef, createContext, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useSharedValue } from "react-native-reanimated";
import { Virtual, Keyboard } from "swiper";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";

import { clamp } from "@showtime-xyz/universal.utils";
import { View } from "@showtime-xyz/universal.view";

import { FeedItem } from "app/components/feed-item";
import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/components/viewability-tracker-flatlist";
import { VideoConfigContext } from "app/context/video-config-context";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { createParam } from "app/navigation/use-param";
import type { NFT } from "app/types";
import { isMobileWeb } from "app/utilities";

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
  // Todo: use nft_id instead of initialScrollIndex navigate to specific NFT
  // const [id, setId] = useParam("id");
  const [, setInitialScrollIndex] = useParam("initialScrollIndex");

  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<any>(null);
  useScrollToTop(listRef);

  const visibleItems = useSharedValue<number[]>([]);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  // const initialSlideIndex = useMemo(() => {
  //   const defaultIndex = clamp(initialScrollIndex, 0, data.length - 1);
  //   if (!id) return defaultIndex;
  //   const index = data.findIndex((item) => item.nft_id.toString() === id);
  //   return index > -1 ? index : defaultIndex;
  // }, [id, initialScrollIndex, data]);

  const onRealIndexChange = useCallback(
    (e: SwiperClass) => {
      visibleItems.value = [e.previousIndex, e.activeIndex];
      setInitialScrollIndex(e.activeIndex.toString());
      // const id = data[e.activeIndex].nft_id.toString();
      // id && setId(id);
      setActiveIndex(e.activeIndex);
    },
    [visibleItems, setInitialScrollIndex]
  );

  if (data.length === 0) return null;

  return (
    <View testID="swipeList" nativeID="slidelist" tw="h-screen overflow-hidden">
      <VideoConfigContext.Provider value={videoConfig}>
        <SwiperActiveIndexContext.Provider value={activeIndex}>
          <ViewabilityItemsContext.Provider value={visibleItems}>
            <Swiper
              modules={[Virtual, Keyboard]}
              height={windowHeight}
              width={windowWidth}
              keyboard
              initialSlide={clamp(initialScrollIndex, 0, data.length - 1)}
              virtual
              direction="vertical"
              onRealIndexChange={onRealIndexChange}
              onReachEnd={fetchMore}
              threshold={isMobileWeb() ? 0 : 25}
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
