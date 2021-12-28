import { useCallback, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { View, ActivityIndicator } from "design-system";
import { Card } from "design-system/card";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
const TAB_LIST_HEIGHT = 55;

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
    hidden.value = false;
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

  const offsetY = useSharedValue(0);
  const hidden = useSharedValue(false);

  const listScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      if (e.contentOffset.y <= 0) {
        hidden.value = false;
        offsetY.value = e.contentOffset.y;
      } else if (offsetY.value + 55 < e.contentOffset.y) {
        hidden.value = true;
        offsetY.value = e.contentOffset.y;
      } else if (offsetY.value - 55 > e.contentOffset.y) {
        hidden.value = false;
        offsetY.value = e.contentOffset.y;
      }
    },
  });

  const listStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: hidden.value
            ? withTiming(-55, { duration: 300 })
            : withTiming(0, { duration: 300 }),
        },
      ],
    };
  }, []);

  return (
    <Tabs.Root
      onIndexChange={onIndexChange}
      initialIndex={selected}
      tabListHeight={TAB_LIST_HEIGHT}
    >
      <Tabs.List
        style={[
          {
            height: TAB_LIST_HEIGHT,
          },
          listStyle,
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
        <Animated.FlatList
          data={activity}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onScroll={listScrollHandler}
          getItemLayout={getItemLayout}
          scrollEventThrottle={16}
          onEndReached={getNext}
          style={[{ top: 55 }, listStyle]}
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
          onRefresh={onRefresh}
          refreshing={isRefreshing}
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
