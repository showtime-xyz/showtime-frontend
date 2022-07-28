import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Gift } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";

import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useSocialColor } from "app/hooks/use-social-color";
import { NFT } from "app/types";
import { formatNumber } from "app/utilities";

export function GiftButton({ nft }: { nft: NFT }) {
  const router = useRouter();
  const { iconColor, textColors } = useSocialColor();
  const { data: edition } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
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
      {edition?.is_already_claimed ? (
        <Text tw="h-5 w-6 text-center text-xl">🎁</Text>
      ) : (
        <Gift height={20} width={20} color={iconColor} />
      )}

      {edition?.total_claimed_count > 0
        ? ` ${formatNumber(edition.total_claimed_count)}`
        : ""}
    </Button>
  );
}
