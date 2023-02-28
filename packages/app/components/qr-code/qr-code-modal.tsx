import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
  Suspense,
} from "react";
import { Dimensions, Linking, Platform, View as RNView } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Clipboard from "expo-clipboard";
import * as MediaLibrary from "expo-media-library";

import { Alert } from "@showtime-xyz/universal.alert";
import { Avatar } from "@showtime-xyz/universal.avatar";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  Instagram,
  TwitterOutline,
  ScanOutline,
  Download,
  Link,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { useToast } from "@showtime-xyz/universal.toast";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { ErrorBoundary } from "app/components/error-boundary";
import { useUserProfile } from "app/hooks/api-hooks";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTURL } from "app/hooks/use-share-nft";
import domtoimage from "app/lib/dom-to-image";
import { Logger } from "app/lib/logger";
import { ReactQRCode } from "app/lib/qr-code";
import Share from "app/lib/react-native-share";
import { captureRef, CaptureOptions } from "app/lib/view-shot";
import { createParam } from "app/navigation/use-param";
import {
  getCreatorUsernameFromNFT,
  getMediaUrl,
  getTwitterIntent,
  getTwitterIntentUsername,
} from "app/utilities";

import { Skeleton } from "design-system";

const { width: windowWidth } = Dimensions.get("window");
type QRCodeModalParams = {
  contractAddress?: string | undefined;
};
const { useParam } = createParam<QRCodeModalParams>();

type PreviewStyle = {
  height: number;
  width: number;
  borderRadius: number;
};
type QRCodeModalProps = QRCodeModalParams & {
  dropCreated?: boolean;
  renderPreviewComponent?: (props: PreviewStyle) => JSX.Element;
};

const QRCodeSkeleton = ({ size = 375 }) => {
  const { colorScheme } = useColorScheme();
  return (
    <View tw="items-center p-4">
      <View tw="shadow-light dark:shadow-dark w-full max-w-[420px] items-center justify-center rounded-3xl py-4">
        <Skeleton
          width={size}
          height={size}
          show
          radius={24}
          colorMode={colorScheme as any}
        />

        <View tw="w-full flex-row justify-between p-4">
          <View tw="py-4">
            <View tw="flex-row pb-4">
              <Skeleton
                width={38}
                height={38}
                show
                radius={999}
                colorMode={colorScheme as any}
              />
              <View tw="ml-2">
                <Skeleton
                  width={120}
                  height={16}
                  show
                  colorMode={colorScheme as any}
                />
                <View tw="h-1" />
                <Skeleton
                  width={60}
                  height={16}
                  show
                  colorMode={colorScheme as any}
                />
              </View>
            </View>
            <Skeleton
              width={200}
              height={38}
              show
              colorMode={colorScheme as any}
            />
          </View>
          <Skeleton
            width={114}
            height={114}
            show
            radius={24}
            colorMode={colorScheme as any}
          />
        </View>
      </View>
    </View>
  );
};

export const QRCodeModal = (props?: QRCodeModalProps) => {
  const { contractAddress: contractAddressProp } = props ?? {};
  const [contractAddress] = useParam("contractAddress");
  const modalScreenContext = useModalScreenContext();

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
  const toast = useToast();
  const { bottom } = useSafeAreaInsets();
  const { data: creatorProfile } = useUserProfile({
    address: nft?.creator_address,
  });

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

  useEffect(() => {
    modalScreenContext?.setTitle("Congrats! Now share it ✦");
  }, [modalScreenContext]);

  const size = windowWidth >= 768 ? 375 : windowWidth - 60;
  const mediaUri = getMediaUrl({
    nft,
    stillPreview: !nft?.mime_type?.startsWith("image"),
  });

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
      const dataUrl = await domtoimage.toPng(viewRef.current as Node);
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
        toast?.show({
          message: "Saved to Photos",
          hideAfter: 2000,
        });
      } else {
        Alert.alert("No write permission");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [nft, requestPermission, status?.granted, toast]);

  const shareSingleImage = useCallback(
    async (
      social: typeof Share.Social.TWITTER | typeof Share.Social.INSTAGRAM
    ) => {
      const url = await getViewShot(
        social === Share.Social.INSTAGRAM ? "data-uri" : undefined
      );
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
        message: `Just ${props?.dropCreated ? "dropped" : "collected"} "${
          nft?.token_name
        }" ${
          props?.dropCreated
            ? ""
            : `by ${getTwitterIntentUsername(creatorProfile?.data?.profile)}`
        } on @Showtime_xyz ✦🔗\n\nCollect it for free here:`,
      })
    );
  }, [
    creatorProfile?.data?.profile,
    nft?.token_name,
    qrCodeUrl,
    props?.dropCreated,
  ]);

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
    toast?.show({ message: "Copied!", hideAfter: 5000 });
  }, [qrCodeUrl, toast]);
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
         */
        visable: !!contractAddress,
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
  if (isLoadingCollection || isLoadingNFT) {
    return <QRCodeSkeleton size={size} />;
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
              <RNView
                collapsable={false}
                style={{ alignItems: "center" }}
                ref={viewRef as any}
              >
                <View tw="web:mb-[74px] w-full max-w-[420px] items-center bg-gray-100 py-4 dark:bg-gray-900">
                  {props?.renderPreviewComponent ? (
                    props?.renderPreviewComponent(imageStyle)
                  ) : (
                    <Image
                      source={{
                        uri: mediaUri,
                      }}
                      style={imageStyle}
                      width={size}
                      height={size}
                      resizeMode="cover"
                      alt={nft?.token_name}
                      blurhash={nft?.blurhash}
                    />
                  )}
                  <View tw="w-full flex-row justify-between px-6 py-4">
                    <View tw="flex-1 justify-center">
                      <View tw="flex-row pb-4">
                        <Avatar
                          alt={"QRCode Share Avatar"}
                          size={38}
                          tw="border border-gray-200 dark:border-gray-900"
                          url={nft.creator_img_url}
                        />
                        <View tw="ml-2 justify-center">
                          <Text tw="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            Creator
                          </Text>
                          <View tw="h-2" />
                          <View>
                            <View tw="flex flex-row items-center">
                              <Text tw="text-13 flex font-semibold text-gray-900 dark:text-white">
                                {getCreatorUsernameFromNFT(nft)}
                              </Text>
                              {nft.creator_verified ? (
                                <VerificationBadge
                                  style={{ marginLeft: 4 }}
                                  size={12}
                                />
                              ) : null}
                            </View>
                          </View>
                        </View>
                      </View>

                      <Text
                        tw="text-lg text-black dark:text-white"
                        numberOfLines={2}
                      >
                        {nft.token_name}
                      </Text>
                    </View>
                    <View tw="ml-2 h-[114px] justify-center rounded-lg border border-gray-300 px-2 dark:border-gray-500">
                      <ReactQRCode size={96} value={qrCodeUrl.toString()} />
                    </View>
                  </View>
                  {Platform.OS !== "web" && (
                    <View tw="flex-row items-center justify-center">
                      <ScanOutline height={16} width={16} color={iconColor} />
                      <View tw="w-1" />
                      <Text tw="text-13 text-center font-medium text-black dark:text-white">
                        Scan to Collect
                      </Text>
                    </View>
                  )}
                </View>
              </RNView>
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
                  tw="flex-1 items-center justify-center py-4"
                  key={title}
                >
                  <Icon height={24} width={24} color={iconColor} />
                  <View tw="h-2" />
                  <Text tw="text-xs text-gray-900 dark:text-white">
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
