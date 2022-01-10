import { memo, useCallback, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  useActivity,
  useCurrentUserProfile,
  useProfileNFTs,
} from "app/hooks/api-hooks";
import { View, Spinner, Text, Skeleton } from "design-system";
import { Card } from "design-system/card";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";
import { Image } from "design-system/image";
import { VerificationBadge } from "../../design-system/verification-badge";
import { getProfileImage, getProfileName } from "../utilities";
import Animated, { FadeIn } from "react-native-reanimated";
import { useUser } from "../hooks/use-user";
import { NFT } from "../types";
import { Video } from "expo-av";

const TAB_LIST_HEIGHT = 64;
const TOKEN_BADGE_HEIGHT = 28;
const COVER_IMAGE_HEIGHT = 104;

const SocialTokenBadgeIcon = () => {
  return (
    <Image
      source={require("../../../apps/expo/assets/social_token.png")}
      style={{ height: TOKEN_BADGE_HEIGHT, width: TOKEN_BADGE_HEIGHT }}
    />
  );
};

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  const tabBarHeight = useBottomTabBarHeight();

  if (isLoading) {
    return (
      <View
        tw={`h-16 items-center justify-center mt-6 px-3 mb-[${tabBarHeight}px]`}
      >
        <Spinner size="small" />
      </View>
    );
  }

  return <View tw={`mb-[${tabBarHeight}px]`} />;
};

const Profile = () => {
  return <ProfileTabs />;
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
          <ProfileTop />
        </Tabs.Header>
        <Tabs.List
          style={tw.style(
            `h-[${TAB_LIST_HEIGHT}px] dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900`
          )}
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
          <CreatedNFTsList />
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
const GAP_BETWEEN_ITEMS = 1;
const ITEM_SIZE = Dimensions.get("window").width / 2;

const CreatedNFTsList = () => {
  const { user } = useUser();
  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useProfileNFTs({ listId: 1, profileId: user?.data.profile.profile_id });

  const keyExtractor = useCallback((item) => {
    return item.nft_id;
  }, []);

  const renderItem = useCallback(({ item }) => <Media item={item} />, []);

  const ListFooterComponent = useCallback(
    () => <Footer isLoading={isLoadingMore} />,
    [isLoadingMore]
  );

  const getItemLayout = useCallback((_data, index) => {
    return { length: ITEM_SIZE, offset: ITEM_SIZE * index, index };
  }, []);

  const ListHeaderComponent = useMemo(
    () => (
      <View tw="p-4">
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
    [data, isLoading]
  );

  return (
    <View tw="flex-1">
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
        numColumns={2}
        getItemLayout={getItemLayout}
        windowSize={4}
        initialNumToRender={10}
        alwaysBounceVertical={false}
        ListFooterComponent={ListFooterComponent}
        style={useMemo(() => ({ margin: -GAP_BETWEEN_ITEMS }), [])}
      />
    </View>
  );
};

const Media = memo(function Media({ item }: { item: NFT }) {
  const style = useMemo(() => {
    return {
      width: ITEM_SIZE - GAP_BETWEEN_ITEMS,
      height: ITEM_SIZE - GAP_BETWEEN_ITEMS,
      margin: GAP_BETWEEN_ITEMS,
    };
  }, []);

  if (item.mime_type?.startsWith("video")) {
    return (
      <Video
        source={{
          uri: item.animation_preview_url,
        }}
        style={style}
        useNativeControls
        isLooping
        isMuted
      />
    );
  } else if (item.mime_type?.startsWith("image")) {
    return (
      <Image
        source={{
          uri: item.still_preview_url,
        }}
        alt={item.token_name}
        style={style}
      />
    );
  }

  return null;
});

const ProfileTop = () => {
  const { data: profileData, loading } = useCurrentUserProfile();

  const name = getProfileName(profileData?.data.profile);
  const username = profileData?.data.profile.username;

  return (
    <View pointerEvents="box-none">
      <View
        tw={`bg-gray-400 h-[${COVER_IMAGE_HEIGHT}px]`}
        pointerEvents="none"
      />

      <View tw="bg-white dark:bg-black px-2" pointerEvents="box-none">
        <View tw="flex-row justify-between pr-2">
          <View tw="flex-row items-end">
            <View tw="bg-gray-100 h-[144px] w-[144px] rounded-full mt-[-72px]">
              <Image
                source={{
                  uri: getProfileImage(profileData?.data.profile),
                }}
                alt="Profile avatar"
                tw="border-white h-[144px] w-[144px] dark:border-gray-900 rounded-full border-8"
              />
            </View>
            <View tw="bg-white dark:bg-gray-900 p-1 rounded-full absolute right-2 bottom-2">
              <SocialTokenBadgeIcon />
            </View>
          </View>

          {/* <Pressable
            style={tw.style(
              "bg-black rounded-full dark:bg-white items-center justify-center flex-row mt-4 h-[48px] w-[80px]"
            )}
          >
            <Text tw="text-white text-center dark:text-gray-900 font-bold">
              Follow
            </Text>
          </Pressable> */}
        </View>

        <View tw="px-2 pt-[10px]" pointerEvents="box-none">
          <View pointerEvents="none">
            {name ? (
              <Animated.View entering={FadeIn}>
                <Text
                  tw="dark:text-white text-gray-900 text-2xl font-bold"
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </Animated.View>
            ) : loading ? (
              <Skeleton height={32} width={150} />
            ) : null}

            <View tw="flex-row items-center mt-[10px]">
              {username ? (
                <Animated.View entering={FadeIn}>
                  <Text
                    variant="text-base"
                    tw="text-gray-900 dark:text-white font-semibold"
                  >
                    @{username}
                  </Text>
                </Animated.View>
              ) : loading ? (
                <Skeleton height={12} width={100} />
              ) : null}

              {profileData?.data.profile.verified ? (
                <View tw="ml-1">
                  <VerificationBadge size={16} />
                </View>
              ) : null}

              {/* {profileData?.data ? (
                <View tw="bg-gray-100 dark:bg-gray-900 ml-2 h-[23px] px-2 justify-center rounded-full">
                  <Text
                    variant="text-xs"
                    tw="dark:text-gray-400 text-gray-500 font-semibold"
                  >
                    Follows You
                  </Text>
                </View>
              ) : null} */}
            </View>
          </View>

          <View tw="mt-[18px] mb-1 flex-row" pointerEvents="box-none">
            <Text tw="text-sm text-gray-900 dark:text-white font-bold">
              {profileData?.data.following_count}{" "}
              <Text tw="font-medium">following</Text>
            </Text>
            <View tw="ml-8">
              <Text tw="text-sm text-gray-900 dark:text-white font-bold">
                {profileData?.data.followers_count}{" "}
                <Text tw="font-medium">followers</Text>
              </Text>
            </View>
          </View>

          {/* <View pointerEvents="box-none">
            <View tw="flex-row items-center my-4" pointerEvents="box-none">
              <Text tw="text-gray-600 dark:text-gray-400 font-medium text-xs">
                Followed by{" "}
              </Text>
              <Pressable>
                <Text tw="dark:text-white text-gray-900 font-bold text-xs">
                  @m1guelpf
                </Text>
              </Pressable>
            </View>
          </View> */}
        </View>
      </View>
    </View>
  );
};
export { Profile };
