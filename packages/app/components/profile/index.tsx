import { useCallback, useReducer, useMemo, Suspense } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { useSharedValue } from "react-native-reanimated";
import { SceneRendererProps } from "react-native-tab-view-next/src";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import {
  defaultFilters,
  useProfileNftTabs,
  useUserProfile,
} from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useContentWidth } from "app/hooks/use-content-width";
import { useTabState } from "app/hooks/use-tab-state";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { HeaderTabView } from "design-system/tab-view/index";
import { Route } from "design-system/tab-view/src/types";
import { TabSpinner } from "design-system/tab-view/tab-spinner";

import { ErrorBoundary } from "../error-boundary";
import { FilterContext } from "./fillter-context";
import { Profile404 } from "./profile-404";
import { ProfileListFilter } from "./profile-tab-filter";
import { ProfileTabList, ProfileTabListRef } from "./profile-tab-list";
import { ProfileTop } from "./profile-top";

const HEADER_LIGHT_SHADOW =
  "0px 2px 4px rgba(0, 0, 0, 0.05), 0px 4px 8px rgba(0, 0, 0, 0.05)";
const HEADER_DARK_SHADOW =
  "0px 0px 2px rgba(255, 255, 255, 0.5), 0px 8px 16px rgba(255, 255, 255, 0.1)";

const ProfileScreen = ({ username }: { username: string | null }) => {
  return <Profile address={username} />;
};

type Filter = typeof defaultFilters;

const Profile = ({ address }: { address: string | null }) => {
  const {
    data: profileData,
    isError,
    isLoading,
    refresh,
  } = useUserProfile({ address });
  const router = useRouter();

  const { width } = useWindowDimensions();
  const isDark = useIsDarkMode();
  const contentWidth = useContentWidth();
  const { data } = useProfileNftTabs({
    profileId: profileData?.data?.profile.profile_id,
  });
  /**
   * defalut tab index.
   * if Created list = 0, it should go to the Owned section directly.
   * */
  const defaultIndex = useMemo(() => {
    if ((router.query as any)?.tab) return (router.query as any)?.tab;
    const createdIndex =
      data?.tabs.findIndex((item) => item.type === "created") ?? 0;
    const onwedIndex =
      data?.tabs.findIndex((item) => item.type === "owned") ?? 0;
    if (onwedIndex === createdIndex || createdIndex === -1 || onwedIndex === -1)
      return 0;
    const createdCount = data?.tabs[createdIndex].displayed_count ?? 0;
    const ownedCount = data?.tabs[onwedIndex].displayed_count ?? 0;
    return createdCount > 0
      ? createdIndex
      : ownedCount > 0
      ? onwedIndex
      : createdIndex;
  }, [data?.tabs, router]);

  const {
    index,
    setIndex,
    setIsRefreshing,
    isRefreshing,
    setTabRefs,
    currentTab,
  } = useTabState<ProfileTabListRef>([], { defaultIndex });
  const animationHeaderPosition = useSharedValue(0);
  const animationHeaderHeight = useSharedValue(0);

  const { getIsBlocked } = useBlock();
  const isBlocked = getIsBlocked(profileData?.data?.profile.profile_id);

  const headerHeight = useHeaderHeight();

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
  const onStartRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    // Todo: use async/await.
    currentTab?.refresh();
    setIsRefreshing(false);
  }, [currentTab, refresh, setIsRefreshing]);

  const renderScene = useCallback(
    ({
      route: { index: routeIndex },
    }: SceneRendererProps & {
      route: Route;
    }) => {
      return (
        <ErrorBoundary key={`ProfileTabList-${routeIndex}`}>
          <Suspense fallback={<TabSpinner index={routeIndex} />}>
            {data?.tabs[routeIndex] && (
              <ProfileTabList
                username={profileData?.data.profile.username}
                profileId={profileData?.data.profile.profile_id}
                isBlocked={isBlocked}
                list={data?.tabs[routeIndex]}
                index={routeIndex}
                ref={setTabRefs}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      );
    },
    [
      data,
      isBlocked,
      profileData?.data.profile.profile_id,
      profileData?.data.profile.username,
      setTabRefs,
    ]
  );
  const headerBgLeft = useMemo(() => {
    return Math.min(-(width - contentWidth) / 2, 0);
  }, [contentWidth, width]);

  const headerShadow = useMemo(() => {
    return isDark ? HEADER_DARK_SHADOW : HEADER_LIGHT_SHADOW;
  }, [isDark]);

  const renderHeader = useCallback(() => {
    return (
      <View tw="items-center bg-white dark:bg-black">
        {Platform.OS === "web" && (
          <View
            tw="absolute left-0 h-full w-screen bg-white dark:bg-black"
            style={{
              left: headerBgLeft,
              height: `calc(100% + 44px)`,
              // @ts-ignore
              boxShadow: data?.tabs?.length > 0 && headerShadow,
            }}
          />
        )}
        <View tw="web:max-w-screen-xl w-full">
          {Platform.OS === "ios" && <View tw={`h-[${headerHeight}px]`} />}
          <ProfileTop
            address={address}
            animationHeaderPosition={animationHeaderPosition}
            animationHeaderHeight={animationHeaderHeight}
            isBlocked={isBlocked}
            profileData={profileData?.data}
            isLoading={isLoading}
            isError={isError}
          />
        </View>
      </View>
    );
  }, [
    headerBgLeft,
    data?.tabs?.length,
    headerShadow,
    headerHeight,
    address,
    animationHeaderPosition,
    animationHeaderHeight,
    isBlocked,
    profileData?.data,
    isLoading,
    isError,
  ]);

  const routes = useMemo(
    () =>
      data?.tabs?.map((item, index) => ({
        title: item?.name?.replace(/^\S/, (s) => s.toUpperCase()),
        key: item?.name,
        index,
      })) ?? [],
    [data]
  );

  return (
    <FilterContext.Provider value={{ filter, dispatch }}>
      <View style={{ width: contentWidth }} tw="flex-1">
        <HeaderTabView
          onStartRefresh={onStartRefresh}
          isRefreshing={isRefreshing}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderScrollHeader={renderHeader}
          minHeaderHeight={Platform.select({
            default: headerHeight,
            android: 0,
          })}
          refreshControlTop={Platform.select({
            ios: headerHeight,
            default: 0,
          })}
          initialLayout={{
            width: contentWidth,
          }}
          style={tw.style("z-1")}
          autoWidthTabBar
          emptyBodyComponent={isError ? <Profile404 /> : null}
          animationHeaderPosition={animationHeaderPosition}
          animationHeaderHeight={animationHeaderHeight}
          insertStickyTabBarElement={
            <View
              tw="absolute left-0 top-0 h-full w-screen bg-white dark:bg-black"
              style={{
                left: headerBgLeft,
                // @ts-ignore
                boxShadow: headerShadow,
              }}
            />
          }
          insertTabBarElement={
            <View tw="z-1 relative my-2 w-full flex-row items-center justify-between px-4 md:absolute md:bottom-1.5 md:right-10 md:my-0 md:w-auto">
              <Text tw="text-xs font-bold text-gray-900 dark:text-white md:mr-6">
                {data?.tabs[index]?.displayed_count} ITEMS
              </Text>
              <ProfileListFilter />
            </View>
          }
        />
      </View>
    </FilterContext.Provider>
  );
};

export { ProfileScreen as Profile };
