import { memo, useState, useMemo } from "react";
import {
  StatusBar,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { Media } from "app/components/media";
import { MuteButton } from "app/components/mute-button/mute-button";
import { LikeContextProvider } from "app/context/like-context";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { BlurView } from "app/lib/blurview";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import type { NFT } from "app/types";

import { NFTDetails } from "./details";
import { FeedItemMD } from "./feed-item.md";

export type FeedItemProps = {
  nft: NFT;
  detailStyle?: StyleProp<ViewStyle>;
  bottomPadding?: number;
  bottomMargin?: number;
  itemHeight: number;
  setMomentumScrollCallback?: (callback: any) => void;
};
const StatusBarHeight = StatusBar.currentHeight ?? 0;

export const FeedItem = memo<FeedItemProps>(function FeedItem({
  nft,
  bottomPadding = 0,
  itemHeight,
}) {
  const headerHeight = useHeaderHeight();
  const [detailHeight, setDetailHeight] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const bottomHeight = usePlatformBottomHeight();
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );

  const maxContentHeight = windowHeight - bottomHeight;

  const mediaHeight = useMemo(() => {
    const actualHeight =
      windowWidth /
      (isNaN(Number(nft.token_aspect_ratio))
        ? 1
        : Number(nft.token_aspect_ratio));

    if (actualHeight < windowHeight - bottomHeight - headerHeight) {
      return Math.min(actualHeight, maxContentHeight);
    }

    return windowHeight - bottomHeight;
  }, [
    bottomHeight,
    headerHeight,
    maxContentHeight,
    nft.token_aspect_ratio,
    windowHeight,
    windowWidth,
  ]);

  const paddingTop = useMemo(() => {
    const visibleContentHeight =
      windowHeight - headerHeight - detailHeight - StatusBarHeight;

    if (mediaHeight < visibleContentHeight) {
      return (visibleContentHeight - mediaHeight) / 2 + headerHeight;
    } else if (mediaHeight < maxContentHeight - headerHeight) {
      return headerHeight;
    } else {
      return 0;
    }
  }, [detailHeight, headerHeight, maxContentHeight, mediaHeight, windowHeight]);

  if (windowWidth >= 768) {
    return <FeedItemMD nft={nft} itemHeight={itemHeight} />;
  }

  return (
    <LikeContextProvider nft={nft} key={nft.nft_id}>
      <View tw="w-full" style={{ height: itemHeight, overflow: "hidden" }}>
        <View
          tw="duration-200"
          style={{
            paddingTop,
          }}
        >
          <Media
            item={nft}
            numColumns={1}
            sizeStyle={{
              height: mediaHeight,
              width: windowWidth,
            }}
            resizeMode="cover"
          />
        </View>
        <View
          tw="absolute bottom-0 w-full bg-white/60 backdrop-blur-md dark:bg-black/60"
          style={{
            paddingBottom: bottomPadding,
          }}
          onLayout={({
            nativeEvent: {
              layout: { height },
            },
          }) => {
            setDetailHeight(height);
          }}
        >
          <BlurView
            blurRadius={15}
            style={StyleSheet.absoluteFillObject}
            overlayColor="transparent"
          />
          {nft?.mime_type?.startsWith("video") ? (
            <View tw="z-9 absolute top-[-40px] right-4">
              <MuteButton />
            </View>
          ) : null}

          <NFTDetails edition={edition} nft={nft} />
        </View>
      </View>
    </LikeContextProvider>
  );
});
FeedItem.displayName = "FeedItem";
