import { Suspense, useCallback, useMemo, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { ErrorBoundary } from "app/components/error-boundary";
import { useTrendingCreators, useTrendingNFTS } from "app/hooks/api-hooks";
import { useNFTCardsListLayoutProvider } from "app/hooks/use-nft-cards-list-layout-provider";
import { TAB_LIST_HEIGHT } from "app/lib/constants";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { DataProvider, LayoutProvider } from "app/lib/recyclerlistview";
import { useRouter } from "app/navigation/use-router";

import {
  CreatorPreview,
  SegmentedControl,
  SelectedTabIndicator,
  Spinner,
  TabItem,
  Tabs,
  Text,
  View,
} from "design-system";
import { Card } from "design-system/card";
import { useIsDarkMode } from "design-system/hooks";
import { tw } from "design-system/tailwind";

const LIST_HEADER_HEIGHT = 64;
const LIST_FOOTER_HEIGHT = 80;

const ListFooter = ({ isLoading }: { isLoading: boolean }) => {
  const tabBarHeight = useBottomTabBarHeight();

  if (isLoading) {
    return (
      <View
        tw={`mt-6 items-center justify-center px-3`}
        sx={{ marginBottom: tabBarHeight, height: LIST_FOOTER_HEIGHT }}
      >
        <Spinner size="small" />
      </View>
    );
  }

  return <View sx={{ marginBottom: tabBarHeight }}></View>;
};

const ListHeader = ({ isLoading, SelectionControl, data }: any) => (
  <View
    tw="border-gray-100 p-4 dark:border-gray-900"
    style={{ borderBottomWidth: 1 }}
  >
    {SelectionControl}
    {data.length === 0 && !isLoading ? (
      <View tw="mt-20 items-center justify-center">
        <Text tw="text-gray-900 dark:text-white">No results found</Text>
      </View>
    ) : isLoading ? (
      <View tw="mt-20 items-center justify-center">
        <Spinner size="small" />
      </View>
    ) : null}
  </View>
);

export const Trending = () => {
  const [selected, setSelected] = useState(0);
  const isDark = useIsDarkMode();
  const headerHeight = useHeaderHeight();
  const isWeb = Platform.OS === "web";

  return (
    <View tw="flex-1 bg-white dark:bg-black">
      <Tabs.Root onIndexChange={setSelected} initialIndex={selected} lazy>
        <Tabs.Header>
          {Platform.OS === "ios" && <View tw={`h-[${headerHeight}px]`} />}
          <View tw="flex-row justify-between bg-white py-2 px-4 dark:bg-black">
            <Text tw="text-2xl font-extrabold text-gray-900 dark:text-white">
              Trending
            </Text>
          </View>
        </Tabs.Header>
        <Tabs.List
          style={useMemo(
            () => ({
              height: TAB_LIST_HEIGHT,
              ...tw.style(
                "dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900 w-screen"
              ),
            }),
            [isDark]
          )}
          contentContainerStyle={tw.style("w-full")}
        >
          <Tabs.Trigger style={isWeb ? { height: "100%" } : { flex: 1 }}>
            <TabItem name="Today" selected={selected === 0} />
          </Tabs.Trigger>

          <Tabs.Trigger style={isWeb ? { height: "100%" } : { flex: 1 }}>
            <TabItem name="This week" selected={selected === 1} />
          </Tabs.Trigger>

          <Tabs.Trigger style={isWeb ? { height: "100%" } : { flex: 1 }}>
            <TabItem name="This month" selected={selected === 2} />
          </Tabs.Trigger>

          <SelectedTabIndicator />
        </Tabs.List>
        <Tabs.Pager>
          <TabListContainer days={1} />
          <TabListContainer days={7} />
          <TabListContainer days={30} />
        </Tabs.Pager>
      </Tabs.Root>
    </View>
  );
};

const TabListContainer = ({ days }: { days: number }) => {
  const [selected, setSelected] = useState(0);

  const SelectionControl = useMemo(
    () => (
      <SegmentedControl
        values={["CREATOR", "NFT"]}
        onChange={setSelected}
        selectedIndex={selected}
      />
    ),
    [selected, setSelected]
  );

  return useMemo(
    () =>
      [
        <ErrorBoundary>
          <Suspense
            fallback={
              <ListHeader
                isLoading={true}
                SelectionControl={SelectionControl}
                data={{}}
              />
            }
          >
            <CreatorsList days={days} SelectionControl={SelectionControl} />
          </Suspense>
        </ErrorBoundary>,
        <ErrorBoundary>
          <Suspense
            fallback={
              <ListHeader
                isLoading={true}
                SelectionControl={SelectionControl}
                data={{}}
              />
            }
          >
            <NFTSList days={days} SelectionControl={SelectionControl} />
          </Suspense>
        </ErrorBoundary>,
      ][selected],
    [selected, days, SelectionControl]
  );
};

const CreatorsList = ({
  days,
  SelectionControl,
}: {
  days: number;
  SelectionControl: any;
}) => {
  const { data, isLoadingMore, isLoading, isRefreshing, refresh, fetchMore } =
    useTrendingCreators({
      days,
    });
  const isDark = useIsDarkMode();
  const separatorHeight = 8;

  const ListFooterComponent = useCallback(
    () => <ListFooter isLoading={isLoadingMore} />,
    [isLoadingMore]
  );

  const ItemSeparatorComponent = useCallback(
    () => <View tw={`bg-gray-200 dark:bg-gray-800 h-[${separatorHeight}px]`} />,
    [isDark]
  );

  const ListHeaderComponent = useCallback(
    () => (
      <ListHeader
        isLoading={isLoading}
        SelectionControl={SelectionControl}
        data={data}
      />
    ),
    [SelectionControl, data, isLoading, isDark]
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
    [ListHeaderComponent, days, router]
  );

  return (
    <View tw="flex-1 bg-white dark:bg-black">
      <Tabs.RecyclerList
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={_rowRenderer}
        onEndReached={fetchMore}
        refreshing={isRefreshing}
        onRefresh={refresh}
        style={{ flex: 1 }}
        renderFooter={ListFooterComponent}
      />
    </View>
  );
};

const GAP_BETWEEN_ITEMS = 1;

const NFTSList = ({
  days,
  SelectionControl,
}: {
  days: number;
  SelectionControl: any;
}) => {
  const router = useRouter();

  const { data, isLoadingMore, isLoading, isRefreshing, refresh, fetchMore } =
    useTrendingNFTS({
      days,
    });

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
        data={data}
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
    (_type: any, item: any, index) => {
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
      <Tabs.RecyclerList
        //@ts-ignore
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={_rowRenderer}
        style={useMemo(() => ({ margin: -GAP_BETWEEN_ITEMS }), [])}
        onEndReached={fetchMore}
        refreshing={isRefreshing}
        onRefresh={refresh}
        renderFooter={ListFooterComponent}
      />
    </View>
  );
};
