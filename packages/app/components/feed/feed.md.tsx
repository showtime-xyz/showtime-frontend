import React, { Suspense, useCallback, useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { CreatorPreview } from "app/components/creator-preview";
import { ErrorBoundary } from "app/components/error-boundary";
import { VideoConfigContext } from "app/context/video-config-context";
import { useFeed } from "app/hooks/use-feed";
import { useFollowSuggestions } from "app/hooks/use-follow-suggestions";
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from "app/lib/recyclerlistview";
import { Sticky } from "app/lib/stickynode";
import type { NFT } from "app/types";

import { Hidden } from "design-system/hidden";
import { CARD_DARK_SHADOW } from "design-system/theme";

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

export const Feed = () => {
  return (
    <View tw="max-w-7xl flex-1 py-8" testID="homeFeed">
      <ErrorBoundary>
        <Suspense fallback={<View />}>
          <FeedList />
        </Suspense>
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
              tw="mr-2 mb-6 w-[375px] self-end rounded-lg bg-white p-4 shadow-lg dark:bg-black"
              style={{
                // @ts-ignore
                boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
              }}
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
          <Suspense fallback={<View />}>
            <HomeFeed />
          </Suspense>
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
  const { data } = useFeed();

  return <NFTScrollList data={data} fetchMore={() => null} />;
};

const NFTScrollList = ({
  data,
  fetchMore,
}: {
  data: NFT[];
  fetchMore: any;
  // tab?: Tab;
}) => {
  const { width: screenWidth, height } = useWindowDimensions();
  let dataProvider = useMemo(
    () =>
      new DataProvider((r1, r2) => {
        return r1.nft_id !== r2.nft_id;
      }).cloneWithRows(data),
    [data]
  );

  const _layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        () => {
          return "item";
        },
        (_type, dim) => {
          dim.width = screenWidth;
          dim.height = CARD_HEIGHT;
        }
      ),
    [screenWidth]
  );

  const layoutSize = useMemo(
    () => ({
      width: CARD_CONTAINER_WIDTH,
      height,
    }),
    [height]
  );

  const _rowRenderer = useCallback((_type: any, item: any) => {
    return (
      <View tw="flex-row justify-center" nativeID="334343">
        <Card
          hrefProps={{
            pathname: `/nft/${item.chain_name}/${item.contract_address}/${item.token_id}`,
          }}
          nft={item}
          tw={`w-[${CARD_WIDTH}px] mt-2`}
        />
      </View>
    );
  }, []);

  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  // if (data?.length === 0 && !isLoading) {
  //   return (
  //     <View
  //       tw="mt-4 h-[60vh] w-full justify-center rounded-2xl"
  //       style={{
  //         // @ts-ignore
  //         boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
  //       }}
  //     >
  //       <EmptyPlaceholder
  //         title="No results found"
  //         text="You can try to follow some users"
  //       />
  //     </View>
  //   );
  // }

  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <View
        style={{
          //@ts-ignore
          overflowX: Platform.OS === "web" ? "hidden" : undefined,
        }}
      >
        {dataProvider && dataProvider.getSize() > 0 && (
          <RecyclerListView
            dataProvider={dataProvider}
            layoutProvider={_layoutProvider}
            useWindowScroll
            rowRenderer={_rowRenderer}
            onEndReached={fetchMore}
            onEndReachedThreshold={300}
            layoutSize={layoutSize}
          />
        )}
      </View>
    </VideoConfigContext.Provider>
  );
};

// TODO: move to separate file
const SuggestedUsers = () => {
  const { data, loading } = useFollowSuggestions();
  const { colorScheme } = useColorScheme();
  const isDark = useIsDarkMode();
  const router = useRouter();

  return (
    <>
      <View tw="h-16 justify-center">
        <Text tw="font-space-bold text-2xl text-black dark:text-white">
          Home
        </Text>
      </View>
      <View
        tw="mt-8 rounded-2xl bg-white dark:bg-black"
        style={{
          // @ts-ignore
          boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
        }}
      >
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
                const item = user?.top_items[index];
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
    </>
  );
};
