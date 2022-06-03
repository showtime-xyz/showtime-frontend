import { useCallback, useReducer, useMemo, Suspense, useRef } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { SceneRendererProps } from "react-native-tab-view";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { tw } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import {
  defaultFilters,
  useProfileNftTabs,
  useUserProfile,
} from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { useIsDarkMode } from "design-system/hooks";
import { HeaderTabView, useTabState } from "design-system/tab-view/index";
import { HeaderTabViewRef } from "design-system/tab-view/src/index.web";
import { Route } from "design-system/tab-view/src/types";

import useContentWidth from "../../hooks/use-content-width";
import { ErrorBoundary } from "../error-boundary";
import { FilterContext } from "./fillter-context";
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
  const { data: profileData, refresh } = useUserProfile({ address });
  const { width } = useWindowDimensions();
  const isDark = useIsDarkMode();
  const contentWidth = useContentWidth();
  const {
    data,
    // Todo: handling loading and error state.
    loading: tabsLoading,
    error,
  } = useProfileNftTabs({
    profileId: profileData?.data?.profile.profile_id,
  });

  const { index, setIndex, setIsRefreshing, isRefreshing } = useTabState([]);

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

  const onCollectionChange = useCallback(
    (value: string | number) => {
      dispatch({ type: "collection_change", payload: value });
    },
    [dispatch]
  );

  const onSortChange = useCallback(
    (value: string | number) => {
      dispatch({ type: "sort_change", payload: value });
    },
    [dispatch]
  );
  const tabRefs = useRef<ProfileTabListRef[]>([]);
  const headerTabViewRef = useRef<HeaderTabViewRef>(null);

  const onStartRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    // Todo: use async/await.
    tabRefs.current[index]?.refresh();
    setIsRefreshing(false);
  }, [index, refresh, setIsRefreshing]);
  const renderScene = useCallback(
    ({
      route: { index },
    }: SceneRendererProps & {
      route: Route;
    }) => {
      const list = data?.data.lists[index];
      if (!list) return null;
      return (
        <ErrorBoundary>
          <Suspense
            fallback={
              <View tw="items-center justify-center pt-20">
                <Spinner size="small" />
              </View>
            }
          >
            <ProfileTabList
              username={profileData?.data.profile.username}
              profileId={profileData?.data.profile.profile_id}
              isBlocked={isBlocked}
              list={list}
              index={index}
              ref={(ref) => ref && (tabRefs.current[index] = ref)}
            />
          </Suspense>
        </ErrorBoundary>
      );
    },
    [
      data?.data.lists,
      isBlocked,
      profileData?.data.profile.profile_id,
      profileData?.data.profile.username,
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
              boxShadow: headerShadow,
            }}
          />
        )}
        <View tw="web:max-w-screen-xl w-full">
          {Platform.OS === "ios" && <View tw={`h-[${headerHeight}px]`} />}
          <ProfileTop address={address} isBlocked={isBlocked} />
        </View>
      </View>
    );
  }, [headerBgLeft, headerShadow, headerHeight, address, isBlocked]);

  const routes = useMemo(
    () =>
      data?.data?.lists?.map((item, index) => ({
        title: item?.name,
        key: item?.name,
        index,
      })) ?? [],
    [data?.data?.lists]
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
            ios: headerHeight,
            default: 0,
          })}
          refreshControlTop={Platform.select({
            ios: headerHeight,
            default: 0,
          })}
          initialLayout={{
            width: contentWidth,
          }}
          style={tw.style("z-1")}
          insertStickyTabBarElement={
            Platform.OS === "web" ? (
              <View
                tw="absolute left-0 top-0 h-full w-screen bg-white dark:bg-black"
                style={{
                  left: headerBgLeft,
                  // @ts-ignore
                  boxShadow: headerShadow,
                }}
              />
            ) : null
          }
          insertTabBarElement={
            Platform.OS === "web" ? (
              <>
                <View tw="absolute -bottom-11 w-full justify-between md:bottom-1.5 md:right-10 md:w-auto">
                  <ProfileListFilter
                    onCollectionChange={onCollectionChange}
                    onSortChange={onSortChange}
                    collectionId={filter.collectionId}
                    collections={data?.data?.lists[index]?.collections || []}
                    sortId={filter.sortId}
                  />
                </View>
              </>
            ) : null
          }
          ref={headerTabViewRef}
        />
      </View>
    </FilterContext.Provider>
  );
};

export { ProfileScreen as Profile };
