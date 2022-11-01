import { memo, useMemo, Suspense, useRef, useState, useContext } from "react";
import React from "react";
import { useWindowDimensions } from "react-native";

import { useSwiper } from "swiper/react";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Close,
  Muted,
  Unmuted,
  Maximize,
  ChevronDown,
  ChevronUp,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Description } from "app/components/card/rows/description";
import { Creator } from "app/components/card/rows/elements/creator";
import { Owner } from "app/components/card/rows/owner";
import { Social } from "app/components/card/social";
import { ClaimButton } from "app/components/claim/claim-button";
import { ClaimedShareButton } from "app/components/claim/claimed-share-button";
import { Comments } from "app/components/comments";
import { ErrorBoundary } from "app/components/error-boundary";
import { ClaimedBy } from "app/components/feed-item/claimed-by";
import { LikedBy } from "app/components/liked-by";
import { Media } from "app/components/media";
import { NFTDropdown } from "app/components/nft-dropdown";
import { PlayOnSpotify } from "app/components/play-on-spotify";
import { UserList } from "app/components/user-list";
import { LikeContextProvider } from "app/context/like-context";
import { useComments } from "app/hooks/api/use-comments";
import {
  ContentLayoutOffset,
  useContentWidth,
} from "app/hooks/use-content-width";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useFullscreen } from "app/hooks/use-full-screen";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useMuted } from "app/providers/mute-provider";
import { NFT } from "app/types";

import { SwiperActiveIndexContext } from "../swipe-list.web";
import { FeedItemProps } from "./index";

const NFT_DETAIL_WIDTH = 380;

const Collectors = ({ nft }: { nft: NFT }) => {
  return (
    <UserList
      loading={false}
      users={nft?.multiple_owners_list || []}
      onClose={() => false}
    />
  );
};

const TAB_SCENES_MAP = new Map([
  [0, Comments],
  [1, Collectors],
]);

export const FeedItemMD = memo<FeedItemProps>(function FeedItemMD({
  nft,
  itemHeight,
}) {
  const router = useRouter();
  const isDark = useIsDarkMode();
  const { data: detailData } = useNFTDetailByTokenId({
    contractAddress: nft?.contract_address,
    tokenId: nft?.token_id,
    chainName: nft?.chain_name,
  });

  const [muted, setMuted] = useMuted();
  const swiper = useSwiper();
  const activeIndex = useContext(SwiperActiveIndexContext);
  const { commentsCount } = useComments(nft.nft_id);
  const headerHeight = useHeaderHeight();
  const [showFullScreen, setShowFullScreen] = useState(false);

  const disablePrevButton = activeIndex === 0;
  const disableNextButton = swiper
    ? activeIndex === swiper.snapGrid.length - 1
    : false;
  const routes = useMemo(
    () => [
      {
        title: "Comments",
        key: "Comments",
        index: 0,
        subtitle: commentsCount,
      },
      {
        title: "Collectors",
        key: "Collectors",
        index: 1,
      },
    ],
    [commentsCount]
  );

  const [index, setIndex] = useState(0);

  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = useContentWidth(ContentLayoutOffset.HEADER);

  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );

  const container = useRef<HTMLElement | null>(null);
  useFullscreen(container, showFullScreen, {
    onClose: () => setShowFullScreen(false),
  });

  const isCreatorDrop = !!nft.creator_airdrop_edition_address;

  const feedItemStyle = {
    height: itemHeight,
    width: windowWidth,
  };

  const mediaHeight = Math.min(windowWidth, feedItemStyle.height) - 160 - 80;

  const mediaWidth = useMemo(() => {
    return contentWidth - NFT_DETAIL_WIDTH - 160;
  }, [contentWidth]);

  const onFullScreen = () => {
    setShowFullScreen(!showFullScreen);
  };
  const onClose = () => {
    if (showFullScreen) {
      setShowFullScreen(false);
    } else {
      if (history?.length > 1) {
        router.pop();
      } else {
        router.push("/");
      }
    }
  };
  const TabScene = useMemo(() => TAB_SCENES_MAP.get(index), [index]);

  return (
    <LikeContextProvider nft={nft} key={nft.nft_id}>
      <View
        tw="h-full w-full flex-row overflow-hidden"
        style={{
          height: itemHeight,
          paddingTop: headerHeight,
          width: contentWidth,
        }}
      >
        <View tw="bg-gray-100 dark:bg-black" ref={container}>
          <View tw="w-full flex-row items-center justify-between p-4">
            <Button
              variant="text"
              size="regular"
              onPress={onClose}
              iconOnly
              tw="bg-white px-3 dark:bg-gray-900"
            >
              <Close width={24} height={24} />
            </Button>
            <View tw="flex-row items-center">
              <Button
                variant="text"
                size="regular"
                onPress={onFullScreen}
                iconOnly
                tw="mr-4 bg-white px-3 dark:bg-gray-900"
              >
                <Maximize width={24} height={24} />
              </Button>
              <Suspense fallback={<Skeleton width={24} height={24} />}>
                <NFTDropdown
                  tw={[
                    "rounded-full bg-gray-100 bg-white p-3 dark:bg-gray-900",
                    showFullScreen ? "hidden" : "flex",
                  ]}
                  iconColor={isDark ? colors.white : colors.gray[900]}
                  nft={detailData?.data.item ?? nft}
                />
              </Suspense>
            </View>
          </View>
          <View tw="flex-1 items-center justify-center px-20 pb-20">
            <View
              style={{
                height: mediaHeight,
                width: mediaWidth,
              }}
            >
              <Media
                item={nft}
                numColumns={1}
                sizeStyle={{
                  height: mediaHeight,
                  width: mediaWidth,
                }}
                resizeMode="contain"
              />
            </View>
          </View>
          {/* Control Swiper */}
          {swiper && (
            <View
              tw={[
                "absolute right-4 top-1/2 -mt-8 -translate-y-1/2 transform",
                showFullScreen ? "hidden" : "flex",
              ]}
            >
              <View tw={disablePrevButton ? "cursor-not-allowed" : ""}>
                <Button
                  variant="text"
                  size="regular"
                  iconOnly
                  tw="disabled mb-4 bg-white px-3 dark:bg-gray-900"
                  disabled={disablePrevButton}
                  style={{ opacity: disablePrevButton ? 0.4 : 1 }}
                  onPress={() => {
                    swiper.slideTo(Math.max(activeIndex - 1, 0));
                  }}
                >
                  <ChevronUp width={24} height={24} />
                </Button>
              </View>
              <View tw={disableNextButton ? "cursor-not-allowed" : ""}>
                <Button
                  variant="text"
                  size="regular"
                  iconOnly
                  tw="bg-white px-3 dark:bg-gray-900"
                  disabled={disableNextButton}
                  style={{ opacity: disableNextButton ? 0.4 : 1 }}
                  onPress={() => {
                    swiper.slideTo(
                      Math.min(activeIndex + 1, swiper.snapGrid.length)
                    );
                  }}
                >
                  <ChevronDown width={24} height={24} />
                </Button>
              </View>
            </View>
          )}
          {nft?.mime_type?.includes("video") ? (
            <View tw="absolute bottom-4 right-4">
              <Button
                variant="text"
                size="regular"
                onPress={(e) => {
                  e.preventDefault();
                  setMuted(!muted);
                }}
                iconOnly
                tw="bg-white px-3 dark:bg-gray-900"
              >
                {muted ? (
                  <Muted width={24} height={24} />
                ) : (
                  <Unmuted width={24} height={24} />
                )}
              </Button>
            </View>
          ) : null}
          {edition?.spotify_track_url ? (
            <View tw="absolute bottom-10 left-4">
              <PlayOnSpotify url={edition?.spotify_track_url} />
            </View>
          ) : null}
        </View>

        <View
          tw="dark:shadow-dark shadow-light swiper-no-swiping bg-white dark:bg-black"
          style={{
            width: NFT_DETAIL_WIDTH,
          }}
        >
          <View tw="px-4">
            <View tw="pt-4">
              <Social nft={nft} />
            </View>
            <LikedBy nft={nft} tw="mt-4" />
            <View tw="my-4 mr-4 flex-row justify-between">
              <Text tw="font-space-bold text-lg text-black dark:text-white md:text-2xl">
                {nft.token_name}
              </Text>
            </View>
            <Description
              descriptionText={nft?.token_description}
              tw="max-h-[30vh] overflow-auto py-4"
            />

            <View tw="flex-row items-center justify-between">
              <Creator nft={nft} />
              <Owner nft={nft} price={false} />
            </View>

            <View tw="pb-4">
              <ClaimedBy
                claimersList={detailData?.data.item?.multiple_owners_list}
                nft={nft}
                tw="mt-2 mb-4"
              />
              {isCreatorDrop && edition ? (
                <View tw="flex-row">
                  <ClaimButton tw="flex-1" edition={edition} />
                  <ClaimedShareButton tw="ml-3 w-1/3" edition={edition} />
                </View>
              ) : null}
              {/* {!isCreatorDrop ? <BuyButton nft={nft} /> : null} */}
            </View>
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
              {TabScene && nft && <TabScene nft={nft} />}
            </Suspense>
          </ErrorBoundary>
          <View tw="h-2" />
        </View>
      </View>
    </LikeContextProvider>
  );
});
FeedItemMD.displayName = "FeedItemMD";
