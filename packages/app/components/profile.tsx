import {
  Suspense,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";
import { Dimensions, Platform, useWindowDimensions } from "react-native";

import {
  useBottomTabBarHeight,
  BottomTabBarHeightContext,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import reactStringReplace from "react-string-replace";

import { ErrorBoundary } from "app/components/error-boundary";
import { ProfileDropdown } from "app/components/profile-dropdown";
import { MintContext } from "app/context/mint-context";
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
import { TextLink } from "app/navigation/link";
import { useRouter } from "app/navigation/use-router";

import {
  View,
  Spinner,
  Text,
  Skeleton,
  Button,
  ModalSheet,
  Select,
} from "design-system";
import { Avatar } from "design-system/avatar";
import { useColorScheme } from "design-system/hooks";
import { Image } from "design-system/image";
import { Media } from "design-system/media";
import { Pressable } from "design-system/pressable-scale";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";
import { useToast } from "design-system/toast";
import { VerificationBadge } from "design-system/verification-badge";

import { getProfileImage, getProfileName, getSortFields } from "../utilities";
import { FollowersList, FollowingList } from "./following-user-list";

const COVER_IMAGE_HEIGHT = 104;

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  const colorMode = useColorScheme();
  const { width } = useWindowDimensions();
  const squareSize = width / 3;
  const tabBarHeight = useContext(BottomTabBarHeightContext)
    ? useBottomTabBarHeight()
    : 0;

  if (isLoading) {
    return (
      <View tw={`flex-row mb-[${tabBarHeight}px]`}>
        <View tw="mt-[1px] mr-[1px]">
          <Skeleton
            colorMode={colorMode}
            height={squareSize}
            width={squareSize}
            radius={0}
          />
        </View>
        <View tw="mt-[1px] mx-[1px]">
          <Skeleton
            colorMode={colorMode}
            height={squareSize}
            width={squareSize - 2}
            radius={0}
          />
        </View>
        <View tw="mt-[1px] ml-[1px]">
          <Skeleton
            colorMode={colorMode}
            height={squareSize}
            width={squareSize}
            radius={0}
          />
        </View>
      </View>
    );
  }

  return <View tw={`h-[${tabBarHeight}px]`} />;
};

const ProfileScreen = ({ walletAddress }: { walletAddress: string }) => {
  return <Profile address={walletAddress} />;
};

const Profile = ({ address }: { address?: string }) => {
  const toast = useToast();
  const { data: profileData } = useUserProfile({ address });
  const { data, loading: tabsLoading } = useProfileNftTabs({
    profileId: profileData?.data?.profile.profile_id,
  });
  const { data: myInfoData } = useMyInfo();
  const isBlocked = Boolean(
    myInfoData?.data?.blocked_profile_ids?.find(
      (id) => id === profileData?.data?.profile.profile_id
    )
  );
  const [selected, setSelected] = useState(0);
  const colorScheme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const { state: mintingState } = useContext(MintContext);

  useEffect(() => {
    if (
      mintingState.status === "mediaUpload" ||
      mintingState.status === "nftJSONUpload" ||
      mintingState.status === "minting" ||
      mintingState.status === "transactionCompleted"
    ) {
      toast?.show({
        element: (
          <View tw="flex-row items-center p-5">
            <Spinner size={20} />
            <View tw="mx-1" />
            <Text tw="dark:text-white text-black">Creating...</Text>
          </View>
        ),
        hideAfter: 4000,
      });
    }

    if (mintingState.status === "mintingSuccess") {
      toast?.show({
        message: "Created 🎉 Your NFT will appear in a minute!",
        hideAfter: 4000,
      });
    }
  }, [mintingState]);

  return (
    <View tw="bg-white dark:bg-black flex-1">
      <Tabs.Root
        onIndexChange={setSelected}
        initialIndex={selected}
        tabListHeight={TAB_LIST_HEIGHT}
        lazy
      >
        <Tabs.Header>
          {Platform.OS !== "android" && <View tw={`h-[${headerHeight}px]`} />}
          <ProfileTop address={address} isBlocked={isBlocked} />
        </Tabs.Header>
        {data?.data.lists ? (
          <>
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
                  <ErrorBoundary>
                    <Suspense fallback={<Spinner size="small" />} key={list.id}>
                      <TabList
                        username={profileData?.data.profile.username}
                        profileId={profileData?.data.profile.profile_id}
                        isBlocked={isBlocked}
                        list={list}
                      />
                    </Suspense>
                  </ErrorBoundary>
                );
              })}
            </Tabs.Pager>
          </>
        ) : tabsLoading ? (
          <Tabs.List
            style={tw.style(
              `h-[${TAB_LIST_HEIGHT}px] dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900 ml-4 mt-4`
            )}
          >
            <Tabs.Trigger>
              <View tw="w-22">
                <Skeleton colorMode={colorScheme} width={74} height={20} />
              </View>
            </Tabs.Trigger>
            <Tabs.Trigger>
              <View tw="w-22">
                <Skeleton colorMode={colorScheme} width={74} height={20} />
              </View>
            </Tabs.Trigger>
            <Tabs.Trigger>
              <View tw="w-20">
                <Skeleton colorMode={colorScheme} width={70} height={20} />
              </View>
            </Tabs.Trigger>
          </Tabs.List>
        ) : null}
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
  const router = useRouter();
  const { state: mintingState } = useContext(MintContext);

  const [filter, dispatch] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case "collection_change":
          return { ...state, collectionId: action.payload };
        case "sort_change":
          return { ...state, sortId: action.payload };
      }
    },
    // { ...defaultFilters, sortId: list.sort_id }
    { ...defaultFilters }
  );

  const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useProfileNFTs({
      listId: list.id,
      profileId,
      collectionId: filter.collectionId,
      sortId: filter.sortId,
      refreshInterval: 1000,
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

  const onItemPress = useCallback(
    (index: number) => {
      router.push(
        `/swipeList?initialScrollIndex=${index}&listId=${list.id}&profileId=${profileId}&collectionId=${filter.collectionId}&sortId=${filter.sortId}&type=profile`
      );
    },
    [list.id, profileId, filter.collectionId, filter.sortId]
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <Pressable onPress={() => onItemPress(index)}>
        <Media item={item} numColumns={3} />
      </Pressable>
    ),
    [onItemPress]
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

  const listStyle = useMemo(() => ({ margin: -GAP_BETWEEN_ITEMS }), []);

  return (
    <Tabs.FlatList
      data={
        isBlocked
          ? null
          : mintingState.status !== "idle" &&
            mintingState.tokenId !== data?.[0]?.token_id
          ? [
              {
                loading: true,
                chain_name: "polygon",
                contract_address: "0x8a13628dd5d600ca1e8bf9dbc685b735f615cb90",
                token_id: mintingState.tokenId ?? "1",
                source_url: mintingState.filePath ?? "",
                mime_type: mintingState.fileType ?? "image/jpeg",
              },
              ...data,
            ]
          : data
      }
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
      style={listStyle}
    />
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
  const tabBarHeight = useContext(BottomTabBarHeightContext)
    ? useBottomTabBarHeight()
    : 0;
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
              href={`/profile/${username}`}
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
              <View tw="bg-white dark:bg-black rounded-full mt-[-72px] p-2">
                <Skeleton
                  height={128}
                  width={128}
                  show={loading}
                  colorMode={colorMode as any}
                  radius={99999}
                >
                  {profileData && (
                    <Avatar
                      url={getProfileImage(profileData?.data.profile)}
                      size={128}
                    />
                  )}
                </Skeleton>
              </View>
            </View>

            {isBlocked ? (
              <View tw="flex-row items-center" pointerEvents="box-none">
                <Button
                  size="small"
                  onPress={() => {
                    unblock(profileId);
                  }}
                >
                  Unblock
                </Button>
              </View>
            ) : profileId && userId !== profileId ? (
              <View tw="flex-row items-center" pointerEvents="box-none">
                <ProfileDropdown user={profileData?.data.profile} />
                <View tw="w-2" />
                <Button
                  size="small"
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
            ) : userId === profileId ? (
              <View tw="flex-row items-center" pointerEvents="box-none">
                <Button
                  size="small"
                  onPress={() => {
                    router.push("/editProfile");
                  }}
                >
                  Edit profile
                </Button>
              </View>
            ) : null}
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
      <ModalSheet
        snapPoints={["85%"]}
        title={showBottomSheet === "followers" ? "Followers" : "Following"}
        visible={
          showBottomSheet === "followers" || showBottomSheet === "following"
        }
        close={() => setShowBottomSheet(null)}
        onClose={() => setShowBottomSheet(null)}
      >
        <>
          {showBottomSheet === "followers" ? (
            <FollowersList
              profileId={profileId}
              hideSheet={() => setShowBottomSheet(null)}
            />
          ) : showBottomSheet === "following" ? (
            <FollowingList
              profileId={profileId}
              hideSheet={() => setShowBottomSheet(null)}
            />
          ) : (
            <></>
          )}
          <View tw={`h-[${tabBarHeight}px]`} />
        </>
      </ModalSheet>
    </>
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
