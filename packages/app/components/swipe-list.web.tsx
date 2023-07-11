import { useCallback, useMemo, useRef, createContext, useEffect } from "react";
import { useWindowDimensions } from "react-native";

import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import { useSharedValue } from "react-native-reanimated";
import "swiper/css";
import "swiper/css/virtual";

import { useRouter } from "@showtime-xyz/universal.router";
import { clamp } from "@showtime-xyz/universal.utils";

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
  const initialOffset = initialScrollIndex * windowHeight;
  const scrollTimer = useRef<any>(null);
  const onScrollChange = useCallback(
    (e: Virtualizer<HTMLDivElement, Element>) => {
      clearTimeout(scrollTimer.current);
      const activeIndex = Math.round(e.scrollOffset / windowHeight);
      const previousIndex = clamp(activeIndex - 1, 0, data.length - 1);

      visibleItems.value = [
        previousIndex,
        activeIndex,
        activeIndex + 1 < data.length ? activeIndex + 1 : undefined,
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
    },
    [windowHeight, data, visibleItems, isSwipeListScreen, router]
  );

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => windowHeight,
    initialOffset: initialOffset,
    overscan: 8,
    onChange: onScrollChange,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) {
      return;
    }
    if (data && data?.length > 0 && lastItem.index >= data.length - 1) {
      fetchMore?.();
    }
  }, [data, fetchMore, rowVirtualizer]);

  if (data.length === 0) return null;

  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <ViewabilityItemsContext.Provider value={visibleItems}>
        <div
          ref={listRef}
          className="max-h-[100svh] min-h-[100dvh] snap-y snap-mandatory overflow-y-scroll"
          id="slidelist"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
            className="relative w-full"
          >
            {rowVirtualizer?.getVirtualItems().map((virtualItem) => (
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
  );
};
