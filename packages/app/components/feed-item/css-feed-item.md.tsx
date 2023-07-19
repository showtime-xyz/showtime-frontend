import {
  memo,
  useMemo,
  Suspense,
  useRef,
  useCallback,
  useState,
  useContext,
} from "react";
import React from "react";
import { useWindowDimensions } from "react-native";

import { ResizeMode } from "expo-av";
import { Video as ExpoVideo } from "expo-av";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  ChevronLeft,
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
import { Media } from "app/components/media";
import { NFTDropdown } from "app/components/nft-dropdown";
import { UserList } from "app/components/user-list";
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

import { breakpoints } from "design-system/theme";

import { ContentTypeTooltip } from "../content-type-tooltip";
import { SwiperActiveIndexContext } from "../swipe-list.web";
import { NSFWGate } from "./nsfw-gate";
import { RaffleTooltip } from "./raffle-tooltip";
import { FeedItemProps } from "./type";

type TabProps = {
  nft: NFT;
  ListHeaderComponent?: React.ComponentType<any>;
};
const Collectors = ({ nft, ListHeaderComponent }: TabProps) => {
  return (
    <UserList
      // @ts-expect-error Component only loaded on web
      style={{ minHeight: "50vh" }}
      loading={false}
      users={nft?.multiple_owners_list || []}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};
const NFT_DETAIL_WIDTH = 380;
const TAB_SCENES_MAP = new Map([
  [0, Comments],
  [1, Collectors],
]);
export const CssFeedItemMD = memo<FeedItemProps>(function FeedItemMD({
  nft,
  listLength,
  slideToNext,
  slideToPrev,
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

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
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
    height: windowHeight,
    width: windowWidth,
  };
  // Media padding is the padding between the media and the content
  const mediaPadding =
    windowWidth > breakpoints["2xl"]
      ? 220
      : windowWidth > breakpoints["xl"]
      ? 180
      : 80;
  const maxMediaHeight = feedItemStyle.height - mediaPadding;
  const mediaHeight =
    windowWidth > breakpoints["lg"]
      ? maxMediaHeight
      : maxMediaHeight - 248 - mediaPadding;

  const mediaWidth = useMemo(() => {
    if (windowWidth < breakpoints["lg"]) {
      return contentWidth - mediaPadding;
    }
    return contentWidth - NFT_DETAIL_WIDTH - mediaPadding;
  }, [contentWidth, mediaPadding, windowWidth]);
  const activeIndex = useContext(SwiperActiveIndexContext);
  const disablePrevButton = activeIndex === 0;
  const disableNextButton = activeIndex === (listLength ? listLength - 1 : 0);
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
  const TabScene = TAB_SCENES_MAP.get(index);

  const ListHeaderComponent = useCallback(
    (props: { hideTabs?: boolean }) => {
      return (
        <>
          <View tw="px-4">
            <View tw="flex-row items-center justify-between pt-4">
              <Social nft={nft} />
              <RaffleTooltip edition={edition} tw="mr-1" />
            </View>

            <View tw="my-4 mr-4 flex-row items-center">
              <Text tw="text-lg font-bold text-black dark:text-white">
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
          {props.hideTabs ? null : (
            <TabBarSingle
              onPress={(i) => {
                setIndex(i);
              }}
              routes={routes as any}
              index={index}
            />
          )}
          <View tw="h-4" />
        </>
      );
    },
    [
      description,
      detailData?.data.item?.multiple_owners_list,
      edition,
      index,
      isCreatorDrop,
      nft,
      routes,
    ]
  );

  return (
    <View
      tw="h-[100svh] w-full overflow-hidden border-l border-gray-200 dark:border-gray-800 lg:flex-row"
      style={{
        paddingTop: headerHeight,
      }}
    >
      <View tw="flex-1" ref={container}>
        <View tw="w-full flex-row items-center justify-between p-4">
          <Button
            variant="text"
            size="regular"
            onPress={onClose}
            iconOnly
            tw="bg-white px-3 dark:bg-gray-900"
          >
            <ChevronLeft width={24} height={24} />
          </Button>
          <View tw="swiper-no-swiping flex-row items-center">
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
        <View tw="items-center justify-center px-4 lg:px-20 lg:pb-20">
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
                quality={80}
              />
            </FeedItemTapGesture>
            <NSFWGate nftId={nft.nft_id} show={nft.nsfw} />
          </View>
        </View>
        {/* Control Swiper */}
        {activeIndex !== null ? (
          <View
            tw={[
              "absolute right-2 top-1/2 -mt-8 -translate-y-1/2 transform 2xl:right-4",
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
                  slideToPrev?.();
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
                  slideToNext?.();
                }}
              >
                <ChevronDown width={24} height={24} />
              </Button>
            </View>
          </View>
        ) : null}

        <View tw="absolute bottom-10 left-4">
          <ContentTypeTooltip edition={edition} />
        </View>
      </View>
      <View tw="bg-white dark:bg-black lg:hidden">
        {ListHeaderComponent({ hideTabs: true })}
      </View>

      <View
        tw="swiper-no-swiping hidden bg-white dark:bg-gray-900 lg:flex"
        style={{
          width: NFT_DETAIL_WIDTH,
        }}
      >
        <ErrorBoundary>
          <Suspense
            fallback={
              <View tw="mt-10 items-center justify-center">
                <Spinner size="small" />
              </View>
            }
          >
            {TabScene && nft && (
              <TabScene
                nft={detailData?.data.item ?? nft}
                key={index}
                ListHeaderComponent={ListHeaderComponent}
                inputBackgroundColor={isDark ? colors.gray[900] : null}
              />
            )}
          </Suspense>
        </ErrorBoundary>
        <View tw="h-2" />
      </View>
    </View>
  );
});
CssFeedItemMD.displayName = "CssFeedItemMD";
