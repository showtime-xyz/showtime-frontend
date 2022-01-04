import { useCallback, useRef, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";

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

const Feed = ({ activity, activityPage, getNext, isLoading }: Props) => {
  const { width } = useWindowDimensions();

  const [selected, setSelected] = useState(0);
  const onIndexChange = (index) => {
    setSelected(index);
    console.log("index changed", index);
  };

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => <Card act={item} variant="activity" />,
    []
  );

  const getItemLayout = useCallback(
    (data, index) => {
      const itemHeight = data?.[index]?.nfts.length === 2 ? width / 2 : width;
      const headerHeight = 0;
      const footerHeight = 0;

      return {
        length: itemHeight + headerHeight + footerHeight,
        offset: (itemHeight + headerHeight + footerHeight) * index,
        index,
      };
    },
    [width]
  );

  const ListFooterComponent = useCallback(
    () => <Footer isLoading={isLoading} />,
    [isLoading]
  );

  const listRef1 = useRef(null);
  const listRef2 = useRef(null);

  useScrollToTop(listRef1);
  useScrollToTop(listRef2);

  const [isRefreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 3000);
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
        <Tabs.FlatList
          data={activity}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          getItemLayout={getItemLayout}
          scrollEventThrottle={16}
          onEndReached={getNext}
          ref={listRef1}
          style={tw.style("bg-white dark:bg-black")}
          onEndReachedThreshold={
            activityPage === 1
              ? 0.2
              : activityPage < 4
              ? 0.3
              : activityPage < 6
              ? 0.7
              : 0.8
          }
          removeClippedSubviews={Platform.OS !== "web"}
          numColumns={1}
          windowSize={4}
          initialNumToRender={2}
          alwaysBounceVertical={false}
          ListFooterComponent={ListFooterComponent}
        />
        <Tabs.View style={{ height: 200, backgroundColor: "#FEF2F2" }} />
        <Tabs.View style={{ height: 200, backgroundColor: "#FEF2F2" }} />

        <Tabs.View style={{ height: 100, backgroundColor: "#2563EB" }} />
      </Tabs.Pager>
    </Tabs.Root>
  );
};

const AllActivityList = () => {};

export { Feed };
