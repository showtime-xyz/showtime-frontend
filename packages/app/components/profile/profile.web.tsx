import {
  useCallback,
  useReducer,
  useMemo,
  createContext,
  useContext,
  memo,
  useEffect,
  useState,
} from "react";
import { useWindowDimensions } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";
import chuck from "lodash/chunk";
import { stringify } from "querystring";
import type { ParsedUrlQuery } from "querystring";
import { useSharedValue } from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { Route, TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
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
  isBlocked: boolean;
  index: number;
  setIndex: (index: number) => void;
}>({
  profileData: undefined,
  username: "",
  isError: false,
  isLoading: false,
  routes: [],
  displayedCount: 0,
  isBlocked: false,
  index: 0,
  setIndex: () => {},
});

const Header = memo(function Header() {
  const context = useContext(ProfileHeaderContext);
  const animationHeaderPosition = useSharedValue(0);
  const animationHeaderHeight = useSharedValue(0);
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  const {
    profileData,
    isError,
    isLoading,
    username,
    routes,
    displayedCount,
    isBlocked,
    index,
    setIndex,
  } = context;

  const onPress = useCallback(
    (itemIndex: number) => {
      const newQuery = {
        ...router.query,
        tab: itemIndex.toString(),
      } as ParsedUrlQuery;
      const { username = null, ...restQuery } = newQuery;
      const queryPath = stringify(restQuery) ? `?${stringify(restQuery)}` : "";
      /**
       * because this packages/app/pages/profile/index.web.tsx file, we did rename route,
       * so need to avoid triggering route changes when switching tabs.
       */
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        username ? `/@${username}${queryPath}` : ""
      );
      setIndex(itemIndex);
    },
    [router, setIndex]
  );
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
            <TabBarSingle onPress={onPress} routes={routes} index={index} />
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
  const isDark = useIsDarkMode();
  const { width, height: screenHeight } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const contentWidth = useContentWidth();
  const { getIsBlocked } = useBlock();

  const profileId = profileData?.data?.profile.profile_id;
  const isBlocked = getIsBlocked(profileId);

  const { data, isLoading: profileTabIsLoading } = useProfileNftTabs({
    profileId: profileId,
  });
  const routes = useMemo(
    () =>
      data?.tabs.map((item, index) => ({
        title: item?.name?.replace(/^\S/, (s) => s.toUpperCase()), // use js instead of css reason: design requires `This week` instead of `This Week`.
        key: item?.name,
        index,
      })) ?? [],
    [data?.tabs]
  );

  const [index, setIndex] = useState(0);
  const [queryTab] = useParam("tab");
  useEffect(() => {
    const defaultIndex =
      data?.tabs.findIndex((item) => item.type === data?.default_tab_type) ?? 0;
    setIndex(queryTab ? +queryTab : defaultIndex);
  }, [data?.default_tab_type, data?.tabs, queryTab]);

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
  // Todo: execute fetch list when have defaultIndex, avoid duplication fetch.
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
    (_item: NFT[], index: number) => `${index}`,
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
          {chuckItem.map((item, chuckItemIndex) => (
            <Card
              key={item.nft_id}
              nft={item}
              numColumns={numColumns}
              href={`/list?initialScrollIndex=${
                itemIndex * numColumns + chuckItemIndex
              }&tabType=${
                data?.tabs[index].type
              }&profileId=${profileId}&collectionId=${
                filter.collectionId
              }&sortType=${filter.sortType}&type=profile`}
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
    if (!isLoadingMore) return null;
    return (
      <View
        tw="mx-auto h-20 flex-row items-center justify-center"
        style={{ maxWidth: contentWidth }}
      >
        <Spinner secondaryColor={isDark ? colors.gray[700] : "#fff"} />
      </View>
    );
  }, [contentWidth, isDark, isLoadingMore]);

  return (
    <ProfileHeaderContext.Provider
      value={{
        profileData: profileData?.data,
        username,
        isError,
        isLoading: profileIsLoading && profileTabIsLoading,
        routes,
        displayedCount: data?.tabs[index]?.displayed_count,
        index,
        setIndex,
        isBlocked,
      }}
    >
      <FilterContext.Provider value={{ filter, dispatch }}>
        <View tw="w-full">
          <MutateProvider mutate={updateItem}>
            <InfiniteScrollList
              useWindowScroll={isMdWidth}
              ListHeaderComponent={Header}
              numColumns={1}
              data={isBlocked ? [] : chuckList}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              estimatedItemSize={contentWidth / numColumns}
              overscan={{
                main: contentWidth / numColumns,
                reverse: contentWidth / numColumns,
              }}
              style={{
                height: screenHeight - 64,
              }}
              ListEmptyComponent={() => {
                if (isLoading) return null;
                return (
                  <EmptyPlaceholder
                    title={
                      isBlocked ? (
                        <Text tw="text-gray-900 dark:text-white">
                          <Text tw="font-bold">@{username}</Text> is blocked
                        </Text>
                      ) : (
                        "No results found"
                      )
                    }
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
