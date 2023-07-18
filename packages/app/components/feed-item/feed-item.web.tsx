import { memo, useState, useMemo, useRef } from "react";
import { StyleProp, useWindowDimensions, ViewStyle } from "react-native";

import { Video as ExpoVideo } from "expo-av";
import { ResizeMode } from "expo-av";

import { View } from "@showtime-xyz/universal.view";

import { FeedItemTapGesture } from "app/components/feed/feed-item-tap-gesture";
import { Media } from "app/components/media";
import { MuteButton } from "app/components/mute-button/mute-button";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useUser } from "app/hooks/use-user";
import type { NFT } from "app/types";

import { NFTDropdown } from "../nft-dropdown";
import { NFTDetails } from "./details";
import { EngagementIcons } from "./engagement-icons";
import { FeedItemMD } from "./feed-item.md";
import { NSFWGate } from "./nsfw-gate";

export type FeedItemProps = {
  nft: NFT;
  detailStyle?: StyleProp<ViewStyle>;
  bottomPadding?: number;
  bottomMargin?: number;
  itemHeight: number;
  setMomentumScrollCallback?: (callback: any) => void;
};

export const FeedItem = memo<FeedItemProps>(function FeedItem({
  nft,
  itemHeight,
}) {
  const [detailHeight, setDetailHeight] = useState(0);
  const { isAuthenticated } = useUser();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const bottomHeight = usePlatformBottomHeight();
  const { data: detailData } = useNFTDetailByTokenId({
    contractAddress: nft?.contract_address,
    tokenId: nft?.token_id,
    chainName: nft?.chain_name,
  });
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );
  const videoRef = useRef<ExpoVideo | null>(null);

  const maxContentHeight = windowHeight - bottomHeight;

  const mediaHeight = useMemo(() => {
    const actualHeight =
      windowWidth /
      (isNaN(Number(nft.token_aspect_ratio))
        ? 1
        : Number(nft.token_aspect_ratio));

    if (actualHeight < windowHeight - bottomHeight) {
      return Math.min(actualHeight, maxContentHeight);
    }

    return windowHeight - bottomHeight;
  }, [
    bottomHeight,
    maxContentHeight,
    nft.token_aspect_ratio,
    windowHeight,
    windowWidth,
  ]);

  const paddingTop = useMemo(() => {
    const visibleContentHeight = windowHeight - detailHeight;

    if (mediaHeight < visibleContentHeight) {
      return (visibleContentHeight - mediaHeight) / 2;
    } else if (mediaHeight < maxContentHeight) {
      return 0;
    } else {
      return 0;
    }
  }, [detailHeight, maxContentHeight, mediaHeight, windowHeight]);

  if (windowWidth >= 768) {
    return <FeedItemMD nft={nft} itemHeight={itemHeight} />;
  }

  return (
    <View tw="bg-black">
      {nft?.mime_type?.startsWith("video") ? (
        <View tw="absolute left-1/2 top-2 z-50 -translate-x-1/2">
          <MuteButton variant="mobile-web" />
        </View>
      ) : null}
      <View
        tw="max-h-[100svh] min-h-[100dvh] w-full"
        style={{
          height: itemHeight,
          overflow: "hidden",
        }}
      >
        <View
          tw="animate-fade-in-500"
          style={{
            paddingTop,
          }}
        >
          <FeedItemTapGesture
            videoRef={videoRef}
            sizeStyle={{
              height: mediaHeight,
              width: windowWidth,
            }}
            isVideo={nft?.mime_type?.startsWith("video")}
          >
            <Media
              videoRef={videoRef}
              item={nft}
              numColumns={1}
              sizeStyle={{
                height: mediaHeight,
                width: windowWidth,
              }}
              resizeMode={ResizeMode.COVER}
            />
          </FeedItemTapGesture>
        </View>
        <View
          tw="z-1 pointer-events-none absolute bottom-0 w-full"
          style={{
            paddingBottom: bottomHeight,
          }}
          onLayout={({
            nativeEvent: {
              layout: { height },
            },
          }) => {
            setDetailHeight(height);
          }}
        >
          <NFTDetails
            edition={edition}
            nft={nft}
            detail={detailData?.data?.item}
          />
        </View>
        {isAuthenticated && (
          <View
            tw="swiper-no-swiping absolute right-4 z-50"
            style={{
              top: 8,
            }}
          >
            <NFTDropdown
              nft={detailData?.data?.item ?? nft}
              edition={edition}
              tw="rounded-full bg-black/60 px-1 py-1"
            />
          </View>
        )}
      </View>
      <NSFWGate nftId={nft.nft_id} show={nft.nsfw} />
    </View>
  );
});
FeedItem.displayName = "FeedItem";
