import { Button } from "@showtime-xyz/universal.button";
import { Gift } from "@showtime-xyz/universal.icon";

import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useSocialColor } from "app/hooks/use-social-color";
import { NFT } from "app/types";
import { formatNumber } from "app/utilities";

export function GiftButton({ nft }: { nft: NFT }) {
  const { iconColor, textColors } = useSocialColor();

  const { data: edition } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );

  if (!edition) return null;

  return (
    <Button variant="text" size="regular" tw="h-6 p-0" accentColor={textColors}>
      <Gift height={20} width={20} color={iconColor} />
      {edition?.total_claimed_count > 0
        ? ` ${formatNumber(edition.total_claimed_count)}`
        : ""}
    </Button>
  );
}
