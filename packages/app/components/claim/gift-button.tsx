import { useMemo } from "react";
import { Platform } from "react-native";

import { SocialButton } from "app/components/social-button";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useSocialColor } from "app/hooks/use-social-color";
import { NFT } from "app/types";
import { formatClaimNumber } from "app/utilities";

import { GiftSolid, Gift } from "design-system/icon";
import { useRouter } from "design-system/router";
import { Text } from "design-system/text";

export function GiftButton({ nft }: { nft: NFT }) {
  const router = useRouter();
  const { iconColor } = useSocialColor();
  const { data: edition } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );

  const GiftIcon = useMemo(
    () => (edition?.is_already_claimed ? GiftSolid : Gift),
    [edition?.is_already_claimed]
  );

  if (!edition) return null;

  return (
    <SocialButton
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
              "text-sm font-semibold",
              edition.creator_airdrop_edition.edition_size -
                edition.total_claimed_count <=
                10 &&
              edition.creator_airdrop_edition.edition_size -
                edition.total_claimed_count >
                0
                ? "text-orange-500"
                : "text-gray-900 dark:text-white dark:md:text-gray-400",
            ]}
          >
            {formatClaimNumber(edition.total_claimed_count)}
          </Text>
          {edition.creator_airdrop_edition.edition_size > 0
            ? `/${edition.creator_airdrop_edition.edition_size}`
            : ""}
        </>
      }
    >
      <GiftIcon height={24} width={24} color={iconColor} />
    </SocialButton>
  );
}
