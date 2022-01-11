import { memo, useCallback, useMemo, useReducer, useState } from "react";
import { Dimensions, Platform, Pressable, useColorScheme } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  useProfileNFTs,
  useProfileNftTabs,
  useUserProfile,
} from "app/hooks/api-hooks";
import { View, Spinner, Text, Skeleton, Select } from "design-system";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";
import { Image } from "design-system/image";
import { VerificationBadge } from "../../design-system/verification-badge";
import { getProfileImage, getProfileName, getSortFields } from "../utilities";
import Animated, { FadeIn } from "react-native-reanimated";
import { useUser } from "../hooks/use-user";
import { NFT } from "../types";
import { Video } from "expo-av";
import PagerView from "react-native-pager-view";

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

const testUser = "suicidalhamster";

const ProfileScreen = () => {
  const { user } = useUser();
  return <Profile address={"suicidalhamster"} />;
};

const Profile = ({ address }: { address?: string }) => {
  const { data: profileData } = useUserProfile({ address });
  const { data, loading } = useProfileNftTabs({
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
              <TabList
                listId={list.id}
                key={list.id}
                profileId={profileData?.data.profile.profile_id}
              />
            );
          })}
        </Tabs.Pager>
      </Tabs.Root>
    </View>
  );
};

const GAP_BETWEEN_ITEMS = 2;
const ITEM_SIZE = Dimensions.get("window").width / 2;

const TabList = ({
  listId,
  profileId,
}: {
  listId: number;
  profileId?: number;
}) => {
  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useProfileNFTs({ listId, profileId });

  const keyExtractor = useCallback((item) => {
    return item.nft_id;
  }, []);

  const [filter, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "collection_change":
          return { ...state, collectionId: action.payload };
        case "sort_change":
          return { ...state, sortId: action.payload };
      }
    },
    {
      sortId: 1,
      collectionId: 0,
    }
  );

  const onCollectionChange = (value) => {
    dispatch({ type: "collection_change", payload: value });
  };

  const onSortChange = (value) => {
    dispatch({ type: "sort_change", payload: value });
  };

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
        <Filter
          onCollectionChange={onCollectionChange}
          onSortChange={onSortChange}
          collectionId={filter.collectionId}
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
    [data, isLoading, filter]
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

const ProfileTop = ({ address }: { address?: string }) => {
  const { data: profileData, loading } = useUserProfile({ address });
  const name = getProfileName(profileData?.data.profile);
  const username = profileData?.data.profile.username;
  const bio = profileData?.data.profile.bio;
  const colorMode = useColorScheme();

  return (
    <View pointerEvents="box-none">
      <View tw={`bg-gray-400 h-[${COVER_IMAGE_HEIGHT}px]`} pointerEvents="none">
        <Image
          source={{ uri: profileData?.data.profile.cover_url }}
          tw={`h-[${COVER_IMAGE_HEIGHT}px] w-100vw`}
          alt="Cover image"
        />
      </View>

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

        <View tw="px-2 py-3" pointerEvents="box-none">
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
              <Skeleton height={32} width={150} colorMode={colorMode} />
            ) : null}

            {username ? (
              <View tw="flex-row items-center mt-2">
                <Animated.View entering={FadeIn}>
                  <Text
                    variant="text-base"
                    tw="text-gray-900 dark:text-white font-semibold"
                  >
                    @{username}
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
            ) : loading ? (
              <View tw="flex-row items-center mt-3">
                <Skeleton height={12} width={100} colorMode={colorMode} />
              </View>
            ) : null}
          </View>

          {bio ? (
            <View tw="flex-row items-center mt-3" pointerEvents="box-none">
              <Text
                tw="text-sm text-gray-600 dark:text-gray-400"
                pointerEvents="none"
              >
                {bio}
              </Text>
            </View>
          ) : null}

          <View tw="flex-row mt-4" pointerEvents="box-none">
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

          {/* <View pointerEvents="box-none" tw="mt-4">
            <View tw="flex-row items-center" pointerEvents="box-none">
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

const options = [
  {
    value: 0,
    label: "Option A",
  },
  {
    value: 1,
    label: "Option B",
  },
  {
    value: 2,
    label: "Option C",
  },
];

const Filter = ({ onCollectionChange, onSortChange, collectionId, sortId }) => {
  const sortFields = getSortFields();

  return (
    <View tw="flex-row justify-around">
      <Select
        value={collectionId}
        onChange={onCollectionChange}
        options={options}
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
      <Pressable
        style={tw.style(
          "bg-black rounded-full dark:bg-white items-center justify-center flex-row px-3 py-2"
        )}
      >
        <Text tw="text-white text-center dark:text-gray-900 font-bold text-xs">
          Customize
        </Text>
      </Pressable>
    </View>
  );
};

export { ProfileScreen as Profile };
