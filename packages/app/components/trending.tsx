import { Suspense, useCallback, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import {
  View,
  Spinner,
  Text,
  Tabs,
  TabItem,
  SelectedTabIndicator,
  CreatorPreview,
  SegmentedControl,
  Media,
} from "design-system";
import { tw } from "design-system/tailwind";
import { useTrendingCreators, useTrendingNFTS } from "app/hooks/api-hooks";

const TAB_LIST_HEIGHT = 64;

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  const tabBarHeight = useBottomTabBarHeight();

  if (isLoading) {
    return (
      <View
        tw="h-16 items-center justify-center mt-6 px-3"
        sx={{ marginBottom: tabBarHeight }}
      >
        <Spinner size="small" />
      </View>
    );
  }

  return <View sx={{ marginBottom: tabBarHeight }}></View>;
};

export const Trending = () => {
  const [selected, setSelected] = useState(0);

  return (
    <View tw="bg-white dark:bg-black flex-1">
      <Tabs.Root onIndexChange={setSelected} initialIndex={selected} lazy>
        <Tabs.Header>
          <View tw="bg-white dark:bg-black pt-4 pl-4 pb-[3px]">
            <Text tw="text-gray-900 dark:text-white font-bold text-3xl">
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
            []
          )}
        >
          <Tabs.Trigger>
            <TabItem name="24 hours" selected={selected === 0} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="7 days" selected={selected === 1} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="30 days" selected={selected === 2} />
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
        values={["CREATORS", "NFTS"]}
        onChange={setSelected}
        selectedIndex={selected}
      />
    ),
    [selected, setSelected]
  );

  return useMemo(
    () =>
      [
        <Suspense fallback={<Spinner size="small" />}>
          <CreatorsList days={days} SelectionControl={SelectionControl} />
        </Suspense>,
        <Suspense fallback={<Spinner size="small" />}>
          <NFTSList days={days} SelectionControl={SelectionControl} />
        </Suspense>,
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

  const keyExtractor = useCallback((item) => {
    return item.profile_id;
  }, []);

  const renderItem = useCallback(({ item }) => {
    return <CreatorPreview creator={item} />;
  }, []);

  const ListFooterComponent = useCallback(
    () => <Footer isLoading={isLoadingMore} />,
    [isLoadingMore]
  );

  const ListHeaderComponent = useMemo(
    () => (
      <View tw="p-4">
        {SelectionControl}
        {data.length === 0 && !isLoading ? (
          <View tw="items-center justify-center mt-20">
            <Text tw="text-gray-900 dark:text-white">No results found</Text>
          </View>
        ) : isLoading ? (
          <View tw="items-center justify-center mt-20">
            <Spinner />
          </View>
        ) : null}
      </View>
    ),
    [SelectionControl, data, isLoading]
  );

  return (
    <View tw="flex-1">
      <Tabs.FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={refresh}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.6}
        removeClippedSubviews={Platform.OS !== "web"}
        ListHeaderComponent={ListHeaderComponent}
        numColumns={1}
        windowSize={4}
        initialNumToRender={10}
        alwaysBounceVertical={false}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
};

const GAP_BETWEEN_ITEMS = 1;
const ITEM_SIZE = Dimensions.get("window").width / 2;

const NFTSList = ({
  days,
  SelectionControl,
}: {
  days: number;
  SelectionControl: any;
}) => {
  const { data, isLoadingMore, isLoading, isRefreshing, refresh, fetchMore } =
    useTrendingNFTS({
      days,
    });

  const keyExtractor = useCallback((_item, index) => {
    return index.toString();
  }, []);

  const renderItem = useCallback(
    ({ item }) => <Media item={item} count={2} />,
    []
  );

  const ListFooterComponent = useCallback(
    () => <Footer isLoading={isLoadingMore} />,
    [isLoadingMore]
  );

  const getItemLayout = useCallback((_data, index) => {
    return { length: ITEM_SIZE, offset: ITEM_SIZE * index, index };
  }, []);

  const ListHeaderComponent = useMemo(
    () => (
      <View tw="p-4">
        {SelectionControl}
        {data.length === 0 && !isLoading ? (
          <View tw="items-center justify-center mt-20">
            <Text tw="text-gray-900 dark:text-white">No results found</Text>
          </View>
        ) : isLoading ? (
          <View tw="items-center justify-center mt-20">
            <Spinner />
          </View>
        ) : null}
      </View>
    ),
    [SelectionControl, data, isLoading]
  );

  return (
    <View tw="flex-1">
      <Tabs.FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={refresh}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.6}
        removeClippedSubviews={Platform.OS !== "web"}
        ListHeaderComponent={ListHeaderComponent}
        numColumns={2}
        getItemLayout={getItemLayout}
        windowSize={4}
        initialNumToRender={10}
        alwaysBounceVertical={false}
        ListFooterComponent={ListFooterComponent}
        style={useMemo(() => ({ margin: -GAP_BETWEEN_ITEMS }), [])}
      />
    </View>
  );
};
