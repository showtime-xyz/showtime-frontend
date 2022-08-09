import { useCallback, useMemo, forwardRef, useImperativeHandle } from "react";

import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { ListFooter } from "app/components/footer/list-footer";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useNFTCardsListLayoutProvider } from "app/hooks/use-nft-cards-list-layout-provider";
import { DataProvider } from "app/lib/recyclerlistview";

import { TabRecyclerList } from "design-system/tab-view";

import { TrendingTabListProps, TrendingTabListRef } from "./tab-list";

const GAP_BETWEEN_ITEMS = 1;

export const NFTSList = forwardRef<TrendingTabListRef, TrendingTabListProps>(
  function NFTSList({ days, index }, ref) {
    const router = useRouter();
    const { data, mutate } = useTrendingNFTS({
      days,
    });
    useImperativeHandle(ref, () => ({
      refresh: mutate,
    }));
    const ListFooterComponent = useCallback(
      () => <ListFooter isLoading={false} />,
      []
    );

    const numColumns = 3;

    let dataProvider = useMemo(
      () =>
        new DataProvider((r1, r2) => {
          return r1.profile_id !== r2.profile_id;
        }).cloneWithRows(data),
      [data]
    );

    const _layoutProvider = useNFTCardsListLayoutProvider({ newData: data });

    const _rowRenderer = useCallback(
      (_type: any, item: any, index: number) => {
        return (
          <Card
            nft={item}
            numColumns={numColumns}
            onPress={() =>
              router.push(
                `/list?initialScrollIndex=${index}&days=${days}&type=trendingNFTs`
              )
            }
            href={`/nft/${item.chain_name}/${item.contract_address}/${item.token_id}`}
          />
        );
      },
      [router, days]
    );

    return (
      <View tw="flex-1 bg-white dark:bg-black">
        {dataProvider && dataProvider.getSize() > 0 && (
          <TabRecyclerList
            layoutProvider={_layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={_rowRenderer}
            style={{ margin: -GAP_BETWEEN_ITEMS }}
            renderFooter={ListFooterComponent}
            index={index}
          />
        )}
      </View>
    );
  }
);
