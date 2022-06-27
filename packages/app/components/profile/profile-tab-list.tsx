import {
  useCallback,
  useContext,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useWindowDimensions } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { Card } from "app/components/card";
import { getLocalFileURI } from "app/components/preview";
import { MintContext } from "app/context/mint-context";
import { List, useProfileNFTs } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { useNFTCardsListLayoutProvider } from "app/hooks/use-nft-cards-list-layout-provider";
import { useUser } from "app/hooks/use-user";
import { DataProvider } from "app/lib/recyclerlistview";
import { MutateProvider } from "app/providers/mutate-provider";

import { TabRecyclerList, TabScrollView } from "design-system/tab-view";
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

const GAP_BETWEEN_ITEMS = 1;

export type ProfileTabListRef = {
  refresh: () => void;
};
export const ProfileTabList = forwardRef<ProfileTabListRef, TabListProps>(
  function ProfileTabList(
    { username, profileId, isBlocked, list, index },
    ref
  ) {
    const router = useRouter();
    const { user } = useUser();
    const { state: mintingState } = useContext(MintContext);
    const { height } = useWindowDimensions();

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
    const tabRef = useRef(null);

    useImperativeHandle(
      ref,
      () => ({
        refresh,
      }),
      [refresh]
    );

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

    const newData = useMemo(() => {
      let newData: any = [];
      if (isBlocked) return newData;
      if (
        mintingState.loading &&
        mintingState.tokenId !== data?.[0]?.token_id &&
        profileId === user?.data.profile.profile_id
      ) {
        //@ts-ignore
        newData.push({
          loading: true,
          chain_name: "polygon",
          contract_address: "0x8a13628dd5d600ca1e8bf9dbc685b735f615cb90",
          token_id: mintingState.tokenId ?? "1",
          source_url: getLocalFileURI(mintingState.file),
          mime_type: mintingState.fileType ?? "image/jpeg",
        });
      }

      newData = newData.concat(data);

      return newData;
    }, [
      data,
      mintingState.loading,
      mintingState.tokenId,
      mintingState.file,
      mintingState.fileType,
      isBlocked,
      profileId,
      user?.data.profile.profile_id,
    ]);

    const _layoutProvider = useNFTCardsListLayoutProvider({
      newData,
      headerHeight: 0,
    });

    const dataProvider = useMemo(
      () =>
        new DataProvider((r1, r2) => {
          return typeof r1 === "string" && typeof r2 === "string"
            ? r1 !== r2
            : r1.nft_id !== r2.nft_id;
        }).cloneWithRows(newData),
      [newData]
    );
    const contentWidth = useContentWidth();

    const layoutSize = useMemo(
      () => ({
        width: contentWidth,
        height,
      }),
      [contentWidth, height]
    );
    const _rowRenderer = useCallback(
      (_type: any, item: any) => {
        // currently minting nft
        if (item.loading) {
          return <Card nft={item} numColumns={3} />;
        }

        return (
          <Card
            nft={item}
            numColumns={3}
            listId={list.type}
            onPress={() => onItemPress(item.nft_id)}
            hrefProps={{
              pathname: `/nft/${item.chain_name}/${item.contract_address}/${item.token_id}`,
            }}
          />
        );
      },
      [list.type, onItemPress]
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
        {dataProvider && dataProvider.getSize() > 0 && (
          <TabRecyclerList
            layoutProvider={_layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={_rowRenderer}
            onEndReached={fetchMore}
            style={{
              flex: 1,
              margin: -GAP_BETWEEN_ITEMS,
            }}
            renderFooter={ListFooterComponent}
            layoutSize={layoutSize}
            index={index}
            ref={tabRef}
          />
        )}
      </MutateProvider>
    );
  }
);
