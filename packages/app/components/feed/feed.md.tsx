import React, { Suspense, useCallback, useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { ErrorBoundary } from "app/components/error-boundary";
import { VideoConfigContext } from "app/context/video-config-context";
import { useFeed } from "app/hooks/use-feed";
import { useFollowSuggestions } from "app/hooks/use-follow-suggestions";
import { useUser } from "app/hooks/use-user";
import { useColorScheme } from "app/lib/color-scheme";
import { Haptics } from "app/lib/haptics";
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from "app/lib/recyclerlistview";
import { createParam } from "app/navigation/use-param";
import { MutateProvider } from "app/providers/mutate-provider";
import type { NFT } from "app/types";

import {
  CreatorPreview,
  SegmentedControl,
  Skeleton,
  Tabs,
  Text,
} from "design-system";
import { Card } from "design-system/card";
import { Hidden } from "design-system/hidden";
import { useIsDarkMode } from "design-system/hooks";
import { CARD_DARK_SHADOW } from "design-system/theme";
import { View } from "design-system/view";

const CARD_HEIGHT = 890;
const CARD_CONTAINER_WIDTH = 620;
const HORIZONTAL_GAPS = 24;
const CARD_WIDTH = CARD_CONTAINER_WIDTH - HORIZONTAL_GAPS;
const LEFT_SLIDE_WIDTH = 320;
const LEFT_SLIDE_MARGIN = 64 - HORIZONTAL_GAPS / 2;

type Tab = "following" | "curated" | "" | undefined;

type Query = {
  tab: number;
};

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

const { useParam } = createParam<Query>();

export const FeedList = () => {
  const { isAuthenticated } = useUser();
  const [selected, setSelected] = useParam("tab", {
    parse: (v) => Number(v ?? 1),
    initial: 1,
  });
  const isDark = useIsDarkMode();

  const handleTabChange = useCallback(
    (index: number) => {
      Haptics.impactAsync();
      setSelected(index);
    },
    [setSelected]
  );

  return (
    <View tw="flex-row">
      <Hidden until="xl">
        <View
          style={{
            flex: 1,
            maxWidth: LEFT_SLIDE_WIDTH,
            marginRight: LEFT_SLIDE_MARGIN,
          }}
        >
          <SuggestedUsers />
        </View>
      </Hidden>

      <View tw={`flex-2 max-w-[${CARD_CONTAINER_WIDTH}px]`}>
        {isAuthenticated ? (
          <>
            <View
              tw="mr-2 w-[375px] self-end rounded-lg bg-white p-4 shadow-lg dark:bg-black"
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
        )}
      </View>
    </View>
  );
};

const FollowingFeed = () => {
  const queryState = useFeed("/following");

  return (
    <MutateProvider mutate={queryState.updateItem}>
      <NFTScrollList {...queryState} data={queryState.data} tab="following" />
    </MutateProvider>
  );
};

const AlgorithmicFeed = () => {
  const queryState = useFeed("");

  return (
    <MutateProvider mutate={queryState.updateItem}>
      <NFTScrollList {...queryState} data={queryState.data} />
    </MutateProvider>
  );
};

const CuratedFeed = () => {
  const queryState = useFeed("/curated");

  return (
    <MutateProvider mutate={queryState.updateItem}>
      <NFTScrollList {...queryState} data={queryState.data} tab="curated" />
    </MutateProvider>
  );
};

const NFTScrollList = ({
  data,
  fetchMore,
  tab,
}: {
  data: NFT[];
  fetchMore: any;
  tab?: Tab;
}) => {
  const { width: screenWidth, height } = useWindowDimensions();
  const isDark = useIsDarkMode();
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
  const _rowRenderer = useCallback(
    (_type: any, item: any, index: number) => {
      return (
        <View tw="flex-row justify-center" nativeID="334343">
          <Card
            hrefProps={{
              pathname: "/list",
              query: {
                initialScrollIndex: index,
                type: "feed",
                tab,
              },
            }}
            nft={item}
            tw={`w-[${CARD_WIDTH}px] h-[${CARD_HEIGHT - 32}px] my-4`}
          />
        </View>
      );
    },
    [tab]
  );

  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );
  if (data?.length === 0) {
    return (
      <View
        tw="mt-4 h-[60vh] w-full justify-center rounded-2xl"
        style={{
          // @ts-ignore
          boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
        }}
      >
        <EmptyPlaceholder
          title="No results found"
          text="You can try to follow some users"
        />
      </View>
    );
  }
  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <View
        style={{
          //@ts-ignore
          overflowX: Platform.OS === "web" ? "hidden" : undefined,
        }}
      >
        <RecyclerListView
          dataProvider={dataProvider}
          layoutProvider={_layoutProvider}
          useWindowScroll
          rowRenderer={_rowRenderer}
          onEndReached={fetchMore}
          onEndReachedThreshold={300}
          layoutSize={layoutSize}
        />
      </View>
    </VideoConfigContext.Provider>
  );
};

// TODO: move to separate file
const SuggestedUsers = () => {
  const { data, loading } = useFollowSuggestions();
  const colorMode = useColorScheme();
  const isDark = useIsDarkMode();

  return (
    <>
      <Text tw="font-space-bold p-4 text-2xl text-black dark:text-white">
        Home
      </Text>
      <View
        tw="mt-8 rounded-2xl bg-white dark:bg-black"
        // @ts-ignore
        style={{
          position: Platform.OS === "web" ? "sticky" : null,
          top: 100,
          boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
        }}
      >
        <Text tw="font-space-bold p-4 text-lg dark:text-white">Suggested</Text>
        {loading ? (
          <View tw="m-4">
            <Skeleton colorMode={colorMode} width={100} height={20} />
            <View tw="h-4" />
            <Skeleton colorMode={colorMode} width={90} height={15} />
          </View>
        ) : null}
        {data?.map((user, index) => {
          return (
            <CreatorPreview
              creator={user}
              onMediaPress={() => {}}
              mediaSize={90}
              key={`CreatorPreview-${index}`}
            />
          );
        })}
      </View>
    </>
  );
};
