import { useCallback, useReducer, Suspense, useMemo } from "react";
import { Platform } from "react-native";

import { useSharedValue } from "react-native-reanimated";

import { Button } from "@showtime-xyz/universal.button";
import { GiftSolid } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import {
  SceneRendererProps,
  HeaderTabView,
  Route,
  TabSpinner,
  NavigationState,
} from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import {
  DEFAULT_HADER_HEIGHT,
  Header,
  HeaderLeft,
} from "app/components/header";
import { HeaderDropdown } from "app/components/header-dropdown";
import { useProfileNftTabs, useUserProfile } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useShare } from "app/hooks/use-share";
import { useTabState } from "app/hooks/use-tab-state";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { createParam } from "app/navigation/use-param";
import { formatProfileRoutes, getProfileName } from "app/utilities";

import { ErrorBoundary } from "../error-boundary";
import { TabFallback } from "../error-boundary/tab-fallback";
import { ButtonGoldLinearGradient } from "../gold-gradient";
import { ProfileError } from "./profile-error";
import { ProfileTabBar } from "./profile-tab-bar";
import { ProfileTop } from "./profile-top";
import { TokensTab } from "./tokens-tab";

export type ProfileScreenProps = {
  username: string;
};

const ProfileScreen = ({ username }: ProfileScreenProps) => {
  return <Profile username={username} />;
};

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
  const userId = useCurrentUserId();
  const profileId = profileData?.data?.profile.profile_id;
  const isSelf = userId === profileId;
  const contentWidth = useContentWidth();
  const { data } = useProfileNftTabs({
    profileId: profileId,
  });
  const channelId = useMemo(() => {
    if (profileData?.data?.profile.channels) {
      return profileData?.data?.profile.channels[0]?.id;
    }
    return null;
  }, [profileData?.data?.profile.channels]);

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
  } = useTabState<any>(routes, {
    defaultIndex: data?.tabs.findIndex(
      (item) => item.type === (type ? type : data?.default_tab_type)
    ),
  });
  const animationHeaderPosition = useSharedValue(0);
  const animationHeaderHeight = useSharedValue(0);
  const { getIsBlocked } = useBlock();
  const isBlocked = getIsBlocked(profileId);
  const { top } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

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

  const messageCount = useMemo(() => {
    return profileData?.data?.profile?.channels?.[0]?.message_count || 0;
  }, [profileData?.data?.profile.channels]);

  const channelPermissions = useMemo(() => {
    return profileData?.data?.profile?.channels?.[0]?.permissions;
  }, [profileData?.data?.profile.channels]);

  const renderScene = useCallback(
    ({
      route: { index: routeIndex, key },
    }: SceneRendererProps & {
      route: Route;
    }) => {
      if (key === "tokens") {
        return (
          <TokensTab
            profile={profileData?.data?.profile}
            isBlocked={isBlocked}
            list={data?.tabs[routeIndex]}
            index={routeIndex}
            ref={(ref) => (tabRefs.current[routeIndex] = ref)}
            channelId={channelId}
            isSelf={isSelf}
            messageCount={messageCount}
            channelPermissions={channelPermissions}
          />
        );
      }
      return null;
    },
    [
      channelId,
      channelPermissions,
      data?.tabs,
      isBlocked,
      isSelf,
      messageCount,
      profileData?.data?.profile,
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
            isBlocked={isBlocked}
            profileData={profileData?.data}
            isLoading={isLoading}
            isError={isError}
            savedSongs={savedSongs}
            isSelf={isSelf}
          />
        </View>
      </View>
    );
  }, [
    headerHeight,
    username,
    isBlocked,
    profileData?.data,
    isLoading,
    isError,
    savedSongs,
    isSelf,
  ]);
  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      }
    ) => {
      return null;
    },
    []
  );
  const headerCenter = useCallback(() => {
    if (isSelf) {
      return null;
    }
    return (
      <View tw="h-full justify-center">
        <Text numberOfLines={1} tw="text-lg font-bold text-white">
          {getProfileName(profileData?.data?.profile)}
        </Text>
      </View>
    );
  }, [isSelf, profileData?.data?.profile]);

  const onShare = useCallback(async () => {
    await share({
      url: `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/@${username}`,
    });
  }, [share, username]);

  return (
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
            {/* {isSelf && (
              <Pressable
                tw={[
                  "ml-2 w-8 items-center justify-center rounded-full bg-black/60",
                ]}
                onPress={() => {
                  // Due to the fact that this page is only for native we can simply use a URL.
                  router.push("/creator-token/invite-creator-token");
                }}
              >
                <ButtonGoldLinearGradient />
                <GiftSolid width={26} height={26} color={colors.gray[900]} />
              </Pressable>
            )} */}

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
  );
};

export { ProfileScreen as Profile };
