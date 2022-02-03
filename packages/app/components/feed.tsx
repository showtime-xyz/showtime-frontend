import { Suspense, useCallback, useState } from "react";
import { Platform } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useActivity } from "app/hooks/api-hooks";

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

const Feed = () => {
  const [selected, setSelected] = useState(0);

  return (
    <View tw="bg-white dark:bg-black flex-1">
      <Tabs.Root
        onIndexChange={setSelected}
        initialIndex={selected}
        tabListHeight={TAB_LIST_HEIGHT}
        lazy
      >
        <Tabs.Header>
          <View tw="bg-white dark:bg-black pt-4 pl-4 pb-[3px]">
            <Text
              variant="text-2xl"
              tw="text-gray-900 dark:text-white font-extrabold"
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
            <TabItem name="All Activity" selected={selected === 0} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Creations" selected={selected === 1} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Likes" selected={selected === 2} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Comments" selected={selected === 3} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Follows" selected={selected === 4} />
          </Tabs.Trigger>

          <SelectedTabIndicator />
        </Tabs.List>
        <Tabs.Pager>
          <Suspense fallback={<Spinner size="small" />}>
            <AllActivityList />
          </Suspense>
          <Suspense fallback={<Spinner size="small" />}>
            <CreationList />
          </Suspense>
          <Suspense fallback={<Spinner size="small" />}>
            <LikesList />
          </Suspense>
          <Suspense fallback={<Spinner size="small" />}>
            <CommentsList />
          </Suspense>
          <Suspense fallback={<Spinner size="small" />}>
            <FollowsList />
          </Suspense>
        </Tabs.Pager>
      </Tabs.Root>
    </View>
  );
};

const CreationList = () => {
  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useActivity({ typeId: 3 });

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => <Card act={item} variant="activity" />,
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
    <Tabs.FlatList
      data={data}
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
      ListFooterComponent={ListFooterComponent}
    />
  );
};

const LikesList = () => {
  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useActivity({ typeId: 1 });

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => <Card act={item} variant="activity" />,
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
    <Tabs.FlatList
      data={data}
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
      ListFooterComponent={ListFooterComponent}
    />
  );
};

const CommentsList = () => {
  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useActivity({ typeId: 2 });

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => <Card act={item} variant="activity" />,
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
    <Tabs.FlatList
      data={data}
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
      ListFooterComponent={ListFooterComponent}
    />
  );
};

const FollowsList = () => {
  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useActivity({ typeId: 4, limit: 10 });

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => <Card act={item} variant="activity" />,
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
    <Tabs.FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshing={isRefreshing}
      onRefresh={refresh}
      onEndReached={fetchMore}
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

const AllActivityList = () => {
  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useActivity({ typeId: 0 });

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => <Card act={item} variant="activity" />,
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
    <Tabs.FlatList
      data={data}
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
      ListFooterComponent={ListFooterComponent}
    />
  );
};

export { Feed };
