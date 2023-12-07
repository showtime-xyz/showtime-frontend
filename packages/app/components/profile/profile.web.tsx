import { useCallback, useMemo, useState, useEffect } from "react";
import { Platform } from "react-native";

import { stringify } from "querystring";
import type { ParsedUrlQuery } from "querystring";

import { Button } from "@showtime-xyz/universal.button";
import { GiftSolid } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { HeaderLeft } from "app/components/header";
import { HeaderRightSm } from "app/components/header/header-right.sm";
import { TopPartCreatorTokens } from "app/components/home/top-part-creator-tokens";
import { DESKTOP_PROFILE_WIDTH } from "app/constants/layout";
import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import { useProfileNftTabs, useUserProfile } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useContentWidth } from "app/hooks/use-content-width";
import { useRedirectToCreatorTokenSocialShare } from "app/hooks/use-redirect-to-creator-token-social-share-screen";
import { useUser } from "app/hooks/use-user";
import { Sticky } from "app/lib/stickynode";
import { createParam } from "app/navigation/use-param";
import { formatProfileRoutes, getFullSizeCover } from "app/utilities";

import { ButtonGoldLinearGradient } from "../gold-gradient";
import { CreatorTokensPanel } from "./creator-tokens-panel";
import { PostsTab } from "./posts-tab/posts-tab";
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
  } = useUserProfile({ address: username });
  const profileId = profileData?.data?.profile.profile_id;
  const { getIsBlocked } = useBlock();
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.data?.profile?.profile_id;
  const isSelf = userId === profileId;
  const isBlocked = getIsBlocked(profileId);
  const { data } = useProfileNftTabs({
    profileId: profileId,
  });
  const redirectToCreatorTokenSocialShare =
    useRedirectToCreatorTokenSocialShare();
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

  const [queryTab] = useParam("type", {
    initial: data?.default_tab_type,
  });
  const [type, setType] = useState(queryTab);

  useEffect(() => {
    if (!data?.default_tab_type || type) return;
    setType(data?.default_tab_type);
  }, [data?.default_tab_type, type]);

  const routes = useMemo(() => formatProfileRoutes(data?.tabs), [data?.tabs]);

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

  return (
    <View tw="items-center bg-white dark:bg-black" style={{ flex: 1 }}>
      <View
        tw="min-h-screen w-full"
        style={{ maxWidth: DESKTOP_PROFILE_WIDTH }}
      >
        <ProfileTabsNFTProvider tabType={isSelf ? type : undefined}>
          <>
            {isProfileMdScreen ? (
              <ProfileCover
                tw="overflow-hidden rounded-b-3xl"
                uri={getFullSizeCover(profileData?.data?.profile)}
              />
            ) : null}
            <View tw="absolute right-5 top-2 z-10 hidden flex-row lg:flex">
              {isSelf ? <HeaderRightSm withBackground /> : null}

              <Button
                tw="ml-2 md:ml-0"
                onPress={() => {
                  redirectToCreatorTokenSocialShare(username);
                }}
                style={{ height: 30 }}
                size="small"
              >
                Share
              </Button>
              {isSelf && profileData?.data?.profile.creator_token?.id ? (
                <Pressable
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
                </Pressable>
              ) : null}
            </View>
          </>

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
              <ProfileTabBar
                onPress={onChangeTabBar}
                routes={routes}
                index={routes.findIndex((item) => item.key === type)}
              />

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
              ) : (
                <PostsTab
                  index={0}
                  profileUsername={profileData?.data?.profile.username}
                />
              )}
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
      </View>
      <>
        {!profileIsLoading ? (
          <View tw={["fixed right-4 top-2 z-50 flex flex-row lg:hidden"]}>
            {isSelf ? <HeaderRightSm withBackground /> : null}
            <Button
              tw="ml-2 md:ml-0"
              onPress={() => {
                redirectToCreatorTokenSocialShare(username);
              }}
              style={{ height: 30 }}
              size="small"
            >
              Share
            </Button>
            {isSelf && profileData?.data?.profile.creator_token?.id ? (
              <Pressable
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
              </Pressable>
            ) : null}
          </View>
        ) : null}
        <>
          <View tw={["fixed left-4 top-2 z-50 flex md:hidden"]}>
            <HeaderLeft withBackground canGoBack={true} />
          </View>
        </>
      </>
    </View>
  );
};

export { ProfileScreen as Profile };
