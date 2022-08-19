import { useMemo } from "react";
import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { GiftSolid, Gift } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";

import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useSocialColor } from "app/hooks/use-social-color";
import { NFT } from "app/types";

import { formatClaimNumber } from ".";

export function GiftButton({ nft }: { nft: NFT }) {
  const router = useRouter();
  const { iconColor, textColors } = useSocialColor();
  const { data: edition } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );

  const GiftIcon = useMemo(
    () => (edition?.is_already_claimed ? GiftSolid : Gift),
    [edition?.is_already_claimed]
  );

  if (!edition) return null;

  return (
    <Button
      variant="text"
      size="regular"
      tw="h-6 p-0"
      onPress={() => {
        const as = `/claimers/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}`;
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
                claimersModal: true,
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
      accentColor={textColors}
    >
      <GiftIcon height={24} width={24} color={iconColor} />
      {` ${formatClaimNumber(edition.total_claimed_count)}/${
        edition.creator_airdrop_edition.edition_size
      }`}
    </Button>
  );
}
