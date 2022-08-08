import { Suspense, useMemo } from "react";
import { Dimensions, Platform, useWindowDimensions } from "react-native";

import { useSharedValue } from "react-native-reanimated";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "@showtime-xyz/universal.safe-area";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { FeedItem } from "app/components/feed-item";
import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/components/viewability-tracker-flatlist";
import { MOBILE_WEB_BOTTOM_NAV_HEIGHT } from "app/constants/layout";
import { useNFTListings } from "app/hooks/api/use-nft-listings";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useUser } from "app/hooks/use-user";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { createParam } from "app/navigation/use-param";
import type { NFT } from "app/types";

import { VideoConfigContext } from "../context/video-config-context";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();
const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");
const BOTTOM_GAP = 128;

function NftScreen() {
  useTrackPageViewed({ name: "NFT" });
  const { colorScheme } = useColorScheme();
  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  const dummyId = 1;
  const visibileItems = useSharedValue([undefined, dummyId, undefined]);
  return (
    <ErrorBoundary>
      <VideoConfigContext.Provider value={videoConfig}>
        <ItemKeyContext.Provider value={dummyId}>
          <ViewabilityItemsContext.Provider value={visibileItems}>
            <Suspense
              fallback={
                <View tw="items-center">
                  <Skeleton
                    //@ts-ignore
                    colorMode={colorScheme}
                    height={screenHeight - 300}
                    width={screenWidth}
                  />
                  <View tw="h-2" />
                  <Skeleton
                    //@ts-ignore
                    colorMode={colorScheme}
                    height={300}
                    width={screenWidth}
                  />
                </View>
              }
            >
              <NFTDetail />
            </Suspense>
          </ViewabilityItemsContext.Provider>
        </ItemKeyContext.Provider>
      </VideoConfigContext.Provider>
    </ErrorBoundary>
  );
}

const NFTDetail = () => {
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });
  const { data: listing } = useNFTListings(data?.data.item.nft_id);
  const headerHeight = useHeaderHeight();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { height: safeAreaFrameHeight } = useSafeAreaFrame();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { isAuthenticated } = useUser();

  const nftWithListing = useMemo(() => {
    return {
      ...data?.data.item,
      listing: listing?.card_summary?.[0]?.listing,
    };
  }, [data, listing]);

  const itemHeight =
    Platform.OS === "web"
      ? windowHeight -
        headerHeight -
        (isAuthenticated ? MOBILE_WEB_BOTTOM_NAV_HEIGHT : 0)
      : Platform.OS === "android"
      ? safeAreaFrameHeight - headerHeight
      : screenHeight;
  const nft = data?.data?.item;

  if (nft) {
    return (
      <FeedItem
        itemHeight={itemHeight}
        bottomPadding={safeAreaBottom}
        nft={nftWithListing as NFT}
      />
    );
  }

  return null;
};

export { NftScreen };
