import { memo, useContext } from "react";
import { useWindowDimensions, Platform, Linking } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

import { Close, Showtime } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import {
  DESKTOP_CONTENT_WIDTH,
  DESKTOP_LEFT_MENU_WIDTH,
} from "app/constants/layout";
import { UserContext } from "app/context/user-context";
import { Carousel } from "app/lib/carousel";

import { breakpoints } from "design-system/theme";

import { BgGoldLinearGradient } from "../gold-gradient";
import { Banner, useBanners } from "./hooks/use-banners";
import { TopPartCreatorTokens } from "./top-part-creator-tokens";
import { TrendingCarousel } from "./trending-carousel";

const AnimatedView = Animated.createAnimatedComponent(View);

const SHOW_VALUE = 1;
const HIDDEN_HEIGHT = 0;
const VISIBLE_HEIGHT_WEB = 44;
const VISIBLE_HEIGHT_NATIVE = 60;

const translateYValues = [HIDDEN_HEIGHT, SHOW_VALUE];
const heightsWeb = [HIDDEN_HEIGHT, VISIBLE_HEIGHT_WEB];
const heightsNative = [HIDDEN_HEIGHT, VISIBLE_HEIGHT_NATIVE];
const visibleHeight =
  Platform.OS === "web" ? VISIBLE_HEIGHT_WEB : VISIBLE_HEIGHT_NATIVE;

const CreatorTokensBanner = () => {
  const showBanner = useSharedValue(SHOW_VALUE);
  const router = useRouter();
  const user = useContext(UserContext);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showBanner.value),
      transform: [
        {
          translateY: withTiming(
            interpolate(showBanner.value, translateYValues, [-100, 0])
          ),
        },
      ],
    };
  }, [showBanner]);

  const heightFakeViewStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(
        interpolate(
          showBanner.value,
          translateYValues,
          Platform.OS === "web" ? heightsWeb : heightsNative
        )
      ),
    };
  }, [showBanner]);

  if (
    user?.user?.data.profile.creator_token_onboarding_status === "onboarded"
  ) {
    return null;
  }

  return (
    <>
      <AnimatedView
        tw="absolute mb-4 w-full flex-row items-center overflow-hidden px-4 py-2.5"
        style={animatedStyle}
      >
        <BgGoldLinearGradient />
        <View tw="rounded-full border border-gray-900 p-1">
          <Showtime color={colors.gray[900]} width={12} height={12} />
        </View>
        <View
          tw="ml-2"
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            paddingBottom: 4,
          }}
        >
          <Text
            onPress={() => {
              const as = `/creator-token/self-serve-explainer`;
              router.push(
                Platform.select({
                  native: as,
                  web: {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      creatorTokensSelfServeExplainerModal: true,
                    },
                  } as any,
                }),
                Platform.select({
                  native: as,
                  web: router.asPath,
                }),
                { shallow: true }
              );
            }}
            tw="text-13 pt-1 font-bold text-gray-900"
          >
            Be the first to create your Token
          </Text>
        </View>
        <Pressable
          tw="ml-auto"
          onPress={() => {
            showBanner.value = 0;
          }}
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        >
          <Close color={colors.gray[900]} width={24} height={24} />
        </Pressable>
      </AnimatedView>
      <AnimatedView
        pointerEvents={"none"}
        tw={`web:h-[${visibleHeight}px] pointer-events-none h-[${visibleHeight}px] overflow-hidden`}
        style={heightFakeViewStyle}
      />
    </>
  );
};

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
      <CreatorTokensBanner />
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
      <TopPartCreatorTokens />
      <TrendingCarousel />
    </View>
  );
});
