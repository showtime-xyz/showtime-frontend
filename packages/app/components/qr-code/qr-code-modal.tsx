import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  Suspense,
  useState,
} from "react";
import {
  Dimensions,
  Linking,
  Platform,
  View as RNView,
  StyleSheet,
} from "react-native";

import * as Clipboard from "expo-clipboard";
import Reanimated, { Layout, FadeIn, FadeOut } from "react-native-reanimated";

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
  ShowtimeXyz,
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
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTURL } from "app/hooks/use-share-nft";
import { createParam } from "app/navigation/use-param";
import {
  getCreatorUsernameFromNFT,
  getMediaUrl,
  getTwitterIntent,
  getTwitterIntentUsername,
} from "app/utilities";

import { Skeleton } from "design-system";
import { toast } from "design-system/toast";

import { BgGoldLinearGradient } from "../gold-gradient";
import { contentGatingType } from "../tooltips";

const { width: windowWidth } = Dimensions.get("window");

export type DropImageShareType =
  | "Twitter"
  | "Instagram"
  | "Link"
  | "Save"
  | "More";

type QRCodeModalParams = {
  contractAddress?: string | undefined;
  shareType?: DropImageShareType;
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
  return (
    <View tw="items-center p-4">
      <View tw="w-full max-w-[420px] items-center justify-center rounded-3xl py-4">
        <Skeleton width={size} height={size} show radius={24} />
        <View tw="w-full flex-row justify-between p-4">
          <View tw="py-4">
            <View tw="flex-row pb-4">
              <Skeleton width={38} height={38} show radius={999} />
              <View tw="ml-2">
                <Skeleton width={120} height={16} show />
                <View tw="h-1" />
                <Skeleton width={60} height={16} show />
              </View>
            </View>
            <Skeleton width={200} height={38} show />
          </View>
          <Skeleton width={114} height={114} show radius={24} />
        </View>
      </View>
    </View>
  );
};

export const DropImageShare = (props?: QRCodeModalProps) => {
  const { contractAddress: contractAddressProp } = props ?? {};
  const [contractAddress] = useParam("contractAddress");
  const [shareType] = useParam("shareType");
  const [isLoading, setIsLoading] = useState(false);
  const modalScreenContext = useModalScreenContext();

  const { data: edition, loading: isLoadingCollection } =
    useCreatorCollectionDetail(contractAddress || contractAddressProp);

  const { data, isLoading: isLoadingNFT } = useNFTDetailByTokenId({
    chainName: edition?.chain_name,
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
  const isDark = useIsDarkMode();
  const { bottom } = useSafeAreaInsets();
  const { data: creatorProfile } = useUserProfile({
    address: nft?.creator_address,
  });

  const iconColor = isDark ? colors.white : colors.gray[900];
  const { isInstalledApps } = useIsInstalledApps();
  const { shareImageToIG, downloadToLocal, shareOpenMore } =
    useShareImage(viewRef);

  useEffect(() => {
    modalScreenContext?.setTitle("Congrats! Now share it ✦");
  }, [modalScreenContext]);
  useEffect(() => {
    if (shareType) {
      setIsLoading(true);
    }
  }, [shareType]);
  const size = Platform.OS === "web" ? 276 : windowWidth - 32 - 32 - 32;
  const mediaUri = getMediaUrl({
    nft,
    stillPreview: !nft?.mime_type?.startsWith("image"),
  });
  const isPaidNFT = edition?.gating_type === "paid_nft";
  const imageColors = useMemo(
    () => ({
      colors: ["#F4CE5E", "#F4CE5E", "#F1A819", "#FFD480", "#F5E794"],
      iconColor: isPaidNFT ? "#FFD554" : "#fff",
      textColor: "#fff",
    }),
    [isPaidNFT]
  );
  const brandColor = isPaidNFT ? colors.gray[900] : colors.white;

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
        } on @Showtime_xyz ✦\n\n${
          isPaidNFT ? "Collect to unlock:" : "Collect it for free here:"
        }`,
      })
    );
  }, [
    qrCodeUrl,
    props?.dropCreated,
    nft?.token_name,
    creatorProfile?.data?.profile,
    isPaidNFT,
  ]);

  const onCopyLink = useCallback(async () => {
    await Clipboard.setStringAsync(qrCodeUrl.toString());
    toast.success("Copied!");
  }, [qrCodeUrl]);

  const imageStyle = useMemo(
    () => ({
      height: size,
      width: size,
      borderRadius: 16,
    }),
    [size]
  );

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
        onPress: shareImageToIG,
        visable: isInstalledApps.instagram,
      },
      {
        title: "Link",
        Icon: Link,
        onPress: onCopyLink,
        visable: true,
      },
      {
        title: "Save",
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

  const ContentType = useCallback(() => {
    if (!edition?.gating_type || !contentGatingType[edition?.gating_type])
      return null;
    const Icon = contentGatingType[edition?.gating_type].icon;
    return (
      <View tw="absolute right-1 top-2 h-[18px] flex-row items-center justify-center rounded-full bg-black/60 px-2">
        <Icon color={imageColors.iconColor} height={12} width={12} />
        <Text
          tw="ml-1 font-medium"
          style={{ color: imageColors.iconColor, fontSize: 10 }}
        >
          {`${contentGatingType[edition?.gating_type].text} Drop`}
        </Text>
      </View>
    );
  }, [edition?.gating_type, imageColors.iconColor]);

  const onImageLoad = useCallback(() => {
    if (shareType) {
      setIsLoading(false);
      setTimeout(() => {
        switch (shareType) {
          case "Twitter":
            shareWithTwitterIntent();
            break;
          case "Instagram":
            shareImageToIG();
            break;
          case "Link":
            onCopyLink();
            break;
          case "Save":
            downloadToLocal();
            break;
          case "More":
            shareOpenMore();
            break;
          default:
            return;
        }
      }, 600);
    }
  }, [
    shareType,
    shareWithTwitterIntent,
    shareImageToIG,
    onCopyLink,
    downloadToLocal,
    shareOpenMore,
  ]);
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
              <View tw="web:mb-[60px] web:w-[370px] web:self-center select-none px-4">
                <View collapsable={false} ref={viewRef as any}>
                  <View tw=" web:px-8 w-full items-center overflow-hidden rounded-3xl bg-white px-6 pt-8">
                    <BgGoldLinearGradient
                      {...(isPaidNFT
                        ? {}
                        : {
                            colors: [
                              "rgba(176, 19, 216,0.6)",
                              "rgba(75, 39, 254,1)",
                              "rgba(0, 231, 134,0.5)",
                            ],
                            end: { x: -0.1, y: -0.1 },
                            locations: [0, 0.6, 1],
                            start: { x: 0.9, y: 1.5 },
                          })}
                    />
                    <View tw="rounded-3xl bg-gray-900 p-4">
                      <View tw="flex-row items-center pb-4">
                        <Avatar
                          alt={"QRCode Share Avatar"}
                          size={32}
                          url={nft.creator_img_url}
                        />
                        <Text
                          tw="ml-2.5 text-sm font-bold"
                          style={{ color: imageColors.textColor }}
                        >
                          {getCreatorUsernameFromNFT(nft)}
                        </Text>
                      </View>
                      <Text
                        tw="text-base font-bold"
                        style={{ color: imageColors.textColor }}
                      >
                        {nft?.token_name}
                      </Text>
                      <View tw="h-4" />
                      <View
                        tw="overflow-hidden rounded-xl"
                        style={{
                          width: size,
                          height: size,
                        }}
                      >
                        {props?.renderPreviewComponent ? (
                          props?.renderPreviewComponent(imageStyle)
                        ) : (
                          <Image
                            source={{
                              uri: `${mediaUri}?optimizer=image&width=${size}&quality=80`,
                            }}
                            recyclingKey={mediaUri}
                            resizeMode={"cover"}
                            style={{ height: "100%", width: "100%" }}
                            transition={200}
                            onLoad={onImageLoad}
                          />
                        )}
                        <ContentType />
                      </View>
                    </View>
                    <View tw="pb-4 pt-3">
                      <Text
                        tw="text-center text-sm font-bold "
                        style={{ color: brandColor }}
                      >
                        Collect on
                      </Text>
                      <View tw="h-2" />
                      <ShowtimeXyz color={brandColor} height={18} width={127} />
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
          {isLoading ? (
            <Reanimated.View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.4)",
                },
              ]}
              layout={Layout.duration(100)}
              entering={FadeIn}
              exiting={FadeOut}
            >
              <Spinner />
            </Reanimated.View>
          ) : null}
        </View>
      </Suspense>
    </ErrorBoundary>
  );
};
