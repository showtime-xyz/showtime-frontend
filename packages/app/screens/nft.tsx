import { Suspense, useMemo, useEffect, useRef } from "react";
import { Dimensions, Platform, useWindowDimensions } from "react-native";

import { useSharedValue } from "react-native-reanimated";
import { SWRConfig } from "swr";

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
import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import { VideoConfigContext } from "app/context/video-config-context";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { createParam } from "app/navigation/use-param";
import type { NFT } from "app/types";

import { EmptyPlaceholder } from "../components/empty-placeholder";
import { TextLink } from "../navigation/link";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
  tabType?: string;
  showClaim?: boolean;
};

const { useParam } = createParam<Query>();
const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

function NftScreen({ fallback = {} }: { fallback?: object }) {
  useTrackPageViewed({ name: "NFT" });
  const { colorScheme } = useColorScheme();
  const [showClaim] = useParam("showClaim", {
    initial: false,
    parse: (v) => Boolean(v),
  });
  const [contractAddress] = useParam("contractAddress");
  const initialRef = useRef(false);
  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  const redirectToClaimDrop = useRedirectToClaimDrop();

  const dummyId = 1;
  const visibileItems = useSharedValue([undefined, dummyId, undefined]);

  useEffect(() => {
    if (showClaim && contractAddress && !initialRef.current) {
      initialRef.current = true;
      redirectToClaimDrop(contractAddress);
    }
  }, [showClaim, redirectToClaimDrop, contractAddress]);

  return (
    <ErrorBoundary>
      <SWRConfig value={{ fallback }}>
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
      </SWRConfig>
    </ErrorBoundary>
  );
}

const NFTDetail = () => {
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const [tabType] = useParam("tabType");
  const { data, isLoading } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });
  const headerHeight = useHeaderHeight();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { height: safeAreaFrameHeight } = useSafeAreaFrame();
  const { height: windowHeight } = useWindowDimensions();

  const itemHeight = Platform.select({
    web: windowHeight,
    android: safeAreaFrameHeight - headerHeight,
    default: screenHeight,
  });

  const nft = data?.data?.item;

  if (!nft && !isLoading) {
    return (
      <EmptyPlaceholder
        title="No results found"
        text={
          <TextLink href={`/`} tw="text-indigo-500">
            Go Home
          </TextLink>
        }
        tw="min-h-screen"
        hideLoginBtn
      />
    );
  }

  if (nft) {
    return (
      <ProfileTabsNFTProvider tabType={tabType}>
        <FeedItem
          itemHeight={itemHeight}
          bottomPadding={safeAreaBottom}
          nft={nft as NFT}
        />
      </ProfileTabsNFTProvider>
    );
  }

  return null;
};

export { NftScreen };
