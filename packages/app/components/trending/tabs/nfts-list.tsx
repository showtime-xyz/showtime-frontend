import {
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
} from "react";
import { StyleSheet } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";
import chunk from "lodash/chunk";

import { useRouter } from "@showtime-xyz/universal.router";
import { TabInfiniteScrollList } from "@showtime-xyz/universal.tab-view";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { ListFooter } from "app/components/footer/list-footer";
import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { NFT } from "app/types";

import { TrendingTabListProps, TrendingTabListRef } from "./";

const ViewabilityInfiniteScrollList = withViewabilityInfiniteScrollList(
  TabInfiniteScrollList
);

const NUM_COLUMNS = 3;
export const NFTSList = forwardRef<TrendingTabListRef, TrendingTabListProps>(
  function NFTSList({ days, index }, ref) {
    const router = useRouter();
    const { data, mutate } = useTrendingNFTS({
      days,
    });
    const listRef = useRef(null);
    useScrollToTop(listRef);
    const contentWidth = useContentWidth();
    const chuckList = useMemo(() => {
      return chunk(data, 3);
    }, [data]);

    useImperativeHandle(ref, () => ({
      refresh: mutate,
    }));
    const ListFooterComponent = useCallback(
      () => <ListFooter isLoading={false} />,
      []
    );
    const onItemPress = useCallback(
      (currentIndex: number) => {
        router.push(
          `/list?initialScrollIndex=${currentIndex}&days=${days}&type=trendingNFTs`
        );
      },
      [router, days]
    );

    const renderItem = useCallback(
      ({ item: chuckItem, index: itemIndex }: ListRenderItemInfo<NFT[]>) => {
        return (
          <View tw="flex-row">
            {chuckItem.map((item, chuckItemIndex) => (
              <Card
                key={item.nft_id}
                nft={item}
                onPress={() =>
                  onItemPress(itemIndex * NUM_COLUMNS + chuckItemIndex)
                }
                numColumns={NUM_COLUMNS}
                style={{
                  marginRight: StyleSheet.hairlineWidth,
                  marginBottom: StyleSheet.hairlineWidth,
                }}
              />
            ))}
          </View>
        );
      },
      [onItemPress]
    );
    const keyExtractor = useCallback(
      (_item: NFT[], index: number) => `${index}`,
      []
    );

    return (
      <ViewabilityInfiniteScrollList
        data={chuckList}
        ref={listRef}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        viewabilityConfig={{ itemVisiblePercentThreshold: 85 }}
        estimatedItemSize={contentWidth / NUM_COLUMNS}
        overscan={{
          main: contentWidth / NUM_COLUMNS,
          reverse: contentWidth / NUM_COLUMNS,
        }}
        ListFooterComponent={ListFooterComponent}
        index={index}
      />
    );
  }
);
