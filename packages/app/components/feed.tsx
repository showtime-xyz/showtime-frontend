import { useCallback } from "react";
import { FlatList, Platform, useWindowDimensions } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { View, ActivityIndicator } from "design-system";
import { Card } from "design-system/card";

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
    <FlatList
      data={activity}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
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
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      numColumns={1}
      windowSize={4}
      initialNumToRender={2}
      alwaysBounceVertical={false}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

export { Feed };
