import { memo, useMemo, Suspense, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Close } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { TabBarSingle } from "@showtime-xyz/universal.tab-view";
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
import { MuteButton } from "app/components/mute-button/mute-button";
import { Activities } from "app/components/nft-activity";
import { NFTDropdown } from "app/components/nft-dropdown";
import { MAX_HEADER_WIDTH } from "app/constants/layout";
import { LikeContextProvider } from "app/context/like-context";
import { useComments } from "app/hooks/api/use-comments";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { createParam } from "app/navigation/use-param";

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
}) {
  const router = useRouter();
  const isDark = useIsDarkMode();
  // const [showFullScreen, setShowFullScreen] = useState(false);
  const { commentsCount } = useComments(nft.nft_id);
  const routes = useMemo(
    () => [
      {
        title: "Comments",
        key: "Comments",
        index: 0,
        subtitle: commentsCount,
      },
      {
        title: "Activity",
        key: "Activity",
        index: 1,
      },
    ],
    [commentsCount]
  );

  const [index, setIndex] = useState(0);

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
    if (history?.length > 1) {
      router.pop();
    } else {
      router.push("/");
    }

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
        <View tw="flex-1 bg-gray-100 dark:bg-black">
          <View
            ref={container}
            tw="w-full flex-row items-center justify-between p-4"
          >
            <Button
              variant="tertiary"
              size="regular"
              onPress={onClose}
              iconOnly
              tw="bg-white px-3 dark:bg-gray-900"
            >
              <Close width={24} height={24} />
            </Button>
            <View tw="flex-row items-center">
              {/* <Button
                variant="tertiary"
                size="regular"
                onPress={onFullScreen}
                iconOnly
                tw="dark:bg-gray-900 bg-white mr-4 px-3"
              >
                <Maximize width={24} height={24} />
              </Button> */}
              <Suspense fallback={<Skeleton width={24} height={24} />}>
                <NFTDropdown
                  btnProps={{
                    tw: "dark:bg-gray-900 bg-white mr-4 px-3",
                    variant: "tertiary",
                    size: "regular",
                  }}
                  nft={nft}
                />
              </Suspense>
            </View>
          </View>

          <Media
            item={nft}
            numColumns={1}
            sizeStyle={{
              height: mediaHeight,
              width: Math.min(mediaWidth, 800),
            }}
            resizeMode="contain"
          />
          {nft?.mime_type?.includes("video") ? (
            <View tw="absolute bottom-10 right-10">
              <MuteButton />
            </View>
          ) : null}
        </View>
        <View
          tw="dark:shadow-dark shadow-light bg-white dark:bg-black"
          style={{
            width: NFT_DETAIL_WIDTH,
          }}
        >
          <View tw="px-4 pt-4">
            <Social nft={nft} />
          </View>
          <LikedBy nft={nft} />
          <View tw="my-4 mr-4 flex-row justify-between px-4">
            <Text tw="font-space-bold text-lg text-black dark:text-white md:text-2xl">
              {nft.token_name}
            </Text>
          </View>
          <Description
            descriptionText={nft?.token_description}
            style={{ paddingHorizontal: 16, paddingBottom: 16 }}
          />
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
          <TabBarSingle
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
