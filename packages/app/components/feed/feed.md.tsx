import { useCallback, useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { Collection } from "app/components/feed/collection";
import { CommentButton } from "app/components/feed/comment-button";
import { Like } from "app/components/feed/like";
import { LikeContextProvider } from "app/context/like-context";
import { VideoConfigContext } from "app/context/video-config-context";
import { useFeed } from "app/hooks/use-feed";
import { useUser } from "app/hooks/use-user";
import { DataProvider, LayoutProvider } from "app/lib/recyclerlistview";
import { RecyclerListView } from "app/lib/recyclerlistview";
import type { NFT } from "app/types";

import { TabItem, Tabs } from "design-system";
import { Avatar } from "design-system/avatar";
import { Media } from "design-system/media";
import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";
import { View } from "design-system/view";

const CARD_HEIGHT = 750;
const CARD_WIDTH = 540;
const CARD_SEPARATOR = 16;

export const NFTCard = ({ nft }: { nft: NFT }) => {
  return (
    <LikeContextProvider nft={nft}>
      <View tw="flex-1 flex-row">
        <View
          tw={`w-[${CARD_WIDTH}px] h-[${
            CARD_HEIGHT - CARD_SEPARATOR
          }px] bg-white dark:bg-black shadow-lg rounded-lg`}
        >
          <View tw="flex-row p-4">
            <Avatar
              url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
              size={32}
            />
            <View tw="justify-around ml-2">
              <Text tw="text-gray-600 dark:text-gray-400 text-xs font-semibold">
                Creator
              </Text>
              <Text
                tw="text-black dark:text-white text-xs font-semibold"
                numberOfLines={1}
              >
                @{nft.creator_username}
              </Text>
            </View>
          </View>
          <Media item={nft} />

          <View tw="p-4">
            <Text
              tw="text-black dark:text-white"
              variant="text-xl"
              numberOfLines={1}
            >
              {nft.token_name}
            </Text>

            <View tw="flex-row mt-4">
              <Like nft={nft} />
              <View tw="ml-4">
                <CommentButton nft={nft} />
              </View>
            </View>

            {/* <View tw="py-4">
            <View tw={`w-[30px] h-[30px] justify-between flex-row flex-wrap`}>
              <Avatar
                url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
                size={14}
              />
              <Avatar
                url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
                size={14}
              />
              <Avatar
                url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
                size={14}
              />
              <Avatar
                url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
                size={14}
              />
            </View>
          </View> */}
          </View>
          <View tw="h-[1px] bg-gray-100" />
          <View tw="p-3">
            <Collection nft={nft} />
          </View>
        </View>
      </View>
    </LikeContextProvider>
  );
};

export const Feed = () => {
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    return (
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
          <FollowingFeed />
          <AlgorithmicFeed />
        </Tabs.Pager>
      </Tabs.Root>
    );
  }

  return <CuratedFeed />;
};

const FollowingFeed = () => {
  const queryState = useFeed("/following");

  return <FeedList {...queryState} data={queryState.data} />;
};

const AlgorithmicFeed = () => {
  const queryState = useFeed("");

  return <FeedList {...queryState} data={queryState.data} />;
};

const CuratedFeed = () => {
  const queryState = useFeed("/curated");

  return <FeedList {...queryState} data={queryState.data} />;
};

const FeedList = ({ data, fetchMore }: { data: NFT[]; fetchMore: any }) => {
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
    return <NFTCard nft={item} />;
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
        tw="flex-row"
        //@ts-ignore
        style={{ overflowX: Platform.OS === "web" ? "hidden" : undefined }}
      >
        <View tw="bg-white dark:bg-black p-4 shadow-xl md:mx-10 flex-1">
          <Text>Suggested</Text>
        </View>
        <View tw="flex-2">
          <RecyclerListView
            dataProvider={dataProvider}
            layoutProvider={_layoutProvider}
            useWindowScroll
            rowRenderer={_rowRenderer}
            onEndReached={fetchMore}
          />
        </View>
      </View>
    </VideoConfigContext.Provider>
  );
};
