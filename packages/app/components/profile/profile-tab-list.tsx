import React, {
  useCallback,
  useContext,
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
} from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";
import chunk from "lodash/chunk";

import { useRouter } from "@showtime-xyz/universal.router";
import {
  TabScrollView,
  TabInfiniteScrollList,
  TabSpinner,
} from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import { List, useProfileNFTs } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { useUser } from "app/hooks/use-user";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { MutateProvider } from "app/providers/mutate-provider";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { EmptyPlaceholder } from "../empty-placeholder";
import { FilterContext } from "./fillter-context";
import { ProfileFooter } from "./profile-footer";

type TabListProps = {
  username?: string;
  profileId?: number;
  isBlocked?: boolean;
  list: List;
  index: number;
};

export type ProfileTabListRef = {
  refresh: () => void;
};

export const ProfileTabList = forwardRef<ProfileTabListRef, TabListProps>(
  function ProfileTabList(
    { username, profileId, isBlocked, list, index },
    ref
  ) {
    const router = useRouter();
    const { filter } = useContext(FilterContext);
    const { width } = useWindowDimensions();
    const isMdWidth = width >= breakpoints["md"];

    const { isLoading, data, fetchMore, refresh, updateItem, isLoadingMore } =
      useProfileNFTs({
        tabType: list.type,
        profileId,
        collectionId: filter.collectionId,
        sortType: filter.sortType,
        // TODO: remove refresh interval once we have the new indexer.
        // refreshInterval: 5000,
      });
    const contentWidth = useContentWidth();

    const { user } = useUser();
    const listRef = useRef(null);
    useScrollToTop(listRef);
    useImperativeHandle(ref, () => ({
      refresh,
    }));
    const chuckList = useMemo(() => {
      return chunk(data, 3);
    }, [data]);

    const onItemPress = useCallback(
      (currentIndex: number) => {
        router.push(
          `/list?initialScrollIndex=${currentIndex}&tabType=${list.type}&profileId=${profileId}&collectionId=${filter.collectionId}&sortType=${filter.sortType}&type=profile`
        );
      },
      [list.type, profileId, filter.collectionId, filter.sortType, router]
    );

    const ListFooterComponent = useCallback(
      () => <ProfileFooter isLoading={isLoadingMore} />,
      [isLoadingMore]
    );

    const keyExtractor = useCallback(
      (_item: NFT[], index: number) => `${index}`,
      []
    );
    const numColumns = Platform.select({
      default: 3,
      web:
        contentWidth <= breakpoints["md"]
          ? 3
          : contentWidth >= breakpoints["lg"]
          ? 3
          : 2,
    });
    const renderItem = useCallback(
      ({
        item: chuckItem,
        index: itemIndex,
      }: ListRenderItemInfo<NFT[] & { loading?: boolean }>) => {
        return (
          <View tw="flex-row" style={{ maxWidth: contentWidth }}>
            {chuckItem.map((item, chuckItemIndex) => (
              <Card
                key={item.nft_id}
                nft={item}
                onPress={() =>
                  onItemPress(itemIndex * numColumns + chuckItemIndex)
                }
                numColumns={numColumns}
                style={{
                  marginRight: StyleSheet.hairlineWidth,
                  marginBottom: StyleSheet.hairlineWidth,
                }}
              />
            ))}
          </View>
        );
      },
      [contentWidth, numColumns, onItemPress]
    );

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

    if (isLoading) {
      return <TabSpinner index={index} />;
    }
    if (data.length === 0 && !isLoading) {
      return (
        <TabScrollView
          contentContainerStyle={{ marginTop: 48, alignItems: "center" }}
          index={index}
          ref={listRef}
        >
          <EmptyPlaceholder title="No results found" hideLoginBtn />
        </TabScrollView>
      );
    }

    return (
      <MutateProvider mutate={updateItem}>
        <ProfileTabsNFTProvider
          tabType={
            user?.data?.profile?.profile_id === profileId
              ? list.type
              : undefined
          }
        >
          <TabInfiniteScrollList
            numColumns={1}
            data={chuckList}
            ref={listRef}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={contentWidth / numColumns}
            overscan={{
              main: contentWidth / numColumns,
              reverse: contentWidth / numColumns,
            }}
            ListFooterComponent={ListFooterComponent}
            onEndReached={fetchMore}
            index={index}
            gridItemProps={Platform.select({
              default: null,
              web: { style: { marginVertical: isMdWidth ? 16 : 0 } },
            })}
          />
        </ProfileTabsNFTProvider>
      </MutateProvider>
    );
  }
);
