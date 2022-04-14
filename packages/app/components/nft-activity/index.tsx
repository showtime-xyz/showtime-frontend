import React from "react";

import useNFTActivities from "app/hooks/use-nft-activities";

import ActivityTable from "./activity-table";
import type { ActivitiesProps } from "./nft-activity.types";

export default function Activities({ nftId }: ActivitiesProps) {
  const { activities } = useNFTActivities({ nftId });

  return <ActivityTable data={activities} />;
}
