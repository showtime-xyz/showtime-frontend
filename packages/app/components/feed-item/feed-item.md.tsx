import { memo, useMemo, Suspense, useRef } from "react";
import { useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Close } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Description } from "app/components/card/rows/description";
import { Creator } from "app/components/card/rows/elements/creator";
import { Owner } from "app/components/card/rows/owner";
import { Social } from "app/components/card/social";
import { ClaimButton } from "app/components/claim/claim-button";
import { Comments } from "app/components/comments";
import { ErrorBoundary } from "app/components/error-boundary";
import { LikedBy } from "app/components/liked-by";
import { Media } from "app/components/media";
import { Activities } from "app/components/nft-activity";
import { NFTDropdown } from "app/components/nft-dropdown";
import { MAX_HEADER_WIDTH } from "app/constants/layout";
import { LikeContextProvider } from "app/context/like-context";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useTabState } from "app/hooks/use-tab-state";
import { createParam } from "app/navigation/use-param";

import { IndependentTabBar } from "design-system/tab-view/independent-tab-bar";
import { CARD_DARK_SHADOW, CARD_LIGHT_SHADOW } from "design-system/theme";

import { FeedItemProps } from "./index";

const NFT_DETAIL_WIDTH = 380;

const TAB_SCENES_MAP = new Map([
  [0, Comments],
  [1, Activities],
]);
type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};
const { useParam } = createParam<Query>();

export const FeedItemMD = memo<FeedItemProps>(function FeedItemMD({
  nft,
  itemHeight,
  listId,
}) {
  const router = useRouter();
  const isDark = useIsDarkMode();
  // const [showFullScreen, setShowFullScreen] = useState(false);
  const { index, setIndex, routes } = useTabState([
    {
      title: "Comments",
      key: "Comments",
      index: 0,
      subtitle: nft.comment_count,
    },
    {
      title: "Activity",
      key: "Activity",
      index: 1,
    },
  ]);
  const { width: windowWidth } = useWindowDimensions();
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data: nftDetails } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  const container = useRef<HTMLElement | null>(null);
  // useFullScreen(container?.current as HTMLElement, showFullScreen);

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

  // Todo: add full screen feature, but not sure why it is black screen on fullscreen.
  // const onFullScreen = () => {
  //   setShowFullScreen(true);
  // };
  const onClose = () => {
    router.pop();
    // if (showFullScreen) {
    //   setShowFullScreen(false);
    // } else {
    //   router.pop();
    // }
  };
  const TabScene = useMemo(() => TAB_SCENES_MAP.get(index), [index]);

  return (
    <LikeContextProvider nft={nft} key={nft.nft_id}>
      <View
        tw="h-full w-full max-w-screen-2xl flex-row overflow-hidden"
        style={{ height: itemHeight }}
      >
        <View style={tw.style("flex-1 bg-gray-100 dark:bg-black")}>
          <View
            ref={container}
            tw="w-full flex-row items-center justify-between p-4"
          >
            <Button
              variant="tertiary"
              size="regular"
              onPress={onClose}
              iconOnly
              style={tw.style("dark:bg-gray-900 bg-white px-3")}
            >
              <Close width={24} height={24} />
            </Button>
            <View tw="flex-row items-center">
              {/* <Button
                variant="tertiary"
                size="regular"
                onPress={onFullScreen}
                iconOnly
                style={tw.style("dark:bg-gray-900 bg-white mr-4 px-3")}
              >
                <Maximize width={24} height={24} />
              </Button> */}
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
            tw.style("bg-white dark:bg-black"),
            {
              width: NFT_DETAIL_WIDTH,
              // @ts-ignore Todo: will use tailwind config when switch to NativeWind.
              boxShadow: isDark ? CARD_DARK_SHADOW : CARD_LIGHT_SHADOW,
            },
          ]}
        >
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
            routes={routes}
            index={index}
          />
          <ErrorBoundary>
            <Suspense
              fallback={
                <View tw="mt-10 items-center justify-center">
                  <Spinner size="small" />
                </View>
              }
            >
              {TabScene && nftDetails?.data.item && (
                <TabScene nft={nftDetails?.data.item} />
              )}
            </Suspense>
          </ErrorBoundary>
          <View tw="h-2" />
        </View>
      </View>
    </LikeContextProvider>
  );
});
FeedItemMD.displayName = "FeedItemMD";
