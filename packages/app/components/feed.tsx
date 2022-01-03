import { useCallback, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { View, ActivityIndicator, Text } from "design-system";
import { Card } from "design-system/card";
import {
  Tabs,
  TabItem,
  SelectedTabIndicator,
  PullToRefresh,
} from "design-system/tabs";
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
        <ActivityIndicator />
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

const Feed = ({
  activity,
  activityPage,
  getNext,
  isLoading,
  isRefreshing,
  onRefresh,
}: Props) => {
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

  return (
    <Tabs.Root
      onIndexChange={onIndexChange}
      initialIndex={selected}
      tabListHeight={TAB_LIST_HEIGHT}
    >
      <PullToRefresh isRefreshing={isRefreshing} onRefresh={onRefresh} />
      <Tabs.Header>
        <View tw="bg-white dark:bg-black">
          <Text
            tw="pt-8 px-4 text-gray-900 dark:text-white font-bold"
            sx={{ fontSize: 22 }}
          >
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
          bounces={false}
          getItemLayout={getItemLayout}
          scrollEventThrottle={16}
          onEndReached={getNext}
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
        <Tabs.View style={{ height: 300, backgroundColor: "#D1FAE5" }} />
        <Tabs.View style={{ height: 100, backgroundColor: "#2563EB" }} />
      </Tabs.Pager>
    </Tabs.Root>
  );
};

export { Feed };
