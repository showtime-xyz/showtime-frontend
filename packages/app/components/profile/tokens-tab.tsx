import React, {
  useCallback,
  useContext,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import {
  TabScrollView,
  TabInfiniteScrollList,
  TabSpinner,
} from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import { List, useProfileNFTs } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useUser } from "app/hooks/use-user";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { MutateProvider } from "app/providers/mutate-provider";
import { NFT } from "app/types";
import { formatNumber } from "app/utilities";

import { EmptyPlaceholder } from "../empty-placeholder";
import { FilterContext } from "./fillter-context";
import { MyCollection } from "./my-collection";
import { ProfileFooter, ProfileSpinnerFooter } from "./profile-footer";

type TabListProps = {
  username?: string;
  profileId?: number;
  isBlocked?: boolean;
  list: List;
  index: number;
};
const NUM_COLUMNS = 3;
export type ProfileTabListRef = {
  refresh: () => void;
};
export const TokensTabHeader = ({
  channelId,
  isSelf,
  messageCount,
}: {
  channelId: number | null | undefined;
  messageCount?: number | null;
  isSelf: boolean;
}) => {
  const isDark = useIsDarkMode();
  const router = useRouter();

  return (
    <View tw="w-full px-4">
      {channelId && isSelf ? (
        <View tw="mt-8 w-full flex-row items-center justify-between rounded-xl border border-gray-200 bg-indigo-600 px-4 py-5 dark:border-transparent">
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

      {/* TODO: Creator tokens P1
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
      */}

      {isSelf && <MyCollection />}
      {channelId && messageCount && messageCount >= 0 ? (
        <Pressable
          onPress={() => {
            router.push(`/channels/${channelId}`);
          }}
          tw="mt-6 rounded-xl border border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900"
        >
          <View tw="flex-row items-center justify-between py-4">
            <Text tw="text-13 font-bold text-gray-900 dark:text-gray-50">
              {formatNumber(messageCount || 0)} Channel messages
            </Text>
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
export const TokensTabItem = ({ item, ...rest }: ViewProps & { item: any }) => {
  const isDark = useIsDarkMode();

  // TODO: Creator tokens P1
  return null;
  // END

  /*
  return (
    <View {...rest}>
      <View tw="flex-row items-center justify-between py-4">
        <Text tw="text-13 font-bold text-gray-900 dark:text-gray-50">
          Alan collected
        </Text>
        <Text tw="text-xs font-semibold text-gray-500 dark:text-gray-50">
          Show all
        </Text>
      </View>
      <View tw="flex-row gap-2.5">
        {new Array(3).fill(0).map((_, i) => {
          return (
            <View
              key={i}
              tw="flex-1 items-center rounded-md border border-gray-200 bg-slate-50 px-1 py-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <View tw="mb-2">
                <View tw="absolute -left-1 top-0">
                  <Showtime
                    width={8}
                    height={8}
                    color={isDark ? colors.white : colors.gray[900]}
                  />
                </View>
                <Avatar url={item.creator_img_url} size={44} />
              </View>
              <Text
                tw="text-xs font-semibold text-gray-900 dark:text-white"
                numberOfLines={1}
              >
                @{item.creator_username}
              </Text>
              <View tw="h-3" />
              <Text tw="text-xs font-bold text-gray-900 dark:text-white">
                $2.60
              </Text>
              <View tw="absolute -right-1.5 -top-2 h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-500 px-1.5 text-gray-500 dark:bg-gray-600">
                <Text tw="text-[10px] font-semibold text-white">1</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
  */
};
export const TokensTab = forwardRef<
  ProfileTabListRef,
  TabListProps & {
    channelId: number | null | undefined;
    messageCount?: number | null;
    isSelf: boolean;
  }
>(function ProfileTabList(
  {
    username,
    profileId,
    isBlocked,
    list,
    index,
    channelId,
    messageCount,
    isSelf,
  },
  ref
) {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const { filter } = useContext(FilterContext);
  const { isLoading, data, fetchMore, refresh, updateItem, isLoadingMore } =
    useProfileNFTs({
      tabType: list.type,
      profileId,
      collectionId: filter.collectionId,
      sortType: filter.sortType,
    });
  const contentWidth = useContentWidth();

  const { user } = useUser();
  const listRef = useRef(null);
  useScrollToTop(listRef);
  useImperativeHandle(ref, () => ({
    refresh,
  }));
  // const onItemPress = useCallback(
  //   (item: NFT) => {
  //     router.push(
  //       `${getNFTSlug(item)}?initialScrollItemId=${item.nft_id}&tabType=${
  //         list.type
  //       }&profileId=${profileId}&collectionId=${filter.collectionId}&sortType=${
  //         filter.sortType
  //       }&type=profile`
  //     );
  //   },
  //   [list.type, profileId, filter.collectionId, filter.sortType, router]
  // );

  const ListFooterComponent = useCallback(() => {
    if (isLoading) {
      return <ProfileSpinnerFooter isLoading={isLoadingMore} />;
    }
  }, [isLoading, isLoadingMore]);

  const ListHeaderComponent = useCallback(
    () => (
      <TokensTabHeader
        channelId={channelId}
        isSelf={isSelf}
        messageCount={messageCount}
      />
    ),
    [channelId, isSelf, messageCount]
  );
  const keyExtractor = useCallback((item: NFT) => `${item?.nft_id}`, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NFT & { loading?: boolean }>) => {
      return <TokensTabItem item={item} tw="px-6" />;
    },
    []
  );
  const ListEmptyComponent = useCallback(() => {
    return null;
    // return <EmptyPlaceholder title="No creator token, yet." hideLoginBtn />;
  }, []);

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
    <MutateProvider mutate={updateItem}>
      <ProfileTabsNFTProvider
        tabType={
          user?.data?.profile?.profile_id === profileId ? list.type : undefined
        }
      >
        <TabInfiniteScrollList
          data={data}
          ref={listRef}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={ListHeaderComponent}
          estimatedItemSize={contentWidth / NUM_COLUMNS}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          onEndReached={fetchMore}
          index={index}
        />
      </ProfileTabsNFTProvider>
    </MutateProvider>
  );
});
