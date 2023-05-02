import React, { memo, useCallback, useMemo, useState } from "react";
import { Linking, Platform } from "react-native";

import * as Clipboard from "expo-clipboard";

import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Link, QrCode, TwitterOutline } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug, getNFTURL } from "app/hooks/use-share-nft";
import { getTwitterIntent } from "app/utilities";

import { toast } from "design-system/toast";

import { QRCode } from "../qr-code";
import { DropPreview, DropPreviewProps } from "./drop-preview";

const BUTTON_HEIGHT = 48;
type DropPreviewShareProps = Omit<DropPreviewProps, "onPressCTA"> & {
  contractAddress?: string;
};

export const DropViewShare = memo(function DropViewShare({
  contractAddress,
  ...rest
}: DropPreviewShareProps) {
  const { bottom } = useSafeAreaInsets();
  const isDark = useIsDarkMode();
  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  const router = useRouter();
  const { data } = useNFTDetailByTokenId({
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });
  const [isShowQRCode, setIsShowQRCode] = useState(false);
  const iconColor = isDark ? colors.white : colors.gray[900];
  const nft = data?.data.item;
  const qrCodeUrl = useMemo(() => {
    if (!nft) return "";
    const url = new URL(getNFTURL(nft));
    if (edition && edition.password) {
      url.searchParams.set("password", edition?.password);
    }
    return url;
  }, [edition, nft]);
  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: qrCodeUrl.toString(),
        message: `Just collected "${nft?.token_name}" on @Showtime_xyz ✦🔗\n\nCollect it for free here:`,
      })
    );
  }, [nft?.token_name, qrCodeUrl]);

  const onCopyLink = useCallback(async () => {
    await Clipboard.setStringAsync(qrCodeUrl.toString());
    toast.success("Copied!");
  }, [qrCodeUrl]);

  const showQRCode = () => {
    setIsShowQRCode(!isShowQRCode);
  };
  const shareButtons = [
    {
      title: "Share on Twitter",
      Icon: TwitterOutline,
      onPress: shareWithTwitterIntent,
    },
    {
      title: "Copy Link",
      Icon: Link,
      onPress: onCopyLink,
    },
    {
      title: "Share QR Code",
      Icon: QrCode,
      onPress: showQRCode,
    },
  ];
  return (
    <View tw="flex-1">
      {isShowQRCode ? (
        <QRCode
          value={qrCodeUrl.toString()}
          size={240}
          tw="web:mt-0 -mt-28 flex-1 items-center justify-center"
        />
      ) : (
        <>
          <BottomSheetModalProvider>
            <BottomSheetScrollView
              contentContainerStyle={{
                paddingBottom: Math.max(bottom, 8) + BUTTON_HEIGHT,
              }}
            >
              <DropPreview
                ctaCopy="View"
                buttonProps={{ variant: "primary" }}
                tw="web:mb-5 mt-2"
                onPressCTA={() => {
                  if (!nft) return;
                  if (Platform.OS !== "web") {
                    router.pop();
                    router.push(getNFTSlug(nft));
                  } else {
                    router.replace(getNFTSlug(nft));
                  }
                }}
                {...rest}
              />
            </BottomSheetScrollView>
          </BottomSheetModalProvider>
          <View
            tw="absolute bottom-0 w-full flex-row border-t border-gray-100 bg-white dark:border-gray-700 dark:bg-black sm:px-4"
            style={{
              paddingBottom: Platform.select({
                default: Math.max(bottom, 8),
                web: 0,
              }),
            }}
          >
            {shareButtons.map(({ onPress, Icon, title }) => (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync();
                  onPress();
                }}
                tw="flex-1 flex-col items-center justify-end sm:flex-row sm:justify-center sm:pt-4"
                key={title}
                style={{ height: BUTTON_HEIGHT }}
              >
                <Icon height={24} width={24} color={iconColor} />
                <View tw="h-2 sm:w-2" />
                <Text tw="text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                  {title}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
});
