import {
  memo,
  Suspense,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Dimensions, Platform, useWindowDimensions } from "react-native";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import reactStringReplace from "react-string-replace";

import { ProfileDropdown } from "app/components/profile-dropdown";
import {
  Collection,
  defaultFilters,
  List,
  useProfileNFTs,
  useProfileNftTabs,
  useUserProfile,
} from "app/hooks/api-hooks";
import { useMyInfo } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { TAB_LIST_HEIGHT } from "app/lib/constants";
import { Link } from "app/navigation/link";
import { TextLink } from "app/navigation/link";
import { useRouter } from "app/navigation/use-router";

import { View, Spinner, Text, Skeleton, Select, Button } from "design-system";
import { BottomSheet } from "design-system/bottom-sheet";
import { useColorScheme } from "design-system/hooks";
import { Image } from "design-system/image";
import { Media } from "design-system/media";
import { Pressable } from "design-system/pressable-scale";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";
import { VerificationBadge } from "design-system/verification-badge";

import {
  FollowerUser,
  useFollowersList,
} from "../hooks/api/use-followers-list";
import { useFollowingList } from "../hooks/api/use-following-list";
import {
  formatAddressShort,
  getProfileImage,
  getProfileName,
  getSortFields,
} from "../utilities";

const COVER_IMAGE_HEIGHT = 104;

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <View tw={`h-16 items-center justify-center mt-6 px-3`}>
        <Spinner size="small" />
      </View>
    );
  }
  return null;
};

const ProfileScreen = ({ walletAddress }: { walletAddress: string }) => {
  return <Profile address={walletAddress} />;
};

const Profile = ({ address }: { address?: string }) => {
  const { data: profileData } = useUserProfile({ address });
  const { data } = useProfileNftTabs({
    profileId: profileData?.data?.profile.profile_id,
  });
  const { data: myInfoData } = useMyInfo();
  const isBlocked = Boolean(
    myInfoData?.data?.blocked_profile_ids?.find(
      (id) => id === profileData?.data?.profile.profile_id
    )
  );
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
          <ProfileTop address={address} isBlocked={isBlocked} />
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
                  username={profileData?.data.profile.username}
                  profileId={profileData?.data.profile.profile_id}
                  isBlocked={isBlocked}
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

const GAP_BETWEEN_ITEMS = 1;
const ITEM_SIZE = Dimensions.get("window").width / 3;

const TabList = ({
  username,
  profileId,
  isBlocked,
  list,
}: {
  username?: string;
  profileId?: number;
  isBlocked?: boolean;
  list: List;
}) => {
  const keyExtractor = useCallback((item) => {
    return item.nft_id;
  }, []);

  const [filter, dispatch] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case "collection_change":
          return { ...state, collectionId: action.payload };
        case "sort_change":
          return { ...state, sortId: action.payload };
      }
    },
    { ...defaultFilters, sortId: list.sort_id }
  );

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
    ({ item }) => <Media item={item} numColumns={3} />,
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
        {isBlocked ? (
          <View tw="items-center justify-center mt-8">
            <Text tw="text-gray-900 dark:text-white">
              <Text tw="font-bold">@{username}</Text> is blocked
            </Text>
          </View>
        ) : data.length === 0 && !isLoading ? (
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
      isBlocked,
    ]
  );

  return (
    <View tw="flex-1">
      <Tabs.FlatList
        data={isBlocked ? null : data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={refresh}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.6}
        removeClippedSubviews={Platform.OS !== "web"}
        ListHeaderComponent={ListHeaderComponent}
        numColumns={3}
        getItemLayout={getItemLayout}
        windowSize={6}
        initialNumToRender={9}
        alwaysBounceVertical={false}
        ListFooterComponent={ListFooterComponent}
        style={useMemo(() => ({ margin: -GAP_BETWEEN_ITEMS }), [])}
      />
    </View>
  );
};

const ProfileTop = ({
  address,
  isBlocked,
}: {
  address?: string;
  isBlocked: boolean;
}) => {
  const router = useRouter();
  const userId = useCurrentUserId();
  const { data: profileData, loading } = useUserProfile({ address });
  const name = getProfileName(profileData?.data.profile);
  const username = profileData?.data.profile.username;
  const bio = profileData?.data.profile.bio;
  const hasLinksInBio = useRef<boolean>(false);
  const colorMode = useColorScheme();
  const { width } = useWindowDimensions();
  const { isFollowing, follow, unfollow } = useMyInfo();
  const profileId = profileData?.data.profile.profile_id;
  const isFollowingUser = useMemo(
    () => profileId && isFollowing(profileId),
    [profileId, isFollowing]
  );
  const { unblock } = useBlock();
  const [showBottomSheet, setShowBottomSheet] = useState<
    "followers" | "following" | null
  >(null);

  const bioWithMentions = useMemo(
    () =>
      reactStringReplace(
        bio,
        /@([\w\d-]+?)\b/g,
        (username: string, i: number) => {
          hasLinksInBio.current = true;
          return (
            <TextLink
              href={`${
                router.pathname.startsWith("/trending") ? "/trending" : ""
              }/profile/${username}`}
              tw="font-bold text-black dark:text-white"
              key={i}
            >
              @{username}
            </TextLink>
          );
        }
      ),
    [bio]
  );

  return (
    <>
      <View pointerEvents="box-none">
        <View
          tw={`bg-gray-100 dark:bg-gray-900 h-[${COVER_IMAGE_HEIGHT}px]`}
          pointerEvents="none"
        >
          <Skeleton
            height={COVER_IMAGE_HEIGHT}
            width={width}
            show={loading}
            colorMode={colorMode as any}
          >
            <Image
              source={{ uri: profileData?.data.profile.cover_url }}
              tw={`h-[${COVER_IMAGE_HEIGHT}px] w-100vw`}
              alt="Cover image"
            />
          </Skeleton>
        </View>

        <View tw="bg-white dark:bg-black px-2" pointerEvents="box-none">
          <View tw="flex-row justify-between pr-2" pointerEvents="box-none">
            <View tw="flex-row items-end" pointerEvents="none">
              <View tw="bg-white dark:bg-gray-900 rounded-full mt-[-72px] p-2">
                <Skeleton
                  height={128}
                  width={128}
                  show={loading}
                  colorMode={colorMode as any}
                  radius={99999}
                >
                  {profileData && (
                    <Image
                      source={{
                        uri: getProfileImage(profileData?.data.profile),
                      }}
                      alt="Profile avatar"
                      tw="border-white h-[128px] w-[128px] rounded-full"
                    />
                  )}
                </Skeleton>
              </View>
            </View>

            {isBlocked ? (
              <View tw="flex-row items-center" pointerEvents="box-none">
                <Button
                  size="regular"
                  onPress={() => {
                    unblock(profileId);
                  }}
                >
                  Unblock
                </Button>
              </View>
            ) : (
              profileId &&
              userId !== profileId && (
                <View tw="flex-row items-center" pointerEvents="box-none">
                  <ProfileDropdown user={profileData?.data.profile} />
                  <View tw="w-2" />
                  <Button
                    size="regular"
                    onPress={() => {
                      if (isFollowingUser) {
                        unfollow(profileId);
                      } else {
                        follow(profileId);
                      }
                    }}
                  >
                    {isFollowingUser ? "Following" : "Follow"}
                  </Button>
                </View>
              )
            )}
          </View>

          <View tw="px-2 py-3" pointerEvents="box-none">
            <View pointerEvents="none">
              <Skeleton
                height={24}
                width={150}
                show={loading}
                colorMode={colorMode as any}
              >
                <Text
                  variant="text-2xl"
                  tw="dark:text-white text-gray-900 font-extrabold"
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </Skeleton>

              <View tw="h-2" />

              <Skeleton
                height={12}
                width={100}
                show={loading}
                colorMode={colorMode as any}
              >
                <View tw="flex-row items-center">
                  <Text
                    variant="text-base"
                    tw="text-gray-900 dark:text-white font-semibold"
                  >
                    {username ? `@${username}` : null}
                  </Text>

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
              <View
                tw="flex-row items-center mt-3"
                pointerEvents={hasLinksInBio.current ? "box-none" : "none"}
              >
                <Text tw="text-sm text-gray-600 dark:text-gray-400">
                  {bioWithMentions}
                </Text>
              </View>
            ) : null}
            <View tw="flex-row mt-4" pointerEvents="box-none">
              <Pressable onPress={() => setShowBottomSheet("following")}>
                <Text tw="text-sm text-gray-900 dark:text-white font-bold">
                  {profileData?.data.following_count}{" "}
                  <Text tw="font-medium">following</Text>
                </Text>
              </Pressable>
              <View tw="ml-8" pointerEvents="box-none">
                <Pressable onPress={() => setShowBottomSheet("followers")}>
                  <Text tw="text-sm text-gray-900 dark:text-white font-bold">
                    {profileData?.data.followers_count}{" "}
                    <Text tw="font-medium">followers</Text>
                  </Text>
                </Pressable>
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
      <BottomSheet
        snapPoints={["75%", "90%"]}
        visible={
          showBottomSheet === "followers" || showBottomSheet === "following"
        }
        onDismiss={() => setShowBottomSheet(null)}
      >
        {showBottomSheet === "followers" ? (
          <FollowersList
            profileId={profileId}
            isFollowingUser={isFollowing}
            follow={follow}
            unFollow={unfollow}
            hideSheet={() => setShowBottomSheet(null)}
          />
        ) : showBottomSheet === "following" ? (
          <FollowingList
            profileId={profileId}
            isFollowingUser={isFollowing}
            follow={follow}
            unFollow={unfollow}
            hideSheet={() => setShowBottomSheet(null)}
          />
        ) : (
          <></>
        )}
      </BottomSheet>
    </>
  );
};

type FollowingListProp = {
  follow: (profileId: number) => void;
  unFollow: (profileId: number) => void;
  hideSheet: () => void;
};

const FollowingListUser = memo(
  ({
    item,
    isFollowingUser,
    follow,
    unFollow,
    hideSheet,
  }: { item: FollowerUser; isFollowingUser: boolean } & FollowingListProp) => {
    return (
      <Link
        href={`/profile/${item.wallet_address}`}
        tw="p-4"
        onPress={hideSheet}
      >
        <View tw="flex-row justify-between items-center">
          <View tw="flex-row">
            <View tw="h-8 w-8 bg-gray-200 rounded-full mr-2">
              <Image source={{ uri: item.img_url }} tw="h-8 w-8 rounded-full" />
            </View>
            <View tw="mr-1 justify-between">
              <Text tw="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                {item.name}
              </Text>
              <View tw="items-center flex-row">
                <Text tw="text-sm text-gray-900 dark:text-white font-semibold">
                  {item.username ? (
                    <>@{item.username}</>
                  ) : (
                    <>{formatAddressShort(item.wallet_address)}</>
                  )}
                </Text>
                {Boolean(item.verified) && (
                  <View tw="ml-1">
                    <VerificationBadge size={14} />
                  </View>
                )}
              </View>
            </View>
          </View>
          {isFollowingUser ? (
            <Button
              onPress={() => unFollow(item.profile_id)}
              variant="tertiary"
            >
              Following
            </Button>
          ) : (
            <Button onPress={() => follow(item.profile_id)}>Follow</Button>
          )}
        </View>
      </Link>
    );
  }
);
const FollowersList = (
  props: {
    profileId?: number;
    isFollowingUser: (profileId: number) => boolean;
  } & FollowingListProp
) => {
  const { data } = useFollowersList(props.profileId);
  const keyExtractor = useCallback((item) => item.id, []);
  const renderItem = useCallback(
    ({ item }: { item: FollowerUser }) => {
      return (
        <FollowingListUser
          item={item}
          isFollowingUser={props.isFollowingUser(item.profile_id)}
          follow={props.follow}
          unFollow={props.unFollow}
          hideSheet={props.hideSheet}
        />
      );
    },
    [props.isFollowingUser, props.unFollow, props.follow, props.hideSheet]
  );

  if (data && data.list) {
    return (
      <BottomSheetFlatList
        data={data.list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    );
  }
  return <></>;
};

const FollowingList = (
  props: {
    profileId?: number;
    isFollowingUser: (profileId: number) => boolean;
  } & FollowingListProp
) => {
  const { data } = useFollowingList(props.profileId);
  const keyExtractor = useCallback((item) => item.id, []);
  const renderItem = useCallback(
    ({ item }: { item: FollowerUser }) => {
      return (
        <FollowingListUser
          item={item}
          isFollowingUser={props.isFollowingUser(item.profile_id)}
          follow={props.follow}
          unFollow={props.unFollow}
          hideSheet={props.hideSheet}
        />
      );
    },
    [props.isFollowingUser, props.unFollow, props.follow, props.hideSheet]
  );

  if (data && data.list) {
    return (
      <BottomSheetFlatList
        data={data.list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    );
  }

  return <></>;
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
