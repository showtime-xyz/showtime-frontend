import { memo, useMemo, Suspense, useRef, useState, useContext } from "react";
import React from "react";
import { useWindowDimensions } from "react-native";

import { ResizeMode } from "expo-av";
import { Video as ExpoVideo } from "expo-av";
import { useSwiper } from "swiper/react";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Close,
  Muted,
  Maximize,
  ChevronDown,
  ChevronUp,
  Unmuted,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Creator } from "app/components/card/rows/elements/creator";
import { Owner } from "app/components/card/rows/owner";
import { Social } from "app/components/card/social";
import { ClaimButton } from "app/components/claim/claim-button";
import { ClaimedShareButton } from "app/components/claim/claimed-share-button";
import { Comments } from "app/components/comments";
import { ErrorBoundary } from "app/components/error-boundary";
import { ClaimedBy } from "app/components/feed-item/claimed-by";
import { FeedItemTapGesture } from "app/components/feed/feed-item-tap-gesture";
import { LikedBy } from "app/components/liked-by";
import { Media } from "app/components/media";
import { NFTDropdown } from "app/components/nft-dropdown";
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
import { linkifyDescription } from "app/lib/linkify";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useMuted } from "app/providers/mute-provider";
import { NFT } from "app/types";
import { cleanUserTextInput, limitLineBreaks, removeTags } from "app/utilities";

import { ContentTypeTooltip } from "../content-type-tooltip";
import { SwiperActiveIndexContext } from "../swipe-list.web";
import { FeedItemProps } from "./index";
import { NSFWGate } from "./nsfw-gate";
import { RaffleTooltip } from "./raffle-tooltip";

// NFT detail width is the width of the NFT detail on the right side of the feed item
const NFT_DETAIL_WIDTH = 380;
// Media padding is the padding between the media and the content
const MEDIA_PADDING = 160;
// Media header height is the height of the header of the media

const MEDIA_HEADER_HEIGHT = 80;
type TabProps = {
  nft: NFT;
};
const Collectors = ({ nft }: TabProps) => {
  return (
    <UserList
      style={{ minHeight: "50vh" }}
      loading={false}
      users={nft?.multiple_owners_list || []}
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
  const videoRef = useRef<ExpoVideo | null>(null);

  const [muted, setMuted] = useMuted();
  const swiper = useSwiper();
  const activeIndex = useContext(SwiperActiveIndexContext);
  const { commentsCount } = useComments(nft.nft_id);
  const headerHeight = useHeaderHeight();
  const [showFullScreen, setShowFullScreen] = useState(false);
  const description = useMemo(
    () =>
      nft?.token_description
        ? linkifyDescription(
            limitLineBreaks(
              cleanUserTextInput(removeTags(nft?.token_description))
            )
          )
        : "",
    [nft?.token_description]
  );

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

  const mediaHeight =
    Math.min(windowWidth, feedItemStyle.height) -
    MEDIA_PADDING -
    MEDIA_HEADER_HEIGHT;
  const maxContentWidth = contentWidth - NFT_DETAIL_WIDTH - MEDIA_PADDING;
  const mediaWidth = useMemo(() => {
    return Math.min(
      mediaHeight *
        (isNaN(Number(nft.token_aspect_ratio))
          ? 1
          : Number(nft.token_aspect_ratio)),
      maxContentWidth
    );
  }, [maxContentWidth, mediaHeight, nft.token_aspect_ratio]);

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
    <LikeContextProvider nft={nft}>
      <View
        tw="h-full w-full flex-row overflow-hidden"
        style={{
          height: itemHeight,
          paddingTop: headerHeight,
          width: contentWidth,
        }}
      >
        <View tw="flex-1 bg-gray-100 dark:bg-black" ref={container}>
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
              {nft?.mime_type?.includes("video") ? (
                <Button
                  variant="text"
                  size="regular"
                  onPress={(e) => {
                    e.preventDefault();
                    setMuted(!muted);
                  }}
                  iconOnly
                  tw="mr-4 bg-white px-3 dark:bg-gray-900"
                >
                  {muted ? (
                    <Muted width={24} height={24} />
                  ) : (
                    <Unmuted width={24} height={24} />
                  )}
                </Button>
              ) : null}
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
                    "rounded-full bg-white p-3 dark:bg-gray-900",
                    showFullScreen ? "hidden" : "flex",
                  ]}
                  iconColor={isDark ? colors.white : colors.gray[900]}
                  nft={detailData?.data.item ?? nft}
                  edition={edition}
                />
              </Suspense>
            </View>
          </View>
          <View tw="items-center justify-center px-20 pb-20">
            <View
              style={{
                height: mediaHeight,
                width: mediaWidth,
              }}
            >
              <FeedItemTapGesture
                videoRef={videoRef}
                isVideo={nft?.mime_type?.startsWith("video")}
              >
                <Media
                  videoRef={videoRef}
                  item={nft}
                  numColumns={1}
                  sizeStyle={{
                    height: mediaHeight,
                    width: mediaWidth,
                  }}
                  resizeMode={ResizeMode.CONTAIN}
                  optimizedWidth={1200}
                />
              </FeedItemTapGesture>
              <NSFWGate nftId={nft.nft_id} show={nft.nsfw} />
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

          <View tw="absolute bottom-10 left-4">
            <ContentTypeTooltip edition={edition} />
          </View>
        </View>

        <View
          tw="swiper-no-swiping bg-white dark:bg-gray-900"
          style={{
            width: NFT_DETAIL_WIDTH,
          }}
        >
          <View tw="px-4">
            <View tw="flex-row items-center justify-between pt-4">
              <Social nft={nft} />
              <RaffleTooltip edition={edition} tw="mr-1" />
            </View>
            <View tw="mt-4 min-h-[12px]">
              <LikedBy nft={nft} max={1} />
            </View>
            <View tw="my-4 mr-4 flex-row items-center">
              <Text tw="text-xl font-bold text-black dark:text-white">
                {nft.token_name}
              </Text>
            </View>
            <Text tw="text-sm text-gray-600 dark:text-gray-200">
              {description}
            </Text>

            <View tw="mt-6 flex-row items-center justify-between">
              <Creator nft={nft} />
              <Owner nft={nft} price={false} />
            </View>

            <View tw="mt mb-4 h-5">
              <ClaimedBy
                claimersList={detailData?.data.item?.multiple_owners_list}
                nft={nft}
              />
            </View>
            <View tw="h-8 flex-row">
              {isCreatorDrop && edition ? (
                <>
                  <ClaimButton tw="flex-1" edition={edition} />
                  <ClaimedShareButton
                    tw="ml-3 w-1/4"
                    edition={edition}
                    nft={nft}
                  />
                </>
              ) : null}
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
