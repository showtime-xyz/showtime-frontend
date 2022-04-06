import { Suspense, useCallback, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";

import { useTrendingCreators, useTrendingNFTS } from "app/hooks/api-hooks";
import { TAB_LIST_HEIGHT } from "app/lib/constants";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useRouter } from "app/navigation/use-router";

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
  Pressable,
} from "design-system";
import { cardSize } from "design-system/creator-preview";
import { useIsDarkMode } from "design-system/hooks";
import { tw } from "design-system/tailwind";

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
  const isDark = useIsDarkMode();
  const headerHeight = useHeaderHeight();

  return (
    <View tw="bg-white dark:bg-black flex-1">
      <Tabs.Root onIndexChange={setSelected} initialIndex={selected} lazy>
        <Tabs.Header>
          {Platform.OS !== "android" && <View tw={`h-[${headerHeight}px]`} />}
          <View tw="bg-white dark:bg-black pt-4 pl-4 pb-[3px]">
            <Text
              variant="text-2xl"
              tw="text-gray-900 dark:text-white font-extrabold"
            >
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
          <Tabs.Trigger style={{ flex: 1 }}>
            <TabItem name="Today" selected={selected === 0} />
          </Tabs.Trigger>

          <Tabs.Trigger style={{ flex: 1 }}>
            <TabItem name="This week" selected={selected === 1} />
          </Tabs.Trigger>

          <Tabs.Trigger style={{ flex: 1 }}>
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
  const isDark = useIsDarkMode();
  const separatorHeight = 8;

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

  const ItemSeparatorComponent = useCallback(
    () => <View tw={`bg-gray-200 dark:bg-gray-800 h-[${separatorHeight}px]`} />,
    [isDark]
  );

  const getItemLayout = useCallback((_data, index) => {
    const cardHeight = cardSize + separatorHeight;
    return {
      length: cardHeight,
      offset: cardHeight * index,
      index,
    };
  }, []);

  const ListHeaderComponent = useMemo(
    () => (
      <View
        tw="p-4 dark:border-gray-900 border-gray-100"
        style={{ borderBottomWidth: 1 }}
      >
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
    [SelectionControl, data, isLoading, isDark]
  );

  return (
    <View tw="flex-1 bg-white dark:bg-black">
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
        initialNumToRender={4}
        alwaysBounceVertical={false}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

const GAP_BETWEEN_ITEMS = 1;
const ITEM_SIZE = Dimensions.get("window").width / 3;

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

  const keyExtractor = useCallback((item) => {
    return item.nft_id.toString();
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <Pressable
        onPress={() =>
          router.push(
            `/swipeList?initialScrollIndex=${index}&days=${days}&type=trendingNFTs`
          )
        }
      >
        <Media item={item} numColumns={3} />
      </Pressable>
    ),
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
      <View
        tw="p-4 dark:border-gray-900 border-gray-100"
        style={{ borderBottomWidth: 1 }}
      >
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
    <View tw="flex-1 bg-white dark:bg-black">
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
        numColumns={3}
        getItemLayout={getItemLayout}
        windowSize={6}
        initialNumToRender={9}
        alwaysBounceVertical={false}
        ListFooterComponent={ListFooterComponent}
        style={useMemo(() => ({ margin: -GAP_BETWEEN_ITEMS }), [])}
      />
    </View>
  );
};
