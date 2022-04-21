import { Suspense, useCallback, useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { ErrorBoundary } from "app/components/error-boundary";
import { VideoConfigContext } from "app/context/video-config-context";
import { useFeed } from "app/hooks/use-feed";
import { useFollowSuggestions } from "app/hooks/use-follow-suggestions";
import { useUser } from "app/hooks/use-user";
import { useColorScheme } from "app/lib/color-scheme";
import { DataProvider, LayoutProvider } from "app/lib/recyclerlistview";
import { RecyclerListView } from "app/lib/recyclerlistview";
import type { NFT } from "app/types";

import { CreatorPreview, Skeleton, Tabs, Text } from "design-system";
import { Card } from "design-system/card";
import { tw } from "design-system/tailwind";
import { View } from "design-system/view";

const CARD_HEIGHT = 860;
const CARD_WIDTH = 590;

export const Feed = () => {
  return (
    <View tw="flex-1" testID="homeFeed">
      <ErrorBoundary>
        <Suspense fallback={<View />}>
          <FeedList />
        </Suspense>
      </ErrorBoundary>
    </View>
  );
};

// TODO: move to separate file
const SuggestedUsers = () => {
  const { data, loading } = useFollowSuggestions();
  const colorMode = useColorScheme();
  return (
    <View tw="bg-white dark:bg-black shadow-lg w-[400px] rounded-lg">
      <Text
        tw="dark:text-white p-4"
        //@ts-ignore
        variant="text-xl"
      >
        Suggested
      </Text>
      {loading ? (
        <View tw="m-4">
          <Skeleton colorMode={colorMode} width={200} height={20} />
          <View tw="h-4" />
          <Skeleton colorMode={colorMode} width={140} height={15} />
        </View>
      ) : null}
      {data?.map((user) => {
        return (
          <CreatorPreview
            creator={user}
            onMediaPress={() => {}}
            mediaSize={120}
          />
        );
      })}
    </View>
  );
};

export const FeedList = () => {
  const { isAuthenticated } = useUser();

  return (
    <View tw="flex-row">
      <View
        style={{
          position: Platform.OS === "web" ? "fixed" : null,
          zIndex: 2,
          left: 100,
        }}
      >
        <SuggestedUsers />
      </View>
      <View tw="flex-2">
        {isAuthenticated ? (
          <Tabs.Root>
            <Tabs.List
              contentContainerStyle={tw.style(
                "justify-center mb-4 mx-2 dark:bg-black bg-white"
              )}
            >
              <Tabs.Trigger>
                <View tw="p-2">
                  <Text variant="text-sm" tw="dark:text-white text-black">
                    Following
                  </Text>
                </View>
              </Tabs.Trigger>
              <Tabs.Trigger>
                <View tw="p-2 ml-2">
                  <Text variant="text-sm" tw="dark:text-white text-black">
                    For You
                  </Text>
                </View>
              </Tabs.Trigger>
            </Tabs.List>
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
  const { width: screenWidth } = useWindowDimensions();

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

  const _rowRenderer = useCallback((_type: any, item: any, idx) => {
    return (
      <View tw="w-full flex-row" nativeID="334343">
        <View tw="flex-2" />
        <Card
          nft={item}
          tw={`w-[${CARD_WIDTH}px] h-[${CARD_HEIGHT - 32}px] mb-8 ml-auto`}
        />
        <View tw="flex-1" />
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
        //@ts-ignore
        style={{ overflowX: Platform.OS === "web" ? "hidden" : undefined }}
      >
        <RecyclerListView
          dataProvider={dataProvider}
          layoutProvider={_layoutProvider}
          useWindowScroll
          rowRenderer={_rowRenderer}
          onEndReached={fetchMore}
          onEndReachedThreshold={300}
        />
      </View>
    </VideoConfigContext.Provider>
  );
};
