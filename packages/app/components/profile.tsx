import { Suspense, useCallback, useMemo, useReducer, useState } from "react";
import { Dimensions, Platform } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  Collection,
  defaultFilters,
  List,
  useProfileNFTs,
  useProfileNftTabs,
  useUserProfile,
} from "app/hooks/api-hooks";
import { View, Spinner, Text, Skeleton, Select } from "design-system";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";
import { Image } from "design-system/image";
import { VerificationBadge } from "design-system/verification-badge";
import { useColorScheme } from "design-system/hooks";
import { getProfileImage, getProfileName, getSortFields } from "../utilities";
import { Media } from "design-system/media";

const TAB_LIST_HEIGHT = 64;
const COVER_IMAGE_HEIGHT = 104;

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

const ProfileScreen = ({ walletAddress }: { walletAddress: string }) => {
  return <Profile address={walletAddress} />;
};

const Profile = ({ address }: { address?: string }) => {
  const { data: profileData } = useUserProfile({ address });
  const { data } = useProfileNftTabs({
    profileId: profileData?.data.profile.profile_id,
  });
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
          <ProfileTop address={address} />
        </Tabs.Header>
        <Tabs.List
          style={tw.style(
            `h-[${TAB_LIST_HEIGHT}px] dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900`
          )}
        >
          {data?.data.lists.map((list, index) => (
            <Tabs.Trigger key={list.id}>
              <TabItem name={list.name} selected={selected === index} />
            </Tabs.Trigger>
          ))}
          <SelectedTabIndicator />
        </Tabs.List>
        <Tabs.Pager>
          {data?.data.lists.map((list) => {
            return (
              <Suspense fallback={<Spinner size="small" />} key={list.id}>
                <TabList
                  profileId={profileData?.data.profile.profile_id}
                  list={list}
                />
              </Suspense>
            );
          })}
        </Tabs.Pager>
      </Tabs.Root>
    </View>
  );
};

const GAP_BETWEEN_ITEMS = 2;
const ITEM_SIZE = Dimensions.get("window").width / 2;

const TabList = ({ profileId, list }: { profileId?: number; list: List }) => {
  const keyExtractor = useCallback((item) => {
    return item.nft_id;
  }, []);

  const [filter, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case "collection_change":
        return { ...state, collectionId: action.payload };
      case "sort_change":
        return { ...state, sortId: action.payload };
    }
  }, defaultFilters);

  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useProfileNFTs({
      listId: list.id,
      profileId,
      collectionId: filter.collectionId,
      sortId: filter.sortId,
    });

  const onCollectionChange = useCallback(
    (value) => {
      dispatch({ type: "collection_change", payload: value });
    },
    [dispatch]
  );

  const onSortChange = useCallback(
    (value) => {
      dispatch({ type: "sort_change", payload: value });
    },
    [dispatch]
  );

  const renderItem = useCallback(
    ({ item }) => <Media item={item} count={2} />,
    []
  );

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
        <Filter
          onCollectionChange={onCollectionChange}
          onSortChange={onSortChange}
          collectionId={filter.collectionId}
          collections={list.collections}
          sortId={filter.sortId}
        />
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
    [
      data,
      isLoading,
      filter,
      onCollectionChange,
      onSortChange,
      list.collections,
    ]
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

const ProfileTop = ({ address }: { address?: string }) => {
  const { data: profileData, loading } = useUserProfile({ address });
  const name = getProfileName(profileData?.data.profile);
  const username = profileData?.data.profile.username;
  const bio = profileData?.data.profile.bio;
  const colorMode = useColorScheme();

  return (
    <View>
      <View tw={`bg-gray-100 h-[${COVER_IMAGE_HEIGHT}px]`}>
        <Image
          source={{ uri: profileData?.data.profile.cover_url }}
          tw={`h-[${COVER_IMAGE_HEIGHT}px] w-100vw`}
          alt="Cover image"
        />
      </View>

      <View tw="bg-white dark:bg-black px-2">
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
            {/* <View tw="bg-white dark:bg-gray-900 p-1 rounded-full absolute right-2 bottom-2">
              <Image
                  source={require("../../../apps/expo/assets/social_token.png")}
                  style={{ height: TOKEN_BADGE_HEIGHT, width: 28 }}
                />
            </View> */}
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

        <View tw="px-2 py-3">
          <View>
            <Skeleton
              height={24}
              width={150}
              show={loading}
              colorMode={colorMode as any}
            >
              <Animated.View entering={FadeIn}>
                <Text
                  tw="dark:text-white text-gray-900 text-2xl font-bold"
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </Animated.View>
            </Skeleton>

            <View tw="h-2" />

            <Skeleton
              height={12}
              width={100}
              show={loading}
              colorMode={colorMode as any}
            >
              <View tw="flex-row items-center">
                <Animated.View entering={FadeIn}>
                  <Text
                    variant="text-base"
                    tw="text-gray-900 dark:text-white font-semibold"
                  >
                    {username ? `@${username}` : null}
                  </Text>
                </Animated.View>

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
            </Skeleton>
          </View>

          {bio ? (
            <View tw="flex-row items-center mt-3">
              <Text tw="text-sm text-gray-600 dark:text-gray-400">{bio}</Text>
            </View>
          ) : null}

          <View tw="flex-row mt-4">
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

          {/* <View>
            <View tw="flex-row items-center">
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

type FilterProps = {
  onCollectionChange: (id: string | number) => void;
  collections: Collection[];
  onSortChange: (id: string | number) => void;
  collectionId: number;
  sortId: number;
};

const Filter = ({
  onCollectionChange,
  collections,
  onSortChange,
  collectionId,
  sortId,
}: FilterProps) => {
  const sortFields = getSortFields();

  return (
    <View tw="flex-row justify-around">
      <Select
        value={collectionId}
        onChange={onCollectionChange}
        options={collections.map((collection) => ({
          value: collection.collection_id,
          label: collection.collection_name,
        }))}
        size="small"
        placeholder="Collection"
      />
      <Select
        value={sortId}
        onChange={onSortChange}
        options={sortFields}
        size="small"
        placeholder="Sort"
      />
      {/* <Pressable
        style={tw.style(
          "bg-black rounded-full dark:bg-white items-center justify-center flex-row px-3 py-2"
        )}
      >
        <Text tw="text-white text-center dark:text-gray-900 font-bold text-xs">
          Customize
        </Text>
      </Pressable> */}
    </View>
  );
};

export { ProfileScreen as Profile };
