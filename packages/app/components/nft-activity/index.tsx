import useNFTActivities from "app/hooks/use-nft-activities";
import { NFT } from "app/types";

import ActivityTable from "./activity-table";

export function Activities({ nft }: { nft?: NFT }) {
  const { activities } = useNFTActivities({
    nftId: nft?.nft_id,
  });

  return <ActivityTable data={activities} />;
}
