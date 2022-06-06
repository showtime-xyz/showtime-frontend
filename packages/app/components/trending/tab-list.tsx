import {
  Suspense,
  useCallback,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useWindowDimensions } from "react-native";

import { SegmentedControl } from "@showtime-xyz/universal.segmented-control";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { CreatorPreview } from "app/components/creator-preview";
import { ErrorBoundary } from "app/components/error-boundary";
import { ListFooter } from "app/components/footer/list-footer";
import { useTrendingCreators, useTrendingNFTS } from "app/hooks/api-hooks";
import { useNFTCardsListLayoutProvider } from "app/hooks/use-nft-cards-list-layout-provider";
import { Haptics } from "app/lib/haptics";
import { DataProvider, LayoutProvider } from "app/lib/recyclerlistview";
import { useRouter } from "app/navigation/use-router";

import { TabRecyclerList } from "design-system/tab-view";

import { ListHeader } from "./list-header";

const LIST_HEADER_HEIGHT = 64;

export type TrendingTabListRef = {
  refresh: () => void;
};
type TrendingTabListProps = {
  days: number;
  SelectionControl?: JSX.Element;
  index: number;
};

const TabListContainer = forwardRef<TrendingTabListRef, TrendingTabListProps>(
  function TabListContainer({ days, index }, ref) {
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
      (index: number) => {
        Haptics.impactAsync();
        setSelected(index);
      },
      [setSelected]
    );

    const SelectionControl = useMemo(
      () => (
        <SegmentedControl
          values={["CREATOR", "NFT"]}
          onChange={handleTabChange}
          selectedIndex={selected}
        />
      ),
      [selected, handleTabChange]
    );

    return useMemo(
      () =>
        [
          <ErrorBoundary key="error-boundary-1">
            <Suspense
              fallback={
                <ListHeader
                  isLoading={true}
                  SelectionControl={SelectionControl}
                  length={0}
                />
              }
            >
              <CreatorsList
                days={days}
                index={index}
                SelectionControl={SelectionControl}
                ref={ref}
              />
            </Suspense>
          </ErrorBoundary>,
          <ErrorBoundary key="error-boundary-2">
            <Suspense
              fallback={
                <ListHeader
                  isLoading={true}
                  SelectionControl={SelectionControl}
                  length={0}
                />
              }
            >
              <NFTSList
                days={days}
                index={index}
                SelectionControl={SelectionControl}
                ref={ref}
              />
            </Suspense>
          </ErrorBoundary>,
        ][selected],
      [SelectionControl, days, index, ref, selected]
    );
  }
);

const CreatorsList = forwardRef<TrendingTabListRef, TrendingTabListProps>(
  function CreatorsList({ days, SelectionControl, index }, ref) {
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
        <View tw={`bg-gray-200 dark:bg-gray-800 h-[${separatorHeight}px]`} />
      ),
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
      [
        ItemSeparatorComponent,
        ListHeaderComponent,
        days,
        router,
        mediaDimension,
      ]
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
  }
);

const GAP_BETWEEN_ITEMS = 1;

const NFTSList = forwardRef<TrendingTabListRef, TrendingTabListProps>(
  function NFTSList({ days, SelectionControl, index }, ref) {
    const router = useRouter();
    const { data, isLoadingMore, isLoading, refresh, fetchMore } =
      useTrendingNFTS({
        days,
      });
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
    const newData = useMemo(() => ["header", ...data], [data]);

    const numColumns = 3;

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

    let dataProvider = useMemo(
      () =>
        new DataProvider((r1, r2) => {
          return r1.profile_id !== r2.profile_id;
        }).cloneWithRows(newData),
      [newData]
    );

    const _layoutProvider = useNFTCardsListLayoutProvider({ newData });

    const _rowRenderer = useCallback(
      (_type: any, item: any, index: number) => {
        if (_type === "header") {
          return <ListHeaderComponent />;
        }

        return (
          <Card
            nft={item}
            numColumns={numColumns}
            onPress={() =>
              router.push(
                `/list?initialScrollIndex=${
                  // index - 1 because header takes the initial index!
                  index - 1
                }&days=${days}&type=trendingNFTs`
              )
            }
          />
        );
      },
      [ListHeaderComponent, router, days]
    );

    return (
      <View tw="flex-1 bg-white dark:bg-black">
        <TabRecyclerList
          layoutProvider={_layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={_rowRenderer}
          style={useMemo(() => ({ margin: -GAP_BETWEEN_ITEMS }), [])}
          onEndReached={fetchMore}
          renderFooter={ListFooterComponent}
          index={index}
        />
      </View>
    );
  }
);
export { TabListContainer };
