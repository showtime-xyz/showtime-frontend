import {
  useCallback,
  useContext,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { useRouter } from "@showtime-xyz/universal.router";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { Card } from "app/components/card";
import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import { List, useProfileNFTs } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { useUser } from "app/hooks/use-user";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { MutateProvider } from "app/providers/mutate-provider";
import { NFT } from "app/types";

import { TabFlashListScrollView, TabScrollView } from "design-system/tab-view";
import { TabInfiniteScrollList } from "design-system/tab-view/tab-flash-list";
import { TabSpinner } from "design-system/tab-view/tab-spinner";

import { EmptyPlaceholder } from "../empty-placeholder";
import { FilterContext } from "./fillter-context";
import { ProfileFooter } from "./footer";

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
    const { isLoading, data, fetchMore, refresh, updateItem, isLoadingMore } =
      useProfileNFTs({
        tabType: list.type,
        profileId,
        collectionId: filter.collectionId,
        sortType: filter.sortType,
        // TODO: remove refresh interval once we have the new indexer.
        refreshInterval: 5000,
      });
    const contentWidht = useContentWidth();
    const { user } = useUser();
    const listRef = useRef(null);
    useScrollToTop(listRef);
    useImperativeHandle(ref, () => ({
      refresh,
    }));

    const onItemPress = useCallback(
      (nftId: number) => {
        const index = data.findIndex((v) => v.nft_id === nftId);
        router.push(
          `/list?initialScrollIndex=${index}&tabType=${list.type}&profileId=${profileId}&collectionId=${filter.collectionId}&sortType=${filter.sortType}&type=profile`
        );
      },
      [list.type, profileId, filter.collectionId, filter.sortType, router, data]
    );

    const ListFooterComponent = useCallback(
      () => <ProfileFooter isLoading={isLoadingMore} />,
      [isLoadingMore]
    );

    const keyExtractor = useCallback((item: NFT) => `${item.nft_id}`, []);

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<NFT & { loading?: boolean }>) => {
        // currently minting nft
        if (item.loading) {
          return <Card nft={item} numColumns={3} />;
        }

        return (
          <Card
            nft={item}
            numColumns={3}
            onPress={() => onItemPress(item.nft_id)}
            href={`/nft/${item.chain_name}/${item.contract_address}/${item.token_id}?tabType=${list.type}`}
          />
        );
      },
      [onItemPress, list.type]
    );

    if (isBlocked) {
      return (
        <TabScrollView
          contentContainerStyle={tw.style("mt-12 items-center")}
          index={index}
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
          contentContainerStyle={tw.style("mt-12 items-center")}
          index={index}
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
            numColumns={3}
            data={data}
            ref={listRef}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={contentWidht / 3}
            overscan={{
              main: contentWidht / 3,
              reverse: contentWidht / 3,
            }}
            renderScrollComponent={TabFlashListScrollView}
            ListFooterComponent={ListFooterComponent}
            onEndReached={fetchMore}
            index={index}
          />
        </ProfileTabsNFTProvider>
      </MutateProvider>
    );
  }
);
