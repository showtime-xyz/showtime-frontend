import { memo, useState, useMemo, useContext } from "react";
import {
  StatusBar,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Media } from "app/components/media";
import { MuteButton } from "app/components/mute-button/mute-button";
import { LikeContextProvider } from "app/context/like-context";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { BlurView } from "app/lib/blurview";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import type { NFT } from "app/types";
import { isMobileWeb, isAndroid } from "app/utilities";

import { SwiperActiveIndexContext } from "../swipe-list.web";
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
  itemHeight,
}) {
  const headerHeight = useHeaderHeight();
  const [detailHeight, setDetailHeight] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const bottomHeight = usePlatformBottomHeight();
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );
  const activeIndex = useContext(SwiperActiveIndexContext);

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
        {activeIndex === 0 && isMobileWeb() ? (
          <View
            tw="dark:shadow-dark shadow-light absolute top-0 right-0 left-0 z-10 bg-white dark:bg-black"
            style={{ paddingTop: headerHeight + StatusBarHeight }}
          >
            <View tw="flex flex-row items-center justify-between px-4 pb-4">
              <Text tw="font-space-bold text-lg dark:text-white">
                Get the app
              </Text>
              <Button
                onPress={() => {
                  window.open(
                    isAndroid()
                      ? "https://play.google.com/store/apps/details?id=io.showtime"
                      : "https://apps.apple.com/us/app/showtime-nft-social-network/id1606611688",
                    "_blank"
                  );
                }}
              >
                Download now
              </Button>
            </View>
          </View>
        ) : null}
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
