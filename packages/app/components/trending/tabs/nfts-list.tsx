import { useCallback, forwardRef, useImperativeHandle, useRef } from "react";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { useRouter } from "@showtime-xyz/universal.router";
import { TabInfiniteScrollList } from "@showtime-xyz/universal.tab-view";

import { Card, GAP } from "app/components/card";
import { ListFooter } from "app/components/footer/list-footer";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { NFT } from "app/types";

import { TrendingTabListProps, TrendingTabListRef } from "./";

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
    useImperativeHandle(ref, () => ({
      refresh: mutate,
    }));
    const ListFooterComponent = useCallback(
      () => <ListFooter isLoading={false} />,
      []
    );
    const onItemPress = useCallback(
      (item: NFT, currentIndex: number) => {
        router.push(
          `/${getNFTSlug(
            item
          )}?initialScrollIndex=${currentIndex}&days=${days}&type=trendingNFTs`
        );
      },
      [router, days]
    );

    const renderItem = useCallback(
      ({ item, index }: ListRenderItemInfo<NFT>) => {
        return (
          <Card
            nft={item}
            onPress={() => onItemPress(item, index)}
            numColumns={NUM_COLUMNS}
          />
        );
      },
      [onItemPress]
    );
    const keyExtractor = useCallback((item: NFT) => `${item.nft_id}`, []);

    return (
      <TabInfiniteScrollList
        data={data}
        numColumns={NUM_COLUMNS}
        ref={listRef}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        viewabilityConfig={{ itemVisiblePercentThreshold: 85 }}
        estimatedItemSize={contentWidth / NUM_COLUMNS}
        overscan={{
          main: contentWidth / NUM_COLUMNS,
          reverse: contentWidth / NUM_COLUMNS,
        }}
        style={{ margin: -GAP }}
        ListFooterComponent={ListFooterComponent}
        index={index}
      />
    );
  }
);
