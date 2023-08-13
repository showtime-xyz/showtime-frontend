import { Suspense, useMemo, useEffect, useRef } from "react";
import { Dimensions, Platform, useWindowDimensions } from "react-native";

import { useSharedValue } from "react-native-reanimated";
import { SWRConfig } from "swr";

import { useRouter } from "@showtime-xyz/universal.router";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "@showtime-xyz/universal.safe-area";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { FeedItem } from "app/components/feed-item";
import { SwipeListHeader } from "app/components/header/swipe-list-header";
import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/components/viewability-tracker-flatlist";
import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import { VideoConfigContext } from "app/context/video-config-context";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useNFTDetailBySlug } from "app/hooks/use-nft-details-by-slug";
import { useRedirectToChannelIntro } from "app/hooks/use-redirect-to-channel-intro";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { useTrackPageViewed } from "app/lib/analytics";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { createParam } from "app/navigation/use-param";
import type { NFT } from "app/types";

import { EmptyPlaceholder } from "../components/empty-placeholder";
import { TextLink } from "../navigation/link";
import { SwipeListScreen } from "./swipe-list";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
  tabType?: string;
  showClaim?: boolean;
  username?: string;
  dropSlug?: string;
  initialScrollItemId?: string;
  showCreatorChannelIntro?: boolean;
};

const { useParam } = createParam<Query>();
const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export function NftScreen({ fallback = {} }: { fallback?: object }) {
  const [initialScrollItemId] = useParam("initialScrollItemId");
  if (typeof initialScrollItemId !== "undefined") {
    return <SwipeListScreen />;
  }

  return <NFTDetailScreenImpl fallback={fallback} />;
}

const NFTDetail = () => {
  const router = useRouter();
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const [tabType] = useParam("tabType");
  const [username] = useParam("username");
  const [dropSlug] = useParam("dropSlug");
  const { data, isLoading } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });
  const {
    data: dropDataBySlug,
    isLoading: dropDataBySlugLoading,
    error: nftError,
  } = useNFTDetailBySlug({
    username,
    dropSlug,
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

  const nft = dropDataBySlug ?? data?.data?.item;
  const loading = dropDataBySlugLoading || isLoading;

  if (!nft && !loading) {
    return (
      <EmptyPlaceholder
        text={
          <View tw="flex-1 items-center justify-center">
            <View tw="mb-6">
              <Text tw="text-center text-2xl text-gray-600 dark:text-white">
                {nftError?.response?.status === 404
                  ? "Drop not found"
                  : "No drops, yet!"}
              </Text>
            </View>
            <View tw="flex-row items-center justify-center gap-4">
              <View tw="md:hidden">
                <Text
                  onPress={() => router.pop()}
                  tw="text-center text-xl font-semibold text-indigo-400 "
                >
                  Go back
                </Text>
              </View>
              <View>
                <TextLink
                  href={`/`}
                  tw="text-center text-xl font-semibold text-indigo-400"
                >
                  Go Home
                </TextLink>
              </View>
            </View>
          </View>
        }
        tw="min-h-screen"
        hideLoginBtn
      />
    );
  }

  if (nft) {
    return (
      <ProfileTabsNFTProvider tabType={tabType}>
        {Platform.OS !== "web" && <SwipeListHeader canGoBack withBackground />}
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

const NFTDetailScreenImpl = ({ fallback = {} }: { fallback?: object }) => {
  useTrackPageViewed({ name: "NFT" });
  const [showClaim] = useParam("showClaim", {
    initial: false,
    parse: (v) => Boolean(v),
  });
  const [showCreatorChannelIntro] = useParam("showCreatorChannelIntro", {
    initial: false,
    parse: (v) => Boolean(v),
  });
  const [contractAddress] = useParam("contractAddress");
  const initialRef = useRef(false);
  const initialRedirectToIntro = useRef(false);

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
  const redirectToCreatorChannelIntro = useRedirectToChannelIntro();

  useEffect(() => {
    if (showClaim && contractAddress && !initialRef.current) {
      initialRef.current = true;
      redirectToClaimDrop(contractAddress);
    }
  }, [showClaim, redirectToClaimDrop, contractAddress]);

  useEffect(() => {
    if (!initialRedirectToIntro.current && showCreatorChannelIntro) {
      setTimeout(() => {
        initialRedirectToIntro.current = true;
        redirectToCreatorChannelIntro();
      }, 1000);
    }
  }, [redirectToCreatorChannelIntro, showCreatorChannelIntro]);

  return (
    <ErrorBoundary>
      <SWRConfig value={{ fallback }}>
        <VideoConfigContext.Provider value={videoConfig}>
          <ItemKeyContext.Provider value={dummyId}>
            <ViewabilityItemsContext.Provider value={visibileItems}>
              <Suspense
                fallback={
                  <View tw="items-center">
                    <Skeleton height={screenHeight - 300} width={screenWidth} />
                    <View tw="h-2" />
                    <Skeleton height={300} width={screenWidth} />
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
};
