import { useCallback } from "react";

import { axios } from "app/lib/axios";
import { useToast } from "design-system/toast";

type ReportNFT = {
  nftId?: string;
  activityId?: number;
  description?: string;
};

type ReportUser = {
  userId?: number;
  description?: string;
};

function useReport() {
  const toast = useToast();

  const reportNFT = useCallback(
    async ({
      nftId,
      activityId,
      description = "", // TODO: implement a modal to report with a description
    }: ReportNFT) => {
      await axios({
        url: `/v2/reportitem`,
        method: "POST",
        data: { nft_id: nftId, description, activity_id: activityId },
      });

      toast?.show({ message: "Reported!", hideAfter: 4000 });
    },
    [toast]
  );

  const reportUser = useCallback(
    async ({
      userId,
      description = "", // TODO: implement a modal to report with a description
    }: ReportUser) => {
      toast?.show({ message: "Reported!", hideAfter: 4000 });
    },
    [toast]
  );

  const blockUser = useCallback(
    async ({ userId }: ReportUser) => {
      toast?.show({ message: "Blocked!", hideAfter: 4000 });
    },
    [toast]
  );

  return {
    reportNFT,
    reportUser,
    blockUser,
  };
}

export { useReport };
