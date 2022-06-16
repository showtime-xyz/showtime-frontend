import { useCallback, useMemo, useImperativeHandle, forwardRef } from "react";
import { useWindowDimensions } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { CreatorPreview } from "app/components/creator-preview";
import { ListFooter } from "app/components/footer/list-footer";
import { useTrendingCreators } from "app/hooks/api-hooks";
import { DataProvider, LayoutProvider } from "app/lib/recyclerlistview";
import { useRouter } from "app/navigation/use-router";

import { TabRecyclerList } from "design-system/tab-view";

import { ListHeader } from "./list-header";
import { TrendingTabListProps, TrendingTabListRef } from "./tab-list";

const LIST_HEADER_HEIGHT = 64;

export const CreatorsList = forwardRef<
  TrendingTabListRef,
  TrendingTabListProps
>(function CreatorsList({ days, SelectionControl, index }, ref) {
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
    () => <View tw={`bg-gray-200 dark:bg-gray-800 h-[${separatorHeight}px]`} />,
    []
  );

  const ListHeaderComponent = useCallback(
    () => (
      <ListHeader
        isLoading={isLoading}
        SelectionControl={SelectionControl}
        length={data?.length}
      />
    ),
    [SelectionControl, data, isLoading]
  );

  const { width } = useWindowDimensions();
  const router = useRouter();

  const newData = useMemo(() => ["header", ...data], [data]);

  let dataProvider = useMemo(
    () =>
      new DataProvider((r1, r2) => {
        return typeof r1 === "string" && typeof r2 === "string"
          ? r1 !== r2
          : r1.profile_id !== r2.profile_id;
      }).cloneWithRows(newData),
    [newData]
  );

  const mediaDimension = useWindowDimensions().width / 3;
  const cardSize = 64 + mediaDimension + 16;

  const cardHeight = cardSize + separatorHeight;

  const _layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        (index) => {
          if (index === 0) {
            return "header";
          }

          return "item";
        },
        (_type, dim) => {
          if (_type === "item") {
            dim.width = width;
            dim.height = cardHeight;
          } else if (_type === "header") {
            dim.width = width;
            dim.height = LIST_HEADER_HEIGHT;
          }
        }
      ),
    [width, cardHeight]
  );

  const _rowRenderer = useCallback(
    (_type: any, item: any) => {
      if (_type === "header") {
        return <ListHeaderComponent />;
      }

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
    [ItemSeparatorComponent, ListHeaderComponent, days, router, mediaDimension]
  );

  return (
    <View tw="flex-1 bg-white dark:bg-black">
      <TabRecyclerList
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={_rowRenderer}
        onEndReached={fetchMore}
        style={{ flex: 1 }}
        renderFooter={ListFooterComponent}
        index={index}
      />
    </View>
  );
});
