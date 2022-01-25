import { useCallback } from "react";

import { axios } from "app/lib/axios";
import { useToast } from "design-system/toast";

type Report = {
  nftId?: string;
  activityId?: number;
  description?: string;
};

function useReport() {
  const toast = useToast();

  const report = useCallback(
    async ({
      nftId,
      activityId,
      description = "", // TODO: implement a modal to report with a description
    }: Report) => {
      await axios({
        url: `/v2/reportitem`,
        method: "POST",
        data: { nft_id: nftId, description, activity_id: activityId },
      });

      toast?.show({ message: "Reported!", hideAfter: 4000 });
    },
    [toast]
  );

  return {
    report,
  };
}

export { useReport };
