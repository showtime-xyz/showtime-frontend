import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";
import { useActivity } from "app/hooks/api-hooks";

import { View, Spinner, Text, Pressable } from "design-system";
import { Card } from "design-system/card";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";
import { Image } from "design-system/image";
import { useIsDarkMode } from "../../design-system/hooks";
import { VerificationBadge } from "../../design-system/verification-badge";

const TAB_LIST_HEIGHT = 64;

const SocialTokenBadgeIcon = () => {
  return (
    <Image
      source={require("../../../apps/expo/assets/social_token.png")}
      style={{ height: 32, width: 32 }}
    />
  );
};

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

const Profile = () => {
  return <ProfileTabs />;
};

const ProfileTop = ({ profile }) => {
  return (
    <View pointerEvents="box-none">
      {/* Gradient */}
      <View tw="bg-gray-400" style={{ height: 104 }} pointerEvents="none" />

      <View tw="bg-white dark:bg-black px-2" pointerEvents="box-none">
        <View tw="flex-row justify-between pr-2">
          <View tw="flex-row items-end">
            <Image
              source={{
                uri: profile.avatar,
              }}
              style={useMemo(
                () => ({
                  height: 144,
                  width: 144,
                  borderRadius: 999,
                  marginTop: -72,
                  borderWidth: 8,
                  ...tw.style("border-white dark:border-gray-900"),
                }),
                []
              )}
            />
            <View
              style={useMemo(
                () => ({
                  padding: 4,
                  borderRadius: 9999,
                  position: "absolute",
                  right: 4,
                  bottom: 4,
                  ...tw.style("bg-white dark:bg-gray-900"),
                }),
                []
              )}
            >
              <SocialTokenBadgeIcon />
            </View>
          </View>

          <Pressable tw="bg-black rounded-full dark:bg-white items-center justify-center flex-row mt-4 h-[48px] w-[80px]">
            <Text tw="text-white text-center dark:text-gray-900 font-bold">
              Follow
            </Text>
          </Pressable>
        </View>

        <View tw="px-2 pt-[10px]" pointerEvents="box-none">
          <View pointerEvents="none">
            <Text tw="dark:text-white text-gray-900 text-2xl font-bold">
              {profile.name}
            </Text>
            <View tw="flex-row items-center mt-[10px]">
              <Text
                variant="text-md"
                tw="text-gray-900 dark:text-white font-semibold"
              >
                {profile.username}
              </Text>

              {profile.isVerified ? (
                <View tw="ml-1">
                  <VerificationBadge size={16} />
                </View>
              ) : null}

              {profile.followsYou ? (
                <View tw="bg-gray-100 dark:bg-gray-900 ml-2 px-2 py-1 rounded-full">
                  <Text
                    variant="text-xs"
                    tw="dark:text-gray-400 text-gray-500 font-600"
                  >
                    Follows You
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View tw="mt-[18px] flex-row" pointerEvents="box-none">
            <Text tw="text-sm text-gray-900 dark:text-white font-semibold">
              {profile.following} <Text tw="font-medium">following</Text>
            </Text>
            <View tw="ml-8">
              <Text tw="text-sm text-gray-900 dark:text-white font-medium">
                {profile.followers} <Text tw="font-medium">followers</Text>
              </Text>
            </View>
          </View>

          <View pointerEvents="box-none">
            <View tw="flex-row items-center my-4" pointerEvents="box-none">
              <Text tw="text-gray-600 dark:text-gray-400 font-medium">
                Followed by{" "}
              </Text>
              <Pressable onPress={() => Alert.alert("hi 1")}>
                <Text tw="dark:text-white text-gray-900 font-bold text-xs">
                  @am ,{" "}
                </Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert("hi 2")}>
                <Text tw="dark:text-white text-gray-900 font-bold text-xs">
                  @m1guelpf &{" "}
                </Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert("hi 3")}>
                <Text tw="dark:text-white text-gray-900 font-bold text-xs">
                  12 others
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const ProfileTabs = () => {
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
          <ProfileTop
            profile={{
              name: "Blaze",
              username: "@blaze",
              avatar:
                "https://storage.googleapis.com/nft-public-profile-pics/691218_1620000973.jpg",
              following: 240,
              followers: "13.4k",
              followsYou: true,
              isVerified: true,
            }}
          />
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
            <TabItem name="Created" selected={selected === 0} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Owned" selected={selected === 1} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Listed" selected={selected === 2} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Liked" selected={selected === 3} />
          </Tabs.Trigger>

          <SelectedTabIndicator />
        </Tabs.List>
        <Tabs.Pager>
          <AllActivityList />
          <CreationList />
          <LikesList />
          <CommentsList />
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

export { Profile };
