import { memo, useMemo, Suspense } from "react";
import { useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Divider } from "@showtime-xyz/universal.divider";
import { Close, Maximize } from "@showtime-xyz/universal.icon";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Collection } from "app/components/card/rows";
import { Description } from "app/components/card/rows/description";
import { Creator } from "app/components/card/rows/elements/creator";
import { Owner } from "app/components/card/rows/owner";
import { Social } from "app/components/card/social";
import { ClaimButton } from "app/components/claim/claim-button";
import { LikedBy } from "app/components/liked-by";
import { Media } from "app/components/media";
import { NFTDropdown } from "app/components/nft-dropdown";
import { MAX_HEADER_WIDTH } from "app/constants/layout";
import { LikeContextProvider } from "app/context/like-context";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useTabState } from "app/hooks/use-tab-state";

import { useRouter } from "design-system/router/use-router";
import { IndependentTabBar } from "design-system/tab-view/independent-tab-bar";

import { FeedItemProps } from "./index";

const NFT_DETAIL_WIDTH = 380;
const FEED_ITEM_ROUTES = [
  {
    title: "Comments",
    key: "Comments",
    index: 0,
  },
  {
    title: "Listings",
    key: "Listings",
    index: 1,
  },
  {
    title: "Activity",
    key: "Activity",
    index: 2,
  },
];
export const FeedItemMD = memo<FeedItemProps>(function FeedItemMD({
  nft,
  itemHeight,
  listId,
}) {
  const router = useRouter();
  const { index, setIndex, routes } = useTabState(FEED_ITEM_ROUTES);

  const { width: windowWidth } = useWindowDimensions();
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );
  const isCreatorDrop = !!nft.creator_airdrop_edition_address;

  const feedItemStyle = {
    height: itemHeight,
    width: windowWidth,
  };

  const mediaHeight = Math.min(windowWidth, feedItemStyle.height) - 160;

  const mediaWidth = useMemo(() => {
    if (windowWidth >= MAX_HEADER_WIDTH) {
      return MAX_HEADER_WIDTH - NFT_DETAIL_WIDTH;
    }

    return windowWidth - NFT_DETAIL_WIDTH;
  }, [windowWidth]);
  const onClose = () => {
    // TODO
  };
  return (
    <LikeContextProvider nft={nft} key={nft.nft_id}>
      <View
        tw="h-full w-full max-w-screen-2xl flex-row overflow-hidden"
        style={{ height: itemHeight }}
      >
        <View style={[tw.style("flex-1 bg-gray-100 dark:bg-black")]}>
          <View tw="w-full flex-row items-center justify-between p-4">
            <Button
              variant="tertiary"
              size="regular"
              onPress={() => router.pop()}
              iconOnly
              style={tw.style("dark:bg-gray-900 bg-white px-3")}
            >
              <Close width={24} height={24} />
            </Button>
            <View tw="flex-row items-center">
              <Button
                variant="tertiary"
                size="regular"
                onPress={onClose}
                iconOnly
                style={tw.style("dark:bg-gray-900 bg-white mr-4 px-3")}
              >
                <Maximize width={24} height={24} />
              </Button>
              <Suspense fallback={<Skeleton width={24} height={24} />}>
                <NFTDropdown
                  btnProps={{
                    style: tw.style("dark:bg-gray-900 bg-white mr-4 px-3"),
                    variant: "tertiary",
                    size: "regular",
                  }}
                  nft={nft}
                  listId={listId}
                />
              </Suspense>
            </View>
          </View>

          <Media
            item={nft}
            numColumns={1}
            tw={`h-[${mediaHeight}px] w-[${Math.min(mediaWidth, 800)}px]`}
            resizeMode="contain"
          />
        </View>
        <View
          style={[
            tw.style(
              "bg-white dark:bg-black shadow-lg shadow-black/5 dark:shadow-white/50"
            ),
            {
              width: NFT_DETAIL_WIDTH,
            },
          ]}
        >
          <Collection nft={nft} />
          <Divider tw="my-2" />
          <Social nft={nft} />
          <LikedBy nft={nft} />
          <View tw="my-4 mr-4 flex-row justify-between px-4">
            <Text tw="font-space-bold text-lg text-black dark:text-white md:text-2xl">
              {nft.token_name}
            </Text>
          </View>
          <Description nft={nft} />
          <View tw="flex-row items-center justify-between px-4">
            <Creator nft={nft} />
            <Owner nft={nft} price={false} />
          </View>
          <View tw="px-4 py-4">
            {isCreatorDrop && edition ? (
              <ClaimButton edition={edition} />
            ) : null}
            {/* {!isCreatorDrop ? <BuyButton nft={nft} /> : null} */}
          </View>
          <IndependentTabBar
            onPress={(i) => {
              setIndex(i);
            }}
            routes={FEED_ITEM_ROUTES}
            index={index}
          />
          {/* Comments */}
        </View>
      </View>
    </LikeContextProvider>
  );
});
FeedItemMD.displayName = "FeedItemMD";
