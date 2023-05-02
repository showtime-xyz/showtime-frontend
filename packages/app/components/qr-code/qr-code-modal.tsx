import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
  Suspense,
} from "react";
import { Dimensions, Linking, Platform, View as RNView } from "react-native";

import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";

import { Alert } from "@showtime-xyz/universal.alert";
import { Avatar } from "@showtime-xyz/universal.avatar";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
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
import { Image } from "@showtime-xyz/universal.image";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors, styled } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
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
import { ReactQRCode } from "app/lib/qr-code";
import Share from "app/lib/react-native-share";
import { captureRef, CaptureOptions } from "app/lib/view-shot";
import { createParam } from "app/navigation/use-param";
import {
  formatClaimNumber,
  getCreatorNameFromNFT,
  getCreatorUsernameFromNFT,
  getMediaUrl,
  getTwitterIntent,
  getTwitterIntentUsername,
  isMobileWeb,
} from "app/utilities";

import { Skeleton } from "design-system";
import { toast } from "design-system/toast";

import { contentGatingType } from "../content-type-tooltip";
import { ShowtimeBrandLogo } from "../showtime-brand";

const { width: windowWidth } = Dimensions.get("window");
const StyledLinearGradient = styled(LinearGradient);
const PlatformBlurView = Platform.OS === "web" ? View : styled(BlurView);
type QRCodeModalParams = {
  contractAddress?: string | undefined;
};
const { useParam } = createParam<QRCodeModalParams>();

type PreviewStyle = {
  height: number;
  width: number;
  borderRadius?: number;
};
type QRCodeModalProps = QRCodeModalParams & {
  dropCreated?: boolean;
  renderPreviewComponent?: (props: PreviewStyle) => JSX.Element;
};

const QRCodeSkeleton = ({ size = 375 }) => {
  const { colorScheme } = useColorScheme();
  return (
    <View tw="items-center p-4">
      <View tw="w-full max-w-[420px] items-center justify-center rounded-3xl py-4">
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
        ...(result ? { result } : {}),
      });
      return uri;
    } catch (error) {
      Logger.log(`captureRefError: ${error}`);
    }
  };

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
      link.download = `${getCreatorUsernameFromNFT(
        nft
      )}-QRCode-${new Date().valueOf()}`;
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
  }, [checkPhotosPermission, nft]);

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
    [nft, prepareShareToIG]
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
    if (!edition?.gating_type || !contentGatingType[edition?.gating_type])
      return null;
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
              <View tw="ios:scale-[0.82] android:scale-[0.82] web:pt-0 web:pb-2 ios:-mt-10 android:-mt-10 web:w-[340px] web:self-center select-none">
                <View collapsable={false} ref={viewRef as any}>
                  <StyledLinearGradient
                    tw="web:mb-[60px] web:px-8 w-full items-center overflow-hidden rounded-3xl bg-white px-6 pt-8"
                    colors={imageColors?.colors}
                    locations={[0, 1]}
                    start={[0.5, 0.25]}
                    end={[0.5, 0.75]}
                  >
                    <View tw="mb-10 w-full flex-row justify-between">
                      <ShowtimeBrandLogo color={brandColor} />
                      <View tw="flex-row">
                        <ContentType />
                      </View>
                    </View>

                    <View style={imageStyle} />
                    <PlatformBlurView
                      intensity={100}
                      tint="dark"
                      tw="-mt-4 w-full overflow-hidden rounded-xl pt-4"
                    >
                      <View tw="web:bg-black/40 w-full flex-row justify-between px-2 py-6 backdrop-blur-lg">
                        <View tw="mr-2 h-[78px] w-[78px] justify-center rounded-lg border border-gray-600 bg-white p-1">
                          <ReactQRCode
                            size={68}
                            // ecl="L"
                            value={qrCodeUrl.toString()}
                            fillColors={["#fff", "#000"]}
                          />
                        </View>
                        <View tw="flex-1 justify-center">
                          {edition?.creator_airdrop_edition ? (
                            <Text
                              tw="flex flex-nowrap text-xs font-medium"
                              style={{
                                color: imageColors.textColor,
                                fontSize: 10,
                              }}
                              numberOfLines={1}
                            >
                              {edition?.creator_airdrop_edition.edition_size > 0
                                ? `${formatClaimNumber(
                                    edition?.creator_airdrop_edition
                                      .edition_size
                                  )} EDITIONS`
                                : "OPEN EDITION COLLECTION"}
                            </Text>
                          ) : null}
                          <View tw="h-2" />
                          <View tw="h-8">
                            <Text
                              tw="text-base font-bold text-white"
                              style={{ fontSize: 18 }}
                              numberOfLines={2}
                            >
                              {nft.token_name}
                            </Text>
                          </View>
                          <View tw="mt-1 flex-row">
                            <Avatar
                              alt={"QRCode Share Avatar"}
                              size={20}
                              tw="border"
                              borderColor="#7C757F"
                              url={nft.creator_img_url}
                            />
                            <View tw="ml-1 flex flex-row items-center">
                              <Text
                                tw="flex text-sm font-semibold"
                                style={{
                                  color: imageColors.textColor,
                                  maxWidth: 180,
                                }}
                                numberOfLines={1}
                              >
                                {getCreatorNameFromNFT(nft)}
                              </Text>
                              {!!nft.creator_verified && (
                                <VerificationBadge
                                  style={{ marginLeft: 4 }}
                                  size={12}
                                  bgColor={imageColors.textColor}
                                  fillColor={"#000"}
                                />
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    </PlatformBlurView>
                    <View
                      tw="absolute top-24 rounded-xl"
                      style={{
                        shadowColor: "rgba(0, 0, 0, 0.44)",
                        shadowOffset: {
                          width: 0,
                          height: 14,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 16.0,
                        elevation: 24,
                      }}
                    >
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
                          alt={nft?.token_name}
                          blurhash={nft?.blurhash}
                        />
                      )}
                    </View>
                    <PlatformBlurView tw="mb-14 mt-12 items-center justify-center overflow-hidden rounded-full bg-black/40 px-4 py-2">
                      <Text
                        tw="text-13 text-center font-medium"
                        style={{ color: imageColors.textColor }}
                      >
                        {`SHOWTIME.XYZ/${getCreatorUsernameFromNFT(
                          nft
                        )?.toLocaleUpperCase()}`}
                      </Text>
                    </PlatformBlurView>
                  </StyledLinearGradient>
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
