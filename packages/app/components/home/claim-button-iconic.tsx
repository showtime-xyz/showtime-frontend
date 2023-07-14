import { useCallback, useContext } from "react";
import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Showtime, Check2 } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ClaimStatus, getClaimStatus } from "app/components/claim/claim-button";
import { ClaimContext } from "app/context/claim-context";
import { useMyInfo } from "app/hooks/api-hooks";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { NFT } from "app/types";
import { formatClaimNumber } from "app/utilities";

import { toast } from "design-system/toast";

import { ClaimType } from "../claim/claim-form";
import { FeedSocialButton } from "../feed-social-button";

export function ClaimButtonIconic({ nft, ...rest }: { nft: NFT; tw?: string }) {
  const { data: myInfoData } = useMyInfo();
  const router = useRouter();
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const isDark = useIsDarkMode();
  const { state: claimStates, dispatch } = useContext(ClaimContext);

  const { data: edition, loading } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );
  const status = getClaimStatus(edition);

  const viewCollecters = useCallback(() => {
    const as = `/collectors/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}`;
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            contractAddress: nft?.contract_address,
            tokenId: nft?.token_id,
            chainName: nft?.chain_name,
            collectorsModal: true,
          },
        } as any,
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  }, [router, nft]);
  const handleCollectPress = useCallback(
    (type: "free" | "appleMusic" | "spotify") => {
      if (
        claimStates.status === "loading" &&
        claimStates.signaturePrompt === false
      ) {
        toast("Please wait for the previous collect to complete.");
        return;
      }
      dispatch({ type: "initial" });
      if (edition) {
        redirectToClaimDrop(
          edition.creator_airdrop_edition.contract_address,
          type
        );
      }
    },
    [claimStates, dispatch, edition, redirectToClaimDrop]
  );
  const claimDrop = useCallback(() => {
    let type: ClaimType = "free";

    if (
      myInfoData?.data.profile.has_spotify_token &&
      (edition?.gating_type === "spotify_save" ||
        edition?.gating_type === "spotify_presave" ||
        edition?.gating_type === "multi_provider_music_save" ||
        edition?.gating_type === "multi_provider_music_presave")
    ) {
      type = "spotify";
    } else if (
      myInfoData?.data.profile.has_apple_music_token &&
      (edition?.gating_type === "multi_provider_music_save" ||
        edition?.gating_type === "multi_provider_music_presave")
    ) {
      type = "appleMusic";
    } else if (
      edition?.gating_type === "spotify_save" ||
      edition?.gating_type === "spotify_presave"
    ) {
      type = "spotify";
    } else {
      type =
        edition?.creator_spotify_id || edition?.spotify_track_url
          ? "spotify"
          : "appleMusic";
    }
    handleCollectPress(type);
  }, [
    myInfoData?.data.profile.has_spotify_token,
    myInfoData?.data.profile.has_apple_music_token,
    edition?.gating_type,
    edition?.creator_spotify_id,
    edition?.spotify_track_url,
    handleCollectPress,
  ]);

  if (loading) {
    return (
      <View tw="mb-4">
        <Skeleton height={56} width={56} radius={999} show={true} />
        <View tw="mt-2 items-center">
          <Skeleton height={8} width={24} radius={6} show={true} />
        </View>
      </View>
    );
  }
  if (!edition) return null;

  if (status === ClaimStatus.Soldout) {
    return (
      <FeedSocialButton
        text={
          <>
            <Text
              tw={[
                "text-center text-xs font-semibold text-gray-900 dark:text-white",
              ]}
              onPress={viewCollecters}
            >
              {formatClaimNumber(edition.total_claimed_count)}
              {edition.creator_airdrop_edition.edition_size > 0
                ? `/${edition.creator_airdrop_edition.edition_size}`
                : ""}
            </Text>
          </>
        }
        {...rest}
      >
        <Text tw="w-[28px] text-center text-xs font-semibold text-[#E40000]">
          Sold Out
        </Text>
      </FeedSocialButton>
    );
  }
  if (status === ClaimStatus.Expired) {
    return (
      <FeedSocialButton
        text={
          <>
            <Text
              tw={[
                "text-center text-xs font-semibold text-gray-900 dark:text-white",
              ]}
              onPress={viewCollecters}
            >
              {formatClaimNumber(edition.total_claimed_count)}
              {edition.creator_airdrop_edition.edition_size > 0
                ? `/${edition.creator_airdrop_edition.edition_size}`
                : ""}
            </Text>
          </>
        }
        {...rest}
      >
        <Text tw="text-xs font-semibold text-gray-600">Expired</Text>
      </FeedSocialButton>
    );
  }
  if (status === ClaimStatus.Claimed) {
    return (
      <FeedSocialButton
        text={
          <>
            <Text
              tw={[
                "text-center text-xs font-semibold text-gray-900 dark:text-white",
              ]}
              onPress={viewCollecters}
            >
              {formatClaimNumber(edition.total_claimed_count)}
              {edition.creator_airdrop_edition.edition_size > 0
                ? `/${edition.creator_airdrop_edition.edition_size}`
                : ""}
            </Text>
          </>
        }
        {...rest}
      >
        <View tw="-z-1 absolute h-full w-full overflow-hidden rounded-full bg-[#66D654]" />
        <Check2 height={18} width={18} color={"#000"} />
      </FeedSocialButton>
    );
  }

  return (
    <FeedSocialButton
      onPress={claimDrop}
      text={
        <>
          <Text
            tw={[
              "text-center text-xs font-semibold",
              edition.creator_airdrop_edition.edition_size -
                edition.total_claimed_count <=
                10 &&
              edition.creator_airdrop_edition.edition_size -
                edition.total_claimed_count >
                0
                ? "text-orange-500"
                : "text-gray-900 dark:text-white",
            ]}
            onPress={viewCollecters}
          >
            {formatClaimNumber(edition.total_claimed_count)}
            {edition.creator_airdrop_edition.edition_size > 0
              ? `/${edition.creator_airdrop_edition.edition_size}`
              : ""}
          </Text>
        </>
      }
      buttonColor={isDark ? "#fff" : colors.gray[900]}
      {...rest}
    >
      <View tw="absolute -right-1 -top-1 h-[22px] min-w-[24px] items-center justify-center rounded-full bg-white dark:bg-black">
        <Text tw="text-xs font-semibold text-black dark:text-white">$0</Text>
      </View>
      {/* <View tw="-z-1 absolute h-full w-full overflow-hidden rounded-full">
        <Image
          source={{
            uri: "https://media.showtime.xyz/assets/showtime-abstract.png",
          }}
          style={{ height: "100%", width: "100%" }}
        />
      </View> */}
      <Showtime height={25} width={25} color={isDark ? "#000" : "#fff"} />
    </FeedSocialButton>
  );
}
