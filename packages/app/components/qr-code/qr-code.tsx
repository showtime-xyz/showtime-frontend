import { useRef, useMemo, Suspense, useCallback } from "react";
import { Dimensions, Platform } from "react-native";

import * as MediaLibrary from "expo-media-library";

import { Alert } from "@showtime-xyz/universal.alert";
import { Avatar } from "@showtime-xyz/universal.avatar";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  Instagram,
  Twitter,
  ScanOutline,
  Download,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { useToast } from "@showtime-xyz/universal.toast";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { Media } from "app/components/media";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTURL } from "app/hooks/use-share-nft";
import domtoimage from "app/lib/dom-to-image";
import { Logger } from "app/lib/logger";
import { ReactQRCode } from "app/lib/qr-code";
import Share from "app/lib/react-native-share";
import { captureRef, CaptureOptions } from "app/lib/view-shot";
import { createParam } from "app/navigation/use-param";
import { NFT } from "app/types";
import { getCreatorUsernameFromNFT } from "app/utilities";

const { width: windowWidth } = Dimensions.get("window");

const { useParam } = createParam<{
  contractAddress: string;
  password: string;
}>();

type Props = {
  text?: string;
  size?: number;
  nft?: NFT;
};

export const QRCode = ({
  text = "",
  size = windowWidth >= 768 ? 400 : windowWidth - 40,
  nft,
}: Props) => {
  const viewRef = useRef<typeof View | Node>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const isDark = useIsDarkMode();
  const toast = useToast();
  const { bottom } = useSafeAreaInsets();
  const getViewShot = async (result?: CaptureOptions["result"]) => {
    const date = new Date();
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
      if (!url) return;
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

  const iconColor = isDark ? colors.white : colors.gray[900];
  const shareButtons = useMemo(
    () => [
      {
        title: "Twitter",
        Icon: Twitter,
        onPress: () => shareSingleImage(Share.Social.TWITTER),
      },
      {
        title: "Instagram",
        Icon: Instagram,
        onPress: () => shareSingleImage(Share.Social.INSTAGRAM),
      },
      {
        title: "Save",
        Icon: Download,
        onPress: onDownload,
      },
      {
        title: "More",
        Icon: MoreHorizontal,
        onPress: shareOpenMore,
      },
    ],
    [onDownload, shareOpenMore, shareSingleImage]
  );
  if (!nft) return null;
  return (
    <View tw="w-full flex-1">
      <View ref={viewRef}>
        <View tw="w-full items-center bg-gray-100 py-4 dark:bg-gray-900">
          <Media
            item={nft}
            sizeStyle={{
              height: size,
              width: size,
              borderRadius: 16,
            }}
          />

          <View tw="w-full flex-row justify-between px-5 py-4">
            <View tw="flex-1 py-4">
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
                tw="font-space-bold text-lg text-black dark:text-white"
                numberOfLines={2}
              >
                {nft.token_name}
              </Text>
            </View>
            <View tw="ml-2 h-28 rounded-lg border border-gray-300 p-2 dark:border-gray-500">
              <ReactQRCode size={96} value={text} />
            </View>
          </View>
          <View tw="flex-row items-center justify-center">
            <ScanOutline height={16} width={16} color={iconColor} />
            <View tw="w-1" />
            <Text tw="text-13 text-center font-medium text-black dark:text-white">
              Scan to Collect
            </Text>
          </View>
        </View>
      </View>
      {Platform.OS === "web" ? (
        <Pressable
          onPress={onDownload}
          tw="flex-1 items-center justify-center px-4 py-4"
        >
          <Download height={24} width={24} color={iconColor} />
          <View tw="h-2" />
          <Text tw="text-xs font-semibold text-gray-900 dark:text-white">
            Download
          </Text>
        </Pressable>
      ) : (
        <View
          tw="absolute bottom-0 w-full flex-row border-t border-gray-100 dark:border-gray-700"
          style={{ paddingBottom: bottom }}
        >
          {shareButtons.map(({ onPress, Icon, title }, index) => (
            <Pressable
              onPress={() => {
                Haptics.impactAsync();

                onPress();
              }}
              tw="flex-1 items-center justify-center px-4 py-4"
              key={index.toString()}
            >
              <Icon height={24} width={24} color={iconColor} />
              <View tw="h-2" />
              <Text tw="text-xs font-semibold text-gray-900 dark:text-white">
                {title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export const QRCodeModal = () => {
  const [contractAddress] = useParam("contractAddress");
  const { data: edition } = useCreatorCollectionDetail(contractAddress);

  const { data } = useNFTDetailByTokenId({
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

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <View tw="p-4">
            <Spinner />
          </View>
        }
      >
        <QRCode text={qrCodeUrl.toString()} nft={nft} />
      </Suspense>
    </ErrorBoundary>
  );
};
