import { useCallback, useMemo, useRef, createContext, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import { useSharedValue } from "react-native-reanimated";
import "swiper/css";
import "swiper/css/virtual";

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
  const listRef = useRef<HTMLDivElement>(null);
  const [initialParamProp] = useParam("initialScrollIndex");
  const isSwipeListScreen = typeof initialParamProp !== "undefined";

  const visibleItems = useSharedValue<any[]>([
    undefined,
    initialScrollIndex,
    initialScrollIndex + 1 < data.length ? initialScrollIndex + 1 : undefined,
  ]);
  const { height: windowHeight } = useWindowDimensions();
  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  const onScrollChange = useCallback(
    (e: Virtualizer<HTMLDivElement, Element>) => {
      const previousIndex = clamp(
        Math.floor(e.scrollOffset / windowHeight) - 1,
        0,
        data.length - 1
      );
      const activeIndex = Math.floor(e.scrollOffset / windowHeight);
      if (isSwipeListScreen) {
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
      }
      visibleItems.value = [
        previousIndex,
        activeIndex,
        activeIndex + 1 < data.length ? activeIndex + 1 : undefined,
      ];
    },
    [windowHeight, data, isSwipeListScreen, visibleItems, router]
  );

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => windowHeight,
    initialOffset: initialScrollIndex * windowHeight,
    overscan: 10,
    onChange: onScrollChange,
  });

  if (data.length === 0) return null;

  return (
    <View testID="swipeList" id="slidelist" tw="bg-gray-100 dark:bg-black">
      <VideoConfigContext.Provider value={videoConfig}>
        <ViewabilityItemsContext.Provider value={visibleItems}>
          <div
            ref={listRef}
            className="max-h-[100svh] min-h-[100dvh] snap-y snap-mandatory overflow-y-scroll"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
              className="relative w-full"
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                <div
                  key={virtualItem.key}
                  style={{
                    transform: `translateY(${virtualItem.start}px)`,
                    height: `${virtualItem.size}px`,
                  }}
                  className="absolute left-0 top-0 w-full snap-start snap-always"
                >
                  <ItemKeyContext.Provider value={virtualItem.index}>
                    <FeedItem
                      nft={data[virtualItem.index]}
                      itemHeight={windowHeight}
                    />
                  </ItemKeyContext.Provider>
                </div>
              ))}
            </div>
          </div>
        </ViewabilityItemsContext.Provider>
      </VideoConfigContext.Provider>
    </View>
  );
};
