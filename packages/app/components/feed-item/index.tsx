import { memo, useState } from "react";
import {
  Platform,
  StyleProp,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import { BlurView } from "expo-blur";
import Reanimated from "react-native-reanimated";

import {
  useBlurredBackgroundStyles,
  useIsDarkMode,
} from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { tw } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { FeedItemTapGesture } from "app/components/feed/feed-item-tap-gesture";
import { Media } from "app/components/media";
import { LikeContextProvider } from "app/context/like-context";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { Blurhash } from "app/lib/blurhash";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

import { NFTDetails } from "./details";
import { FeedItemMD } from "./feed-item.md";

export type FeedItemProps = {
  nft: NFT;
  detailStyle?: StyleProp<ViewStyle>;
  showHeader?: () => void;
  hideHeader?: () => void;
  toggleHeader?: () => void;
  bottomPadding?: number;
  bottomMargin?: number;
  itemHeight: number;
};

export const FeedItem = memo<FeedItemProps>(function FeedItem({
  nft,
  bottomPadding = 0,
  bottomMargin = 0,
  itemHeight,
  hideHeader,
  showHeader,
  toggleHeader,
  detailStyle,
  listId,
}) {
  const [detailHeight, setDetailHeight] = useState(0);
  const { width: windowWidth } = useWindowDimensions();

  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );
  const blurredBackgroundStyles = useBlurredBackgroundStyles(95);

  let mediaHeight =
    windowWidth /
    (isNaN(Number(nft.token_aspect_ratio))
      ? 1
      : Number(nft.token_aspect_ratio));

  mediaHeight = Math.min(mediaHeight, itemHeight - detailHeight);

  const isDark = useIsDarkMode();
  const tint = isDark ? "dark" : "light";

  if (windowWidth >= 768) {
    return <FeedItemMD nft={nft} itemHeight={itemHeight} />;
  }

  return (
    <LikeContextProvider nft={nft} key={nft.nft_id}>
      <View tw="w-full" style={{ height: itemHeight }}>
        {Platform.OS !== "web" && (
          <View>
            {nft.blurhash ? (
              <Blurhash
                blurhash={nft.blurhash}
                decodeWidth={16}
                decodeHeight={16}
                decodeAsync={true}
                style={tw.style("w-full h-full")}
              />
            ) : (
              <Image
                tw="h-full w-full "
                source={{
                  uri: getMediaUrl({ nft, stillPreview: true }),
                }}
              >
                <BlurView
                  tint={tint}
                  intensity={100}
                  style={tw.style("h-full w-full")}
                />
              </Image>
            )}
          </View>
        )}

        <FeedItemTapGesture toggleHeader={toggleHeader} showHeader={showHeader}>
          <View
            tw={`absolute justify-center`}
            style={{
              height: Platform.select({
                web: itemHeight - bottomPadding - detailHeight,
                default: itemHeight - bottomPadding - 50,
              }),
            }}
          >
            <Media
              item={nft}
              numColumns={1}
              tw={`h-[${mediaHeight}px] w-[${windowWidth}px]`}
              resizeMode="contain"
              onPinchStart={hideHeader}
              onPinchEnd={showHeader}
            />
          </View>
        </FeedItemTapGesture>

        <Reanimated.View
          style={[
            tw.style("z-1 absolute right-0 left-0"),
            detailStyle,
            { bottom: bottomMargin },
          ]}
          onLayout={({
            nativeEvent: {
              layout: { height },
            },
          }) => {
            if (Platform.OS !== "web") return;
            setDetailHeight(height);
          }}
        >
          <BlurView
            tint={tint}
            intensity={100}
            style={{
              // @ts-ignore
              ...blurredBackgroundStyles,
              ...tw.style(
                "bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-20"
              ),
            }}
          >
            <NFTDetails edition={edition} nft={nft} listId={listId} />
            <View
              tw={`${
                bottomPadding && bottomPadding !== 0
                  ? `h-[${bottomPadding - 1}px]`
                  : "h-0"
              }`}
            />
          </BlurView>
        </Reanimated.View>
      </View>
    </LikeContextProvider>
  );
});
FeedItem.displayName = "FeedItem";
