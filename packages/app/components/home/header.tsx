import { memo, useContext, useCallback } from "react";
import { useWindowDimensions, Platform, Linking } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

import { useEffectOnce } from "@showtime-xyz/universal.hooks";
import { Close, ShowtimeRounded } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

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

const HIDDEN_HEIGHT = 0;
const VISIBLE_HEIGHT_DESKTOP = 44;
const VISIBLE_HEIGHT_NATIVE = 60;

const heightsNative = [HIDDEN_HEIGHT, VISIBLE_HEIGHT_NATIVE];

export const CreatorTokensBanner = ({
  height,
  style,
  tw,
}: {
  height?: number;
} & ViewProps) => {
  // const showValue = getIsShowCreatorTokenIntroBanner() ? 1 : 0;
  const showValue = 1;
  const showBanner = useSharedValue(showValue);
  const translateYValues = [HIDDEN_HEIGHT, showValue];

  const router = useRouter();
  const user = useContext(UserContext);
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const visibleHeight = height
    ? height
    : isMdWidth
    ? VISIBLE_HEIGHT_DESKTOP
    : VISIBLE_HEIGHT_NATIVE;
  const heightsWeb = [HIDDEN_HEIGHT, visibleHeight];
  const redirectToSelfServeExplainerModal = useCallback(() => {
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
  }, [router]);

  useEffectOnce(() => {
    if (
      user?.user?.data.profile.creator_token_onboarding_status === "allowlist"
    ) {
      redirectToSelfServeExplainerModal();
    }
  });

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
  const onPressBanner = useCallback(() => {
    if (
      user?.user?.data.profile.creator_token_onboarding_status === "allowlist"
    ) {
      redirectToSelfServeExplainerModal();
      return;
    }
    Linking.openURL(
      "https://www.notion.so/showtime-xyz/Showtime-xyz-Creator-Tokens-alpha-1-min-read-7f8b0c621e4442e98ec4c4189bec28df?pvs=4"
    );
  }, [
    redirectToSelfServeExplainerModal,
    user?.user?.data.profile.creator_token_onboarding_status,
  ]);
  if (
    user?.user?.data.profile.creator_token_onboarding_status === "onboarded"
  ) {
    return null;
  }
  return (
    <>
      <AnimatedView
        tw={[
          "absolute w-full flex-row items-center overflow-hidden px-4 py-2.5",
          tw as any,
        ]}
        style={[animatedStyle, style]}
      >
        <BgGoldLinearGradient />
        <View>
          <ShowtimeRounded color={colors.gray[900]} width={24} height={24} />
        </View>
        <View tw="ml-2 flex-1">
          <Text
            onPress={onPressBanner}
            tw="font-bold text-gray-900 underline"
            style={{ fontSize: 13, lineHeight: 16 }}
          >
            {user?.user?.data.profile.creator_token_onboarding_status ===
            "allowlist"
              ? "You are eligible to launch your Creator Token. Get closer to your collectors."
              : "Introducing Creator Tokens: a place for all your collectors."}
          </Text>
        </View>
        {/* <Pressable
          tw="ml-auto"
          onPress={() => {
            showBanner.value = 0;
            // setHideShowCreatorTokenBanner(true);
          }}
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        >
          <Close color={colors.gray[900]} width={24} height={24} />
        </Pressable> */}
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
  const isLgWidth = width >= breakpoints["xl"];

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
    </View>
  );
});
