import {
  useCallback,
  useReducer,
  useMemo,
  createContext,
  useContext,
  memo,
} from "react";
import { useWindowDimensions } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";
import chuck from "lodash/chunk";
import { useSharedValue } from "react-native-reanimated";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Route, TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { EmptyPlaceholder } from "app/components/empty-placeholder";
import {
  defaultFilters,
  useProfileNFTs,
  useProfileNftTabs,
  UserProfile,
  useUserProfile,
} from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useContentWidth } from "app/hooks/use-content-width";
import { useScrollbarSize } from "app/hooks/use-scrollbar-size";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { createParam } from "app/navigation/use-param";
import { MutateProvider } from "app/providers/mutate-provider";
import { NFT } from "app/types";

import { Spinner } from "design-system/spinner";
import { breakpoints } from "design-system/theme";

import { FilterContext } from "./fillter-context";
import { ProfileListFilter } from "./profile-tab-filter";
import { ProfileTop } from "./profile-top";

export type ProfileScreenProps = {
  username: string;
};

const ProfileScreen = ({ username }: ProfileScreenProps) => {
  return <Profile username={username} />;
};

type Filter = typeof defaultFilters;
const { useParam } = createParam();

const ProfileHeaderContext = createContext<{
  profileData?: undefined | UserProfile;
  username: string;
  isError: boolean;
  isLoading: boolean;
  routes: Route[];
  displayedCount: number | undefined;
  defaultIndex: number;
}>({
  profileData: undefined,
  username: "",
  isError: false,
  isLoading: false,
  routes: [],
  displayedCount: 0,
  defaultIndex: 0,
});

const Header = memo(function Header() {
  const context = useContext(ProfileHeaderContext);
  const animationHeaderPosition = useSharedValue(0);
  const animationHeaderHeight = useSharedValue(0);
  const headerHeight = useHeaderHeight();
  const {
    profileData,
    isError,
    isLoading,
    username,
    routes,
    displayedCount,
    defaultIndex,
  } = context;
  const [selected, setSelected] = useParam("tab", {
    parse: (v) => Number(v ?? defaultIndex),
    initial: defaultIndex,
  });

  const { getIsBlocked } = useBlock();
  const profileId = profileData?.profile.profile_id;

  const isBlocked = getIsBlocked(profileId);

  return (
    <View tw="dark:shadow-dark shadow-light items-center bg-white dark:bg-black">
      <View tw="w-full max-w-screen-xl">
        <View style={{ height: headerHeight }} />
        <ProfileTop
          address={username}
          animationHeaderPosition={animationHeaderPosition}
          animationHeaderHeight={animationHeaderHeight}
          isBlocked={isBlocked}
          profileData={profileData}
          isLoading={isLoading}
          isError={isError}
        />
        <View tw="bg-white dark:bg-black">
          <View tw="mx-auto w-full max-w-screen-xl">
            <TabBarSingle
              onPress={setSelected}
              routes={routes}
              index={selected}
            />
            <View tw="z-1 relative w-full flex-row items-center justify-between bg-white py-2 px-4 dark:bg-black md:absolute md:bottom-1.5 md:right-10 md:my-0 md:w-auto md:py-0 md:px-0">
              <Text tw="text-xs font-bold text-gray-900 dark:text-white md:mr-6">
                {displayedCount} ITEMS
              </Text>
              <ProfileListFilter />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

const Profile = ({ username }: ProfileScreenProps) => {
  const {
    data: profileData,
    isError,
    isLoading: profileIsLoading,
  } = useUserProfile({ address: username });
  const [index] = useParam("tab", {
    parse: (v) => Number(v ?? 1),
    initial: 1,
  });
  const { width: scrollbarWidth } = useScrollbarSize();
  const [type] = useParam("type");
  const { width, height: screenHeight } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const contentWidth = useContentWidth();
  const profileId = profileData?.data?.profile.profile_id;

  const { data } = useProfileNftTabs({
    profileId: profileId,
  });
  const defaultIndex =
    data?.tabs.findIndex(
      (item) => item.type === (type ? type : data?.default_tab_type)
    ) ?? 0;

  const [filter, dispatch] = useReducer(
    (state: Filter, action: any): Filter => {
      switch (action.type) {
        case "collection_change":
          return { ...state, collectionId: action.payload };
        case "sort_change":
          return { ...state, sortType: action.payload };
        default:
          return state;
      }
    },
    { ...defaultFilters }
  );
  const routes = useMemo(
    () =>
      data?.tabs.map((item, index) => ({
        title: item?.name?.replace(/^\S/, (s) => s.toUpperCase()), // use js instead of css reason: design requires `This week` instead of `This Week`.
        key: item?.name,
        index,
      })) ?? [],
    [data?.tabs]
  );

  const {
    isLoading,
    data: list,
    fetchMore,
    updateItem,
    isLoadingMore,
  } = useProfileNFTs({
    tabType: data?.tabs[index].type,
    profileId: profileId,
    collectionId: filter.collectionId,
    sortType: filter.sortType,
  });
  const numColumns =
    contentWidth <= breakpoints["md"]
      ? 3
      : contentWidth >= breakpoints["lg"]
      ? 3
      : 2;

  const chuckList = useMemo(() => {
    return chuck(list, numColumns);
  }, [list, numColumns]);

  const keyExtractor = useCallback(
    (item: NFT[], index: number) => `${index}`,
    []
  );
  const renderItem = useCallback(
    ({
      item: chuckItem,
      index: itemIndex,
    }: ListRenderItemInfo<NFT[] & { loading?: boolean }>) => {
      return (
        <View
          tw="mx-auto mb-px flex-row space-x-1 px-0 md:space-x-6 md:px-6 lg:space-x-8 lg:px-4 xl:px-0"
          style={{ maxWidth: contentWidth }}
        >
          {chuckItem.map((item) => (
            <Card
              key={item.nft_id}
              nft={item}
              numColumns={numColumns}
              onPress={() => onItemPress(item.nft_id)}
              href={`/list?initialScrollIndex=${itemIndex}&tabType=${data?.tabs[index].type}&profileId=${profileId}&collectionId=${filter.collectionId}&sortType=${filter.sortType}&type=profile`}
            />
          ))}
          {chuckItem.length < numColumns &&
            new Array(numColumns - chuckItem.length)
              .fill(0)
              .map((_, itemIndex) => (
                <View key={itemIndex.toString()} tw="flex-1" />
              ))}
        </View>
      );
    },
    [
      contentWidth,
      data?.tabs,
      filter.collectionId,
      filter.sortType,
      index,
      numColumns,
      profileId,
    ]
  );
  const ListFooterComponent = useCallback(() => {
    // Todo: wait to confirm whether to use card or spinner, because CardSkeleton I think not good.
    if (isLoadingMore) {
      return (
        <View
          tw="mx-auto h-20 flex-row items-center justify-center"
          style={{ maxWidth: contentWidth }}
        >
          <Spinner />
          {/* {new Array(numColumns).fill(0).map((_, i) => (
            <CardSkeleton
              squareSize={contentWidth / 3}
              tw="flex-1"
              key={`Card-Skeleton-${i}`}
              spacing={0}
            />
          ))} */}
        </View>
      );
    }
    return null;
  }, [contentWidth, isLoadingMore]);

  return (
    <ProfileHeaderContext.Provider
      value={{
        profileData: profileData?.data,
        username,
        isError,
        isLoading: profileIsLoading,
        routes,
        displayedCount: data?.tabs[index]?.displayed_count,
        defaultIndex,
      }}
    >
      <FilterContext.Provider value={{ filter, dispatch }}>
        <View style={{ width: width - scrollbarWidth }} tw="flex-1">
          <MutateProvider mutate={updateItem}>
            <InfiniteScrollList
              useWindowScroll={isMdWidth}
              ListHeaderComponent={Header}
              numColumns={1}
              data={chuckList}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              estimatedItemSize={contentWidth / numColumns}
              overscan={{
                main: contentWidth / numColumns,
                reverse: contentWidth / numColumns,
              }}
              style={{
                marginTop: isMdWidth ? 16 : 0,
                marginLeft: "auto",
                marginRight: "auto",
                height: screenHeight - 64,
              }}
              ListEmptyComponent={() => {
                if (isLoading) return null;
                return (
                  <EmptyPlaceholder
                    title="No results found"
                    tw="h-[50vh]"
                    hideLoginBtn
                  />
                );
              }}
              ListFooterComponent={ListFooterComponent}
              onEndReached={fetchMore}
              gridItemProps={{
                style: { marginVertical: isMdWidth ? 16 : 0 },
              }}
            />
          </MutateProvider>
        </View>
      </FilterContext.Provider>
    </ProfileHeaderContext.Provider>
  );
};

export { ProfileScreen as Profile };
function onItemPress(nft_id: any) {
  throw new Error("Function not implemented.");
}
