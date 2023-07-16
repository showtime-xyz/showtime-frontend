import {
  useCallback,
  useReducer,
  useMemo,
  createContext,
  useContext,
  memo,
  useState,
  useEffect,
} from "react";
import { useWindowDimensions } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";
import chunk from "lodash/chunk";
import { stringify } from "querystring";
import type { ParsedUrlQuery } from "querystring";
import { useSharedValue } from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { Route, TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import {
  defaultFilters,
  useProfileNFTs,
  useProfileNftTabs,
  UserProfile,
  useUserProfile,
} from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useContentWidth } from "app/hooks/use-content-width";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useScrollbarSize } from "app/hooks/use-scrollbar-size";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useUser } from "app/hooks/use-user";
import { createParam } from "app/navigation/use-param";
import { MutateProvider } from "app/providers/mutate-provider";
import { NFT } from "app/types";
import { formatProfileRoutes } from "app/utilities";

import { Spinner } from "design-system/spinner";
import { breakpoints } from "design-system/theme";

import { EmptyPlaceholder } from "../empty-placeholder";
import { FilterContext } from "./fillter-context";
import { ProfileError } from "./profile-error";
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
  isBlocked: boolean;
  type: string | undefined;
  setType: (type: string) => void;
}>({
  profileData: undefined,
  username: "",
  isError: false,
  isLoading: false,
  routes: [],
  isBlocked: false,
  type: undefined,
  setType: () => {},
});

const Header = memo(function Header() {
  const context = useContext(ProfileHeaderContext);
  const animationHeaderPosition = useSharedValue(0);
  const animationHeaderHeight = useSharedValue(0);
  const router = useRouter();

  const {
    profileData,
    isError,
    isLoading,
    username,
    routes,
    isBlocked,
    type,
    setType,
  } = context;

  const onPress = useCallback(
    (index: number) => {
      const currentType = routes[index].key;
      const newQuery = {
        ...router.query,
        type: currentType,
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
      setType(currentType);
    },
    [router, routes, setType]
  );

  return (
    <View tw="items-center bg-white dark:bg-black">
      <View tw="w-full max-w-screen-xl">
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
          <View tw="mx-auto min-h-[43px] w-full max-w-screen-xl px-0 md:px-2 xl:px-0">
            <TabBarSingle
              onPress={onPress}
              routes={routes}
              index={routes.findIndex((item) => item.key === type)}
            />
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
    error,
  } = useUserProfile({ address: username });
  const profileId = profileData?.data?.profile.profile_id;
  const { getIsBlocked } = useBlock();
  const bottomBarHeight = usePlatformBottomHeight();
  const isBlocked = getIsBlocked(profileId);
  const { user } = useUser();
  const { width: scrollbarWidth } = useScrollbarSize();
  const { data, isLoading: profileTabIsLoading } = useProfileNftTabs({
    profileId: profileId,
  });
  const isDark = useIsDarkMode();
  const { height: screenHeight, width } = useWindowDimensions();

  const contentWidth = useContentWidth();
  const isMdWidth = contentWidth >= breakpoints["md"];
  const numColumns =
    width <= breakpoints["lg"] && width >= breakpoints["md"] ? 2 : 3;

  const routes = useMemo(() => formatProfileRoutes(data?.tabs), [data?.tabs]);

  const [queryTab] = useParam("type", {
    initial: data?.default_tab_type,
  });
  const [type, setType] = useState(queryTab);
  useEffect(() => {
    if (!data?.default_tab_type || type) return;
    setType(data?.default_tab_type);
  }, [data?.default_tab_type, type]);

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

  const {
    isLoading,
    data: list,
    fetchMore,
    updateItem,
    isLoadingMore,
  } = useProfileNFTs({
    tabType: type,
    profileId: profileId,
    collectionId: filter.collectionId,
    sortType: filter.sortType,
  });

  const chuckList = useMemo(() => {
    return chunk(list, numColumns);
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
        <View tw="mx-auto mb-px max-w-screen-xl flex-row space-x-px px-0 md:space-x-6 md:px-4 lg:space-x-8">
          {chuckItem.map((item, chuckItemIndex) => (
            <Card
              index={itemIndex}
              key={item.nft_id}
              nft={item}
              numColumns={numColumns}
              as={getNFTSlug(item)}
              href={`${getNFTSlug(item)}?initialScrollIndex=${
                itemIndex * numColumns + chuckItemIndex
              }&tabType=${type}&profileId=${profileId}&collectionId=${
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
    [filter.collectionId, filter.sortType, numColumns, profileId, type]
  );
  const ListFooterComponent = useCallback(() => {
    if ((isLoadingMore || profileIsLoading) && !error) {
      return (
        <View
          tw="mx-auto h-20 flex-row items-center justify-center"
          style={{ maxWidth: contentWidth }}
        >
          <Spinner secondaryColor={isDark ? colors.gray[700] : "#fff"} />
        </View>
      );
    }
    return null;
  }, [contentWidth, isDark, isLoadingMore, profileIsLoading, error]);

  const ListEmptyComponent = useCallback(() => {
    if (error || isBlocked) {
      return (
        <ProfileError error={error} isBlocked={isBlocked} username={username} />
      );
    }

    if (
      chuckList.length === 0 &&
      !isLoading &&
      !profileIsLoading &&
      !error &&
      type &&
      !isBlocked
    ) {
      return (
        <EmptyPlaceholder tw="h-[50vh]" title="No drops, yet." hideLoginBtn />
      );
    }
    return null;
  }, [
    error,
    isBlocked,
    chuckList.length,
    isLoading,
    profileIsLoading,
    type,
    username,
  ]);
  return (
    <ProfileHeaderContext.Provider
      value={{
        profileData: profileData?.data,
        username,
        isError,
        isLoading: profileIsLoading && profileTabIsLoading,
        routes,
        type,
        setType: setType,
        isBlocked,
      }}
    >
      <FilterContext.Provider value={{ filter, dispatch }}>
        <View
          tw="w-full"
          style={
            isMdWidth
              ? {
                  width: `calc(100% - ${scrollbarWidth}px)`,
                  marginLeft: scrollbarWidth,
                }
              : {}
          }
        >
          <MutateProvider mutate={updateItem}>
            <ProfileTabsNFTProvider
              tabType={
                user?.data?.profile?.profile_id === profileId ? type : undefined
              }
            >
              <InfiniteScrollList
                useWindowScroll={isMdWidth}
                ListHeaderComponent={Header}
                numColumns={1}
                preserveScrollPosition
                data={isBlocked ? [] : chuckList}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                style={{
                  height: screenHeight - bottomBarHeight,
                }}
                overscan={9}
                ListEmptyComponent={ListEmptyComponent}
                ListFooterComponent={ListFooterComponent}
                onEndReached={fetchMore}
              />
            </ProfileTabsNFTProvider>
          </MutateProvider>
        </View>
      </FilterContext.Provider>
    </ProfileHeaderContext.Provider>
  );
};

export { ProfileScreen as Profile };
