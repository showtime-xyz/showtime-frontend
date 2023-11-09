import { useRef, useMemo, useCallback, Suspense } from "react";
import {
  useWindowDimensions,
  Linking,
  Platform,
  View as RNView,
} from "react-native";

import * as Clipboard from "expo-clipboard";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  Instagram,
  Download,
  Link,
  ArrowTopRounded,
  GrowthArrow,
  UnLocked,
  CreatorChannelFilled,
  X,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { ErrorBoundary } from "app/components/error-boundary";
import { useIsInstalledApps, useShareImage } from "app/components/share";
import { useUserProfile } from "app/hooks/api-hooks";
import { useCreatorTokenPriceToBuyNext } from "app/hooks/creator-token/use-creator-token-price-to-buy-next";
import { createParam } from "app/navigation/use-param";
import {
  getCurrencyPrice,
  getTwitterIntent,
  getWebBaseURL,
} from "app/utilities";

import { breakpoints } from "design-system/theme";
import { toast } from "design-system/toast";

import { ShowtimeBrandLogo } from "../showtime-brand";

type ChannelsPromoteParams = {
  username?: string | undefined;
};
const { useParam } = createParam<ChannelsPromoteParams>();

export const CreatorTokenSocialShare = () => {
  const [username] = useParam("username");
  const { data: userProfiles } = useUserProfile({
    address: username,
  });
  const profile = useMemo(() => userProfiles?.data?.profile, [userProfiles]);
  const priceToBuyNext = useCreatorTokenPriceToBuyNext({
    address: profile?.creator_token?.address,
    tokenAmount: 1,
  });

  const viewRef = useRef<RNView | Node>(null);
  const isDark = useIsDarkMode();
  const { bottom } = useSafeAreaInsets();
  const { shareImageToIG, downloadToLocal, shareOpenMore } =
    useShareImage(viewRef);
  const { isInstalledApps } = useIsInstalledApps();

  const iconColor = isDark ? colors.white : colors.gray[900];
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const imageWidth = isMdWidth ? 390 : width - 32;
  const imageHeight = imageWidth * (435 / 319);

  const url = useMemo(
    () => `${getWebBaseURL()}/creator-token/${username}/buy`,
    [username]
  );
  const twitterIntent = ``;

  const shareWithXIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: url,
        message: twitterIntent,
      })
    );
  }, [twitterIntent, url]);

  const onCopyLink = useCallback(async () => {
    await Clipboard.setStringAsync(url);
    toast.success("Copied!");
  }, [url]);

  const shareButtons = Platform.select({
    web: [
      {
        title: "Share on X",
        Icon: X,
        onPress: shareWithXIntent,
        visable: true,
      },
      {
        title: "Copy Link",
        Icon: Link,
        onPress: onCopyLink,
        visable: true,
      },
    ],
    default: [
      {
        title: "X",
        Icon: X,
        onPress: shareWithXIntent,
        visable: isInstalledApps.twitter,
      },
      {
        title: "Instagram",
        Icon: Instagram,
        onPress: () => shareImageToIG(),
        visable: isInstalledApps.instagram,
      },
      {
        title: "Link",
        Icon: Link,
        onPress: onCopyLink,
        visable: true,
      },
      {
        title: "Save QR",
        Icon: Download,
        onPress: downloadToLocal,
        visable: true,
      },
      {
        title: "More",
        Icon: MoreHorizontal,
        onPress: shareOpenMore,
        visable: true,
      },
    ],
  });

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <View tw="p-4">
            <Spinner />
          </View>
        }
      >
        <View tw="w-full flex-1">
          <BottomSheetModalProvider>
            <BottomSheetScrollView useNativeModal={false}>
              <View tw="web:pb-16 web:self-center select-none items-center justify-center pt-4">
                <View collapsable={false} ref={viewRef as any}>
                  <View
                    style={{
                      width: imageWidth,
                      height: imageHeight - 20,
                    }}
                    tw="mb-4 items-center overflow-hidden rounded-t-3xl"
                  >
                    <View tw="absolute inset-0">
                      <Image
                        source={{
                          uri: "https://media.showtime.xyz/assets/creator-token-drop-share-bg.jpg",
                        }}
                        width={imageWidth}
                        height={imageHeight}
                      />
                    </View>

                    <View tw="mt-5 items-center">
                      <ShowtimeBrandLogo color={"#000"} size={16} />
                    </View>
                    <View tw="mt-16 w-full flex-1 px-10">
                      <View tw="flex-row items-center">
                        <Avatar url={profile?.img_url} size={70} />
                        <View tw="w-2.5" />
                        <Text tw="text-xl font-bold text-gray-900">
                          @{profile?.username}
                        </Text>
                      </View>
                      <View tw="mt-4 items-center rounded-2xl border border-gray-200 px-6 py-4">
                        <Text tw="mt-2 text-sm font-semibold text-gray-900">
                          CREATOR TOKEN
                        </Text>
                        <View tw="mt-4 flex-row items-center">
                          <Text tw="mt-2 text-4xl font-bold text-gray-900">
                            {getCurrencyPrice(
                              "USD",
                              priceToBuyNext.data?.displayPrice
                            )}
                          </Text>
                          <View
                            tw="absolute -right-6 rounded-full"
                            style={{ backgroundColor: "#008F77" }}
                          >
                            <ArrowTopRounded
                              color={"#08F6CC"}
                              width={16}
                              height={16}
                            />
                          </View>
                        </View>
                        <View tw="mt-4 w-full flex-row justify-between">
                          <View tw="h-6 w-24 flex-1 items-center justify-center rounded-full bg-[#00E9BF]">
                            <Text tw="text-sm font-semibold text-gray-900">
                              Buy
                            </Text>
                          </View>
                          <View tw="w-4" />
                          <View tw="h-6 w-24 flex-1 items-center justify-center rounded-full bg-[#FD749D]">
                            <Text tw="text-sm font-semibold text-gray-900">
                              Sell
                            </Text>
                          </View>
                        </View>
                        <View tw="web:items-start items-center">
                          <View tw="mt-4 flex-row items-center">
                            <UnLocked
                              color={colors.gray[900]}
                              width={16}
                              height={16}
                            />
                            <Text tw="ml-2 flex-1 text-sm font-medium text-gray-900">
                              Collect to unlock channel
                            </Text>
                          </View>
                          <View tw="mt-4 flex-row items-center">
                            <CreatorChannelFilled
                              color={colors.gray[900]}
                              width={16}
                              height={16}
                            />

                            <Text tw="ml-2 flex-1 text-sm font-medium text-gray-900">
                              Exclusive chat, audio, media
                            </Text>
                          </View>
                          <View tw="mt-4 flex-row items-center">
                            <GrowthArrow
                              color={colors.gray[900]}
                              width={16}
                              height={16}
                            />
                            <Text tw="ml-2 flex-1 text-sm font-medium text-gray-900">
                              Supporting early pays off
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheetModalProvider>
          <View
            tw="absolute bottom-0 w-full flex-row border-t border-gray-100 bg-white dark:border-gray-700 dark:bg-black"
            style={{ paddingBottom: Math.max(bottom, 8) }}
          >
            {shareButtons
              .filter((item) => item.visable)
              .map(({ onPress, Icon, title }) => (
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync();
                    onPress();
                  }}
                  tw="flex-1 flex-col items-center justify-center pt-4 md:flex-row"
                  key={title}
                >
                  <Icon height={24} width={24} color={iconColor} />
                  <View tw="h-2 md:w-2" />
                  <Text tw="text-xs font-semibold text-gray-900 dark:text-white md:text-sm">
                    {title}
                  </Text>
                </Pressable>
              ))}
          </View>
        </View>
      </Suspense>
    </ErrorBoundary>
  );
};
