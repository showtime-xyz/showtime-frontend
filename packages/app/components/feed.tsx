import React, { Suspense, useCallback, useRef } from "react";
import { Platform, FlatList } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";

import { useActivity } from "app/hooks/api-hooks";

import { View, Spinner, Text } from "design-system";
import { Card } from "design-system/card";

import { ViewabilityTrackerFlatlist } from "./viewability-tracker-flatlist";

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

const Feed = () => {
  return (
    <View tw="bg-white dark:bg-black flex-1" testID="homeFeed">
      <Suspense
        fallback={
          <View tw="pt-8 items-center">
            <Spinner size="small" />
          </View>
        }
      >
        <AllActivityList />
      </Suspense>
    </View>
  );
};

const AllActivityList = () => {
  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useActivity({ typeId: 0 });
  const listRef = useRef<FlatList>(null);

  useScrollToTop(listRef);

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => <Card act={item} variant="activity" />,
    []
  );

  const ListHeaderComponent = useCallback(
    () => (
      <View tw="bg-white dark:bg-black pt-4 pl-4 pb-[3px]">
        <Text
          variant="text-2xl"
          tw="text-gray-900 dark:text-white font-extrabold"
        >
          Home
        </Text>
      </View>
    ),
    []
  );

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
    <ViewabilityTrackerFlatlist
      data={data}
      ref={listRef}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshing={isRefreshing}
      onRefresh={refresh}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.6}
      removeClippedSubviews={Platform.OS !== "web"}
      numColumns={1}
      windowSize={4}
      initialNumToRender={2}
      alwaysBounceVertical={false}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

export { Feed };
