import { useCallback, forwardRef, useImperativeHandle, useRef } from "react";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { useRouter } from "@showtime-xyz/universal.router";
import {
  TabFlashListScrollView,
  TabInfiniteScrollList,
} from "@showtime-xyz/universal.tab-view";

import { Card } from "app/components/card";
import { ListFooter } from "app/components/footer/list-footer";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { NFT } from "app/types";

import { TrendingTabListProps, TrendingTabListRef } from "./tab-list";

const NUM_COLUMNS = 3;
export const NFTSList = forwardRef<TrendingTabListRef, TrendingTabListProps>(
  function NFTSList({ days, index }, ref) {
    const router = useRouter();

    const { data, mutate } = useTrendingNFTS({
      days,
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

    const renderItem = useCallback(
      ({ item, index: itemIndex }: ListRenderItemInfo<NFT>) => {
        return (
          <Card
            nft={item}
            numColumns={NUM_COLUMNS}
            onPress={() =>
              router.push(
                `/list?initialScrollIndex=${itemIndex}&days=${days}&type=trendingNFTs`
              )
            }
            href={`/nft/${item.chain_name}/${item.contract_address}/${item.token_id}`}
          />
        );
      },
      [router, days]
    );
    const keyExtractor = useCallback((item: NFT) => `${item.nft_id}`, []);
    const contentWidth = useContentWidth();

    return (
      <TabInfiniteScrollList
        numColumns={NUM_COLUMNS}
        data={data}
        ref={listRef}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={contentWidth / NUM_COLUMNS}
        overscan={{
          main: contentWidth / NUM_COLUMNS,
          reverse: contentWidth / NUM_COLUMNS,
        }}
        renderScrollComponent={TabFlashListScrollView}
        ListFooterComponent={ListFooterComponent}
        index={index}
      />
    );
  }
);
