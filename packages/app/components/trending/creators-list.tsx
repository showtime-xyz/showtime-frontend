import { useCallback, useMemo, useImperativeHandle, forwardRef } from "react";
import { useWindowDimensions } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { tw } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { CreatorPreview } from "app/components/creator-preview";
import { ListFooter } from "app/components/footer/list-footer";
import { useTrendingCreators } from "app/hooks/api-hooks";
import { DataProvider, LayoutProvider } from "app/lib/recyclerlistview";

import { TabRecyclerList, TabScrollView } from "design-system/tab-view";
import { TabSpinner } from "design-system/tab-view/tab-spinner";

import { EmptyPlaceholder } from "../empty-placeholder";
import { TrendingTabListProps, TrendingTabListRef } from "./tab-list";

export const CreatorsList = forwardRef<
  TrendingTabListRef,
  TrendingTabListProps
>(function CreatorsList({ days, index }, ref) {
  const { data, isLoadingMore, isLoading, refresh, fetchMore } =
    useTrendingCreators({
      days,
    });
  const separatorHeight = 8;
  useImperativeHandle(
    ref,
    () => ({
      refresh,
    }),
    [refresh]
  );
  const ListFooterComponent = useCallback(
    () => <ListFooter isLoading={isLoadingMore} />,
    [isLoadingMore]
  );

  const ItemSeparatorComponent = useCallback(
    () => (
      <View
        tw={`bg-gray-200 dark:bg-gray-800`}
        style={{ height: separatorHeight }}
      />
    ),
    []
  );

  const { width, height } = useWindowDimensions();
  const router = useRouter();

  let dataProvider = useMemo(
    () =>
      new DataProvider((r1, r2) => {
        return typeof r1 === "string" && typeof r2 === "string"
          ? r1 !== r2
          : r1.profile_id !== r2.profile_id;
      }).cloneWithRows(data),
    [data]
  );

  const mediaDimension = useWindowDimensions().width / 3;
  const cardSize = 64 + mediaDimension + 16;

  const cardHeight = cardSize + separatorHeight;

  const _layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        () => {
          return "item";
        },
        (_type, dim) => {
          dim.width = width;
          dim.height = cardHeight;
        }
      ),
    [width, cardHeight]
  );

  const _rowRenderer = useCallback(
    (_type: any, item: any) => {
      return (
        <>
          <CreatorPreview
            creator={item}
            onMediaPress={(initialScrollIndex: number) => {
              router.push(
                `/list?initialScrollIndex=${initialScrollIndex}&type=trendingCreator&days=${days}&creatorId=${item.profile_id}`
              );
            }}
            mediaSize={mediaDimension}
          />
          <ItemSeparatorComponent />
        </>
      );
    },
    [ItemSeparatorComponent, days, router, mediaDimension]
  );

  const layoutSize = useMemo(
    () => ({
      width,
      height,
    }),
    [width, height]
  );
  if (isLoading) {
    return <TabSpinner index={index} />;
  }

  if (data.length === 0 && !isLoading) {
    return (
      <TabScrollView
        contentContainerStyle={tw.style("mt-12 items-center")}
        index={index}
      >
        <EmptyPlaceholder title="No results found" hideLoginBtn />
      </TabScrollView>
    );
  }
  // Todo: replace to TabInfiniteScrollList when re-enabled this page.
  return (
    <TabRecyclerList
      layoutProvider={_layoutProvider}
      dataProvider={dataProvider}
      rowRenderer={_rowRenderer}
      onEndReached={fetchMore}
      layoutSize={layoutSize}
      style={{ flex: 1 }}
      renderFooter={ListFooterComponent}
      index={index}
    />
  );
});
