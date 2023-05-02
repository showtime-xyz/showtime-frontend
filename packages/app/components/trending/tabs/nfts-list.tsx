import { useCallback, forwardRef, useImperativeHandle, useRef } from "react";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { useRouter } from "@showtime-xyz/universal.router";
import {
  TabInfiniteScrollList,
  TabSpinner,
} from "@showtime-xyz/universal.tab-view";

import { GAP } from "app/components/card";
import { ListCard } from "app/components/card/list-card";
import { ListFooter } from "app/components/footer/list-footer";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { NFT } from "app/types";

import { TrendingTabListProps, TrendingTabListRef } from "./";

export const NFTSList = forwardRef<TrendingTabListRef, TrendingTabListProps>(
  function NFTSList({ filter, index }, ref) {
    const router = useRouter();
    const { data, mutate, isLoading } = useTrendingNFTS({
      filter,
    });
    const listRef = useRef(null);
    useScrollToTop(listRef);
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
          `${getNFTSlug(
            item
          )}?initialScrollIndex=${currentIndex}&filter=${filter}&type=trendingNFTs`
        );
      },
      [router, filter]
    );

    const renderItem = useCallback(
      ({ item, index }: ListRenderItemInfo<NFT>) => {
        return (
          <ListCard
            nft={item}
            index={index}
            onPress={() => onItemPress(item, index)}
          />
        );
      },
      [onItemPress]
    );
    const keyExtractor = useCallback((item: NFT) => `${item.nft_id}`, []);
    if (isLoading) {
      return <TabSpinner index={index} />;
    }
    return (
      <TabInfiniteScrollList
        data={data}
        ref={listRef}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        viewabilityConfig={{ itemVisiblePercentThreshold: 85 }}
        estimatedItemSize={200}
        style={{ margin: -GAP }}
        ListFooterComponent={ListFooterComponent}
        index={index}
      />
    );
  }
);
