import { useCallback, useMemo, useState, useEffect } from "react";

import type { ListRenderItemInfo } from "@shopify/flash-list";
import { stringify } from "querystring";
import type { ParsedUrlQuery } from "querystring";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { HeaderLeft } from "app/components/header";
import { HeaderRightSm } from "app/components/header/header-right.sm";
import { CreatorTokensBanner } from "app/components/home/header";
import { TopPartCreatorTokens } from "app/components/home/top-part-creator-tokens";
import { DESKTOP_PROFILE_WIDTH } from "app/constants/layout";
import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import {
  useProfileNFTs,
  useProfileNftTabs,
  useUserProfile,
} from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { Sticky } from "app/lib/stickynode";
import { createParam } from "app/navigation/use-param";
import { MutateProvider } from "app/providers/mutate-provider";
import { NFT } from "app/types";
import { formatProfileRoutes, getFullSizeCover } from "app/utilities";

import { Spinner } from "design-system/spinner";

import { CreatorTokensPanel } from "./creator-tokens-panel";
import { ProfileError } from "./profile-error";
import { ProfileTabBar } from "./profile-tab-bar";
import { ProfileCover, ProfileTop } from "./profile-top";
import {
  CreatorTokenCollected,
  CreatorTokenCollectors,
  TokensTabHeader,
} from "./tokens-tab";

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
    isLoading: profileIsLoading,
    error,
  } = useUserProfile({ address: username });
  const profileId = profileData?.data?.profile.profile_id;
  const { getIsBlocked } = useBlock();
  const router = useRouter();
  const userId = useCurrentUserId();
  const isSelf = userId === profileId;
  const isBlocked = getIsBlocked(profileId);
  const { data } = useProfileNftTabs({
    profileId: profileId,
  });
  const contentWidth = useContentWidth();
  const isProfileMdScreen = contentWidth > DESKTOP_PROFILE_WIDTH - 10;

  const channelId = useMemo(() => {
    if (profileData?.data?.profile.channels) {
      return profileData?.data?.profile.channels[0]?.id;
    }
    return null;
  }, [profileData?.data?.profile.channels]);

  const messageCount = useMemo(() => {
    return profileData?.data?.profile?.channels?.[0]?.message_count || 0;
  }, [profileData?.data?.profile.channels]);

  const channelPermissions = useMemo(() => {
    return profileData?.data?.profile?.channels?.[0]?.permissions;
  }, [profileData?.data?.profile.channels]);

  const routes = useMemo(() => formatProfileRoutes(data?.tabs), [data?.tabs]);

  const [queryTab] = useParam("type", {
    initial: data?.default_tab_type,
  });
  const [type, setType] = useState(queryTab);
  const numColumns = useMemo(() => (type === "tokens" ? 1 : 3), [type]);
  const index = useMemo(
    () => routes.findIndex((item) => item.key === type),
    [routes, type]
  );
  useEffect(() => {
    if (!data?.default_tab_type || type) return;
    setType(data?.default_tab_type);
  }, [data?.default_tab_type, type]);

  const {
    isLoading,
    data: list,
    fetchMore,
    updateItem,
    isLoadingMore,
  } = useProfileNFTs({
    tabType: type,
    profileId: profileId,
    collectionId: 0,
    sortType: "newest",
  });

  const keyExtractor = useCallback(
    (_item: NFT, index: number) => `${index}`,
    []
  );

  const renderItem = useCallback(
    ({
      item,
      index: itemIndex,
    }: ListRenderItemInfo<NFT & { loading?: boolean }>) => {
      if (type === "tokens") {
        return null;
      }
      return null;
    },
    [type]
  );
  const ListFooterComponent = useCallback(() => {
    if (((isLoadingMore && isLoading) || profileIsLoading) && !error) {
      return (
        <View
          tw="mx-auto flex-row items-center justify-center py-4"
          style={{ maxWidth: contentWidth }}
        >
          <Spinner />
        </View>
      );
    }
    return null;
  }, [isLoadingMore, isLoading, profileIsLoading, error, contentWidth]);
  const onChangeTabBar = useCallback(
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
  const ListEmptyComponent = useCallback(() => {
    if (error || isBlocked) {
      return (
        <ProfileError error={error} isBlocked={isBlocked} username={username} />
      );
    }
    if (type === "tokens") {
      return null;
    }
    if (
      list.length === 0 &&
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
    list.length,
    isLoading,
    profileIsLoading,
    type,
    username,
  ]);
  return (
    <View tw="w-full items-center border-gray-200 bg-white dark:border-gray-800 dark:bg-black md:border-l">
      <View
        tw="min-h-screen w-full"
        style={{ maxWidth: DESKTOP_PROFILE_WIDTH }}
      >
        <MutateProvider mutate={updateItem}>
          <ProfileTabsNFTProvider tabType={isSelf ? type : undefined}>
            {isProfileMdScreen ? (
              <>
                <CreatorTokensBanner />
                <ProfileCover
                  tw="overflow-hidden rounded-b-3xl"
                  uri={getFullSizeCover(profileData?.data?.profile)}
                />
                {/* <Pressable
                    tw={[
                      "absolute right-5 top-2 ml-2 h-8 w-8 items-center justify-center rounded-full bg-black/60",
                    ]}
                    onPress={() => {
                      const as = "/creator-token/invite-creator-token";
                      router.push(
                        Platform.select({
                          native: as,
                          web: {
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              inviteCreatorTokenModal: true,
                            },
                          } as any,
                        }),
                        Platform.select({ native: as, web: router.asPath }),
                        {
                          shallow: true,
                        }
                      );
                    }}
                  >
                    <ButtonGoldLinearGradient />
                    <GiftSolid
                      width={26}
                      height={26}
                      color={colors.gray[900]}
                    />
                  </Pressable> */}
              </>
            ) : null}
            <View tw="w-full flex-row">
              <View tw="flex-1">
                <ProfileTop
                  address={username}
                  isBlocked={isBlocked}
                  profileData={profileData?.data}
                  isLoading={profileIsLoading}
                  isError={isError}
                  isSelf={isSelf}
                />
                {/* <ProfileTabBar
                  onPress={onChangeTabBar}
                  routes={routes}
                  index={index}
                /> */}

                {type === "tokens" ? (
                  <>
                    <TokensTabHeader
                      channelId={channelId}
                      isSelf={isSelf}
                      messageCount={messageCount}
                      channelPermissions={channelPermissions}
                    />
                    <View tw="pl-5">
                      <CreatorTokenCollectors
                        creatorTokenId={
                          profileData?.data?.profile.creator_token?.id
                        }
                        name={profileData?.data?.profile.name}
                        username={username}
                      />
                      <CreatorTokenCollected
                        profileId={profileId}
                        name={profileData?.data?.profile.name}
                        username={username}
                      />
                    </View>
                  </>
                ) : null}

                <InfiniteScrollList
                  useWindowScroll
                  numColumns={numColumns}
                  preserveScrollPosition
                  data={isBlocked ? [] : list}
                  keyExtractor={keyExtractor}
                  renderItem={renderItem}
                  overscan={12}
                  ListEmptyComponent={ListEmptyComponent}
                  ListFooterComponent={ListFooterComponent}
                  onEndReached={fetchMore}
                />
              </View>
              {isProfileMdScreen ? (
                <View
                  style={{
                    width: 335,
                  }}
                  tw="animate-fade-in-250 ml-10"
                >
                  <Sticky enabled>
                    <CreatorTokensPanel username={username} isSelf={isSelf} />
                    <TopPartCreatorTokens />
                  </Sticky>
                </View>
              ) : null}
            </View>
          </ProfileTabsNFTProvider>
        </MutateProvider>
      </View>
      <>
        {isSelf ? (
          <View tw={["fixed right-4 top-2 z-50 flex flex-row md:hidden"]}>
            <HeaderRightSm withBackground />
            {/* <Pressable
              tw={[
                "ml-2 h-8 w-8 items-center justify-center rounded-full bg-black/60",
              ]}
              onPress={() => {
                const as = "/creator-token/invite-creator-token";
                router.push(
                  Platform.select({
                    native: as,
                    web: {
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        inviteCreatorTokenModal: true,
                      },
                    } as any,
                  }),
                  Platform.select({ native: as, web: router.asPath }),
                  {
                    shallow: true,
                  }
                );
              }}
            >
              <ButtonGoldLinearGradient />
              <GiftSolid width={26} height={26} color={colors.gray[900]} />
            </Pressable> */}
          </View>
        ) : (
          <View tw={["fixed left-4 top-2 z-50 flex md:hidden"]}>
            <HeaderLeft withBackground canGoBack={true} />
          </View>
        )}
      </>
    </View>
  );
};

export { ProfileScreen as Profile };
