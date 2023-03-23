import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
  Suspense,
} from "react";
import {
  Dimensions,
  Linking,
  Platform,
  useWindowDimensions,
  View as RNView,
} from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";

import { Alert } from "@showtime-xyz/universal.alert";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  Instagram,
  TwitterOutline,
  Download,
  Link,
} from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors, styled } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { ErrorBoundary } from "app/components/error-boundary";
import { useUserProfile } from "app/hooks/api-hooks";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useGetImageColors } from "app/hooks/use-get-image-colors";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTURL } from "app/hooks/use-share-nft";
import domtoimage from "app/lib/dom-to-image";
import { Logger } from "app/lib/logger";
import Share from "app/lib/react-native-share";
import { captureRef, CaptureOptions } from "app/lib/view-shot";
import { createParam } from "app/navigation/use-param";
import {
  getCreatorUsernameFromNFT,
  getMediaUrl,
  getTwitterIntent,
  getTwitterIntentUsername,
  isMobileWeb,
} from "app/utilities";

import { Avatar } from "design-system/avatar";
import { Pressable } from "design-system/pressable";
import { breakpoints } from "design-system/theme";
import { toast } from "design-system/toast";

import { contentGatingType } from "../content-type-tooltip";
import { ShowtimeBrandLogo } from "../showtime-brand";
import { StarBottomLeft, StarBottomRight, StarTop } from "./decoration-icons";
import { ShareButton } from "./share-button";

const { width: windowWidth } = Dimensions.get("window");
const StyledLinearGradient = styled(LinearGradient);
const PlatformBlurView = Platform.OS === "web" ? View : styled(BlurView);
type RaffleModalParams = {
  contractAddress?: string | undefined;
};
const { useParam } = createParam<RaffleModalParams>();

const RaffleSkeleton = ({ size = 375 }) => {
  const { colorScheme } = useColorScheme();
  return (
    <View tw="items-center p-4">
      <View tw="shadow-light dark:shadow-dark w-full max-w-[420px] items-center justify-center rounded-3xl py-4">
        <Spinner />
      </View>
    </View>
  );
};

export const RaffleModal = (props?: RaffleModalParams) => {
  const { contractAddress: contractAddressProp } = props ?? {};
  const [contractAddress] = useParam("contractAddress");
  const modalScreenContext = useModalScreenContext();
  const router = useRouter();
  const { data: edition, loading: isLoadingCollection } =
    useCreatorCollectionDetail(contractAddress || contractAddressProp);

  const { data, isLoading: isLoadingNFT } = useNFTDetailByTokenId({
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });

  const nft = data?.data.item;
  const qrCodeUrl = useMemo(() => {
    if (!nft) return "";
    const url = new URL(getNFTURL(nft));
    if (edition && edition.password) {
      url.searchParams.set("password", edition?.password);
    }
    return url;
  }, [edition, nft]);
  const viewRef = useRef<RNView | Node>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const isDark = useIsDarkMode();
  const { bottom } = useSafeAreaInsets();
  const { data: creatorProfile } = useUserProfile({
    address: nft?.creator_address,
  });
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["sm"];
  const iconColor = isDark ? colors.white : colors.gray[900];
  const [isInstalledApps, setIsInstalledApps] = useState({
    twitter: false,
    instagram: false,
  });
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

  const size = Platform.OS === "web" ? 276 : windowWidth - 48;
  const mediaUri = getMediaUrl({
    nft,
    stillPreview: !nft?.mime_type?.startsWith("image"),
  });
  const { imageColors } = useGetImageColors({ uri: mediaUri });

  const getViewShot = async (result?: CaptureOptions["result"]) => {
    const date = new Date();
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
        fileName: `QR Code - ${date.valueOf()}`,
        /**
         * Notes: Instagram need to format to base64,
         * I guess it's becuase of can't access private folder when deep link to other App
         */
        ...(result ? { result } : {}),
      });
      return uri;
    } catch (error) {
      Logger.log(`captureRefError: ${error}`);
    }
  };
  const onDownload = useCallback(async () => {
    if (Platform.OS === "web") {
      const dataUrl = await domtoimage.toPng(viewRef.current as Node, {
        quality: 1,
      });
      const link = document.createElement("a");
      link.download = `${getCreatorUsernameFromNFT(
        nft
      )}-QRCode-${new Date().valueOf()}`;
      link.href = dataUrl;
      link.click();
    } else {
      let hasPermission = false;
      const url = await getViewShot();
      if (!url) {
        Alert.alert("Oops, An error occurred.");
        return;
      }
      if (status?.granted) {
        hasPermission = status?.granted;
      } else {
        const res = await requestPermission();
        hasPermission = res?.granted;
      }
      if (hasPermission) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await MediaLibrary.saveToLibraryAsync(url);
        toast.success("Saved to Photos");
      } else {
        Alert.alert("No write permission");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [nft, requestPermission, status?.granted]);

  const shareSingleImage = useCallback(
    async (
      social: typeof Share.Social.TWITTER | typeof Share.Social.INSTAGRAM
    ) => {
      const url = await getViewShot();
      if (!url) {
        Alert.alert("Oops, An error occurred.");
        return;
      }
      try {
        const ShareResponse = await Share.shareSingle({
          title: `${nft?.token_name}`,
          message: `${nft?.token_name}`,
          url,
          social,
          filename: `${getCreatorUsernameFromNFT(
            nft
          )}-QRCode-${new Date().valueOf()}`,
        });
        Logger.log("shareSingleImage Result =>", ShareResponse);
      } catch (error) {
        Logger.error("shareSingleImage Error =>", error);
      }
    },
    [nft]
  );

  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: qrCodeUrl.toString(),
        message: `Congrats @${getTwitterIntentUsername(
          creatorProfile?.data?.profile
        )}`,
      })
    );
  }, [creatorProfile?.data?.profile, qrCodeUrl]);

  const shareOpenMore = useCallback(async () => {
    const url = await getViewShot();
    try {
      const ShareResponse = await Share.open({
        title: `${nft?.token_name}`,
        message: `${nft?.token_name}`,
        url,
      });
      Logger.log("shareOpenMore Result =>", ShareResponse);
    } catch (error) {
      Logger.error("shareOpenMore Error =>", error);
    }
  }, [nft]);

  const onCopyLink = useCallback(async () => {
    await Clipboard.setStringAsync(qrCodeUrl.toString());
    toast.success("Copied!");
  }, [qrCodeUrl]);
  const imageStyle = {
    height: size,
    width: size,
    borderRadius: 16,
  };
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
        /**
         *  if not contractAddress here, it may use a local blob address file on web
         *  but we can't convert it to an image, so we need to disable it.
         *
         *  the download function is not working on the mobile web..
         */
        visable: !!contractAddress && !isMobileWeb(),
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
  const brandColor = imageColors?.isDark ? "#FFF" : "#000";
  const ContentType = useCallback(() => {
    if (!edition?.gating_type) return null;
    const Icon = contentGatingType[edition?.gating_type].icon;
    return (
      <View tw="flex-row items-center justify-center">
        <Icon color={brandColor} width={20} height={20} />
        <Text
          tw="ml-1 text-sm font-medium text-white"
          style={{ color: brandColor }}
        >
          {`${contentGatingType[edition?.gating_type].typeName} Drop`}
        </Text>
      </View>
    );
  }, [edition?.gating_type, brandColor]);
  if (isLoadingCollection || isLoadingNFT || !imageColors) {
    return <RaffleSkeleton size={size} />;
  }
  if (!nft) return null;
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
              <View tw="px-4">
                <View collapsable={false} ref={viewRef as any}>
                  <View tw="ml-2 md:ml-4">
                    <ShowtimeBrandLogo
                      color={isDark ? "#fff" : "#000"}
                      size={isMdWidth ? 20 : 16}
                    />
                  </View>
                  <View tw="items-center justify-center py-10">
                    <View tw="item-center justify-center">
                      <Avatar
                        url={nft.creator_img_url}
                        alt={"Winner Avatar"}
                        size={240}
                      />
                      <Text tw="absolute -top-8 left-4 -rotate-[25deg] text-7xl">
                        👑
                      </Text>
                      <Pressable
                        onPress={() =>
                          router.push(`/profile/${nft.creator_name}`)
                        }
                        tw="-top-4 self-center rounded-full bg-white p-4 shadow-lg shadow-black/10 dark:bg-black dark:shadow-white/20"
                      >
                        <Text tw="text-lg font-bold text-black dark:text-white">
                          {getCreatorUsernameFromNFT(nft)}
                        </Text>
                      </Pressable>
                    </View>
                    <View tw="absolute right-6 top-0">
                      <StarTop
                        color={isDark ? colors.gray[900] : colors.gray[50]}
                        width={70}
                        height={70}
                      />
                    </View>
                    <View tw="absolute left-0 bottom-2">
                      <StarBottomLeft
                        color={isDark ? colors.gray[900] : colors.gray[50]}
                        width={80}
                        height={80}
                      />
                    </View>
                    <View tw="absolute right-0 bottom-0">
                      <StarBottomRight
                        color={isDark ? colors.gray[900] : colors.gray[50]}
                        width={75}
                        height={75}
                      />
                    </View>
                  </View>
                  <View tw="m-4 items-center justify-center">
                    <Text tw="text-2xl font-bold text-black dark:text-white">
                      We have a winner 🎉
                    </Text>

                    <ShareButton type="twitter" tw="mt-8 mb-4 w-full" />
                    <ShareButton type="instagram" tw="w-full" />
                  </View>
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheetModalProvider>
        </View>
      </Suspense>
    </ErrorBoundary>
  );
};
