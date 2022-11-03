import React, { useCallback, useMemo } from "react";
import { Platform } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
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

// type Tab = "following" | "curated" | "" | undefined;

// type Query = {
//   tab: number;
// };

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

export const Feed = () => {
  return (
    <View tw="max-w-7xl flex-1 pb-8 pt-24" testID="homeFeed">
      <ErrorBoundary>
        <FeedList />
      </ErrorBoundary>
    </View>
  );
};

// const { useParam } = createParam<Query>();

export const FeedList = () => {
  // const { isAuthenticated } = useUser();
  // const [selected, setSelected] = useParam("tab", {
  //   parse: (v) => Number(v ?? 1),
  //   initial: 1,
  // });
  // const isDark = useIsDarkMode();

  // const handleTabChange = useCallback(
  //   (index: number) => {
  //     Haptics.impactAsync();
  //     setSelected(index);
  //   },
  //   [setSelected]
  // );

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
        {/* {isAuthenticated ? (
          <>
            <View
              tw="mr-2 mb-6 w-[375px] self-end rounded-lg bg-white p-4 shadow-lg dark:bg-black dark:shadow-dark shadow-light"
            >
              <SegmentedControl
                values={["FOLLOWING", "FOR YOU"]}
                onChange={handleTabChange}
                selectedIndex={selected}
              />
            </View>
            <Tabs.Root onIndexChange={setSelected} index={selected}>
              <Tabs.Pager
                style={{
                  width: CARD_CONTAINER_WIDTH,
                }}
              >
                <ErrorBoundary>
                  <Suspense fallback={<View />}>
                    <FollowingFeed />
                  </Suspense>
                </ErrorBoundary>
                <ErrorBoundary>
                  <Suspense fallback={<View />}>
                    <AlgorithmicFeed />
                  </Suspense>
                </ErrorBoundary>
              </Tabs.Pager>
            </Tabs.Root>
          </>
        ) : (
          <CuratedFeed />
        )} */}

        <ErrorBoundary>
          <HomeFeed />
        </ErrorBoundary>
      </View>
    </View>
  );
};

// const FollowingFeed = () => {
//   const queryState = useFeed("/following");

//   return (
//     <MutateProvider mutate={queryState.updateItem}>
//       <NFTScrollList {...queryState} data={queryState.data} tab="following" />
//     </MutateProvider>
//   );
// };

// const AlgorithmicFeed = () => {
//   const queryState = useFeed("");

//   return (
//     <MutateProvider mutate={queryState.updateItem}>
//       <NFTScrollList {...queryState} data={queryState.data} />
//     </MutateProvider>
//   );
// };

// const CuratedFeed = () => {
//   // const queryState = useFeed("/curated");
//   const { data } = useTrendingNFTS({
//     days: 1,
//   });

//   return <NFTScrollList data={data} tab="curated" fetchMore={() => null} />;
// };

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
          href={`/list?initialScrollIndex=${index}&type=feed`}
          nft={item}
          sizeStyle={{ width: CARD_WIDTH, height: CARD_WIDTH }}
          tw="mb-4"
          showClaimButton
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
          overscan={{
            main: CARD_HEIGHT,
            reverse: CARD_HEIGHT,
          }}
          estimatedItemSize={CARD_HEIGHT}
          onEndReached={fetchMore}
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
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  return (
    <>
      <View tw="h-16 justify-center">
        <Text tw="font-space-bold text-2xl text-black dark:text-white">
          Home
        </Text>
      </View>

      <View tw="dark:shadow-dark shadow-light mt-8 rounded-2xl bg-white dark:bg-black">
        <Text tw="font-space-bold p-4 text-lg dark:text-white">Suggested</Text>
        {loading ? (
          <View tw="m-4">
            <Skeleton colorMode={colorScheme as any} width={100} height={20} />
            <View tw="h-4" />
            <Skeleton colorMode={colorScheme as any} width={90} height={15} />
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

      <View tw="dark:shadow-dark shadow-light mt-8 rounded-2xl bg-white dark:bg-black">
        <Text tw="font-space-bold p-4 text-lg dark:text-white">
          Get the app
        </Text>
        <View tw="flex flex-row items-center justify-between p-4">
          <TextLink
            tw="font-space-bold text-base dark:text-white"
            href="https://apps.apple.com/us/app/showtime-nft-social-network/id1606611688"
          >
            🍎 App Store
          </TextLink>
          <TextLink
            tw="font-space-bold text-base dark:text-white"
            href="https://play.google.com/store/apps/details?id=io.showtime"
          >
            🤖 Google Play
          </TextLink>
        </View>
      </View>
    </>
  );
};
