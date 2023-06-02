import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
  Suspense,
} from "react";
import {
  useWindowDimensions,
  Linking,
  Platform,
  View as RNView,
} from "react-native";

import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";

import { Alert } from "@showtime-xyz/universal.alert";
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
import { colors, styled } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { ErrorBoundary } from "app/components/error-boundary";
import { useUser } from "app/hooks/use-user";
import domtoimage from "app/lib/dom-to-image";
import { Logger } from "app/lib/logger";
import Share from "app/lib/react-native-share";
import { captureRef, CaptureOptions } from "app/lib/view-shot";
import { createParam } from "app/navigation/use-param";
import { getTwitterIntent, getWebBaseURL } from "app/utilities";

import { breakpoints } from "design-system/theme";
import { toast } from "design-system/toast";

import { useChannelById } from "./hooks/use-channel-detail";

const StyledLinearGradient = styled(LinearGradient);
const PlatformBlurView = Platform.OS === "web" ? View : styled(BlurView);
type ChannelsPromoteParams = {
  channelId?: string | undefined;
};
const { useParam } = createParam<ChannelsPromoteParams>();

export const ChannelsPromote = () => {
  const [channelId] = useParam("channelId");
  const modalScreenContext = useModalScreenContext();
  const { data: channelDetails } = useChannelById(channelId);
  const user = useUser();
  const isUserAdmin =
    user.user?.data.channels &&
    user.user?.data.channels[0] === Number(channelId);
  const viewRef = useRef<RNView | Node>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const isDark = useIsDarkMode();
  const { bottom } = useSafeAreaInsets();

  const iconColor = isDark ? colors.white : colors.gray[900];
  const [isInstalledApps, setIsInstalledApps] = useState({
    twitter: false,
    instagram: false,
  });
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const imageWidth = isMdWidth ? 390 : width;
  const imageHeight = imageWidth * (475.5 / 390);
  useEffect(() => {
    // Notes: According on App Store rules, must be hide the option if the device doesn't have the app installed.
    const checkInstalled = async () => {
      let isInstalled = {
        twitter: false,
        instagram: false,
      };

      if (Platform.OS === "ios") {
        isInstalled = {
          instagram: await Linking.canOpenURL("instagram://"),
          twitter: await Linking.canOpenURL("twitter://"),
        };
      } else if (Platform.OS === "android") {
        const { isInstalled: instagram } = await Share.isPackageInstalled(
          "com.instagram.android"
        );
        const { isInstalled: twitter } = await Share.isPackageInstalled(
          "com.twitter.android"
        );
        isInstalled = {
          instagram,
          twitter,
        };
      }
      setIsInstalledApps({
        ...isInstalled,
      });
    };
    checkInstalled();
  }, []);

  useEffect(() => {
    modalScreenContext?.setTitle("Congrats! Now share it ✦");
  }, [modalScreenContext]);

  const getViewShot = async (result?: CaptureOptions["result"]) => {
    const date = new Date();
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
        fileName: `QR Code - ${date.valueOf()}`,
        ...(result ? { result } : {}),
      });
      return uri;
    } catch (error) {
      Logger.log(`captureRefError: ${error}`);
    }
  };
  const url = useMemo(
    () => `${getWebBaseURL()}/channels/${channelId}`,
    [channelId]
  );
  const username =
    channelDetails?.owner?.username || channelDetails?.owner?.name;

  const twitterIntent = isUserAdmin
    ? "Just messaged my collector channel on @Showtime_xyz. Join to check it out:"
    : `Just join @${username} collector channel on @Showtime_xyz. Check it out:`;
  const checkPhotosPermission = useCallback(async () => {
    let hasPermission = false;
    if (status?.granted) {
      hasPermission = status?.granted;
    } else {
      const res = await requestPermission();
      hasPermission = res?.granted;
    }
    if (!hasPermission) {
      Alert.alert(
        "No permission",
        "To share the photo, you'll need to enable photo permissions first",
        [
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
    return hasPermission;
  }, [requestPermission, status?.granted]);

  const onDownload = useCallback(async () => {
    if (Platform.OS === "web") {
      const dataUrl = await domtoimage.toPng(viewRef.current as Node, {
        quality: 1,
      });
      const link = document.createElement("a");
      link.download = `${new Date().valueOf()}`;
      link.href = dataUrl;
      link.click();
    } else {
      const url = await getViewShot();
      if (!url) {
        Alert.alert("Oops, An error occurred.");
        return;
      }
      const hasPermission = await checkPhotosPermission();
      if (hasPermission) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await MediaLibrary.saveToLibraryAsync(url);
        toast.success("Saved to Photos");
      } else {
        Alert.alert("No write permission");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [checkPhotosPermission]);

  const prepareShareToIG = useCallback(
    async (url: string) => {
      const hasPermission = await checkPhotosPermission();
      if (hasPermission) {
        await MediaLibrary.saveToLibraryAsync(url);
      }
      return hasPermission;
    },
    [checkPhotosPermission]
  );

  const shareSingleImage = useCallback(
    async (
      social: typeof Share.Social.TWITTER | typeof Share.Social.INSTAGRAM
    ) => {
      const url = await getViewShot();

      if (!url) {
        Alert.alert("Oops, An error occurred.");
        return;
      }
      if (social === Share.Social.INSTAGRAM) {
        /**
         * IG is not support private path address, and if you pass a uri, IG will always read the last pic from you Photos!
         * so we need to hack it, flow here.
         * check permission -> save to Photo -> share to IG(IG will read the last pic from you Photo)
         */
        const isCanShareToIG = await prepareShareToIG(url);
        if (!isCanShareToIG) {
          return;
        }
      }
      try {
        const ShareResponse = await Share.shareSingle({
          title: ``,
          message: ``,
          url,
          social,
          filename: `${new Date().valueOf()}`,
        });
        Logger.log("shareSingleImage Result =>", ShareResponse);
      } catch (error) {
        Logger.error("shareSingleImage Error =>", error);
      }
    },
    [prepareShareToIG]
  );

  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: url,
        message: twitterIntent,
      })
    );
  }, [twitterIntent, url]);

  const shareOpenMore = useCallback(async () => {
    const url = await getViewShot();
    try {
      const ShareResponse = await Share.open({
        title: ``,
        message: ``,
        url,
      });
      Logger.log("shareOpenMore Result =>", ShareResponse);
    } catch (error) {
      Logger.error("shareOpenMore Error =>", error);
    }
  }, []);

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
      {
        title: "Download",
        Icon: Download,
        onPress: onDownload,
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
        onPress: () => shareSingleImage(Share.Social.INSTAGRAM),
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
        onPress: onDownload,
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
              <View tw="web:pb-10 web:pb-2 web:self-center select-none pt-4 md:pt-0">
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
            style={{ paddingBottom: bottom }}
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
