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
import { useWindowDimensions, Platform } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";
import chunk from "lodash/chunk";
import { stringify } from "querystring";
import type { ParsedUrlQuery } from "querystring";
import { useSharedValue } from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { GiftSolid } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Route, TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { DESKTOP_PROFILE_WIDTH } from "app/constants/layout";
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
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useUser } from "app/hooks/use-user";
import { Sticky } from "app/lib/stickynode";
import { createParam } from "app/navigation/use-param";
import { MutateProvider } from "app/providers/mutate-provider";
import { NFT } from "app/types";
import { formatProfileRoutes, getProfileImage } from "app/utilities";

import { Spinner } from "design-system/spinner";

import { MessageItem } from "../creator-channels/components/message-item";
import { EmptyPlaceholder } from "../empty-placeholder";
import { ButtonGoldLinearGradient } from "../gold-gradient";
import { HeaderLeft } from "../header";
import { HeaderRightSm } from "../header/header-right.sm";
import { CreatorTokensPanel } from "./creator-tokens-panel";
import { MyCollection } from "./my-collection";
import { ProfileError } from "./profile-error";
import { ProfileTabBar } from "./profile-tab-bar";
import { ProfileCover, ProfileTop } from "./profile-top";
import { TokensTabHeader, TokensTabItem } from "./tokens-tab";

export type ProfileScreenProps = {
  username: string;
};

const ProfileScreen = ({ username }: ProfileScreenProps) => {
  return <Profile username={username} />;
};

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
  const { data, isLoading: profileTabIsLoading } = useProfileNftTabs({
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

  const routes = useMemo(() => formatProfileRoutes(data?.tabs), [data?.tabs]);

  const [queryTab] = useParam("type", {
    initial: data?.default_tab_type,
  });
  const [type, setType] = useState(queryTab);
  const numColumns = type === "tokens" ? 1 : 3;

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
        if (itemIndex === 0) {
          return (
            <>
              <TokensTabHeader
                channelId={channelId}
                isSelf={isSelf}
                messageCount={messageCount}
              />
            </>
          );
        }
        return null;
      }
      return (
        <Card
          nft={item}
          key={item.nft_id}
          numColumns={numColumns}
          as={getNFTSlug(item)}
          href={`${getNFTSlug(item)}?initialScrollItemId=${
            item.nft_id
          }&tabType=${type}&profileId=${profileId}&collectionId=0&sortType=newest&type=profile`}
          index={itemIndex}
        />
      );
    },
    [channelId, isSelf, messageCount, numColumns, profileId, type]
  );
  const ListFooterComponent = useCallback(() => {
    if ((isLoadingMore || profileIsLoading) && !error) {
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
  }, [contentWidth, isLoadingMore, profileIsLoading, error]);
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
    <View tw="w-full items-center border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
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
        <View
          tw="min-h-screen w-full"
          style={{ maxWidth: DESKTOP_PROFILE_WIDTH }}
        >
          <MutateProvider mutate={updateItem}>
            <ProfileTabsNFTProvider tabType={isSelf ? type : undefined}>
              {isProfileMdScreen ? (
                <>
                  <ProfileCover
                    tw="overflow-hidden rounded-b-3xl"
                    uri={getProfileImage(profileData?.data?.profile)}
                  />
                  <Pressable
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
                  </Pressable>
                </>
              ) : null}
              <View tw="w-full flex-row">
                <View tw="-mt-3 flex-1">
                  <ProfileTop
                    address={username}
                    isBlocked={isBlocked}
                    profileData={profileData?.data}
                    isLoading={isLoading}
                    isError={isError}
                    isSelf={isSelf}
                  />

                  <ProfileTabBar
                    onPress={onChangeTabBar}
                    routes={routes}
                    index={routes.findIndex((item) => item.key === type)}
                  />
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
                  <View style={{ width: 400 }} tw="animate-fade-in-250 pl-16">
                    <Sticky enabled>
                      <CreatorTokensPanel username={username} isSelf={isSelf} />
                      {isSelf && <MyCollection />}
                      {list.length > 0 ? (
                        <TokensTabItem item={list[0]} />
                      ) : null}
                      {list.length > 0 ? (
                        <TokensTabItem item={list[0]} />
                      ) : null}
                    </Sticky>
                  </View>
                ) : null}
              </View>
            </ProfileTabsNFTProvider>
          </MutateProvider>
        </View>
      </ProfileHeaderContext.Provider>
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
