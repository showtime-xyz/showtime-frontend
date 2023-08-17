import { memo, useCallback } from "react";
import {
  useWindowDimensions,
  Platform,
  ListRenderItemInfo,
} from "react-native";

import useSWR from "swr";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import {
  TrendingItem,
  TrendingSkeletonItem,
} from "app/components/trending/trending-item";
import {
  DESKTOP_CONTENT_WIDTH,
  DESKTOP_LEFT_MENU_WIDTH,
} from "app/constants/layout";
import { fetcher } from "app/hooks/use-infinite-list-query";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { HomeSlider } from "./home-slider";

export const useOnchainSummerHardcodedNFTs = () => {
  return useSWR<NFT[]>(`/v3/trending/onchain-summer`, fetcher, {
    focusThrottleInterval: 30000,
  });
};

// Trending Slider as a Carousel
export const OnChainSummerCarousel = memo(() => {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  const { data = [], isLoading } = useOnchainSummerHardcodedNFTs();

  const numColumns = isMdWidth ? 3.25 : 2.25;

  const pagerWidth = isMdWidth
    ? Math.min(DESKTOP_CONTENT_WIDTH, width - DESKTOP_LEFT_MENU_WIDTH)
    : width - 32;
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT>) => (
      <TrendingItem
        nft={item}
        index={index}
        width={Platform.select({ web: undefined, default: pagerWidth / 2 })}
        tw={index === 0 && Platform.OS !== "web" ? "ml-4 md:ml-0" : ""}
        numColumns={numColumns}
        filter="music"
        type="onchainsummer"
      />
    ),
    [pagerWidth, numColumns]
  );

  return (
    <View tw="w-full">
      <View tw="mb-2 w-full md:pl-0">
        <View
          tw={[
            "mt-2 w-full flex-row items-center justify-between px-4  md:px-0",
            data.length > 0 || isLoading ? "py-4" : "py-0",
          ]}
        >
          {data.length > 0 || isLoading ? (
            <Text tw="text-sm font-bold text-gray-900 dark:text-white">
              Onchain 🟡 Summer
            </Text>
          ) : null}
        </View>
        <View tw="w-full rounded-2xl">
          {isLoading ? (
            <View tw="flex-row overflow-hidden">
              <TrendingSkeletonItem
                numColumns={numColumns}
                tw="ml-4 mr-5 md:ml-0"
              />
              <TrendingSkeletonItem numColumns={numColumns} tw="mr-5" />
              <TrendingSkeletonItem numColumns={numColumns} tw="mr-5" />
              <TrendingSkeletonItem numColumns={numColumns} tw="mr-5" />
            </View>
          ) : data.length > 0 ? (
            <HomeSlider
              data={data}
              slidesPerView={numColumns}
              renderItem={renderItem}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
});

OnChainSummerCarousel.displayName = "OnChainSummerCarousel";
