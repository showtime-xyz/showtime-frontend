import { useCallback, useReducer, useMemo, Suspense } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { useSharedValue } from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  SceneRendererProps,
  HeaderTabView,
  Route,
  TabSpinner,
} from "@showtime-xyz/universal.tab-view";
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

import { CARD_DARK_SHADOW, CARD_LIGHT_SHADOW } from "design-system/theme";

import { ErrorBoundary } from "../error-boundary";
import { TabFallback } from "../error-boundary/tab-fallback";
import { FilterContext } from "./fillter-context";
import { Profile404 } from "./profile-404";
import { ProfileListFilter } from "./profile-tab-filter";
import { ProfileTabList, ProfileTabListRef } from "./profile-tab-list";
import { ProfileTop } from "./profile-top";

export type ProfileScreenProps = {
  username: string;
};

const ProfileScreen = ({ username }: ProfileScreenProps) => {
  return <Profile username={username} />;
};

type Filter = typeof defaultFilters;

const Profile = ({ username }: ProfileScreenProps) => {
  const {
    data: profileData,
    isError,
    isLoading,
    mutate,
  } = useUserProfile({ address: username });

  const { width } = useWindowDimensions();
  const isDark = useIsDarkMode();
  const contentWidth = useContentWidth();
  const { data } = useProfileNftTabs({
    profileId: profileData?.data?.profile.profile_id,
  });

  const routes =
    data?.tabs.map((item, index) => ({
      title: item?.name?.replace(/^\S/, (s) => s.toUpperCase()), // use js instead of css reason: design requires `This week` instead of `This Week`.
      key: item?.name,
      index,
    })) ?? [];

  const {
    index,
    setIndex,
    setIsRefreshing,
    isRefreshing,
    currentTab,
    tabRefs,
  } = useTabState<ProfileTabListRef>(routes, {
    defaultIndex: data?.tabs.findIndex(
      (item) => item.type === data?.default_tab_type
    ),
  });
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
    await mutate();
    // Todo: use async/await.
    currentTab?.refresh();
    setIsRefreshing(false);
  }, [currentTab, mutate, setIsRefreshing]);

  const renderScene = useCallback(
    ({
      route: { index: routeIndex },
    }: SceneRendererProps & {
      route: Route;
    }) => {
      return (
        <ErrorBoundary
          renderFallback={(props) => (
            <TabFallback {...props} index={routeIndex} />
          )}
          key={`ProfileTabList-${routeIndex}`}
        >
          <Suspense fallback={<TabSpinner index={routeIndex} />}>
            {data?.tabs[routeIndex] && (
              <ProfileTabList
                username={profileData?.data?.profile.username}
                profileId={profileData?.data?.profile.profile_id}
                isBlocked={isBlocked}
                list={data?.tabs[routeIndex]}
                index={routeIndex}
                ref={(ref) => (tabRefs.current[index] = ref)}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      );
    },
    [
      data?.tabs,
      index,
      isBlocked,
      profileData?.data?.profile.profile_id,
      profileData?.data?.profile.username,
      tabRefs,
    ]
  );
  const headerBgLeft = useMemo(() => {
    return Math.min(-(width - contentWidth) / 2, 0);
  }, [contentWidth, width]);

  const headerShadow = useMemo(() => {
    return isDark ? CARD_DARK_SHADOW : CARD_LIGHT_SHADOW;
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
          {Platform.OS === "ios" && <View style={{ height: headerHeight }} />}
          <ProfileTop
            address={username}
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
    username,
    animationHeaderPosition,
    animationHeaderHeight,
    isBlocked,
    profileData?.data,
    isLoading,
    isError,
  ]);

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
            <View tw="z-1 relative w-full flex-row items-center justify-between bg-white py-2 px-4 dark:bg-black md:absolute md:bottom-1.5 md:right-10 md:my-0 md:w-auto md:py-0 md:px-0">
              <Text tw="text-xs font-bold text-gray-900 dark:text-white md:mr-6">
                {data?.tabs[index]?.displayed_count} ITEMS
              </Text>
              <ProfileListFilter />
            </View>
          }
          sceneContainerStyle={Platform.select({
            web: tw.style("md:mt-0 md:mt-4"),
            default: null,
          })}
        />
      </View>
    </FilterContext.Provider>
  );
};

export { ProfileScreen as Profile };
