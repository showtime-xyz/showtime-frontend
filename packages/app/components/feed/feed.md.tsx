import { useCallback, useMemo, useRef, memo, useEffect, Suspense } from "react";
import { Dimensions, useWindowDimensions } from "react-native";

import { Collection } from "app/components/feed/collection";
import { CommentButton } from "app/components/feed/comment-button";
import { Like } from "app/components/feed/like";
import { LikeContextProvider } from "app/context/like-context";
import { useFeed } from "app/hooks/use-feed";
import { DataProvider, LayoutProvider } from "app/lib/recyclerlistview";
import { RecyclerListView } from "app/lib/recyclerlistview";
import type { NFT } from "app/types";

import { Avatar } from "design-system/avatar";
import { Divider } from "design-system/divider";
import { Media } from "design-system/media";
import { Text } from "design-system/text";
import { View } from "design-system/view";

export const NFTCard = ({ nft }: { nft: NFT }) => {
  return (
    <LikeContextProvider nft={nft}>
      <View tw="ml-150 mb-4">
        <View tw="w-[540px] bg-white dark:bg-black shadow-lg rounded-lg">
          <View tw="flex-row p-4">
            <Avatar
              url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
              size={32}
            />
            <View tw="justify-around ml-2">
              <Text tw="text-gray-600 dark:text-gray-400 text-xs font-semibold">
                Creator
              </Text>
              <Text tw="text-black dark:text-white text-xs font-semibold">
                @{nft.creator_username}
              </Text>
            </View>
          </View>
          <Media item={nft} />

          <View tw="p-4">
            <Text tw="text-black dark:text-white" variant="text-xl">
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
          <View tw="px-4 py-2">
            <Collection nft={nft} />
          </View>
        </View>
        {/* <Divider /> */}
      </View>
    </LikeContextProvider>
  );
};

export const Feed = () => {
  return <CuratedFeed />;
};

const CuratedFeed = () => {
  //   const { data, fetchMore } = useFeed("/curated");
  const { data, fetchMore } = useFeed("");
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
    <View tw="flex-row">
      <View style={{ height: Dimensions.get("screen").height }}>
        <RecyclerListView
          dataProvider={dataProvider}
          layoutProvider={_layoutProvider}
          useWindowScroll
          forceNonDeterministicRendering
          rowRenderer={_rowRenderer}
          onEndReached={fetchMore}
        />
      </View>
    </View>
  );
};
