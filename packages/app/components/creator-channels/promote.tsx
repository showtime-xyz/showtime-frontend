import { useRef, useMemo, useCallback, useEffect, Suspense } from "react";
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
  TwitterOutline,
  Download,
  Link,
  CreatorChannelType,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
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
import { useUser } from "app/hooks/use-user";
import { createParam } from "app/navigation/use-param";
import { getTwitterIntent, getWebBaseURL } from "app/utilities";
import { getTwitterIntentUsername } from "app/utilities";

import { breakpoints } from "design-system/theme";
import { toast } from "design-system/toast";

import { useChannelById } from "./hooks/use-channel-detail";

type ChannelsPromoteParams = {
  channelId?: string | undefined;
};
const { useParam } = createParam<ChannelsPromoteParams>();

export const ChannelsPromote = () => {
  const [channelId] = useParam("channelId");
  const modalScreenContext = useModalScreenContext();
  const { data: channelDetails } = useChannelById(channelId);
  const { data: userProfiles } = useUserProfile({
    address:
      channelDetails?.owner?.username ||
      channelDetails?.owner?.name ||
      channelDetails?.owner?.wallet_address,
  });

  const user = useUser();
  const isUserAdmin =
    user.user?.data.channels &&
    user.user?.data.channels[0] === Number(channelId);
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
  const imageHeight =
    imageWidth * (475.5 / 390) - (Platform.OS === "web" ? 110 : 0);

  useEffect(() => {
    modalScreenContext?.setTitle("Congrats! Now share it ✦");
  }, [modalScreenContext]);

  const url = useMemo(
    () => `${getWebBaseURL()}/channels/${channelId}`,
    [channelId]
  );

  const twitterIntent = isUserAdmin
    ? "Just messaged my collector channel on @Showtime_xyz. Join to check it out:"
    : `Just joined ${getTwitterIntentUsername(
        userProfiles?.data?.profile
      )} channel on @Showtime_xyz. Check it out:`;

  const shareWithTwitterIntent = useCallback(() => {
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
        title: "Twitter",
        Icon: TwitterOutline,
        onPress: shareWithTwitterIntent,
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
        title: "Twitter",
        Icon: TwitterOutline,
        onPress: shareWithTwitterIntent,
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
            <BottomSheetScrollView>
              <View tw="web:mb-16 web:self-center select-none items-center justify-center pt-4">
                <View collapsable={false} ref={viewRef as any}>
                  <View
                    style={{
                      width: imageWidth,
                      height: imageHeight,
                    }}
                    tw="mb-4 items-center overflow-hidden rounded-3xl"
                  >
                    <View tw="absolute inset-0">
                      <Image
                        source={require("./channel-promo.png")}
                        width={imageWidth}
                        height={imageHeight}
                      />
                    </View>

                    <View tw="mt-6 items-center justify-center px-8">
                      <Text tw="text-3xl font-bold text-black">
                        Join Channel
                      </Text>
                      <View tw="mb-6 mt-10 h-36 w-36">
                        <Avatar
                          url={channelDetails?.owner?.img_url}
                          size={144}
                        />
                        <View tw="absolute -right-2 -top-2 self-center rounded-full bg-white p-3 dark:bg-black dark:shadow-white/20">
                          <CreatorChannelType
                            color={isDark ? colors.white : colors.gray[900]}
                            width={32}
                            height={32}
                          />
                        </View>
                      </View>
                      {Platform.OS === "web" ? (
                        <Text tw="text-center text-2xl font-bold text-black">
                          @
                          {channelDetails?.owner?.username ||
                            channelDetails?.owner?.name}
                        </Text>
                      ) : (
                        <Text
                          tw="text-center text-black"
                          style={{ fontSize: 23 }}
                        >
                          Go to{" "}
                          <Text style={{ fontSize: 23, fontWeight: "600" }}>
                            showtime.xyz
                          </Text>{" "}
                          & search "@
                          <Text style={{ fontSize: 23, fontWeight: "600" }}>
                            {channelDetails?.owner?.username ||
                              channelDetails?.owner?.name}
                          </Text>
                          " to get exclusive updates, presale access, raffles &
                          more.
                        </Text>
                      )}
                    </View>
                    <View tw="absolute bottom-6">
                      <Image
                        source={require("./download-app.png")}
                        width={244}
                        height={38}
                      />
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
