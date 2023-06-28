import { memo, useCallback, useEffect } from "react";
import {
  useWindowDimensions,
  Platform,
  ListRenderItemInfo,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useRouter } from "@showtime-xyz/universal.router";
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
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useScrollbarSize } from "app/hooks/use-scrollbar-size";
import { Carousel } from "app/lib/carousel";
import { getIsShowIntroBanner } from "app/lib/mmkv-keys";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { EmptyPlaceholder } from "../empty-placeholder";
import { HomeSlider } from "./home-slider";

export const ListHeaderComponent = memo(function ListHeaderComponent() {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { data, isLoading } = useTrendingNFTS({});
  const { width: scrollbarWidth } = useScrollbarSize();
  const router = useRouter();

  const isShowSeeAll = data.length > (isMdWidth ? 3 : 2);
  const pagerWidth = isMdWidth
    ? Math.min(DESKTOP_CONTENT_WIDTH, width - DESKTOP_LEFT_MENU_WIDTH)
    : width - 32 - scrollbarWidth;
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT>) => (
      <TrendingItem
        nft={item}
        index={index}
        width={Platform.select({ web: undefined, default: pagerWidth / 2 })}
      />
    ),
    [pagerWidth]
  );
  useEffect(() => {}, []);

  return (
    <View tw="w-full">
      <View tw="web:mt-12 web:md:mt-4 px-4 md:px-0">
        {getIsShowIntroBanner() && (
          <Carousel
            loop
            width={pagerWidth}
            height={isMdWidth ? 164 : 104}
            autoPlayInterval={3000}
            data={new Array(1).fill(0)}
            controller
            tw="mb-2 mt-2 w-full rounded-2xl md:mt-4"
            pagination={{ variant: "rectangle" }}
            renderItem={({ index }) => (
              <LinearGradient
                key={index}
                colors={["#98C4FF", "#5EFEFE", "#FFE8B6"]}
                start={{ x: -0.08, y: 0.36 }}
                end={{ x: 1.08, y: 0.63 }}
                style={{
                  width: pagerWidth,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 60,
                }}
              >
                <Text
                  style={{
                    fontSize: isMdWidth ? 40 : 23,
                    lineHeight: isMdWidth ? 48 : 28,
                  }}
                  tw="text-center font-semibold"
                >
                  Create. Collect. Connect.
                </Text>
              </LinearGradient>
            )}
          />
        )}
      </View>
      <View tw="w-full pl-4 md:pl-0">
        <View tw="w-full flex-row items-center justify-between py-4 pr-4">
          <Text tw="text-sm font-bold text-gray-900 dark:text-white">
            Trending
          </Text>
          {isShowSeeAll && (
            <Text
              tw="text-sm font-semibold text-indigo-600"
              onPress={() => {
                router.push("/trending");
              }}
            >
              see all
            </Text>
          )}
        </View>
        <View tw="w-full rounded-2xl">
          {isLoading ? (
            <View tw="flex-row overflow-hidden">
              <TrendingSkeletonItem presetWidth={172} />
              <TrendingSkeletonItem presetWidth={172} />
              <TrendingSkeletonItem presetWidth={172} />
              <TrendingSkeletonItem presetWidth={172} />
            </View>
          ) : data.length > 0 ? (
            <HomeSlider
              data={data}
              slidesPerView={isMdWidth ? 3.24 : 2.2}
              renderItem={renderItem}
            />
          ) : (
            <EmptyPlaceholder
              title={"No trending drops, yet."}
              tw="h-[275px]"
            />
          )}
        </View>
      </View>
    </View>
  );
});
