import { useMemo } from "react";
import { Platform } from "react-native";

import { GiftSolid, Gift } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { SocialButton } from "app/components/social-button";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useSocialColor } from "app/hooks/use-social-color";
import { NFT } from "app/types";
import { formatClaimNumber } from "app/utilities";

export function GiftButton({
  nft,
  vertical,
  ...rest
}: {
  nft: NFT;
  vertical?: boolean;
}) {
  const router = useRouter();
  const { iconColor } = useSocialColor();
  const { data: edition } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );

  const GiftIcon = useMemo(
    () => (edition?.is_already_claimed ? GiftSolid : Gift),
    [edition?.is_already_claimed]
  );

  if (!edition) {
    return (
      <SocialButton
        vertical={vertical}
        text={
          <>
            {/* This empty space is not a bug, its to prevent jumps*/}
            <Text tw={"text-xs font-medium"}>{" "}</Text>
          </>
        }
      >
        <GiftIcon height={24} width={24} color={iconColor} />
      </SocialButton>
    );
  }

  return (
    <SocialButton
      vertical={vertical}
      onPress={() => {
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
      }}
      text={
        <>
          <Text
            tw={[
              "text-xs font-semibold",
              edition.creator_airdrop_edition.edition_size -
                edition.total_claimed_count <=
                10 &&
              edition.creator_airdrop_edition.edition_size -
                edition.total_claimed_count >
                0
                ? "text-orange-500"
                : "text-white dark:text-white md:text-gray-900 dark:md:text-gray-400",
            ]}
          >
            {vertical ? "" : " "}
            {formatClaimNumber(edition.total_claimed_count)}
            {edition.creator_airdrop_edition.edition_size > 0
              ? `/${edition.creator_airdrop_edition.edition_size}`
              : ""}
          </Text>
        </>
      }
      {...rest}
    >
      <GiftIcon
        height={vertical ? 28 : 24}
        width={vertical ? 28 : 24}
        color={iconColor}
      />
    </SocialButton>
  );
}

export function GiftButtonVertical({
  nft,
  vertical,
  ...rest
}: {
  nft: NFT;
  vertical?: boolean;
}) {
  const router = useRouter();
  const { iconColor } = useSocialColor();
  const { data: edition } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );

  const GiftIcon = useMemo(
    () => (edition?.is_already_claimed ? GiftSolid : Gift),
    [edition?.is_already_claimed]
  );

  if (!edition) {
    return (
      <SocialButton
        vertical={vertical}
        text={
          <>
            {/* This empty space is not a bug, its to prevent jumps*/}
            <Text tw={"text-xs font-medium"}>{" "}</Text>
          </>
        }
      >
        <GiftIcon height={32} width={32} color={iconColor} />
      </SocialButton>
    );
  }

  const textString =
    (vertical ? "" : " ") +
    formatClaimNumber(edition.total_claimed_count) +
    (edition.creator_airdrop_edition.edition_size > 0
      ? `/${edition.creator_airdrop_edition.edition_size}`
      : "");

  // Dynamic font size
  const fontSize = Math.max(
    10,
    12 - (12 - 8) * Math.pow(Math.max(0, textString.length - 5) / 3, 1.5)
  ).toString();

  return (
    <SocialButton
      vertical={vertical}
      onPress={() => {
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
      }}
      {...rest}
    >
      <View tw="relative mb-2 items-center text-center">
        <GiftIcon height={32} width={32} color={iconColor} />
        <View tw="absolute mb-4 mt-6 w-20 items-center justify-center">
          <Text
            tw={[
              "pt-2.5",
              `text-[${fontSize}px]`,
              "font-semibold",
              edition.creator_airdrop_edition.edition_size -
                edition.total_claimed_count <=
                10 &&
              edition.creator_airdrop_edition.edition_size -
                edition.total_claimed_count >
                0
                ? "text-orange-500"
                : "text-white dark:text-white md:text-gray-900 dark:md:text-gray-400",
            ]}
          >
            {textString}
          </Text>
        </View>
      </View>
    </SocialButton>
  );
}
