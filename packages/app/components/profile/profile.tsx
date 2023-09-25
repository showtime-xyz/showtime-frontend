import { useCallback, useReducer, Suspense, useMemo } from "react";
import { Platform } from "react-native";

import { useSharedValue } from "react-native-reanimated";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import {
  SceneRendererProps,
  HeaderTabView,
  Route,
  TabSpinner,
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
import { useShare } from "app/hooks/use-share";
import { useTabState } from "app/hooks/use-tab-state";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { createParam } from "app/navigation/use-param";
import { formatProfileRoutes, getProfileName } from "app/utilities";

import { ErrorBoundary } from "../error-boundary";
import { TabFallback } from "../error-boundary/tab-fallback";
import { FilterContext } from "./fillter-context";
import { ProfileError } from "./profile-error";
import { ProfileTabBar } from "./profile-tab-bar";
import { ProfileTabList, ProfileTabListRef } from "./profile-tab-list";
import { ProfileTop } from "./profile-top";
import { TokensTab } from "./tokens-tab";

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
  const { share } = useShare();

  const contentWidth = useContentWidth();
  const { data } = useProfileNftTabs({
    profileId: profileData?.data?.profile.profile_id,
  });
  const savedSongs = useMemo(() => {
    return (
      data?.tabs.find((item) => item.type === "created")?.displayed_count || 0
    );
  }, [data?.tabs]);
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
      route: { index: routeIndex, key },
    }: SceneRendererProps & {
      route: Route;
    }) => {
      if (key === "tokens") {
        return (
          <TokensTab
            username={profileData?.data?.profile.username}
            profileId={profileData?.data?.profile.profile_id}
            isBlocked={isBlocked}
            list={data?.tabs[routeIndex]}
            index={routeIndex}
            ref={(ref) => (tabRefs.current[routeIndex] = ref)}
          />
        );
      }
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
            savedSongs={savedSongs}
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
    savedSongs,
  ]);
  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      }
    ) => (
      <View tw="bg-white dark:bg-black">
        <ProfileTabBar {...props} />
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

  const onShare = useCallback(async () => {
    await share({
      url: `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/@${username}`,
    });
  }, [share, username]);

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
            headerRight={
              <View tw="flex-row">
                <HeaderDropdown
                  type="settings"
                  withBackground
                  user={profileData?.data?.profile}
                />
                <Button
                  tw="ml-2"
                  onPress={onShare}
                  style={{ height: 30 }}
                  size="small"
                >
                  Share
                </Button>
              </View>
            }
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
