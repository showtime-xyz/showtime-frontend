import React, { Suspense, useCallback, useMemo, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { ErrorBoundary } from "app/components/error-boundary";
import { VideoConfigContext } from "app/context/video-config-context";
import useContentWidth from "app/hooks/use-content-width";
import { useFeed } from "app/hooks/use-feed";
import { useFollowSuggestions } from "app/hooks/use-follow-suggestions";
import { useUser } from "app/hooks/use-user";
import { useColorScheme } from "app/lib/color-scheme";
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from "app/lib/recyclerlistview";
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
const CARD_WIDTH = 620;
const LEFT_SLIDE_WIDTH = 320;
const LEFT_SLIDE_MARGIN = 80;

export const Feed = () => {
  return (
    <View tw="flex-1 py-8 max-w-7xl" testID="homeFeed">
      <ErrorBoundary>
        <Suspense fallback={<View />}>
          <FeedList />
        </Suspense>
      </ErrorBoundary>
    </View>
  );
};

export const FeedList = () => {
  const { isAuthenticated } = useUser();
  const { width } = useWindowDimensions();
  const [selected, setSelected] = useState(1);

  return (
    <View tw="flex-row">
      <Hidden until="xl">
        <View
          style={{
            width: LEFT_SLIDE_WIDTH,
            // for right shadow
            marginRight: LEFT_SLIDE_MARGIN - 16,
          }}
        >
          <SuggestedUsers />
        </View>
      </Hidden>

      <View tw="flex-1">
        {isAuthenticated ? (
          <>
            <View tw="w-[375px] self-end bg-white dark:bg-black p-4 shadow-lg rounded-lg mr-6">
              <SegmentedControl
                values={["FOLLOWING", "FOR YOU"]}
                onChange={setSelected}
                selectedIndex={selected}
              />
            </View>
            <Tabs.Root
              onIndexChange={setSelected}
              value={selected.toString()}
              initialIndex={1}
            >
              <Tabs.Pager>
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

  return <NFTScrollList {...queryState} data={queryState.data} />;
};

const AlgorithmicFeed = () => {
  const queryState = useFeed("");

  return <NFTScrollList {...queryState} data={queryState.data} />;
};

const CuratedFeed = () => {
  const queryState = useFeed("/curated");

  return <NFTScrollList {...queryState} data={queryState.data} />;
};

const NFTScrollList = ({
  data,
  fetchMore,
}: {
  data: NFT[];
  fetchMore: any;
}) => {
  const { width: screenWidth, height } = useWindowDimensions();
  const contentWidth = useContentWidth(LEFT_SLIDE_MARGIN + LEFT_SLIDE_WIDTH);

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
          dim.width = contentWidth;
          dim.height = CARD_HEIGHT;
        }
      ),
    [screenWidth]
  );
  const layoutSize = useMemo(
    () => ({
      width: contentWidth - LEFT_SLIDE_MARGIN,
      height,
    }),
    [screenWidth]
  );
  const _rowRenderer = useCallback((_type: any, item: any, idx) => {
    return (
      <View tw="flex-row pl-4" nativeID="334343">
        <Card
          nft={item}
          tw={`w-[${CARD_WIDTH}px] h-[${CARD_HEIGHT - 32}px] my-4`}
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
      <Text variant="text-2xl" tw="text-black dark:text-white p-4">
        Home
      </Text>
      <View
        tw="bg-white dark:bg-black rounded-2xl mt-8"
        // @ts-ignore
        style={{
          position: Platform.OS === "web" ? "sticky" : null,
          top: 100,
          boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
        }}
      >
        <Text tw="dark:text-white p-4" variant="text-lg">
          Suggested
        </Text>
        {loading ? (
          <View tw="m-4">
            <Skeleton colorMode={colorMode} width={100} height={20} />
            <View tw="h-4" />
            <Skeleton colorMode={colorMode} width={90} height={15} />
          </View>
        ) : null}
        {data?.map((user) => {
          return (
            <CreatorPreview
              creator={user}
              onMediaPress={() => {}}
              mediaSize={90}
            />
          );
        })}
      </View>
    </>
  );
};
