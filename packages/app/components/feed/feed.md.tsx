import React, { useCallback, useMemo } from "react";
import { Platform } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { CreatorPreview } from "app/components/creator-preview";
import { ErrorBoundary } from "app/components/error-boundary";
import { VideoConfigContext } from "app/context/video-config-context";
import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { useFeed } from "app/hooks/use-feed";
import { useFollowSuggestions } from "app/hooks/use-follow-suggestions";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { Sticky } from "app/lib/stickynode";
import { TextLink } from "app/navigation/link";
import type { NFT } from "app/types";

import { Hidden } from "design-system/hidden";

const CARD_HEIGHT = 825;
const CARD_CONTAINER_WIDTH = 620;
const HORIZONTAL_GAPS = 24;
const CARD_WIDTH = CARD_CONTAINER_WIDTH - HORIZONTAL_GAPS;
const LEFT_SLIDE_WIDTH = 320;
const LEFT_SLIDE_MARGIN = 64 - HORIZONTAL_GAPS / 2;

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

const FeedMd = () => {
  return (
    <View tw="max-w-7xl flex-1 pb-8 pt-24" testID="homeFeed">
      <ErrorBoundary>
        <FeedList />
      </ErrorBoundary>
    </View>
  );
};
export default FeedMd;

export const FeedList = () => {
  return (
    <View tw="flex-row">
      <Hidden until="xl">
        <View
          style={{
            width: LEFT_SLIDE_WIDTH,
            marginRight: LEFT_SLIDE_MARGIN,
          }}
        >
          <Sticky enabled>
            <SuggestedUsers />
          </Sticky>
        </View>
      </Hidden>
      <View tw="flex-1" style={{ width: CARD_CONTAINER_WIDTH }}>
        <ErrorBoundary>
          <HomeFeed />
        </ErrorBoundary>
      </View>
    </View>
  );
};

const HomeFeed = () => {
  const { data, isLoading } = useFeed();
  return (
    <NFTScrollList data={data} fetchMore={() => null} isLoading={isLoading} />
  );
};

type NFTScrollListProps = {
  data: NFT[];
  fetchMore: () => void;
  isLoading: boolean;
  // tab?: Tab;
};
const NFTScrollList = ({ data, isLoading, fetchMore }: NFTScrollListProps) => {
  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<NFT>) => {
    return (
      <View tw="p-2">
        <Card
          as={getNFTSlug(item)}
          href={`${getNFTSlug(item)}?initialScrollIndex=${index}&type=feed`}
          nft={item}
          sizeStyle={{ width: CARD_WIDTH, height: CARD_WIDTH }}
          tw="mb-4"
          showClaimButton
          index={index}
        />
      </View>
    );
  }, []);
  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <View
        style={{
          //@ts-ignore
          overflowY: Platform.OS === "web" ? "hidden" : undefined,
        }}
      >
        <ViewabilityInfiniteScrollList
          data={data}
          renderItem={renderItem}
          estimatedItemSize={CARD_HEIGHT}
          onEndReached={fetchMore}
          preserveScrollPosition
          ListEmptyComponent={
            isLoading ? (
              <View tw="mx-auto p-10">
                <Spinner />
              </View>
            ) : null
          }
        />
      </View>
    </VideoConfigContext.Provider>
  );
};

// TODO: move to separate file
const SuggestedUsers = () => {
  const { data, loading } = useFollowSuggestions();
  const router = useRouter();
  const isDark = useIsDarkMode();
  return (
    <>
      <View tw="h-16 justify-center">
        <Text tw="text-2xl font-bold text-black dark:text-white">For you</Text>
      </View>

      <View tw="mt-8 rounded-2xl bg-white dark:bg-black">
        <Text tw="p-4 text-lg dark:text-white">Suggested</Text>
        {loading ? (
          <View tw="m-4 p-2">
            <View tw="h-16">
              <Skeleton width={100} height={20} />
            </View>
            <View tw="h-16">
              <Skeleton width={100} height={20} />
            </View>
            <View tw="h-16">
              <Skeleton width={100} height={20} />
            </View>
          </View>
        ) : null}
        {data?.map((user, index) => {
          return (
            <CreatorPreview
              creator={user}
              onMediaPress={(index: number) => {
                const item = user?.top_items![index];
                router.push(
                  `/nft/${item.chain_name}/${item.contract_address}/${item.token_id}`
                );
              }}
              mediaSize={90}
              key={`CreatorPreview-${index}`}
            />
          );
        })}
      </View>

      <View tw="mt-8 rounded-2xl bg-white dark:bg-black">
        <Text tw="p-4 text-lg dark:text-white">Get the app</Text>
        <View tw="flex flex-row items-center justify-between px-2 py-4">
          <TextLink
            tw="text-base font-bold dark:text-white"
            href="https://apps.apple.com/us/app/showtime-nft-social-network/id1606611688"
            target="_blank"
          >
            <Image
              source={{
                uri: isDark
                  ? "/assets/AppStoreDark.png"
                  : "/assets/AppStoreLight.png",
              }}
              width={144}
              height={42}
              tw="duration-150 hover:scale-105"
              alt="App Store"
            />
          </TextLink>
          <TextLink
            tw="text-base font-bold dark:text-white"
            href="https://play.google.com/store/apps/details?id=io.showtime"
            target="_blank"
          >
            <Image
              source={{
                uri: isDark
                  ? "/assets/GooglePlayDark.png"
                  : "/assets/GooglePlayLight.png",
              }}
              width={144}
              height={42}
              tw="duration-150 hover:scale-105"
              alt="Google Play"
            />
          </TextLink>
        </View>
      </View>
    </>
  );
};
