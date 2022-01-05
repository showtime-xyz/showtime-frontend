import { useCallback, useRef, useState } from "react";
import {
  View,
  Spinner,
  Text,
  Tabs,
  TabItem,
  SelectedTabIndicator,
  CreatorPreview,
} from "design-system";
import { tw } from "design-system/tailwind";
import { useTrendingCreators } from "../hooks/api-hooks";
import { useScrollToTop } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

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
          <View tw="bg-white dark:bg-black p-4">
            <Text tw="text-gray-900 dark:text-white font-bold text-3xl">
              Trending
            </Text>
          </View>
        </Tabs.Header>
        <Tabs.List
          style={[
            {
              height: TAB_LIST_HEIGHT,
              ...tw.style(
                "dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900"
              ),
            },
          ]}
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
          <TabList days={1} />
          <TabList days={7} />
          <TabList days={30} />
        </Tabs.Pager>
      </Tabs.Root>
    </View>
  );
};

const TabList = ({ days }: { days: number }) => {
  const {
    data,
    isLoadingMore,
    isLoading,
    status,
    isRefreshing,
    refresh,
    fetchMore,
  } = useTrendingCreators({
    days,
  });
  const keyExtractor = useCallback((item, index) => {
    return index.toString();
  }, []);

  const renderItem = useCallback(
    ({ item }) => <CreatorPreview creator={item} />,
    []
  );

  const listRef = useRef(null);

  useScrollToTop(listRef);

  const ListFooterComponent = useCallback(
    () => <Footer isLoading={isLoadingMore} />,
    [isLoadingMore]
  );

  if (isLoading) {
    return (
      <View tw="items-center justify-center flex-1">
        <Spinner />
      </View>
    );
  }

  if (data.length === 0 && status === "success") {
    return (
      <View tw="items-center justify-center flex-1">
        <Text tw="text-gray-900 dark:text-white">No data found</Text>
      </View>
    );
  }

  return (
    <Tabs.FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshing={isRefreshing}
      onRefresh={refresh}
      onEndReached={fetchMore}
      ref={listRef}
      onEndReachedThreshold={0.6}
      removeClippedSubviews={Platform.OS !== "web"}
      numColumns={1}
      windowSize={4}
      initialNumToRender={10}
      alwaysBounceVertical={false}
      ListFooterComponent={ListFooterComponent}
    />
  );
};
