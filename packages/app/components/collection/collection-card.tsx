import { memo, useMemo, Suspense } from "react";
import { Platform, Pressable, useWindowDimensions } from "react-native";

import { BlurView } from "expo-blur";
import Reanimated from "react-native-reanimated";

import { FeedItemTapGesture } from "app/components/feed/feed-item-tap-gesture";
import { NFTDropdown } from "app/components/nft-dropdown";
import { MAX_HEADER_WIDTH } from "app/constants/layout";
import { useShareNFT } from "app/hooks/use-share-nft";
import { Blurhash } from "app/lib/blurhash";
import type { NFT } from "app/types";

import { Button } from "design-system";
import { Description } from "design-system/card/rows/description";
import { Creator } from "design-system/card/rows/elements/creator";
import { Owner } from "design-system/card/rows/owner";
import { Title } from "design-system/card/rows/title";
import { Social } from "design-system/card/social";
import { Divider } from "design-system/divider";
import { useIsDarkMode } from "design-system/hooks";
import { Share } from "design-system/icon";
import { Image } from "design-system/image";
import { LikedBy } from "design-system/liked-by";
import { Media } from "design-system/media";
import { Preview } from "design-system/preview";
import { Skeleton } from "design-system/skeleton";
import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";
import { View } from "design-system/view";

import { useRouter } from "../../navigation/use-router";

const NFT_DETAIL_WIDTH = 380;

export const CollectionCard = ({
  nft,
  bottomPadding = 0,
  itemHeight,
  hideHeader,
  showHeader,
  toggleHeader,
  detailStyle,
}: {
  nft: NFT;
  detailStyle: any;
  showHeader: any;
  hideHeader: any;
  toggleHeader: any;
  bottomPadding: number;
  itemHeight: number;
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const router = useRouter();
  const feedItemStyle = {
    height: itemHeight,
    width: windowWidth,
  };

  let mediaHeight =
    windowWidth /
    (isNaN(Number(nft.token_aspect_ratio))
      ? 1
      : Number(nft.token_aspect_ratio));

  const mediaContainerHeight = Math.min(mediaHeight, feedItemStyle.height);

  mediaHeight = Math.min(mediaHeight, mediaContainerHeight);

  const isDark = useIsDarkMode();
  const tint = isDark ? "dark" : "light";

  const mediaWidth = useMemo(() => {
    if (windowWidth >= MAX_HEADER_WIDTH) {
      return MAX_HEADER_WIDTH - NFT_DETAIL_WIDTH;
    }

    return windowWidth - NFT_DETAIL_WIDTH;
  }, [windowWidth]);

  if (windowWidth >= 768) {
    return (
      <View tw="h-full w-full flex-row">
        <View
          style={[
            tw.style(
              "flex-1 items-center justify-center bg-gray-100 dark:bg-black"
            ),
          ]}
        >
          <Image
            source={{ uri: nft.source_url }}
            style={{ height: 500, width: 500 }}
            resizeMode="contain"
          />
        </View>
        <View
          style={[
            tw.style(
              "bg-white dark:bg-black shadow-lg shadow-black/5 dark:shadow-white/50"
            ),
            {
              width: NFT_DETAIL_WIDTH,
            },
          ]}
        >
          <Divider tw="my-2" />
          <View tw="mr-4 flex-row justify-between">
            <Title nft={nft} />
            <Suspense fallback={<Skeleton width={24} height={24} />}>
              <NFTDropdown nftId={nft.nft_id} />
            </Suspense>
          </View>
          <Description nft={nft} />
          <View tw="px-4">
            <Creator nft={nft} />
          </View>
          {Platform.OS === "web" ? (
            <View tw="px-4 py-4">
              <Button
                onPress={() => {
                  router.push("/claim/" + nft.contract_address);
                }}
              >
                Claim for free
              </Button>
            </View>
          ) : null}
          <Owner nft={nft} price={Platform.OS !== "ios"} />
          {/* Comments */}
        </View>
      </View>
    );
  }

  return (
    <View tw="w-full flex-1">
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
              tw="h-full w-full"
              source={{
                uri: nft.source_url,
              }}
            />
          )}
        </View>
      )}

      <FeedItemTapGesture toggleHeader={toggleHeader} showHeader={showHeader}>
        <View
          tw={`absolute h-[${
            itemHeight - bottomPadding - 50
          }px] justify-center`}
        >
          <Media
            item={nft}
            numColumns={1}
            tw={
              Platform.OS === "web"
                ? ""
                : `h-[${mediaHeight}px] w-[${windowWidth}px]`
            }
            resizeMode="contain"
            onPinchStart={hideHeader}
            onPinchEnd={showHeader}
          />
        </View>
      </FeedItemTapGesture>

      <Reanimated.View
        style={[tw.style("z-1 absolute bottom-0 right-0 left-0"), detailStyle]}
      >
        <BlurView
          tint={tint}
          intensity={100}
          style={tw.style(
            "bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-20"
          )}
        >
          <NFTDetails nft={nft} />
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
  );
};

const NFTDetails = ({ nft }: { nft: NFT }) => {
  const shareNFT = useShareNFT();

  return (
    <View>
      <View tw="h-4" />

      <View tw="px-4">
        <Creator nft={nft} shouldShowCreatorIndicator={false} />
      </View>

      <View tw="h-4" />

      <View tw="px-4">
        <Text
          tw="font-space-bold text-2xl dark:text-white"
          numberOfLines={3}
          style={{ fontSize: 17, lineHeight: 22 }}
        >
          {nft.token_name}
        </Text>

        <View tw="h-4" />

        <View tw="flex-row justify-between">
          <View tw="flex-row">
            <Pressable onPress={() => shareNFT(nft)}>
              <Share
                height={22}
                width={22}
                // @ts-ignore
                color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
              />
            </Pressable>
            <View tw="w-8" />
            <Suspense fallback={<Skeleton width={24} height={24} />}>
              <NFTDropdown nftId={nft?.nft_id} />
            </Suspense>
          </View>
        </View>
      </View>

      <View tw="h-4" />
    </View>
  );
};
