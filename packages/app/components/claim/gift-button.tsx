import { Button } from "@showtime-xyz/universal.button";
import { Gift } from "@showtime-xyz/universal.icon";
import { tw } from "@showtime-xyz/universal.tailwind";

import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { NFT } from "app/types";
import { getRoundedCount } from "app/utilities";

export function GiftButton({ nft }: { nft: NFT }) {
  const { data: edition } = useCreatorCollectionDetail(
    nft?.creator_airdrop_edition_address
  );

  if (!edition) return null;

  return (
    <Button variant="text" size="regular" tw="h-auto p-0">
      <Gift
        height={20}
        width={20}
        // @ts-ignore
        color={tw.style("bg-gray-900 dark:bg-white").backgroundColor}
      />{" "}
      {edition?.total_claimed_count > 0
        ? getRoundedCount(edition.total_claimed_count)
        : ""}{" "}
    </Button>
  );
}
