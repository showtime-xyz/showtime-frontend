import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
  useContext,
} from "react";
import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight, Lock, UnLocked } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { UserContext } from "app/context/user-context";
import { List } from "app/hooks/api-hooks";
import {
  useCreatorTokenCoLlected,
  useCreatorTokenCollectors,
} from "app/hooks/creator-token/use-creator-tokens";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useUser } from "app/hooks/use-user";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { Profile } from "app/types";
import { formatNumber } from "app/utilities";

import { ChannelPermissions } from "../creator-channels/types";
import { TopCreatorTokenItemOnProfile } from "../creator-token/creator-token-users";
import { EmptyPlaceholder } from "../empty-placeholder";

type TabListProps = {
  profile?: Profile;
  isBlocked?: boolean;
  list: List;
  index: number;
};
export type ProfileTabListRef = {
  refresh: () => void;
};
export const TokensTabHeader = ({
  channelId,
  isSelf,
  messageCount,
  channelPermissions,
}: {
  channelId: number | null | undefined;
  messageCount?: number | null;
  isSelf: boolean;
  channelPermissions?: ChannelPermissions | null;
}) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const user = useContext(UserContext);

  const channelMessageCountFormatted = useMemo(
    () => formatNumber(messageCount || 0),
    [messageCount]
  );

  return (
    <View tw="w-full px-4">
      {channelId && isSelf ? (
        <View tw="web:mt-4 mt-2 w-full flex-row items-center justify-between rounded-xl border border-gray-200 bg-indigo-600 px-4 py-5 dark:border-transparent">
          <Text tw="flex-1 text-sm text-white">
            Share updates, audio, and photos to token collectors
          </Text>
          <Button
            onPress={() => {
              router.push(`/channels/${channelId}`);
            }}
            theme="dark"
            tw="ml-2"
          >
            {`View Channel`}
          </Button>
        </View>
      ) : null}

      {!user?.user?.data?.profile?.creator_token?.id &&
      user?.user?.data?.profile?.creator_token_onboarding_status ===
        "requires_invite" ? (
        <View tw="mt-8 w-full flex-row items-center justify-between rounded-xl border border-gray-200 bg-slate-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-900">
          <Text tw="mr-4 flex-1 text-sm text-gray-500 dark:text-gray-400">
            Create your token to access your channel.
          </Text>
          <Pressable
            onPress={() => {
              router.push(
                Platform.select({
                  native: "/enterInviteCode",
                  web: {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      enterInviteCodeModal: true,
                    },
                  } as any,
                }),
                Platform.select({
                  native: "/enterInviteCode",
                  web: router.asPath,
                }),
                { shallow: true }
              );
            }}
            tw="rounded-3xl border border-gray-900 px-3 py-2 dark:border-gray-200"
          >
            <Text tw="text-sm font-bold text-gray-900 dark:text-white">
              Enter invite code
            </Text>
          </Pressable>
        </View>
      ) : null}

      {channelId && (messageCount || messageCount == 0) && messageCount >= 0 ? (
        <Pressable
          onPress={() => {
            router.push(`/channels/${channelId}`);
          }}
          tw="mt-4 rounded-xl border border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900"
        >
          <View tw="flex-row items-center justify-between py-4">
            <View tw="flex-row items-center justify-between">
              <View tw="-mt-0.5 mr-2">
                {(channelPermissions &&
                  !channelPermissions?.can_view_creator_messages) ||
                !channelPermissions ? (
                  <Lock
                    width={20}
                    height={20}
                    stroke={isDark ? "white" : "black"}
                  />
                ) : (
                  <UnLocked
                    stroke={isDark ? "white" : "black"}
                    width={20}
                    height={20}
                  />
                )}
              </View>

              {messageCount === 0 ? (
                <Text tw="text-13 font-bold text-gray-900 dark:text-gray-50">
                  View Channel
                </Text>
              ) : (
                <Text tw="text-13 font-bold text-gray-900 dark:text-gray-50">
                  {channelPermissions &&
                  channelPermissions?.can_view_creator_messages
                    ? `You've unlocked ${channelMessageCountFormatted} messages`
                    : `Channel locked (${channelMessageCountFormatted} messages)`}
                </Text>
              )}
            </View>
            <ChevronRight width={20} height={20} color={colors.gray[500]} />
          </View>
          {/* TODO: Creator tokens P1
        <View tw="overflow-hidden rounded-xl border border-gray-200 bg-slate-50 dark:border-gray-700 dark:bg-gray-900">
          <View tw="mx-4 flex-row items-center pt-4">
            <Avatar
              url={
                "https://lh3.googleusercontent.com/3uRH_HyktnOwLhkI9NAKegoACTmcIroFg1CWNhuYCwFDdgpceYUVTRu4WvURevYxfOguKYIMTvvEwKAuarbRopJvbuireVxv8G8"
              }
              size={20}
            />
            <Text tw="text-13 ml-2 font-bold text-gray-900 dark:text-gray-50">
              Valentia Cy
            </Text>
            <Text tw="ml-2 text-xs text-gray-500">1d</Text>
          </View>
          <View tw="pb-4">
            <View tw="ml-11 mt-2">
              <Text tw="text-sm text-gray-900 dark:text-gray-50">{`sadsaddasdkljklfgsjlkasj; d
      asdsadsa`}</Text>
            </View>
            <PlatformBlurView
              // tw="web:bg-black/30 android:bg-gray-800 backdrop-blur-3xl"
              tint={isDark ? "dark" : "light"}
              intensity={20}
              style={{
                ...StyleSheet.absoluteFillObject,
                overflow: "hidden",
              }}
            />
          </View>
        </View>
        */}
        </Pressable>
      ) : null}
    </View>
  );
};

export const CreatorTokenCollectors = ({
  creatorTokenId,
  username,
  name,
  ...rest
}: {
  creatorTokenId: number | undefined;
  username: string | undefined;
  name: string | undefined;
} & ViewProps) => {
  const { data, isLoading, count } = useCreatorTokenCollectors(creatorTokenId);
  const router = useRouter();
  if ((!data?.length || data.length === 0) && !isLoading) {
    return null;
  }
  return (
    <View {...rest}>
      <View tw="flex-row items-center justify-between py-4">
        <Text tw="text-13 font-semibold text-gray-900 dark:text-gray-50">
          {name ? name : `@${username}`} collectors
        </Text>
        {/* {count > 6 ? (
          <Text
            onPress={() => {
              const as = `/creator-token/${creatorTokenId}/collectors`;
              router.push(
                Platform.select({
                  native: as,
                  web: {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      creatorTokenCollectorsModal: true,
                      creatorTokenId,
                    },
                  } as any,
                }),
                Platform.select({ native: as, web: router.asPath })
              );
            }}
            tw="text-xs font-semibold text-gray-500 dark:text-gray-50"
          >
            Show all
          </Text>
        ) : null} */}
      </View>
      <View tw="h-2" />
      <View tw="flex-row flex-wrap items-center gap-x-4 gap-y-2">
        {data?.map((item, i) => {
          return (
            <TopCreatorTokenItemOnProfile
              item={item}
              key={i}
              style={{ width: "45%" }}
              showName
            />
          );
        })}
      </View>
    </View>
  );
};
export const CreatorTokenCollected = ({
  profileId,
  username,
  name,
  ...rest
}: {
  profileId: number | undefined;
  username: string | undefined;
  name: string | undefined;
} & ViewProps) => {
  const router = useRouter();
  const { data, count, isLoading } = useCreatorTokenCoLlected(profileId);
  if ((!data?.length || data?.length === 0) && !isLoading) {
    return null;
  }
  return (
    <View {...rest}>
      <View tw="flex-row items-center justify-between py-4">
        <Text tw="text-13 font-semibold text-gray-900 dark:text-gray-50">
          {name ? name : `@${username}`} collected
        </Text>
        {/* {count > 6 ? (
          <Text
            onPress={() => {
              const as = `/creator-token/${profileId}/collected`;
              console.log(as);

              router.push(
                Platform.select({
                  native: as,
                  web: {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      creatorTokenCollectedModal: true,
                      profileId,
                    },
                  } as any,
                }),
                Platform.select({ native: as, web: router.asPath })
              );
            }}
            tw="text-xs font-semibold text-gray-500 dark:text-gray-50"
          >
            Show all
          </Text>
        ) : null} */}
      </View>
      <View tw="h-2" />
      <View tw="flex-row flex-wrap items-center gap-x-4 gap-y-2">
        {data?.map((item, i) => {
          return (
            <TopCreatorTokenItemOnProfile
              item={item}
              key={i}
              style={{ width: "45%" }}
              showName
            />
          );
        })}
      </View>
    </View>
  );
};
export const TokensTab = forwardRef<
  ProfileTabListRef,
  TabListProps & {
    channelId: number | null | undefined;
    messageCount?: number | null;
    channelPermissions?: ChannelPermissions | null;
    isSelf: boolean;
  }
>(function ProfileTabList(
  { profile, isBlocked, list, index, channelId, messageCount, isSelf },
  ref
) {
  const isDark = useIsDarkMode();
  const profileId = profile?.profile_id;
  const username = profile?.username;
  const { user } = useUser();
  const listRef = useRef(null);
  const channelPermissions = useMemo(() => {
    return profile?.channels?.[0]?.permissions;
  }, [profile?.channels]);

  const bottomHeight = usePlatformBottomHeight();
  useScrollToTop(listRef);
  useImperativeHandle(ref, () => ({
    refresh: () => {},
  }));

  if (isBlocked) {
    return (
      <TabScrollView
        contentContainerStyle={{ marginTop: 48, alignItems: "center" }}
        index={index}
        ref={listRef}
      >
        <EmptyPlaceholder
          title={
            <Text tw="text-gray-900 dark:text-white">
              <Text tw="font-bold">@{username}</Text> is blocked
            </Text>
          }
          hideLoginBtn
        />
      </TabScrollView>
    );
  }

  return (
    <>
      <TabScrollView
        contentContainerStyle={{ paddingBottom: bottomHeight + 56 }}
        index={index}
        ref={listRef}
      >
        <TokensTabHeader
          channelId={channelId}
          isSelf={isSelf}
          messageCount={messageCount}
          channelPermissions={channelPermissions}
        />
        <View tw="px-4">
          <CreatorTokenCollectors
            creatorTokenId={profile?.creator_token?.id}
            name={profile?.name}
            username={username}
          />
          <CreatorTokenCollected
            profileId={profileId}
            name={profile?.name}
            username={username}
          />
        </View>
      </TabScrollView>
    </>
  );
});
