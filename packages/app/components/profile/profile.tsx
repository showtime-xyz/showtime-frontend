import { useCallback, useReducer, Suspense, useMemo } from "react";
import { Platform, StatusBar } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useSharedValue } from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import {
  SceneRendererProps,
  HeaderTabView,
  Route,
  TabSpinner,
  ScollableAutoWidthTabBar,
  NavigationState,
} from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import {
  DEFAULT_HADER_HEIGHT,
  Header,
  HeaderLeft,
} from "app/components/header";
import { HeaderDropdown } from "app/components/header-dropdown";
import {
  defaultFilters,
  useProfileNftTabs,
  useUserProfile,
} from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useContentWidth } from "app/hooks/use-content-width";
import { useTabState } from "app/hooks/use-tab-state";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { createParam } from "app/navigation/use-param";
import { formatProfileRoutes, getProfileName } from "app/utilities";

import { ErrorBoundary } from "../error-boundary";
import { TabFallback } from "../error-boundary/tab-fallback";
import { FilterContext } from "./fillter-context";
import { ProfileError } from "./profile-error";
import { ProfileTabList, ProfileTabListRef } from "./profile-tab-list";
import { ProfileTop } from "./profile-top";

export type ProfileScreenProps = {
  username: string;
};

const ProfileScreen = ({ username }: ProfileScreenProps) => {
  return <Profile username={username} />;
};

type Filter = typeof defaultFilters;
const { useParam } = createParam();

const Profile = ({ username }: ProfileScreenProps) => {
  const {
    data: profileData,
    isError,
    isLoading,
    mutate,
    error,
  } = useUserProfile({ address: username });
  const [type] = useParam("type");
  const isDark = useIsDarkMode();
  const contentWidth = useContentWidth();
  const { data } = useProfileNftTabs({
    profileId: profileData?.data?.profile.profile_id,
  });
  const router = useRouter();

  const routes = useMemo(() => formatProfileRoutes(data?.tabs), [data?.tabs]);

  const {
    index,
    setIndex,
    setIsRefreshing,
    isRefreshing,
    currentTab,
    tabRefs,
  } = useTabState<ProfileTabListRef>(routes, {
    defaultIndex: data?.tabs.findIndex(
      (item) => item.type === (type ? type : data?.default_tab_type)
    ),
  });
  const animationHeaderPosition = useSharedValue(0);
  const animationHeaderHeight = useSharedValue(0);
  const { getIsBlocked } = useBlock();
  const isBlocked = getIsBlocked(profileData?.data?.profile.profile_id);
  const { top } = useSafeAreaInsets();
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
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      return () => {
        !isDark && StatusBar.setBarStyle("dark-content");
      };
    }, [isDark])
  );

  const emptyBodyComponent = useMemo(() => {
    if (!isError) return null;
    return (
      <ProfileError error={error} isBlocked={isBlocked} username={username} />
    );
  }, [error, isBlocked, isError, username]);

  const onStartRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await mutate();
    // Todo: use async/await.
    currentTab?.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
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
                ref={(ref) => (tabRefs.current[routeIndex] = ref)}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      );
    },
    [
      data?.tabs,
      isBlocked,
      profileData?.data?.profile.profile_id,
      profileData?.data?.profile.username,
      tabRefs,
    ]
  );

  const renderHeader = useCallback(() => {
    return (
      <View tw="items-center bg-white dark:bg-black">
        <View tw="w-full max-w-screen-xl">
          {Platform.OS !== "android" && (
            <View style={{ height: headerHeight }} />
          )}
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
    headerHeight,
    username,
    animationHeaderPosition,
    animationHeaderHeight,
    isBlocked,
    profileData?.data,
    isLoading,
    isError,
  ]);
  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      }
    ) => (
      <View tw="dark:shadow-dark shadow-light bg-white dark:bg-black">
        <View tw="mx-auto w-full max-w-screen-xl">
          <ScollableAutoWidthTabBar {...props} />
        </View>
      </View>
    ),
    []
  );
  const headerCenter = useCallback(() => {
    return (
      <View tw="h-full justify-center">
        <Text numberOfLines={1} tw="text-lg font-bold text-white">
          {getProfileName(profileData?.data?.profile)}
        </Text>
      </View>
    );
  }, [profileData?.data?.profile]);

  return (
    <>
      <FilterContext.Provider value={{ filter, dispatch }}>
        <>
          <Header
            headerLeft={
              router.asPath === "/" ? (
                <></>
              ) : (
                <HeaderLeft canGoBack={true} withBackground />
              )
            }
            headerRight={<HeaderDropdown type="settings" withBackground />}
            headerCenter={headerCenter}
            translateYValue={animationHeaderPosition}
          />
          <HeaderTabView
            onStartRefresh={onStartRefresh}
            isRefreshing={isRefreshing}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderScrollHeader={renderHeader}
            minHeaderHeight={Platform.select({
              default: headerHeight ? headerHeight : DEFAULT_HADER_HEIGHT + top,
              android: headerHeight ? 0 : DEFAULT_HADER_HEIGHT + top,
            })}
            refreshControlTop={Platform.select({
              ios: headerHeight ? headerHeight : 20,
              default: 0,
            })}
            refreshHeight={top + DEFAULT_HADER_HEIGHT}
            initialLayout={{
              width: contentWidth,
            }}
            emptyBodyComponent={emptyBodyComponent}
            animationHeaderPosition={animationHeaderPosition}
            animationHeaderHeight={animationHeaderHeight}
            renderTabBar={renderTabBar}
          />
        </>
      </FilterContext.Provider>
    </>
  );
};

export { ProfileScreen as Profile };
