import { useState, useCallback } from "react";
import { ListRenderItemInfo } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { CreatorPreview } from "app/components/creator-preview";
import { useTrendingCreators } from "app/hooks/api-hooks";
import { InfiniteScrollList } from "app/lib/infinite-scroll-list";

import { CARD_DARK_SHADOW, CARD_LIGHT_SHADOW } from "design-system/theme";

import { TrendingMDListProps } from "./trending.md";

// Todo: strengthen the data types
export function TrendingCreatorsList({ days }: TrendingMDListProps) {
  const { data, isLoading } = useTrendingCreators({
    days,
  });

  const router = useRouter();
  const [containerWidth] = useState(0);
  const isDark = useIsDarkMode();

  const keyExtractor = useCallback((item: any) => {
    return item.creator_id;
  }, []);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<any>) => {
      return (
        <View
          tw="mb-8 rounded-lg bg-white dark:bg-black"
          style={{
            // @ts-ignore
            boxShadow: isDark ? CARD_DARK_SHADOW : CARD_LIGHT_SHADOW,
          }}
        >
          <CreatorPreview
            creator={item}
            onMediaPress={(initialScrollIndex: number) => {
              router.push(
                `/list?initialScrollIndex=${initialScrollIndex}&type=trendingCreator&days=${days}&creatorId=${item.profile_id}`
              );
            }}
            mediaSize={containerWidth / 3 - 2}
          />
        </View>
      );
    },
    [containerWidth, days, isDark, router]
  );
  return (
    <InfiniteScrollList
      data={data}
      renderItem={renderItem}
      numColumns={1}
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        isLoading ? (
          <View tw="mx-auto p-10">
            <Spinner />
          </View>
        ) : null
      }
    />
  );
}
