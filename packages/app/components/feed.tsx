import { useCallback, useRef, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";
import { useAllActivity } from "app/hooks/service-hooks";

import { View, Spinner, Text } from "design-system";
import { Card } from "design-system/card";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";
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

type Props = {
  activity: any;
  activityPage: any;
  getNext: any;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: any;
};

const Feed = () => {
  const [selected, setSelected] = useState(0);
  const onIndexChange = (index) => {
    setSelected(index);
    console.log("index changed", index);
  };

  return (
    <Tabs.Root
      onIndexChange={onIndexChange}
      initialIndex={selected}
      tabListHeight={TAB_LIST_HEIGHT}
    >
      <Tabs.Header>
        <View tw="bg-white dark:bg-black">
          <Text tw="px-4 pt-4 text-gray-900 dark:text-white font-bold text-3xl">
            Home
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
          <TabItem name={"All Activity"} selected={selected === 0} />
        </Tabs.Trigger>

        <Tabs.Trigger>
          <TabItem name={"Creations"} selected={selected === 1} />
        </Tabs.Trigger>

        <Tabs.Trigger>
          <TabItem name={"Likes"} selected={selected === 2} />
        </Tabs.Trigger>

        <Tabs.Trigger>
          <TabItem name={"Comments"} selected={selected === 3} />
        </Tabs.Trigger>

        <SelectedTabIndicator />
      </Tabs.List>
      <Tabs.Pager>
        <AllActivityList />
        <Tabs.View style={{ height: 200, backgroundColor: "#FEF2F2" }} />
        <Tabs.View style={{ height: 200, backgroundColor: "#FEF2F2" }} />

        <Tabs.View style={{ height: 100, backgroundColor: "#2563EB" }} />
      </Tabs.Pager>
    </Tabs.Root>
  );
};

const AllActivityList = () => {
  const { width } = useWindowDimensions();
  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useAllActivity();

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => <Card act={item} variant="activity" />,
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

  return (
    <Tabs.FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshing={isRefreshing}
      onRefresh={refresh}
      onEndReached={fetchMore}
      ref={listRef}
      style={tw.style("bg-white dark:bg-black")}
      onEndReachedThreshold={0.6}
      removeClippedSubviews={Platform.OS !== "web"}
      numColumns={1}
      windowSize={4}
      initialNumToRender={2}
      alwaysBounceVertical={false}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

export { Feed };
