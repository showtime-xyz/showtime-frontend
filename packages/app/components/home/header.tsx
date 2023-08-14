import { memo, useCallback, useMemo } from "react";
import {
  useWindowDimensions,
  Platform,
  ListRenderItemInfo,
  Linking,
} from "react-native";

import { BorderlessButton } from "react-native-gesture-handler";

import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
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
import { Carousel } from "app/lib/carousel";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { HomeSlider } from "./home-slider";
import { Banner, useBanners } from "./hooks/use-banners";

const PlatformPressable = Platform.OS === "web" ? Pressable : BorderlessButton;

// This is one of the fastest shuffling algorithms
// can be called with fisherYatesShuffle(array)
function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// Trending Slider as a Carousel
export const TrendingCarousel = memo(
  ({
    type = "default",
    title = "Trending",
  }: {
    type?: "onchainsummer" | "default";
    title?: string;
  }) => {
    const { width } = useWindowDimensions();
    const isMdWidth = width >= breakpoints["md"];

    const { data, isLoading } = useTrendingNFTS({
      pageSize: 8,
      filter: "music",
    });

    /*
    const data = useMemo(() => {
      if (type === "onchainsummer") {
        return fisherYatesShuffle(fetchedData ?? []);
      }

      return fetchedData ?? [];
    }, [type, fetchedData]);
    */

    const numColumns = isMdWidth ? 3.25 : 2.25;
    const router = useRouter();
    const isShowSeeAll = data.length > (isMdWidth ? 3 : 2);
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
          type={type}
        />
      ),
      [pagerWidth, numColumns, type]
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
                {title}
              </Text>
            ) : null}
            {(isShowSeeAll ||
              (__DEV__ && data.length > 0 && type === "default")) && (
              <PlatformPressable
                onPress={() => {
                  router.push("/trending");
                }}
                shouldActivateOnStart
                hitSlop={10}
              >
                <View
                  tw="-mt-1 p-1"
                  hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                >
                  <Text tw="text-sm font-semibold text-indigo-600">
                    see all
                  </Text>
                </View>
              </PlatformPressable>
            )}
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
  }
);

TrendingCarousel.displayName = "TrendingComponent";

// This is a temp copy for on-chain summer and can be removed after the campaign
export const ListHeaderComponent = memo(function ListHeaderComponent() {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  const { data: banners = [], isLoading: isLoadingBanner } = useBanners();
  const router = useRouter();
  const pagerWidth = isMdWidth
    ? Math.min(DESKTOP_CONTENT_WIDTH, width - DESKTOP_LEFT_MENU_WIDTH)
    : width - 32;

  const navigateToDetail = (banner: Banner) => {
    if (banner.type === "drop") {
      return router.push(`/@${banner.username}/${banner.slug}`);
    }
    if (banner.type === "link") {
      return Linking.openURL(banner.link);
    }
    if (banner.type === "profile") {
      if (__DEV__) {
        return Linking.openURL(`https://showtime.xyz/@${banner.username}`);
      }
      return router.push(`/@${banner.username}`);
    }
  };
  const bannerHeight = isMdWidth ? 164 : 104;

  return (
    <View tw="w-full">
      <View tw="mt-2 px-4 md:px-0">
        {isLoadingBanner ? (
          <Skeleton
            height={bannerHeight}
            width={pagerWidth}
            radius={16}
            tw="web:md:mt-4 web:mt-0"
          />
        ) : (
          banners?.length > 0 && (
            <Carousel
              loop
              width={pagerWidth}
              height={bannerHeight}
              autoPlayInterval={5000}
              data={banners}
              controller
              autoPlay
              tw="web:md:mt-4 web:mt-0 md:rounded-4xl w-full rounded-3xl"
              pagination={{ variant: "rectangle" }}
              renderItem={({ item, index }) => (
                <Pressable
                  key={index}
                  style={{
                    width: pagerWidth,
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 60,
                  }}
                  onPress={() => navigateToDetail(item)}
                >
                  <Image
                    source={{
                      uri: `${item.image}?optimizer=image&width=${
                        pagerWidth * 2
                      }`,
                    }}
                    recyclingKey={item.image}
                    blurhash={item?.blurhash}
                    resizeMode="cover"
                    alt={`${item?.username}-banner-${index}`}
                    transition={200}
                    {...(Platform.OS === "web"
                      ? { style: { height: "100%", width: "100%" } }
                      : { width: pagerWidth, height: bannerHeight })}
                  />
                </Pressable>
              )}
            />
          )
        )}
      </View>
      {/* After Onchain summer, just <TrendingCarousel />  */}
      <TrendingCarousel type="onchainsummer" title="Onchain 🟡 Summer" />
    </View>
  );
});
