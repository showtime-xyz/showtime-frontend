import { useCallback } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { tw } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { TrendingMDListProps } from "./trending.md";

export function TrendingNFTSList({ days }: TrendingMDListProps) {
  const { data, isLoading } = useTrendingNFTS({
    days,
  });

  const { width } = useWindowDimensions();
  const contentWidth = useContentWidth();

  const numColumns = width >= breakpoints["lg"] ? 3 : 2;
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT>) => {
      return (
        <View tw="my-4 flex-1 px-2">
          <Card
            href={`/nft/${item.chain_name}/${item.contract_address}/${item.token_id}`}
            key={`nft-list-card-${index}`}
            nft={item}
            numColumns={numColumns}
          />
        </View>
      );
    },
    [numColumns]
  );
  const keyExtractor = useCallback((item: NFT) => {
    return item.nft_id?.toFixed();
  }, []);
  const cardEstimatedSize = contentWidth / numColumns + 156;

  return (
    <InfiniteScrollList
      data={data}
      renderItem={renderItem}
      numColumns={numColumns}
      keyExtractor={keyExtractor}
      overscan={{
        reverse: cardEstimatedSize,
        main: cardEstimatedSize,
      }}
      estimatedItemSize={cardEstimatedSize}
      ListEmptyComponent={
        isLoading ? (
          <View tw="mx-auto p-10">
            <Spinner />
          </View>
        ) : null
      }
      gridItemProps={Platform.select({
        default: null,
        web: { style: tw.style("px-0 md:px-4") },
      })}
    />
  );
}
