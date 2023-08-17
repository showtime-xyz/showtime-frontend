import { memo } from "react";
import { useWindowDimensions, Platform, Linking } from "react-native";

import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { View } from "@showtime-xyz/universal.view";

import {
  DESKTOP_CONTENT_WIDTH,
  DESKTOP_LEFT_MENU_WIDTH,
} from "app/constants/layout";
import { Carousel } from "app/lib/carousel";

import { breakpoints } from "design-system/theme";

import { Banner, useBanners } from "./hooks/use-banners";
import { OnChainSummerCarousel } from "./onchainsummer-carousel";
import { TrendingCarousel } from "./trending-carousel";

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
      <OnChainSummerCarousel />
    </View>
  );
});
