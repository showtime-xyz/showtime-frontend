import { Suspense, useCallback, useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { ErrorBoundary } from "app/components/error-boundary";
import { VideoConfigContext } from "app/context/video-config-context";
import { useFeed } from "app/hooks/use-feed";
import { useUser } from "app/hooks/use-user";
import { DataProvider, LayoutProvider } from "app/lib/recyclerlistview";
import { RecyclerListView } from "app/lib/recyclerlistview";
import type { NFT } from "app/types";

import { TabItem, Tabs, Text } from "design-system";
import { Card } from "design-system/card";
import { tw } from "design-system/tailwind";
import { View } from "design-system/view";

const CARD_HEIGHT = 790;

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
  return (
    <View tw="bg-white dark:bg-black p-4 shadow-xl md:mx-10 flex-1">
      <Text tw="text-white">Suggested</Text>
    </View>
  );
};

export const FeedList = () => {
  const { isAuthenticated } = useUser();

  return (
    <View tw="flex-row">
      <View tw="flex-1 absolute">
        <SuggestedUsers />
      </View>
      <View tw="flex-2">
        {isAuthenticated ? (
          <Tabs.Root>
            <Tabs.List contentContainerStyle={tw.style("justify-center")}>
              <Tabs.Trigger>
                <TabItem name="Following" />
              </Tabs.Trigger>
              <Tabs.Trigger>
                <TabItem name="For you" />
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

  const _rowRenderer = useCallback((_type: any, item: any) => {
    return (
      <View tw="w-full flex-row" nativeID="334343">
        <View tw="flex-2" />
        <Card nft={item} tw={`w-35% mb-4 ml-auto`} />
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
