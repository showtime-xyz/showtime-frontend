import React from "react";

import useNFTActivities from "app/hooks/use-nft-activities";

import ActivityTable from "./activity-table";
import type { NFTActivitiesProps } from "./nft-activity.types";

export default function NFTActivities({ nftId }: NFTActivitiesProps) {
  const { nftActivities } = useNFTActivities({ nftId: 266535951 });

  return <ActivityTable data={nftActivities} />;
}
