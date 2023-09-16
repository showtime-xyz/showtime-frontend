import { useCallback } from "react";
import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Showtime, Check2 } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { StockText } from "@showtime-xyz/universal.stock-text";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { ClaimPaidNFTButton } from "app/components/claim/claim-paid-nft-button";
import { ClaimStatus, getClaimStatus } from "app/components/claim/claim-status";
import { FeedSocialButton } from "app/components/feed-social-button";
import { useClaimDrop } from "app/hooks/use-claim-drop";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useRedirectDropImageShareScreen } from "app/hooks/use-redirect-to-drop-image-share-screen";
import { NFT } from "app/types";
import { formatClaimNumber } from "app/utilities";

import { ButtonGoldLinearGradient } from "../gold-gradient";

export function ClaimButtonIconic({
  nft,
  textViewStyle,
  ...rest
}: {
  nft: NFT;
  tw?: string;
  textViewStyle?: ViewProps["style"];
}) {
  const router = useRouter();
  const isDark = useIsDarkMode();
  const { data: edition, loading } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );
  const status = getClaimStatus(edition);
  const redirectToDropImageShareScreen = useRedirectDropImageShareScreen();
  const { handleClaimNFT } = useClaimDrop(edition);

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
  const isPaidGated = edition?.gating_type === "paid_nft";

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
            <StockText
              onPress={viewCollecters}
              tw={[
                "text-center text-xs font-semibold text-gray-900 dark:text-white",
              ]}
            >
              {formatClaimNumber(edition.total_claimed_count)}
              {edition.creator_airdrop_edition.edition_size > 0
                ? `/${edition.creator_airdrop_edition.edition_size}`
                : ""}
            </StockText>
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
            <StockText
              onPress={viewCollecters}
              tw={[
                "text-center text-xs font-semibold text-gray-900 dark:text-white",
              ]}
            >
              {formatClaimNumber(edition.total_claimed_count)}
              {edition.creator_airdrop_edition.edition_size > 0
                ? `/${edition.creator_airdrop_edition.edition_size}`
                : ""}
            </StockText>
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
            <StockText
              onPress={viewCollecters}
              tw={[
                "text-center text-xs font-semibold text-gray-900 dark:text-white",
              ]}
            >
              {formatClaimNumber(edition.total_claimed_count)}
              {edition.creator_airdrop_edition.edition_size > 0
                ? `/${edition.creator_airdrop_edition.edition_size}`
                : ""}
            </StockText>
          </>
        }
        onPress={() =>
          redirectToDropImageShareScreen(
            edition?.creator_airdrop_edition?.contract_address
          )
        }
        {...rest}
      >
        {isPaidGated ? (
          <ButtonGoldLinearGradient
            style={{ transform: [{ rotate: "84deg" }] }}
          />
        ) : (
          <View tw="-z-1 absolute h-full w-full overflow-hidden rounded-full bg-[#66D654]" />
        )}
        <Check2 height={18} width={18} color={"#000"} />
      </FeedSocialButton>
    );
  }
  if (isPaidGated) {
    return (
      <View {...rest}>
        <ClaimPaidNFTButton
          edition={edition}
          style={Platform.select({
            android: {
              paddingRight: 16,
              paddingTop: 6,
            },
            default: undefined,
          })}
          type="feed"
          side="left"
        />
        <View tw="mt-2" style={textViewStyle}>
          <Pressable onPress={viewCollecters}>
            <Text
              tw={[
                "text-center text-xs font-semibold text-gray-900 dark:text-white",
              ]}
            >
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
              >
                {formatClaimNumber(edition.total_claimed_count)}
                {edition.creator_airdrop_edition.edition_size > 0
                  ? `/${edition.creator_airdrop_edition.edition_size}`
                  : ""}
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <FeedSocialButton
      onPress={() => handleClaimNFT()}
      text={
        <>
          <StockText
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
          </StockText>
        </>
      }
      buttonColor={isDark ? "#fff" : colors.gray[900]}
      {...rest}
    >
      <Showtime height={25} width={25} color={isDark ? "#000" : "#fff"} />
    </FeedSocialButton>
  );
}
