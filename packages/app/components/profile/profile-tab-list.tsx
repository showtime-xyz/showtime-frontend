import React, {
  useCallback,
  useContext,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { useRouter } from "@showtime-xyz/universal.router";
import {
  TabScrollView,
  TabInfiniteScrollList,
  TabSpinner,
} from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";

import { Card, GAP } from "app/components/card";
import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import { List, useProfileNFTs } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useUser } from "app/hooks/use-user";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { MutateProvider } from "app/providers/mutate-provider";
import { NFT } from "app/types";

import { EmptyPlaceholder } from "../empty-placeholder";
import { FilterContext } from "./fillter-context";
import { ProfileFooter } from "./profile-footer";
import { ProfileHideList, ProfileNFTHiddenButton } from "./profile-hide-list";

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

export const ProfileTabList = forwardRef<ProfileTabListRef, TabListProps>(
  function ProfileTabList(
    { username, profileId, isBlocked, list, index },
    ref
  ) {
    const [showHidden, setShowHidden] = useState(false);
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
    const onItemPress = useCallback(
      (item: NFT) => {
        router.push(
          `${getNFTSlug(item)}?initialScrollItemId=${item.nft_id}&tabType=${
            list.type
          }&profileId=${profileId}&collectionId=${
            filter.collectionId
          }&sortType=${filter.sortType}&type=profile`
        );
      },
      [list.type, profileId, filter.collectionId, filter.sortType, router]
    );

    const ListFooterComponent = useCallback(
      () => <ProfileFooter isLoading={isLoadingMore} />,
      [isLoadingMore]
    );
    const ListHeaderComponent = useCallback(() => {
      if (list.type === "song_drops_created") {
        return (
          <>
            <ProfileNFTHiddenButton
              onPress={() => {
                setShowHidden(!showHidden);
              }}
              showHidden={showHidden}
            />
            {showHidden ? <ProfileHideList profileId={profileId} /> : null}
          </>
        );
      }
    }, [list.type, profileId, showHidden]);

    const keyExtractor = useCallback((item: NFT) => `${item?.nft_id}`, []);

    const renderItem = useCallback(
      ({
        item,
        index: itemIndex,
      }: ListRenderItemInfo<NFT & { loading?: boolean }>) => {
        return (
          <Card
            nft={item}
            onPress={() => onItemPress(item)}
            numColumns={NUM_COLUMNS}
            index={itemIndex}
          />
        );
      },
      [onItemPress]
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
          <EmptyPlaceholder title="No drops, yet." hideLoginBtn />
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
            numColumns={NUM_COLUMNS}
            data={data}
            ref={listRef}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={contentWidth / NUM_COLUMNS}
            style={{ margin: -GAP }}
            ListFooterComponent={ListFooterComponent}
            ListHeaderComponent={ListHeaderComponent}
            onEndReached={fetchMore}
            index={index}
          />
        </ProfileTabsNFTProvider>
      </MutateProvider>
    );
  }
);
