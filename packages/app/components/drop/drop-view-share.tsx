import React, { memo, useCallback, useMemo } from "react";
import { Linking, Platform, ScrollView } from "react-native";

import * as Clipboard from "expo-clipboard";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { Media } from "app/components/media";
import {
  TwitterButton,
  InstagramButton,
  CopyLinkButton,
} from "app/components/social-buttons";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useRedirectDropImageShareScreen } from "app/hooks/use-redirect-to-drop-image-share-screen";
import { getNFTSlug, getNFTURL } from "app/hooks/use-share-nft";
import { createParam } from "app/navigation/use-param";
import { getTwitterIntent } from "app/utilities";

import { toast } from "design-system/toast";

import { CloseButton } from "../close-button";
import { BgGoldLinearGradient } from "../gold-gradient";
import { DropPreview, DropPreviewProps } from "./drop-preview";

type DropPreviewShareProps = Omit<DropPreviewProps, "onPressCTA"> & {
  contractAddress?: string;
  dropCreated?: boolean;
};

export const DropViewShare = memo(function DropViewShare({
  contractAddress,
  dropCreated = false,
  ...rest
}: DropPreviewShareProps) {
  const isDark = useIsDarkMode();
  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  const redirectDropImageShareScreen = useRedirectDropImageShareScreen();
  const router = useRouter();
  const { data } = useNFTDetailByTokenId({
    chainName: edition?.chain_name,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });
  const { top, bottom } = useSafeAreaInsets();
  const isPaidNFT = edition?.gating_type === "paid_nft";
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
        message: `Just ${dropCreated ? "dropped" : "collected"} "${
          nft?.token_name
        }" on @Showtime_xyz 💫🔗\n\n${
          isPaidNFT ? "Collect to unlock:" : "Collect it for free here:"
        }`,
      })
    );
  }, [dropCreated, isPaidNFT, nft?.token_name, qrCodeUrl]);

  const onCopyLink = useCallback(async () => {
    await Clipboard.setStringAsync(qrCodeUrl.toString());
    toast.success("Copied!");
  }, [qrCodeUrl]);

  return (
    <View tw="flex-1">
      {isPaidNFT ? <BgGoldLinearGradient /> : null}
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(top, 20),
          paddingBottom: Math.max(bottom, 12),
        }}
      >
        <DropPreview
          ctaCopy="View"
          buttonProps={{ variant: "primary" }}
          isPaidNFT={isPaidNFT}
          {...rest}
        />
        <View
          tw="w-full flex-1 self-center px-4 py-4 sm:max-w-[332px]"
          style={{
            paddingBottom: Math.max(bottom + 8, 12),
          }}
        >
          <TwitterButton onPress={shareWithTwitterIntent} />

          <InstagramButton
            tw="mt-4"
            theme={isPaidNFT ? "light" : undefined}
            onPress={() =>
              redirectDropImageShareScreen(
                contractAddress ?? "0xcd59916706368f23c7409f7addb8714a9c093445",
                "Instagram"
              )
            }
          />
          <CopyLinkButton
            tw="mt-4"
            theme={isPaidNFT ? "dark" : undefined}
            onPress={onCopyLink}
          />
          <Button
            tw="mt-4"
            size="regular"
            theme={isPaidNFT ? "dark" : undefined}
            onPress={() => {
              if (!nft) return;
              if (Platform.OS !== "web") {
                router.pop();
                router.push(getNFTSlug(nft));
              } else {
                router.replace(getNFTSlug(nft));
              }
            }}
          >
            View Drop
          </Button>
        </View>
      </ScrollView>
      <View tw="absolute left-4 top-4 z-50 flex">
        <CloseButton
          color={isDark ? colors.gray[200] : colors.gray[900]}
          onPress={() => router.pop()}
        />
      </View>
    </View>
  );
});

type Query = {
  contractAddress: string;
  tokenId?: string;
  chainName?: string;
};

const { useParam } = createParam<Query>();

export const DropViewShareComponent = () => {
  const [contractAddress] = useParam("contractAddress");
  const [tokenId] = useParam("tokenId");
  const [chainName] = useParam("chainName");

  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  const { data: nft } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  if (!edition || !nft)
    return (
      <View tw="h-80 items-center justify-center">
        <Spinner />
      </View>
    );

  return (
    <DropViewShare
      title={edition?.creator_airdrop_edition?.name}
      description={edition?.creator_airdrop_edition.description}
      file={edition?.creator_airdrop_edition?.image_url}
      contractAddress={contractAddress}
      appleMusicTrackUrl={edition?.apple_music_track_url}
      spotifyUrl={edition?.spotify_track_url}
      preivewComponent={({ size }) => (
        <Media
          item={nft.data.item}
          sizeStyle={{
            width: size,
            height: size,
          }}
          optimizedWidth={size}
          isMuted
        />
      )}
      tw="my-2"
    />
  );
};
