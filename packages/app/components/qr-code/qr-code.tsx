import { useRef, useMemo, Suspense } from "react";
import { Dimensions } from "react-native";

import * as MediaLibrary from "expo-media-library";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  Instagram,
  Twitter,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { useToast } from "@showtime-xyz/universal.toast";
import { View } from "@showtime-xyz/universal.view";

import { Creator } from "app/components/card/rows/elements/creator";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTURL } from "app/hooks/use-share-nft";
import { ReactQRCode } from "app/lib/qr-code";
import Share from "app/lib/react-native-share";
import { captureRef } from "app/lib/view-shot";
import { createParam } from "app/navigation/use-param";

import { Logger } from "../../lib/logger";
import { NFT } from "../../types";
import { ErrorBoundary } from "../error-boundary";
import { Media } from "../media";

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
  const viewRef = useRef(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const isDark = useIsDarkMode();
  const toast = useToast();
  const { bottom } = useSafeAreaInsets();
  const getViewShot = async () => {
    const date = new Date();
    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 0.8,
      fileName: `QR Code - ${date.valueOf()}`,
    });
    return uri;
  };
  // const onDownload = async () => {
  //   if (Platform.OS === "web") {
  //     const svg = ref.current;
  //     const svgData = new XMLSerializer().serializeToString(svg);
  //     const canvas = document.createElement("canvas");
  //     const ctx = canvas.getContext("2d");
  //     const img = new Image();
  //     img.onload = function () {
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       ctx?.drawImage(img, 0, 0);
  //       const pngFile = canvas.toDataURL("image/png");

  //       const downloadLink = document.createElement("a");
  //       downloadLink.download = "qrcode";
  //       downloadLink.href = `${pngFile}`;
  //       downloadLink.click();
  //     };

  //     img.src = "data:image/svg+xml;base64," + btoa(svgData);
  //   } else {
  //     let hasPermission = false;
  //     ref.current?.capture?.().then(async (uri: string) => {
  //       if (status?.granted) {
  //         hasPermission = status?.granted;
  //       } else {
  //         const res = await requestPermission();
  //         hasPermission = res?.granted;
  //       }

  //       if (hasPermission) {
  //         await MediaLibrary.saveToLibraryAsync(uri);
  //         toast?.show({
  //           message: "Saved to Photos",
  //           hideAfter: 2000,
  //         });
  //       }
  //     });
  //   }
  // };

  const shareSingleImage = async (
    social: typeof Share.Social.TWITTER | typeof Share.Social.INSTAGRAM
  ) => {
    const url = await getViewShot();
    if (!url) return;
    try {
      const ShareResponse = await Share.shareSingle({
        title: `${nft?.token_name}`,
        message: `${nft?.token_name}`,
        url,
        social,
      });
      Logger.log("Result =>", ShareResponse);
    } catch (error) {
      Logger.log("Error =>", error);
    }
  };

  const shareOpenMore = async () => {
    const url = await getViewShot();
    try {
      const ShareResponse = await Share.open({
        title: `${nft?.token_name}`,
        message: `${nft?.token_name}`,
        url,
      });
      console.log("Result =>", ShareResponse);
    } catch (error) {
      console.log("Error =>", error);
    }
  };

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
            <View tw="flex-1">
              <Creator nft={nft} shouldShowDateCreated={false} />
              <Text
                tw="font-space-bold text-lg !leading-8 text-black dark:text-white"
                numberOfLines={1}
              >
                {nft.token_name}
              </Text>
            </View>
            <View tw="rounded-lg border border-gray-300 p-2 dark:border-gray-500">
              <ReactQRCode size={96} value={text} />
            </View>
          </View>
          <View tw="flex-row">
            <Text tw="text-center text-sm font-semibold text-black dark:text-white">
              Scan to Collect
            </Text>
          </View>
        </View>
      </View>
      <View
        tw="absolute bottom-0 w-full flex-row border-t border-gray-100 dark:border-gray-700"
        style={{ paddingBottom: bottom }}
      >
        <Pressable
          onPress={() => shareSingleImage(Share.Social.TWITTER)}
          tw="items-center justify-center px-4 py-4"
        >
          <Twitter
            height={24}
            width={24}
            color={isDark ? "#FFF" : colors.gray[900]}
          />
          <View tw="h-2" />
          <Text tw="text-sm text-gray-900 dark:text-white">Twitter</Text>
        </Pressable>
        <Pressable
          onPress={() => shareSingleImage(Share.Social.INSTAGRAM)}
          tw="items-center justify-center px-4 py-4"
        >
          <Instagram
            height={24}
            width={24}
            color={isDark ? "#FFF" : colors.gray[900]}
          />
          <View tw="h-2" />
          <Text tw="text-sm text-gray-900 dark:text-white">Instagram</Text>
        </Pressable>
        <Pressable
          onPress={shareOpenMore}
          tw="items-center justify-center px-4 py-4"
        >
          <MoreHorizontal
            height={24}
            width={24}
            color={isDark ? "#FFF" : colors.gray[900]}
          />
          <View tw="h-2" />
          <Text tw="text-sm text-gray-900 dark:text-white">More</Text>
        </Pressable>
      </View>
      {/* <Button tw="mt-4 self-center" onPress={onDownload}>
        Download QR Code
      </Button> */}
    </View>
  );
};

export const QRCodeModal = () => {
  const [contractAddress] = useParam("contractAddress");
  const {
    data: edition,
    loading,
    error,
    mutate,
  } = useCreatorCollectionDetail(contractAddress);

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
